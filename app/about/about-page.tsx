"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SiteHeader } from "@/components/site-header";
import { usePageTransition } from "@/components/page-transition";
import { aboutAsset, type AboutAssetKey } from "./about-assets";
import { bodyFont, handFont } from "./fonts";
import styles from "./about.module.css";
import bookStyles from "./about-book.module.css";

/**
 * About me.
 *
 * The notebook redesign's three spreads — "① Intro", "② My Journey", "③ Beyond" — and
 * the cross-spread switching UI (nav buttons/dots/keyboard, the enter/exit stagger
 * animation). See design-assets/about/IMPLEMENTATION.md and design-assets/about/layout.js
 * (the finalized design; design-assets/about/about-prototype-stickers.html is the
 * runnable reference).
 *
 * Phones (2026-09-20, design-assets/about/MOBILE.md): the same two-page spread, never a
 * re-flowed single column. In landscape (height ≤ 500px) the notebook is scaled up to
 * fill the width and cropped to its content area, so text stays readable and the page
 * scrolls vertically; prev/next and the dots are pinned to the viewport. Portrait
 * phones get a "turn your phone sideways" card with a "View anyway" escape. The
 * postcard opens a larger writing dialog everywhere (see PostcardNote).
 * All of that is CSS media queries in about-book.module.css plus the small bits of
 * state below; desktop rendering is unchanged.
 *
 * `notebook.webp` is the whole illustrated shell (cover, pages, binder rings) for both
 * page panels; every readable element sits on top as real DOM, absolutely positioned at
 * the percentages recorded in layout.js and sized in cqw so it scales with its own page
 * panel's width (`container-type: inline-size` on `.page`). Coordinates, rotation, zoom,
 * saturation and z-index below are copied verbatim from layout.js — do not adjust them.
 *
 * design-assets/VISUAL_UNIFY.md (2026-09-20) is layered on top of IMPLEMENTATION.md and
 * takes precedence wherever the two disagree on color/saturation/decoration: it dropped
 * 24 purely-decorative elements (loose leaf/spark/heart stickers and the hand-drawn
 * heart/spark SVGs — HeartIcon/SparkIcon from earlier rounds are gone, nothing renders
 * them anymore) and pulled back three item-level saturations (polaroid backing 2.5→1.44,
 * chips 1.6→1.17, the CV pill 1.9→1.26). Its color-correction filters (notebook base,
 * sticker images, the portrait photo) live in about-book.module.css, not here.
 *
 * Hover reactions (2026-09-21): the objects on the page — camera, flower, globe,
 * suitcase, bird, carousel, mailbox and so on — answer the mouse with a small hop or
 * sway (`live` on the sticker, `.live` in the stylesheet). Only those stickers take
 * pointer events; tapes, pins, clips, backing cards and the two Peiwen stickers stay
 * click-through so their transparent corners don't sit on top of the text. Touch devices
 * and `prefers-reduced-motion` get nothing.
 *
 * Cross-spread switching (IMPLEMENTATION.md §5): the notebook itself never animates.
 * On navigation the current spread's items fade out (200ms, 8px lift), then the new
 * spread's items land one at a time, 220ms apart, each bouncing in from
 * `scale(0.55) rotate(-6deg) translateY(20px)` via `cubic-bezier(0.34, 1.56, 0.64, 1)`.
 * The reference prototype's own script actually used slightly different constants
 * (130ms stagger, 190ms exit wait) — this build follows IMPLEMENTATION.md's restated
 * timings (220ms / 200ms) instead, per the brief for this round. `prefers-reduced-motion`
 * skips the bounce entirely and swaps instantly, matching the prototype's `reduce` branch.
 *
 * The site header above the notebook is the shared `<SiteHeader>` component
 * (components/site-header.tsx), the same one /experience uses.
 */

function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars as CSSProperties;
}

