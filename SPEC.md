# SPEC — CoPath Teaching Tool

> **Working spec, v0.1.** Lives or dies by whether the build follows it.
> Disagreements between code and spec resolve in favor of the spec, or
> the spec gets amended on purpose. No silent drift.

---

## 0. North Star

The founder leaves feeling **competent, energized, challenged — but not
overconfident.**

Every design decision in this document serves that sentence. If a choice
makes the user feel stupid, smug, lectured, or as if they've earned funding
by completing exercises, the choice is wrong.

---

## 1. What this tool is

A free, static web app that helps a founder honestly evaluate whether their
**high-tech, high-growth, scale-oriented equity-track** startup idea is
worth pursuing — and, if it is, hands them a concrete artifact pointing at
the next three things to do.

Built on the philosophy of old-school games (NHL 98, early SimCity,
Roguelikes): a tiny rule engine on top of richly curated content tables,
producing emergent coaching moments without prescribing a path.

Schumpeterian. Make things people want. PMF as North Star.

## 2. What this tool is NOT

Listed first on purpose, to keep future work from drifting back into
ambition.

- **Not** a tool for brick-and-mortar, lifestyle, consulting, nonprofit, or
  social-entrepreneurship ventures. Those route to the SBDC partnership
  (and, for social ventures, the restructured non-profit alliance) — see
  §8 (Out-of-scope routing).
- **Not** a funding pipeline. Completing the tool implies nothing about
  Innovate Mississippi investment, introductions, or endorsement.
- **Not** a discouragement tool. If the idea or the founder isn't ready,
  the tool says so honestly and points at where to go next — never "you
  shouldn't be an entrepreneur."
- **Not** a prescribed program. There is a CoPath-recommended path, but
  the user is free to navigate any region of inquiry in any order. Markets
  don't follow programs; the tool shouldn't pretend they do.
- **Not** a SaaS. No accounts, no backend, no telemetry, no database.
  State lives in a JSON file the user owns.
- **Not** a SF/NYC simulator. Pacing, evidence demands, and case studies
  reflect Mississippi context — trust-based ecosystem, long cycles,
  angels who respond fast to good deals.

---

## 3. Audience and modes

The user is a founder working on a high-tech / high-growth / scale-oriented
equity-track idea. They pick one of three modes at the start:

| Mode | Audience | Goal-line | Engine behavior |
|---|---|---|---|
| **First Run** | First-time founder | Reach $100K in sales | Gentler thresholds, more coaching surfaces, more context on *why* a question is being asked, case studies skew to early-stage Southeastern founders |
| **Second Lap** | Founder with prior experience | Reach $1M in sales | Sharper thresholds, less hand-holding, assumes vocabulary, surfaces challenges to assumptions earlier |
| **Open Market** | No-holds-barred | Reach \$x in sales (no cap) | Evidence demands at market standard. The tool will tell you your conversion-rate assumption is delusional if it is. No softening, no scaffolding. |

Modes are **the same engine reading a different `tuning.json`.** Same
tables, same rules, same grammar templates — only the dials change.

---

## 4. The user experience, in plain English

1. User lands on the page. Picks a mode. Optionally loads a saved state
   file from a prior session.
2. Tool asks a small set of orienting questions to anchor industry, stage,
   and idea-shape. (If the answers indicate brick-and-mortar / lifestyle
   / consulting / nonprofit, tool gracefully routes to SBDC — see §8.)
3. User lands in an open workspace with **regions of inquiry** visible
   (Evidence, Segmentation, Pricing, Distribution, Team, etc.). They can
   enter any region in any order. A "recommended next" surface nudges
   without forcing.
4. Inside any region, the tool surfaces questions, challenges, case
   studies, and evidence prompts based on the current state. The user
   answers, attaches notes, or marks "I don't know yet."
5. As state evolves, the **visible mechanics** chrome (§9) updates:
   evidence-strength scores, contradictions flagged, regions still untouched.
6. At any time, the user can **download their state** as a JSON file or
   **export the exit artifact** (§7) — a one-page brief.
7. They come back next week with new evidence, reload their state, and
   the tool reflects what's changed.

No timer. No "you completed Module 3." No badges. The user's progress is
their own evidence and their own next steps, not the tool's gamification.

