# Claude Code Handoff

Read AGENTS.md, PROJECT_STATE.md, VISUAL_DIRECTION.md and ASSET_INDEX.md, then inspect live Git state.
Use project-task-init before significant edits and project-delivery-check before completion.

## Completed — Experience v2 (`/experience`)

2026-09-16: **User-approved and merged into `visual-direction-v2`, not pushed.**
`/experience` now serves the illustrated walk-and-collect page (Paris-Saclay → CUC →
Osaka) built against `experience-v2/experience-prototype-v2.html`; the previous
R3F/Three.js prototype is preserved unmodified at `/lab/experience-3d`. See
PROJECT_STATE.md's "Experience v2" section for route files, verification evidence and
two documented deviations from the pass plan (recorded in ASSET_INDEX.md). Do not
regenerate the scene/keepsake/walk-cycle art or re-run the asset pipeline against
different source resolutions without a new approved asset-production scope.

## Active direction — Home / Hero / Hub

2026-09-15 update: **Static Master is approved and frozen.** Do not regenerate it or adjust
its composition/Idle Peiwen. Phase 1 review is `/?peiwen-phase1=1`: original-pixel Peiwen
overlay plus silhouette-only inpaint, LEFT_PREVIEW and return only. See PROJECT_STATE and
`visualizations/peiwen-phase1/`. Wait for manual background/identity/grounding/handoff
approval before further work. Right/About/Opening/lights/Entering remain out of scope.
The statements below requiring initial static approval are historical and superseded.

Superseding instruction: **Master Plate + Minimal Dynamic Overlays**. The static review at
`/?static-reconstruction=1` mounts `app/home-master.tsx`, not HomeHub. Full original master plus
eight paper text patches and DOM typography preserve the complete scene. Old Home-v2 crops remain
on disk but are not inputs. Review `visualizations/home-master/`; wait for explicit static approval
before any character, door/light, reveal or other dynamic overlay work. The old split reconstruction
and its claimed 50% overlay are superseded (the old Sharp opacity argument was ineffective).

Latest instruction (2026-09-15): the supplied 1536×1024 Home image is the single visual truth. A
review-only static reconstruction is available at `/?static-reconstruction=1`, using deterministic
crops under `public/assets/home-v2/` and DOM text. Stop after static capture, contact sheet, overlay
and difference review; do not create walking/About/door assets or mobile adaptation before manual
approval. Imagegen was unavailable with HTTP 429, so no generated or inpainted art was added.

Home reference correction (2026-09-14): central Hero name/subtitle persist in Idle; the prompt is in
the sky and the world sits in the lower half. Preview travel is ±8vw on desktop/mobile, labels are
asymmetric and contain no CTA verbs. New movement after Opening arms fine-pointer hover; both hints
are session onboarding. Existing house/fence originals replace the polygonal house treatment.
Native hash assignment was replaced with router navigation to the same anchors to fix Back navigation.
Review captures and browser checks are described in PROJECT_STATE.md; manual visual approval is pending.

Latest instruction (2026-09-14): `/` is Peiwen's Little World, a full-viewport Home Hub. The left
road previews and opens the preserved Experience at `/experience`; Peiwen previews About; the right
house previews Projects. Projects, About and Playground internal pages are intentionally not part of
this pass, so their Home interactions finish at named anchors rather than inventing placeholder pages.

The Home uses session-only Opening/exploration flags, discrete IDLE / LEFT_PREVIEW / RIGHT_PREVIEW /
ABOUT_HOVER / ENTERING states, delayed desktop intent, direct clicks, keyboard controls, mobile swipe
and tap, and reduced motion. It reuses existing Hub/world art plus three deterministic character crops.
Do not add internal destination pages or resume Experience milestones as part of Home tuning.

## Parallel direction — Minimal Experience World Prototype

Latest instruction (2026-09-14): retain the proven third-person walking core; build a single minimal
picture-book world, not place reconstructions or flattened scene transitions. `/?world=minimal`
selects the winter-only prototype inside the existing Experience component. Plain `/` preserves 3C;
`/storybook` remains a superseded experiment. Do not delete or overwrite either historical state.

The minimal branch reuses path geometry, Peiwen, camera, movement/input, lateral bounds, registry,
crossing/hysteresis, reduced motion, DOM narration and mobile foundation. It replaces only environment
rendering with pale ground/road/sky/fog, sparse existing trees/grass, flat bare branches, two faint
distant washes, a small foreground branch, still moon and sparse fireflies. No campus/Eiffel/heavy
snow cutouts or strong road texture mounts in this mode. Source/runtime assets remain unchanged.

No new dependency, generated image, complex shader, dynamic shadow, autumn transition or additional
chapter. Six emotional chapters remain a later direction only. Current Saclay copy stays unchanged;
unconfirmed CUC narration remains null. Keyframes are now palette/atmosphere references, not blueprints.

Next action: user reviews desktop 1440×900, mobile 390×844 and the walking recording before a commit
or another visual pass. Current checks belong in PROJECT_STATE.md; local evidence is under ignored
visualizations/minimal-winter/. Do not push. The remaining Pass 4A sections below are historical.

