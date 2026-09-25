import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.ZOO_URL || "http://127.0.0.1:3023";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
try {
  for (const [name, width, reducedMotion] of [["desktop", 1440, "no-preference"], ["mobile", 390, "no-preference"], ["reduced", 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/projects/zoo-desk-organizer`, { waitUntil: "networkidle" });
    assert.match(await page.title(), /ZOO Desk Organizer/); assert.equal(await page.locator("h1").count(), 1); assert.equal(await page.locator("main img").count(), 10);
    assert.equal(await page.locator('a[href*="gitlab.com"][target="_blank"][rel="noopener noreferrer"]').count(), 1);
    assert.match(await page.locator("#iteration").innerText(), /clearance/i); assert.match(await page.locator("#final").innerText(), /did not include electronics/i);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.keyboard.press("Tab"); assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to case study"); await page.keyboard.press("Enter"); assert.equal(await page.evaluate(() => document.activeElement.id), "zoo-content");
    for (const image of await page.locator("main img").all()) { await image.scrollIntoViewIfNeeded(); await page.waitForFunction(element => element.complete && element.naturalWidth > 0, await image.elementHandle()); }
    assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(a => a.filter(x => !document.getElementById(x.hash.slice(1))).map(x => x.hash)), []);
    if (reducedMotion === "reduce") assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
    await page.locator('a[href="#zoo-content"]').last().click(); assert.equal(await page.evaluate(() => location.hash), "#zoo-content");
    if (name === "desktop") { await page.getByRole("link", { name: "Back to projects", exact: false }).click(); await page.waitForURL(`${base}/projects`); }
    await page.close(); console.log(`${name}: layout, images, keyboard, anchors and reduced motion passed`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
