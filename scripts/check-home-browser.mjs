// Use an available Playwright installation via NODE_PATH; no application dependency is added.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright");
const output = path.resolve("visualizations/home-visual-pass");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const errors = [];
const watch = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) errors.push(response.url()); });
};
const base = process.env.HOME_TEST_URL || "http://localhost:3000";
const state = (page) => page.locator("main").getAttribute("data-state");
const opening = (page) => page.locator("main").getAttribute("data-opening");
const settle = (page) => page.waitForTimeout(850);
const capture = (page, name) => page.screenshot({ path: path.join(output, name + ".png") });
const center = async (page) => {
  await page.mouse.move(720, 150);
  await page.mouse.move(725, 150);
  await page.waitForTimeout(460);
  assert.equal(await state(page), "IDLE");
};

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page);
  // The cursor is already over Peiwen before navigation, without subsequent movement.
  await page.mouse.move(720, 660);
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector("main")?.dataset.opening === "active");
  await capture(page, "opening-paper");
  await page.waitForFunction(() => document.querySelector("main")?.dataset.opening === "done");
  assert.equal(await state(page), "IDLE", "stationary cursor must not open About");
  await settle(page);
  assert.equal(await page.locator("h1").innerText(), "Peiwen Zhang");
  const hero = await page.locator("h1").boundingBox();
  const prompt = await page.getByText("Where would you like to go?", { exact: true }).boundingBox();
  const character = await page.locator("#about").boundingBox();
  assert.ok(hero.y + hero.height < prompt.y && prompt.y + prompt.height + 80 < character.y);
  await capture(page, "desktop-idle");

  await center(page);
  await page.mouse.move(170, 460);
  await page.waitForTimeout(120);
  assert.equal(await state(page), "IDLE");
  await page.waitForTimeout(150);
  assert.equal(await state(page), "LEFT_PREVIEW");
  await settle(page);
  await capture(page, "desktop-left-preview");
  await page.mouse.move(1290, 450);
  await page.waitForTimeout(250);
  assert.equal(await state(page), "RIGHT_PREVIEW");
  await settle(page);
  assert.equal(await page.locator('[aria-hidden="false"]').filter({ hasText: "What I built." }).count(), 1);
  await capture(page, "desktop-right-preview");
  await page.mouse.move(720, 150);
  await page.waitForTimeout(320);
  assert.equal(await state(page), "RIGHT_PREVIEW");
  await page.waitForTimeout(140);
  assert.equal(await state(page), "IDLE");
  await page.locator("#about").hover();
  await page.waitForTimeout(50);
  assert.equal(await state(page), "ABOUT_HOVER");
  await settle(page);
  await capture(page, "desktop-about");

  await page.reload();
  await page.waitForFunction(() => document.querySelector("main")?.dataset.opening === "done");
  await page.waitForTimeout(500);
  assert.equal(await state(page), "IDLE", "return must not arm About beneath a stationary cursor");
  await page.keyboard.press("ArrowLeft");
  assert.equal(await state(page), "LEFT_PREVIEW");
  await page.keyboard.press("ArrowRight");
  assert.equal(await state(page), "RIGHT_PREVIEW");
  await page.keyboard.press("Escape");
  assert.equal(await state(page), "IDLE");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Skip to navigation");
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await page.waitForURL("**/#projects");
  assert.equal(new URL(page.url()).hash, "#projects");
  // Hash navigation focuses its destination. Test the existing body-level keyboard shortcut.
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/experience");
  await page.locator(".prototype-shell").waitFor({ state: "visible" });
  await page.goBack();
  await page.waitForFunction(() => document.querySelector("main")?.dataset.opening === "done");
  assert.equal(await state(page), "IDLE");

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  watch(mobile);
  await mobile.goto(base);
  await mobile.waitForFunction(() => document.querySelector("main")?.dataset.opening === "done");
  await settle(mobile);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), 390);
  await capture(mobile, "mobile-idle-390");
  const before = await mobile.locator("#about").boundingBox();
  const cdp = await mobile.context().newCDPSession(mobile);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y: 400 }] });
  for (const x of [280, 250, 220, 190, 160]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: 400 }] });
    await mobile.waitForTimeout(45);
  }
  await mobile.waitForTimeout(90);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await settle(mobile);
  assert.equal(await state(mobile), "RIGHT_PREVIEW");
  const after = await mobile.locator("#about").boundingBox();
  assert.ok(after.x - before.x >= 27 && after.x - before.x <= 36, "mobile travel stays near 8vw");
  await capture(mobile, "mobile-preview-390");
  await mobile.locator("#about").tap();
  await mobile.waitForURL("**/#about");
  assert.equal(new URL(mobile.url()).hash, "#about");
  assert.equal(await state(mobile), "IDLE");
  await mobile.reload();
  await mobile.waitForTimeout(2300);
  const hintOpacity = await mobile.getByText("Swipe to wander", { exact: true }).evaluate((el) => getComputedStyle(el.parentElement).opacity);
  assert.equal(hintOpacity, "0", "onboarding stays hidden after session exploration");
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const reduced = await reducedContext.newPage();
  watch(reduced);
  await reduced.goto(base);
  await reduced.waitForTimeout(1000);
  assert.equal(await opening(reduced), "done");
  assert.equal(await state(reduced), "IDLE");
  await reduced.mouse.move(500, 200);
  await reduced.mouse.move(200, 420);
  await reduced.waitForTimeout(260);
  assert.equal(await state(reduced), "LEFT_PREVIEW");
  await capture(reduced, "reduced-motion");
  await reducedContext.close();
  assert.deepEqual(errors, []);
  console.log("PASS: desktop/mobile rendering; fresh Opening and stationary cursor; previews and return; keyboard/Tab; real browser touch dispatch, About tap; session hints; reduced motion; no console/runtime/network errors.");
  console.log("Screenshots:", output);
} finally {
  await browser.close();
}
