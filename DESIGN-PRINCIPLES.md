# Design Principles — CoPath Teaching Tool

These are the **locked-in** principles for this build. They are decided.
Changing one requires an explicit conversation, not a quiet drift inside a
PR.

## 1. Teaching tool first

This is a tool that teaches the CoPath methodology to its user. It is not a
calculator that happens to have explanations. Every interaction should leave
the user understanding *why* the next step exists, not just clicking through
it.

Implication: explanatory copy, callouts, and "why we ask this" affordances
are first-class UI, not afterthoughts.

## 2. Classic GUI aesthetic, branded-muted chrome

The visual language is classic-GUI — the lineage of Mac System 7,
Windows 95, Windows 2000, and BeOS. Defined regions, visible chrome,
honest controls. **Not** flat-modern, **not** glassmorphic, **not**
brutalist-as-aesthetic.

Chrome is **branded but muted**: brand colors carry through to title bars,
borders, accents, and active states, but desaturated enough that they read
as system chrome rather than marketing. The brand is present, not loud.

Implication for tomorrow's spec: pick a single pixel-accurate reference
(e.g. "Win2K Luna with brand-shifted hues" or "System 7 with brand-tinted
title bars") and commit to it. Mixing eras reads as confused, not eclectic.

## 3. Modular by construction

Each teaching module is independently:
- Loadable
- Testable in isolation
- Replaceable without breaking the rest

If a change to module N requires changes inside module M's files, that's a
shared-layer concern that belongs in the shared layer — not a cross-module
edit.

## 4. Build from this spec, not from the prior codebase

The previous market-validation engine on
`claude/market-validation-app-R8laN` is a different product. Do **not**
port code, structure, or assumptions from it. Patterns can be referenced,
code cannot be copied. If something from the old build is genuinely
worth keeping, it gets re-derived from this spec, not inherited.

## 5. Static-first

Default deployment target: Cloudflare Pages serving flat HTML/CSS/JS.
No bundler, no framework, no build step unless `SPEC.md` documents a
specific feature that requires one. The constraint forces simplicity and
keeps the teaching content the focus.

If state needs to outlive a tab, default to localStorage. Escalate to a
backend only when the spec calls for multi-device, multi-user, or
authoritative state — not preemptively.

## 6. Two branches, one direction of flow

`sandbox` is the workshop. `prod` is the showroom. Code only ever flows
sandbox → prod, never the reverse. If `prod` needs a hotfix, it gets made
in `sandbox` first and then merged forward.

## 7. The spec is the contract

`SPEC.md` is the single source of truth for what this tool is and does.
Disagreements between code and spec resolve in favor of the spec, or the
spec gets amended on purpose. Speculative features, "while we're at it"
additions, and undocumented behaviors don't belong in `prod`.
