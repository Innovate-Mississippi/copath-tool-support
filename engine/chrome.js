// Render orchestrator. Reads engine state and writes the DOM.
// Classic-GUI surfaces: title bar, regions panel, evidence meters,
// surfaced-content panel, contradiction flags, trace sidebar, mode picker.

import { regionsTouched, hasFlag } from "./state.js";

const SCORE_LABELS = {
  customers_will_pay: "Customers will pay",
  we_can_reach_them: "We can reach them",
  they_will_keep_paying: "They'll keep paying",
  we_can_build_it: "We can build it",
};

export function render(state, derived) {
  renderHeader(state);
  renderMeters(state.scores);
  renderRegions(state, derived.regionQuestions);
  renderActiveRegion(state, derived);
  renderTrace(derived.lastSurfaces);
  renderContradictions(derived.contradictions);
}

function renderHeader(state) {
  const el = document.getElementById("mode-indicator");
  if (el) el.textContent = modeLabel(state.mode);
  const idea = document.getElementById("idea-line");
  if (idea) idea.textContent = state.orienting?.idea_one_liner || "(idea not yet stated)";
}

function modeLabel(mode) {
  return { "first-run": "First Run — to $100K", "second-lap": "Second Lap — to $1M", "open-market": "Open Market — no holds barred" }[mode] || mode;
}

function renderMeters(scores) {
  const container = document.getElementById("meters");
  if (!container) return;
  container.innerHTML = "";
  for (const [k, label] of Object.entries(SCORE_LABELS)) {
    const v = scores?.[k] ?? 0;
    const row = document.createElement("div");
    row.className = "meter-row";
    row.innerHTML = `
      <div class="meter-label">${label}</div>
      <div class="meter-bar"><div class="meter-fill" style="width:${v * 10}%"></div></div>
      <div class="meter-value">${v.toFixed(1)}</div>`;
    container.appendChild(row);
  }
}

function renderRegions(state, regionQuestions) {
  const container = document.getElementById("regions");
  if (!container) return;
  const touched = new Set(regionsTouched(state));
  container.innerHTML = "";
  for (const region of regionQuestions || []) {
    const btn = document.createElement("button");
    btn.className = "region-tab" + (state.activeRegion === region.region_id ? " active" : "") + (touched.has(region.region_id) ? " touched" : " untouched");
    btn.textContent = region.label;
    btn.dataset.region = region.region_id;
    container.appendChild(btn);
  }
}

function renderActiveRegion(state, derived) {
  const container = document.getElementById("active-region");
  if (!container) return;
  const region = (derived.regionQuestions || []).find((r) => r.region_id === state.activeRegion);
  if (!region) {
    container.innerHTML = `<div class="empty-state">Pick a region above to begin. Order doesn't matter — go where your evidence is weakest, or where your curiosity pulls you.</div>`;
    return;
  }
  container.innerHTML = `<h3 class="region-title">${region.label}</h3><p class="region-intent">${region.intent || ""}</p>`;
  for (const q of region.questions) {
    const ans = state.answers[`${region.region_id}.${q.id}`];
    const block = document.createElement("div");
    block.className = "question-block";
    block.dataset.region = region.region_id;
    block.dataset.question = q.id;
    block.innerHTML = `
      <div class="question-prompt">${q.prompt}</div>
      ${renderAnswerControl(q, ans)}
      <div class="question-confidence">
        <label>Confidence:
          <select class="confidence-select">
            <option value="lived" ${ans?.confidence === "lived" ? "selected" : ""}>Lived (real behavior)</option>
            <option value="evidenced" ${ans?.confidence === "evidenced" ? "selected" : ""}>Evidenced (documented)</option>
            <option value="stated" ${ans?.confidence === "stated" ? "selected" : ""}>Stated (asserted)</option>
            <option value="hypothesis" ${ans?.confidence === "hypothesis" ? "selected" : ""}>Hypothesis (guess)</option>
            <option value="unknown" ${ans?.confidence === "unknown" ? "selected" : ""}>I don't know yet</option>
          </select>
        </label>
      </div>
      <div class="question-notes"><textarea placeholder="Notes (optional)" class="notes-input">${ans?.notes || ""}</textarea></div>`;
    container.appendChild(block);
  }
  const surfaceArea = document.createElement("div");
  surfaceArea.id = "surfaces";
  surfaceArea.className = "surfaces";
  for (const s of derived.activeSurfaces || []) {
    const card = document.createElement("div");
    card.className = `surface surface-${s.shape}`;
    card.innerHTML = `<div class="surface-shape">${shapeLabel(s.shape)}</div><div class="surface-text">${s.text}</div>`;
    surfaceArea.appendChild(card);
  }
  container.appendChild(surfaceArea);
}

function renderAnswerControl(q, ans) {
  const v = ans?.value ?? "";
  if (q.type === "yes_no" || q.type === "yes_no_evidence") {
    return `<div class="answer-control">
      <label><input type="radio" name="ans-${q.id}" value="yes" ${v === "yes" ? "checked" : ""}/> Yes</label>
      <label><input type="radio" name="ans-${q.id}" value="partial" ${v === "partial" ? "checked" : ""}/> Partially</label>
      <label><input type="radio" name="ans-${q.id}" value="no" ${v === "no" ? "checked" : ""}/> Not yet</label>
    </div>`;
  }
  if (q.type === "scale") {
    return `<div class="answer-control"><input type="range" min="0" max="10" value="${v || 0}" class="scale-input"/> <span class="scale-display">${v || 0}</span></div>`;
  }
  return `<div class="answer-control"><input type="text" value="${escapeHtml(String(v))}" class="text-input" placeholder="Type your answer..."/></div>`;
}

function shapeLabel(shape) {
  return { question: "QUESTION", case_paired: "CASE", next_step_paired: "NEXT STEP", reframe: "REFRAME" }[shape] || shape.toUpperCase();
}

function renderTrace(surfaces) {
  const container = document.getElementById("trace");
  if (!container) return;
  if (!surfaces || surfaces.length === 0) {
    container.innerHTML = `<div class="trace-empty">Trace is empty. As you answer questions, the engine's reasoning shows here.</div>`;
    return;
  }
  container.innerHTML = surfaces.map((s) => `
    <div class="trace-entry">
      <div class="trace-rule">rule: <code>${s.rule_id}</code></div>
      <div class="trace-trigger">because: <code>${s.triggered_by}</code></div>
      <div class="trace-source">→ table: <code>${s.table_id || "(template-only)"}</code> row: <code>${s.row_id || "—"}</code></div>
    </div>`).join("");
}

function renderContradictions(contradictions) {
  const container = document.getElementById("contradictions");
  if (!container) return;
  if (!contradictions || contradictions.length === 0) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = contradictions.map((c) => `<div class="contradiction"><strong>Worth reconciling:</strong> ${c.message}</div>`).join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
