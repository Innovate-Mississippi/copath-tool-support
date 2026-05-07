# BUILD NOTES — v0.1

> Read this before reading any code. It captures what was built, what was
> decided on your behalf, what was deferred, and what to look at first.

## What got built

A working v0.1 of the CoPath Teaching Tool, end-to-end, on
`copath-teaching-tool-sandbox`:

- **Engine** (8 modules, 779 lines of plain JS, no framework): state model,
  scoring, persistence, table loader, novelty-weighted row picker, rule
  evaluator with explainable trace, template filler, render orchestrator,
  boot + event wiring.
- **Three content tables**, hand-curated by background research agents
  with strict schemas, citations, anti-generic enforcement, and Mississippi
  context bias:
  - `data/industry-archetypes.json` — **15 rows**
  - `data/discovery-questions.json` — **25 rows**
  - `data/anti-patterns.json` — **18 rows**
  - **Total: 58 rows of cited content** spanning 30+ named cases
    (Calendly/Atlanta, Mailchimp/Atlanta, Stax/Orlando, Glew/Chattanooga,
    Spanx/Atlanta, plus the wider canon: Dropbox, Stitch Fix, Linear,
    Palantir, Buffer, etc.).
- **Five structural data files**: `region-questions.json` (6 regions, 25
  founder-facing questions), `rules.json` (10 rules + 2 contradiction
  detectors), `templates.json` (12 grammar templates across all 4 allowed
  shapes), `orienting-questions.json` (entry funnel with 4 questions),
  `out-of-scope-routing.json` (graceful SBDC redirect copy).
- **Three tuning configs** (`config/tuning.{first-run,second-lap,open-market}.json`)
  — same engine, different dials.
- **Index + chrome**: `index.html` + `styles/chrome.css` —
  Windows 2000 Classic styling with branded-muted Mississippi-navy palette.
  Disco-Elysium-style visible mechanics: trace sidebar shows which rule
  fired, why it fired, what table/row it pulled.
- **Exit artifact**: `brief/brief.html` — generates a printable one-page
  brief from the user's saved state, with the six sections from SPEC §10.

## How to run it locally

