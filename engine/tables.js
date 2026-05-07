// Load content tables and pick rows weighted by relevance + novelty.
// Novelty bias: rows the user has already seen are downweighted so the
// tool surfaces variety on return visits — the same trick that keeps
// random encounter tables from feeling repetitive.

import { timesShown } from "./state.js";

const TABLE_PATHS = {
  industry_archetypes: "data/industry-archetypes.json",
  discovery_questions: "data/discovery-questions.json",
  anti_patterns: "data/anti-patterns.json",
  region_questions: "data/region-questions.json",
  rules: "data/rules.json",
  templates: "data/templates.json",
  orienting_questions: "data/orienting-questions.json",
  out_of_scope_routing: "data/out-of-scope-routing.json",
};

export async function loadAllTables() {
  const tables = {};
  await Promise.all(Object.entries(TABLE_PATHS).map(async ([key, path]) => {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
    tables[key] = await r.json();
  }));
  return tables;
}

export async function loadTuning(mode) {
  const r = await fetch(`config/tuning.${mode}.json`);
  if (!r.ok) throw new Error(`Failed to load tuning for mode ${mode}`);
  return r.json();
}

// Pick a row from a table, weighted by:
//  - relevance: caller-supplied per-row score (default 1)
//  - novelty: 1 / (1 + times_shown) so unseen rows are favored
// Returns { row, weight, table_id, row_id } or null if table is empty.
export function pickRow(state, tableId, table, relevanceFn = () => 1, noveltyMultiplier = 1) {
  if (!table || table.length === 0) return null;
  const weighted = table.map((row, idx) => {
    const rowId = row.id || row.archetype_name || row.pattern_name || row.question_text || `row_${idx}`;
    const seen = timesShown(state, tableId, rowId);
    const novelty = 1 / (1 + seen * noveltyMultiplier);
    const relevance = Math.max(0, relevanceFn(row));
    return { row, rowId, weight: relevance * novelty };
  }).filter((w) => w.weight > 0);

  if (weighted.length === 0) return null;
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return { row: w.row, weight: w.weight, table_id: tableId, row_id: w.rowId };
  }
  const last = weighted[weighted.length - 1];
  return { row: last.row, weight: last.weight, table_id: tableId, row_id: last.rowId };
}
