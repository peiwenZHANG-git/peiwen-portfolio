# PROJECT_STATE - peiwen-portfolio

- Project: Peiwen Zhang's English-first portfolio for France HCI / UX Research / UX Engineer internships and HCI / AI research opportunities.
- Long-term focus: HCI × AI Agents.
- State rule: this file records durable facts only. Inspect branch, `HEAD`, remote, and dirty state live.

## Status definitions

- `planned`: direction recorded; no approved implementation exists.
- `designed`: a concrete direction is approved; implementation is incomplete.
- `implemented`: working code exists; required verification or visual approval is incomplete.
- `verified`: implementation exists and the recorded checks passed.

## Current goal

Hand off the current interactive Experience prototype for a focused visual-direction pass. Preserve the path, controls, camera behavior, Peiwen movement, semantic text, accessibility, and responsive baseline while refining composition. Stop before CUC, the full Hub, or Project House.

## Architecture

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Three.js, and React Three Fiber; npm manages dependencies and scripts.
- `app/page.tsx` renders the client-side Experience prototype in `app/experience-prototype.tsx`; global page and overlay styles live in `app/globals.css`.
- The Experience road is a `THREE.CatmullRomCurve3` ribbon. Peiwen is constrained to progress along the curve with a small lateral offset.
- Wheel, W/S, and Up/Down control path progress. A/D and Left/Right control lateral offset. Pointer swipes provide the mobile equivalent.
- A restrained third-person camera follows behind and above Peiwen and looks ahead along the path.
- Peiwen uses four optimized back-walking WebP frames. World details use transparent sprite planes and lightweight native R3F frame updates.
- Experience information remains semantic DOM content beside the Canvas. A skip link, visible focus treatment, screen-reader arrival status, and reduced-motion behavior are present.
- Optimized runtime assets live under `public/assets/`. Approved source sheets and composition references live separately under `design-assets/`.

## Delivery status

| Scope | Status | Evidence |
| --- | --- | --- |
| Bootstrap contracts and workflow skills | verified | Repository bootstrap files and both workflow skills are present. |
| Next.js / TypeScript foundation | verified | Lint, typecheck, and production build passed on 2026-09-11. |
| Constrained R3F Experience path | verified | Forward/backward and lateral keyboard controls, wheel input, mobile swipe, camera follow, and responsive viewport checks passed. |
| Peiwen walking presentation | verified | Approved Peiwen source identity is represented by four runtime walking frames; reduced motion disables idle movement. |
| Paris-Saclay Experience milestone | implemented | Eiffel and academic vignette, semantic DOM text, approach/arrival behavior, fireflies, grounding, and mobile composition exist. Automated checks passed; current visual composition still awaits manual approval. |
| Current Paris-Saclay picture-book composition | implemented | Latest desktop/mobile screenshots exist outside the repository. Eiffel prominence and final balance remain under visual review. |
| Hub choice point and Project House | planned | World model is recorded, but neither scene is implemented. |
| CUC milestone | planned | Source sheets exist only. No CUC runtime milestone or content is implemented. |
| Projects, About, bilingual routing, Personal AI | planned | Outside the current prototype. |
| Public CV entry | planned | No updated public CV is available. Do not expose a download or availability notice. |
| Final positioning copy | planned | Any current positioning sentence is temporary and must remain easy to replace. |

## Approved direction

- Preserve the organic long S-shaped road, generous whitespace, alternating landmark opportunities, and continuous journey rhythm.
- Experience should feel like walking with Peiwen through her experiences: playful and spatial, while still reading as a portfolio.
- The world is light, airy, personal, mostly monochrome, and hand-drawn. Accent color appears sparingly as life, focus, or guidance.
- Experience milestones are illustrated places with readable DOM text in nearby negative space, not cards or a conventional CV timeline.
- Only confirmed facts may appear. Current confirmed content is Peiwen Zhang, HCI × AI Agents, Université Paris-Saclay, Human-Computer Interaction, and 2025–Present.

## Known constraints and open issues

- The latest Paris-Saclay composition is a reviewable prototype, not approved final art direction.
- On the sampled desktop arrival, Eiffel occupies roughly 37–40% of viewport height, above the earlier 20–28% suggestion. Manual judgment is needed.
- The left-vignette / road / right-text composition is strongest at arrival; the existing follow camera moves the vignette across the frame during approach.
- Mobile uses an explicit portrait framing adjustment and a smaller Eiffel fit to keep Peiwen, text, and the full landmark visible.
- Real-device performance and touch feel remain unverified; browser emulation is not physical-device testing.
- Do not fabricate employers, roles, dates, outcomes, or academic details.
- Do not add free exploration, game pressure, complex 3D, a large animation system, or new dependencies without a demonstrated need.

## Verification baseline

Checks completed on 2026-09-11:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with `NEXT_TELEMETRY_DISABLED=1`; the homepage is statically prerendered.
- `git diff --check`: passed.
- Browser widths 320, 390, 500, 700, 768, 1024, 1440, and 1920px: no document overflow or clipped semantic text.
- Keyboard forward/backward/lateral controls, wheel progress, mobile swipe, and skip-link focus: passed.
- Reduced motion: DOM transitions are disabled and the stabilized Canvas remains unchanged across repeated captures.
- Runtime assets loaded successfully; no page, console, or failed-request errors were reported.

## Next step

On the visual-direction working branch, review `CLAUDE_HANDOFF.md`, `VISUAL_DIRECTION.md`, and `ASSET_INDEX.md`, then refine only the current Experience / Paris-Saclay visual composition from user feedback. Do not begin CUC, the full Hub, Project House, or new systems.

## Last updated

2026-09-11
