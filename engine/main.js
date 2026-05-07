// Boot. Wires tables, state, rules, scoring, templates, persistence, chrome.

import { initialState, setAnswer, setFlag, hasFlag, recordSurfaced } from "./state.js";
import { loadAllTables, loadTuning, pickRow } from "./tables.js";
import { evaluateRules, explainMatch } from "./rules.js";
import { computeScores, detectContradictions } from "./scoring.js";
import { fill, pickTemplate } from "./templates.js";
import { downloadStateFile, uploadStateFile } from "./persistence.js";
import { render } from "./chrome.js";

const app = {
  state: null,
  tables: null,
  tuning: null,
  derived: { regionQuestions: [], activeSurfaces: [], lastSurfaces: [], contradictions: [] },
};

window.addEventListener("DOMContentLoaded", boot);

async function boot() {
  app.tables = await loadAllTables();
  await pickModeAndStart();
  wireGlobalHandlers();
}

async function pickModeAndStart() {
  const m = document.getElementById("mode-picker");
  if (!m) return;
  m.style.display = "flex";
  m.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const mode = btn.dataset.mode;
      app.state = initialState(mode);
      app.tuning = await loadTuning(mode);
      m.style.display = "none";
      enterOrienting();
    });
  });
  document.getElementById("load-saved-btn")?.addEventListener("click", () => {
    document.getElementById("file-input").click();
  });
}

function enterOrienting() {
  const o = document.getElementById("orienting");
  if (!o) { enterMain(); return; }
  o.style.display = "block";
  o.innerHTML = renderOrientingForm(app.tables.orienting_questions);
  o.querySelector("#orienting-submit")?.addEventListener("click", submitOrienting);
}

function renderOrientingForm(orienting) {
  const qs = (orienting?.questions || []).map((q) => `
    <div class="orient-q">
      <label>${q.prompt}</label>
      ${q.type === "select"
        ? `<select data-orient="${q.id}"><option value="">—</option>${q.options.map((o) => `<option value="${o.value}">${o.label}</option>`).join("")}</select>`
        : `<input type="text" data-orient="${q.id}" placeholder="${q.placeholder || ""}"/>`}
    </div>`).join("");
  return `<h2>Before we begin</h2>
    <p class="orient-intent">${orienting?.intent || ""}</p>
    ${qs}
    <button id="orienting-submit" class="btn-primary">Continue</button>`;
}

function submitOrienting() {
  const o = document.getElementById("orienting");
  o.querySelectorAll("[data-orient]").forEach((el) => {
    app.state.orienting[el.dataset.orient] = el.value || null;
  });
  if (isOutOfScope()) {
    showOutOfScopeRouting();
    return;
  }
  o.style.display = "none";
  enterMain();
}

function isOutOfScope() {
  const venture = app.state.orienting.venture_type;
  if (!venture) return false;
  const oosTypes = (app.tables.out_of_scope_routing?.out_of_scope_types || []);
  return oosTypes.includes(venture);
}

function showOutOfScopeRouting() {
  const r = app.tables.out_of_scope_routing;
  const o = document.getElementById("orienting");
  o.innerHTML = `<div class="oos-routing">
    <h2>${r.heading}</h2>
    <p>${r.body}</p>
    <ul>${r.referrals.map((ref) => `<li><strong>${ref.name}:</strong> ${ref.note}</li>`).join("")}</ul>
    <div class="oos-actions">
      <button class="btn-primary" id="oos-acknowledge">I understand — close the tool</button>
      <button class="btn-secondary" id="oos-override">I disagree, continue anyway</button>
    </div>
  </div>`;
  document.getElementById("oos-override").addEventListener("click", () => {
    app.state.orienting.out_of_scope_acknowledged = true;
    o.style.display = "none";
    enterMain();
  });
}

function enterMain() {
  const main = document.getElementById("main");
  if (main) main.style.display = "grid";
  app.derived.regionQuestions = app.tables.region_questions?.regions || [];
  app.state.activeRegion = app.derived.regionQuestions[0]?.region_id || null;
  recompute();
  render(app.state, app.derived);
  wireMainHandlers();
}

function recompute() {
  const scores = computeScores(app.state, app.derived.regionQuestions, app.tuning);
  app.derived.contradictions = detectContradictions(app.state, app.derived.regionQuestions, app.tables.rules?.contradictions || []);
  const matches = evaluateRules(app.state, app.tables.rules?.rules || [], scores);
  const surfaces = [];
  for (const rule of matches.slice(0, 3)) {
    const s = surfaceFromRule(rule, scores);
    if (s) surfaces.push(s);
  }
  app.derived.activeSurfaces = surfaces.filter((s) => !s.region_specific || s.region_specific === app.state.activeRegion);
  app.derived.lastSurfaces = surfaces;
}

