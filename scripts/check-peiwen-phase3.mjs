import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = 'visualizations/peiwen-phase3';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const setup = async context => {
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
  await page.goto('http://localhost:3000/?peiwen-phase3=1');
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  await page.waitForSelector('[data-ready=true]');
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return page;
};
const state = (page, value) => page.waitForSelector(`[data-phase-one][data-state="${value}"][data-moving=false]`);
const idle = async page => { await state(page, 'IDLE'); await page.waitForTimeout(350); };
try {
  // Prewarm compilation before recording the actual interaction.
  const warm = await browser.newContext();
  await setup(warm);
  await warm.close();
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, recordVideo: { dir: out, size: { width: 1536, height: 1024 } } });
  const page = await setup(context);
  await page.mouse.move(760, 100);
  await page.screenshot({ path: `${out}/01-idle.png` });
  await page.waitForTimeout(650);
  await page.mouse.move(858, 690);
  await state(page, 'ABOUT_HOVER');
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${out}/02-about-hover.png` });
  await page.screenshot({ path: `${out}/about-detail.png`, clip: { x: 790, y: 546, width: 310, height: 294 } });
  await page.waitForTimeout(1400);
  await page.mouse.move(760, 490);
  await idle(page);
  await page.screenshot({ path: `${out}/03-return-idle.png` });
  await page.waitForTimeout(650);
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/idle-about-return.webm`);

  const checks = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  const check = await setup(checks);
  await check.mouse.move(858, 690);
  await state(check, 'ABOUT_HOVER');
  await check.reload();
  await check.waitForSelector('[data-ready=true]');
  await check.waitForTimeout(600);
  assert.equal(await check.locator('[data-phase-one]').getAttribute('data-state'), 'IDLE', 'Stationary pointer after reload must not arm');
  await check.mouse.move(860, 691);
  await state(check, 'ABOUT_HOVER');
  await check.keyboard.press('Escape');
  await idle(check);
  await check.waitForTimeout(300);
  assert.equal(await check.locator('[data-about-overlay]').getAttribute('data-active'), 'false');
  await check.mouse.move(861, 692);
  await state(check, 'ABOUT_HOVER');
  // About wins even when a directional pointerover is delivered while on Peiwen.
  await check.keyboard.press('ArrowLeft');
  assert.equal(await check.locator('[data-phase-one]').getAttribute('data-state'), 'ABOUT_HOVER');
  await check.mouse.move(760, 490);
  await idle(check);
  const hit = check.getByRole('button', { name: 'About me — Meet Peiwen.' });
  await hit.focus();
  await state(check, 'ABOUT_HOVER');
  await check.mouse.move(350,650);
  await check.waitForTimeout(300);
  assert.equal(await check.locator('[data-phase-one]').getAttribute('data-state'), 'ABOUT_HOVER', 'Keyboard focus has priority over directional hover');
  await check.mouse.move(760,490);
  await check.keyboard.press('Enter');
  assert.ok(check.url().includes('peiwen-phase3=1'), 'No About navigation');
  await check.keyboard.press('Tab');
  await idle(check);
  await check.emulateMedia({ reducedMotion: 'reduce' });
  await hit.focus();
  await state(check, 'ABOUT_HOVER');
  await check.keyboard.press('Escape');
  await idle(check);
  await check.emulateMedia({ reducedMotion: 'no-preference' });
  await check.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  for (const [key, preview, name] of [['ArrowLeft','LEFT_PREVIEW','left'], ['ArrowRight','RIGHT_PREVIEW','right']]) {
    await check.keyboard.press(key);
    await state(check, preview);
    await check.screenshot({ path: `${out}/${name}-regression.png` });
    // Park at original Peiwen location during return; no automatic About after settling.
    await check.keyboard.press('Escape');
    await check.waitForSelector('[data-moving=true]');
    await check.mouse.move(858, 690);
    await idle(check);
    assert.equal(await check.locator('[data-about-overlay]').getAttribute('data-active'), 'false');
  }
  await check.screenshot({ path: `${out}/fresh-return-idle.png` });
  await checks.close();
  const touchContext = await browser.newContext({ viewport: { width: 1536, height: 1024 }, hasTouch: true, isMobile: true });
  const touch = await setup(touchContext);
  await touch.touchscreen.tap(858,690);
  await touch.waitForTimeout(400);
  assert.equal(await touch.locator('[data-about-overlay]').getAttribute('data-active'), 'false', 'Touch must not simulate hover');
  await touchContext.close();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
const pixels = file => sharp(file).removeAlpha().raw().toBuffer();
const baseline = await pixels('design-assets/peiwen-phase1/frozen-idle-baseline.png');
for (const file of ['01-idle','03-return-idle','fresh-return-idle']) assert.ok(baseline.equals(await pixels(`${out}/${file}.png`)), `Frozen mismatch: ${file}`);
for (const [name, baselineFile] of [['left','visualizations/peiwen-phase1/02-left-preview.png'],['right','visualizations/peiwen-phase2/02-right-preview.png']]) {
  assert.ok((await pixels(baselineFile)).equals(await pixels(`${out}/${name}-regression.png`)), `${name} regression`);
}
await sharp(`${out}/about-detail.png`).resize(930,882,{kernel:'nearest'}).png().toFile(`${out}/about-detail-3x.png`);
const result = { idlePixelEquality:'PASS', leftRightPixelRegression:'PASS', stationaryPointerGating:'PASS', keyboardFocus:'PASS', reducedMotion:'PASS', touchNoHover:'PASS', browserErrors:errors, humanApproval:'PENDING' };
await writeFile(`${out}/verification.json`, JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
