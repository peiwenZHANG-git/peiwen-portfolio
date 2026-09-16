import { mkdir } from "node:fs/promises";
import sharp from "sharp";

/**
 * Deterministic runtime derivatives for the Experience v2 page.
 * Source art is untouched under design-assets/experience-v2/; only crop/resize/
 * format conversion happens here, no redrawing or color changes.
 */

const SRC = "design-assets/experience-v2";
const OUT = "public/assets/experience";

async function ensureDirs() {
  for (const d of ["scenes", "keepsakes", "walk", "drift"]) {
    await mkdir(`${OUT}/${d}`, { recursive: true });
  }
  await mkdir("public/assets/ui", { recursive: true });
}

// Scenes: source PNGs are 1499x1049 (already faded/matted). The pass plan asked for
// 1400/2400w pairs; the source only supports up to its native 1499px without
// upscaling, so we ship 1400 (downscaled) and 1499 (native, capped) instead of a
// fabricated 2400px file. Documented as a deliberate deviation in the handoff report.
const SCENES = [
  { key: "saclay", file: "scene-01-paris-saclay.png" },
  { key: "cuc", file: "scene-02-cuc.png" },
  { key: "japan", file: "scene-03-japan.png" },
];

async function buildScenes() {
  for (const { key, file } of SCENES) {
    const src = sharp(`${SRC}/scenes/${file}`);
    await src.clone().resize({ width: 1400 }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/scenes/${key}-1400.webp`);
    await src.clone().webp({ quality: 90, alphaQuality: 95 }).toFile(`${OUT}/scenes/${key}-1499.webp`);
  }
}

const KEEPSAKES = ["ticket", "ginkgo", "sakura"];

async function buildKeepsakes() {
  for (const key of KEEPSAKES) {
    const src = sharp(`${SRC}/keepsakes/keepsake-${key}.png`);
    await src.clone().resize({ width: 180 }).webp({ quality: 90, alphaQuality: 95 }).toFile(`${OUT}/keepsakes/${key}-180.webp`);
    await src.clone().resize({ width: 64 }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/keepsakes/${key}-64.webp`);
  }
}

// Walk frames: crop all four frames to the SAME box (the union of each frame's own
// trimmed content) so the character never jitters horizontally/vertically between
// frames, then resize every frame to the same 400px height.
const WALK_CROP = { left: 255, top: 141, width: 671, height: 1194 };

async function buildWalk() {
  for (let i = 1; i <= 4; i++) {
    const n = String(i).padStart(2, "0");
    await sharp(`${SRC}/peiwen-walk/peiwen-walk-right-${n}.png`)
      .extract(WALK_CROP)
      .resize({ height: 400 })
      .webp({ quality: 92, alphaQuality: 95 })
      .toFile(`${OUT}/walk/walk-${n}.webp`);
  }
}

// Drift sprites (small falling ginkgo/sakura), extracted from the approved
// prototype's own embedded art -- not redrawn. Kept near-native size.
async function buildDrift() {
  for (const key of ["ginkgo", "sakura"]) {
    await sharp(`${SRC}/drift/drift-${key}.png`).webp({ quality: 92, alphaQuality: 95 }).toFile(`${OUT}/drift/${key}.webp`);
  }
}

async function buildCursors() {
  for (const key of ["pencil", "hand", "grab"]) {
    for (const suffix of ["", "@2x"]) {
      await sharp(`${SRC}/cursors/cursor-${key}${suffix}.png`).png().toFile(`public/assets/ui/cursor-${key}${suffix}.png`);
    }
  }
}

await ensureDirs();
await buildScenes();
await buildKeepsakes();
await buildWalk();
await buildDrift();
await buildCursors();
console.log("Experience v2 runtime assets prepared.");
