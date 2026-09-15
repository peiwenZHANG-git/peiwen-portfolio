import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");
const out = "visualizations/peiwen-phase1";
await mkdir(out, { recursive: true });
const frozen = JSON.parse(await readFile("public/peiwen-phase1/frozen-master-sha256.json", "utf8"));
for (const [file, hash] of Object.entries(frozen)) {
  assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), hash, `Frozen file changed: ${file}`);
}
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width: 1536, height: 1024 } } });
const page = await context.newPage();
page.on("pageerror", e => errors.push(e.message));
page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
const settled = async state => page.waitForSelector(`[data-phase-one][data-state="${state}"][data-moving="false"]`);
try {
  await page.goto("http://localhost:3000/?peiwen-phase1=1");
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await page.waitForSelector('[data-phase-one][data-ready="true"]');
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await page.mouse.move(760, 100);
  await page.screenshot({ path: `${out}/01-idle.png` });
  await page.waitForTimeout(800);
  await page.mouse.move(350, 650);
  await page.waitForSelector('[data-moving="true"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/walking-checkpoint.png` });
  await settled("LEFT_PREVIEW");
  await page.screenshot({ path: `${out}/02-left-preview.png` });
  await page.screenshot({ path: `${out}/left-detail.png`, clip: { x: 732, y: 600, width: 206, height: 250 } });
  await page.waitForTimeout(1100);
  await page.mouse.move(780, 500);
  await page.waitForSelector('[data-moving="true"]');
  await settled("IDLE");
  await page.screenshot({ path: `${out}/03-return-idle.png` });
  await page.waitForTimeout(800);
  // Latest intent during motion settles at a checkpoint, without a stranded overlay.
  await page.keyboard.press("ArrowLeft");
  await page.waitForSelector('[data-moving="true"]');
  await page.keyboard.press("Escape");
  await settled("IDLE");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("[data-phase-one]").getAttribute("data-state"), "IDLE");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("ArrowLeft");
  await settled("LEFT_PREVIEW");
  await page.keyboard.press("Escape");
  await settled("IDLE");
  await page.getByRole("button", { name: "Preview Peiwen walking left" }).focus();
  await page.keyboard.press("Space");
  await settled("LEFT_PREVIEW");
  await page.keyboard.press("Escape");
  await settled("IDLE");
  await page.getByRole("button", { name: "Preview Peiwen walking left" }).evaluate(button => button.blur());
  assert.deepEqual(errors, []);
} finally {
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/idle-left-return.webm`);
  await browser.close();
}
const pixels = file => sharp(file).removeAlpha().raw().toBuffer();
const initial = await pixels(`${out}/01-idle.png`);
const returned = await pixels(`${out}/03-return-idle.png`);
const baseline = await pixels("design-assets/peiwen-phase1/frozen-idle-baseline.png");
assert.ok(initial.equals(returned), "Returned Idle differs from first Idle");
assert.ok(initial.equals(baseline), "Phase 1 Idle differs from frozen master screenshot");
const left = await pixels(`${out}/02-left-preview.png`);
let outsideChanged = 0;
for (let p = 0; p < 1536 * 1024; p++) {
  const x = p % 1536, y = Math.floor(p / 1536);
  if (x >= 746 && x < 920 && y >= 608 && y < 846) continue;
  for (let c = 0; c < 3; c++) if (left[p * 3 + c] !== initial[p * 3 + c]) outsideChanged++;
}
assert.equal(outsideChanged, 0, "Pixels outside local character area changed");
const result = { frozenHashes: "PASS", idleMatchesFrozen: true, returnMatchesIdle: true, outsideCharacterChangedChannels: outsideChanged, keyboard: "PASS", reducedMotion: "PASS", latestIntent: "PASS", browserErrors: errors, visualApproval: "PENDING HUMAN REVIEW", mobile: "Frozen desktop stage retained; no mobile redesign" };
await writeFile(`${out}/verification.json`, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
