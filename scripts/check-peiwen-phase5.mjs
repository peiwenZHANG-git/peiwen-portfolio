import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = 'visualizations/peiwen-phase5';
await mkdir(out, { recursive: true });
const frozen = JSON.parse(await readFile('public/peiwen-phase1/frozen-master-sha256.json', 'utf8'));
for (const [file, hash] of Object.entries(frozen)) assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), hash);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const setup = async context => {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('http://localhost:3000/?peiwen-phase5=1');
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await page.waitForSelector('[data-ready=true]');
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return page;
};
const settled = (page, state) => page.waitForSelector(`[data-phase-one][data-state="${state}"][data-moving=false]`, { timeout: 10000 });
const about = async page => {
  const hit = await page.locator('[data-about-hit]').boundingBox();
  await page.mouse.move(hit.x + hit.width / 2, hit.y + hit.height * .38);
};
const feedback = page => page.evaluate(() => {
  const read = name => {
    const style = getComputedStyle(document.querySelector(`[data-left-env="${name}"]`));
    return { opacity: Number(style.opacity), translate: style.translate, visibility: style.visibility };
  };
  return {
    intent: document.querySelector('[data-phase-one]').dataset.environment || 'none',
    road: read('road'), distant: read('distant'), copy: read('copy'),
    roadReveal: getComputedStyle(document.querySelector('[data-left-env="road"]')).getPropertyValue('--road-reveal').trim(),
    seedNear: read('seed-near'), seedFar: read('seed-far'),
    fireflyNear: read('firefly-near'), fireflyFar: read('firefly-far'),
    seedAnimation: getComputedStyle(document.querySelector('[data-left-env="seed-near"]')).animationName,
    walkerX: new DOMMatrix(getComputedStyle(document.querySelector('[data-walker]')).transform).m41,
  };
});
const pixels = async file => sharp(file).removeAlpha().raw().toBuffer();
const frozenPixels = await pixels('design-assets/peiwen-phase1/frozen-idle-baseline.png');
const quiet = async (value, idlePreembed = true) => {
  assert.equal(value.intent, 'none');
  assert.equal(value.road.opacity, 0);
  assert.equal(value.distant.opacity, 0);
  assert.equal(value.copy.opacity, 0);
  assert.equal(value.seedNear.opacity, idlePreembed ? .045 : 0);
  assert.equal(value.seedFar.opacity, 0);
  assert.equal(value.fireflyNear.opacity, 0);
  assert.equal(value.fireflyFar.opacity, 0);
};
const awake = (value, reduced = false) => {
  assert.equal(value.intent, 'left');
  assert.equal(value.road.opacity, .38);
  assert.equal(value.distant.opacity, .34);
  assert.equal(value.copy.opacity, 1);
  assert.equal(value.roadReveal, '100%');
  assert.equal(value.walkerX, -330);
  assert.equal(value.seedNear.opacity, reduced ? .7 : .72);
  assert.equal(value.seedFar.opacity, .66);
  if (reduced) {
    assert.equal(value.fireflyNear.opacity, .3);
    assert.equal(value.fireflyFar.opacity, .22);
  } else {
    assert.ok(value.fireflyNear.opacity >= .2 && value.fireflyNear.opacity <= .36);
    assert.ok(value.fireflyFar.opacity >= .18 && value.fireflyFar.opacity <= .36);
  }
};

