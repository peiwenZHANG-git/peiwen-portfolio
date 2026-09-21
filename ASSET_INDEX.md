# Asset Index

## Reso case study

`public/assets/projects/reso/` contains ten compressed, original PDF figures for
`/projects/reso`: working prototype, two caption examples, two paper prototypes,
control panel, Conditions A/B, emotion results and workload results. Provenance,
slide/image-object mapping and limits are in that directory's `README.md`.
`public/assets/projects/reso/resources/` additionally contains a responsive-ready
30-second MP4 demo with English captions, byte-identical final paper and presentation
PDFs, and a privacy-safe aggregate HTML analysis summary. The source analysis HTML is
not shipped because it includes participant identifiers and individual-level data.
AR/WoZ photographs and a verified rhythm-graph before/after pair are not available
in the selected material. No replacement evidence was generated.

## Active Home master

- **Frozen after user approval (2026-09-15): do not rerun the master preparation script
  or replace any master/text-patch pixels.** Protected hashes: `public/peiwen-phase1/frozen-master-sha256.json`.
- Phase 1 ONLY: `public/peiwen-phase1/peiwen-original.png` uses original master RGB with
  a local alpha mask; `origin-clean-plate.png` is a 120×230 transparent silhouette patch
  at master (800,608), including the original contact shadow. `design-assets/peiwen-phase1/`
  records the selected imagegen local inpaint source and exact prompt. No generated
  character drawing is used. `scripts/prepare-peiwen-phase1.mjs` regenerates ONLY these
  derivatives and asserts frozen hashes; never redraws the master. Visual review pending.

- `public/home-master/master.png`: byte-identical copy of
  `design-assets/home-v2/home-visual-target.png`, used in the static review only.
- `public/home-master/text-clean-plate.png`: transparent 1536×1024 layer containing original-paper
  clones over eight text regions. Donor/destination coordinates: `public/home-master/text-regions.json`.
- Rebuild with `node scripts/prepare-home-master.mjs`. No source pixel changes outside these patches.
  DOM uses Patrick Hand via next/font, reusing the typeface already available in the project.
- Old `public/assets/home-v2/` crops remain preserved and are not a visual foundation for this mode.
  Character removal, movement frames, light, door and animated overlays are not produced in this phase.

## Phase 5.2 revision — left-preview feedback assets

- The revised Phase 5.2 road and destination feedback uses CSS `clip-path` / mask layers
  over the frozen master image. No baked left-scene overlay is used by the app. The
  earlier `left-wake-overlay.webp` experiment is retired/unreferenced and must not be
  reintroduced.
- Road wake uses one master-derived layer confined to a local route ribbon. A custom
  property animates a directional mask from Peiwen toward the road curve; there is no
  blur, soft-focus, white outline or route icon.
- Distant response uses two small CSS mask anchors at the church and water. No full-village
  clarity or broad saturation treatment is used.

- `design-assets/peiwen-phase5/fluffy-dandelions-source.png` is the user-supplied 1254×1254
  RGBA sheet of four fluffy dandelions. It is source-only and is not loaded by the app.
- `public/peiwen-phase5/fluffy-dandelion-near.png` (140×185 RGBA) and
  `public/peiwen-phase5/fluffy-dandelion-far.png` (96×122 RGBA) are deterministic crop +
  resize derivatives from the two selected sheet entries. No redrawing, background matting
  or color/pose alteration was applied.
- Existing `public/assets/world/firefly-v2.webp` is reused at small scale for the two local
  firefly wake points. No firefly asset was modified or newly created.
- These feedback layers are active only on `/?peiwen-phase5=1` during Left Preview. The
  near dandelion is the sole intentional preembedded element; all other overlays have zero
  Idle opacity and active feedback exits fully on About, Right or Idle.

## Storage rules

## Home visual truth rebuild — 2026-09-15

`design-assets/home-v2/home-visual-target.png` is the supplied 1536×1024 target. Deterministic
grouped crops and the review-only lower plate live under `public/assets/home-v2/`; the extraction
manifest is `design-assets/home-v2/README.md`. The lower plate is used only by
`?static-reconstruction=1` while the existing interactive Home state machine remains untouched.
No source file was deleted, and no Experience asset is shared by these crops. AI inpainting was
attempted but unavailable (HTTP 429), so all visible pixels are extracted from the target.

