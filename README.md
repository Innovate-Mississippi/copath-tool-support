# CoPath Teaching Tool

A free, static web tool that helps high-tech / high-growth / equity-track
startup founders honestly evaluate whether their idea is worth pursuing —
and hands them a concrete artifact pointing at the next three things to do.

Built as a small rule engine on top of curated content tables, in the
philosophical lineage of NHL 98, early SimCity, and Roguelikes: a tiny
runtime, rich tables, hand-tuned dials, emergent coaching moments, no
prescribed program.

> **North Star:** the founder leaves feeling competent, energized,
> challenged — but not overconfident.

## Branch model

- **`copath-teaching-tool-sandbox`** — workshop. All development happens
  here. v0.1 lives here as of this commit.
- **`copath-teaching-tool-prod`** — stable. Cloudflare deploys from here.
  Merge from sandbox after a feature is verified.

Both branches are orphan branches — they share no history with the older
`claude/market-validation-app-*` branch (which is paused; see that
branch's `docs/PHASE-3-HANDOFF.md`).

## Status

**v0.1 is built and on `copath-teaching-tool-sandbox`.** End-to-end:
engine + chrome + 58 hand-curated content rows + exit artifact + JSON
save/load. See **`BUILD-NOTES.md`** for what was decided, what was
deferred, and where to look first.

## How to run it

The tool needs a local HTTP server (browsers won't `fetch()` JSON over
`file://`). From the repo root:

```sh
python3 -m http.server 8000
# or
npx http-server -p 8000
```

Then open `http://localhost:8000`. Pick a mode, answer the orienting
questions, navigate the regions, watch the evidence meters move. Click
**Brief** to generate a printable one-page brief from your session.

To stop: `Ctrl-C` the server.

## Project layout

```
.
├── SPEC.md                      The contract. Read this first.
├── DESIGN-PRINCIPLES.md         Non-negotiables: classic-GUI, branded-muted,
│                                values-layer, tables-as-data, sandbox→prod.
├── BUILD-NOTES.md               What got built in v0.1, decisions, caveats.
├── README.md                    This file.
│
├── index.html                   Entry point. Wires engine to chrome.
├── styles/chrome.css            Win2K Classic styling, branded-muted palette.
│
├── engine/                      Plain ES modules, no framework, no build step.
│   ├── state.js                 World state model + getters/setters.
│   ├── scoring.js               Confidence-weighted evidence-strength scores.
│   ├── persistence.js           Save / load JSON state (no backend).
│   ├── tables.js                Table loader + novelty-weighted row picker.
│   ├── templates.js             Grammar template filler (4 allowed shapes).
│   ├── rules.js                 Rule evaluator with explainable trace.
│   ├── chrome.js                Render orchestrator — DOM updates.
│   └── main.js                  Boot + event wiring + integration.
│
├── data/                        Content. JSON only — no code, no build.
│   ├── industry-archetypes.json     15 archetypes, cited, MS-context.
│   ├── discovery-questions.json     25 Socratic questions w/ bad-version pairs.
│   ├── anti-patterns.json           18 patterns w/ non-crushing reframes.
│   ├── region-questions.json        6 regions, 25 founder-facing questions.
│   ├── orienting-questions.json     4-question entry funnel.
│   ├── out-of-scope-routing.json    SBDC redirect copy for non-fit ventures.
│   ├── rules.json                   10 rules + 2 contradiction detectors.
│   └── templates.json               12 grammar templates across 4 shapes.
│
├── config/                      Tuning. Numbers, no logic.
│   ├── tuning.first-run.json        To $100K. Gentler thresholds.
│   ├── tuning.second-lap.json       To $1M. Standard pace.
│   └── tuning.open-market.json      Hard mode. Sharper everything.
│
└── brief/
    └── brief.html               Exit artifact. Printable one-page brief.
```

## Adding content

The whole point of the table-driven design: **content grows by editing
JSON files, no code changes, no deploy required for content.**

- New industry archetype → add a row to `data/industry-archetypes.json`.
- New discovery question → add a row to `data/discovery-questions.json`.
- New anti-pattern → add a row to `data/anti-patterns.json` (must include
  a constructive reframe per the values rule — see `SPEC.md` §7).
- New rule → add to `data/rules.json` `rules` array.
- New template → add to `data/templates.json` `templates` array (must be
  one of the four allowed shapes from SPEC §7.2).
- New mode dial → add to all three `config/tuning.*.json` files (with
  documentation in `_dial_docs`).

## What this tool is NOT

- Not a funding pipeline. Completing this implies nothing about Innovate
  Mississippi investment.
- Not a tool for brick-and-mortar / lifestyle / consulting / nonprofit /
  social-entrepreneurship ventures — those route to the SBDC partnership
  via the orienting funnel.
- Not a SaaS. No accounts, no backend, no telemetry. Your state is a JSON
  file you own.
- Not a verdict on you or your idea.

See `SPEC.md` §2 for the full out-of-scope list.