---

## 5. Engine model

### 5.1 The runtime, in six lines

```
On every user action:
  1. Update world state (their answers, derived scores, flags, history)
  2. Find every rule whose trigger condition the new state satisfies
  3. For each matching rule, pick a row from the relevant table,
     weighted by relevance and by what the user hasn't seen yet
  4. Pour that row's cells into a grammar template
  5. Surface the result through the classic-GUI chrome
  6. Wait.
```

Engine target: **under 500 lines of plain JavaScript.** No framework, no
bundler, no build step. If it grows past 500 lines, something belongs in
tables or grammar templates instead.

### 5.2 The seven primitives

Each is a file or a small set of files. Nothing exotic.

| Primitive | What it is | Where it lives |
|---|---|---|
| **World state** | The user's current session: answers, derived scores, flags, history | In-memory; serialized to/from a JSON save file |
| **Tables** | Curated content rows the engine pulls from | `/data/*.json`, one file per table |
| **Rules** | IF-THEN units: trigger condition → which table to pull from | `/data/rules.json` |
| **Grammar templates** | Sentence/UI patterns with named slots | `/data/templates.json` |
| **Tuning** | Numeric dials: thresholds, weights, mode parameters | `/config/tuning.{first-run,second-lap,open-market}.json` |
| **Memory & replay** | What persists in the save file; novelty-weighting on table picks | Engine logic + state shape |
| **Surface** | The classic-GUI chrome rendering the engine's output | `index.html` + `/styles/*.css` + small render JS |

### 5.3 What stays out of code

Two enforced constraints that keep the tool flexible-to-expand without
engineering work:

- **Tables are data, not code.** Adding a row never requires a deploy. A
  non-engineer with a JSON editor can extend any table.
- **Tuning is config, not code.** Mode behavior, evidence thresholds,
  contradiction harshness, novelty bias — all numbers in the tuning
  files, all documented in this spec.

---

## 6. Starter content tables — v1

Three tables for v1. More get added as the tool grows. Column lists below
are the *minimum*; columns can be added but not removed without amending
this spec.

### 6.1 `industry-archetypes.json` (target: 15–25 rows)

High-tech / high-growth / scale-oriented archetypes only. Vertical SaaS,
horizontal SaaS, regulated tech (healthtech / fintech / edtech /
govtech), deep tech, marketplaces, hardware-with-software, AI
infrastructure, prosumer / creator tools, services-as-software.

| Column | Format | Notes |
|---|---|---|
| `archetype_name` | short label | |
| `representative_companies` | array of 3 | one early-stage, one scaled, one cautionary tale |
| `typical_sales_cycle` | range in days | |
| `evidence_demands_at_pmf` | 3 specific signals | what *actually* proves PMF in this industry |
| `common_self_deception` | 1–2 sentences | the lie founders in this space tend to tell themselves |
| `discovery_question_that_unlocks_truth` | verbatim question | the one question that separates real demand from politeness *here* |
| `mississippi_relevance_note` | 1–2 sentences | does this archetype work in MS? what's the local angle or constraint? |

### 6.2 `discovery-questions.json` (target: 30–50 rows)

The Socratic question bank.

| Column | Format | Notes |
|---|---|---|
| `question_text` | verbatim | the actual question |
| `elicits` | enum | true willingness-to-pay / latent need / switching cost / decision authority / market-size grounding / etc. |
| `bad_version_to_avoid` | verbatim | the leading or weak phrasing this question replaces |
| `when_to_ask` | trigger condition | early discovery / after first contradiction / before pricing region / etc. |
| `follow_up_if_yes` | verbatim follow-up | |
| `follow_up_if_no` | verbatim follow-up | |
| `industry_specificity` | "universal" or array of archetypes | |

### 6.3 `anti-patterns.json` (target: 20–30 rows)

The red-flag library. Critical that every row has a *constructive
reframe* — see §7 on the values layer.

