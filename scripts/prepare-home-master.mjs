// User-authorized pixel cloning: preserve the entire plate; repair text rectangles only.
import sharp from "sharp";
import assert from "node:assert/strict";
import { mkdir, copyFile, writeFile } from "node:fs/promises";

const source = "design-assets/home-v2/home-visual-target.png";
const output = "public/home-master";
await mkdir(output, { recursive: true });
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(info.width, 1536);
assert.equal(info.height, 1024);
await copyFile(source, `${output}/master.png`);
// [name, destination x/y/w/h, donor x/y]. All donors are blank original paper.
const regions = [
  ["logo", 104, 22, 257, 59, 104, 90],
  ["navigation", 486, 31, 557, 40, 486, 88],
  ["language", 1270, 33, 87, 37, 1270, 76],
  ["title", 601, 231, 324, 58, 601, 165],
  ["subtitle", 582, 303, 373, 41, 582, 352],
  ["prompt", 629, 417, 280, 36, 629, 371],
  ["footer-left", 99, 922, 155, 53, 370, 971],
  ["footer-right", 1343, 926, 125, 35, 1100, 983],
];
const rgba = Buffer.alloc(1536 * 1024 * 4);
for (const [, x, y, w, h, sx, sy] of regions) {
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
    const dst = ((y + yy) * 1536 + x + xx) * 4;
    const src = ((sy + yy) * 1536 + sx + xx) * 3;
    const alpha = Math.min(1, (Math.min(xx, yy, w - 1 - xx, h - 1 - yy) + 1) / 4);
    rgba[dst] = data[src]; rgba[dst + 1] = data[src + 1]; rgba[dst + 2] = data[src + 2];
    rgba[dst + 3] = Math.round(alpha * 255);
  }
}
await sharp(rgba, { raw: { width: 1536, height: 1024, channels: 4 } }).png().toFile(`${output}/text-clean-plate.png`);
await writeFile(`${output}/text-regions.json`, JSON.stringify(regions, null, 2) + "\n");
console.log("Master copied byte-for-byte; eight paper-only text patches exported.");
