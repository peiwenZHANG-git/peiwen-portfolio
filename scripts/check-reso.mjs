// Run against the local dev server; reuse an installed Playwright via PLAYWRIGHT_MODULE.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.RESO_URL || "http://127.0.0.1:3018";
const output = "visualizations/reso";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
try {
  for (const [name, width, reducedMotion] of [["desktop", 1440, "no-preference"], ["mobile", 390, "no-preference"], ["reduced", 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/projects/reso`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    assert.match(await page.title(), /Reso/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main img").count(), 9);
    assert.deepEqual(await page.locator("section[aria-labelledby='materials-title'] a").allTextContents(), [
      "Watch demo ↗", "Try the experiment ↗", "Project report ↗", "Presentation ↗", "Analysis report ↗",
    ]);
    assert.equal(await page.locator('a[href="https://danietzio.github.io/deafDHH.github.io/"]').count(), 2);
    assert.equal(await page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])').count(), 0);
    const video = page.locator("video");
    assert.equal(await video.getAttribute("autoplay"), null);
    assert.equal(await video.getAttribute("controls"), "");
    assert.match(await page.locator("#demo figcaption").innerText(), /Watch Reso in action · 0:30/);
    assert.equal(await video.locator('track[kind="captions"][srclang="en"]').count(), 1);
    await video.evaluate(element => element.readyState >= 1 ? undefined : new Promise(resolve => element.addEventListener("loadedmetadata", resolve, { once: true })));
    assert.deepEqual(await video.evaluate(element => [Math.round(element.duration), element.videoWidth, element.videoHeight]), [30, 1280, 766]);
    if (name === "desktop") {
      await video.evaluate(async element => {
        element.muted = true;
        await element.play();
      });
      await page.waitForFunction(() => document.querySelector("video")?.currentTime > 0.2, undefined, { timeout: 5000 });
      const currentTime = await video.evaluate(element => { element.pause(); return element.currentTime; });
      assert.ok(currentTime > 0.2, "embedded demo plays");
      await page.waitForFunction(() => document.querySelector("video track").readyState === 2);
      assert.equal(await video.locator("track").evaluate(element => element.track.cues.length), 7);
      for (const [path, type] of [
        ["/assets/projects/reso/resources/reso-demo.mp4", "video/mp4"],
        ["/assets/projects/reso/resources/reso-project-report.pdf", "application/pdf"],
        ["/assets/projects/reso/resources/reso-presentation.pdf", "application/pdf"],
        ["/assets/projects/reso/resources/reso-analysis-report.html", "text/html"],
      ]) {
        const response = await page.request.head(`${base}${path}`);
        assert.equal(response.status(), 200);
        assert.match(response.headers()["content-type"], new RegExp(type));
      }
    }
    await page.screenshot({ path: `${output}/${name}-hero.png` });
    await page.locator("section[aria-labelledby='materials-title']").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/${name}-materials.png` });
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to case study");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "reso-content");
    assert.equal(await video.evaluate(element => { element.focus(); return document.activeElement === element; }), true);
    for (const id of ["gap", "prototypes", "system", "study", "results", "iteration", "reflection"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.locator(`#${id}`).locator("img").evaluateAll(async images => {
        await Promise.all(images.map(img => img.decode()));
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator("main").evaluate(el => el.scrollWidth > el.clientWidth), false);
      await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/${name}-${id}.png` });
    }
    await video.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/${name}-demo.png` });
    await page.locator('a[href="#reso-content"]').last().click();
    await page.keyboard.press("PageDown");
    await page.waitForFunction(() => document.querySelector("main").parentElement.scrollTop > 100);
    assert.ok(await page.locator("main").evaluate(el => el.parentElement.scrollTop) > 100, "keyboard can scroll the route");
    assert.match(await page.locator("#study").innerText(), /18 hearing proxy participants/);
    assert.match(await page.locator("#results").innerText(), /cannot be attributed to colour alone/);
    assert.match(await page.locator("#results").innerText(), /Angry \+33 pp/);
    assert.match(await page.locator("#results").innerText(), /Sad \+28 pp/);
    assert.match(await page.locator("#results").innerText(), /Cognitive load did not improve/);
    assert.match(await page.locator("#iteration").innerText(), /does not establish/);
    assert.match(await page.locator("#iteration").innerText(), /Before\/after image pending/);
    assert.equal(await page.locator('img:not([alt]), img[alt=""]').count(), 0);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash));
    assert.deepEqual(brokenAnchors, []);
    if (reducedMotion === "reduce") {
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length), 0);
    }
    await page.getByRole("link", { name: "Back to projects", exact: false }).click();
    await page.waitForURL(`${base}/projects`);
    await page.getByRole("link", { name: "Read Reso: making tone visible" }).click();
    await page.waitForURL(`${base}/projects/reso`);
    await page.close();
    console.log(`${name}: images, sections, overflow, keyboard, links, content boundaries and runtime passed`);
  }
  for (const [name, width] of [["desktop", 1440], ["mobile", 390]]) {
    const report = await browser.newPage({ viewport: { width, height: 900 } });
    await report.goto(`${base}/assets/projects/reso/resources/reso-analysis-report.html`);
    assert.equal(await report.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.doesNotMatch(await report.locator("body").innerText(), /Abeera|Haider Sultan|Individual Participant Data/);
    await report.screenshot({ path: `${output}/${name}-analysis-report.png`, fullPage: true });
    await report.close();
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