| Column | Format | Notes |
|---|---|---|
| `pattern_name` | short label | |
| `how_it_shows_up` | what the founder says or does | concrete, recognizable |
| `whats_actually_happening` | the underlying issue | the diagnostic, not the symptom |
| `constructive_reframe` | how the tool surfaces this **without crushing** | mandatory; see §7 |
| `case_study_of_someone_who_navigated_past_it` | named example | bias toward Southeastern / secondary-market |
| `severity_weight` | 0.0–1.0 | how much this pulls down the relevant evidence-strength score |

---

## 7. The values layer (the most important section)

This is where most teaching tools fail. It's also where this tool earns its
keep. The values layer is **enforced at the grammar-template and rule
level**, not added on as tone polish.

### 7.1 The four hard rules

1. **Never tell the founder their baby is ugly.** Surface weaknesses as
   *gaps in evidence* or *questions not yet answered*, never as judgments
   of the idea or the founder.
2. **Every weakness surface must be paired** with at least one of:
   (a) a concrete next step to address it, (b) a case study of someone
   who navigated past the same weakness, or (c) a question that lets the
   founder discover the issue themselves rather than being told.
3. **No implicit funding promise.** Nothing the tool says or shows can
   reasonably be interpreted as "if you complete this, money follows."
   No "score," no "ranking," no "you're investor-ready" language.
   Anywhere.
4. **No discouragement of future entrepreneurship.** "This idea isn't
   ready" is allowed and sometimes necessary. "You shouldn't be a
   founder" is forbidden, always. If a founder isn't ready *for this
   idea*, route to better next steps (more discovery, SBDC, partner
   alliance), never away from the path itself.

### 7.2 Grammar template constraints

Every template that surfaces a challenge or weakness must follow one of
these shapes. (Concrete templates get authored in `templates.json`; this
section sets the rules templates must obey.)

- **Question-shaped:** "What evidence do you have that {claim}?"
- **Case-paired:** "{Founder} faced this same gap when they {situation}.
  Here's what they did: {action}. The result: {outcome}. What's the
  parallel for your situation?"
- **Next-step-paired:** "This is currently your weakest evidence area.
  The cheapest test: {specific test}. The hardest but most valuable test:
  {harder test}."
- **Reframe-shaped:** "What you're describing as {founder's framing} is
  often actually {diagnostic reframe}. Worth pressure-testing by
  {specific action}."

A template that says "your pricing model is wrong" without one of the
four pairings above does not ship. Period.

### 7.3 The Mississippi context constraint

Pacing assumes trust-based, long-cycle relationships. Templates and
prompts should:

- Treat months-long discovery as normal, not slow.
- Frame "the angels will respond fast if it's a good deal" as the
  benchmark, not "raise in two weeks at TechCrunch."
- Bias case studies toward Southeastern / secondary-market companies.
  SF / NYC unicorns are reference points, not role models.

---

## 8. Out-of-scope routing

If the orienting questions (§4 step 2) reveal the idea is brick-and-mortar,
lifestyle, consulting, nonprofit, or social-entrepreneurship, the tool
surfaces a graceful redirect:

> "This tool is built for high-tech, scale-oriented equity-track startups,
> and based on what you've described, that's not the best fit for what
> you're building — which is a real and valuable thing on its own. Innovate
> Mississippi has a deep partnership with the **SBDC** for debt-based and
> traditional small-business paths, and a relationship with the
> [restructured social-venture alliance] for mission-driven ventures.
> Both will serve you better than this tool will."

No paywall, no judgment, no "come back when you have a real idea." Just
routing. The user can also override and continue if they disagree with
the classification.

---

## 9. Visible mechanics (the Disco Elysium move)

The chrome surfaces what the engine is doing, in plain language, as the
user works. This is not decoration — it is the teaching mechanism.

Examples of what the chrome shows:

