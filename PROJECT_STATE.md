# PROJECT_STATE - peiwen-portfolio

- Project name: peiwen-portfolio
- Repository path: `C:\Users\21781\Documents\ChatGPT\Peiwen-portfolio`
- Purpose: Create Peiwen Zhang's personal portfolio for HCI, UX research, UX engineering, and research opportunities.
- State baseline: This document records durable project state. Verify current branch, `HEAD`, remote relationship, and dirty state live when they matter.
- Maintenance rule: Read this document before significant work. Update it when durable facts change and refresh the last-updated date.

## Status definitions

- `planned`: The requirement or direction is recorded, but no approved design or implementation exists.
- `designed`: A concrete design has been approved, but implementation is incomplete.
- `implemented`: Working code exists, but required verification is incomplete.
- `verified`: Implementation exists and the recorded checks have passed.

## Current goal

Initialize a minimal, runnable Next.js portfolio foundation without implementing the full visual design.

## Architecture

- Next.js App Router application in `app/`.
- TypeScript for application code.
- Tailwind CSS for styling.
- Reusable UI will live in `components/`; non-UI shared logic will live in `lib/` when needed.
- npm manages dependencies and scripts.

## Delivery status

| Scope | Status | Evidence |
| --- | --- | --- |
| Bootstrap contracts and workflow skills | verified | Required files, metadata, frontmatter, folder names, and source-copy hashes passed validation on 2026-09-09. |
| Minimal Next.js application foundation | verified | Lint, typecheck, and production build passed on 2026-09-09. |
| Homepage content hierarchy: Hero, Experience/CV, then Projects | planned | Product direction recorded; no approved design or section implementation yet. |
| Continuous Hero-to-Experience visual experience | planned | Visual intent recorded; no approved design or animation implementation yet. |
| Light, airy, playful micro-universe art direction | planned | Art direction recorded; no approved design system yet. |
| Chinese/English language switching | planned | English-first direction recorded; no localization implementation yet. |
| Personal AI / "Ask me about Peiwen" | planned | Future concept only; no architecture or implementation yet. |

## Current work

- Initialization is complete; full homepage content and visual design have not started.

## Known issues and constraints

- No final homepage design, content, CV asset, project case studies, or production imagery has been supplied.
- Animation tooling is intentionally undecided and not installed.
- Accessibility, responsive layout, and performance must be validated as the user-facing design is implemented.

## Verification

- `npm install`: passed; 365 packages audited with 0 vulnerabilities. npm reported a non-blocking Windows `EPERM` cleanup warning for an optional nested WASM dependency directory.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with `NEXT_TELEMETRY_DISABLED=1` to avoid a host-specific cross-device rename error in Next.js's global telemetry config path.
- Bootstrap contracts, skill frontmatter, folder names, exact source-copy hashes, and absence of animation dependencies: passed.
- `git diff --check`: passed.

## Next steps

Define the English homepage content and visual direction, beginning with the Hero-to-Experience/CV flow before Projects; keep localization and Personal AI as later planned phases.

## Last updated

2026-09-09
