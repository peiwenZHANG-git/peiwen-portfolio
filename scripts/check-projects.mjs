// Run against an active local server: PROJECTS_URL=http://127.0.0.1:3018/projects
// PLAYWRIGHT_MODULE may point to an existing Playwright installation outside this repo.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
const output = "visualizations/projects";
await mkdir(output, { recursive: true });
const errors = [];
const url = process.env.PROJECTS_URL || "http://127.0.0.1:3018/projects";
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const strip = () => page.locator('[data-rope="featured"] [tabindex="0"]');
const position = () => strip().evaluate(element => element.scrollLeft);
async function ready(target) {
  await target.goto(url);
  await target.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(image => image.complete).map(image => image.decode())); });
  await target.addStyleTag({ content: "nextjs-portal{display:none!important}" });
}
try {
  await ready(page);
  assert.equal(await page.locator("[data-project]").count(), 8);
  assert.deepEqual(await page.locator('[data-rope="featured"] [data-project]').evaluateAll(elements => elements.map(element => element.dataset.project)), ["reso", "arm-swing", "tangram", "music-vr", "maze"]);
  assert.deepEqual(await page.locator('[data-rope="smaller"] [data-project]').evaluateAll(elements => elements.map(element => element.dataset.project)), ["flight", "chess", "zoo"]);
  assert.equal(await page.getByText("8 projects · drag the lines to explore →", { exact: true }).count(), 0);
  assert.equal(await page.getByText("drag to explore →", { exact: true }).count(), 1);
  const musicBounds = await page.locator('[data-project="music-vr"]').boundingBox();
  assert.ok(musicBounds.x < 1440 && musicBounds.x + musicBounds.width > 1440, "fourth artifact partially visible");
  assert.ok((await page.locator('[data-project="maze"]').boundingBox()).x > 1440, "maze requires exploration");
  assert.ok(await page.locator('[data-project]').evaluateAll(elements => elements.every(element =>
    getComputedStyle(element).backgroundColor === "rgba(0, 0, 0, 0)" &&
    getComputedStyle(element, "::before").backgroundImage === "none" && element.querySelectorAll('button').length === 2 && element.querySelectorAll('img').length === 1
  )), "transparent pair wrappers, two independent paper buttons, only dedicated illustration covers");
  const coverImages = page.locator('[data-cover-status="final"] img');
  assert.equal(await coverImages.count(), 8, "all eight supplied covers are present");
  for (const cover of await coverImages.all()) {
    const src = await cover.getAttribute("src");
    assert.ok(decodeURIComponent(src).includes("/overview-covers/"), "overview uses dedicated art");
    await cover.scrollIntoViewIfNeeded();
    await cover.evaluate(image => image.decode());
    assert.ok(await cover.evaluate(image => image.naturalWidth > 0 && image.naturalHeight > 0));
  }
  await strip().evaluate(element => { element.scrollLeft = 0; });
  await page.locator('[data-rope="smaller"] [tabindex="0"]').evaluate(element => { element.scrollLeft = 0; });
  // Regression: the painted rope rises on the right; paper attachments must follow it.
  const lowerTrack = page.locator('[data-rope="smaller"] [tabindex="0"]');
  const chessClip = page.locator('[data-project="chess"] [data-piece="title"] svg');
  await page.waitForTimeout(100);
  const originalChessY = (await chessClip.boundingBox()).y;
  await lowerTrack.evaluate(element => { element.scrollLeft = 150; });
  await page.waitForTimeout(100);
  assert.ok((await chessClip.boundingBox()).y > originalChessY + 5, "Chess clip follows lower rope after horizontal scrolling");
  await lowerTrack.evaluate(element => { element.scrollLeft = 0; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${output}/desktop.png` });
  const opening = await page.locator('[data-project="reso"]').boundingBox();
  const half = await strip().evaluate(element => (element.scrollWidth - element.clientWidth) * .4);
  await page.mouse.move(900, opening.y + 100);
  await page.mouse.down();
  await page.mouse.move(900 - half, opening.y + 100, { steps: 20 });
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.mouse.move(700, 100);
  await page.waitForTimeout(350);
  assert.ok(Math.abs(await position() - half) < 25, "desktop drag reaches approximately halfway");
  await page.screenshot({ path: `${output}/desktop-drag40.png` });
  await strip().evaluate(element => { element.scrollLeft = 0; });

  // Compact desktop cards can all fit on wide screens; test dragging where they overflow.
  await page.setViewportSize({ width: 1024, height: 900 });
  const bounds = await page.locator('[data-project="reso"]').boundingBox();
  await page.mouse.move(bounds.x + 180, bounds.y + 80);
  await page.waitForTimeout(350);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 20, bounds.y + 80, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(650);
  assert.ok(await position() > 100, "mouse drag changes position");
  assert.equal(await page.locator("dialog").count(), 0, "drag must not open a preview");
  await strip().evaluate(element => { element.scrollLeft = 0; });
  await page.mouse.wheel(220, 0);
  await page.waitForTimeout(400);
  assert.ok(await position() > 0, "horizontal trackpad wheel scrolls");
  await strip().focus();
  await page.keyboard.press("Home");
  await page.waitForTimeout(500);
  assert.equal(await position(), 0);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  assert.ok(await position() > 0, "keyboard navigation scrolls");
  const second = page.locator('[data-project="arm-swing"] [data-piece="illustration"]');
  await second.scrollIntoViewIfNeeded();
  const saved = await position();
  await second.click();
  await page.waitForTimeout(400);
  assert.equal(await page.locator("dialog").evaluate(element => element.open), true);
  assert.equal(await page.getByRole("heading", { level: 2 }).innerText(), "Arm-Swing VR Locomotion");
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    assert.ok(await page.locator("dialog").evaluate(element => element.matches(":modal") && (element.contains(document.activeElement) || document.activeElement === document.body)), "native modal prevents focus on background controls, allowing browser chrome");
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  assert.equal(await page.locator("dialog").count(), 0);
  assert.ok(Math.abs(await position() - saved) < 2, "Escape preserves drag position");
  assert.equal(await second.evaluate(element => element === document.activeElement), true, "focus returns to source card");
  // Activate the restored focus without Playwright scrolling the hovered card into view.
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Close ×" }).click();
  await page.waitForTimeout(350);
  assert.ok(Math.abs(await position() - saved) < 2, "Close preserves drag position");
  await strip().focus();
  await page.keyboard.press("End");
  await page.waitForTimeout(600);
  assert.ok(await strip().evaluate(element => Math.abs(element.scrollLeft - (element.scrollWidth - element.clientWidth)) < 2), "end is bounded");
  await page.locator('[data-project="maze"] [data-piece="illustration"]').click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  const smaller = page.locator('[data-rope="smaller"] [tabindex="0"]');
  const featuredSaved = await position();
  const smallBounds = await page.locator('[data-project="flight"]').boundingBox();
  await page.mouse.move(smallBounds.x + 130, smallBounds.y + 50);
  await page.mouse.down();
  await page.mouse.move(smallBounds.x + 10, smallBounds.y + 50, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(650);
  assert.ok(await smaller.evaluate(element => element.scrollLeft) > 50, "smaller rope drags");
  assert.equal(await position(), featuredSaved, "ropes have independent positions");
  await smaller.focus();
  await page.keyboard.press("Home");
  await page.waitForTimeout(500);
  await page.mouse.move(smallBounds.x + 90, smallBounds.y + 50);
  await page.mouse.wheel(160, 0);
  await page.waitForTimeout(400);
  assert.ok(await smaller.evaluate(element => element.scrollLeft) > 0, "smaller rope accepts horizontal wheel");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const routes = ["reso", "arm-swing-vr-locomotion", "tangram", "multi-sensory-music-vr", "maze-of-wishes", "flight-booking", "chess", "zoo-desk-organizer"];
  const ids = await page.locator("[data-project]").evaluateAll(elements => elements.map(element => element.dataset.project));
  for (const [index, id] of ids.entries()) {
    const card = page.locator(`[data-project="${id}"] [data-piece="illustration"]`);
    await card.focus();
    await card.evaluate(async element => { await Promise.all([...element.querySelectorAll("img")].map(image => image.decode())); });
    const offsets = await page.locator('[data-rope] [tabindex="0"]').evaluateAll(elements => elements.map(element => element.scrollLeft));
    await page.keyboard.press("Enter");
    const link = page.getByRole("link", { name: "View case study →" });
    assert.equal(await link.getAttribute("href"), `/projects/${routes[index]}`);
    assert.equal((await page.request.get(new URL(`/projects/${routes[index]}`, url).href)).status(), 200);
    await page.locator("dialog img").evaluate(image => image.decode());
    await page.getByRole("button", { name: "Close ×" }).click();
    await page.waitForTimeout(50);
    assert.deepEqual(await page.locator('[data-rope] [tabindex="0"]').evaluateAll(elements => elements.map(element => element.scrollLeft)), offsets, `${id}: both positions restored`);
  }
  for (const [index, id] of ids.entries()) {
    const note = page.locator(`[data-project="${id}"] [data-piece="title"]`);
    await note.scrollIntoViewIfNeeded();
    await note.click();
    assert.equal(await page.getByRole("link", { name: "View case study →" }).getAttribute("href"), `/projects/${routes[index]}`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(50);
    assert.ok(await note.evaluate(element => element === document.activeElement), "title note restores focus");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Close ×" }).click();
    await page.waitForTimeout(50);
  }
  for (const width of [320, 390, 719, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}`);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await strip().focus();
  await page.keyboard.press("Home");
  assert.equal(await position(), 0);
  await page.locator('[data-project="reso"] [data-piece="illustration"]').click();
  assert.equal(await page.locator("dialog article").evaluate(element => element.getAnimations().length), 0, "reduced motion skips zoom");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  assert.equal(await page.locator("dialog").count(), 0);

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const phone = await mobile.newPage();
  phone.on("pageerror", error => errors.push(error.message));
  await ready(phone);
  const mobileStrip = phone.locator('[data-rope="featured"] [tabindex="0"]');
  const mobileCard = await phone.locator('[data-project="reso"]').boundingBox();
  assert.equal(await phone.locator('[data-project="reso"] [data-piece="illustration"]').evaluate(element => Math.round(parseFloat(getComputedStyle(element).width))), 226, "illustration 58vw");
  assert.equal(await phone.locator('[data-project="flight"] [data-piece="illustration"]').evaluate(element => Math.round(parseFloat(getComputedStyle(element).width))), 179, "smaller illustration 46vw");
  assert.ok(mobileCard.y + mobileCard.height < (await phone.locator('[data-project="flight"]').boundingBox()).y - 8, "mobile rows do not cover the research label");
  assert.ok((await phone.locator('[data-project="arm-swing"]').boundingBox()).x < 390, "next featured bundle peeks in");
  assert.ok((await phone.locator('[data-rope="smaller"] span[class*="decoration"]').first().boundingBox()).x < 390, "next hanging paper peeks in");
  await phone.screenshot({ path: `${output}/mobile.png` });
  const cdp = await mobile.newCDPSession(phone);
  const y = mobileCard.y + 110;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y }] });
  for (const x of [270, 230, 180, 130, 80]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
    await phone.waitForTimeout(24);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await phone.waitForTimeout(700);
  assert.ok(await mobileStrip.evaluate(element => element.scrollLeft) > 100, "native touch swipe scrolls");
  assert.equal(await phone.locator("dialog").count(), 0, "swipe does not activate card");
  await phone.locator('[data-project="arm-swing"] [data-piece="illustration"]').tap();
  await phone.waitForTimeout(400);
  await phone.getByRole("button", { name: "Close ×" }).tap();
  await phone.waitForTimeout(350);
  assert.equal(await phone.locator("dialog").count(), 0);
  const smallMobile = phone.locator('[data-rope="smaller"] [tabindex="0"]');
  const smallMobileBounds = await phone.locator('[data-project="flight"]').boundingBox();
  const smallY = smallMobileBounds.y + 45;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 245, y: smallY }] });
  for (const x of [215, 175, 135, 95, 60]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: smallY }] });
    await phone.waitForTimeout(24);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await phone.waitForTimeout(700);
  assert.ok(await smallMobile.evaluate(element => element.scrollLeft) > 80, "smaller rope accepts native touch swipe");
  await mobile.close();
  assert.deepEqual(errors, [], "no browser errors or failed HTTP responses");
  console.log("PASS: drag, wheel, touch swipe, keyboard bounds, dialog/ESC/Close/focus retention, reduced motion, responsive overflow, screenshots, browser errors.");
} finally { await browser.close(); }