function EmailIcon() {
  return (
    <svg className={bookStyles.ln} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.2" y="5.2" width="19.6" height="13.6" rx="1.6" />
      <path d="M2.8 6.4 L12 13.4 L21.2 6.4" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className={bookStyles.fl} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.59-4.04-1.59-.55-1.36-1.34-1.72-1.34-1.72-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.1-.76.42-1.28.76-1.58-2.67-.29-5.47-1.31-5.47-5.82 0-1.29.47-2.34 1.24-3.17-.14-.3-.54-1.5.1-3.12 0 0 1.01-.32 3.3 1.21.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.28-1.53 3.29-1.21 3.29-1.21.65 1.62.24 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.53-2.81 5.53-5.48 5.82.42.35.81 1.08.81 2.19 0 1.58-.02 2.86-.02 3.25 0 .31.21.68.83.57C20.57 21.92 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- spread item model */

type BaseItem = {
  id: string;
  left: string;
  top: string;
  width: string;
  /** Only the write-a-note module sets this (layout.js's `height:4.3%`); every other
      item's height comes from its own content. */
  height?: string;
  rotate: number;
  zoom?: number;
  saturate?: number;
  zIndex?: number;
};

type StickerItem = BaseItem & { kind: "sticker"; assetKey: AboutAssetKey; alt: string; live?: Live };
type NodeItem = BaseItem & { kind: "node"; content: ReactNode };
type SpreadItem = StickerItem | NodeItem;

type Spread = { name: string; left: SpreadItem[]; right: SpreadItem[] };

/** Hover reactions for the objects on the page (mouse/trackpad only, see the
    `.live` rules in about-book.module.css). Most things hop; the light, feathery ones
    sway; the carousel turns. Stickers without one of these stay click-through, which is
    what keeps their transparent corners from swallowing the text underneath. */
type Live = "hop" | "sway";

/** A placed sticker image, per layout.js's `st(IMG[key], css, rot)`. `alt` defaults to ""
    (decorative) — the four exceptions with real text baked into the artwork
    (IMPLEMENTATION.md §7.1) pass one explicitly. */
function sticker(
  id: string,
  assetKey: AboutAssetKey,
  left: string,
  top: string,
  width: string,
  rotate: number,
  extra: Partial<Pick<BaseItem, "zoom" | "saturate" | "zIndex" | "height">> & { live?: Live } = {},
  alt = "",
): StickerItem {
  return { kind: "sticker", id, assetKey, left, top, width, rotate, alt, ...extra };
}

/* ------------------------------------------------------------- page-level intro banner
 * 2026-09-22: mirrors /experience's `.intro` — a short heading + a row of tags + a
 * stats line, sitting above the interactive piece instead of inside it, so a visitor
 * gets the same kind of orientation on both pages. First pass reused the notebook's
 * pill.webp chip art for the tags; a live check showed it reading as heavy/cartoonish
 * on open cream paper (it was drawn for the notebook's own cramped page, not this),
 * so the tags now use the same light colored-dash marker Experience's `.stickers`
 * use, just recolored with About's own dust-blue/butter/rose-brown palette instead of
 * Experience's — see about.module.css's `.tag` rules. The three tags themselves
 * ("AI Products", "Prototyping", "Interactive Storytelling") still echo three of the
 * four skill chips already shown on the Intro spread's right page (see `introRight`
 * below), and the stats are drawn from content already on the page (three spreads,
 * three languages, the current MSc) — nothing here is a new fact or a new asset.
 */
const topIntro = {
  heading: "Turn a few pages to get to know me.",
  tags: ["AI Products", "Prototyping", "Interactive Storytelling"],
  stats: ["3 spreads", "3 languages", "MSc in progress"],
};

/** A placed content block, per layout.js's `el(html, css, rot)`. */
function node(
  id: string,
  content: ReactNode,
  left: string,
  top: string,
  width: string,
  rotate: number,
  extra: Partial<Pick<BaseItem, "zoom" | "saturate" | "zIndex" | "height">> = {},
): NodeItem {
  return { kind: "node", id, content, left, top, width, rotate, ...extra };
}

/* ---------------------------------------------------------------------- ① Intro data */

const introLeft: SpreadItem[] = [
  node(
    "intro-polaroid-back",
    <div className={bookStyles.polaroidBack} />,
    "19.2%",
    "0.1%",
    "62%",
    3,
    // VISUAL_UNIFY.md §3.1: 2.5 → 1.44
    { saturate: 1.44, zIndex: 0 },
  ),
  node(
    "intro-polaroid",
    <div className={bookStyles.polaroid}>
      <div className={bookStyles.photoInner} />
      <div className={bookStyles.cap}>days @ Paris-Saclay</div>
    </div>,
    "11.1%",
    "3.5%",
    "68%",
    -3,
  ),
  sticker("intro-flower", "flower", "-2.9%", "27.9%", "27%", 17.5, { live: "sway" }),
  sticker("intro-camera", "camera", "51.2%", "31.4%", "50%", 11, { live: "hop" }),
  node(
    "intro-title",
    <>
      <h2 className={bookStyles.title} style={cssVars({ "--title-fs": "12cqw" })}>
        Hi, I&rsquo;m Peiwen.
      </h2>
      <div className={bookStyles.uline} style={{ width: "78%" }} />
    </>,
    "9.6%",
    "53.7%",
    "94%",
    -1,
    { zIndex: 1 },
  ),
  node(
    "intro-sub",
    <div style={{ ...cssVars({ "--sub-fs": "5.4cqw" }), textAlign: "center" }}>
      product manager &middot; in paris
    </div>,
    "-0.4%",
    "63.2%",
    "92%",
    0,
  ),
  node(
    "intro-body",
    <p className={bookStyles.bodyText} style={cssVars({ "--body-fs": "4.8cqw" })}>
      I&rsquo;m exploring how to become an AI Product Manager. I use research, prototyping,
      and visual design to work with AI and make complex problems easier to understand,
      while bringing a little more storytelling into digital experiences.
    </p>,
    "2.7%",
    "70.1%",
    "97.2%",
    0.5,
  ),
  sticker("intro-tape-pink", "tape-pink-check", "20.4%", "-2.5%", "37.5%", 4.5),
];

const introRight: SpreadItem[] = [
  node(
    "intro-quick-facts",
    <div className={`${bookStyles.note} ${bookStyles.noteButter} ${bookStyles.noteBig}`}>
      <h3>Quick Facts</h3>
      <div className={bookStyles.uline} style={{ width: "64%", margin: "0 auto 7%" }} />
      <div className={bookStyles.facts}>
        <div className={bookStyles.fact}>
          <span className={bookStyles.tag2}>Now</span>
          <span className={bookStyles.arw}>&rarr;</span>
          <span className={bookStyles.val}>MSc in Human-Computer Interaction</span>
        </div>
        <div className={bookStyles.fact}>
          <span className={bookStyles.tag2}>Focus</span>
          <span className={bookStyles.arw}>&rarr;</span>
          <span className={bookStyles.val}>
            AI Products &middot; Human-AI Interaction &middot; Interaction Design
          </span>
        </div>
        <div className={bookStyles.fact}>
          <span className={bookStyles.tag2}>Languages</span>
          <span className={bookStyles.arw}>&rarr;</span>
          <span className={bookStyles.val}>Chinese &middot; English &middot; French</span>
        </div>
        <div className={bookStyles.fact}>
          <span className={bookStyles.tag2}>Location</span>
          <span className={bookStyles.arw}>&rarr;</span>
          <span className={bookStyles.val}>Paris</span>
        </div>
      </div>
    </div>,
    "1.5%",
    "5.3%",
    "95%",
    -1,
    { zIndex: -4 },
  ),
  sticker("intro-pin", "pin", "6%", "0%", "13%", -4),
  sticker("intro-clip1", "clip1", "88.2%", "43.4%", "10%", 6, { zIndex: -1 }),
  node(
    "intro-chips",
    <div
      className={bookStyles.chips}
      style={{
        justifyContent: "center",
        gap: "4%",
        ...cssVars({ "--chip-fs": "4.7cqw", "--chip-padx": "8cqw", "--chip-pady": "5cqw" }),
      }}
    >
      <span className={bookStyles.chip}>Design Systems</span>
      <span className={bookStyles.chip}>Prototyping</span>
      <span className={bookStyles.chip}>AI Products</span>
      <span className={bookStyles.chip}>Interactive Storytelling</span>
    </div>,
    "2.6%",
    "64.1%",
    "99.6%",
    -0.5,
    // VISUAL_UNIFY.md §3.1: 1.6 → 1.17
    { zoom: 1.1, saturate: 1.17 },
  ),
  node(
    "intro-cv",
    // IMPLEMENTATION.md §7.3: the CV PDF isn't attached yet. layout.js's prototype used
    // `href="#" onclick="return false"` for this, which is a dead link for
    // keyboard/screen-reader users; lib/about.ts's own `cv.href === null` pattern renders
    // inert text with no href instead, so this follows that existing, more accessible
    // convention.
    <span className={bookStyles.cvfill} aria-disabled="true">
      &darr; Download CV
    </span>,
    "22.8%",
    "81.7%",
    "56%",
    -1,
    // VISUAL_UNIFY.md §3.1: 1.9 → 1.26
    { saturate: 1.26 },
  ),
  node(
    "intro-contact",
    <div
      className={bookStyles.contact}
      style={{ justifyContent: "center", gap: "12%", ...cssVars({ "--contact-fs": "4.3cqw" }) }}
    >
      <a href="mailto:peiwen.zhang@universite-paris-saclay.fr">
        <EmailIcon />
        <span className={bookStyles.wrap}>
          Email
          <span className={bookStyles.wave} />
        </span>
      </a>
      <a href="https://github.com/peiwenZHANG-git" target="_blank" rel="noopener noreferrer">
        <GithubIcon />
        <span className={bookStyles.wrap}>
          GitHub
          <span className={bookStyles.wave} />
        </span>
      </a>
    </div>,
    "3.9%",
    "93%",
    "96%",
    0,
  ),
];

/* ----------------------------------------------------------------- ② My Journey data */

const journeyLeft: SpreadItem[] = [
  sticker(
    "journey-title",
    "title-myjourney",
    "9.3%",
    "-1%",
    "60.9%",
    0,
    {},
    "My Journey",
  ),
  sticker("journey-feather", "feather", "69.9%", "-3%", "19.5%", 5, { live: "sway" }),
  node(
    "journey-timeline",
    <div
      className={bookStyles.tl}
      style={cssVars({
        "--yr-fs": "5.5cqw",
        "--sch-fs": "5.3cqw",
        "--meta-fs": "4.2cqw",
        "--tltag-fs": "4.6cqw",
      })}
    >
      <div className={bookStyles.tlItem}>
        <div className={bookStyles.tlYear}>2021 ~ 2025</div>
        <div className={bookStyles.tlSchool}>Communication University of China</div>
        <div className={bookStyles.tlMeta}>Beijing, China &middot; BA in Digital Media Tech</div>
        <div className={bookStyles.tlTag}>
          Found my way into interaction, visual storytelling, and creative technology.
        </div>
      </div>
      <div className={bookStyles.tlItem}>
        <div className={bookStyles.tlYear}>2023</div>
        <div className={bookStyles.tlSchool}>Osaka University</div>
        <div className={bookStyles.tlMeta}>Osaka, Japan &middot; Exchange</div>
        <div className={bookStyles.tlTag}>
          Explored HCI through research, experiments, and a different culture.
        </div>
      </div>
      <div className={bookStyles.tlItem}>
        <div className={bookStyles.tlYear}>2025 ~ now</div>
        <div className={bookStyles.tlSchool}>Universit&eacute; Paris-Saclay</div>
        <div className={bookStyles.tlMeta}>Paris, France &middot; MSc HCI</div>
        <div className={bookStyles.tlTag}>
          Now exploring Human&ndash;AI interaction and how AI products can make complexity
          feel clearer.
        </div>
      </div>
    </div>,
    "-1%",
    "23.3%",
    "96.2%",
    0,
  ),
  sticker("journey-flower-sakura", "flower-sakura", "77.6%", "45.1%", "15.7%", 0, { live: "sway" }),
];

const journeyRight: SpreadItem[] = [
  sticker(
    "journey-route-map",
    "route-map",
    "-2.1%",
    "28.5%",
    "106.9%",
    0,
    {},
    "Route from Beijing to Osaka to Paris",
  ),
  sticker("journey-peiwen-camera", "peiwen-camera", "17.7%", "56.2%", "36.7%", 0),
  sticker("journey-pass", "pass", "5%", "4.9%", "45.3%", 7.5),
  node(
    "journey-quote",
    <div className={bookStyles.quote}>
      &ldquo;Different places,
      <br />
      same curiosity.&rdquo;
    </div>,
    "55.8%",
    "0.7%",
    "46.8%",
    7.5,
  ),
  sticker("journey-globe", "globe", "5.7%", "18.5%", "31%", -17, { live: "sway" }),
  sticker("journey-suitcase", "suitcase", "55.4%", "75.8%", "42.7%", 6, { live: "hop" }),
  sticker("journey-clip1", "clip1", "10.8%", "78.9%", "8.3%", -14),
];

/* --------------------------------------------------------------------- ③ Beyond data */

const beyondLeft: SpreadItem[] = [
  node(
    "beyond-body",
    <p className={bookStyles.bodyText} style={cssVars({ "--body-fs": "4.4cqw" })}>
      Outside of design, I love swimming, taking photos, going somewhere new, cooking, and
      exploring what life feels like from a different place. I&rsquo;m always curious about
      what else life could become.
    </p>,
    "6.1%",
    "21.9%",
    "90.8%",
    0,
  ),
  sticker(
    "beyond-title",
    "title-beyonddesign",
    "7.5%",
    "-1.3%",
    "78.8%",
    0,
    {},
    "A little beyond design",
  ),
  sticker("beyond-peiwen-swim", "peiwen-swim", "-25.6%", "48.8%", "64.3%", 0, { zIndex: 3 }),
  sticker("beyond-skillet", "skillet", "76.6%", "37.5%", "23.8%", 25, { live: "hop" }),
  sticker(
    "beyond-note-thingsilove",
    "note-thingsilove",
    "28.7%",
    "48.5%",
    "66.4%",
    0,
    {},
    "Things I love: swimming, taking photos, travelling and exploring, cooking, discovering new possibilities in life",
  ),
];

const beyondRight: SpreadItem[] = [
  sticker("beyond-carousel", "carousel", "8.9%", "76.7%", "30.1%", -6.5, { live: "hop" }),
  node("beyond-postcard", <PostcardNote />, "1.8%", "46.1%", "69.1%", 0),
  sticker("beyond-feather", "feather", "55.2%", "76.2%", "18.2%", 0, { live: "sway" }),
  sticker("beyond-bird", "bird", "-5.8%", "-0.6%", "26.7%", -4, { zoom: 1.14, zIndex: 3, live: "sway" }),
  node(
    "beyond-note-exploring",
    <div className={`${bookStyles.note} ${bookStyles.noteBlue}`}>
      <h3>Currently exploring</h3>
      <p className={bookStyles.bodyText}>
        How AI can become more than a tool - and how thoughtful interaction can make complex
        technology feel clearer, warmer, and easier to trust.
      </p>
    </div>,
    "16.6%",
    "2.7%",
    "74.7%",
    1,
  ),
  node(
    "beyond-write-title",
    <h2 className={bookStyles.title} style={cssVars({ "--title-fs": "7cqw" })}>
      Write me a note&hellip;
    </h2>,
    "4.9%",
    "37.2%",
    "60%",
    -2,
  ),
  sticker("beyond-mailbox", "mailbox", "76.2%", "44.2%", "22.4%", 3, { live: "hop" }),
];

const SPREADS: Spread[] = [
  { name: "① Intro", left: introLeft, right: introRight },
  { name: "② My Journey", left: journeyLeft, right: journeyRight },
  { name: "③ Beyond", left: beyondLeft, right: beyondRight },
];

/* ------------------------------------------------------------------ swap animation */

type Phase = "idle" | "leaving" | "pending" | "entering";

const LEAVE_MS = 200;
const STAGGER_MS = 220;
/** Matches the entrance transition's own length (opacity 0.3s, transform 0.55s) plus a
    small buffer, so `busy` clears once the last staggered item has actually settled. */
const ENTER_SETTLE_MS = 560;
/** 2026-09-22 (v5.3): live feedback was that route-arrival into About showed no
    elastic entrance at all for the first spread's own content (the photo, Quick
    Facts note, stickers, …) — `phase` used to start at `"idle"`, so `itemStyle`
    rendered every item at full opacity with `transition: "none"` from the very
    first frame, same as an internal `goTo` settle. The fix below reuses `goTo`'s
    existing leaving→pending→entering→idle machinery for the very first mount too,
    so the first spread's items get the same per-item `STAGGER_MS` bounce
    (`cubic-bezier(0.34, 1.56, 0.64, 1)`) as switching spreads already has. This
    delay is when that first entrance kicks off, relative to mount — matched to
    `.revealBook`'s own `animation-delay` in about-book.module.css so items start
    popping in exactly as the notebook itself becomes visible, not while still
    masked by the notebook's own zero opacity. Keep these two files' delay in sync
    if either changes.

    2026-09-23: was 480ms — live feedback was that the gap between the desk
    background (added this round, appears instantly with no fade of its own) and
    the notebook becoming visible read as too long. Cut to 150ms so the notebook
    starts revealing much sooner after route arrival; the 570ms reveal itself is
    unchanged. */
const FIRST_ENTER_DELAY_MS = 150;

function itemStyle(item: SpreadItem, phase: Phase, index: number, reducedMotion: boolean): CSSProperties {
  const base: CSSProperties = {
    left: item.left,
    top: item.top,
    width: item.width,
    height: item.height,
    zIndex: item.zIndex,
    zoom: item.zoom,
    filter: item.saturate !== undefined ? `saturate(${item.saturate})` : undefined,
  };

  if (reducedMotion || phase === "idle") {
    return { ...base, opacity: 1, transform: `rotate(${item.rotate}deg)`, transition: "none" };
  }

  if (phase === "leaving") {
    return {
      ...base,
      opacity: 0,
      transform: `translateY(-8px) scale(0.97) rotate(${item.rotate}deg)`,
      transition: "opacity 0.2s ease, transform 0.2s ease",
    };
  }

  if (phase === "pending") {
    return {
      ...base,
      opacity: 0,
      transform: "translateY(20px) scale(0.55) rotate(-6deg)",
      transition: "none",
    };
  }

  // entering
  return {
    ...base,
    opacity: 1,
    transform: `rotate(${item.rotate}deg)`,
    transition: "opacity 0.3s ease-out, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transitionDelay: `${index * STAGGER_MS}ms`,
  };
}

function ItemView({
  item,
  phase,
  index,
  reducedMotion,
}: {
  item: SpreadItem;
  phase: Phase;
  index: number;
  reducedMotion: boolean;
}) {
  const live = item.kind === "sticker" ? item.live : undefined;
  const className = [
    bookStyles.el,
    item.kind === "sticker" ? bookStyles.st : null,
    live ? bookStyles.live : null,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className={className}
      style={itemStyle(item, phase, index, reducedMotion)}
      data-live={live}
    >
      {item.kind === "sticker" ? (
        // Decorative/illustrated sticker, sized by its placed container's width (%), not intrinsic pixels.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={aboutAsset(item.assetKey)} alt={item.alt} />
      ) : (
        item.content
      )}
    </div>
  );
}

function Page({
  items,
  phase,
  reducedMotion,
  className,
}: {
  items: SpreadItem[];
  phase: Phase;
  reducedMotion: boolean;
  className: string;
}) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <ItemView key={item.id} item={item} phase={phase} index={i} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------ write a note */

/** The airmail postcard *is* the write-a-note module. On the page it is a button: its
    writing half (left of the dashed divider) is covered in the card's own paper colour
    and shows the placeholder, or the draft so far. Clicking it opens the same postcard
    enlarged in a dialog, where the note is actually written (18px text, so iOS doesn't
    zoom on focus). Same on desktop and phones (user decision, 2026-09-20). Client-only —
    nothing is actually sent: "Send" with empty text just focuses the field; with text it
    clears the draft, shows "Sent ✓" and closes after ~1.4s. Close, Escape or a click on
    the backdrop close it too, and focus returns to the postcard. */
function PostcardNote() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const tapRef = useRef<HTMLButtonElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    },
    [],
  );

  function closeSheet() {
    setSheetOpen(false);
    tapRef.current?.focus();
  }

  function handleSend() {
    if (!value.trim()) {
      sheetTextareaRef.current?.focus();
      return;
    }
    setValue("");
    setSent(true);
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setSent(false);
      closeSheet();
    }, 1400);
  }

  useEffect(() => {
    if (!sheetOpen) return;
    sheetTextareaRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSheetOpen(false);
        tapRef.current?.focus();
        return;
      }
      // Keep Tab inside the dialog: textarea → Close → Send → textarea.
      if (event.key !== "Tab") return;
      const dialog = sheetRef.current;
      if (!dialog) return;
      const stops = Array.from(
        dialog.querySelectorAll<HTMLElement>("textarea, button"),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  return (
    <div className={bookStyles.postcard}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={bookStyles.postcardArt} src={aboutAsset("postcard-airmail")} alt="" />
      <div className={bookStyles.postcardWrite}>
        <button
          ref={tapRef}
          type="button"
          className={bookStyles.postcardTap}
          aria-label="Write a note to Peiwen"
          aria-haspopup="dialog"
          onClick={() => setSheetOpen(true)}
        >
          {value || "A thought, a question, or just a little hello…"}
        </button>
      </div>
      {sheetOpen &&
        // Portalled to <body>: the placed items carry transform/zoom and the book a
        // filter, any of which would trap a position:fixed overlay inside the notebook.
        createPortal(
          <div
            ref={sheetRef}
            className={`${bookStyles.sheet} ${handFont.variable} ${bodyFont.variable}`}
            role="dialog"
            aria-modal="true"
            aria-label="Write a note to Peiwen"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeSheet();
            }}
          >
            <div className={bookStyles.sheetCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={bookStyles.postcardArt} src={aboutAsset("postcard-airmail")} alt="" />
              <div className={bookStyles.sheetWrite}>
                <textarea
                  ref={sheetTextareaRef}
                  aria-label="Your note"
                  placeholder="A thought, a question, or just a little hello…"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </div>
            </div>
            <div className={bookStyles.sheetBar}>
              <button type="button" onClick={closeSheet}>
                Close
              </button>
              <span className={bookStyles.sheetSent} style={{ opacity: sent ? 1 : 0 }} aria-live="polite">
                Sent &#10003;
              </span>
              <button type="button" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------------- page shell */

/* prefers-reduced-motion, read via useSyncExternalStore so the value is available on the
   first client render and updates live, without calling setState inside an effect. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getReducedMotionServer() {
  return false;
}

/** Must match the landscape-phone media query in about-book.module.css. */
const PHONE_LANDSCAPE_QUERY = "(orientation: landscape) and (max-height: 500px)";
/** Must match the portrait-phone media query in about-book.module.css. */
const PHONE_PORTRAIT_QUERY = "(orientation: portrait) and (max-width: 600px)";

function subscribePortrait(onChange: () => void) {
  const mq = window.matchMedia(PHONE_PORTRAIT_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getPortrait() {
  return window.matchMedia(PHONE_PORTRAIT_QUERY).matches;
}
function getPortraitServer() {
  return false;
}

export default function AboutPage() {
  const { stageClassName, onStageTransitionEnd } = usePageTransition();
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [renderIndex, setRenderIndex] = useState(0);
  // Starts "pending" (not "idle") so the very first mount plays the same entrance
  // `goTo` uses when switching spreads — see the FIRST_ENTER_DELAY_MS comment above
  // and the mount effect below. `itemStyle` already renders "pending" as invisible/
  // scaled-down, so there's no flash of unstaggered content before that effect runs.
  const [phase, setPhase] = useState<Phase>("pending");
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);
  const busyRef = useRef(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [viewAnyway, setViewAnyway] = useState(false);
  const phonePortrait = useSyncExternalStore(subscribePortrait, getPortrait, getPortraitServer);
  /* The rotate card covers the page, so the notebook behind it is made inert: no tab
     stops, nothing for a screen reader, until "View anyway" is pressed. */
  const blocked = phonePortrait && !viewAnyway;
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  // The very first entrance (mount into spread 0) — plays the same
  // leaving→pending→entering→idle bounce `goTo` uses for every later spread switch,
  // just triggered by mounting instead of a click. `phase` already starts "pending"
  // above, so this only needs to flip it to "entering" (after FIRST_ENTER_DELAY_MS,
  // synced with `.revealBook`'s own delay) and back to "idle" once the last
  // staggered item has settled. Reduced-motion users skip straight to "idle" —
  // `itemStyle` already renders every phase identically to "idle" when
  // `reducedMotion` is true, so this is a formality for `busy`, not a visual fix.
  useEffect(() => {
    if (reducedMotion) {
      const settleTimer = window.setTimeout(() => setPhase("idle"), 0);
      timers.current.push(settleTimer);
      return;
    }
    busyRef.current = true;
    const firstSpread = SPREADS[0];
    const maxCount = Math.max(firstSpread.left.length, firstSpread.right.length);
    const settleMs = maxCount * STAGGER_MS + ENTER_SETTLE_MS;
    const t1 = window.setTimeout(() => setPhase("entering"), FIRST_ENTER_DELAY_MS);
    const t2 = window.setTimeout(() => {
      setPhase("idle");
      busyRef.current = false;
    }, FIRST_ENTER_DELAY_MS + settleMs);
    timers.current.push(t1, t2);
  }, [reducedMotion]);

  const goTo = useCallback(
    (target: number) => {
      if (busyRef.current) return;
      if (target < 0 || target > SPREADS.length - 1) return;
      if (target === spreadIndex) return;

      busyRef.current = true;

      // Landscape phones scroll through a spread; start the next one at its top.
      if (window.matchMedia(PHONE_LANDSCAPE_QUERY).matches) {
        shellRef.current?.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }

      if (reducedMotion) {
        setRenderIndex(target);
        setSpreadIndex(target);
        setPhase("idle");
        busyRef.current = false;
        return;
      }

      setPhase("leaving");
      const t1 = window.setTimeout(() => {
        setRenderIndex(target);
        setPhase("pending");
        // Two rAFs so the browser paints the pre-entrance transform before it's
        // transitioned away from — otherwise React can batch straight to the final
        // state and the bounce never plays.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase("entering"));
        });

        const spread = SPREADS[target];
        const maxCount = Math.max(spread.left.length, spread.right.length);
        const settleMs = maxCount * STAGGER_MS + ENTER_SETTLE_MS;
        const t2 = window.setTimeout(() => {
          setSpreadIndex(target);
          setPhase("idle");
          busyRef.current = false;
        }, settleMs);
        timers.current.push(t2);
      }, LEAVE_MS);
      timers.current.push(t1);
    },
    [spreadIndex, reducedMotion],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.closest('[role="dialog"]'))) return;
      if (blocked) return;
      if (event.key === "ArrowRight") goTo(spreadIndex + 1);
      if (event.key === "ArrowLeft") goTo(spreadIndex - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, spreadIndex, blocked]);

  const busy = phase !== "idle";
  const active = SPREADS[renderIndex];

  return (
    /* body keeps its global `overflow: hidden`, so the About route scrolls inside its
       own shell. tabIndex keeps that scroll container reachable for keyboard-only
       users (the axe "scrollable-region-focusable" rule). */
    <div
      ref={shellRef}
      className={[styles.shell, handFont.variable, bodyFont.variable].filter(Boolean).join(" ")}
      tabIndex={blocked ? -1 : 0}
    >
      <a className={styles.skipLink} href="#about-content">
        Skip to content
      </a>

      {/* display: contents — the wrapper only exists to carry `inert`. */}
      <div className={bookStyles.chromeWrap} inert={blocked || undefined}>
        <SiteHeader current="about" />
      </div>

      {/* 2026-09-22: orienting banner above the notebook, same job as /experience's
          `.intro` above its scene — see the `topIntro` comment above for the tags'
          dash-marker styling (recolored to About's own palette, not Experience's). */}
      {/* 2026-09-22 (v5): "text elements appear one by one" — heading/tags/stats each
          carry their own `.reveal*` mount animation (see about.module.css), independent
          of `stageClassName` above (which only ever does anything while THIS page is
          departing, not while it's arriving) and independent of the notebook's own
          `.revealBook` reveal below. */}
      <div className={`${styles.intro} ${stageClassName}`} inert={blocked || undefined}>
        <h1 className={`${styles.introHeading} ${styles.revealHeading}`}>{topIntro.heading}</h1>
        <ul className={`${styles.tags} ${styles.revealTags}`}>
          {topIntro.tags.map(tag => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <ul className={`${styles.stats} ${styles.revealStats}`}>
          {topIntro.stats.map(stat => (
            <li key={stat}>{stat}</li>
          ))}
        </ul>
      </div>

      <main
        id="about-content"
        className={`${bookStyles.stageWrap} ${stageClassName}`}
        onTransitionEnd={onStageTransitionEnd}
        tabIndex={-1}
        inert={blocked || undefined}
      >
        {/* "notebook first" — the whole spread reveals as one unit, ahead of the intro
            text above. See about-book.module.css's `.revealBook`. */}
        <div className={bookStyles.bookStage}>
          <div className={`${bookStyles.book} ${bookStyles.revealBook}`}>
            <Page
              items={active.left}
              phase={phase}
              reducedMotion={reducedMotion}
              className={`${bookStyles.page} ${bookStyles.pageLeft}`}
            />
            <Page
              items={active.right}
              phase={phase}
              reducedMotion={reducedMotion}
              className={`${bookStyles.page} ${bookStyles.pageRight}`}
            />
          </div>

          <div className={bookStyles.controls}>
            <button
              type="button"
              className={`${bookStyles.navBtn} ${bookStyles.navPrev}`}
              aria-label="Previous spread"
              disabled={spreadIndex === 0 || busy}
              onClick={() => goTo(spreadIndex - 1)}
            >
              &lsaquo;
            </button>
            <div className={bookStyles.label}>{SPREADS[spreadIndex].name}</div>
            <div className={bookStyles.dots} role="group" aria-label="Choose spread">
              {SPREADS.map((spread, i) => (
                <button
                  key={spread.name}
                  type="button"
                  className={bookStyles.dot}
                  aria-label={spread.name}
                  aria-current={i === spreadIndex ? "true" : undefined}
                  disabled={busy}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className={`${bookStyles.navBtn} ${bookStyles.navNext}`}
              aria-label="Next spread"
              disabled={spreadIndex === SPREADS.length - 1 || busy}
              onClick={() => goTo(spreadIndex + 1)}
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </main>

      {/* Portrait phones. */}
      {blocked && (
      <div className={bookStyles.rotate}>
        <svg viewBox="0 0 120 90" width="120" height="90" fill="none" stroke="#8c6a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="14" y="10" width="34" height="62" rx="6" />
          <path d="M27 64h8" />
          <rect x="58" y="42" width="54" height="30" rx="6" strokeDasharray="4 4" />
          <path d="M40 4c22-4 40 8 44 28" />
          <path d="M78 26l6 7 6-8" />
        </svg>
        <p className={bookStyles.rotateTitle}>Turn your phone sideways</p>
        <p className={bookStyles.rotateText}>This notebook reads best in landscape.</p>
        <button type="button" className={bookStyles.rotateBtn} onClick={() => setViewAnyway(true)}>
          View anyway
        </button>
      </div>
      )}
    </div>
  );
}
