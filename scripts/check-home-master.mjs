import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");
const out = "visualizations/home-master";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
  page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto("http://localhost:3000/?static-reconstruction=1");
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  // Hide only the development toolbar, not any part of the page.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  assert.equal(await page.locator("main").getAttribute("data-visual"), "master-static");
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  await page.screenshot({ path: `${out}/static-master-1536.png` });
  await page.mouse.move(860, 720);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(500);
  assert.equal(await page.locator("main").getAttribute("data-state"), "IDLE");
  assert.equal(await page.locator("h1").innerText(), "Peiwen Zhang");
  assert.deepEqual(errors, []);
} finally { await browser.close(); }

const targetFile = "design-assets/home-v2/home-visual-target.png";
const captureFile = `${out}/static-master-1536.png`;
const target = await sharp(targetFile).removeAlpha().raw().toBuffer();
const capture = await sharp(captureFile).removeAlpha().raw().toBuffer();
assert.equal(target.length, capture.length);
// Sharp composite does not support an opacity option: set the overlay's actual alpha.
const half = await sharp(captureFile).removeAlpha().ensureAlpha(.5).png().toBuffer();
await sharp(targetFile).composite([{ input: half }]).png().toFile(`${out}/overlay-50.png`);
const difference = Buffer.alloc(target.length);
const regions = JSON.parse(await readFile("public/home-master/text-regions.json", "utf8"));
let sum = 0, outsideSum = 0, outsideCount = 0, changedOutside = 0;
for (let p = 0; p < 1536 * 1024; p++) {
  const x = p % 1536, y = Math.floor(p / 1536);
  const inText = regions.some(([, rx, ry, w, h]) => x >= rx - 5 && x < rx + w + 5 && y >= ry - 5 && y < ry + h + 5);
  for (let c = 0; c < 3; c++) {
    const delta = Math.abs(target[p * 3 + c] - capture[p * 3 + c]);
    difference[p * 3 + c] = Math.min(255, delta * 4);
    sum += delta;
    if (!inText) { outsideSum += delta; outsideCount++; if (delta > 1) changedOutside++; }
  }
}
await sharp(difference, { raw: { width: 1536, height: 1024, channels: 3 } }).png().toFile(`${out}/difference-4x.png`);
const metrics = { rgbMeanAbsoluteDifference: sum / target.length, outsideTextMeanAbsoluteDifference: outsideSum / outsideCount, outsideTextChannelsChangedOver1: changedOutside, note: "Difference preview amplified 4×; pixel scores are not visual approval." };
await writeFile(`${out}/comparison.json`, JSON.stringify(metrics, null, 2) + "\n");
console.log(JSON.stringify(metrics));
console.log("Static-only behavior, real text, zero browser errors checked.");