try {
  // A real continuous review: Idle -> Left -> Idle -> Left -> About -> Idle -> Left -> Right.
  const reviewContext = await browser.newContext({ viewport: { width: 1536, height: 1024 }, recordVideo: { dir: out, size: { width: 1536, height: 1024 } } });
  const review = await setup(reviewContext);
  await review.mouse.move(760, 100); await review.waitForTimeout(400);
  await review.screenshot({ path: `${out}/01-idle.png` });
  await review.keyboard.press('ArrowLeft'); await settled(review, 'LEFT_PREVIEW'); await review.waitForTimeout(1500);
  await review.screenshot({ path: `${out}/02-left-preview.png` });
  await review.keyboard.press('Escape'); await settled(review, 'IDLE'); await review.waitForTimeout(1200);
  await review.keyboard.press('ArrowLeft'); await settled(review, 'LEFT_PREVIEW'); await review.waitForTimeout(600);
  await about(review); await settled(review, 'ABOUT_HOVER'); await review.waitForTimeout(1400);
  await review.keyboard.press('Escape'); await settled(review, 'IDLE'); await review.waitForTimeout(1200);
  await review.mouse.move(760, 100); await review.waitForTimeout(200);
  await review.keyboard.press('ArrowLeft'); await settled(review, 'LEFT_PREVIEW'); await review.waitForTimeout(300);
  await review.keyboard.press('ArrowRight'); await settled(review, 'RIGHT_PREVIEW'); await review.waitForTimeout(1400);
  const video = review.video(); await reviewContext.close();
  await video.saveAs(`${out}/left-environment-review.webm`);

  const clipContext = await browser.newContext({ viewport: { width: 1536, height: 1024 }, recordVideo: { dir: out, size: { width: 1536, height: 1024 } } });
  const clip = await setup(clipContext);
  await clip.mouse.move(760, 100); await clip.waitForTimeout(600);
  await clip.keyboard.press('ArrowLeft'); await settled(clip, 'LEFT_PREVIEW'); await clip.waitForTimeout(900);
  await clip.keyboard.press('Escape'); await settled(clip, 'IDLE'); await clip.waitForTimeout(800);
  const clipVideo = clip.video(); await clipContext.close();
  await clipVideo.saveAs(`${out}/idle-left-idle-5-2.webm`);

  const checks = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  const page = await setup(checks);
  await page.mouse.move(760, 100); await page.waitForTimeout(300);
  await quiet(await feedback(page));
  await page.screenshot({ path: `${out}/idle-verification.png` });
  const idlePixels = await pixels(`${out}/01-idle.png`);
  let idleChangedOutsideSeed = 0;
  for (let i = 0; i < idlePixels.length; i += 3) {
    const x = (i / 3) % 1536, y = Math.floor(i / 3 / 1536);
    const preembeddedSeed = x >= 728 && x <= 820 && y >= 528 && y <= 644;
    if (!preembeddedSeed && !idlePixels.slice(i, i + 3).equals(frozenPixels.slice(i, i + 3))) idleChangedOutsideSeed++;
  }
  assert.equal(idleChangedOutsideSeed, 0, 'Idle must differ from Frozen Master only by the preembedded seed');

  await page.keyboard.press('ArrowLeft');
  await page.waitForSelector('[data-phase-one][data-moving=true][data-environment=left]');
  const entering = await feedback(page);
  assert.ok(entering.road.opacity < .2 && entering.copy.opacity < .1, 'Road and copy must lag Peiwen');
  for (const [step, wait] of [[1, 250], [2, 300], [3, 300], [4, 400]]) {
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}/idle-to-left-step-${String(step).padStart(2, '0')}.png` });
  }
  await settled(page, 'LEFT_PREVIEW'); await page.waitForTimeout(1600);
  awake(await feedback(page));
  await page.screenshot({ path: `${out}/left-preview-verification.png` });
  await page.screenshot({ path: `${out}/dandelion-firefly-detail.png`, clip: { x: 280, y: 480, width: 680, height: 460 } });
  const leftPixels = await pixels(`${out}/left-preview-verification.png`);
  let changedOutside = 0;
  for (let i = 0; i < leftPixels.length; i += 3) {
    const x = (i / 3) % 1536, y = Math.floor(i / 3 / 1536);
    const inSeedBox = x >= 280 && x <= 370 && y >= 150 && y <= 250;
    if ((x > 1020 || y < 470 || y > 1000) && !inSeedBox && !leftPixels.slice(i, i + 3).equals(frozenPixels.slice(i, i + 3))) changedOutside++;
  }
  assert.equal(changedOutside, 0, 'Left feedback must stay local');

  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-phase-one][data-moving=true][data-environment=none]');
  await settled(page, 'IDLE'); await page.waitForTimeout(1200);
  quiet(await feedback(page));
  await page.screenshot({ path: `${out}/left-to-idle.png` });
  assert.ok((await pixels(`${out}/left-to-idle.png`)).equals(idlePixels), 'Left -> Idle restores the preembedded Idle state');

  await page.keyboard.press('ArrowLeft'); await settled(page, 'LEFT_PREVIEW'); await page.waitForTimeout(500);
  await about(page); await page.waitForSelector('[data-phase-one][data-moving=true][data-environment=none]');
  for (const [index, wait] of [[1, 350], [2, 350], [3, 350]]) {
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}/left-to-about-${String(index).padStart(2, '0')}.png` });
  }
  await settled(page, 'ABOUT_HOVER'); await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/left-to-about-final.png` });
  quiet(await feedback(page), false);
  assert.ok((await pixels(`${out}/left-to-about-final.png`)).equals(await pixels('visualizations/peiwen-phase4/baselines/about.png')), 'Left -> About approved state');

  await page.keyboard.press('Escape'); await settled(page, 'IDLE'); await page.waitForTimeout(1000);
  await page.mouse.move(760, 100); await page.waitForTimeout(200);
  await page.keyboard.press('ArrowLeft'); await settled(page, 'LEFT_PREVIEW'); await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight'); await page.waitForSelector('[data-phase-one][data-moving=true][data-environment=none]');
  for (const [index, wait] of [[1, 350], [2, 350], [3, 350]]) {
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}/left-to-right-${String(index).padStart(2, '0')}.png` });
  }
  await settled(page, 'RIGHT_PREVIEW'); await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/left-to-right-final.png` });
  quiet(await feedback(page), false);
  assert.ok((await pixels(`${out}/left-to-right-final.png`)).equals(await pixels('visualizations/peiwen-phase4/baselines/right.png')), 'Left -> Right has no left residue');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Escape'); await settled(page, 'IDLE'); await page.waitForTimeout(400);
  await page.keyboard.press('ArrowLeft'); await settled(page, 'LEFT_PREVIEW'); await page.waitForTimeout(350);
  const reduced = await feedback(page);
  awake(reduced, true); assert.equal(reduced.road.translate, 'none'); assert.equal(reduced.seedAnimation, 'none');
  await page.keyboard.press('Escape'); await settled(page, 'IDLE'); await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/reduced-motion-idle.png` });
  assert.ok((await pixels(`${out}/reduced-motion-idle.png`)).equals(idlePixels), 'reduced-motion Idle');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await checks.close();

  const touchContext = await browser.newContext({ viewport: { width: 1536, height: 1024 }, hasTouch: true, isMobile: true });
  const touch = await setup(touchContext);
  await touch.touchscreen.tap(350, 650); await settled(touch, 'LEFT_PREVIEW'); await touch.waitForTimeout(700);
  assert.equal((await feedback(touch)).intent, 'left');
  await touch.touchscreen.tap(780, 490); await settled(touch, 'IDLE'); await touch.waitForTimeout(900);
  await quiet(await feedback(touch));
  await touchContext.close();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }

const result = {
  frozenHashes: 'PASS', frozenIdleBasePreserved: 'PASS', preembeddedSeedOnlyIdleDiff: 'PASS', leftFeedbackLocalized: 'PASS',
  progressiveRoadRevealNoBlur: 'PASS', delayedEntranceAndFullExit: 'PASS', preembeddedAndFluffyDandelions: 'PASS', reusedFireflyAsset: 'PASS',
  leftToAboutApproved: 'PASS', leftToRightApprovedNoResidue: 'PASS',
  reducedMotionOpacityOnly: 'PASS', touchRegression: 'PASS', browserErrors: errors, humanApproval: 'PENDING',
};
await writeFile(`${out}/verification.json`, JSON.stringify(result, null, 2) + '\n');
console.log('Phase 5.2 progressive road wake, preembedded dandelions, frozen states, reduced motion and touch PASS.');
