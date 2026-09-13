# Asset Index

## Storage rules

- `design-assets/` contains source drawings and composition references for design work. These are not loaded by the application.
- `public/assets/` contains optimized transparent WebP derivatives used at runtime.
- Project-local source copies are byte-identical to the originals under `C:\Users\21781\Desktop\个人网站\image` at their recorded import verification date. The Desktop originals were not modified.
- Do not overwrite a source sheet while extracting runtime assets. Create deterministic derivatives by crop, background removal, alpha feathering, resize, and WebP/PNG optimization only.
- `design-assets/references/` is for composition study only. Do not copy visual content from those images into production.

## Approved Experience target keyframes

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
2026-09-13. They are active source art pending alpha, halo, crop, scale, compression and browser QA.
None is a runtime asset, and no WebP derivative exists yet.

| ID | Repository source path | Type | Milestone | Status | Runtime derivative | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `a1-warm-campus-cluster` | `design-assets/source/experience/saclay/a1-warm-campus-cluster.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1086×1448 RGBA; warm-window campus cluster. |
| `b1-snow-road-surface` | `design-assets/source/experience/saclay/b1-snow-road-surface.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 2508×627 RGB; horizontal painted snow surface, intentionally no alpha. |
| `b2-snow-edge-left` | `design-assets/source/experience/saclay/b2-snow-edge-left.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1448×1086 RGBA; illustrated left snow edge. |
| `b3-snow-edge-right` | `design-assets/source/experience/saclay/b3-snow-edge-right.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1448×1086 RGBA; illustrated right snow edge. |
| `b4-snow-bank` | `design-assets/source/experience/saclay/b4-snow-bank.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1448×1086 RGBA; standalone snow bank. |
| `c1-winter-vegetation` | `design-assets/source/experience/saclay/c1-winter-vegetation.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1024×1536 RGBA; bare tree and evergreen cluster. |
| `c2-left-foreground-snow-bush` | `design-assets/source/experience/saclay/c2-left-foreground-snow-bush.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1536×1024 RGBA; left foreground framing cluster. |
| `c3-upper-right-snow-branch` | `design-assets/source/experience/saclay/c3-upper-right-snow-branch.png` | source asset | Paris-Saclay | generated; pending runtime QA | pending | 1774×887 RGBA; upper-right foreground framing branch. |

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

This consolidation supersedes the pre-import asset audit that found the P0 layers missing. Runtime
readiness is still pending: source availability does not imply alpha/halo/crop/scale/compression QA.
No Experience code, journey registry, character, runtime derivative or visual integration changed.

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

Available runtime derivatives include clouds, flowers, grass, dandelion seeds, fireflies, and tree assets under `public/assets/world/`. Hub itself is not implemented.

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
