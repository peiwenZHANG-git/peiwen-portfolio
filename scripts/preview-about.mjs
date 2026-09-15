/**
 * Local visual-review helper. Not part of the app, not imported by it.
 *
 * Renders a static HTML mirror of /about from the REAL app/about/about.module.css and
 * the REAL lib/about.ts content, so the composition can be checked in a headless
 * browser without a dev server. The markup below mirrors app/about/about-page.tsx.
 *
 * Two substitutions, both preview-only:
 *  - `/assets/about/*` is rewritten to file:// paths into public/.
 *  - The shipped page loads Patrick Hand + Nunito through next/font; those files are
 *    not in a bare checkout, so --about-hand / --about-body point at local families
 *    (override with PREVIEW_HAND / PREVIEW_BODY). Layout and colour are faithful;
 *    the handwriting is not.
 *
 * Output goes to the git-ignored visualizations/ directory.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const css = readFileSync(new URL("app/about/about.module.css", root), "utf8");
const src = readFileSync(new URL("lib/about.ts", root), "utf8");

const HAND = process.env.PREVIEW_HAND ?? "Poppins";
const BODY = process.env.PREVIEW_BODY ?? "Carlito";
const assetBase = new URL("public/assets/about/", root).href;

const pick = (name) => {
  const m = src.match(new RegExp(`export const ${name}[\\s\\S]*?\\n(?=export |$)`));
  return m ? m[0] : "";
};
const one = (re) => (src.match(re) ?? [])[1] ?? "";
const strings = (block, key) =>
  [...block.matchAll(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"))].map((m) => m[1]);

const identity = pick("identity");
const greeting = strings(identity, "greeting")[0];
const marginNote = strings(identity, "marginNote")[0];
const closingNote = strings(identity, "closingNote")[0];
const introText = [...pick("intro").matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
const placeItems = [...pick("places").matchAll(/id: "([^"]*)", name: "([^"]*)"/g)].map((m) => ({
  id: m[1],
  name: m[2],
}));
const journeySteps = [...pick("journey").matchAll(/title: "([^"]*)", detail: "([^"]*)"/g)].map(
  (m) => ({ title: m[1], detail: m[2] }),
);
const exploringItems = [...pick("exploring").matchAll(/label: "([^"]*)", tone: "([^"]*)"/g)].map(
  (m) => ({ label: m[1], tone: m[2] }),
);
const exploringNote = one(/export const exploringNote = "([^"]*)"/);
const strengthItems = [
  ...pick("strengths").matchAll(
    /title: "([^"]*)",\s*\n\s*detail: "([^"]*)",\s*\n\s*tone: "([^"]*)"/g,
  ),
].map((m) => ({ title: m[1], detail: m[2], tone: m[3] }));
const languageItems = [...pick("languages").matchAll(/name: "([^"]*)", level: "([^"]*)"/g)].map(
  (m) => ({ name: m[1], level: m[2] }),
);
const contactItems = [
  ...pick("contact").matchAll(/label: "([^"]*)",\s*\n\s*value: "([^"]*)"/g),
].map((m) => ({ label: m[1], value: m[2] }));

const arrow = `<svg class="journeyArrow" viewBox="0 0 44 16" aria-hidden="true"><path d="M3 8.8C13 7.4 26 7.8 39 8.4M33.5 3.8C35.8 6 38 7.5 40.8 8.5 38 9.8 35.9 11.5 34 13.8" fill="none" stroke="#b49a84" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cvIcon = `<svg class="cvIcon" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2.4v9M5.2 8.2 9 12l3.8-3.8M3 15h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>About preview</title>
<style>
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#f2ead9;color:#4b4339}
body{overflow:hidden;display:flex;flex-direction:column;min-height:100%;font-family:system-ui,Arial,sans-serif}
:root{--about-hand:"${HAND}";--about-body:"${BODY}"}
img{display:block}a{color:inherit}
${css}
</style></head>
<body>
<div class="shell" tabindex="0">
<a class="skipLink" href="#about-content">Skip to content</a>
<header class="header">
  <a class="logo" href="/"><span class="logoName">Peiwen Zhang</span><span class="logoRole">HCI · Product · AI · XR</span></a>
  <nav aria-label="Primary navigation"><a href="/">Home</a><a href="/experience">Experience</a><a href="/#projects">Projects</a><a href="/#playground">Playground</a><a href="/about" aria-current="page">About me</a></nav>
  <p class="headerNote">${marginNote}</p>
</header>
<main id="about-content" class="stageWrap">
  <div class="stage">
    <div class="panel panelLeft">
      <div class="introRow">
        <figure class="polaroid">
          <span class="tape tapePortrait"></span>
          <img class="portraitImage" src="/assets/about/portrait.webp" width="900" height="891" alt="">
          <span class="polaroidFrame"></span>
          <figcaption><span class="polaroidName">Peiwen Zhang</span><span class="polaroidRole">HCI · Product · AI · XR</span></figcaption>
        </figure>
        <div class="introText">
          <h1 class="greeting"><span class="marker markerRose">${greeting}</span><span class="heart">♡</span></h1>
          ${introText.map((p) => `<p>${p}</p>`).join("\n          ")}
        </div>
      </div>
      <ul class="places">
        ${placeItems
          .map(
            (p) =>
              `<li class="place" data-place="${p.id}"><img class="placeArt" src="/assets/about/place-${p.id}.webp" width="640" height="459" alt=""><span class="placeName">${p.name}</span></li>`,
          )
          .join("\n        ")}
      </ul>
      <section class="journey">
        <h2 class="heading"><span class="marker markerSand">How I got into HCI</span></h2>
        <ol class="journeyList">
          ${journeySteps
            .map(
              (s, i) =>
                `<li class="journeyStep">${i > 0 ? arrow : ""}<span class="journeyBody"><span class="journeyTitle">${s.title}</span><span class="journeyDetail">${s.detail}</span></span></li>`,
            )
            .join("\n          ")}
        </ol>
      </section>
      <p class="pageFootNote">${closingNote}</p>
    </div>

    <div class="panel panelRight">
      <section>
        <h2 class="heading"><span class="marker markerRose">Currently exploring…</span></h2>
        <div class="exploringBody">
          <ul class="exploringList">
            ${exploringItems.map((t) => `<li data-tone="${t.tone}"><span class="dot"></span>${t.label}</li>`).join("\n            ")}
          </ul>
          <p class="asideNote"><span class="tape tapeNote"></span>${exploringNote}</p>
        </div>
      </section>
      <section>
        <h2 class="heading"><span class="marker markerSand">What I bring</span></h2>
        <ul class="strengths">
          ${strengthItems
            .map(
              (s) =>
                `<li class="card" data-tone="${s.tone}"><span class="cardTitle">${s.title}</span><span class="cardDetail">${s.detail}</span></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>
      <div class="lowerRow">
        <section class="note">
          <h2 class="heading"><span class="marker markerBlue">I speak…</span></h2>
          <ul class="languages">
            ${languageItems.map((l) => `<li><span class="languageName">${l.name}</span><span class="languageLevel">— ${l.level}</span></li>`).join("\n            ")}
          </ul>
        </section>
        <section class="note">
          <h2 class="heading"><span class="marker markerRose">Let&rsquo;s keep in touch</span></h2>
          <ul class="contact">
            ${contactItems.map((c) => `<li><span class="contactLabel">${c.label}</span><span class="contactPending">${c.value}<span class="pendingTag">to add</span></span></li>`).join("\n            ")}
          </ul>
        </section>
      </div>
      <div class="cvRow">
        <span class="cvLabel" data-pending="true">${cvIcon}Download my CV<span class="pendingTag">PDF coming soon</span></span>
      </div>
    </div>
  </div>
</main>
</div>
</body></html>`;

mkdirSync(new URL("visualizations/about/", root), { recursive: true });
writeFileSync(
  new URL("visualizations/about/preview.html", root),
  html.replaceAll("/assets/about/", assetBase),
);
console.log("wrote visualizations/about/preview.html");
