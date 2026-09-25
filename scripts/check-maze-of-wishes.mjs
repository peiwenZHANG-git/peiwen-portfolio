// Run against a local production server; reuse an installed Playwright via PLAYWRIGHT_MODULE.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const { chromium } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const base = process.env.MAZE_URL || "http://127.0.0.1:3021";
const output = "visualizations/maze-of-wishes";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];

try {
  for (const [name, width, reducedMotion] of [
    ["desktop", 1440, "no-preference"],
    ["mobile", 390, "no-preference"],
    ["reduced", 390, "reduce"],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion,
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${base}/projects/maze-of-wishes`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);

    assert.match(await page.title(), /Maze of Wishes/);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main img").count(), 10);
    assert.deepEqual(
      await page
        .locator("section[aria-labelledby='materials-title'] a")
        .allTextContents(),
      ["Watch demo ↗", "Early storyboard ↗", "Project documentation ↗"],
    );
    assert.equal(
      await page
        .locator('a[target="_blank"]:not([rel="noopener noreferrer"])')
        .count(),
      0,
    );

    const video = page.locator("video");
    assert.equal(await video.getAttribute("autoplay"), null);
    assert.equal(await video.getAttribute("controls"), "");
    assert.equal(
      await video.getAttribute("poster"),
      "/assets/projects/maze-of-wishes/demo-poster.webp",
    );
    await video.evaluate((element) =>
      element.readyState >= 1
        ? undefined
        : new Promise((resolve) =>
            element.addEventListener("loadedmetadata", resolve, { once: true }),
          ),
    );
    assert.deepEqual(
      await video.evaluate((element) => [
        Math.round(element.duration),
        element.videoWidth,
        element.videoHeight,
      ]),
      [13, 1280, 720],
    );
    await page.screenshot({
      path: `${output}/${name}-hero.png`,
      fullPage: false,
    });

    if (name === "desktop") {
      await video.evaluate(async (element) => {
        element.muted = true;
        await element.play();
      });
      await page.waitForFunction(
        () => document.querySelector("video")?.currentTime > 0.2,
        undefined,
        { timeout: 5000 },
      );
      assert.ok(
        (await video.evaluate((element) => {
          element.pause();
          return element.currentTime;
        })) > 0.2,
        "embedded demo plays",
      );
      assert.equal(
        await video.evaluate((element) => element.paused),
        true,
        "embedded demo pauses",
      );
      for (const [path, type] of [
        ["/assets/projects/maze-of-wishes/demo-poster.webp", "image/webp"],
        [
          "/assets/projects/maze-of-wishes/resources/maze-of-wishes-demo.mp4",
          "video/mp4",
        ],
        [
          "/assets/projects/maze-of-wishes/resources/early-storyboard.pdf",
          "application/pdf",
        ],
        [
          "/assets/projects/maze-of-wishes/resources/project-documentation.docx",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      ]) {
        const response = await page.request.head(`${base}${path}`);
        assert.equal(response.status(), 200);
        assert.match(
          response.headers()["content-type"],
          new RegExp(type.replace(/[.+]/g, "\\$&")),
        );
      }
    }

    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent),
      "Skip to case study",
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "maze-content",
    );
    assert.equal(
      await video.evaluate((element) => {
        element.focus();
        return document.activeElement === element;
      }),
      true,
    );

    for (const id of [
      "shift",
      "pipeline",
      "mapping",
      "game-loop",
      "collision",
      "demo-evidence",
      "reflection",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page
        .locator(`#${id}`)
        .locator("img")
        .evaluateAll(async (images) => {
          await Promise.all(images.map((image) => image.decode()));
        });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      assert.equal(
        await page
          .locator("main")
          .evaluate((element) => element.scrollWidth > element.clientWidth),
        false,
      );
      await page
        .locator(`#${id}`)
        .evaluate((element) => element.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/${name}-${id}.png` });
    }

    const body = await page.locator("main").innerText();
    assert.match(
      body,
      /Designed and implemented the complete prototype independently/,
    );
    assert.match(
      body,
      /demonstrated live in class as a working cross-device interaction/,
    );
    assert.match(body, /No formal user study/);
    assert.match(body, /Hard Mode appears in the menu but was not implemented/);
    assert.match(
      body,
      /archived mask file does not fully match the demonstrated final build/,
    );
    assert.equal(await page.locator('img:not([alt]), img[alt=""]').count(), 0);
    const brokenAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .filter((link) => !document.getElementById(link.hash.slice(1)))
          .map((link) => link.hash),
      );
    assert.deepEqual(brokenAnchors, []);
    if (reducedMotion === "reduce") {
      assert.equal(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => animation.playState === "running").length,
        ),
        0,
      );
    }
    await page.locator('a[href="#maze-content"]').last().click();
    assert.equal(await page.evaluate(() => location.hash), "#maze-content");
    await page.waitForFunction(
      () =>
        Math.abs(
          document.querySelector("main")?.getBoundingClientRect().top ?? 999,
        ) < 2,
    );
    await page
      .getByRole("link", { name: "Back to projects", exact: false })
      .click();
    await page.waitForURL(`${base}/projects`);
    await page.close();
    console.log(
      `${name}: media, sections, overflow, keyboard, resources, content boundaries and runtime passed`,
    );
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
