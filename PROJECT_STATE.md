# PROJECT_STATE - peiwen-portfolio

- Project: Peiwen Zhang's English-first portfolio for France HCI / UX Research / UX Engineer internships and HCI / AI research opportunities.
- Long-term focus: HCI × AI Agents.
- State rule: this file records durable facts only. Inspect branch, `HEAD`, remote, and dirty state live.

## Status definitions

- `planned`: direction recorded; no approved implementation exists.
- `designed`: a concrete direction is approved; implementation is incomplete.
- `implemented`: working code exists; required verification or visual approval is incomplete.
- `verified`: implementation exists and the recorded checks passed.

## Current goal — Visual direction integration (`/` + `/projects`)

- Status: implemented and route-verified as of 2026-09-25. The real Projects bundles
  and detail routes from `codex/projects-real-bundles` are integrated with the approved
  Home desk and visual-direction work, without changing the approved visual system.
- Routing: `/` defaults to `HomeDesk`; `?hub=1` preserves `HomeHub`; all historical
  `peiwen-phase1…5` and `static-reconstruction` HomeMaster flags remain available.
  `/projects` and its eight case-study routes are live routes. `/experience` and
  `/about` remain illustrated destinations.
- Shared chrome: `PageTransitionProvider`, `WorldLink`, and `SiteAudio` are mounted once
  in the root layout; the Projects header target is `/projects`; the About label is
  "About me".
- Home opening: room lighting/window reveal timing is slower, window and lamp hints are
  clearer, post-lamp text appears faster, and the entrance glow loops. The Projects
  entrance remains `/projects`.
- Merge-quality fixes were limited to lint compatibility: reduced-motion About settling
  is scheduled through a timer, and the inner-page keepsake uses Next `Link` instead of
  a raw internal anchor. No visual composition or interaction was changed.
- Verification: `npm run lint` has 0 errors and 5 pre-existing-style warnings;
  `npm run typecheck` passes; `npm run build` passes and prerenders all Projects routes.
  Real-browser checks at 1440×900 covered `/`, `/experience`, `/projects`, `/about`, and
  `/projects/reso`: all returned HTTP 200, rendered visible content, and had zero console
  errors. The Reso video preload was interrupted by closing the browser, while a direct
  HEAD request confirmed the 986,762-byte MP4 is served with HTTP 200.

## Flower-fairy little Peiwen — 2026-09-25

- The flower-fairy opening guide and global little-Peiwen companion use the user-supplied
  fairy sheet and deterministic cutouts from `scripts/prepare-fairy-sprites.py`.
- On Home, the fairy waits by the window and lamp, taps the lamp, then flies to the
  bottom-right corner and hands off to the companion. It replaces text hints for guided
  first openings and is skipped for reduced motion, portrait screens and returning visitors.
- Every page has the corner companion with preset questions, answers, copy-email and links.
  "Ask me anything" is phase 1 without AI; entries marked `draft: true` await Peiwen.
- Experience footnotes reserve the bottom-right corner, and the dev badge moves to the
  bottom-left. About Email is a copy button whose paper note falls back to a selectable
  address when the clipboard is unavailable.
- Verification for this checkpoint: `npm run lint` has 0 errors and 5 pre-existing warnings;
  `npx tsc --noEmit` passes; `npm run build` passes.

## Inner-page return keepsake — 2026-09-25

- Implemented: `WorldLink` sits at the top-left beneath the measured site header.
  At 1000–1499px, the words fold away and unfold on hover or keyboard focus;
  below 1000px, content after the header receives margin for a dedicated tag row.
- The Next development indicator is positioned at bottom-right.
- Verified for this checkpoint: `npm run lint` (0 errors, 5 warnings outside the
  changed files), `npx tsc --noEmit`, and `npm run build` (17/17 static pages).
  Browser visual and interaction checks were not rerun for this commit-only task.

## Lint warning cleanup — 2026-09-30

- Verified: `npm run lint` now reports 0 errors and 0 warnings (the run before this
  change showed 4 warnings, not the 5 recorded above). Fixes: removed the unused
  `setAnnouncement` setter in `app/home-hub.tsx` and the unused `slope` local plus its
  imports in `app/projects/slots.ts`; added repo-convention `eslint-disable-next-line`
  comments for the Experience shelf keepsake `<img>` (`no-img-element`) and the
  reference-only `design-assets/about/layout.js` excerpt (`no-unused-vars`).
- No page appearance, copy or interaction changed. `npm run typecheck` and
  `npm run build` pass; no browser re-check was run.

## Accessibility audit — 2026-09-30

- Scope: `/`, `/experience`, `/projects` + all eight case studies, `/about` (three
  spreads), EN and 中 modes, companion, fairy guide, music panel, CV menu. Method: axe
  (temporary, not in package.json), scripted Playwright keyboard walks, reduced-motion
  animation census, alt/heading inventory; no real screen reader or physical device.
- Implemented and verified (no visual change; before/after screenshots of every route
  in both languages at 1440×900, 844×390 and 390×844 were byte-identical apart from
  pre-existing run-to-run noise): `<html lang>` follows 中/EN (`zh-CN`/`en`) with
  English-only chrome (header, Home, desk keepsake) marked `lang="en"`; About CV
  menu is a disclosure (closed options `inert`, Esc returns focus); About spread
  controls keep keyboard focus across page turns; About spreads 2–3 expose their
  hand-lettered titles as h2; About dots use the Chinese spread names in 中 mode; the
  rotate card is named by its visible title; Arm-Swing's code block is keyboard
  scrollable.
- Already sound: visible focus on every stop, no keyboard traps (native project
  dialog, music panel, companion and postcard note all close on Esc and return
  focus), reduced motion stops or skips all motion, decorative art has empty alt.
