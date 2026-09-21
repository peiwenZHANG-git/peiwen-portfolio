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
const strip = () => page.getByLabel("Explore projects. Drag, swipe, or use left and right arrow keys.");
const position = () => strip().evaluate(element => element.scrollLeft);
async function ready(target) {
  await target.goto(url);
  await target.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(image => image.complete).map(image => image.decode())); });
  await target.addStyleTag({ content: "nextjs-portal{display:none!important}" });
}
try {
  await ready(page);
  assert.equal(await page.locator("[data-project]").count(), 5);
  await page.screenshot({ path: `${output}/desktop.png` });
  // Compact desktop cards can all fit on wide screens; test dragging where they overflow.
  await page.setViewportSize({ width: 1024, height: 900 });
  const bounds = await page.locator('[data-project="01"]').boundingBox();
  await page.mouse.move(bounds.x + 180, bounds.y + 80);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/hover.png` });
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
  const second = page.locator('[data-project="02"]');
  await second.scrollIntoViewIfNeeded();
  const saved = await position();
  await second.click();
  await page.waitForTimeout(400);
  assert.equal(await page.locator("dialog").evaluate(element => element.open), true);
  assert.equal(await page.getByRole("heading", { level: 2 }).innerText(), "Interactive Storytelling");
  await page.screenshot({ path: `${output}/preview.png` });
  for (let index = 0; index < 8; index++) await page.keyboard.press("Tab");
  assert.ok(await page.locator("dialog").evaluate(element => element.contains(document.activeElement)), "dialog traps keyboard focus");
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
  await page.locator('[data-project="05"]').click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  for (const width of [320, 390, 719, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}`);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await strip().focus();
  await page.keyboard.press("Home");
  assert.equal(await position(), 0);
  await page.locator('[data-project="01"]').click();
  assert.equal(await page.locator("dialog article").evaluate(element => element.getAnimations().length), 0, "reduced motion skips zoom");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  assert.equal(await page.locator("dialog").count(), 0);

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const phone = await mobile.newPage();
  phone.on("pageerror", error => errors.push(error.message));
  await ready(phone);
  const mobileStrip = phone.getByLabel("Explore projects. Drag, swipe, or use left and right arrow keys.");
  const mobileCard = await phone.locator('[data-project="01"]').boundingBox();
  assert.ok(mobileCard.width >= 390 * .70 && mobileCard.width <= 390 * .80, "mobile card occupies about 76% width");
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
  await phone.locator('[data-project="02"]').tap();
  await phone.waitForTimeout(400);
  await phone.screenshot({ path: `${output}/mobile-preview.png` });
  await phone.getByRole("button", { name: "Close ×" }).tap();
  await phone.waitForTimeout(350);
  assert.equal(await phone.locator("dialog").count(), 0);
  await mobile.close();
  assert.deepEqual(errors, [], "no browser errors or failed HTTP responses");
  console.log("PASS: drag, wheel, touch swipe, keyboard bounds, dialog/ESC/Close/focus retention, reduced motion, responsive overflow, screenshots, browser errors.");
} finally { await browser.close(); }