The tool needs a local HTTP server (because `fetch()` of the JSON files
won't work on `file://`). From the repo root:

```sh
python3 -m http.server 8000
# or
npx http-server -p 8000
```

Then open `http://localhost:8000` in a browser. Pick a mode, answer the
orienting questions, navigate the regions, watch the meters update, click
**Brief** to see the exit artifact.

To deploy to Cloudflare Pages from `copath-teaching-tool-prod`: point the
build to the repo root, no build command needed (static).

## Decisions I made on your behalf

| Decision | What I picked | Rationale |
|---|---|---|
| Visual reference | **Windows 2000 Classic** | Most neutral system chrome (System 7 = nostalgic-Mac, BeOS = design-fan). Brand-tints cleanly. |
| Branded-muted palette | Innovate-MS-shifted navy `#1a3556` → `#3a5a7a` gradient on title bars; warm `#ece9d8` window beige; muted score-color spectrum. | Defensible neutral. Adjust hex values in `styles/chrome.css` `:root` block — layout doesn't break. |
| Mode names | First Run / Second Lap / Open Market | Kept from spec. |
| Recommended-next | State-driven (rule weights), CoPath canonical order surfaced as a visible recommendation the user can ignore. | Per SPEC §14 leaning. |
| Mississippi-angel question phrasing in the exit artifact | Generated from the user's two lowest-scoring claim categories with handcrafted question templates per category. | Honest placeholder; you'll likely want to author real angel questions later from named MS angels. |
| Confidence scale | Lived (1.0) > Evidenced (0.9) > Stated (0.4) > Hypothesis (0.15) > I don't know (0). | Matches the values rule: stated/hypothesis answers shouldn't move scores much. Forces the founder to upgrade their evidence. |
| Region count | 6 regions (Idea / Customer / Evidence / Pricing / Distribution / Team). | Trimmed from the original 8 to keep the workspace readable. Moat folds into Evidence; Funding folds into Distribution. |

## Content provenance + caveats (read before shipping content publicly)

The three big tables came from background research agents. Each agent
flagged uncertainties — these need a human pass before the content is
treated as authoritative:

**`industry-archetypes.json`:**
- Row 9 (Climate, **Sunfolding** as cautionary tale) — agent reasonably
  confident on Aug 2023 shutdown / Canary Media coverage, but specific
  date and source title should be verified.
- Row 14 (Dental SaaS) — agent originally cited **Onederful** as the
  cautionary tale but flagged uncertainty; I swapped in **Smile Direct
  Club** (Ch. 11, Sept 2023) which is well-documented but is more D2C
  than practice-SaaS. Worth a sourced replacement.
- Row 11 (B2B marketplace) — agent originally proposed "Hound" as
  cautionary tale and flagged genuine uncertainty about whether such a
  shutdown actually happened; I swapped in **Convoy** (freight
  marketplace, Oct 2022 shutdown, very well-documented).
- Several `&` characters were originally HTML-escaped (`&amp;`); I cleaned
  those during the save.

**`discovery-questions.json`:**
- 25 rows, all confident. Agent's bad-version contrasts are particularly
  strong (drawn heavily from The Mom Test). The "Tom called Bobby"
  question (`dq_tom_called_bobby`) is explicitly Mississippi-coded —
  worth keeping as a calibration point for future questions.

**`anti-patterns.json`:**
- 18 rows, all confident. Constructive reframes pass the values-layer
  test (audited row-by-row before saving). Southeastern case studies
  cited where available (Calendly, Mailchimp, Stax, Glew, Spanx); a few
  rows defaulted to nationally-known cases (Dropbox, Stitch Fix,
  Stewart Butterfield, Buffer) where Southeastern documentation was thin.
- The agent's research notes identified a follow-up: 5–10 named
  Mississippi-specific founder cases (with permission) would meaningfully
  upgrade the case_study column. Recommend an interview pass through
  Innovate MS portfolio alumni.

## Engine choices worth knowing

- **Plain ES modules**, no bundler, no build step. Browser-native
  `<script type="module">`. Adds rows = edits JSON. Adds rules = edits
  one JSON file. No deploy required for content changes once the static
  shell is on Cloudflare.
- **Engine line count: 779.** Over the SPEC §5.1 target of 500. The
  overage is mostly in `chrome.js` (DOM render — readable, not clever).
  Could be trimmed by a small templating helper but I prioritized
  readability for v0.1. Worth revisiting in v0.2 once you've used it.
- **Rule evaluator** supports `all`, `any`, `not`, plus leaf conditions
  on `flag`, `score`, `answered`, `region_touched`, `region_untouched`,
  `industry_archetype`, `mode`. Composable enough for v1; extensible
  without engine changes.
- **Novelty weighting** in `tables.js` `pickRow()` — rows the user has
  already seen are downweighted by `1 / (1 + times_shown * multiplier)`.
  This is the same trick that keeps Roguelike encounter tables from
  feeling repetitive on return visits.
- **Smart row picking** in `main.js` `buildRelevanceFn()` —
  industry_archetypes table filters to the user's selected archetype;
  anti_patterns table filters by `severity_floor` from tuning AND prefers
  rows whose `scores_affected` includes the user's lowest-scoring claim;
  discovery_questions soft-prefers rows whose `when_to_ask` matches the
  active region.
- **Confidence-weighted scoring** — see `engine/scoring.js` and the
  CONFIDENCE_WEIGHT map. This is where the values rule meets the math:
  hypothesis-confidence answers can never produce strong scores. The
  founder has to upgrade their evidence to move the meter.
- **Trace sidebar** (Disco-Elysium move) — every surfaced coaching card
  shows which rule fired, what condition triggered it, and which
  table/row was pulled. The teaching happens *because* the user can see
  the system thinking.

## SPEC §13 v1 checklist status

- [x] Engine running all six runtime steps
- [x] Three tables populated to target row counts (15 / 25 / 18)
- [x] One tuning file per mode (three total)
- [x] At least 12 grammar templates covering the four shapes (12 total)
- [x] Out-of-scope routing rule and copy
- [x] Save / load JSON state (with schema_version migration hook)
- [x] Exit artifact generation (`brief/brief.html`)
- [x] Visible mechanics chrome (evidence meters, contradiction flags,
      trace, untouched regions)
- [x] Classic-GUI styling locked to Win2K reference (per
      `DESIGN-PRINCIPLES.md` §2)
- [ ] Deploys to Cloudflare Pages from `copath-teaching-tool-prod` — **not
      done.** Sandbox only. Awaiting your decision to merge into prod
      and your Cloudflare account configuration.

Engine over 500-line target as noted above; everything else met.

## What's deferred for v0.2 (intentionally)

- **Mobile layout.** Desktop-first per SPEC §13. The CSS gracefully
  degrades to single-column under 1024px but isn't optimized.
- **Multi-tenant / per-tenant branding.** All Innovate MS specific in v1.
- **Telemetry / analytics.** None. Per SPEC §11.
- **Account system.** None. Per SPEC §11. State lives in JSON file the
  user owns.
- **Bulk content expansion.** The 58 rows are enough to demonstrate every
  function and produce different outcome paths. The seeding-prompts pattern
  in this document can generate more rows table-by-table when needed.
- **The 8 tables I originally proposed.** Three suffice for v1. The other
  five (Founder Archetypes, Stage Archetypes, Pricing Patterns, Question
  Bank by elicits-only, Case-study Library) are deferred — add them
  when actual usage shows you need them.
- **Audit pass on every template.** I audited the 12 templates against
  the four allowed shapes from SPEC §7.2; you may want a second pair of
  eyes before scaling content.

## Where to look first when reviewing

In this order:

1. **Open the tool in a browser** (see "How to run it locally" above).
   Pick "Open Market" mode for the most engine-pressure. Walk through 5–10
   answers. Watch the trace sidebar.
2. **`SPEC.md`** — the contract this build was made against.
3. **`data/anti-patterns.json`** — the most distinctive content. Read 3–4
   reframes and ask: would a real Mississippi founder feel attacked or
   diminished by any of these? If yes, flag them — that's the values-rule
   test failing.
4. **`data/industry-archetypes.json`** — read your industry's
   `mississippi_relevance_note`. Some are honest "this is hard here"
   notes; that's intentional per SPEC §7.3 and the values rule's
   "honest evidence demands" constraint.
5. **`brief/brief.html`** — generate a brief after a session and read it.
   This is the single output a founder takes away. If it doesn't feel
   like a tool (vs. therapy), tune `SCORE_TO_ACTION` or
   `ANGEL_QUESTIONS` blocks in the embedded JS.
6. **`engine/main.js` `buildRelevanceFn()`** — this is where most of the
   "right content for the right moment" logic lives. Worth understanding
   before adding rules.

## Known things to watch / tune

- **Repeated content on return visits.** Novelty weighting biases away
  from repeats but doesn't forbid them. If a user runs many sessions,
  tune `novelty_multiplier` upward in tuning files.
- **Score harshness asymmetry across modes.** First Run = 0.7,
  Open Market = 1.4. Test that Open Market doesn't violate values rules
  (per SPEC §14 last open question). My audit says no, but you may want
  to spot-check.
- **Out-of-scope routing copy** uses placeholder language for the
  social-venture pathway because you noted the alliance is restructuring.
  Update `data/out-of-scope-routing.json` `referrals` array when the new
  partner name is set.
- **The two contradiction rules are conservative** (only fires on
  yes-then-no patterns between specific question pairs). Easy to add more
  in `data/rules.json` `contradictions` array — same shape.

## What I did NOT do (per "what I would NOT do without checking back")

- Did not merge `sandbox` to `prod`.
- Did not configure Cloudflare Pages deployment.
- Did not modify the old `claude/market-validation-app-R8laN` branch.
- Did not change repo visibility.
- Did not add features beyond the §13 checklist.

Pushed v0.1 to `copath-teaching-tool-sandbox`. Ready for your review whenever
you're back.
