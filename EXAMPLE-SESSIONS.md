# Example Sessions — v0.1

> Three walkthroughs showing how the engine plays out for different
> founder profiles. These are *predicted* sessions based on the rules,
> templates, and tuning currently in place — the actual surfaces will
> vary because of novelty weighting and random row selection within
> matching subsets. The point is to show the *kind* of variation the
> engine produces.

---

## Session A — Sarah, healthtech founder, Second Lap mode

**Profile:**
- venture_type: high-tech-saas
- stage: early-traction (one health-system contract, ~$80K ARR)
- industry_archetype: ia_healthtech
- idea_one_liner: "Software that helps mid-sized hospitals predict 30-day readmissions for cardiac patients."

**What the engine does on entry to the Evidence region:**

Active rules: `rule_dq_universal_baseline`, `rule_industry_dq_when_archetype_set`,
`rule_industry_evidence_bar` (just-added in v0.1.1), `rule_evidence_when_evidence_region_active`,
`rule_early_traction_concentration_check`.

Top-3 surfaces (by weight, after relevance + novelty):

1. **(case_paired, weight 8 from `rule_industry_evidence_bar`)** — "For Healthtech (clinical SaaS / RPM), the bar for PMF is concrete. Three signals to watch for:" + the three concrete signals from `evidence_demands_at_pmf` for healthtech (signed CMIO/CFO contract, CPT/HCPCS pathway, peer-reviewed evidence).
2. **(question, weight 8 from `rule_industry_dq_when_archetype_set`)** — "Industry-specific question worth sitting with: *Which CPT code or value-based contract line does this tool move, and can I see the spreadsheet your CFO would build to justify renewal in year two?*"
3. **(case_paired, weight 7 from `rule_early_traction_concentration_check`)** — Single-Customer Fit anti-pattern with the Glew.io / Nevada Sanchez case study. The reframe: "What you're describing as your first customer is often actually your first paid pilot — which is great, and a different thing from a market."

**Why this is the right set:** Sarah's stage (early-traction) + score
(she has one paying customer so customers_will_pay >= 4) triggers the
concentration-check rule. Her industry surfaces healthtech-specific
evidence demands. Her active region (evidence) primes discovery questions.

**What she sees in the trace sidebar:**
```
rule: rule_industry_evidence_bar
because: answered:orienting.industry_archetype AND NOT industry:other AND region_touched:evidence
→ table: industry_archetypes  row: ia_healthtech

rule: rule_industry_dq_when_archetype_set
because: answered:orienting.industry_archetype AND NOT industry:other
→ table: industry_archetypes  row: ia_healthtech

rule: rule_early_traction_concentration_check
because: stage:early-traction AND score:customers_will_pay=5.2 (>= 4)
→ table: anti_patterns  row: ap_single_customer_fit
```

She can see the reasoning, which is the teaching mechanism.

---

## Session B — Marcus, AI-infra founder, Open Market mode

**Profile:**
- venture_type: high-tech-saas
- stage: pre-product (no MVP, no customers)
- industry_archetype: ia_ai_infra
- idea_one_liner: "An LLM-powered observability platform for production AI workloads."

**Tuning:** Open Market mode → score_harshness 1.4, max_surfaces 4,
anti_pattern_severity_floor 0.3, contradiction_sensitivity 1.5.

**What the engine does on entry to the Customer region:**

Active rules: `rule_industry_dq_when_archetype_set`, `rule_dq_universal_baseline`,
`rule_industry_self_deception_after_3_answers` (after his first three answers),
`rule_open_market_extra_pressure`, `rule_pre_product_validation_focus` (new in v0.1.1),
`rule_anti_pattern_low_customers_will_pay` (because pre-product → low scores).

Top-4 surfaces:

1. **(question, weight 8 from `rule_pre_product_validation_focus`)** —
   AI-for-X Without JTBD anti-pattern surfaced as bare reframe: "What
   you're describing as 'AI for X' is often actually a capability looking
   for a job. Worth pressure-testing by writing the customer's purchase
   justification email to their boss in their voice..."
2. **(question, weight 8 from `rule_industry_dq_when_archetype_set`)** —
   "If OpenAI or Anthropic shipped your exact feature in their next
   quarterly release, what would your customer do on Monday morning — and
   have you actually asked them that question out loud?"
3. **(reframe, weight 7 from `rule_open_market_extra_pressure`)** —
   Validation Theater anti-pattern: "Most of the evidence here comes from
   people who like you or were asked leading questions. What's one
   conversation this week with someone who has no reason to be polite?"
4. **(next_step_paired, weight 9 from `rule_anti_pattern_low_customers_will_pay`)** —
   Hypothetical Pricing reframe: "Founders in this space tend to discover
   real pricing 30-50% off their first instinct..."

**Why this is the right set:** Marcus is in Open Market mode, pre-product,
ai_infra archetype with a pitch leading on technology. The engine
correctly piles on: industry-specific JTBD pressure, validation
discipline, hypothetical pricing warning. All four surfaces because
Open Market raises max_surfaces to 4.

**Values-rule check:** Each surface follows one of the four allowed
shapes. None says "your idea is bad" or "you shouldn't be doing this."
Each is paired with a concrete next step or a thought experiment. Open
Market is harder, not crueler — exactly per SPEC §14.

