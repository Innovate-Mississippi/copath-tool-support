# Quality Audit — v0.1 Content

> Audit of the 18 anti-patterns and 16 grammar templates against the four
> hard rules of the values layer in `SPEC.md` §7.1. This is the discipline
> check: did the build actually hold the line, or just claim to?

## The four rules being audited (SPEC §7.1)

1. **Never tell the founder their baby is ugly.** Surface weaknesses as
   gaps in evidence or unanswered questions, never as judgments of the
   idea or the founder.
2. **Every weakness surface must be paired** with a concrete next step,
   a relevant case study, or a question that lets the founder discover
   the issue themselves.
3. **No implicit funding promise.** Nothing the tool says or shows can
   reasonably be interpreted as "if you complete this, money follows."
4. **No discouragement of future entrepreneurship.** "This idea isn't
   ready" is allowed; "you shouldn't be a founder" is forbidden.

---

## Anti-patterns audit (18 rows)

For each pattern, the test: read `constructive_reframe` aloud as if the
founder is reading it. Does it (a) attack the founder, (b) call the
idea bad, (c) imply funding, or (d) discourage future entrepreneurship?
And is it paired with at least one of: question / case / next-step / reframe?

| Row | Pattern | Reframe shape | Paired with | Audit |
|---|---|---|---|---|
| ap_validation_theater | Validation Theater | question | next-step (one conversation this week) | **OK** — locates the gap in *the questions asked*, not in the founder's judgment |
| ap_founder_as_customer | Founder-as-Customer | reframe | next-step (find five people in the role) | **OK** — pattern is named structurally, not as personal failing |
| ap_hypothetical_pricing | Hypothetical Pricing | next_step_paired | two specific tests (cheapest + hardest) | **OK** — frames as a normal pattern most founders hit |
| ap_one_percent_big_number | 1% of a Big Number | reframe | next-step (build it bottoms-up) | **OK** — describes the trap, doesn't shame the founder for being in it |
| ap_build_trap | Build-Trap Avoidance | next_step_paired | two tests + Lemkin case | **OK** — gives credit to building as a comfortable activity, doesn't moralize |
| ap_single_customer_fit | Single-Customer Fit | reframe | next-step (next three accounts) | **OK** — names the first customer as a real win, then asks what's next |
| ap_distribution_mystery | Distribution Mystery | reframe | next-step (one channel, one experiment) | **OK** — frames as planning vocabulary, not strategic incompetence |
| ap_premature_paid_acquisition | Premature Paid Acquisition | reframe | question (do you have one organic source?) | **OK** — Mailchimp case as positive example |
| ap_wrong_buyer | Wrong-Buyer Solving | reframe | next-step (one 30-min call) | **OK** — names user-love as necessary, just not sufficient |
| ap_funding_gated | Funding-Gated Plan | reframe | next-step (what does no-money plan look like?) | **OK** — explicitly Mississippi-coded; doesn't shame seeking funding |
| ap_moat_handwave | Moat Hand-Wave | reframe | question + Calendly case | **OK** — Awotona's "we don't have a moat yet" is the role model |
| ap_margin_denial | Margin Denial | next_step_paired | concrete exercise on three customers | **OK** — pure operational reframe |
| ap_pivot_avoidance | Pivot Avoidance | question | the "advise a friend founder" thought experiment | **OK** — most carefully written reframe; avoids pivoting/not-pivoting moralism |
| ap_custom_dev_demand | Custom-Dev as Demand Proof | reframe | Palantir case + question (what % code identical?) | **OK** — explicitly says "consultancy is a real business" |
| ap_team_gap | Team Gap | next_step_paired | the 20-sales-calls test | **OK** — names team composition as biasing the product, not as a defect |
| ap_ai_for_x_no_jtbd | AI-for-X Without JTBD | reframe | the customer-justification-email exercise | **OK** — Harvey AI as positive example |
| ap_vanity_metric | Vanity Metric Anchoring | next_step_paired | four-number pairing test | **OK** — opens with "real and worth celebrating" — softens before challenging |
| ap_founder_isolation | Founder Isolation | question | text/coffee next-step | **OK** — most sensitive topic; reframed as "questions you stop hearing" — operational not clinical |

