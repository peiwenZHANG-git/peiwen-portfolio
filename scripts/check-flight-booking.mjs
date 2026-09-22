import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.FLIGHT_BOOKING_URL || "http://127.0.0.1:3019";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
try {
  for (const [name, width, reducedMotion] of [["desktop", 1440, "no-preference"], ["mobile", 390, "no-preference"], ["reduced", 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/projects/flight-booking`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.title(), /Flight Booking Experience/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main img").count(), 12);
    assert.equal(await page.locator('a[target="_blank"][rel="noopener noreferrer"]').count(), 1);
    assert.equal(await page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])').count(), 0);
    assert.match(await page.locator("#breakdowns").innerText(), /20 people/);
    assert.match(await page.locator("#breakdowns").innerText(), /Price and refund-rule transparency/);
    assert.match(await page.locator("#scope").innerText(), /Before booking/);
    assert.equal(/[\u3400-\u9fff]/.test(await page.locator("main").innerText()), false);
    assert.match(await page.locator("#configure").innerText(), /apply to all passengers/);
    assert.match(await page.locator("#contribution").innerText(), /Team of four/);
    assert.match(await page.locator("#contribution").innerText(), /no post-design usability study/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator("main").evaluate(element => element.scrollWidth > element.clientWidth), false);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to case study");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "flight-booking-content");
    for (const id of ["breakdowns", "scope", "compare", "configure", "travel", "flow", "contribution"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      assert.equal(await section.locator("img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
    }
    const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
    assert.deepEqual(broken, []);
    if (reducedMotion === "reduce") assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
    await page.locator('a[href="#flight-booking-content"]').last().click();
    assert.equal(await page.evaluate(() => location.hash), "#flight-booking-content");
    if (name === "desktop") {
      const report = await page.request.head(`${base}/assets/projects/flight-booking/resources/flight-booking-report.pdf`);
      assert.equal(report.status(), 200);
      assert.match(report.headers()["content-type"], /application\/pdf/);
      await page.getByRole("link", { name: "Back to projects", exact: false }).click();
      await page.waitForURL(`${base}/projects`);
    }
    await page.close();
    console.log(`${name}: responsive layout, images, keyboard, anchors, reduced motion and resources passed`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
