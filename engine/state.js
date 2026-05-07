// World state — the entire session in one serializable object.
// Every field that's not here, the engine cannot react to.

export const SCHEMA_VERSION = "0.1";

export function initialState(mode) {
  const now = new Date().toISOString();
  return {
    schema_version: SCHEMA_VERSION,
    mode,
    created_at: now,
    updated_at: now,
    orienting: {
      industry_archetype: null,
      stage: null,
      idea_one_liner: null,
      out_of_scope: false,
      out_of_scope_acknowledged: false,
    },
    answers: {},
    scores: {
      customers_will_pay: 0,
      we_can_reach_them: 0,
      they_will_keep_paying: 0,
      we_can_build_it: 0,
    },
    flags: {},
    history: [],
    surfaced: [],
  };
}

export function setAnswer(state, regionId, questionId, value, confidence = "stated", notes = "") {
  const key = `${regionId}.${questionId}`;
  state.answers[key] = {
    value,
    confidence,
    notes,
    last_updated: new Date().toISOString(),
  };
  state.updated_at = state.answers[key].last_updated;
  recordHistory(state, "answer_set", { key, value, confidence });
  return state;
}

export function getAnswer(state, regionId, questionId) {
  return state.answers[`${regionId}.${questionId}`] || null;
}

export function setFlag(state, name, value = true) {
  state.flags[name] = value;
  state.updated_at = new Date().toISOString();
  recordHistory(state, "flag_set", { name, value });
  return state;
}

export function hasFlag(state, name) {
  return Boolean(state.flags[name]);
}

export function recordHistory(state, type, payload) {
  state.history.push({ ts: new Date().toISOString(), type, payload });
  if (state.history.length > 500) state.history.shift();
}

export function recordSurfaced(state, tableId, rowId) {
  state.surfaced.push({ table_id: tableId, row_id: rowId, ts: new Date().toISOString() });
  if (state.surfaced.length > 500) state.surfaced.shift();
}

export function timesShown(state, tableId, rowId) {
  return state.surfaced.filter((s) => s.table_id === tableId && s.row_id === rowId).length;
}

export function regionsTouched(state) {
  const regions = new Set();
  for (const key of Object.keys(state.answers)) regions.add(key.split(".")[0]);
  return [...regions];
}
