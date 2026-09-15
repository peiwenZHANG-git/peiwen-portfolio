// Reproducible pixel extraction from the supplied Home visual truth.
// It never edits the supplied source and does not invent replacement artwork.
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";

const source = "C:/Users/21781/AppData/Local/Temp/codex-clipboard-0bc5c311-4315-4300-b003-82618d380fe1.png";
const sourceCopy = "design-assets/home-v2/home-visual-target.png";
const output = "public/assets/home-v2";
const review = "visualizations/home-v2";
await mkdir(output, { recursive: true });
await mkdir("design-assets/home-v2", { recursive: true });
await mkdir(review, { recursive: true });
await copyFile(source, sourceCopy);

const crops = [
  ["home-paper-base.webp", { left: 610, top: 85, width: 220, height: 160 }, { width: 1536, height: 1024, fit: "fill" }],
  ["home-far-background.webp", { left: 0, top: 492, width: 880, height: 300 }, { width: 880, height: 300, fit: "fill" }],
  ["home-ground-main.webp", { left: 0, top: 620, width: 1536, height: 404 }, { width: 1536, height: 404, fit: "fill" }],
  ["home-right-scene.webp", { left: 1000, top: 235, width: 536, height: 560 }, { width: 536, height: 560, fit: "fill" }],
  ["home-foreground-left.webp", { left: 0, top: 700, width: 500, height: 324 }, { width: 500, height: 324, fit: "fill" }],
  ["home-foreground-right.webp", { left: 980, top: 700, width: 556, height: 324 }, { width: 556, height: 324, fit: "fill" }],
  ["peiwen-idle-back.webp", { left: 792, top: 605, width: 150, height: 235 }, { width: 300, height: 470, fit: "fill" }],
];

for (const [name, extract, resize] of crops) {
  await sharp(source).extract(extract).resize(resize).webp({ quality: 92 }).toFile(`${output}/${name}`);
}

// The lower scene is a grouped source plate, not the full screenshot: text and navigation remain DOM.
await sharp(source).extract({ left: 0, top: 480, width: 1536, height: 440 })
  .webp({ quality: 94 }).toFile(`${output}/home-static-scene-v2.webp`);

const thumbWidth = 360;
const thumbHeight = 190;
const cellHeight = 224;
const names = crops.map(([name]) => name);
const sheet = sharp({ create: { width: thumbWidth * 3, height: cellHeight * 3, channels: 4, background: "#f8f3e9" } });
const layers = [];
for (let i = 0; i < names.length; i++) {
  const col = i % 3, row = Math.floor(i / 3);
  const image = await sharp(`${output}/${names[i]}`).resize({ width: thumbWidth, height: thumbHeight, fit: "inside" }).png().toBuffer();
  const label = Buffer.from(`<svg width="${thumbWidth}" height="${cellHeight}"><rect width="100%" height="100%" fill="#f8f3e9"/><text x="10" y="215" font-family="sans-serif" font-size="13" fill="#403d39">${names[i]}</text></svg>`);
  layers.push({ input: label, left: col * thumbWidth, top: row * cellHeight });
  layers.push({ input: image, left: col * thumbWidth, top: row * cellHeight + 4 });
}
await sheet.composite(layers).png().toFile(`${review}/asset-contact-sheet.png`);
console.log(`Prepared ${names.length} core crops plus home-static-scene-v2.webp from ${sourceCopy}`);
