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

Pass 3B — Journey Registry Foundation is implemented and verified within the checks recorded below. Paris-Saclay and CUC now share a data-driven
milestone contract and pure progress queries; the transition is sampled as data only. The current
Saclay runtime composition and the 3A.1 input/movement contract are preserved. CUC is logical only:
no runtime scene, new narration, visual transition, or new runtime assets have been added.

Pass 3B is accepted. The Pass 3C asset-readiness blocker has been cleared at source level: eight
Saclay P0 originals are consolidated under `design-assets/source/experience/saclay/`. They remain
pending runtime QA and derivatives. Runtime implementation has not begun; the approved keyframes
remain targets, not descriptions of the currently rendered scene.

## Architecture

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Three.js, and React Three Fiber; npm manages dependencies and scripts.
- `app/page.tsx` renders the client-side Experience prototype in `app/experience-prototype.tsx`; global page and overlay styles live in `app/globals.css`.
- `lib/journey.ts` owns milestone/transition contracts, registry, directional crossing, bounded targets, phase retention, slowdown and framing queries, and transition/reveal sampling. No global store or separate controller was introduced.
- Centers are Saclay `0.24` and CUC `0.64`; stable/transition boundaries are `0.015 / 0.345 / 0.535 / 0.985`. These are foundation parameters, not final visual timing. Transition reveal sampling spans `0.41–0.535` and does not reveal any runtime art yet.
- The existing scene still renders only Saclay art. CUC narration fields and desktop/mobile framing are null; no CUC camera emphasis or character reaction is introduced. Its logical approach, active, passed, hysteresis, and slowdown are available.
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
| Pass 3B journey foundation | verified | Deterministic checks, lint, typecheck, production build, diff check, desktop/mobile regression, controls and accessibility checks passed; evidence is recorded below. |
| New Saclay/CUC visual targets | designed | Approved original PNG keyframes are preserved under `design-assets/keyframes/experience/`. No winter/autumn runtime layers are implemented. |
| Pass 3C winter Saclay conversion | designed | Campus, snow-road/edge/bank and winter-vegetation source art is present; runtime QA, derivatives and integration have not begun. |
| Experience asset consolidation | verified | Six approved keyframes and eight Saclay P0 source PNGs are indexed in-repo; imported files matched their external sources by byte count and SHA-256. |
| Hub choice point and Project House | planned | World model is recorded, but neither scene is implemented. |
| CUC logical milestone | verified | Center, windows, bidirectional crossing, slowdown and hysteresis passed deterministic/browser checks; narration and framing are null. |
| CUC visual milestone | designed | Approved autumn keyframe exists. No runtime scene or additional Experience copy is implemented. |
| Projects, About, bilingual routing, Personal AI | planned | Outside the current prototype. |
| Public CV entry | planned | No updated public CV is available. Do not expose a download or availability notice. |
| Final positioning copy | planned | Any current positioning sentence is temporary and must remain easy to replace. |

## Approved direction

- Preserve the organic long S-shaped road, generous whitespace, alternating landmark opportunities, and continuous journey rhythm.
- Experience should feel like walking with Peiwen through her experiences: playful and spatial, while still reading as a portfolio.
- The current visual targets are the approved 2.5D hand-drawn picture-book keyframes: Saclay winter night (blue-violet, snow, moon, warm windows) and CUC autumn sunset (pink/orange sky, ginkgo, campus clocktower). These supersede the earlier mostly-monochrome art direction.
- Three.js/R3F supplies space, path, camera and runtime transitions; illustration layers supply the visual style; semantic DOM supplies Experience narration. Do not convert the artwork into realistic or game-style 3D.
- Experience milestones are illustrated places with readable DOM text in nearby negative space, not cards or a conventional CV timeline.
- Only confirmed facts may appear. Current confirmed content is Peiwen Zhang, HCI × AI Agents, Université Paris-Saclay, Human-Computer Interaction, and 2025–Present.

## Known constraints and open issues