- `design-assets/` contains source drawings and composition references. Exception: Pass 4A `/storybook`
  statically imports ONLY `keyframes/experience/paris-saclay-approved.png` and `cuc-approved.png` as
  **temporary review plates**, optimized by Next Image. They contain baked Peiwen, headline and UI;
  they are not final production backgrounds. Originals remain unchanged; no cutout/cleanup is performed.
- `public/assets/` contains optimized transparent WebP derivatives used at runtime.
- Project-local source copies are byte-identical to the originals under `C:\Users\21781\Desktop\个人网站\image` at their recorded import verification date. The Desktop originals were not modified.
- Do not overwrite a source sheet while extracting runtime assets. Create deterministic derivatives by crop, background removal, alpha feathering, resize, and WebP/PNG optimization only.
- `design-assets/references/` is for composition study only. Do not copy visual content from those images into production.

## Approved Experience target keyframes

Pass 4A supersedes the old runtime prohibition only for the two temporary review plates named above.
All 3C source and runtime derivatives remain preserved as an abandoned spatial experiment; do not
delete them or continue tuning their placements. No production clean plate or new art exists yet.

These are visual source of truth, distinct from the older reference-only moodboards. They are
original PNG copies, not runtime assets. No compression, cropping, background removal or editing
was applied; SHA-256 equality with both attachment originals was verified in Pass 3B.

External paths below are relative to `C:\Users\21781\Desktop\个人网站\image` unless an attachment
identifier is shown.

| Repository file | Source path | Type | Milestone | Status | Runtime asset | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `design-assets/keyframes/experience/paris-saclay-approved.png` | `7d91280b-d942-42cd-9562-71faa6b1e59e/image-1.png` | approved visual keyframe | Paris-Saclay | approved | no | Blue-violet winter night, snowy campus path, warm windows and distant Eiffel. Supersedes the old large-Eiffel / white-paper academic composition. |
| `design-assets/keyframes/experience/cuc-approved.png` | `7d91280b-d942-42cd-9562-71faa6b1e59e/image-2.png` | approved visual keyframe | CUC | approved | no | Autumn sunset, ginkgo, campus clocktower and name stone. |
| `design-assets/keyframes/experience/japan-approved.png` | `references/experience-keyframes/03-japan.png` | approved visual keyframe | Japan | approved | no | Global Experience target. |
| `design-assets/keyframes/experience/tantan-approved.png` | `references/experience-keyframes/04-tantan.png` | approved visual keyframe | Tantan | approved | no | Global Experience target. |
| `design-assets/keyframes/experience/huashun-approved.png` | `references/experience-keyframes/05-huashun.png` | approved visual keyframe | Huashun | approved | no | Global Experience target. |
| `design-assets/keyframes/experience/yundao-approved.png` | `references/experience-keyframes/06-yundao.png` | approved visual keyframe | Yundao | approved | no | Global Experience target. |

Repository SHA-256: Saclay `DFB286F58252C4858C5053E77E76E7C2EC9D53AA7BFAF1E1C55F209B3147607C`;
CUC `E4C1EBA2B671FC73D125D344C1A8452C31497589C94D167AA443D7C7B4947EBC`;
Japan `B4E34298CF2159F082EE44290B0B08190EA65B99749889072C4C96A65A2CD96B`;
Tantan `7162640FCD2E489528030F40AA71548CDA1D79F864686A8F1F310477F66FFD09`;
Huashun `EBA4030736BB0B73C015D60AF8B3AC8F6F4D330536775E99E28A3250EDFC4CD8`;
Yundao `EBFED7C39D5536AB4558BC005DD6CA3CAEE36665D99DCD69821C7C9EF376E362`.

The reorganized Desktop Saclay/CUC copies have different file SHA-256 values from the Pass 3B
repository copies because their PNG density metadata is 72 DPI rather than 96 DPI. Both pairs are
1448×1086 RGB and all 4,717,584 decoded RGB channels match exactly. The repository targets were
therefore retained without another copy or overwrite.

