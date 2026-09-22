import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.TANGRAM_URL || "http://127.0.0.1:3022";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
try {
  for (const [name, width, reducedMotion] of [["desktop", 1440, "no-preference"], ["mobile", 390, "no-preference"], ["reduced", 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/projects/tangram`, { waitUntil: "networkidle" });
    assert.match(await page.title(), /Tangram/); assert.equal(await page.locator("h1").count(), 1); assert.equal(await page.locator("main img").count(), 17); assert.equal(await page.locator("main > header img").getAttribute("width"), "1536"); assert.equal(await page.locator("main > header img").getAttribute("height"), "2048");
    assert.match(await page.locator("#thickness").innerText(), /0.4 mm/); assert.match(await page.locator("#play").innerText(), /did not include electronics/i); assert.equal(await page.locator('#play img').count(), 4); assert.equal(await page.locator('a[href*="gitlab.dsi.universite-paris-saclay.fr"][target="_blank"][rel="noopener noreferrer"]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.keyboard.press("Tab"); assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to case study"); await page.keyboard.press("Enter"); assert.equal(await page.evaluate(() => document.activeElement.id), "tangram-content");
    for (const id of ["geometry", "dumbbell", "thickness", "connectors", "scale", "play"]) for (const image of await page.locator(`#${id} img`).all()) { await image.scrollIntoViewIfNeeded(); await page.waitForFunction(element => element.complete && element.naturalWidth > 0, await image.elementHandle()); }
    assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(a => a.filter(x => !document.getElementById(x.hash.slice(1))).map(x => x.hash)), []);
    if (reducedMotion === "reduce") assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length), 0);
    await page.locator('a[href="#tangram-content"]').last().click(); assert.equal(await page.evaluate(() => location.hash), "#tangram-content");
    if (name === "desktop") { await page.getByRole("link", { name: "Back to projects", exact: false }).click(); await page.waitForURL(`${base}/projects`); }
    await page.close(); console.log(`${name}: layout, images, keyboard, anchors and reduced motion passed`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
