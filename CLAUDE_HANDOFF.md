# Claude Code Handoff

## Read first

1. `AGENTS.md`
2. `PROJECT_STATE.md`
3. `VISUAL_DIRECTION.md`
4. `ASSET_INDEX.md`

Use `.agents/skills/project-task-init/SKILL.md` before significant edits and `.agents/skills/project-delivery-check/SKILL.md` before delivery.

## What this portfolio is becoming

Peiwen Zhang's English-first portfolio is an illustrated spatial world for HCI × AI Agents work. The intended audience is France-based HCI / UX Research / UX Engineer internship recruiters and PhD or research-internship advisors. A visitor should feel that they are walking with Peiwen through her experiences while still finding clear, accessible portfolio information.

Long-term world model: a Hub choice point connects an outward Experience Path and a Project House. Only the Experience Path prototype exists today.

## Current implementation

- Next.js App Router with TypeScript, React, Tailwind CSS, Three.js, and React Three Fiber.
- `app/experience-prototype.tsx` owns the current Canvas scene, path, controls, Peiwen sprite, camera follow, path environment, and first milestone.
- `lib/journey.ts` owns the two-milestone registry and pure progress/transition queries. No global store, BiomeChunk, full JourneyController or independent JourneyCamera exists.
- `app/globals.css` owns DOM overlays, responsive framing, focus styles, and reduced-motion transitions.
- The path is a constrained `THREE.CatmullRomCurve3`, not free 3D exploration.
- Controls: wheel / W-S / Up-Down for progress, A-D / Left-Right for a small lateral offset, and mobile pointer swipes.
- The camera follows behind and above Peiwen with a 39° FOV and restrained look-ahead.
- Experience content stays in semantic DOM beside the scene.

## Preserved Paris-Saclay runtime baseline

The only implemented Experience landmark is:

```text
Université Paris-Saclay
Human-Computer Interaction · 2025–Present
```

The current vignette contains Eiffel, research diagram, desk lamp, notebook, sparse vegetation, dandelion seeds, grounding washes/lines, and seven designed fireflies. The tree is absent from the milestone core. The papers derivative remains in `public/assets/` but is not rendered.

This is the preserved regression baseline, not the next visual target. The approved winter-night
keyframe supersedes the large-Eiffel / white-paper academic composition as future art direction.

Pass 3A and its follow-up 3A-fix are implemented on this branch and were visually approved by Peiwen
on 2026-09-12 from the live dev render. What changed, in short:

- `MILESTONE_PROGRESS` 0.47 -> 0.24 (shorter run-up), with the phase windows retightened to match
  (active < 0.055, approaching < 0.105, slowdown window 0.07) so the arrival text no longer appears
  before she arrives.
- Gentler pacing: wheel 0.00045 -> 0.0003, pointer drag 0.00085 -> 0.00055, keyboard 0.075 -> 0.048,
  progress damping 5 -> 4 (2.8 near the milestone), walk cycle 7Hz -> 5.2Hz so the gait matches.
- Eiffel brought nearer and made stable: desktop local x 1.4 / z 4.8, sprite 2.71 x 4.2. It holds
  within x 17-37% of the frame for the whole approach, where the old placement swept across to 95%
  and back. Mobile sits at x 0.1 / z 8.8 with the sprite trimmed ~11% (2.17 x 3.36) so the spire
  clears the subtitle line.
- Academic vignette recomposed on a shared ground line (each y is the rendered half-height), with
  the lamp as the vertical anchor, the book at its foot, and the sheet on the lamp-head side.
  Desktop and mobile carry separate positions and separate size compensation.
- Milestone copy raised from `top: 24%` to `15%` so the road's upper edge no longer cuts through the
  subtitle at the new milestone bend.
- The intro headline now hides on first movement (`hasMoved`), not only once the milestone is near,
  so the tower no longer passes behind it.
- Self-talk redrawn as a picture-book whisper: an SVG contour whose ink line does not hug the paper
  edge plus two short re-traced strokes, irregular tail dots, anchored in the opening whitespace
  (desktop `top: 26%`, mobile `top: 26%`) clear of Peiwen at both breakpoints.

Pass 3A.1 validation completed on 2026-09-12: wheel, keyboard, and swipe now share a bounded
progress-target contract; forward/reverse milestone crossing retains the active state; lateral-only
movement updates shared movement side effects; and the subdued walking hint measures 4.63:1. Lint,
typecheck, production build, responsive rendering, and reduced-motion emulation passed. Details are
in `PROJECT_STATE.md`.

## Pass 3B — Journey Registry Foundation

- Registry IDs: `paris-saclay`, `cuc`, and transition `paris-saclay-to-cuc`.
- Centers: `0.24` and `0.64`; active/approach/slowdown radii: `0.055 / 0.105 / 0.07`.
- Saclay stable `0.015–0.345`, transition `0.345–0.535`, CUC stable `0.535–0.985`.
  Reveal sampling uses `0.41–0.535`. These are foundation timings, not final visual timing.
- Input target limits, coefficients, damping and lateral movement side effects retain 3A.1 behavior.
  Crossing selects the first center in the direction of travel; active retention belongs to a milestone ID.
- CUC is logical only: no scene, narration, camera framing or character reaction. Its approach,
  active/passed state, slowdown and hysteresis work. All narration fields and framing variants are null.
