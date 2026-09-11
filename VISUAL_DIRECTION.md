# Visual Direction

## Product intent

The portfolio should feel like entering Peiwen's small illustrated world and then walking with her through her experiences. It serves internship recruiters and research advisors, so atmosphere supports clear identity and readable evidence rather than replacing it.

Long-term world model:

```text
HubScene
├── Experience Path
└── Project House
```

The current implementation covers only the Experience Path and its first confirmed landmark.

## Approved foundations

- Preserve the long organic S-shaped road as the spatial and narrative backbone.
- Keep generous negative space and alternating left/right opportunities around the road.
- Use a light, airy, mostly monochrome picture-book atmosphere with slightly wonky hand-drawn construction.
- Use warm off-white, black, and warm gray as the base. Muted green, wood brown, and warm yellow are restrained accents.
- Treat Peiwen as a gentle companion rather than a game avatar. Movement can feel light and playful without score, failure, missions, or free exploration.
- Keep the third-person camera soft, stable, and readable, with space for upcoming landmarks and DOM text.
- Keep milestones as places or memory fragments. Information sits in nearby whitespace rather than inside cards, signs, HUD panels, or modals.
- Keep the world mostly still. Use sparse idle movement and let spatial motion come primarily from walking.
- Respect `prefers-reduced-motion`; the static composition must work without motion.

## Current Paris-Saclay composition

Approved source ingredients:

- Eiffel landmark as the France / Paris memory anchor.
- Research diagram, desk lamp, and notebook as an asymmetrical academic vignette.
- Sparse grass, flowers, dandelion seeds, and warm fireflies.
- Peiwen walking into the page on the road.
- Semantic text: `Université Paris-Saclay` and `Human-Computer Interaction · 2025–Present`.

Current implementation choices awaiting visual approval:

- Eiffel is the first environmental object after Peiwen and sits in the left rear-midground.
- Diagram → lamp → notebook descends toward the road; the optional papers are omitted to reduce clutter.
- Pale irregular washes and broken ground lines keep the source fragments from reading as floating stickers.
- Seven milestone fireflies form three designed groups: two around Eiffel, three around the academic vignette, and two inviting from the path.
- Desktop text sits in upper-right whitespace and appears at arrival. Mobile text stays at the top.
- Self-talk is small borderless warm-gray italic text near Peiwen.

Open questions for visual review:

- Eiffel currently appears larger than the earlier 20–28% viewport-height target on desktop.
- The exact balance between Peiwen, Eiffel, text, and negative space is not approved yet.
- Approach and arrival produce different placements because the existing follow camera travels along the curve.
- Mobile has a separate composition fit rather than a crop of desktop.

## Future direction, not current implementation

- Hub: Peiwen at a choice point; Experience path outward/left, Project House toward home/right, cottage on the right, subtle firefly guidance.
- Project House: planned only; no room design or navigation behavior is approved.
- CUC milestone: source sheets exist, but composition, content, runtime assets, and behavior are not approved or implemented.
- Birds and butterflies are global ambient-life sources, not exclusive to any milestone.
- Personal AI, bilingual routing, Projects, About, and Playground remain later decisions.

## Originality and reference boundary

ITom's public portfolio (<https://github.com/ITomPoland/portfolio-itom>) may be inspected under its MIT license for technical patterns such as scene state, camera organization, preload strategy, DOM/Canvas layering, and device-aware performance. Do not copy personal artwork, textures, branding, copywriting, room design, project content, or visual composition. Peiwen's illustration system and world must remain original.