The sources are flattened images; hidden backgrounds and separate seasonal layers are not
available through deterministic alpha extraction alone. No new runtime derivative was created.
All earlier source and runtime assets are preserved as historical or reusable ingredients.

## Saclay P0 source assets

These originals were copied byte-for-byte from `Milestone-Saclay/source/` into the repository on
2026-09-13. Pass 3C.1 created deterministic derivatives without modifying the source PNGs. Cutouts
were cleared only where source alpha was 1–3, cropped to the resulting alpha bounds, given 12 px
transparent padding, resized by intended scene role, and encoded as lossless WebP. B1 remains opaque
and uses high-quality WebP because it is a bounded road surface, not a cutout.

| ID | Repository source path | Type | Milestone | Status | Runtime derivative | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `a1-warm-campus-cluster` | `design-assets/source/experience/saclay/a1-warm-campus-cluster.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/campus-cluster.webp` | Campus, snow and vegetation remain one grounded cluster. |
| `b1-snow-road-surface` | `design-assets/source/experience/saclay/b1-snow-road-surface.png` | source asset | Paris-Saclay | usable with limitation | `public/assets/world/saclay/snow-road-surface.webp` | Opaque, non-seamless 4:1 texture; bounded/stretched UV only, never repeat. |
| `b2-snow-edge-left` | `design-assets/source/experience/saclay/b2-snow-edge-left.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/snow-edge-left.webp` | Independent left edge; not mirrored. |
| `b3-snow-edge-right` | `design-assets/source/experience/saclay/b3-snow-edge-right.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/snow-edge-right.webp` | Independent right edge; not mirrored. |
| `b4-snow-bank` | `design-assets/source/experience/saclay/b4-snow-bank.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/snow-bank.webp` | Local snow-bank cutout, not a road-edge strip. |
| `c1-winter-vegetation` | `design-assets/source/experience/saclay/c1-winter-vegetation.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/winter-vegetation.webp` | Tree, evergreen and shared snow base remain one cluster. |
| `c2-left-foreground-snow-bush` | `design-assets/source/experience/saclay/c2-left-foreground-snow-bush.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/foreground-left.webp` | Transparent foreground framing art; intentional top/left/bottom edge entry retained. |
| `c3-upper-right-snow-branch` | `design-assets/source/experience/saclay/c3-upper-right-snow-branch.png` | source asset | Paris-Saclay | runtime-ready | `public/assets/world/saclay/foreground-upper-right.webp` | Transparent camera-near branch; intentional top/right edge entry retained. |

### Pass 3C.1 alpha and edge QA

All eight sources are sRGB. The seven cutouts have real, effective alpha; none contains a baked
black, gray or white rectangle. Their subject pixels are predominantly alpha 240–254, so the near
absence of exact alpha 255 in C1/C2 is not fake transparency. The `alpha >= 4` bounds below were used
for cleanup/cropping; the wider raw `alpha > 0` bounds were caused by sparse alpha 1–3 residue.

| ID | Source size / mode | Exact opaque pixels / bbox | Effective bbox (`alpha >= 4`) | Effective source margin T/R/B/L | Edge and artifact result |
| --- | --- | --- | --- | --- | --- |
| A1 | 1086×1448 RGBA | 167 / `50,579,1015,460` | `13,517,1061,527` | `517/12/404/13` | 11,952 dirty-alpha pixels cleared; clean silhouette and shared ground line. |
| B1 | 2508×627 RGB | 1,572,516 / full image | full image | `0/0/0/0` | No alpha expected; no obvious generation defect. Edge mismatch confirms non-seamless use. |
| B2 | 1448×1086 RGBA | 64 / `40,258,1341,644` | `14,252,1420,674` | `252/14/160/14` | 31,135 dirty-alpha pixels cleared; snow edge remains intact. |
| B3 | 1448×1086 RGBA | 27 / `63,270,1302,701` | `8,250,1432,745` | `250/8/91/8` | 22,215 dirty-alpha pixels cleared; distinct right-hand shape retained. |
| B4 | 1448×1086 RGBA | 20 / `40,341,1371,480` | `12,335,1425,525` | `335/11/226/12` | 15,174 dirty-alpha pixels cleared; isolated bank remains intact. |
| C1 | 1024×1536 RGBA | 0; maximum alpha 254 | `39,204,956,1138` | `204/29/194/39` | 85,152 dirty-alpha pixels cleared; cluster and snow base remain intact. |
| C2 | 1536×1024 RGBA | 0; maximum alpha 254 | `0,0,1501,1024` | `0/35/0/0` | 48,644 dirty-alpha pixels cleared; no baked gradient; intentional framing crop retained. |
| C3 | 1774×887 RGBA | 259 / `263,10,1482,804` | `229,0,1545,848` | `0/0/39/229` | 56,893 dirty-alpha pixels cleared; no visible halo; snow and branch edges remain intact. |

