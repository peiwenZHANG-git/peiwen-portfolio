# Visual Direction

## Product intent

The portfolio should feel like entering Peiwen's small illustrated world and then walking with her through her experiences. It serves internship recruiters and research advisors, so atmosphere supports clear identity and readable evidence rather than replacing it.

Long-term world model:

```text
HubScene
├── Experience Path
└── Project House
```

The current visual implementation covers only the Experience Path and the preserved Paris-Saclay
prototype. CUC exists as a logical registry milestone, with no runtime scene or narration.

## Current visual source of truth

- `design-assets/keyframes/experience/paris-saclay-approved.png`: winter night, blue-violet painted
  sky, snow, crescent moon, warm campus windows and path lamps, distant Eiffel, foreground snow branches.
- `design-assets/keyframes/experience/cuc-approved.png`: late-autumn sunset, pink/gold/orange painted
  sky, ginkgo, fallen leaves, campus clocktower, campus name stone and distant city memory.

Both PNGs are approved target keyframes, preserved byte-for-byte from the supplied attachments.
They are not ordinary moodboards and are not runtime textures. Their artwork style must not be
reinterpreted as a realistic or generic 3D game environment.

The Saclay keyframe supersedes the old large-Eiffel / white-paper academic-prop composition as
the next target. The CUC keyframe is the next CUC visual target. Neither biome is visually implemented.

## Approved foundations

- Preserve the long organic S-shaped road as the spatial and narrative backbone.
- Keep generous negative space and alternating left/right opportunities around the road.
- Use the approved keyframes' hand-drawn, painterly picture-book atmosphere, paper texture and
  authored seasonal colors. The earlier mostly-monochrome palette is historical guidance only.
- Keep a 2.5D boundary: Three.js/R3F supplies space, path, camera and runtime transitions;
  illustration layers supply final visual character; DOM supplies accessible narration.
- Treat Peiwen as a gentle companion rather than a game avatar. Movement can feel light and playful without score, failure, missions, or free exploration.
- Keep the third-person camera soft, stable, and readable, with space for upcoming landmarks and DOM text.
- Keep milestones as places or memory fragments. Information sits in nearby whitespace rather than inside cards, signs, HUD panels, or modals.
- Keep the world mostly still. Use sparse idle movement and let spatial motion come primarily from walking.
- Respect `prefers-reduced-motion`; the static composition must work without motion.

## Historical Paris-Saclay runtime composition, preserved for regression

Existing source ingredients (not a substitute for the new keyframe):

- Eiffel landmark as the France / Paris memory anchor.
- Research diagram, desk lamp, and notebook as an asymmetrical academic vignette.
- Sparse grass, flowers, dandelion seeds, and warm fireflies.
- Peiwen walking into the page on the road.
- Semantic text: `Université Paris-Saclay` and `Human-Computer Interaction · 2025–Present`.

The 3A/3A-fix visual baseline was approved for that iteration and preserved through 3A.1 and 3B:

- Eiffel is the first environmental object after Peiwen and sits in the left rear-midground.
- Diagram → lamp → notebook descends toward the road; the optional papers are omitted to reduce clutter.
- Pale irregular washes and broken ground lines keep the source fragments from reading as floating stickers.
- Seven milestone fireflies form three designed groups: two around Eiffel, three around the academic vignette, and two inviting from the path.
- Desktop text sits in upper-right whitespace and appears at arrival. Mobile text stays at the top.
- Self-talk is a small hand-drawn SVG bubble in the opening whitespace.

Historical observations, not new target requirements:

- Eiffel currently appears larger than the earlier 20–28% viewport-height target on desktop.
- The old Eiffel prominence and academic-prop balance must not override the winter target keyframe.
- Approach and arrival produce different placements because the existing follow camera travels along the curve.
- Mobile has a separate composition fit rather than a crop of desktop.

## Future direction, not current implementation

- Saclay → CUC: blue-violet winter night → dusty pink → warm autumn orange. Use authored layers
  with progress-based crossfade/interpolation, not procedural seasons or shader weather.
- Snow, moon and winter vegetation gradually leave; autumn vegetation and sparse falling leaves
  enter; CUC's landmark should appear in the distance before arrival. These are approved direction,
  not implemented effects. Pass 3B only samples transition/reveal values.
- Hub: Peiwen at a choice point; Experience path outward/left, Project House toward home/right, cottage on the right, subtle firefly guidance.
- Project House: planned only; no room design or navigation behavior is approved.
- CUC visual target is approved, and logical milestone behavior is implemented. Runtime artwork,
  identity, dates and summary are not implemented/confirmed. Existing Tiananmen and wooden-sign
  source sheets must not stand in for the target's campus clocktower and name stone.
- Birds and butterflies are global ambient-life sources, not exclusive to any milestone.
- Personal AI, bilingual routing, Projects, About, and Playground remain later decisions.

## Asset and responsive limits

The two keyframes are flattened illustrations containing text, a character and occluded scenery.
Do not extract the whole image as a walking background or invent hidden pixels. A separately scoped
asset pass must supply appropriate layers while preserving source drawings. Keep large painted
details baked; use transparent planes for depth and only sparse sprites for ambient motion.

No portrait keyframe or new movement/transition video was supplied. Mobile framing and exact
transition pacing still need validation against the approved direction in the visual pass.

## Originality and reference boundary

ITom's public portfolio (<https://github.com/ITomPoland/portfolio-itom>) may be inspected under its MIT license for technical patterns such as scene state, camera organization, preload strategy, DOM/Canvas layering, and device-aware performance. Do not copy personal artwork, textures, branding, copywriting, room design, project content, or visual composition. Peiwen's illustration system and world must remain original.
