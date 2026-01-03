### Agent Operating Rules (FormMapper Repo)

This repo’s **north star** is `FORMMAPPER_NORTH_STAR.md`.

All work (code, UX, schema, and architecture) must follow it.

---

## Hard rules

- **North star wins**: If there is a conflict between code and `FORMMAPPER_NORTH_STAR.md`, treat the code as wrong unless the doc is intentionally updated.
- **No silent divergences**: If you need to change behavior, schema, UX, or invariants, update `FORMMAPPER_NORTH_STAR.md` first (or in the same change) and explain why.
- **Locked UX is locked**: The non-negotiable UX decisions in the north star are not optional.
- **Seconds are canonical**: The internal model uses seconds for x-axis. Timebase modes are view/adapters.
- **Maintain invariants**: Section gaplessness and curve absolute time are core. Never introduce gaps/overlaps or ripple curve points.
- **Deterministic IO**: Import repairs must be deterministic; export must match schema exactly.

---

## What to do when uncertain

- Re-read `FORMMAPPER_NORTH_STAR.md` sections:
  - UX locks
  - Invariants
  - Interaction semantics
  - IO requirements
- If still ambiguous, propose a minimal MVP decision and record it in the north star before implementing.

---

## Definition of “done” (MVP)

The acceptance criteria listed in `FORMMAPPER_NORTH_STAR.md` must be met before claiming MVP complete.


