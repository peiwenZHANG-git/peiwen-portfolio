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

Pass 3A.1 interaction-contract hardening is implemented and verified. Wheel, keyboard, and swipe
share one bounded progress-target contract; milestone crossing is retained through the active
window; lateral-only movement participates in shared movement side effects; and subdued hint text
meets the normal-text contrast target. Pass 3B and the Saclay-to-CUC slice have NOT been started.

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
| Paris-Saclay Experience milestone | implemented | Eiffel and academic vignette, semantic DOM text, approach/arrival behavior, fireflies, grounding, and mobile composition exist. |
| Pass 3A + 3A-fix composition and pacing | verified | Visually approved by Peiwen on 2026-09-12. Lint, typecheck, production build, desktop/mobile browser checks, controls, resize, and reduced motion passed in the takeover audit. |
| Keyboard controls after Pass 3A | verified | Live check 2026-09-12: see Verification baseline. |
| Reduced motion after Pass 3A | verified | Edge was launched with `prefers-reduced-motion: reduce`; CSS transitions were `0s`, DOM animation count was zero, and the settled Canvas remained unchanged across captures. |
| Pass 3A.1 interaction contract | verified | Bounded wheel/keyboard/swipe progress, forward and reverse milestone crossing, lateral movement side effects, 4.63:1 subdued-hint contrast, responsive resize, and reduced motion passed on 2026-09-12. |
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
- The bounded/crossing-aware contract is verified for the current single milestone. Multiple milestones still require a data-driven milestone registry rather than additional hard-coded constants.
- Do not fabricate employers, roles, dates, outcomes, or academic details.
- Do not add free exploration, game pressure, complex 3D, a large animation system, or new dependencies without a demonstrated need.

## Verification baseline

Checks completed on 2026-09-12 (Pass 3A + 3A-fix takeover audit):

- Live visual review at desktop ~900px and mobile 390px: opening frame, approach frames, arrival
  frame, and the self-talk bubble. Approved by Peiwen.
- Keyboard: PASS. Tab 1 focuses the skip link, which slides into view with a visible focus
  treatment; Tab 2 focuses `div.scene-canvas` (`tabindex=0`,
  `aria-label="Walk with Peiwen along the Experience path"`); ArrowUp/w walk forward, ArrowDown/s
  walk backward, d/ArrowRight and a/ArrowLeft shift laterally. Forward/backward input drives the
  movement side effects (intro `data-hidden` flips to true and the controls hint becomes subdued);
  lateral-only input does not, as recorded under Known constraints.
- Keyboard milestone activation: PASS. W reached `approaching` and `active`; S returned to `distant`.
- Wheel reached the active Paris-Saclay milestone. A long emulated mobile swipe crossed the active
  window and continued to `approaching`; this is recorded as a known interaction issue rather than a pass.
- Reduced motion: PASS in Edge emulation. The preference matched, relevant CSS transitions were
  `0s`, DOM animation count was zero, and the settled Canvas was stable across repeated captures.
- `npm run lint`, `npm run typecheck`, and `npm run build`: passed. The homepage remained statically
  prerendered. `git diff --check` passed.
- Desktop 1440x900 and mobile 390x844 opening, approach, arrival, self-talk, information UI, and
  responsive resize checks completed. No page errors, console errors, or failed requests occurred.
  Three.js emitted its existing `THREE.Clock` deprecation warning.

Checks completed on 2026-09-12 (Pass 3A.1):

- `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check`: passed.
- Wheel, W/S, Up/Down, A/D, Left/Right, vertical swipe, and horizontal swipe: passed through
  the bounded movement contract and shared movement side effects.
- An extreme wheel delta and a 560px mobile swipe reached Paris-Saclay and remained `active` after
  settling. A second input continued past the milestone; reverse crossing returned to `active`.
- Desktop 1440x900, mobile 390x844, widths 320/768/1440 and repeated resizing: no page overflow or
  clipped semantic milestone text. The approved Paris-Saclay composition was unchanged.
- Subdued controls-hint effective contrast: 4.63:1 against the warm paper background.
- Reduced-motion Edge emulation: matched, all relevant transitions `0s`, zero DOM animations, and
  stable settled Canvas.
- No page errors, console errors, or failed requests. The existing `THREE.Clock` deprecation warning
  remains.

Checks completed on 2026-09-11 (pre-Pass-3A baseline):

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with `NEXT_TELEMETRY_DISABLED=1`; the homepage is statically prerendered.
- `git diff --check`: passed.
- Browser widths 320, 390, 500, 700, 768, 1024, 1440, and 1920px: no document overflow or clipped semantic text.
- Keyboard forward/backward/lateral controls, wheel progress, mobile swipe, and skip-link focus: passed.
- Reduced motion: DOM transitions are disabled and the stabilized Canvas remains unchanged across repeated captures.
- Runtime assets loaded successfully; no page, console, or failed-request errors were reported.

## Next step

1. Wait for Peiwen's approval before beginning another implementation pass. The movement/progress
   invariant is now safe enough for the Saclay-to-CUC vertical-slice foundation, but CUC content,
   composition, and runtime derivatives still require explicit approval.
2. Pass 3B remains separately scoped as: an entry ritual (Peiwen stands still, a
   cluster of fireflies gathers in front of her with a quiet "follow us", click/tap activates the
   journey, some fireflies stay with her while others move ahead, and only then do wheel / keyboard
   / swipe controls become active) and restrained authored ambient life (butterflies drifting,
   fireflies hovering and guiding, dandelion seeds floating) with no particle-like chaos or
   path-wide random animation.

Note for Pass 3B: butterflies are NOT implemented anywhere in the runtime today. The source sheet
`design-assets/ambient-life/butterfly-ambient-set-v1.jpg` exists but no runtime WebP derivative has
been produced, so adding them requires an asset pass first.

Do not begin CUC, the full Hub, Project House, or new systems.

## Last updated

2026-09-12
