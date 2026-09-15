# Home Visual Truth — Static Reconstruction

`home-visual-target.png` is the supplied 1536×1024 Home target and is preserved unchanged.
The first reconstruction pass uses only deterministic crops from that file.

## Core crops

- `public/assets/home-v2/home-paper-base.webp` — clean paper patch enlarged for the paper field.
- `public/assets/home-v2/home-far-background.webp` — left mountain, town, church, water and distance as one group.
- `public/assets/home-v2/home-ground-main.webp` — central meadow and branching paths.
- `public/assets/home-v2/home-right-scene.webp` — right house, tree, hedge and fence group.
- `public/assets/home-v2/home-foreground-left.webp` — left foreground flowers and stones.
- `public/assets/home-v2/home-foreground-right.webp` — right foreground flowers and fence.
- `public/assets/home-v2/peiwen-idle-back.webp` — target Peiwen crop, retained as a visual anchor.

`home-static-scene-v2.webp` is a grouped lower-scene plate (y=480–920) used only by the
`?static-reconstruction=1` review route. Header and central copy remain DOM. It is not used as a
full-page screenshot background and does not replace the interactive Home runtime yet.

## Extraction status

All visible pixels are source extraction. No AI-generated replacement art or inpainting was added;
the attempted image edit was unavailable because the image-generation quota returned HTTP 429.
Interactive walking, About and house-state assets are intentionally deferred until this static plate
receives manual approval. Old Home sources remain in place for other routes and rollback.