**What Marcus' trace sidebar shows:**
```
rule: rule_anti_pattern_low_customers_will_pay
because: score:customers_will_pay=1.8 < 4 AND flag:any_answer_given=true
→ table: anti_patterns  row: ap_hypothetical_pricing

rule: rule_industry_dq_when_archetype_set
because: answered:orienting.industry_archetype AND NOT industry:ia_ai_infra
→ table: industry_archetypes  row: ia_ai_infra

rule: rule_open_market_extra_pressure
because: mode:open-market AND flag:any_answer_given=true
→ table: anti_patterns  row: ap_validation_theater

rule: rule_pre_product_validation_focus
because: stage:pre-product AND flag:any_answer_given=true
→ table: anti_patterns  row: ap_ai_for_x_no_jtbd
```

---

## Session C — Lena, ag-tech founder, First Run mode

**Profile:**
- venture_type: high-tech-saas
- stage: mvp (working prototype, three pilots in the Delta)
- industry_archetype: ia_agtech
- idea_one_liner: "A mobile app that helps Delta cotton growers time their irrigation more precisely."

**Tuning:** First Run → score_harshness 0.7 (gentler), max_surfaces 2,
anti_pattern_severity_floor 0.6 (only the more important patterns),
contradiction_sensitivity 0.5.

**What the engine does on entry to the Distribution region:**

Active rules: `rule_dq_universal_baseline`, `rule_industry_dq_when_archetype_set`,
`rule_anti_pattern_low_we_can_reach_them` (her distribution-region answers are stated/hypothesis),
`rule_mississippi_context_after_industry_set`.

Top-2 surfaces (capped by max_surfaces_per_render: 2):

1. **(reframe, weight 8 from `rule_anti_pattern_low_we_can_reach_them`)** —
   Distribution Mystery anti-pattern: "What you're describing as your GTM
   is currently a list of channels rather than a path. Worth
   pressure-testing by picking the single channel you believe most in and
   asking: what would it cost to get my first 10 paying customers through
   only that channel..."
2. **(question, weight 8 from `rule_industry_dq_when_archetype_set`)** —
   "If this software told you to plant 10 days later than your neighbor,
   and you were wrong, how would you explain it to your banker at the
   operating-loan renewal?"

**What does NOT surface for Lena:**
- Heavy-handed pile-on (capped at 2 surfaces).
- Low-severity anti-patterns (severity_floor 0.6 cuts ap_moat_handwave,
  ap_premature_paid_acquisition, ap_team_gap, ap_founder_isolation,
  ap_vanity_metric — they need a future session to surface).
- Open-market style harsh contradictions (sensitivity 0.5 means only
  yes-then-no patterns flag).

**Why this is the right set for First Run:** Lena is in MVP, working
on a real Mississippi-context idea. The tool surfaces *one* anti-pattern
to keep the cognitive load reasonable (Distribution Mystery, the most
relevant given her low we_can_reach_them score) and pairs it with the
industry-specific banker question that would land in a Delta agronomy
context. First Run mode protects her from being overwhelmed.

**The exit brief she'd see** (from `brief.html` v0.1.1):
- "Idea, in one sentence" → her one-liner.
- "What you've established with real evidence" → her three pilots, named
  growers, observed planting decisions (assuming she marked these "lived").
- "What you've assumed but not yet tested" → her CAC assumption, her
  pricing model, her assumption that the agronomist will recommend her tool.
- "Three highest-leverage next things to do" → derived from her lowest
  scores, with concrete actions.
- "Two questions a Mississippi angel will ask" — one of these is her
  ag-tech archetype's `discovery_question_that_unlocks_truth` (the
  banker question), one is from her lowest-score-derived question bank.

---

## How the engine produces variation across these three sessions

| | Session A (Sarah) | Session B (Marcus) | Session C (Lena) |
|---|---|---|---|
| Mode | Second Lap | Open Market | First Run |
| Stage | early-traction | pre-product | mvp |
| Industry | healthtech | ai_infra | ag-tech |
| Surfaces shown | 3 | 4 | 2 |
| Severity floor | 0.4 | 0.3 | 0.6 |
| Anti-patterns surfaced | Single-Customer Fit | AI-for-X, Validation Theater, Hypothetical Pricing | Distribution Mystery |
| Industry-specific question | Healthtech CPT-code question | AI-infra OpenAI/Anthropic question | Ag-tech banker question |
| Mississippi note surfaced | "Mixed. UMMC partner; Medicaid payer mix..." | "Hard locally for GTM and senior ML talent..." | "Strong fit. MSU Delta Research center..." |
| Brief tone | Sharper (Second Lap) | Hardest (Open Market) | Most supportive (First Run) |

**Same engine, same content tables, same rules.** The variation comes from:
- Which rules' conditions match the current state
- Which rows match the user's industry/stage/score profile (relevance
  filtering in `buildRelevanceFn`)
- Tuning dials per mode

This is the NHL 98 dynamic: a small ruleset + rich tables + hand-tuned
dials produces emergent, never-quite-the-same coaching moments.

---

## What these examples don't show

- **Return-visit behavior.** When Sarah, Marcus, or Lena reload their
  state file in three weeks with new evidence, novelty weighting will
  surface *different* rows from the same rules. The first surface they
  saw last time becomes less likely; rows they haven't seen become more
  likely. This is the engine's "world feels alive on return" trick.
- **Contradiction handling.** If Sarah later answers a pricing question
  that contradicts her earlier evidence answer, the contradictions
  panel surfaces a "worth reconciling" message. Not shown above; would
  fire on real session evolution.
- **The user actually answering.** All three examples assume baseline
  answers. The engine's most interesting behavior emerges as the
  founder's confidence levels evolve from "stated" to "evidenced" or
  "lived" — meters move, scores rise, different rules fire.

The smoke test (real user with real answers across multiple sessions)
is the test these documents can't substitute for.
