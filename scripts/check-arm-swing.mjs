// Run against the local dev server; reuse an installed Playwright via PLAYWRIGHT_MODULE.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.ARM_SWING_URL || "http://127.0.0.1:3019";
const output = "visualizations/arm-swing-vr-locomotion";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];

try {
  for (const [name, width, reducedMotion] of [["desktop", 1440, "no-preference"], ["mobile", 390, "no-preference"], ["reduced", 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/projects/arm-swing-vr-locomotion`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });

    assert.match(await page.title(), /Arm-Swing VR Locomotion/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main img").count(), 10);
    assert.deepEqual(await page.locator("section[aria-labelledby='materials-title'] a").allTextContents(), [
      "Watch demo ↗", "View course archive ↗", "Download APK ↗", "Presentation ↗",
    ]);
    assert.equal(await page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])').count(), 0);

    const video = page.locator("video");
    assert.equal(await video.getAttribute("autoplay"), null);
    assert.equal(await video.getAttribute("controls"), "");
    assert.equal(await video.getAttribute("poster"), "/assets/projects/arm-swing-vr-locomotion/demo-poster.webp");
    await video.evaluate(element => element.readyState >= 1 ? undefined : new Promise(resolve => element.addEventListener("loadedmetadata", resolve, { once: true })));
    assert.deepEqual(await video.evaluate(element => [Math.round(element.duration), element.videoWidth, element.videoHeight]), [76, 1280, 693]);
    await page.screenshot({ path: `${output}/${name}-poster.png` });
    if (name === "desktop") {
      await video.evaluate(async element => { element.muted = true; await element.play(); });
      await page.waitForFunction(() => document.querySelector("video")?.currentTime > 0.2, undefined, { timeout: 5000 });
      assert.ok(await video.evaluate(element => { element.pause(); return element.currentTime; }) > 0.2, "embedded demo plays");
      assert.equal(await video.evaluate(element => element.paused), true, "embedded demo pauses");
      for (const [path, type] of [
        ["/assets/projects/arm-swing-vr-locomotion/demo-poster.webp", "image/webp"],
        ["/assets/projects/arm-swing-vr-locomotion/resources/arm-swing-demo.mp4", "video/mp4"],
        ["/assets/projects/arm-swing-vr-locomotion/resources/arm-swing-presentation.pdf", "application/pdf"],
      ]) {
        const response = await page.request.head(`${base}${path}`);
        assert.equal(response.status(), 200);
        assert.match(response.headers()["content-type"], new RegExp(type));
      }
      for (const url of [
        "https://u8739516597-dotcom.github.io/",
        "https://drive.google.com/file/d/17dsN_9A_umsfHKKnd0NoPsK-qlCjL1b5/view?usp=sharing",
      ]) {
        assert.equal((await page.request.get(url)).status(), 200);
      }
    }

    await page.screenshot({ path: `${output}/${name}-hero.png` });
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to case study");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "arm-swing-content");
    assert.equal(await video.evaluate(element => { element.focus(); return document.activeElement === element; }), true);

    for (const id of ["challenge", "concepts", "system", "implementation", "debugging", "evaluation", "results"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.locator(`#${id}`).locator("img").evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator("main").evaluate(element => element.scrollWidth > element.clientWidth), false);
      await page.locator(`#${id}`).evaluate(element => element.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/${name}-${id}.png` });
    }

    assert.match(await page.locator("#system").innerText(), /no separate walking and flying modes/i);
    assert.match(await page.locator("#implementation").innerText(), /Course scaffold boundary/);
    assert.match(await page.locator("#results").innerText(), /directional, not evidence of a validated locomotion advantage/);
    assert.equal(await page.locator('img:not([alt]), img[alt=""]').count(), 0);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
    assert.deepEqual(brokenAnchors, []);
    if (reducedMotion === "reduce") {
      assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
    }
    await page.locator('a[href="#arm-swing-content"]').last().click();
    assert.equal(await page.evaluate(() => location.hash), "#arm-swing-content");
    await page.waitForFunction(() => Math.abs(document.querySelector("main")?.getBoundingClientRect().top ?? 999) < 2);
    await page.getByRole("link", { name: "Back to projects", exact: false }).click();
    await page.waitForURL(`${base}/projects`);
    await page.close();
    console.log(`${name}: media, sections, overflow, keyboard, links, content boundaries and runtime passed`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