- **Evidence-strength meters** per claim category ("customers will pay,"
  "we can reach them affordably," "they'll keep paying," "we can build
  it") — visible, with a one-line "why this score" tooltip.
- **Contradiction flags** when the user's later answer conflicts with an
  earlier one. Surfaced gently: "You said earlier {X}, and now {Y} — worth
  reconciling. Which is closer to true?"
- **The roll-and-result trace.** When the engine surfaces a coaching
  moment, the chrome shows *why*: "Triggered because: industry =
  HealthTech, no regulatory question answered yet, evidence-strength on
  'we can reach them' < 4."
- **Untouched regions** as visible whitespace, not as "incomplete." A
  founder might rightly skip a whole region; the tool shows that
  honestly without nagging.

The teaching happens *because* the user can see the system thinking.
Making the mechanics visible is what turns the tool from a quiz into a
practicum.

---

## 10. The exit artifact

Without something material in the user's hand at the end, the tool feels
like therapy. With an artifact, it's a tool.

**`brief.html`** (printable + downloadable as PDF, ideally one page):

1. **Idea, in one sentence** — what the user has converged on.
2. **What you've established with real evidence** (3–5 bullets).
3. **What you've assumed but not tested** (3–5 bullets).
4. **The three highest-leverage next things to do** — specific, dated,
   with the cheapest evidence-gathering action for each.
5. **The two questions a Mississippi angel will ask you that you
   currently can't answer** — direct, named.
6. **Where to go next** — relevant Innovate MS resources, SBDC referral
   if appropriate, suggested mentors / programs based on stage.

The brief is generated from world state. It is the *only* "score-shaped"
output the tool produces, and even it is shaped as next-steps, not as a
verdict.

---

## 11. Persistence

- World state serializes to a single JSON object: `{schema_version,
  mode, created_at, updated_at, answers, scores, flags, history}`.
- User can **download** their state as `copath-state.json` at any time.
- User can **upload** a state file to resume.
- No backend. No accounts. No telemetry. The user owns their data
  literally and can email it to a mentor or open it in a text editor.
- `schema_version` in the file lets future versions of the engine
  migrate older saves forward gracefully.

---

## 12. Visual language

Defer to `DESIGN-PRINCIPLES.md` §2 (classic-GUI aesthetic, branded-muted
chrome). Tomorrow's spec-completion session picks the pixel-accurate
reference (Win2K Luna with brand-shifted hues / System 7 with
brand-tinted title bars / etc.) and commits to it.

The chrome must support visible-mechanics surfaces (§9) — specifically:
status panels, meter widgets, modeless tooltips, and a "trace" sidebar
that can be shown/hidden.

---

## 13. Definition of done — v1

The first shippable version of the tool has:

- [ ] Engine: under 500 lines, runs all six runtime steps
- [ ] Three tables populated to their target row counts (§6)
- [ ] One tuning file per mode (three total)
- [ ] At least 12 grammar templates covering the four shapes in §7.2
- [ ] Out-of-scope routing rule and copy
- [ ] Save / load JSON state
- [ ] Exit artifact generation
- [ ] Visible mechanics chrome (evidence meters, contradiction flags,
      trace, untouched regions)
- [ ] Classic-GUI styling locked to one reference per `DESIGN-PRINCIPLES.md`
- [ ] Deploys to Cloudflare Pages from `copath-teaching-tool-prod`

What is **not** required for v1:

- Multi-tenant / non-Innovate-MS branding
- Mobile-optimized layout (desktop-first; mobile is a fast-follow)
- Any analytics or telemetry
- Account system or server-side anything
- More than three tables (the rest grow with use)

---

## 14. Open questions

Park decisions here as they surface during build. Don't guess.

- Pixel-accurate visual reference for the classic-GUI chrome — pin one.
- The exact orienting-question set (§4 step 2) that classifies a user
  as in/out of scope. Needs author judgment.
- Whether the recommended-next nudge follows a CoPath canonical order
  or is purely state-driven. (Strong leaning: state-driven, with the
  canonical order surfaced as a *visible* recommendation the user can
  ignore.)
- How the tool handles a user who returns after months — should it
  prompt them to re-validate stale evidence? With what threshold?
- Where the line is between "challenge harder" (Open Market mode) and
  "violate the values-layer rules in §7." Open Market does not get to
  call the baby ugly; it gets to demand more evidence faster.

---

## 15. Amendment process

This spec changes when reality demands it, not when it's inconvenient.
Amendments:

1. Get proposed in a branch off `copath-teaching-tool-sandbox`
2. Show what changed and why, in the commit message
3. Land in `sandbox` before any code that depends on the change
4. Propagate to `prod` only with the next stable merge

If code and spec diverge silently, the spec wins on review and the code
gets reverted or the spec gets explicitly amended. No silent drift.
