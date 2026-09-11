# Asset Index

## Storage rules

- `design-assets/` contains source drawings and composition references for design work. These are not loaded by the application.
- `public/assets/` contains optimized transparent WebP derivatives used at runtime.
- Project-local source copies are byte-identical to the originals under `C:\Users\21781\Desktop\个人网站\image` as of 2026-09-11. The Desktop originals were not modified.
- Do not overwrite a source sheet while extracting runtime assets. Create deterministic derivatives by crop, background removal, alpha feathering, resize, and WebP/PNG optimization only.
- `design-assets/references/` is for composition study only. Do not copy visual content from those images into production.

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
| `design-assets/milestones/cuc/tiananmen-landmark-v1.jpg` | CUC landmark source. | Source only; no approved milestone implementation. |
| `design-assets/milestones/cuc/cuc-media-props-v1.jpg` | CUC media prop source sheet. | Source only. |
| `design-assets/milestones/cuc/cuc-signpost-v1.jpg` | CUC signpost source. | Source only. |

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
