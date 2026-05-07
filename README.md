# CoPath Teaching Tool

A clean-slate build of a teaching tool for the CoPath methodology. This is
**not** a continuation of the prior market-validation engine — it is a fresh
project starting from spec, deliberately not inheriting the legacy code.

## Branch model

This repository hosts two long-lived branches for this project:

- **`copath-teaching-tool-sandbox`** — where all development happens.
  Experimental, broken, and in-progress states are expected here.
- **`copath-teaching-tool-prod`** — stable. Cloudflare deploys from here.
  Only merged into from sandbox after a feature is verified.

Flow: `sandbox` → (verify) → merge into `prod` → Cloudflare deploys.

Both branches are orphan branches — they share no history with the older
`claude/market-validation-app-*` branch, which lives on as the prior
market-validation app and is paused pending a revive/retire decision (see
that branch's `docs/PHASE-3-HANDOFF.md`).

## Where to start

1. Read **`DESIGN-PRINCIPLES.md`** — the non-negotiables for this build.
2. Fill out **`SPEC.md`** before writing any code. This is the spec the
   build follows. If something isn't in the spec, it doesn't get built;
   if a code change conflicts with the spec, the spec wins or gets
   amended explicitly.
3. Only after `SPEC.md` is complete, begin scaffolding.

## What this is not

- Not a refactor of the prior engine.
- Not a market-validation tool. It is a **teaching tool** for CoPath's
  methodology — different audience, different goal, different shape.
- Not a SPA framework playground. The default stance is static
  HTML/CSS/JS unless `SPEC.md` documents a real reason to escalate.