function surfaceFromRule(rule, scores) {
  const action = rule.then?.surface;
  if (!action) return null;
  const explanation = explainMatch(rule, app.state, scores);
  let row = null;
  if (action.table) {
    const tableData = app.tables[action.table];
    const arr = Array.isArray(tableData) ? tableData : (tableData?.rows || []);
    const relevanceFn = buildRelevanceFn(action.table, action, scores);
    row = pickRow(app.state, action.table, arr, relevanceFn, app.tuning?.novelty_multiplier ?? 1);
    if (row) recordSurfaced(app.state, action.table, row.row_id);
  }
  const template = pickTemplate(app.tables.templates?.templates || [], action.shape_preference || "question");
  if (!template) return null;
  const slots = { row: row?.row || {}, state: app.state, scores };
  const text = fill(template.text, slots);
  return { ...explanation, text, shape: template.shape, table_id: row?.table_id, row_id: row?.row_id, region_specific: action.region_specific || null };
}

function buildRelevanceFn(tableId, action, scores) {
  if (tableId === "industry_archetypes") {
    const target = app.state.orienting?.industry_archetype;
    if (target && target !== "other") return (r) => r.id === target ? 10 : 0;
    return () => 1;
  }
  if (tableId === "anti_patterns") {
    const floor = app.tuning?.anti_pattern_severity_floor ?? 0;
    const lowestScore = Object.entries(scores).sort((a, b) => a[1] - b[1])[0]?.[0];
    return (r) => {
      if ((r.severity_weight ?? 0) < floor) return 0;
      let score = 1;
      if (lowestScore && Array.isArray(r.scores_affected) && r.scores_affected.includes(lowestScore)) score += 3;
      if (action.shape_preference && r.shape === action.shape_preference) score += 1;
      return score;
    };
  }
  if (tableId === "discovery_questions") {
    const region = action.region_specific || app.state.activeRegion;
    return (r) => {
      let score = 1;
      const spec = r.industry_specificity;
      if (spec === "universal") score += 1;
      const archetype = app.state.orienting?.industry_archetype;
      if (Array.isArray(spec) && archetype && spec.some((s) => s.toLowerCase().includes(archetype.replace("ia_", "")))) score += 4;
      if (region && r.when_to_ask && r.when_to_ask.toLowerCase().includes(region)) score += 2;
      return score;
    };
  }
  return () => 1;
}

function wireGlobalHandlers() {
  document.getElementById("save-btn")?.addEventListener("click", () => downloadStateFile(app.state));
  document.getElementById("load-btn")?.addEventListener("click", () => document.getElementById("file-input").click());
  document.getElementById("file-input")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      app.state = await uploadStateFile(file);
      app.tuning = await loadTuning(app.state.mode);
      document.getElementById("mode-picker").style.display = "none";
      document.getElementById("orienting").style.display = "none";
      enterMain();
    } catch (err) {
      alert("Could not load that file: " + err.message);
    }
  });
  document.getElementById("brief-btn")?.addEventListener("click", () => {
    sessionStorage.setItem("copath-brief-state", JSON.stringify(app.state));
    sessionStorage.setItem("copath-brief-derived", JSON.stringify({ scores: app.state.scores, regions: app.derived.regionQuestions }));
    window.open("brief/brief.html", "_blank");
  });
}

function wireMainHandlers() {
  document.body.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-region]");
    if (tab && tab.classList.contains("region-tab")) {
      app.state.activeRegion = tab.dataset.region;
      recompute();
      render(app.state, app.derived);
    }
  });
  document.body.addEventListener("change", (e) => {
    const block = e.target.closest("[data-question]");
    if (!block) return;
    const region = block.dataset.region;
    const qid = block.dataset.question;
    const ans = app.state.answers[`${region}.${qid}`] || {};
    if (e.target.matches('input[type="radio"]')) ans.value = e.target.value;
    if (e.target.matches('input[type="text"], input[type="range"]')) ans.value = e.target.value;
    if (e.target.matches(".confidence-select")) ans.confidence = e.target.value;
    if (e.target.matches(".notes-input")) ans.notes = e.target.value;
    setAnswer(app.state, region, qid, ans.value, ans.confidence || "stated", ans.notes || "");
    if (!hasFlag(app.state, "any_answer_given")) setFlag(app.state, "any_answer_given");
    recompute();
    render(app.state, app.derived);
  });
}