**Result: 18/18 pass.** No pattern violates any of the four rules.

### Patterns I'd watch on real-world contact

- **ap_pivot_avoidance** is the trickiest. The "advise a friend founder"
  technique works for self-aware founders but could feel manipulative if
  surfaced too aggressively. Its severity_weight is 0.6 (moderate) and it
  surfaces only when scores indicate misalignment. Probably right.
- **ap_founder_isolation** — only surfaces gently, but the topic is
  emotionally loaded. If a founder reports this surface as feeling
  invasive in real testing, downweight to severity 0.3 or move it to a
  separate "wellbeing" surface that only appears when explicitly opted into.
- **ap_funding_gated** — Mississippi-specific framing is honest but could
  read as "your plan is bad." The `representative_companies` reference
  (Stax) is the saving grace. Re-test with a real funding-gated founder.

---

## Templates audit (16 rows)

Verifying every template (a) belongs to one of the four allowed shapes,
and (b) doesn't contain language that could violate the values rules
when filled with row content.

### Allowed shapes (SPEC §7.2)

- `question` — "What evidence do you have that {claim}?"
- `case_paired` — "{Founder} faced this same gap when..."
- `next_step_paired` — "The cheapest test would be... The hardest but most valuable test would be..."
- `reframe` — "What you're describing as X is often actually Y..."

### Templates by shape

**Shape: question (5)**
- `tpl_q_industry_dq` — wraps `discovery_question_that_unlocks_truth`. **OK.**
- `tpl_q_dq_universal` — wraps `question_text` + follow-ups. **OK.**
- `tpl_q_dq_with_bad` — wraps question + names the bad version. **OK.**
- `tpl_q_anti_pattern_naked` — surfaces `constructive_reframe` directly. **OK** (because the reframes themselves are audited above).
- `tpl_q_dq_with_followups` — wraps question + both follow-ups. **OK.**

**Shape: case_paired (4)**
- `tpl_case_industry` — names self-deception alongside scaled examples. **OK** (frames as "the lie founders are tempted to believe", not "your lie").
- `tpl_case_anti_pattern` — wraps how-it-shows-up + case study. **OK.**
- `tpl_case_industry_companies` — references companies + cautionary tale. **OK.**
- `tpl_case_anti_pattern_minimal` — case study + pattern label. **OK.**

**Shape: next_step_paired (3)**
- `tpl_next_step_industry` — surfaces the three PMF evidence demands as a list. **OK.**
- `tpl_next_step_anti_pattern` — wraps `constructive_reframe`. **OK.**
- `tpl_next_step_anti_pattern_with_case` — adds case study to reframe. **OK.**

**Shape: reframe (4)**
- `tpl_reframe_anti_pattern` — names what's-actually-happening + reframe. **OK.**
- `tpl_reframe_industry_self_deception` — surfaces self-deception. **OK** (framed as a pattern, not a personal failing).
- `tpl_reframe_mississippi` — surfaces Mississippi context note. **OK.**
- `tpl_reframe_anti_pattern_pure` — surfaces reframe + pattern + diagnostic. **OK.**

**Result: 16/16 pass.** All templates conform to the four allowed shapes.
None contain wrapping language that could turn a values-compliant row
into a values-violating surface.

---

## Industry archetypes — Mississippi relevance honesty audit

The `mississippi_relevance_note` field exists per SPEC §7.3 to surface
honest context without papering over reality. Audit: are the notes
honest, including when honesty means "this is hard here"?