Blue/purple edge pixels visible in the statistics and dark-background review are part of the
approved illustration shading, not a removable fringe. No subject was split, mirrored, recolored,
redrawn, inpainted or content-aware filled. No asset needs regeneration.

### Runtime dimensions and memory

| Source | Source dimensions / file | Runtime | Runtime dimensions / file | Estimated decoded memory | Resolution reason |
| --- | --- | --- | --- | --- | --- |
| `a1-warm-campus-cluster.png` | 1086×1448 / 943.9 KiB | `campus-cluster.webp` | 1048×533 / 615.1 KiB | 2.13 MiB | 1024 px content width plus padding suits a midground campus cluster. |
| `b1-snow-road-surface.png` | 2508×627 / 2507.2 KiB | `snow-road-surface.webp` | 2048×512 / 306.7 KiB | 4.00 MiB | GPU-friendly 4:1 bounded/stretched road surface; not seamless. |
| `b2-snow-edge-left.png` | 1448×1086 / 831.9 KiB | `snow-edge-left.webp` | 1304×632 / 447.2 KiB | 3.14 MiB | 1280 px content width plus padding preserves a long road edge. |
| `b3-snow-edge-right.png` | 1448×1086 / 665.2 KiB | `snow-edge-right.webp` | 1304×690 / 352.6 KiB | 3.43 MiB | 1280 px content width plus padding preserves its distinct contour. |
| `b4-snow-bank.png` | 1448×1086 / 845.5 KiB | `snow-bank.webp` | 984×378 / 272.2 KiB | 1.42 MiB | 960 px content width is sufficient for a local midground prop. |
| `c1-winter-vegetation.png` | 1024×1536 / 2033.0 KiB | `winter-vegetation.webp` | 924×1095 / 800.0 KiB | 3.86 MiB | 900 px content width retains fine branches at midground scale. |
| `c2-left-foreground-snow-bush.png` | 1536×1024 / 2243.6 KiB | `foreground-left.webp` | 1525×1048 / 1043.0 KiB | 6.10 MiB | Near-camera foreground retains source-scale detail. |
| `c3-upper-right-snow-branch.png` | 1774×887 / 816.0 KiB | `foreground-upper-right.webp` | 1560×867 / 528.0 KiB | 5.16 MiB | Near-camera branch retains a 1536 px content width plus padding. |

Runtime files total 4,364.8 KiB on disk. The conservative simultaneous decoded-memory estimate is
29.24 MiB at four bytes per pixel; actual residency must be assessed during Pass 3C.2 integration.
B1 left/right edge mean absolute RGB difference is 14.47 (maximum 110), so it must not use repeating UVs.

Source SHA-256, in the table order above: `B9DB726D544C8CA124EC14B7E1D95827EAB4FED181B282D1849013CD7692B95C`,
`CE189D3B601A77152312B0FEADDC911B3B227B5D1ED53FBCD427D13BC111D9FC`,
`E68A5423D8C97D09D11BF3199DCA871359AB8109D17972F62C9A77D1514BA86E`,
`24D2DD12BA713FC88D0A4DE66E5540D72A9559ED7FC5B207C5B40EAF12B53276`,
`A23F984F0903624045E21F80E09A8D73C439D865405D2453C0E0B4105E1E22AD`,
`4114C10E5BC94B8A2868DA0117FF51C387FF18A4A1020B948AC1980B4D105359`,
`13008335C9E019DB86509A39844C2F76F0DDDE674AD9D90D0AD9604347EFAAF6`,
`D21AE670D07F51B162ECB1C50DE087B54696C52C35AF2FA69BE5C2242345F6A8`.