- Follow-up fixes (2026-09-30, second pass) — implemented and verified:
  - ZOO case study colours restored: its `.root` palette lost to the shared
    `shell.module.css` `.shell` variables (same names, equal specificity, CSS chunk
    order decided). `.root.root` now wins regardless of order; only ZOO changes
    visually (lead/dt/h3 back to `#58717c`, muted `#746e66`, ink `#393531`, paper
    `#f7f1e6`). Tangram and Chess declare the same names but already won by order.
  - 中 mode lost on case studies (not Reso-only: ~30–50% of loads of any case study
    after /experience, /projects or /): root cause was `app/layout.tsx` (server)
    importing `LANG_BOOT_SCRIPT` from the "use client" `components/lang.tsx`, so the
    `<head>` boot script was a client reference; when that chunk wasn't loaded yet,
    hydration suspended in `<head>` (React #460), resumed misaligned (#519 → #418) and
    client-rendered the root, resetting `<html>` attributes. The constant now lives in
    plain `components/lang-boot.ts`; 0 failures across the full any-order matrix.
  - Home intro keeps keyboard focus: window → lamp → first desk entrance; "Skip
    intro" → "Skip to content" (keyboard-activated steps only).
  - /experience and /about scroll containers are no longer Tab stops (first Tab =
    skip link); the desk keepsake is portalled into a slot right after `<header>`
    (next Tab stop after the header), with inherited font/cursor pinned so it renders
    and behaves as before.
  - Invisible hit areas: header 中/EN, About dots (all widths, was phones only),
    Email/GitHub/LinkedIn and the Download CV pill.
  - Verified: before/after screenshots (112 per run; EN/中 × 1440×900, 844×390,
    390×844, plus About spreads, CV menu, companion, first-visit intro): 95
    byte-identical, the rest = ZOO (intended), 中 Reso (the bug, now fixed) or
    pre-existing run-to-run noise; keepsake computed styles identical to before in
    normal/hover/focus at 3 widths; 中 kept on all 144 ordered route pairs with 0
    hydration errors; axe shows no new violations; lint, typecheck, build pass.
- Still open (recorded for Peiwen's decision, not changed): contrast below 4.5:1 on
  muted text (Experience facts/shelf, About tags/stats, several case-study metas);
  About dots stay under 24px wide (7px gaps between 9px dots); Maze and Arm-Swing
  demo videos have no captions.

## English em dashes removed; About arrows on short screens — 2026-10-01

- Copy: every visitor-facing English em dash (page text, companion answers in
  `lib/companion.ts`, aria-labels, page titles/metadata, 404, case studies) was
  rewritten with a comma, colon, full stop or parentheses; the site title is now
  "Peiwen Zhang · HCI × AI Product". Chinese 「——」 and en-dash ranges are kept. A
  crawl of every route (EN, all Experience chapters, About spreads, project previews,
  companion answers, 404) finds no remaining English em dash. The About companion hint
  now says the arrows are "on either side" (中: 两侧), matching the new layout.
- About layout (desktop ≥1024px wide and >500px tall): the stage takes the height left
  under header + intro; the notebook is `min(1000px, width minus arrow room, height
  minus the dots row)`; prev/next sit outside the notebook's left/right edges,
  vertically centred; label + dots stay below. Verified at 1280×720, 1440×780,
  1440×900, 1512×860 and 1920×1080: no scroll needed, both arrows visible and
  clickable, keyboard order prev → dots → next, focus kept after turns, arrow keys and
  reduced motion unchanged.
- Phones in landscape: the fixed arrows/dots were not actually pinned (page-transition's
  resting `.stage` transform/filter made `<main>` their containing block, so they sat
  ~500px down the page). `main.stageWrap` now drops those at rest only; verified at
  844×390 that arrows are mid-screen and dots at the bottom without scrolling.
- lint, typecheck and build pass.

## Historical goal — Experience v2 (`/experience`)

- **User-approved and merged into `visual-direction-v2` (2026-09-16, merge commit
  `b0edf06`, branch commit `53258f9`); not pushed.** Built in an isolated worktree
  (`experience-v2`, based on `visual-direction-v2` at `f619d7e`) per
  `experience-v2/PASS_02_experience.md` against `experience-v2/experience-prototype-v2.html`
  (visual/interaction/copy source of truth) and `EXPERIENCE_SPEC.md` / `STYLE_GUIDE.md`.
  The user tested the merged page live in-browser and signed off ("验收通过").
- **Post-review fix:** the route wrapper (`.root` in `experience.module.css`) originally
  used `min-height: 100svh`, which let it grow past the viewport to fit its content
  instead of ever actually overflowing itself, so its own `overflow-y: auto` never
  engaged and the page was silently clipped and unscrollable by the global
  `body { overflow: hidden }` (needed for the full-viewport Home route) at 100% zoom —
  wheel, Space and Page Down all did nothing. Fixed to `height: 100svh` plus
  `tabIndex={0}` on the wrapper, the same route-scoped-scroller pattern `/about` already
  uses. Reverified at 1440×900 and 1366×768 (a common laptop size): real scroll range,
  wheel/Space/PageDown all move it, zero console errors.
- Routing: `/experience` now serves the new illustrated page; the previous R3F/Three.js
  prototype is preserved unmodified at `/lab/experience-3d`
  (`app/lab/experience-3d/page.tsx`, imports the existing `app/experience-prototype.tsx`
  — not deleted, not linked from navigation). Approved by the user before implementation.
- Route files: `app/experience/page.tsx` (server entry, metadata), `app/experience/fonts.ts`
  (route-scoped Patrick Hand + Nunito via `next/font`, mirrors `/about`'s pattern),
  `app/experience/experience.module.css` (ported 1:1 from the prototype's stylesheet,
  `--pw-*` variables scoped to a page root class per pass-01's naming convention, not on
  `:root`), `app/experience/experience-page.tsx` (a single client component; interaction
  is a direct DOM/WAAPI controller inside one `useEffect`, matching the pattern already
  used by `app/peiwen-phase-one.tsx`, not React state for animation). Chapter copy lives
  in `lib/experience.ts`, confirmed final by Peiwen per the spec.
- Implements: chapter data (Paris-Saclay → CUC → Osaka), sticky left column (stage +
  souvenir shelf + arrows) with a scrolling journal page on the right, scene
  crossfade/slide with the walking sprite crossing between chapters, first-visit keepsake
  collect-flight animation into the shelf slot, journal page-turn, three ambient drift
  systems (snow / ginkgo / sakura) pausing on `visibilitychange`, the pencil/hand/grab
  custom cursor with hover-underline and click-ring feedback, and stage footprint trail
  — all only under `pointer: fine` and skipped under reduced motion. Keyboard ← → and
  touch swipe navigate; `prefers-reduced-motion` replaces every animation with a direct
  switch. See `ASSET_INDEX.md` for the two documented deviations from PASS_02 §2 (scene
  width capped at the source's native 1499px instead of a fabricated 2400px; drift
  sprites follow the prototype's own purpose-built art instead of a keepsake-photo
  derivative) and one from `EXPERIENCE_SPEC.md` (chapter `chips` capability tags are
  defined in the data but intentionally unrendered, matching the shipped prototype,
  which never displays them).
- **Verified:** `npx tsc --noEmit` and `npx eslint .` are clean for every new/changed
  file (lint: 0 errors, 1 pre-existing-style `@next/next/no-img-element` warning on the
  shelf's small `<img>`, consistent with how this component already mixes CSS
  backgrounds/`innerHTML` for its imperative animation). `next build` (Turbopack,
  `NEXT_TELEMETRY_DISABLED=1`) succeeds; `/experience` and `/lab/experience-3d`
  prerender as static routes. A temporary Playwright install (`npm install --no-save`,
  per this pass's own allowance) drove real-browser checks against the dev server:
  desktop 1440×900 and mobile 390×844 captures of all three chapters, forward/backward
  navigation via click/keyboard/touch-swipe, `reduced-motion` emulation (instant chapter
  switch, no drift), zero horizontal overflow at 320–1920px, zero console/page errors
  across every route touched, and accessibility spot-checks (skip link is the first tab
  stop, shelf `aria-label`s read "Walk to {place}, where I picked up a {keepsake}",
  `aria-current` tracks the active chapter, the journal article is `aria-live="polite"`).
  Evidence: `visualizations/experience-v2/`, `scripts/check-experience-v2.mjs`.
- **Home invariance:** zero Home/About/global files were touched (`git status` in the
  worktree shows only `app/experience/*`, new `app/lab/`, `lib/experience.ts`, new
  `public/assets/experience/` + `public/assets/ui/`, and two new `scripts/*.mjs`), so
  `/?static-reconstruction=1` is unchanged by construction; a live capture confirms it
  still renders with zero console errors.
- Re-verified in the main worktree after the merge: `npx eslint .`, `npx tsc --noEmit`
  and `next build` all pass (lint: 0 errors, the same pre-existing `no-img-element`
  warning plus one unrelated pre-existing warning in the ignored
  `visualizations/build-saclay-contact-sheet.mjs` helper); `/experience` and
  `/lab/experience-3d` still prerender as static routes.
- **Not verified:** real-device touch/performance; assistive-technology reading beyond
  the automated aria spot-checks above. **Not done:** push to the remote.
## Projects attic demo (`/projects`)

### Two-piece illustrated project covers — 2026-09-23

- Structure visually approved by Peiwen; final artwork supplied: each project is an independent illustration
  paper plus a narrower title note, with separate clips and keyboard-focusable buttons.
  There is no shared paper backing. Both buttons open the existing project modal and
  focus returns to the exact source button on close.
- Eight user-supplied final covers are integrated from `public/assets/projects/overview-covers/`:
  Reso, Arm-Swing, Tangram, Music VR, Maze, Flight, Chess and ZOO. Each WebP is 1122 x 1402,
  converted at quality 90 without resizing, crop, sharpening, regeneration or filters.
  Existing contain-fit preserves the complete artwork and paper geometry.
- Chess now uses the separately supplied chess illustration; all eight cover slots are filled.
  Authentic modal/detail visuals remain unchanged.
- Featured order remains Reso, Arm-Swing, Tangram, Music VR, Maze. Short title/subtitle
  copy follows the approved request. Illustration widths 160–180px, title notes 120px,
  within-pair gap 12px, between-project gap 48px; fixed rotations and vertical offsets.
  Desktop opening shows three full pairs and part of Music VR. Maze requires dragging.
- Smaller pairs remain mixed with botanical, flower, Peiwen and WIP decorative sheets.
  Mobile illustration/title widths are 58vw/34vw Featured and 46vw/32vw Smaller.
  Next Featured project peeks as a narrow paper edge because the first pair occupies
  most of the mobile width. Final illustration integration remains a visual-review step.
- Upper Featured rope now uses a quadratic curve with a more visible drop, following the
  lower-rope reference: 70px center sag on desktop, 32px on mobile. Fixed individual paper offsets follow its height; clip rotations are
  +1/-1 degrees. Paper and clip hanging points follow the revised curve at both breakpoints.
  Background, lower rope, spacing, paper dimensions, furniture and modal remain unchanged. Drag/inertia/wheel/touch/keyboard effect is unchanged.
  Only one drag instruction remains. Case-study pages and source evidence are unchanged.
- Lower-rope attachment correction (2026-09-24): desktop project papers now follow a
  trace of the painted rope as their screen position changes during scroll/resize.
  This fixes the detached Chess title clip. The background and drag effect are unchanged;
  mobile retains its existing layout. Extra clipping space preserves raised clips without
  intercepting pointer input above the lower track. A browser regression checks that the
  Chess attachment changes height when horizontally scrolled.
- Passed: lint, typecheck, production build (including static /projects prerender),
  browser drag/wheel/swipe/keyboard on both ropes, modal opens from both paper pieces,
  ESC/Close and exact focus return, eight case-study route links/media, reduced motion,
  320–1920px body overflow, and browser runtime/HTTP error checks.
- Current acceptance captures: 1440 x 900 opening and 40 percent drag, plus 390 x 844
  opening. Eight covers load successfully and browser/production checks pass. Visual
  approval and physical-device feel remain pending. Peiwen requested a local checkpoint
  for Claude handoff; no push or merge is authorized. See CLAUDE_HANDOFF.md.

### Multi-Sensory Music VR detail route — 2026-09-23

- Status: verified; a Featured Case Study route is available at `/projects/multi-sensory-music-vr`. The Projects attic and all existing routes remain unchanged.
- Context and attribution: 2026, four-week Advanced Immersive Interaction coursework at Universite Paris-Saclay. The project began as a team project; after the other teammates left, Peiwen completed the final prototype independently.
- Story: the page follows an accessibility-oriented rhythm question through an AR/Arduino haptic prototype, an AR-to-VR technical pivot, block-based direct manipulation, BPM/note timing, a shared audio/particle/controller-haptic trigger path and virtual-character feedback.
- Evidence boundary: no formal user study or Deaf/Hard-of-Hearing participants are documented. The route does not claim validated accessibility, usability, cognitive-load, therapeutic or emotional outcomes. It records implementation evidence only.
- Materials: seven selected WebP derivatives: one native-size early Unity frame from the WhatsApp recording and six final-demo frames, plus a 1280×720 H.264/AAC derivative of that demo. The demo opens in a secure new tab with native browser playback controls and does not autoplay. The source archive, compiled build, raw reports and presentation are not published; their overbroad outcome language is not repeated as evidence.
- Verification: lint, typecheck, production build, static prerender and `git diff --check` passed. A production browser check at 1440px, 390px and reduced motion covered image decoding, demo-resource availability, secure links, keyboard skip navigation, anchors, return navigation, overflow and console/page/HTTP errors.

### ZOO Desk Organizer detail route — 2026-09-22

- Status: verified; a short individual product-fabrication case study is available at `/projects/zoo-desk-organizer`. The Projects attic and existing routes remain unchanged.
- Context and attribution: 2026, six-week CAD & 3D Printing coursework at Universite Paris-Saclay. Peiwen designed and prototyped the project independently.
- Story: the route follows a desk-organizer ecosystem through its motivation, product family, chainmail clearance failure and revision, large-print failure, animal-shaped functional objects, storage fit and final system.
- Evidence boundary: it documents CAD, 3D printing and physical product prototyping, without claims of electronics, sensors, software interaction, formal user research, quantified mechanical performance, production manufacturing or retained CAD source files.
- Materials: ten selected WebP derivatives from the public project documentation archive. The original GitLab README is linked securely; the source archive, STL/STEP/3MF files and Fusion source model are not published or claimed to be retained.
- Verified: lint, typecheck, production build, static prerender and `git diff --check`. Production browser verification at 1440px, 390px and reduced motion covered decoded images, secure external link markup, keyboard skip navigation, internal anchors, return navigation, responsive overflow, evidence-boundary copy and zero observed console/page/HTTP errors. `scripts/check-zoo-desk-organizer.mjs` records the repeatable Node/Playwright check.

### Tangram detail route — 2026-09-22

- Status: verified; an independent Featured-style tangible interaction and digital fabrication case study is available at `/projects/tangram`. The Projects attic and existing routes remain unchanged.
- Context and attribution: 2026, seven-week Tangible Interface / Digital Fabrication coursework at Universite Paris-Saclay. Peiwen completed the project independently.
- Story: the page follows fabrication decisions rather than weekly reports: modular geometry, an early dumbbell connector, reduced test units, 0.4 mm selection, a topology failure, three connector concepts, a double-anchor revision, planning for nine sets / 144 pieces, 500 × 500 mm border filling and exhibition play.
- Evidence boundary: the project documents CAD, 3D printing and physical prototyping. It makes no claim about electronics, sensors, embedded systems, software interaction, formal mechanical validation or a user study. The final requirement is 500 × 500 mm; the earlier 1 m² brief is not presented as final.
- Materials: sixteen WebP derivatives from original embedded images across the Week 2–7 and exhibition PDFs, plus a supplied 1536 × 2048 exhibition photograph for the Hero. They cover final installation, CAD, physical tests, production, layout and four puzzle prompts. A secure external link exposes the complete Week 1–7 fabrication log; the original PDFs and their full-page layouts are not published.
- Verified: lint, typecheck, production build, static prerender and `git diff --check`. `scripts/check-tangram.mjs` passed against the production server at 1440px, 390px and reduced motion, covering image decoding, keyboard skip navigation, internal anchors, return navigation, responsive overflow, evidence-boundary copy and zero observed console/page/HTTP errors. Captures are ignored under `visualizations/`.

### Chess detail route — 2026-09-22

- Status: verified; a Short HCI Interaction Concept Case Study is available at `/projects/chess`. The Projects attic and all existing routes remain unchanged.
- Context and attribution: 2025, Fundamentals of Human-Computer Interaction, M1 HCI at Universite Paris-Saclay. Team of four. Peiwen contributed to Research, Concept Development, Low-fidelity Prototyping, Prototype Interaction and User Testing.
- Story: the short page follows an intent-first chess concept through an onboarding question, low-fidelity flow, duration choice, learning history, board notes/voice states and parallel media. It records informal feedback about discoverability, noisy spaces and constrained screen space without treating those observations as validated results.
- Evidence boundary: this was a one-week Figma interaction concept. It does not claim a production chess engine, front-end or backend implementation, real-time multiplayer, rule validation, a formal usability study, participant count, formal protocol or metrics.
- Materials: eight selected, high-resolution Figma Frame exports converted to WebP. The original Figma prototype and YouTube demo are secure external links; no Figma canvas, raw research material or production-code claim ships.
- Verified: lint, typecheck, production build, static prerender and `git diff --check`. `scripts/check-chess.mjs` passed against the production server at 1440px, 390px and reduced motion, covering image decoding, secure external-link markup, keyboard skip navigation, internal anchors, return navigation, responsive overflow, evidence-boundary copy and zero observed console/page/HTTP errors. Captures are ignored under `visualizations/`.

### Flight Booking Experience detail route — 2026-09-22

- Status: verified; a Short UX Case Study is available at `/projects/flight-booking`. The Projects attic overview and the other case studies remain unchanged.
- Context and attribution: 2025 Fundamentals of HCI 1 at Universite Paris-Saclay. Team of four. Peiwen contributed to Story Interviews, research synthesis, prototype and presentation.
- Story: 20 Story Interviews with mainly classmates/friends led to four recurring breakdowns. The short page focuses on price/rule comparison, multi-passenger configuration and post-booking itinerary support, then shows the high-fidelity prototype scope from search through airport support.
- Evidence boundary: complete raw notes and a formal coding process are not retained; the classroom presentation is not a post-design usability study. No validated improvement, production implementation or live data integration is claimed.
- Materials: eleven selected WebP derivatives and the final course PDF. The former PDF-derived search, results and itinerary-overview images now use supplied original Figma Frames; three supplied Figma sketches are displayed only as small process thumbnails; research/breakdown and journey scope are English DOM content. No raw research material or Figma workspace is published.
- Verified: lint, typecheck, production build, static prerender and `git diff --check`. `scripts/check-flight-booking.mjs` passed against the production server at 1440px, 390px and reduced motion, covering decoded images, the PDF resource, secure external linking, keyboard skip navigation, internal anchors, Back to Projects/top navigation, responsive overflow, evidence boundaries and zero observed console/page/HTTP errors.

### Maze of Wishes detail route — 2026-09-22

- Status: verified; Case Study v1 implemented at `/projects/maze-of-wishes`. The Projects attic overview and its interaction remain unchanged.
- Implemented: a static Server Component case study reusing the existing About/case-study shell, fonts, warm-paper palette, chapter navigation, materials treatment and responsive rules. The story follows keyboard concept → phone tilt → sensor pipeline → mapping → game loop → collision → classroom demo → reflection. No dependency or client-side component was added.
- Attribution: identifies Maze of Wishes as Peiwen's individual 2025 project and states that she designed and implemented the complete prototype independently: concept, interaction design, sensor mapping, UI/game design, Java implementation, debugging and live demo.
- Interaction account: phone gravity data passes through ZigSim and OSC/UDP to Java, then through `TiltController` into predicted movement, map checks and JavaFX rendering. The page documents the verified gx/gy directions, Space calibration, threshold/bias/bounded-speed treatment, mainly single-axis movement and unused gz value without inventing a parameter rationale.
- Product scope: tutorial, Easy Mode, 90-second timer, cake-gated goal, win/fail states, potion boost and supporting feedback are shown. Hard Mode is explicitly menu-only; multiple levels and other abandoned storyboard ideas are not claimed.
- Evidence boundary: the final demonstrated build prevented wall traversal through a map-based collision approach, but the archived semantic mask does not fully match that build and is not published as proof of robust pixel-perfect collision. The classroom recording is labelled as a working live demonstration, not a user study or validated result.
- Materials: a 13-second browser-compatible H.264 demo, early storyboard PDF and supplied project documentation DOCX. Eleven selected WebP assets cover the demo setup, concept shift, tutorial, map authoring, game states and final map. No raw source archive, participant data or unselected research material ships.
- Verified: lint, typecheck, production build, static prerender and `git diff --check`. `scripts/check-maze-of-wishes.mjs` passed against the production server at 1440px, 390px and reduced motion, covering video metadata/play/pause, secure materials links and resource responses, keyboard skip/video focus, internal anchors, decoded images, Back to top/Projects navigation, responsive overflow, evidence boundaries and zero observed console/page/HTTP errors. Captures are ignored under `visualizations/maze-of-wishes/`.
- Optional follow-up: real-device/assistive-technology testing, documented user evaluation and a final collision-mask archive that matches the demonstrated build.

### Arm-Swing VR Locomotion detail route — 2026-09-21

- Status: verified; Case Study v1 implemented for direct review at
  `/projects/arm-swing-vr-locomotion`. The Projects attic overview and its interaction
  remain unchanged.
- Implemented: a static Server Component case study reusing the Reso/About fonts, shell,
  spacing, materials treatment and responsive rules. The story follows Explore → Choose →
  Map body movement → Build → Debug → Test → Reflect, with restrained motion/direction
  diagrams and no new dependency or client-side component.
- Attribution: explicitly separates Peiwen's individual locomotion concept, custom Unity
  implementation, integration, runtime debugging, formative testing and synthesis from the
  course-provided parkour environment, coin course, scoring and base task framework.
- Interaction account: either index trigger is a movement clutch; combined controller-speed
  magnitude feeds a quadratic curve and speed cap; the HMD forward vector supplies continuous
  3D direction; release uses damping. The page explicitly rejects a separate walking/flying
  state or arms-open switch. Final scene parameters shown are exponent 2.0, sensitivity 12,
  max speed 15 and damping 5.
- Engineering evidence: high-speed collider-trigger misses lead to coin and banner proximity
  fallbacks. The section is presented as a first-class runtime debugging story rather than a
  footnote.
- Evaluation: three formative runs are labelled, including the designer's own run. Participant
  times, coin counts and single-item ratings are shown as directional observations; the page
  states there was no baseline, control condition, validated scale or statistical test and makes
  no causal sickness, presence, enjoyment or speed-accuracy claim.
- Materials: a responsive 76-second H.264/AAC demo, final presentation PDF, course archive and
  public APK link. The public Unity repository is intentionally omitted as a primary CTA pending
  attribution, README and generated-file cleanup.
- Assets: ten displayed WebP figures plus the demo poster, including three gameplay frames,
  a verified-parameter speed plot, Unity settings, banner/coin edge cases, a public testing photo
  and two anonymized result tables. Provenance is recorded in ASSET_INDEX.md and the asset-local
  README; no Unity repository dump, generated build artifacts or unpublished research material ships.
- Verified: lint, typecheck, production build and `git diff --check`; the route prerenders
  statically. `scripts/check-arm-swing.mjs` passed against the production server at 1440px,
  390px and reduced motion, covering demo metadata/playback, local and external resource
  responses, secure new-tab links, keyboard skip/video focus, internal anchors, image decoding,
  responsive overflow, scaffold/evidence boundaries, return navigation and zero observed
  console/page/HTTP errors. Captures are ignored under
  `visualizations/arm-swing-vr-locomotion/`.
- Testing-photo status: Peiwen confirmed that the pictured classmate permits public portfolio use;
  the existing public testing photograph is retained without anonymization.
- Optional follow-up: physical-device/assistive-technology testing, a controlled joystick
  comparison and repository cleanup before exposing code.

### Reso detail route — 2026-09-21

- Status: verified; Case Study v1 complete.
- Implemented: `/projects/reso` is a static Server Component case study with metadata,
  existing Patrick Hand / Nunito fonts, warm-paper styling, route-scoped scrolling,
  semantic sections, a chapter index and native full-size image links. Files:
  `app/projects/reso/page.tsx` and `reso.module.css`.
- Content: hero/overview, gap/design space, DP1 prototypes and first study, scope
  decision, working system, evaluation, results/what failed, personal revision,
  reflection/limitations. Explicitly separates Peiwen's contribution and team outcomes,
  hearing proxy participants and intended DHH context, and combined-condition effects.
- Project materials: five restrained text links expose a 30-second embedded MP4 demo,
  the live experiment, final paper, final presentation and privacy-safe aggregate
  analysis summary. Study copy includes a second inline experiment link. All new-tab
  links use `noopener noreferrer`; the video does not autoplay, retains controls and
  audio, and provides an English WebVTT caption track.
- Refined: the hero prototype poster is the native inline demo player; results follow
  insight then evidence for accuracy and workload; and the rhythm iteration records the
  DP1 blocks, DP2 graph and Peiwen's label/scale revision as a restrained pencil timeline.
  No visual before/after is shown because a verified post-study screenshot is unavailable.
- Assets: ten compressed PDF figures (about 312 KiB), a 964 KiB H.264/AAC demo derived
  from the local MOV, byte-identical final paper/presentation PDFs, and a public HTML
  analysis derivative. Provenance is documented in ASSET_INDEX.md and
  `public/assets/projects/reso/README.md`. The source analysis HTML is excluded because
  it contains participant names and individual-level results; no raw research data ships.
- Projects integration is one direct reading link below the attic introduction.
  Existing demo cards, dialog, clothesline, art and project data are preserved.
- Verified: lint, typecheck and production build; `/projects/reso` prerenders statically.
  `scripts/check-reso.mjs` checks desktop 1440px, mobile 390px and reduced motion,
  responsive layout, image decoding, secure links, resource responses, video metadata
  and playback, caption loading, video keyboard focus, section/document overflow, skip-link and keyboard
  scrolling, internal anchors, return/entry navigation, evidence-boundary copy and zero
  observed console/page/HTTP errors. The aggregate analysis resource is checked at
  desktop/mobile widths for overflow and excluded identifiers. Captures: ignored
  `visualizations/reso/`.
- Optional follow-up: physical-device/assistive-technology testing, AR/WoZ imagery,
  a verified graph before/after screenshot and exact DP1/DP2 month ranges.
  No claim of a follow-up evaluation of the graph revision. No deployment performed.

### Historical category-demo attic implementation (superseded by real-project bundles)

- Implemented: isolated server route reuses About's Patrick Hand / Nunito font instances,
  scoped palette and navigation styles. Home, Experience, About and global styles are unchanged.
  Existing navigation on those routes still points to the historical Projects hash; open
  `/projects` directly for this demo. Navigation integration is deferred to the main-site owner.
- `app/projects/` contains the page, clothesline, card/clip, native dialog preview and
  route CSS; `lib/projectsData.ts` contains four demo categories plus a WIP note. Role,
  year and tools are explicit placeholders. Case-study text is visibly pending and inert.
- Pointer events provide mouse drag with bounded, frame-time-adjusted inertia; native
  horizontal scrolling provides trackpad/touch support. Arrow/Home/End keys and tab focus
  expose all cards. A native modal dialog traps focus; WAAPI scales the paper from/to its
  source card. ESC/Close preserve scroll position and restore focus. Reduced motion skips
  inertia, zoom and decorative motion. No application dependency was added.
- Artwork: source reference and a cleaned derivative are in `public/assets/projects/`,
  with provenance in its README. Imagegen removed baked upper UI/cards to prevent duplicate
  content; lower rope and scene remain decorative. This is a generative edit, not a
  pixel-identical clean plate. Background uses cover/center; mobile crops the scene and
  gives each card 76vw. Project images reuse existing About illustrations.
- Visual harmony pass: shared card/preview image treatment reduces saturation and contrast,
  adds a subtle paper texture, and warms the paper field. Tags use the existing handwriting
  font; clips have irregular silhouettes and the rope uses two light uneven strokes. WIP
  is a text-only note. Existing illustration subjects/brushwork remain placeholders; this
  styling pass does not claim a fully matched illustration set. Browser regression, lint,
  typecheck and build passed again; visual approval remains pending.
- Verified on 2026-09-18: lint, typecheck, production build, and browser interaction checks
  (mouse, wheel, emulated touch, keyboard bounds, modal focus/ESC/Close/position retention,
  reduced motion, no horizontal document overflow at 320–1920px, no observed runtime/HTTP
  errors). Runnable check: `scripts/check-projects.mjs`; screenshots: `visualizations/projects/`.
- Pending: human visual approval and physical-device touch testing. The original reference
  has smaller, more numerous paper pieces; this demo uses larger legible cards and a gentler
  rope curve. The lower rope is intentionally non-interactive. No full case studies.
- Tunable values: project images/copy/rotation/size in `lib/projectsData.ts`; line height,
  gaps/card dimensions/mobile width in `projects.module.css`; drag damping in
  `project-clothesline.tsx`; preview durations in `project-preview.tsx`.
- Card-scale correction: desktop cards now span 150–235px (previously 190–320px),
  with smaller covers and a compact layout below 800px viewport height. Desktop captures
  at 1440×900 and 1440×760 show the character's head unobstructed. Mobile keeps the 76vw
  swipe target with shorter covers. All cards may fit on wide screens; dragging is tested
  at 1024px where the line overflows. Visual approval remains pending.
- Lower-clothesline style match (2026-09-21): card backgrounds now use a lightweight
  transparent blank-paper asset generated from the user's lower-row reference. Removed
  the scalloped inner paper, CSS frame/shadow and visible sequence numbers; centered the
  handwritten labels with looser spacing, and replaced geometric pegs with pencil-outline
  SVG clips. The compact dimensions and interactive behavior are preserved. Cover art
  remains placeholder imagery; final visual acceptance is pending.

## Current goal — About me page (`/about`)

- **Implemented, repository checks unrun, visual approval pending.** `/about` is a hybrid
  illustrated page: Peiwen's watercolour artwork is the visual shell, every readable
  element is DOM on top of it. Two earlier CSS-only attempts at the picture-book look were
  rejected; that approach is abandoned and must not return.
- Route files: `app/about/page.tsx` (server entry, metadata), `app/about/about-page.tsx`
  (composition, a Server Component — no `"use client"`, no state), `app/about/fonts.ts`
  (route-scoped webfonts) and `app/about/about.module.css`.
- **Visual shell is image assets, never CSS.** `desk-scene.webp` carries the desk AND the
  open notebook; `photo-frame.webp` frames the portrait; `paper-wide/block.webp` are torn
  paper used as `mask-image` so one greyish asset yields every tint; `place-*.webp` are the
  three travel fragments; `tape.webp` is used exactly twice; `brush-swipe.webp` is masked
  and tinted behind each heading. `ASSET_INDEX.md` lists sources, derivatives and the
  measured geometry. No gradient, `border-radius`, `feTurbulence`, inline-SVG illustration
  or drawn shape re-creates any of it.
- **Desktop is a fixed illustrated stage, with ordinary flow inside it.** Because the
  notebook is baked into `desk-scene.webp`, content cannot grow the book. `.stage` locks
  `aspect-ratio: 1672/941`, fits inside the viewport, and declares
  `container-type: inline-size`. Only the two page panels are positioned (over the painted
  sheets, at percentages measured from the artwork); **inside a panel everything is plain
  grid/flex flow in document order** — no absolute coordinates, no auto margins or
  `space-between` pushing blocks apart — so real font metrics and line wrapping cannot make
  content drift.
- Type is anchored to readable pixel values, not to the illustration: heading ~29px, section
  heading ~21px, body ~14.5px, captions ~12.5px at a 1420px stage, each written as
  `clamp(floor, Ncqw, ceiling)`. **Type is never reduced to make content fit** — density
  (gaps, card and note padding) absorbs the difference instead.
- **Three layout modes.** `min-width: 1400px and min-height: 870px` → the two-page spread.
  `min-width: 720px` → one wide notebook page, capped at 46rem, with the paired blocks in
  two columns. Below that → the vertical scrapbook column. The spread's threshold is
  measured, not guessed: the right page needs ~460px of panel height, and a 16:9 stage only
  supplies that above roughly 1400×870. At 1280×800 the wide-page layout is used instead —
  that is deliberate, and preferable to shrinking the type.
- Verified by browser probe at 1400×870 / 1440×900 / 1680×1050 / 1920×1080: both panels fit
  with 13–41px of slack and nothing spills past the painted paper. No horizontal overflow at
  320/390/500/719/720/1024/1280/1399/1440/1920px.
- Typography: Patrick Hand for headings, captions and annotations; Nunito for body,
  details, languages and contact values. Both via `next/font/google`, scoped to this route.
  Courier Prime was tried and rejected; it is gone.
- All copy, contact entries, the CV target and the portrait path live in `lib/about.ts`.
  Contact entries carry a `placeholder` flag; while true the value renders as inert text
  with a visible "to add" marker, so no link is broken. `cv.href` is `null` until
  `public/peiwen-zhang-cv.pdf` exists; the same paper label renders in a pending state.
- The About header is a deliberate route-local copy of the Home navigation. Nothing in
  `app/home-hub.tsx` or `app/home-hub.module.css` was touched; `globals.css` is unchanged,
  so `body { overflow: hidden }` still serves Home and Experience and About scrolls inside
  its own shell (`height: 100svh`, `tabIndex={0}` to keep the region keyboard-reachable).
- `scripts/preview-about.mjs` renders a static mirror of the route from the real CSS and
  the real content into the ignored `visualizations/about/`, for headless review without a
  dev server. It is not imported by the app.
- **Not verified:** `npm run lint`, `npm run typecheck` and `npm run build` have not been
  run against this change — the npm registry was unreachable from the authoring
  environment. What was run: no horizontal overflow at 320/390/500/768/1023/1100/1280/
  1440/1920px; the new files pass `tsc --noEmit` against minimal ambient shims; CSS module
  classes cross-checked against the component. Treat the repository checks as unrun.
- **New build-time dependency:** `next/font/google` fetches Patrick Hand and Nunito during
  `next build`. If the build machine cannot reach fonts.gstatic.com, switch
  `app/about/fonts.ts` to `next/font/local`. No npm package was added.
- **Placeholders to replace in `lib/about.ts`:** all three contact values and hrefs, and
  `cv.href` once the PDF is added.

## Current goal — Home / Hero / Hub

- **Static Master approved and frozen by the user (2026-09-15).**
  `/?static-reconstruction=1` preserves `app/home-master.tsx` and its frozen CSS/art.
  Do not change scene, typography, Idle character position/scale, or rebuild the master.
  `public/peiwen-phase1/frozen-master-sha256.json` records protected asset/CSS checksums.
- **Peiwen overlay Phase 1 approved by the user (2026-09-15).**
  `/?peiwen-phase1=1` adds ONLY left preview and return to the same Master component.
  `app/peiwen-phase-one.tsx` / CSS provide 220ms left intent, 420ms return intent,
  54px left / 8px down travel over 1080ms, three restrained alternating foot strides,
  keyboard ArrowLeft/Escape, native button activation/touch and reduced-motion timing.
  Mid-walk input keeps only latest intent and finishes at a planted-foot checkpoint.
  No Opening, right preview, About, lighting, entering, title change or scene movement.
- Original character pixels are masked into a local sprite, not replaced with a redrawn
  character. A generated local inpaint supplies ONLY the origin silhouette/contact-shadow
  clean plate. New derivatives live in `public/peiwen-phase1/`; source/prompt in
  `design-assets/peiwen-phase1/`. Existing home-v2 assets are preserved and unused here.
- Phase 1 browser checks: initial Idle and Return Idle exactly match the frozen 1536×1024
  baseline; Left Preview changes zero RGB channels outside the local character region.
  Keyboard/latest-intent/reduced-motion checks pass; no browser console/runtime errors.
  390px emulated touch left/return passed, retaining the frozen horizontally scrollable
  desktop stage. Real-device touch and mobile art adaptation are NOT verified/delivered.
  Evidence: `visualizations/peiwen-phase1/`, runnable check `scripts/check-peiwen-phase1.mjs`.
- Lint/typecheck/production build passed for this pass; lint retains one unrelated warning
  in `visualizations/build-saclay-contact-sheet.mjs`. Human acceptance remains required
  for exposed background, same-character feeling, grounding and the overlay/master handoff.
- The default `/` still uses the older HomeHub below; this review pass does not switch it.

### Peiwen Dynamic Overlay — Phase 2

- **Phase 2 manually approved by the user (2026-09-15).**
  `/?peiwen-phase2=1` enables ONLY RIGHT_PREVIEW in the existing overlay component.
  `/?peiwen-phase1=1` retains left-only behavior; static/default routes are unchanged.
- Right travel is +54px / -8px, following the rising path, over 1080ms and three small
  strides. Same original RGB sprite, same alpha cutout, same clean plate, same scale:
  no generated/replaced/mirrored assets and no changes to the frozen master or its CSS.
  The left timing, displacement and foot keyframes remain equivalent to Phase 1.
- Added a transparent right intent region and ArrowRight/native-button activation;
  return uses the existing center/Escape handoff. No visible copy or navigation changes.
  No Opening, About, lighting/door, Entering, cross-direction optimization or mobile work.
- `scripts/check-peiwen-phase1.mjs` passes unchanged. `scripts/check-peiwen-phase2.mjs`
  verifies frozen asset hashes, exact initial/returned Idle equality, left pixel regression,
  right hover/keyboard/reduced-motion behavior, and zero console/runtime errors.
  Right Preview changes zero RGB channels outside the local character overlay area.
  Run the Phase 1 script first to supply its comparison capture on a fresh checkout.
- Lint passes with one pre-existing unrelated warning; typecheck and production build pass.
  Review screenshots and the actual desktop recording: `visualizations/peiwen-phase2/`.
  Desktop captures/detail/recording frames inspected; human acceptance of right walking,
  exposed background, grounding, return handoff and left/right balance is still required.

### Peiwen Dynamic Overlay — Phase 3

- **Phase 3 manually approved by the user (2026-09-15).**
  `/?peiwen-phase3=1` adds only ABOUT_HOVER; Phase 1/2/static/default URLs retain their behavior.
  `app/peiwen-about-hover.tsx` and CSS are a small overlay beside the existing walk controls.
  No new image assets, generated faces, dependencies or background edits. The same original
  head pixels tilt -2 degrees about the neck (-0.5 degrees under reduced motion); body/feet
  stay on the frozen plate. A head-only crop of the existing clean plate is feathered at
  the hair base. This is a restrained back-view head tilt, not a newly drawn face turn.
- Peiwen's invisible 130×238 hit area adds 16px around the original character. It has
  priority over directional zones. Fine-pointer trusted movement after entering Idle
  is required; pointerenter alone, stationary reload/return and touch do not arm About.
  Keyboard focus supports About, Tab/blur and Escape restore Idle; clicks never navigate.
  Directional movement is not started while About has keyboard focus. No other state added.
- Handwritten `About me` / `Meet Peiwen.` sits at (937,546), separate from the character;
  only the question fades to 55% opacity. Hero title remains unchanged. Entry/exit fades
  take 220ms, head response 280ms; reduced-motion transitions take 80ms.
- Verified: initial/returned/fresh-return Idle exactly match frozen RGB; Phase 1/2 original
  scripts pass unchanged, and both preview captures in Phase 3 match their approved baselines.
  Fresh reload/return with stationary cursor does not open About; fresh movement does.
  Focus, keyboard priority, no click navigation, reduced motion, touch suppression and zero
  console/runtime errors checked. Tests: `scripts/check-peiwen-phase3.mjs` (run Phase 1/2 first).
  Lint/typecheck/build pass (one unrelated pre-existing lint warning); `git diff --check` passes.
- Evidence: `visualizations/peiwen-phase3/` contains Idle/About/Return screenshots, enlarged
  character detail and an approximately six-second actual browser recording. Desktop captures
  inspected; same-character feeling, subtlety and handoff still await the user's approval.
  No Opening, entering, house effects, About page work or mobile layout adaptation performed.

### Peiwen Home Interaction — Phase 4

- **Implemented / verified, continuous interaction aesthetic approval pending.**
  `/?peiwen-phase4=1` opts into coordinated input on the existing overlay controller.
  Phase 1–3 review routes remain available. No image assets, CSS visuals, endpoints,
  character scale, clean plates, title/navigation copy or other pages changed.
- One owner coordinates walking and About. About's component is presentation-only in
  Phase 4; its prior controller remains for the approved Phase 3 route. Pointer, keyboard
  and focus feed one latest intent, not a backlog of intermediate commands.
- About-hover priority fix: a trusted fine-pointer `pointerenter` with real cursor
  movement immediately promotes About over directional/pending intent. In coordinated
  mode the hit area remains enterable during walking. Element movement under a
  stationary cursor, fresh load/return arming, keyboard/focus ownership and Escape are
  unchanged; Phase 3's separate controller keeps its approved behavior.
- Left/right crosses use consecutive approved 1080ms/54px walks: center is a planted-foot
  checkpoint without Idle publication, fading the walking plate or a visible stop.
  Each short walk completes before latest intent is consumed. Into About, walking returns
  to the original anchor and hands back to the master before the approved head response.
  Out of About, the existing CSS head/fade transitions finish before walking starts.
- Peiwen's existing hit area follows the moving sprite, wins over directional zones,
  and accepts explicit fine-pointer movement during a walk as the latest intent.
  Stationary reload/returned Idle cannot auto-arm About. Keyboard focus, arrows, Escape,
  reduced motion and coarse-pointer/touch suppression use the same coordinated flow.
- Verified all 12 requested transitions; initial/returned Idle and Left/Right/About
  screenshots are pixel-identical to approved captures. Frame audit checks no teleport,
  no simultaneous walking/About overlay visibility and no Idle stop between directions.
  Rapid keyboard and pointer latest-intent sequences, focus/Tab/Escape, hover arming,
  reduced motion, touch and zero console/runtime errors passed.
- Lint/typecheck/production build and `git diff --check` passed; lint retains one unrelated
  old warning. `scripts/check-peiwen-phase4.mjs` writes evidence to
  `visualizations/peiwen-phase4/` (copy approved Phase 1–3 captures into `baselines/` first).
  `--record-only` refreshes the real continuous recording without rerunning checks.
- 2026-09-15 priority-fix regression: Phase 1–4 scripts, lint/typecheck/build and
  `git diff --check` pass; the Phase 4 recording is Left → About → Right → About → Idle.
- User review remains required for the continuous feeling, not individual state art.
  No Opening, Entering, house effects, new UI, Experience changes or mobile layout work.

### Left Preview Environment Feedback — Phase 5 / 5.1 / 5.2

- **Phase 5 is technically approved. Phase 5.1 visibility tuning and the Phase 5.2
  revision (progressive road wake, pre-embedded dandelions and delayed copy) are
  implemented and technically verified. Human aesthetic approval remains pending.**
  `/?peiwen-phase5=1` enables ONLY a quiet left-road response on the approved Phase 4
  interaction. Phase 1–4 routes retain their exact behavior; the default/static master
  remains unchanged.
- User-marked long left walk: only the Phase 5 route extends LEFT_PREVIEW to -330px
  (sprite center near master x=530) as six consecutive approved-gait short steps of about
  55px, reusing the same cadence and foot framing as Right Preview. Phase 1–4
  retain the approved -54px travel; Right remains +54px. Cross-direction and About return
  still pass through the planted-foot center checkpoint.
- About-hover interruption: trusted fine-pointer entry/movement over the hit area during a
  walk immediately freezes the interpolated character frame, cancels the queued gait, and
  starts the About return sequence instead of waiting for the current step to finish.
  Because WAAPI motion does not reliably synthesize hit-area boundary events, the
  controller polls the last trusted cursor position per animation frame against the moving
  hit rectangle; this is the robust contact path during Peiwen's own movement.
- Phase 5.2 revision replaces the baked wake overlay with two local CSS-mask layers over
  the frozen master. Road wake is confined to a route ribbon and animates directional
  reveal from Peiwen toward the first curve; distant response is limited to small
  church/water anchors. Blur, soft-focus, broad clarity/saturation, outlines and route
  icons are not used.
- Two fluffy dandelion guides are used. The near seed is intentionally preembedded in Idle
  at 4.5% opacity, then wakes in place to 70–72%; the far seed enters later at 66%. Two
  small reused fireflies provide local wake only. `Experience / How I got here.` is visual
  copy delayed until about 950ms. The supplied dandelion sheet is source-only; its two
  runtime derivatives are deterministic crops/resizes. No character, copy system,
  navigation or mobile composition was modified. No new dependency.
- Feedback starts after the left walk begins, exits by Escape/About/Right, and reduced
  motion retains the final road/destination/dandelion/firefly opacity with no progressive
  reveal, drift or pulse.
- Verified by `scripts/check-peiwen-phase5.mjs`: frozen asset/CSS hashes; underlying Frozen
  Idle unchanged except the declared near-seed bounding box; localized left-only changes;
  progressive reveal timing; delayed copy; full exit; Left -> About approved equality;
  Left -> Right approved equality with no residue; touch regression and zero browser
  errors. It writes screenshots, staged reveal frames, a continuous review and a dedicated
  4–6s Idle -> Left -> Idle recording under `visualizations/peiwen-phase5/`.
- Phase 1–4 scripts, lint/typecheck/production build and `git diff --check` pass; lint
  retains the one pre-existing unrelated warning. Human review must confirm quietness,
  illustration fit, Peiwen priority and complete restoration before this state is called
  final.

### Historical HomeHub implementation (not the approved master)

- **Implemented / technically verified, visual approval pending:** `/` now renders Peiwen's Little
  World as the Home Hub. `/experience` preserves the existing Experience prototype without changing
  its internals; Projects, About and Playground internal pages remain out of scope.
- The Home state machine supports IDLE, LEFT_PREVIEW, RIGHT_PREVIEW, ABOUT_HOVER and ENTERING, with
  220ms desktop intent, 420ms return, direct click entry, ArrowLeft/ArrowRight/Enter/Space/Escape,
  mobile swipe/tap, session-only Opening and exploration hint, and reduced-motion timing.
- The picture-book scene uses existing cloud/tree/flower/grass runtime art, the repository's prior
  hand-drawn SVG language, and three deterministic character cutouts under `public/assets/hub/`.
- Projects and About play distinct Home transitions and settle at `#projects` / `#about`; destination
  page implementation is deliberately deferred rather than adding placeholder pages.

## Parallel goal — Minimal Experience World Prototype

- **Active / designed:** one continuous illustrated 3D path, small Peiwen, restrained vegetation and
  atmosphere. Walking remains the narrative backbone; real-place/landmark reconstruction is abandoned.
- **Implemented / technically verified, visual approval pending:** `/?world=minimal` adds ONLY a winter-night visual state.
  It shares the existing character, Catmull-Rom geometry, movement, lateral control, camera follow,
  registry, crossing/hysteresis, narration and responsive foundation. These core algorithms are unchanged.
- The minimal branch renders a pale untextured road, lavender ground/sky/fog, eight main tree/grass/
  bare-branch placements and sparse low roadside grass/twigs. Continuous pale mountain silhouettes
  and a winter tree line replace the detached cloud washes. A larger left foreground trunk, static
  paper grain, six sky points, crescent and sparse warm fireflies provide restrained depth/atmosphere.
- The enrichment pass reduces Peiwen and her existing contact shadow uniformly to 80% on desktop
  and mobile, only in Minimal mode. Movement, camera, path and milestone registry remain unchanged.
- Existing tree, grass and firefly WebPs are reused. Bare branches are flat line segments, not
  full 3D vegetation. No new raster asset, dependency, shader, PBR or dynamic shadow was introduced.
- In this mode, old campus, Eiffel, snowbank/edge placements, heavy winter cutouts, B1 road texture and
  landmark-specific firefly groups do not mount. Their files remain intact. Plain `/` preserves 3C.
- `/storybook` and its uncommitted code remain preserved as a superseded plate-transition experiment;
  they are not the active direction. Existing approved keyframes are palette/atmosphere references,
  not runtime composition blueprints. No existing source image or runtime derivative was edited.
- **Planned only:** winter → autumn interpolation and the longer six-chapter journey. Neither an autumn
  environment nor any transition, new chapter, building or landmark is implemented in this pass.
- **Visual approval pending:** the aim is a comfortable static/walking picture-book frame, not a
  completed Saclay scene. Existing confirmed DOM copy is unchanged; CUC fields remain null.

## Historical Pass 4A Storybook Journey Pivot — superseded

The following active/abandoned labels describe the earlier Pass 4A decision only. The Minimal World
direction above supersedes them: the walking core is active again, without complex spatial biomes.

- **Active / designed:** a continuous-feeling illustrated journey composed of discrete storybook scenes.
- **Abandoned:** continuous 2.5D spatial biome world. This is an art-production decision, not a
  technical impossibility: continuity costs and intermediate-asset needs were too high; cutout/sticker
  composition fought the static-frame-first strengths of the approved artwork.
- **Implemented / technically verified, visual review pending:** `/storybook` is a review-only Saclay → transition → CUC POC.
  `/` still serves the preserved 3C experiment, not the future approved default.
- **Planned only:** Intro → Saclay → transition → CUC → transition → Japan → Tantan → Huashun →
  Yundao → Projects bridge. No later chapter, Hub or Project House is implemented by this pass.

## Historical Pass 4A architecture

- `app/storybook/page.tsx` exposes the review entry; optional `?progress=` is finite-checked and bounded.
- `lib/storybook.ts` defines two scenes and a pure progress sampler. `lib/journey.ts` remains unchanged:
  milestone registry, bounded targets, directional crossing, hysteresis, slowdown and narration are reused.
- Progress means storybook position, not 3D coordinates: Saclay `0.015–0.345`, transition `0.345–0.535`,
  CUC `0.535–0.985`. Existing centers remain `0.24 / 0.64`.
- `app/storybook/storybook-review.tsx` uses DOM/Image layers with local responsive CSS. No R3F Canvas,
  road geometry, campus cutouts, snowbanks, separate Eiffel, or extra Peiwen is mounted on this route.
- Only the two current/adjacent plates are decoded; inputs activate after both have decoded. Incoming
  opacity equals transition progress over an opaque outgoing plate, giving contributions `1-t / t`
  without exposing the page background. Progress controls both scale and opacity; reverse is symmetric.
- Normal scales stay within `0.98–1.04`; reduced motion forces scale 1 and a midpoint scene switch.
- Wheel, W/S, Up/Down and vertical pointer swipe retain bounded bidirectional progress. Lateral movement
  is intentionally absent: the flattened Peiwen cannot move independently. No character overlay is added.
- Accessible details, skip link, focus styling and polite confirmed-milestone announcements exist.
  CUC narration fields remain null. No CV, fabricated career copy or duplicate visible headline is added.
- Static imports of the two unchanged approved keyframes are a **temporary review-plate exception**,
  not production art. Baked UI/headline/Peiwen can ghost during crossfade; portrait cover cropping is
  configurable but not approved final mobile composition. Production clean plates and Peiwen continuity
  are deferred, with no choice locked between clean/shared-character and baked/bridge options.
- No dependencies, original artwork or runtime derivatives were changed. The old 3C files were saved
  in an explicitly requested local checkpoint before implementation; the storybook POC awaits review.

## Historical 3B / 3C record — superseded direction

The following records describe the preserved spatial experiment only. Any old instruction to wait
for P1, repair the spatial world, or prohibit temporary review plates is superseded by Pass 4A above.

Pass 3B — Journey Registry Foundation is implemented and verified within the checks recorded below. Paris-Saclay and CUC now share a data-driven
milestone contract and pure progress queries; the transition is sampled as data only. The current
Saclay runtime composition and the 3A.1 input/movement contract are preserved. CUC is logical only:
no runtime scene, new narration, visual transition, or new runtime assets have been added.

Pass 3C.1 — Saclay Runtime Asset QA & Derivatives is complete. The eight source originals remain
unchanged under `design-assets/source/experience/saclay/`; seven transparent lossless WebP cutouts
and one opaque road-surface WebP are verified under `public/assets/world/saclay/`. B1 is intentionally
limited to bounded/stretched UV use because it is not seamless.

Pass 3C.2 — the prepared Saclay derivatives are integrated as a static desktop/mobile winter
composition. The existing S-road geometry, camera, milestone registry, movement controls, Peiwen
frames and DOM narration contract are unchanged. Automated and browser-emulated checks pass;
manual visual approval is still pending.

Pass 3C.2-fix A — the first spatial-hierarchy correction is implemented. Road texture, desktop
Peiwen scale, Eiffel/campus recession, C2 placement and C3 foreground framing were tuned without
changing source art or interaction contracts. The pass is intended to expose remaining asset-level
problems; manual visual judgment is still pending.

Pass 3C.2 cleanup — all B2/B3/B4 runtime placements are disabled because they crossed or visually
blocked the road. Their source and runtime files remain preserved. The clean baseline retains B1,
Peiwen, campus, C1, C2, C3 and the current Eiffel treatment while awaiting P1 environment assets.

## Historical architecture

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

## Historical delivery status

| Scope | Status | Evidence |
| --- | --- | --- |
| Bootstrap contracts and workflow skills | verified | Repository bootstrap files and both workflow skills are present. |
| Next.js / TypeScript foundation | verified | Lint, typecheck, and production build passed on 2026-09-11. |
| Constrained R3F Experience path | verified | Forward/backward and lateral keyboard controls, wheel input, mobile swipe, camera follow, and responsive viewport checks passed. |
| Peiwen walking presentation | verified | Approved Peiwen source identity is represented by four runtime walking frames; reduced motion disables idle movement. |
| Paris-Saclay Experience milestone | implemented | Winter campus, Eiffel, snowy path/edges, vegetation and foreground framing now form the runtime vignette; semantic DOM text, approach/arrival behavior, fireflies and mobile composition remain. Manual visual approval is pending. |
| Pass 3A + 3A-fix composition and pacing | verified | Visually approved by Peiwen on 2026-09-12. Lint, typecheck, production build, desktop/mobile browser checks, controls, resize, and reduced motion passed in the takeover audit. |
| Keyboard controls after Pass 3A | verified | Live check 2026-09-12: see Verification baseline. |
| Reduced motion after Pass 3A | verified | Edge was launched with `prefers-reduced-motion: reduce`; CSS transitions were `0s`, DOM animation count was zero, and the settled Canvas remained unchanged across captures. |
| Pass 3A.1 interaction contract | verified | Bounded wheel/keyboard/swipe progress, forward and reverse milestone crossing, lateral movement side effects, 4.63:1 subdued-hint contrast, responsive resize, and reduced motion passed on 2026-09-12. |
| Pass 3B journey foundation | verified | Deterministic checks, lint, typecheck, production build, diff check, desktop/mobile regression, controls and accessibility checks passed; evidence is recorded below. |
| New Saclay/CUC visual targets | designed | Approved original PNG keyframes are preserved under `design-assets/keyframes/experience/`. Saclay has a first runtime conversion; CUC remains unimplemented. |
| Pass 3C winter Saclay conversion | implemented | Pass 3C.2 plus fix A establish bounded road UVs, explicit depth tiers and separate desktop/mobile composition. B2/B3/B4 placements are disabled in the cleanup baseline; their files remain available. Manual visual approval remains. |
| Pass 3C.1 runtime asset QA | verified | Eight sources decoded and were inspected by pixel/alpha statistics plus checkerboard and light/dark review; seven assets are runtime-ready and B1 is usable with its documented non-seamless limitation. |
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

## Historical constraints and open issues

- The Pass 3A.1 large-Eiffel / paper-academic composition remains recoverable in Git history; the live runtime now uses the Pass 3C.2 winter composition.
- The static winter composition is strongest at arrival. The existing follow camera deliberately reveals it from a smaller distant grouping during approach.
- Mobile keeps the existing widened Canvas/camera behavior and uses a separate compact sprite arrangement so Peiwen, Eiffel, campus and DOM text remain visible.
- Real-device performance and touch feel remain unverified; browser emulation is not physical-device testing.
- Keyframes are flattened images with text and occluded backgrounds, not runtime assets. Use the
  prepared Saclay runtime derivatives for integration; do not load source PNGs directly or
  regenerate/reconstruct missing artwork without an approved asset-production scope.
- The B1 snow-road surface is not seamless and must use bounded/stretched UVs, not repeating UVs.
- The clean baseline no longer loads B2/B3/B4. Their preserved source/runtime files remain available
  for reference, but they should not be placed across the road again without a new composition need.
- No approved separate moon, path-lamp or milestone-sign runtime asset exists, so Pass 3C.2 does not
  reconstruct those flattened keyframe details.
- Fix A substantially reduces the road's river-like texture direction and corrects desktop Peiwen's
  scale. Eiffel still reads as an isolated icon and the A1 campus asset's self-contained snow base
  still reads as a floating cutout, especially while leaving; those are now treated as asset-level
  findings rather than reasons for further placement-only tuning. C1 remains usable.
- CUC identity, period and summary are unconfirmed. The movement/transition reference video has not been supplied for this pass.
- `THREE.Clock` emits its existing deprecation warning. Node 22's deterministic script emits type-stripping/module-detection warnings; it runs without a new dependency or package module-mode change.
- Do not fabricate employers, roles, dates, outcomes, or academic details.
- Do not add free exploration, game pressure, complex 3D, a large animation system, or new dependencies without a demonstrated need.

## Verification baseline

Minimal winter visual enrichment (2026-09-14):

- Lint, typecheck, production build, original journey assertions and diff checks passed. The existing
  ignored contact-sheet lint warning remains; no dependency, source-art or registry changes occurred.
- Comparison with the pre-enrichment local snapshot confirms identical path/road geometry, bounded
  input helper and movement/camera frame loop. Peiwen's presentation is scaled to 80%, not rewritten.
- Browser regression passed keyboard, wheel, touch, milestone arrival, skip-link focus, reduced-motion
  settled-frame equality and network/runtime health. Final visual captures are checked separately
  after the foreground trunk and distant-tree spacing adjustment; no application runtime errors arose.
- Review evidence is under ignored `visualizations/minimal-enrichment/`; `before/` preserves the previous
  source/CSS/state without changing Git history. Final walking recording includes the full browser page,
  including DOM narration, paper grain and celestial overlay, rather than Canvas alone.
- Visual approval is pending. No building, landmark, props, seasonal transition, new asset file,
  dependency, animation system, commit or push is introduced by this pass.

Minimal winter world checks (2026-09-14):

- Lint, independent typecheck, production build and `git diff --check` passed. Lint retains one
  pre-existing warning in the ignored contact-sheet helper; no application lint errors were found.
- The existing journey suite passes 1,222 assertions. Direct source comparison confirms makePath,
  roadSample, makeRoadGeometry, Peiwen and updateProgressTarget are unchanged; the existing frame loop
  for movement, camera follow and journey-state updates is byte-identical to the pre-pass version.
- Production Edge checks passed W/S forward/back, Up/Down, A/D, wheel arrival, mobile touch with
  vertical/lateral input, milestone activation, no horizontal overflow, first-tab skip link, and
  reduced-motion zero DOM transitions with identical settled screenshots. Physical-device touch feel
  and actual assistive-technology reading remain unverified.
- Final 1440×900 desktop and 390×844 mobile start/arrival captures were visually inspected. A final
  mobile-only vegetation adjustment brings the left tree and grass into the existing cropped view;
  camera, path and character size were not changed. Final production captures/asset loading pass.
- Browser runtime/network checks report no errors or warnings; only four existing world textures
  and the four Peiwen frames load. No old Saclay/eiffel texture is requested by the minimal branch.
- `visualizations/minimal-winter/` holds ignored local screenshots, the browser check script/results,
  and a 14.2-second 1440×900 WebM walking capture. All 397 video frames decode; samples were inspected.
  The recording captures the live Canvas (walking/sideways/reverse), not the separate DOM text/moon.
- No source/runtime asset, dependency, registry or Storybook implementation file changed. Existing
  uncommitted historical work remains protected; this pass makes no commit or push.
- Manual visual review remains: whether this pale winter mood and sparse environment feel comfortable
  during walking on both sizes. No claim is made of completed Saclay art, autumn or six chapters.

Pass 4A Storybook Journey POC checks (2026-09-13):

- Lint, independent typecheck, production build and diff whitespace checks passed. One pre-existing
  lint warning remains in the ignored `visualizations/build-saclay-contact-sheet.mjs` helper.
- The unchanged journey suite passes 1,222 assertions. The new `scripts/check-storybook.mjs`
  checks mapping, 1,001 forward/reverse samples, opaque composite coverage, scale limits, reduced
  motion, finite/bounded review parameters, null CUC narration, extreme deltas and phase retention.
- Clean Edge browser emulation passed wheel forward/reverse across both scenes; W/S and Up/Down;
  large wheel delta protection; vertical touch swipe forward/reverse; desktop-to-mobile resize with
  preserved progress; no horizontal overflow; skip-link first-tab focus and focus transfer into
  Experience details; semantic article and polite confirmed-Saclay announcement.
- Reduced-motion emulation forces all plate transforms to none, permits forward/reverse midpoint
  handoff and produces identical idle screenshots. No independent DOM animations run.
- Five 1440×900 desktop and three 390×844 mobile production screenshots were captured and visually
  inspected: Saclay/CUC stable frames and transition 25/50/75% on desktop, midpoint on mobile.
  Both unique adjacent plates are decoded, cover the viewport and have no duplicate instances.
  The review route mounts zero Canvas elements and requests no old world/character runtime assets.
- No console/runtime errors, failed network requests or browser warnings occurred in the clean
  browser run or final production captures. The first extension-enabled run detected a hydration
  mismatch caused by Immersive Translate injecting `data-immersive-translate-page-theme`; disabling
  extensions in an isolated test profile removed it without an application workaround.
- Old homepage, spatial runtime/CSS, journey registry, dependencies, source images and runtime assets
  remain unchanged from the preservation checkpoint. Both approved keyframe SHA-256 hashes match
  their recorded originals. The generated AGENTS.md instructions were not edited by this pass.
- Evidence: ignored local `visualizations/pass-4a/results.json`, `captures-final.json` and eight PNGs.
  These are technical review results, not visual approval or production-asset acceptance.
- Remaining manual checks: the user's assessment of the half-continuous journey, physical-device
  touch/performance and actual assistive-technology reading. Mobile cropping clips baked text/landmarks
  and produces a larger character double-image at midpoint; production mobile art and character
  continuity remain explicitly unresolved. No additional art or Pass 4B work was started.

Pass 3C.2 cleanup checks (2026-09-13):

- B2/B3/B4 have no runtime JSX placement; their constants and source/runtime files remain intact.
- No road, Peiwen, campus, C1, C2, C3, Eiffel, input, camera or registry parameter changed in this cleanup.

Pass 3C.2-fix A checks (2026-09-13):

- `npm.cmd run lint`, `npm.cmd run typecheck`, production build with telemetry disabled, and
  `git diff --check`: passed. The existing ignored contact-sheet utility warning remains.
- Browser-emulated 1440×900 approaching, arrival and leaving captures reported the expected
  `approaching`, `active` and `passed` phases; the 390×844 arrival capture reported `active`.
  No browser runtime/log exceptions were observed.
- No journey, input, registry, source asset, dependency or CUC implementation changed.

Pass 3C.2 checks (2026-09-13):

- `npm.cmd run lint`, `npm.cmd run typecheck`, production build with telemetry disabled, and
  `git diff --check`: passed. Lint reports one pre-existing warning in the ignored Saclay contact-sheet
  utility; application code has no lint error. The homepage remains statically prerendered.
- Production browser captures at desktop 1440×900 approach/arrival and mobile 390×844 arrival show
  Eiffel, the warm campus cluster, snowy road/edges, Peiwen and readable DOM narration without overlap.
  These are implementation review captures, not manual visual approval.
- Real browser input reached the active Saclay milestone by wheel, W key and vertical touch swipe.
  Reduced-motion emulation matched, all four relevant DOM transition durations were `0s`, and the
  skip link received keyboard focus with the expected Experience target. No runtime/log exceptions
  were observed by the validation probe.
- The road uses one bounded UV span over the existing Catmull-Rom ribbon; the non-seamless B1 texture
  is not repeated. No dependency, CUC scene, transition art, camera behavior or movement constant was added.

Pass 3C.1 checks (2026-09-13):

- All eight source PNGs remained byte-identical to checkpoint `4f4e7b0`; every runtime derivative
  decoded successfully from `public/assets/world/saclay/` with the recorded dimensions and file sizes.
  Next dev served all eight paths with HTTP 200, `image/webp`, and the exact on-disk byte length.
- Pixel QA verified real alpha for all seven cutouts and intentional RGB opacity for B1. Sparse source
  alpha 1–3 residue was deterministically cleared; no baked rectangular background, broken subject,
  visible white halo or removable blue/purple fringe remained in checkerboard and light/dark review.
- Seven assets are `runtime-ready`; B1 is `usable with limitation` because its opposing edges differ
  and it cannot tile seamlessly. No asset is marked `needs regeneration`.
- The eight runtime files total 4,364.8 KiB on disk with a conservative combined decoded estimate of
  29.24 MiB. No Experience scene, journey, camera, road or character code changed.
- `git diff --check` passed. Application lint, typecheck and build were intentionally not repeated
  because no application, configuration or runtime-loading code changed.

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

1. Review `/?world=minimal` at desktop 1440×900 and mobile 390×844, including the walking recording.
2. Stop before any commit, autumn transition, new chapter or additional asset production. First decide
   whether the existing walking feel and this simpler winter environment are visually comfortable.
3. Preserve the old 3C checkpoint, Storybook experiment and all source/runtime assets. Do not resume
   Eiffel/campus/snowbank tuning or flattened-plate art production by default.

Historical naming: the earlier proposed "Pass 3B entry ritual + ambient life" was not implemented.
The current Pass 3B means Journey Registry Foundation. The entry ritual and butterfly runtime
derivatives remain deferred; they are not part of the next task by default.

## Last updated

2026-10-01
2026-09-30
2026-09-25
2026-09-24