| Row | Honesty stance | Audit |
|---|---|---|
| ia_legaltech | "viable for plaintiffs' bar but enterprise AmLaw needs travel" | **Honest.** |
| ia_constructiontech | "Strong fit" with named local GCs | **Honest** — substantively positive. |
| ia_agtech | "Strong fit" with MSU Delta center as edge | **Honest** — substantively positive. |
| ia_horizontal_collab | "Hard here without coastal gravity. Founders should expect to relocate or run remote-first." | **Honestly hard.** This is exactly what SPEC §7.3 demands. |
| ia_data_infra | "Very hard locally. Buyers concentrated in SF, NYC, Seattle." | **Honestly hard.** |
| ia_healthtech | "Mixed. UMMC partner; Medicaid payer mix must be modeled honestly." | **Honest.** Names UMMC as a real edge but doesn't oversell. |
| ia_fintech | "Workable but capital-constrained. State regulator reachable." | **Honest.** |
| ia_govtech | "Genuine opportunity. 82 counties, in-state vendor narrative." | **Honest** — substantively positive. |
| ia_climate | "Real but specific fit. TVA/Stennis edge but capital coastal." | **Honest.** |
| ia_robotics | "Strong industrial demand; talent bottleneck non-trivial." | **Honest** — names tradeoff. |
| ia_b2b_marketplace | "Workable in industrial/ag verticals where MS has supplier density." | **Honest.** |
| ia_hardware_software | "Industrial design talent scarce; manufacturing-ops hire near CM, not Jackson." | **Honestly hard.** |
| ia_ai_infra | "Hard locally for GTM and senior ML talent; build here, sell from coastal hire." | **Honestly hard.** |
| ia_dental_practice | "Plausible. State association reachable; DSO buying in Dallas/Atlanta/Nashville." | **Honest.** |
| ia_prosumer_creator | "Workable for niche creator economies; lacks LA/Austin/Brooklyn density." | **Honest.** |

**Result: 15/15 honest.** No notes are papered-over or excessively
optimistic. Five rows explicitly say "this is hard here" with specific
mitigations — that's the standard SPEC §7.3 demands.

---

## Cross-cutting checks

- **No row implies funding.** Searched all three tables for "raise", "fund",
  "investor" — only appears in cautionary contexts (ap_funding_gated:
  "investors read this as risk transfer"; ap_one_percent_big_number:
  "investors read '1% of a big market' as 'the founder hasn't done the
  bottoms-up math yet'"). Both are operational warnings about how third
  parties read the founder, not promises.
- **No row says "you shouldn't be a founder."** Closest: ap_team_gap
  surfaces a question about which founder will do sales calls — frames
  team composition, not founder validity.
- **No template wraps row content with judgmental framing.** All templates
  use neutral verbs ("worth sitting with", "worth pressure-testing", "name
  this", "for {row}, the bar is concrete").
- **The trace sidebar shows reasoning, not verdict.** "rule:X triggered
  by score:Y < Z" is mechanical not moral. Disco Elysium move holding.

---

## What this audit didn't cover

- **Real-user contact testing.** No founder has actually used this. The
  audit verifies the *content* holds the rules; it doesn't verify that
  the *experience* feels supportive in practice. First three real users
  are the meaningful test.
- **Visual chrome impact.** A weakness reframe in a kind voice in a
  cold visual frame can read differently than the words alone. The
  branded-muted Win2K palette was chosen partly for warmth (warm beige
  vs. stark white); test on real users.
- **Pacing and surface frequency.** The values layer is content-level.
  Surfacing four anti-patterns in a row (Open Market mode + low scores)
  could feel like a pile-on even if each one is individually fine. Watch
  the `max_surfaces_per_render` dial in tuning configs against real use.
- **Out-of-scope routing.** The SBDC redirect copy was authored against
  the values rules but not user-tested. The "I disagree, continue
  anyway" override exists specifically for cases where the
  classification feels wrong.

---

## What I'd tune first if a real user reports something landing wrong

1. The specific `constructive_reframe` they flagged — single-row edits
   are cheap and don't require engine changes.
2. Tuning dials, in this order: `max_surfaces_per_render` (down, less
   pile-on), `anti_pattern_severity_floor` (up, fewer surfaces),
   `score_harshness` (down, gentler).
3. Rule weights — if a particular rule is firing too often or in the
   wrong context, drop its weight or add an additional condition.
4. Only after exhausting the above: rewrite a template or change shape.
5. Last resort: change the engine.

This is the right order. The architecture exists specifically so
content fixes don't require code changes.