- Transition and reveal functions return progress-based values only; no environment material is changed.
- Review: `?arrival=1` still selects Saclay; `?arrival=paris-saclay` and `?arrival=cuc` select registry IDs.
  Unknown IDs leave normal starting progress intact. Inspect `main[data-milestone][data-phase]` for
  logical state. No visible debug UI was added. The skip link retains access to confirmed Saclay details.
- Run `node --experimental-strip-types scripts/check-journey.mjs`: 1222 deterministic assertions.
  Node 22 may print type-stripping/module-detection warnings; no dependency or package-mode change is needed.
- Verification: lint, typecheck and production build passed. Six desktop/mobile reduced-motion
  comparison frames exactly matched the pre-migration baseline. Wheel, all movement keys, emulated
  touch, bidirectional crossing/retention, resize, focus, review IDs and reduced motion passed.
  No browser errors or failed requests were observed. Physical-device performance remains unverified.

## Approved constraints

- Preserve the long winding road, constrained movement, camera behavior, Peiwen walking, semantic text, accessibility, and reduced-motion support unless the user explicitly changes scope.
- Preserve Peiwen's approved character identity and source artwork exactly.
- Do not fabricate companies, schools, roles, dates, outcomes, or project facts.
- Do not expose a CV yet. Older CV material predates Paris-Saclay.
- Treat any current positioning line as temporary copy.
- Keep source sheets in `design-assets/`; runtime derivatives belong in `public/assets/`.
- The approved targets are `design-assets/keyframes/experience/paris-saclay-approved.png` and
  `cuc-approved.png`: 2.5D hand-drawn picture-book winter night → autumn sunset. These are visual
  source of truth, not ordinary moodboards and not runtime assets. Do not use the old monochrome
  palette or old Eiffel prominence as current target guidance.
- Use deterministic preprocessing for approved artwork. Do not redraw, regenerate, inpaint, or alter proportions/internal line structure.
- Keep the experience playful and spatial without scores, missions, collectibles, failure states, enemies, or fully free exploration.
- Do not add dependencies unless the implementation clearly needs them and the user approves.

## Not approved or implemented

- Winter Saclay and autumn CUC runtime layers or visual transitions are not implemented. Their
  keyframe direction is approved; an implementation/asset-production scope is still needed.
- CUC identity, period and summary have not been confirmed. Do not infer them from the artwork.
- Full Hub, Project House, Projects, About, Playground, bilingual routing, Personal AI, or AI Peiwen.
- Final positioning copy or current CV.
- Complex scroll camera, complex parallax, 3D world expansion, CMS, analytics, or backend.

## External technical reference

The sibling clone at `C:\Users\21781\Documents\ChatGPT\portfolio-itom` points to <https://github.com/ITomPoland/portfolio-itom> and is not part of this repository. Clone it separately if needed.

It is MIT-licensed and may be studied for scene state, camera organization, preload/performance strategy, device tiers, DOM/Canvas layering, and transition architecture. Do not reuse personal artwork, textures, branding, copy, room design, project content, or visual composition. Peiwen's world must remain visually original.

## Assets

- Source drawings and composition references: `design-assets/`
- Optimized runtime WebP assets: `public/assets/`
- Full mapping and restrictions: `ASSET_INDEX.md`
- New keyframes are original PNG copies; SHA-256 equality with the supplied attachments was checked.
  They are flattened images: missing/occluded layers cannot be recovered by alpha extraction alone.
  No winter trees, campus clocktower or other new runtime derivatives were generated in Pass 3B.

## Historical recovery

GitHub-transferable checkpoint branches preserve the useful evolution:

- `checkpoint/goal-1d-2d`
- `checkpoint/r3f-early`
- `checkpoint/phase-1-approved`
- `checkpoint/phase-1-1`

Older Goal 1C, Hero/Experience v2, and rejected v1 drafts remain only in the original local Git stash because they are superseded and should not clutter the shared branch list.

## Next task

Inspect live Git state first. Pass 3B is accepted and Pass 3C (Saclay-only winter biome conversion)
is authorized. Eight P0 originals are now consolidated under `design-assets/source/experience/saclay/`.
They are source assets pending alpha/halo/crop/resize/compression and browser QA; no runtime WebP or
scene integration was created during consolidation. See `ASSET_INDEX.md` for exact files and hashes.

Resume with deterministic runtime-asset QA, then establish the static desktop/mobile composition.
Preserve the movement/registry contract and approved keyframe style. Do not load source PNGs as
production runtime assets, regenerate missing artwork, or start CUC runtime/visual transition.

The historical "Pass 3B entry ritual + ambient life" proposal remains deferred; this pass is named
Journey Registry Foundation. Do not start an entry ritual, Hub, Project House, visual transition or
asset generation by default. Commit or push only when requested for the active task.

## Working notes for the next agent

Two things cost hours in the previous session and are worth knowing before touching this scene:

- Composition cannot be tuned by reasoning about the coordinates. At the arrival camera the milestone
  group's local x axis runs close to the view direction on both breakpoints, so moving a piece along
  x can swing it across the frame or flip which side of the cluster it lands on, and on mobile every
  unit of z also slides the tower sideways. Change one value, look at a settled frame, measure, repeat.
- If the scene is inspected through a hosted browser pane: when the pane is hidden the page's
  `requestAnimationFrame` stops, so the R3F loop freezes, the canvas screenshots come back black, and
  the camera ease freezes part-way through. Any measurement taken in that state is wrong. Bring the
  pane to the front and let the camera settle before trusting a frame.