- The preserved Saclay runtime composition is the 3A.1 regression baseline. The large Eiffel / paper academic vignette is historical composition, superseded as a future target by the approved winter keyframe.
- The left-vignette / road / right-text composition is strongest at arrival; the existing follow camera moves the vignette across the frame during approach.
- Mobile uses an explicit portrait framing adjustment and a smaller Eiffel fit to keep Peiwen, text, and the full landmark visible.
- Real-device performance and touch feel remain unverified; browser emulation is not physical-device testing.
- Keyframes are flattened images with text and occluded backgrounds, not runtime assets. Use the
  consolidated Saclay source layers for deterministic derivative work; do not load source PNGs
  directly or regenerate/reconstruct missing artwork without an approved asset-production scope.
- CUC identity, period and summary are unconfirmed. The movement/transition reference video has not been supplied for this pass.
- `THREE.Clock` emits its existing deprecation warning. Node 22's deterministic script emits type-stripping/module-detection warnings; it runs without a new dependency or package module-mode change.
- Do not fabricate employers, roles, dates, outcomes, or academic details.
- Do not add free exploration, game pressure, complex 3D, a large animation system, or new dependencies without a demonstrated need.

## Verification baseline

Pass 3B checks (2026-09-13):

- `npm.cmd run lint`, `npm.cmd run typecheck`, production build with telemetry disabled, and `git diff --check`: passed. The homepage remains statically prerendered.
- `node --experimental-strip-types scripts/check-journey.mjs`: 1222 assertions passed, including both milestones' boundaries, bidirectional crossing and retention, departure, lead/global bounds, transition/reveal sampling, registry consistency, and frozen 3A.1 target-formula parity around Saclay.
- Browser: desktop 1440×900 and mobile 390×844, plus repeated 320/768/1440/390 resizing, passed without overflow or clipped narration.
- Six controlled reduced-motion screenshots (desktop/mobile × approach `0.16`, arrival `0.24`, retained departure `0.32`) matched the pre-migration checkpoint pixel-for-pixel. This is sampled visual equivalence, not a claim about every possible frame.
- Real browser input: wheel, all eight movement keys, horizontal/vertical emulated touch, forward/reverse crossings, and hysteresis retention/release for both milestones passed. Repeated input can continue through a milestone; no forced stop was added.
- Lateral input still hides the intro, subdues the hint and clears self-talk. Skip-link and Canvas keyboard focus passed. CUC exposes only `main` data attributes, no new narration or debug UI; confirmed Saclay details remain accessible through the skip link.
- Legacy `?arrival=1`, named `?arrival=paris-saclay` / `?arrival=cuc`, and unknown-ID fallback passed. Saclay aria-live text is unchanged; CUC has no invented announcement.
- Reduced-motion checks at both centers: zero relevant DOM animations, `0s` transitions, and identical settled Canvas captures 1.2 seconds apart. No page errors, console errors, failed requests or HTTP errors were observed.
- Both repository keyframe copies match their attachment originals by SHA-256. CSS, runtime assets, character, road geometry and rendering constants were not edited.

Historical checks on 2026-09-12 (Pass 3A + 3A-fix takeover audit; issues below were addressed by 3A.1):

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

1. Resume the authorized Saclay-only conversion with a runtime-asset QA pass for the eight imported
   P0 sources: inspect alpha/halos, crop, resize, compress and browser-validate derivatives while
   preserving the original PNGs. Existing Eiffel and Peiwen may be reused.
2. Establish static
   desktop/mobile composition first, then sparse ambient movement. Preserve registry/input semantics;
   do not begin CUC or the Saclay-to-CUC visual transition. Run the complete Pass 3C validation matrix
   after implementation; no new visual verification is claimed by the asset audit.
3. Use the existing transition samples only when visual transitions are authorized. No BiomeChunk,
   full JourneyController, independent JourneyCamera, shader weather, streaming framework, Hub or
   Project House has been introduced.

Historical naming: the earlier proposed "Pass 3B entry ritual + ambient life" was not implemented.
The current Pass 3B means Journey Registry Foundation. The entry ritual and butterfly runtime
derivatives remain deferred; they are not part of the next task by default.

## Last updated

2026-09-13