## Consolidation exclusions and duplicates

- `Milestone-Saclay/runtime/` is empty; no external runtime asset was imported.
- All 6 Character files, 12 Hub files, and the 2 bird/butterfly files are SHA-256-identical to
  their existing repository source copies. Dandelions and fireflies remain global ambient-life assets.
- `_archive/` contains 3 obsolete CUC sources and 6 V1 references. Every file is SHA-256-identical
  to a historical repository file, but none was copied into an active path or deleted externally.
- External Saclay keyframe copies are mutually SHA-256-identical. Saclay/CUC are decoded-pixel
  duplicates of the existing approved targets as documented above.
- The Desktop directory remains untouched. The repository has no parallel `image/` directory.

This consolidation supersedes the pre-import asset audit that found the P0 layers missing. Pass 3C.1
completed source QA and derivative preparation; visual integration remains intentionally unstarted.
No Experience code, journey registry, character, camera or road geometry changed.

## Character sources

| File | Role |
| --- | --- |
| `design-assets/character/peiwen-character-v1.jpg` | Approved Peiwen visual identity sheet. |
| `design-assets/character/back-walking-v1.jpg` | Back-walking animation source. |
| `design-assets/character/left-walking-strip-v1.jpg` | Left-facing stride source strip. |
| `design-assets/character/left-walking-v1.jpg` | Left-walking source. |
| `design-assets/character/right-walking-v1.jpg` | Right-walking source. |
| `design-assets/character/walking-reference.jpg` | Character pose and walking reference. |

Runtime derivatives: `public/assets/character/peiwen-back-walk-1.webp` through `public/assets/character/peiwen-back-walk-4.webp`.

## Hub sources

| File | Role |
| --- | --- |
| `design-assets/hub/clouds-v1.jpg` | Cloud sprite sheet. |
| `design-assets/hub/fence-v1.jpg` | Hub fence source. |
| `design-assets/hub/flowers-v1.jpg` | Flower sprite sheet. |
| `design-assets/hub/grass-tufts-v1.jpg` | Grass sprite sheet. |
| `design-assets/hub/house-exterior-v1.jpg` | Approved house exterior source. |
| `design-assets/hub/left-path-final-v1.jpg` | Experience-path composition source. |
| `design-assets/hub/right-path-v1.jpg` | Project-house path source. |
| `design-assets/hub/stepping-stones-v1.jpg` | Stepping-stone source. |
| `design-assets/hub/stream-v1.jpg` | Stream source. |
| `design-assets/hub/tree-v1.jpg` | Tree source; its project-local name removes the Desktop original's duplicate `.jpg` extension. |

Available runtime derivatives include clouds, flowers, grass, dandelion seeds, fireflies, and tree assets under `public/assets/world/`.

Home Hub additionally uses deterministic crops from the unchanged character sheets:

- `public/assets/hub/peiwen-idle-cutout.png` from `peiwen-character-v1.jpg`
- `public/assets/hub/peiwen-walk-left-cutout.png` from `left-walking-v1.jpg`
- `public/assets/hub/peiwen-walk-right-cutout.png` from `right-walking-v1.jpg`

Only crop and near-white paper-background removal were applied; no pose, color or drawing was changed.

## About page sources

Peiwen's own watercolour artwork. `/about` is a hybrid: these images are the visual
shell, and every readable element is DOM on top of them. Nothing on the page re-draws
this artwork with CSS gradients, border-radius, SVG filters or inline SVG.

