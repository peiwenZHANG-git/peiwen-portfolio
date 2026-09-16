import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.EXP_BASE_URL || "http://localhost:3411";
const OUT = "visualizations/experience-v2";
await mkdir(OUT, { recursive: true });

const errors = [];
const consoleMessages = [];

async function withPage(browser, opts, fn) {
  const context = await browser.newContext(opts);
  const page = await context.newPage();
  page.on("console", msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", err => errors.push(`pageerror: ${err.message}`));
  page.on("requestfailed", req => errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`));
  try {
    await fn(page);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();

const FIRST_VISIT_MS = 4600;
const REVISIT_MS = 3200;

// ---------- Desktop 1440x900 ----------
await withPage(browser, { viewport: { width: 1440, height: 900 } }, async page => {
  await page.goto(`${BASE}/experience`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/desktop-01-saclay-firstscreen.png` });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('[data-next]');
  await page.waitForTimeout(FIRST_VISIT_MS);
  await page.screenshot({ path: `${OUT}/desktop-02-cuc.png`, fullPage: true });
  console.log("count after ->CUC:", await page.locator('[data-count]').textContent());

  await page.click('[data-next]');
  await page.waitForTimeout(FIRST_VISIT_MS);
  await page.screenshot({ path: `${OUT}/desktop-03-japan.png`, fullPage: true });
  console.log("count after ->Japan:", await page.locator('[data-count]').textContent());

  await page.click('[data-prev]');
  await page.waitForTimeout(REVISIT_MS);
  await page.click('[data-prev]');
  await page.waitForTimeout(REVISIT_MS);
  await page.screenshot({ path: `${OUT}/desktop-04-back-to-saclay.png`, fullPage: true });
  console.log("count after back to Saclay:", await page.locator('[data-count]').textContent());

  // keyboard nav
  await page.click('[data-stage]');
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(REVISIT_MS);
  const shelfCount = await page.locator('[data-count]').textContent();
  console.log("shelf count after keyboard nav:", shelfCount);
  await page.screenshot({ path: `${OUT}/desktop-05-keyboard-nav.png`, fullPage: true });
});

// ---------- Mobile 390x844 ----------
await withPage(browser, { viewport: { width: 390, height: 844 } }, async page => {
  await page.goto(`${BASE}/experience`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/mobile-01-saclay.png`, fullPage: true });
  await page.click('[data-next]');
  await page.waitForTimeout(FIRST_VISIT_MS);
  await page.screenshot({ path: `${OUT}/mobile-02-cuc.png`, fullPage: true });
});

// ---------- Reduced motion ----------
await withPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }, async page => {
  await page.goto(`${BASE}/experience`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForTimeout(400);
  await page.click('[data-next]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/reduced-motion-cuc.png`, fullPage: true });
});

await browser.close();

console.log("\n--- console/page errors ---");
console.log(errors.length ? errors.join("\n") : "none");
console.log("\n--- console messages (last 20) ---");
console.log(consoleMessages.slice(-20).join("\n"));
console.log("\nScreenshots written to", OUT);
