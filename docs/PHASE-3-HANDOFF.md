# Phase 3 Handoff — `claude/market-validation-app-R8laN`

> Status as of 2026-05-07. This branch is **paused**, not abandoned. A parallel
> clean-slate build has started on `copath-teaching-tool-sandbox` /
> `copath-teaching-tool-prod` based on a fresh spec. Decide whether to revive
> this branch before resuming work here.

## What's in this branch

A static, Cloudflare-Pages-deployable CoPath Validation Engine. Seven
modules wired through a shared launchpad, with industry-aware logic
threaded across them.

```
.
├── index.html            # Launchpad with rollup status panel
├── admin/                # Admin entry, moved here in 77a0b73
├── shared/
│   ├── core.js           # Cross-module state, industry alignment
│   └── styles.css        # Shared visual layer
├── data/                 # Per-module JSON (validation, sizing, canvases, competitive)
├── im-data.json          # Innovate Mississippi data
├── market-sizing-data.json
├── market_scenarios.json # 11MB — generated, not hand-edited
└── modules/
    ├── 01-validation/    # Industry-aware hurdle + per-industry coaching
    ├── 02-segmentation/  # Scaffolded
    ├── 03-sizing/        # Scaffolded
    ├── 04-canvases/      # Scaffolded
    ├── 05-pricing/       # Pricing & ACV stress test
    ├── 06-competitive/   # Industry-driven friction modifier + table-stakes prefill
    └── 07-discovery/     # Scaffolded
```

## Phase 1 + Phase 2 — done

- **7fbe610** Phase 1: scaffold static engine for Cloudflare Pages
- **0b5b949** Module 01: industry-aware hurdle + per-industry coaching
- **f5caa67** Module 06: industry-driven friction modifier + table-stakes prefill
- **50b85e1** Launchpad: rollup status panel + central industry alignment
- **8a183f5** UX pass: toasts, inline field errors, focus + Enter, mobile tightening
- **77a0b73** Module 05 (Pricing & ACV stress test); move admin to `/admin/`

## Phase 3 — open work

These modules have an `index.html` but were not built out to the same depth as
01 / 05 / 06:

- **Module 02 — Segmentation** (218 lines): needs the same industry-aware
  treatment as 01 — which segments are most reachable for which industry,
  per-industry segmentation coaching, rollup status integration.
- **Module 03 — Sizing** (277 lines): TAM/SAM/SOM logic should pull from
  `market-sizing-data.json` and `market_scenarios.json`. Verify the scenarios
  file is actually used, not just shipped (it's 11MB).
- **Module 04 — Canvases** (205 lines): driven by `data/canvases.json`. Needs
  the launchpad rollup hookup that 01 and 06 have.
- **Module 07 — Discovery** (248 lines): customer discovery prompts and
  capture. Should feed back into 01's hurdle calc once interviews are logged.

Cross-cutting:
- **Persistence** — current state lives in `shared/core.js` (likely
  localStorage). No server. If multi-device or multi-user is needed,
  this is the architectural boundary that will move first.
- **Admin** — `/admin/` exists but contents need to be reviewed for what it
  exposes and who should see it.
- **Mobile** — UX pass tightened mobile but didn't fully test all seven
  modules on narrow viewports.

## Things the next session should know

1. **Industry alignment is the spine.** `shared/core.js` carries the
   selected industry and modules read from it. When wiring 02/03/04/07, do
   it the same way 01 and 06 do — don't add a parallel mechanism.
2. **The launchpad rollup is the single status surface.** New modules
   should report into the rollup panel, not invent their own status UI.
3. **`market_scenarios.json` is 11MB.** Don't ship it to the browser
   uncritically. Either lazy-load on demand, move to a Cloudflare KV/R2
   lookup, or generate a slimmer subset at build time.
4. **No build step.** This is intentionally static — flat HTML/CSS/JS so
   it deploys to Cloudflare Pages with zero config. Don't introduce a
   bundler without a strong reason.
5. **`im-data.json` is Innovate Mississippi specific.** If this tool gets
   used by other clients, that file needs to become a per-tenant
   configuration, not a hard-coded fixture.

## Decision pending: revive vs. retire this branch

A parallel clean-slate build is starting on `copath-teaching-tool-sandbox`
based on a fresh spec, with the explicit direction: "build from specs, not
to the old specs." Before committing more work to this branch, decide:

- **Revive** this branch and finish Phase 3 here, treating the new
  branches as a separate (CoPath teaching tool) product.
- **Retire** this branch. Cherry-pick anything genuinely reusable into the
  new branches, then archive.
- **Run both in parallel** — this branch as the existing market-validation
  app, the new branches as the teaching tool. They share a name space but
  not a codebase.

The third option is what was discussed when the new branches were created.