## Historical direction — Pass 4A

Peiwen Zhang's English-first HCI × AI Agents portfolio serves France-based internship recruiters and
research advisors. Experience is now a **continuous-feeling journey of discrete complete storybook scenes**.

**Abandoned:** continuous 2.5D spatial biome world. Not technically impossible: continuity costs,
too many intermediate art assets and cutout/sticker compositions conflicted with static-frame-first art.
Do not resume 3C placement fixes or P1 spatial-environment integration.

Planned only: Intro → Saclay → transition → CUC → transition → Japan → Tantan → Huashun → Yundao →
Projects bridge. Only Saclay → transition → CUC is implemented as a review POC.

## Entry and architecture

- /storybook is review-only; / still renders preserved 3C. Wait for approval before switching defaults.
  The review route is a pivot tool, not a second product to maintain indefinitely.
- app/storybook/page.tsx: server entry, noindex, finite-checked/bounded ?progress= review position.
- lib/storybook.ts: minimal scene data contract and pure scale/transition sampler.
- app/storybook/storybook-review.tsx + storybook.module.css: DOM/Image plates, local input loop,
  responsive framing, reduced motion, accessible details, skip link and polite arrival status.
- lib/journey.ts is unchanged: 3A/3B registry, bounded target, crossing, hysteresis, slowdown and narration.
- Next.js 16 / React 19 / TypeScript / Tailwind 4. No new dependencies. Three/R3F stays for the old route;
  no Canvas, road mesh, snowbanks, campus cutouts, Eiffel sticker or extra Peiwen mounts in /storybook.

## Progress and input

Wheel, W/S, Up/Down and vertical swipes move storybook progress, not 3D coordinates. Old coefficients,
target limit, damping and slowdown are reused. No lateral movement: Peiwen is baked into these plates.

| Range | Visual |
| --- | --- |
| 0.015–0.345 | Saclay; milestone center 0.24 |
| 0.345–0.535 | Reversible handoff |
| 0.535–0.985 | CUC; milestone center 0.64 |

Both adjacent plates decode before input activates. Outgoing opacity stays 1 beneath incoming
opacity t; effective visual contributions are 1-t and t with no background bleed. Everything samples
progress, not a one-shot timeline. Scales stay 0.98–1.04. Reduced motion uses scale 1 and midpoint switch.
Optional midground/foreground and snow/leaves/petals/fireflies/water are data slots only, not systems.

## Assets, confirmed content and limits

The two unchanged PNGs in design-assets/keyframes/experience are **temporary review plates**,
optimized by Next Image, NOT production backgrounds. Baked Peiwen/title/hints/signs remain intact.
Do not overlay another character/headline, extract figures, generate clean plates or reconstruct pixels.

Known compromises: baked text/character ghost during crossfade; sideways hint is stale; portrait cover
crops clip landscape content. Accessible DOM explains vertical-only input. Mobile crop is not final art.
Character continuity is unresolved: clean plates/shared Peiwen or baked stable plates/shared walking
bridge are both future options, neither is selected. No final snow-to-leaf transition exists yet.

Only confirmed narration: Université Paris-Saclay / Human-Computer Interaction · 2025–Present.
CUC narration fields remain null. Do not infer career facts from artwork. No approved public current CV.

Source art is in design-assets/, runtime derivatives in public/assets/, mappings in ASSET_INDEX.md.
Preserve all Desktop originals. No 3C source/runtime files were deleted.

## Verification / next action

Run npm.cmd run lint, npm.cmd run typecheck, npm.cmd run build, git diff --check, plus
node --experimental-strip-types scripts/check-journey.mjs and scripts/check-storybook.mjs with the same flag.
Check forward/reverse wheel/key/swipe, bounds/crossing/hysteresis, 1440×900 and 390×844, resize,
reduced motion, focus/narration/aria-live, console/runtime/network health.
Current results belong in PROJECT_STATE.md. Captures are ignored local visualizations/pass-4a/ output.

Next: user reviews /storybook before a POC commit or default-route replacement. Do not start Pass 4B,
more chapters, art generation, Hub, Project House, AI, bilingual routing, analytics, CMS or backend.

## Recovery and external reference

Old 3C.2/fix A/cleanup was saved before the pivot in the local commit:
Checkpoint: preserve 3C spatial-world experiment before storybook pivot
The old homepage/runtime/CSS remain intact after it. No stashes were changed.
Historical branches: checkpoint/goal-1d-2d, checkpoint/r3f-early, checkpoint/phase-1-approved,
checkpoint/phase-1-1. Older superseded drafts remain local-only stashes. Inspect refs live.
Pass 4A authorizes only the old checkpoint, NOT the storybook commit or any push. Keep AGENTS.md unstaged.

C:\Users\21781\Documents\ChatGPT\portfolio-itom remains a separate sibling reference clone:
https://github.com/ITomPoland/portfolio-itom
MIT code patterns may be studied under the license. Do NOT reuse personal artwork, textures, branding,
copywriting, room designs, project content or visual composition. Peiwen's work must remain original.
