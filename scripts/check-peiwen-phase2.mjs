import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");
const out = "visualizations/peiwen-phase2";
await mkdir(out, { recursive: true });
const frozen = JSON.parse(await readFile("public/peiwen-phase1/frozen-master-sha256.json", "utf8"));
Object.assign(frozen, {
  "public/peiwen-phase1/origin-clean-plate.png": "b09953237b09716030a95de5c99ea998f06e2a3c25051f2c1f383ac2bfd1cd2f",
  "public/peiwen-phase1/peiwen-original.png": "77dc128ee37b591d5f9fc8df51e369a050e1e5dc265ddcef122060ac5e9e890f",
});
for (const [file, hash] of Object.entries(frozen)) assert.equal(createHash("sha256").update(await readFile(file)).digest("hex"), hash, file);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
const setup = async context => {
  const page = await context.newPage();
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
  page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto("http://localhost:3000/?peiwen-phase2=1");
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  await page.waitForSelector('[data-phase-two][data-ready="true"]');
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  return page;
};
const settled = (page, state) => page.waitForSelector(`[data-phase-two][data-state="${state}"][data-moving="false"]`);
const pixels = file => sharp(file).removeAlpha().raw().toBuffer();
try {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width: 1536, height: 1024 } } });
  const page = await setup(context);
  await page.mouse.move(760, 100);
  await page.screenshot({ path: `${out}/01-idle.png` });
  await page.waitForTimeout(700);
  // A short pass through the right zone must not start walking.
  await page.mouse.move(1200, 650);
  await page.mouse.move(780, 500);
  await page.waitForTimeout(250);
  assert.equal(await page.locator('[data-phase-two]').getAttribute('data-moving'), 'false');
  await page.mouse.move(1200, 650);
  await page.waitForSelector('[data-moving="true"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/walking-checkpoint.png` });
  await settled(page, "RIGHT_PREVIEW");
  assert.equal(await page.locator('[data-walker]').evaluate(el => el.style.transform), 'translate(54px, -8px)');
  await page.screenshot({ path: `${out}/02-right-preview.png` });
  await page.screenshot({ path: `${out}/right-detail.png`, clip: { x: 795, y: 590, width: 200, height: 250 } });
  await page.waitForTimeout(900);
  await page.mouse.move(780, 500);
  await page.waitForSelector('[data-moving="true"]');
  await settled(page, "IDLE");
  await page.screenshot({ path: `${out}/03-return-idle.png` });
  await page.waitForTimeout(700);
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/idle-right-return.webm`);

  // Separate from the review recording: left regression and accessible activation.
  const checks = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
  const check = await setup(checks);
  await check.mouse.move(350, 650);
  await settled(check, "LEFT_PREVIEW");
  await check.screenshot({ path: `${out}/left-regression.png` });
  await check.mouse.move(780, 500);
  await settled(check, "IDLE");
  await check.keyboard.press("ArrowRight");
  await settled(check, "RIGHT_PREVIEW");
  await check.keyboard.press("Escape");
  await settled(check, "IDLE");
  await check.emulateMedia({ reducedMotion: "reduce" });
  const right = check.getByRole('button', { name: 'Preview Peiwen walking right' });
  await right.focus();
  await check.keyboard.press('Space');
  await settled(check, "RIGHT_PREVIEW");
  await check.keyboard.press('Escape');
  await settled(check, "IDLE");
  await right.evaluate(button => button.blur());
  await check.screenshot({ path: `${out}/keyboard-return.png` });
  await checks.close();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }

const initial = await pixels(`${out}/01-idle.png`);
for (const file of ['design-assets/peiwen-phase1/frozen-idle-baseline.png', `${out}/03-return-idle.png`, `${out}/keyboard-return.png`]) {
  assert.ok(initial.equals(await pixels(file)), `Idle mismatch: ${file}`);
}
// Phase 1's unchanged runnable test supplies this baseline on a fresh checkout.
assert.ok((await pixels(`${out}/left-regression.png`)).equals(await pixels('visualizations/peiwen-phase1/02-left-preview.png')), 'Left regression differs from Phase 1');
const right = await pixels(`${out}/02-right-preview.png`);
let outsideChanged = 0;
for (let p = 0; p < 1536 * 1024; p++) {
  const x = p % 1536, y = Math.floor(p / 1536);
  if (x >= 800 && x < 974 && y >= 600 && y < 838) continue;
  for (let c = 0; c < 3; c++) if (right[p * 3 + c] !== initial[p * 3 + c]) outsideChanged++;
}
assert.equal(outsideChanged, 0, 'Changes outside local overlay');
const result = { frozenMasterAndAssets: 'PASS', idleAndReturnPixelEquality: 'PASS', leftPreviewPixelRegression: 'PASS', outsideLocalAreaChangedChannels: outsideChanged, rightTravel: [54, -8], keyboardAndReducedMotion: 'PASS', browserErrors: errors, humanApproval: 'PENDING' };
await writeFile(`${out}/verification.json`, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
