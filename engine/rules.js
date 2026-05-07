// Rule evaluator. A rule looks like:
//   {
//     id: "string",
//     when: { all: [...conditions] }  OR  { any: [...] },
//     then: { surface: { table, shape_preference, slot_map }, set_flag, weight }
//   }
// Conditions evaluate against the current world state and the most recent
// derived scores. The evaluator returns matching rules ordered by weight.

import { hasFlag, getAnswer, regionsTouched } from "./state.js";

export function evaluateRules(state, rules, scores) {
  const matches = [];
  for (const rule of rules) {
    if (matchesCondition(rule.when, state, scores)) {
      matches.push(rule);
    }
  }
  return matches.sort((a, b) => (b.then?.weight || 1) - (a.then?.weight || 1));
}

function matchesCondition(cond, state, scores) {
  if (!cond) return true;
  if (cond.all) return cond.all.every((c) => matchesCondition(c, state, scores));
  if (cond.any) return cond.any.some((c) => matchesCondition(c, state, scores));
  if (cond.not) return !matchesCondition(cond.not, state, scores);

  if (cond.flag != null) {
    const has = hasFlag(state, cond.flag);
    return cond.equals != null ? has === cond.equals : has;
  }
  if (cond.score != null) {
    const v = scores?.[cond.score] ?? 0;
    if (cond.lt != null) return v < cond.lt;
    if (cond.gt != null) return v > cond.gt;
    if (cond.lte != null) return v <= cond.lte;
    if (cond.gte != null) return v >= cond.gte;
    if (cond.eq != null) return v === cond.eq;
  }
  if (cond.answered != null) {
    const [region, q] = cond.answered.split(".");
    const a = getAnswer(state, region, q);
    if (cond.equals != null) return a && a.value === cond.equals;
    return Boolean(a);
  }
  if (cond.region_touched != null) {
    return regionsTouched(state).includes(cond.region_touched);
  }
  if (cond.region_untouched != null) {
    return !regionsTouched(state).includes(cond.region_untouched);
  }
  if (cond.industry_archetype != null) {
    if (Array.isArray(cond.industry_archetype)) {
      return cond.industry_archetype.includes(state.orienting?.industry_archetype);
    }
    return state.orienting?.industry_archetype === cond.industry_archetype;
  }
  if (cond.mode != null) {
    return state.mode === cond.mode;
  }
  if (cond.stage != null) {
    if (Array.isArray(cond.stage)) return cond.stage.includes(state.orienting?.stage);
    return state.orienting?.stage === cond.stage;
  }
  if (cond.always === true) return true;
  return false;
}

// Trace info for the visible-mechanics chrome (Disco Elysium move).
export function explainMatch(rule, state, scores) {
  return {
    rule_id: rule.id,
    triggered_by: describeTrigger(rule.when, state, scores),
  };
}

function describeTrigger(cond, state, scores) {
  if (!cond) return "always";
  if (cond.all) return cond.all.map((c) => describeTrigger(c, state, scores)).join(" AND ");
  if (cond.any) return cond.any.map((c) => describeTrigger(c, state, scores)).join(" OR ");
  if (cond.not) return `NOT (${describeTrigger(cond.not, state, scores)})`;
  if (cond.flag) return `flag:${cond.flag}=${hasFlag(state, cond.flag)}`;
  if (cond.score) return `score:${cond.score}=${scores?.[cond.score] ?? 0}`;
  if (cond.answered) return `answered:${cond.answered}`;
  if (cond.region_touched) return `region_touched:${cond.region_touched}`;
  if (cond.region_untouched) return `region_untouched:${cond.region_untouched}`;
  if (cond.industry_archetype) return `industry:${cond.industry_archetype}`;
  if (cond.mode) return `mode:${cond.mode}`;
  if (cond.stage) return `stage:${Array.isArray(cond.stage) ? cond.stage.join("|") : cond.stage}`;
  return "?";
}
