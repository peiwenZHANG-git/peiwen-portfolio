# Projects attic assets

- `hanging-paper.webp`: 600 × 800 transparent WebP (about 81 KiB), generated with imagegen using the user's lower-clothesline screenshot on 2026-09-21 as the style reference. Blank pale paper with a fine uneven pencil outline; no baked content. Replaces the scalloped About paper texture on interactive cards. Text, images and the small SVG wooden clip remain DOM/vector elements.

- `attic.webp`: faithful WebP conversion (quality 90, 1448 × 1086) of the user-provided `image-1.png` attached to the Projects demo objective on 2026-09-18. Preserved as the reference; not the runtime background.
- `attic-clean.webp`: imagegen edit of that same reference, then WebP quality 90 (1448 × 1086, approximately 272 KiB). Runtime background. Removes the baked title/subtitle, circular navigation arrows and upper rope/cards so DOM content can occupy that space. Keeps the attic framing, window, Paris, character, desk, flowers, cat and lower decorative rope. The edit also removes the upper-right exploration annotation; generative cleanup can introduce small texture differences and is not pixel-identical outside removed areas.
- No scene was designed from scratch. Both variants retain the source aspect ratio; CSS uses `cover` without stretching.
- Card images and subtle paper textures reuse `/assets/about/` illustrations. These are demo placeholders, not actual project screenshots.

Source: user-supplied artwork; no new third-party stock asset or licensing claim. Original attachment remains untouched. Clean-plate prompt: remove only baked upper UI/rope/cards, reconstruct the existing wall/window, preserve the scene and second clothesline with its papers. Human artwork approval remains pending.
