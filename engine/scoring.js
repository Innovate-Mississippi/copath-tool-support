// Evidence-strength scoring: derive 0-10 scores per claim category from answers.
// Confidence levels weight raw answers differently:
//   "lived"     — first-hand experience or real customer behavior (full weight)
//   "evidenced" — documented external evidence (90%)
//   "stated"    — founder asserted but not yet evidenced (40%)
//   "hypothesis"— founder's guess (15%)
//   "unknown"   — explicit don't-know (0%)

const CONFIDENCE_WEIGHT = {
  lived: 1.0,
  evidenced: 0.9,
  stated: 0.4,
  hypothesis: 0.15,
  unknown: 0,
};

export function computeScores(state, regionQuestions, tuning) {
  const scoreInputs = {
    customers_will_pay: [],
    we_can_reach_them: [],
    they_will_keep_paying: [],
    we_can_build_it: [],
  };

  for (const region of regionQuestions) {
    for (const q of region.questions) {
      const ans = state.answers[`${region.region_id}.${q.id}`];
      if (!q.contributes_to_score || !ans) continue;
      const w = CONFIDENCE_WEIGHT[ans.confidence] ?? 0;
      const raw = answerToNumeric(ans.value, q.type);
      scoreInputs[q.contributes_to_score].push({ raw, weight: w * (q.score_weight || 1) });
    }
  }

  const scores = {};
  for (const [k, inputs] of Object.entries(scoreInputs)) {
    if (inputs.length === 0) { scores[k] = 0; continue; }
    const numerator = inputs.reduce((s, i) => s + i.raw * i.weight, 0);
    const denominator = inputs.reduce((s, i) => s + i.weight, 0) || 1;
    const raw = (numerator / denominator) * 10;
    scores[k] = applyModeAdjustment(raw, tuning);
  }
  state.scores = scores;
  return scores;
}

function answerToNumeric(value, type) {
  if (type === "yes_no" || type === "yes_no_evidence") {
    return value === "yes" ? 1 : value === "partial" ? 0.5 : 0;
  }
  if (type === "scale") return Math.max(0, Math.min(1, Number(value) / 10));
  if (type === "named_list") return Array.isArray(value) && value.length > 0 ? Math.min(1, value.length / 5) : 0;
  if (type === "text") return value && value.length > 30 ? 0.6 : value ? 0.3 : 0;
  return 0;
}

function applyModeAdjustment(raw, tuning) {
  const harshness = tuning?.score_harshness ?? 1.0;
  const adjusted = raw * (2 - harshness);
  return Math.max(0, Math.min(10, Math.round(adjusted * 10) / 10));
}

export function detectContradictions(state, regionQuestions, contradictionRules) {
  const flagged = [];
  for (const rule of contradictionRules || []) {
    const a = state.answers[rule.between[0]];
    const b = state.answers[rule.between[1]];
    if (!a || !b) continue;
    if (rule.condition === "yes_then_no" && a.value === "yes" && b.value === "no") {
      flagged.push({ rule_id: rule.id, message: rule.message, fields: rule.between });
    }
    if (rule.condition === "score_drop" && Number(a.value) - Number(b.value) > (rule.threshold || 3)) {
      flagged.push({ rule_id: rule.id, message: rule.message, fields: rule.between });
    }
  }
  return flagged;
}