| Source (`design-assets/about/`) | Runtime (`public/assets/about/`) | Role |
| --- | --- | --- |
| `about-desk-scene.png` 1672×941 | `desk-scene.webp` 1672×941 | The desk **and** the open notebook — leather cover, both pages, binder rings, gutter, pen, ginkgo, daisies, books. The desktop stage. |
| `about-photo-frame.png` 1188×1324 | `photo-frame.webp` 700×846 | Polaroid frame; transparent window carries the real portrait. |
| `about-paper-wide.png` 1712×919 | `paper-wide.webp` 1000×297 | Torn paper, wide. Masks the four "What I bring" papers, the beauty-tech note and the CV label. |
| `about-paper-block.png` 1369×1149 | `paper-block.webp` 800×532 | Torn paper, block. Masks the two notes and the three postcard backings. |
| `about-place-beijing/japan/paris.png` 1480×1062 | `place-*.webp` 640×459 | The three travel fragments. |
| `about-tape.png` 2172×724 | `tape.webp` 680×169 | One tape strip, used exactly twice: the portrait and the beauty-tech note. |
| `about-brush-swipe.png` 2172×724 | `brush-swipe.webp` 720×120 | One watercolour stroke, masked and tinted per heading. |
| `about-asset-sheet.png` 1536×1024 | — | Peiwen's contact sheet. Archive only; carries labels and never ships. |
| `portrait-source.jpg` 1080×1387 | `portrait.webp` 900×891 | Peiwen's photograph (MD5 `3cde0e3992de01aee502481718b54ca3`) and its single deterministic crop. |

Derivatives are scale + WebP compression only, plus a crop to the painted bounding box
for `paper-wide`, `paper-block`, `photo-frame`, `tape` and `brush-swipe` — those are used
with `mask-size: 100% 100%` or `border`-style stretching, so transparent canvas margins
would leave the artwork covering only part of its box. No painting was altered. Runtime
total is roughly 620 KB.

Geometry measured from `desk-scene.webp` and used by `about.module.css`: the left sheet
spans x 14.2–47.5%, the right sheet x 53.8–86.8%, both y 16.6–80.4%. The DOM page panels
sit inside that at x 15.5–46% / 55.5–85%, y 17.5–79.5%. The photo frame's transparent
window sits at 7.6% / 7.3% / 84.6% / 68.9% of the cropped frame. If any of these assets is
re-exported, those numbers must be re-measured.

## Milestone sources

| File | Role | Status |
| --- | --- | --- |
| `design-assets/milestones/paris-saclay/eiffel-landmark-v1.jpg` | Eiffel source landmark. | Runtime derivative in use. |
| `design-assets/milestones/paris-saclay/saclay-academic-props-v1.jpg` | Notebook, lamp, diagram, and paper source sheet. | Selected runtime derivatives in use. |
| `design-assets/milestones/cuc/tiananmen-landmark-v1.jpg` | Distant city-memory source. Not the target campus clocktower. | Source only; no runtime implementation. |
| `design-assets/milestones/cuc/cuc-media-props-v1.jpg` | CUC media prop source sheet. | Source only. |
| `design-assets/milestones/cuc/cuc-signpost-v1.jpg` | Historical wooden signpost source. Not the target campus name stone. | Source only. |

Paris-Saclay runtime derivatives:

- `public/assets/world/eiffel-landmark-v1.webp`
- `public/assets/world/saclay-research-diagram-v1.webp`
- `public/assets/world/saclay-desk-lamp-v1.webp`
- `public/assets/world/saclay-notebook-v1.webp`
- `public/assets/world/saclay-papers-v1.webp` (preserved but currently not rendered)

## Global ambient-life sources

| File | Role |
| --- | --- |
| `design-assets/ambient-life/bird-ambient-set-v1.jpg` | Global distant-bird animation/source sheet. |
| `design-assets/ambient-life/butterfly-ambient-set-v1.jpg` | Global butterfly animation/source sheet. |
| `design-assets/ambient-life/dandelion-seeds-v1.jpg` | Global wind/air atmosphere source. |
| `design-assets/ambient-life/fireflies-v2.jpg` | Global guidance/discovery source. |

Birds and butterflies are not CUC-specific. Use them sparsely across the journey when compositionally appropriate.

## Composition references

`design-assets/references/experience-1.jpg` through `design-assets/references/experience-4.jpg`, plus `design-assets/references/house.jpg` and `design-assets/references/hub.jpg`, are reference-only images. They are kept in the private repository so another local coding agent can understand composition intent without chat history. They must not be treated as runtime assets or copied literally.
