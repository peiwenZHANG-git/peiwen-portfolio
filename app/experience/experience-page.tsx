"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { chapters, intro, type ExperienceChapter } from "@/lib/experience";
import styles from "./experience.module.css";

/**
 * Experience v2. Interaction is ported directly from
 * experience-v2/experience-prototype-v2.html: a single imperative controller
 * (refs + direct DOM/WAAPI, not React state) drives the walk cycle, scene
 * crossfade, keepsake collection flight, journal page turn and ambient drift,
 * matching the pattern already used by app/peiwen-phase-one.tsx. JSX renders
 * only the static initial markup; the effect below owns every transition.
 */

const KEEPSAKE_LABEL: Record<ExperienceChapter["keepsake"], string> = {
  ticket: "metro ticket",
  ginkgo: "ginkgo leaf",
  sakura: "cherry blossom",
};

function keepsakeImg(key: ExperienceChapter["keepsake"], size: 64 | 180) {
  return `<img src="/assets/experience/keepsakes/${key}-${size}.webp" width="${size}" height="${size}" alt="">`;
}

const ICON_SVG: Record<ExperienceChapter["items"][number]["icon"], string> = {
  work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6h6v2"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.4A3.3 3.3 0 0 0 7 17z"/></svg>',
  vr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="9" rx="3"/><path d="M10 17l2-2 2 2"/><circle cx="8" cy="12.5" r="1.3"/><circle cx="16" cy="12.5" r="1.3"/></svg>',
};

const SPRIG_SVG = '<svg viewBox="0 0 16 22" fill="none" stroke="#7d8566" stroke-width="1.2" stroke-linecap="round"><path d="M8 21V3"/><path d="M8 8C5 7 3 5 3 2c3 0 5 2 5 5"/><path d="M8 13c3-1 5-3 5-6-3 0-5 2-5 5"/></svg>';

function pageHTML(c: ExperienceChapter): string {
  return `
    <div class="${styles.ticket}"><div class="${styles.ticketFrom}">${c.place}</div><div class="${styles.ticketDates}">${c.when}</div></div>
    <div class="${styles.keepsake}" aria-hidden="true">${keepsakeImg(c.keepsake, 180)}</div>
    <h2>${c.title}</h2><p class="${styles.pageMeta}">${c.meta}</p>
    <p class="${styles.pageDesc}">${c.desc}</p>
    <div class="${styles.during}">${SPRIG_SVG}What I did here</div>
    ${c.items
      .map(
        it => `<div class="${styles.item}"><div class="${styles.itemIcon}">${ICON_SVG[it.icon]}</div><div><h3>${it.heading}</h3><div class="${styles.itemRole}">${it.role}</div>
      <ul class="${styles.bullets}">${it.bullets.map(x => `<li>${x}</li>`).join("")}</ul></div></div>`,
      )
      .join("")}
    <p class="${styles.learnedNote}">${c.note}</p>`;
}

const WALK_FRAMES = [1, 2, 3, 4].map(n => `/assets/experience/walk/walk-0${n}.webp`);
const IDLE_FRAME = WALK_FRAMES[1];
const HOME_X = 40;

function sceneImage(id: string) {
  return `image-set(url(/assets/experience/scenes/${id}-1400.webp) 1x, url(/assets/experience/scenes/${id}-1499.webp) 2x)`;
}

const FLAKE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='17' fill='%23e3e8f2' fill-opacity='.35'/%3E%3Cg fill='none' stroke='%237f8698' stroke-width='1.35' stroke-linecap='round'%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(0 24 24)'/%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(60 24 24)'/%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(120 24 24)'/%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(180 24 24)'/%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(240 24 24)'/%3E%3Cpath d='M24 24V7 M24 12l-3.2-3.2 M24 12l3.2-3.2 M24 17.5l-2.4-2.4 M24 17.5l2.4-2.4' transform='rotate(300 24 24)'/%3E%3C/g%3E%3Ccircle cx='24' cy='24' r='2' fill='%23fff' stroke='%237f8698' stroke-width='1'/%3E%3C/svg%3E";
const PETAL_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M20 36C11 30 8 21 10 13c1.6-5 5-7.5 7.5-8 .8 1.8 1.6 2.6 2.5 2.6s1.7-.8 2.5-2.6c2.5.5 5.9 3 7.5 8 2 8-1 17-10 23z' fill='%23eec9c8' stroke='%238c6f6c' stroke-width='1.3' stroke-linejoin='round'/%3E%3Cpath d='M20 33c-1-6-1.5-12-.5-20' fill='none' stroke='%23c99a98' stroke-width='.9' stroke-linecap='round' opacity='.8'/%3E%3Cpath d='M13 15c2 1 3 2 3.5 4' fill='none' stroke='%23fff' stroke-width='1.2' stroke-linecap='round' opacity='.7'/%3E%3C/svg%3E";
const GINKGO_IMG = "/assets/experience/drift/ginkgo.webp";
const SAKURA_IMG = "/assets/experience/drift/sakura.webp";

const PRINT_SVG =
  '<svg viewBox="0 0 9 13"><path d="M4.5 .6c2.2 0 3.6 1.8 3.4 4.2-.2 2-1.4 3-3.4 3S1 6.8 1 4.8C1 2.4 2.3.6 4.5.6z" fill="#6b5a4a"/><path d="M2.2 9.4h4.6c.4 0 .7.3.7.7v1.3c0 .6-.5 1-1 1H2.5c-.6 0-1-.4-1-1v-1.3c0-.4.3-.7.7-.7z" fill="#6b5a4a"/></svg>';

type DriftLook = "dot" | "flake" | "bokeh" | "img";
type DriftLayer = {
  n: number;
  size: [number, number];
  vy: [number, number];
  sway: [number, number];
  spin: number;
  look: DriftLook;
  img?: () => string;
  op: [number, number];
  wind: number;
  front?: boolean;
  cls?: "far" | "mid" | "near";
  swing?: number;
  flutter?: number;
  spawn?: [number, number];
};

const DRIFT_KIND: Record<ExperienceChapter["drift"], DriftLayer[]> = {
  snow: [
    { n: 10, size: [4, 7], vy: [9, 16], sway: [5, 12], spin: 0, look: "dot", op: [0.75, 1], wind: 5 },
    { n: 4, size: [16, 24], vy: [14, 22], sway: [14, 26], spin: 22, look: "flake", op: [0.8, 0.95], wind: 8 },
    { n: 3, size: [12, 18], vy: [24, 34], sway: [10, 20], spin: 0, look: "bokeh", op: [0.55, 0.8], wind: 12, front: true },
  ],
  ginkgo: [
    { n: 3, size: [8, 11], vy: [14, 20], sway: [14, 22], spin: 0, look: "img", img: () => GINKGO_IMG, op: [0.55, 0.7], wind: 6, cls: "far", swing: 25, flutter: 0.6, spawn: [0.35, 1] },
    { n: 4, size: [15, 20], vy: [22, 32], sway: [26, 42], spin: 0, look: "img", img: () => GINKGO_IMG, op: [0.95, 1], wind: 10, cls: "mid", swing: 38, flutter: 1, spawn: [0.3, 1] },
    { n: 2, size: [24, 32], vy: [34, 46], sway: [30, 50], spin: 0, look: "img", img: () => GINKGO_IMG, op: [0.85, 0.95], wind: 16, cls: "near", swing: 45, flutter: 1.2, spawn: [0.1, 1], front: true },
  ],
  sakura: [
    { n: 5, size: [6, 9], vy: [12, 18], sway: [14, 24], spin: 90, look: "img", img: () => PETAL_SVG, op: [0.6, 0.75], wind: 10, cls: "far", swing: 0, flutter: 1.6, spawn: [0.3, 1] },
    { n: 5, size: [10, 14], vy: [18, 28], sway: [22, 40], spin: 120, look: "img", img: () => PETAL_SVG, op: [0.95, 1], wind: 16, cls: "mid", swing: 0, flutter: 2, spawn: [0.25, 1] },
    { n: 2, size: [16, 20], vy: [22, 30], sway: [24, 40], spin: 40, look: "img", img: () => SAKURA_IMG, op: [0.95, 1], wind: 12, cls: "mid", swing: 20, flutter: 0.8, spawn: [0.35, 1] },
    { n: 2, size: [18, 24], vy: [34, 44], sway: [30, 46], spin: 140, look: "img", img: () => PETAL_SVG, op: [0.8, 0.9], wind: 22, cls: "near", swing: 0, flutter: 2.2, spawn: [0.1, 1], front: true },
  ],
};

const LOOK_CLASS: Record<DriftLook, string> = {
  dot: styles.driftDot,
  flake: styles.driftFlake,
  bokeh: styles.driftBokeh,
  img: styles.driftImg,
};
const CLS_CLASS: Record<"far" | "mid" | "near", string> = {
  far: styles.driftImgFar,
  mid: "",
  near: styles.driftImgNear,
};

type Particle = {
  el: HTMLElement;
  sp: [number, number];
  x: number;
  y: number;
  vy: number;
  vx: number;
  amp: number;
  ph: number;
  f: number;
  rot: number;
  vr: number;
  op: number;
  swing: number;
  fl: number;
  fph: number;
};

export default function ExperiencePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;

    const stageEl = root.querySelector<HTMLElement>("[data-stage]")!;
    const leftcol = root.querySelector<HTMLElement>("[data-leftcol]")!;
    const sceneA = root.querySelector<HTMLElement>('[data-scene="a"]')!;
    const sceneB = root.querySelector<HTMLElement>('[data-scene="b"]')!;
    const driftBack = root.querySelector<HTMLElement>('[data-drift="back"]')!;
    const driftFront = root.querySelector<HTMLElement>('[data-drift="front"]')!;
    const shadowEl = root.querySelector<HTMLElement>("[data-shadow]")!;
    const pw = root.querySelector<HTMLElement>("[data-peiwen]")!;
    const foundEl = root.querySelector<HTMLElement>("[data-found]")!;
    const shelfList = root.querySelector<HTMLOListElement>("[data-shelf]")!;
    const countEl = root.querySelector<HTMLElement>("[data-count]")!;
    const prevBtn = root.querySelector<HTMLButtonElement>("[data-prev]")!;
    const nextBtn = root.querySelector<HTMLButtonElement>("[data-next]")!;
    const pageEl = root.querySelector<HTMLElement>("[data-page]")!;

    let front = sceneA;
    let back = sceneB;
    let idx = 0;
    let busy = false;
    const got = new Set<number>([0]);

    function paintShelf() {
      [...shelfList.children].forEach((li, i) => {
        const isGot = got.has(i);
        const isHere = i === idx;
        li.classList.toggle(styles.shelfItemGot, isGot);
        li.classList.toggle(styles.shelfItemHere, isHere);
        const btn = li.querySelector("button")!;
        btn.dataset.got = String(isGot);
        btn.dataset.here = String(isHere);
        btn.setAttribute("aria-current", isHere ? "step" : "false");
      });
      countEl.textContent = `${got.size} of ${chapters.length} kept`;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === chapters.length - 1;
    }

    /* walker */
    let f = 0;
    let acc = 0;
    function frameStep(dt: number) {
      acc += dt;
      if (acc > 150) {
        acc = 0;
        f = (f + 1) % 4;
        pw.style.backgroundImage = `url(${WALK_FRAMES[f]})`;
      }
    }
    function idle() {
      pw.style.backgroundImage = `url(${IDLE_FRAME})`;
    }
    function setFeet(c: ExperienceChapter) {
      const b = `${c.feet ?? 10}%`;
      pw.style.bottom = b;
      shadowEl.style.bottom = `calc(${b} - .5%)`;
    }
    function setX(x: number) {
      pw.style.left = `${x}%`;
      shadowEl.style.left = `calc(${x}% + ${pw.offsetWidth * 0.18}px)`;
    }
    function walk(from: number, to: number, ms: number): Promise<void> {
      return new Promise(resolve => {
        if (reduce) {
          setX(to);
          resolve();
          return;
        }
        pw.classList.toggle(styles.peiwenFlip, to < from);
        const t0 = performance.now();
        let last = t0;
        function tick(now: number) {
          const k = Math.min(1, (now - t0) / ms);
          setX(from + (to - from) * k);
          frameStep(now - last);
          last = now;
          if (k < 1) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
    }

    /* keepsake flies from her feet into its slot */
    function collect(i: number): Promise<void> {
      return new Promise(resolve => {
        const first = !got.has(i);
        got.add(i);
        if (!first || reduce) {
          paintShelf();
          resolve();
          return;
        }
        const s = leftcol.getBoundingClientRect();
        const p = pw.getBoundingClientRect();
        const slotEl = shelfList.children[i].querySelector<HTMLElement>(`.${styles.slot}`)!;
        const slot = slotEl.getBoundingClientRect();
        foundEl.innerHTML = keepsakeImg(chapters[i].keepsake, 64);
        const x0 = p.left - s.left + p.width * 0.75;
        const y0 = p.bottom - s.top - 30;
        const x1 = slot.left - s.left + slot.width / 2 - 26;
        const y1 = slot.top - s.top + slot.height / 2 - 26;
        const anim = foundEl.animate(
          [
            { transform: `translate(${x0}px,${y0}px) scale(.3)`, opacity: 0 },
            { transform: `translate(${x0}px,${y0 - 40}px) scale(1)`, opacity: 1, offset: 0.3 },
            { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 70}px) scale(1.1) rotate(-20deg)`, opacity: 1, offset: 0.6 },
            { transform: `translate(${x1}px,${y1}px) scale(1) rotate(-8deg)`, opacity: 1 },
          ],
          { duration: 1100, easing: "cubic-bezier(.45,0,.35,1)", fill: "forwards" },
        );
        anim.onfinish = () => {
          paintShelf();
          foundEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
          resolve();
        };
      });
    }

    /* ---------- ambient drift ---------- */
    let parts: Particle[] = [];
    let raf = 0;
    let last = 0;
    let W = 0;
    let H = 0;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    function makeDrift(k: ExperienceChapter["drift"] | null) {
      driftBack.innerHTML = "";
      driftFront.innerHTML = "";
      parts = [];
      if (!k || reduce) return;
      W = driftBack.clientWidth;
      H = driftBack.clientHeight;
      let particleIdx = 0;
      for (const layer of DRIFT_KIND[k]) {
        for (let i = 0; i < layer.n; i++, particleIdx++) {
          const el = document.createElement("i");
          const sz = rnd(...layer.size);
          el.className = [styles.driftParticle, LOOK_CLASS[layer.look], layer.cls ? CLS_CLASS[layer.cls] : ""].filter(Boolean).join(" ");
          el.style.width = el.style.height = `${sz}px`;
          if (layer.look === "img") el.style.backgroundImage = `url(${layer.img!()})`;
          if (layer.look === "flake") el.style.backgroundImage = `url(${FLAKE_SVG})`;
          const inFront = layer.front || (layer.look === "img" && particleIdx % 4 === 0);
          (inFront ? driftFront : driftBack).appendChild(el);
          const depth = (sz - layer.size[0]) / (layer.size[1] - layer.size[0] || 1);
          const sp = layer.spawn || [0, 1];
          parts.push({
            el,
            sp,
            x: rnd(sp[0] * W, sp[1] * W),
            y: rnd(-H * 0.15, H),
            vy: rnd(...layer.vy) * (0.75 + depth * 0.4),
            vx: layer.wind * (0.6 + depth * 0.6),
            amp: rnd(...layer.sway),
            ph: rnd(0, 6.28),
            f: rnd(0.35, 0.8),
            rot: rnd(0, 360),
            vr: rnd(-1, 1) * layer.spin,
            op: rnd(...layer.op),
            swing: layer.swing || 0,
            fl: (layer.flutter || 0) * rnd(0.7, 1.3),
            fph: rnd(0, 6.28),
          });
        }
      }
    }
    function tickDrift(now: number) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      for (const p of parts) {
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        p.ph += p.f * dt;
        p.rot += p.vr * dt;
        if (p.y > H * 0.96) {
          p.y = -30;
          p.x = rnd(p.sp[0] * W - 40, p.sp[1] * W);
        }
        if (p.x > W + 30) p.x = -30;
        const x = p.x + Math.sin(p.ph) * p.amp;
        const t = p.y / H;
        const fade = Math.min(1, Math.max(0, (t + 0.05) / 0.18)) * Math.min(1, Math.max(0, (0.96 - t) / 0.16));
        p.fph += p.fl * dt;
        const tilt = p.rot + p.swing * Math.cos(p.ph);
        const turn = p.fl ? Math.cos(p.fph * 2) : 1;
        const sx = p.fl ? (Math.abs(turn) * 0.75 + 0.25) * Math.sign(turn || 1) : 1;
        p.el.style.transform = `translate(${x}px,${p.y}px) rotate(${tilt}deg) scaleX(${sx.toFixed(3)})`;
        p.el.style.opacity = (p.op * fade).toFixed(3);
      }
      raf = requestAnimationFrame(tickDrift);
    }
    let driftSwitchTimer: ReturnType<typeof setTimeout> | undefined;
    function setDrift(k: ExperienceChapter["drift"]) {
      driftBack.classList.add(styles.driftOff);
      driftFront.classList.add(styles.driftOff);
      clearTimeout(driftSwitchTimer);
      driftSwitchTimer = setTimeout(
        () => {
          makeDrift(k);
          driftBack.classList.remove(styles.driftOff);
          driftFront.classList.remove(styles.driftOff);
        },
        reduce ? 0 : 450,
      );
    }
    function startDrift() {
      if (!reduce && !raf) {
        last = 0;
        raf = requestAnimationFrame(tickDrift);
      }
    }
    function stopDrift() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVisibility() {
      if (document.hidden) stopDrift();
      else startDrift();
    }
    function onResize() {
      W = driftBack.clientWidth;
      H = driftBack.clientHeight;
    }
    document.addEventListener("visibilitychange", onVisibility);
    addEventListener("resize", onResize);

    /* ---------- chapter transition ---------- */
    async function go(n: number) {
      if (busy || n === idx || n < 0 || n >= chapters.length) return;
      busy = true;
      const dir = n > idx ? 1 : -1;
      await walk(HOME_X, dir > 0 ? 104 : -24, 1000);
      pageEl.classList.add(styles.pageTurning);
      back.style.transition = "none";
      back.className = [styles.scene, styles.sceneFinal, dir > 0 ? styles.sceneOutRight : styles.sceneOutLeft].join(" ");
      back.style.backgroundImage = sceneImage(chapters[n].id);
      back.style.backgroundPosition = "center 62%";
      setFeet(chapters[n]);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      back.offsetWidth;
      back.style.transition = "";
      front.className = [styles.scene, styles.sceneFinal, dir > 0 ? styles.sceneOutLeft : styles.sceneOutRight].join(" ");
      back.className = [styles.scene, styles.sceneFinal].join(" ");
      [front, back] = [back, front];
      idx = n;
      paintShelf();
      setDrift(chapters[n].drift);
      setTimeout(
        () => {
          pageEl.innerHTML = pageHTML(chapters[n]);
          pageEl.classList.remove(styles.pageTurning);
        },
        reduce ? 0 : 560,
      );
      if (!reduce) await new Promise(r => setTimeout(r, 650));
      await walk(dir > 0 ? -24 : 104, HOME_X, 1100);
      pw.classList.remove(styles.peiwenFlip);
      idle();
      await collect(n);
      busy = false;
    }

    /* ---------- pencil feedback: click rings + footprints (mouse only) ---------- */
    let cleanupPointer = () => {};
    if (!reduce && finePointer) {
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 34 34");
        svg.setAttribute("class", styles.inkRing);
        const r = 9 + Math.random() * 2;
        svg.innerHTML = `<path pathLength="100" d="M${17 + r} 17.5 C${17 + r} ${17 - r * 1.1} ${17 - r} ${17 - r * 1.05} ${17 - r} 16.5 S${17 + r * 0.9} ${17 + r * 1.2} ${17 + r * 1.05} 15"/>`;
        svg.style.transform = `translate(${e.clientX}px,${e.clientY}px) rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(svg);
        const path = svg.firstChild as SVGPathElement;
        path.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: 260, easing: "ease-out", fill: "forwards" });
        svg.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 700, fill: "forwards" }).onfinish = () => svg.remove();
      };
      let trail: { x: number; y: number; t: number }[] = [];
      let restTimer: ReturnType<typeof setTimeout> | undefined;
      let lastPrint = 0;
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const b = stageEl.getBoundingClientRect();
        const pt = { x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now() };
        const prev = trail[trail.length - 1];
        if (!prev || Math.hypot(pt.x - prev.x, pt.y - prev.y) > 22) {
          trail.push(pt);
          if (trail.length > 6) trail.shift();
        }
        clearTimeout(restTimer);
        restTimer = setTimeout(() => {
          const now = performance.now();
          if (now - lastPrint < 1200 || trail.length < 3) return;
          lastPrint = now;
          const pts = trail.slice(-4, -1);
          pts.forEach((p, i) => {
            const q = trail[trail.indexOf(p) + 1] || p;
            const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90;
            const side = i % 2 ? 4 : -4;
            const el = document.createElement("div");
            el.className = styles.step;
            el.innerHTML = PRINT_SVG;
            const nx = Math.cos((ang * Math.PI) / 180) * side;
            const ny = Math.sin((ang * Math.PI) / 180) * side;
            el.style.transform = `translate(${p.x + nx - 4.5}px,${p.y + ny - 6.5}px) rotate(${ang}deg)`;
            el.style.left = "0";
            el.style.top = "0";
            stageEl.appendChild(el);
            el.animate([{ opacity: 0 }, { opacity: 0.45, offset: 0.2 }, { opacity: 0.45, offset: 0.6 }, { opacity: 0 }], { duration: 1600, delay: i * 140, fill: "forwards" }).onfinish = () =>
              el.remove();
          });
          trail = [];
        }, 260);
      };
      const onPointerLeave = () => {
        clearTimeout(restTimer);
        trail = [];
      };
      addEventListener("pointerdown", onPointerDown);
      stageEl.addEventListener("pointermove", onPointerMove);
      stageEl.addEventListener("pointerleave", onPointerLeave);
      cleanupPointer = () => {
        clearTimeout(restTimer);
        removeEventListener("pointerdown", onPointerDown);
        stageEl.removeEventListener("pointermove", onPointerMove);
        stageEl.removeEventListener("pointerleave", onPointerLeave);
      };
    }

    /* ---------- initial paint. SSR already painted the chapter-0 scene/peiwen so there is
       no flash before hydration; this corrects the shadow's sub-pixel offset (needs a real
       layout measurement) and brings drift/shelf state in sync. ---------- */
    setFeet(chapters[0]);
    setX(HOME_X);
    paintShelf();
    setDrift(chapters[0].drift);
    startDrift();

    /* ---------- navigation wiring ---------- */
    const onPrev = () => go(idx - 1);
    const onNext = () => go(idx + 1);
    prevBtn.addEventListener("click", onPrev);
    nextBtn.addEventListener("click", onNext);
    [...shelfList.querySelectorAll<HTMLButtonElement>("button")].forEach((b, i) => b.addEventListener("click", () => go(i)));
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    addEventListener("keydown", onKeydown);
    let sx: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (sx == null) return;
      const d = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(d) > 40) go(idx + (d < 0 ? 1 : -1));
    };
    stageEl.addEventListener("touchstart", onTouchStart, { passive: true });
    stageEl.addEventListener("touchend", onTouchEnd);

    return () => {
      stopDrift();
      clearTimeout(driftSwitchTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("resize", onResize);
      removeEventListener("keydown", onKeydown);
      prevBtn.removeEventListener("click", onPrev);
      nextBtn.removeEventListener("click", onNext);
      stageEl.removeEventListener("touchstart", onTouchStart);
      stageEl.removeEventListener("touchend", onTouchEnd);
      cleanupPointer();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} tabIndex={0}>
      {/* First-screen scene only: the other two chapters' art loads lazily, the moment
          go() assigns it as a background-image during a chapter transition. */}
      <link rel="preload" as="image" href={`/assets/experience/scenes/${chapters[0].id}-1400.webp`} />
      <a className={styles.skipLink} href="#experience-content">
        Skip to content
      </a>
      <header className={styles.siteHeader}>
        <Link className={styles.brand} href="/" aria-label="Peiwen Zhang home">
          <svg viewBox="0 0 22 34" fill="none" stroke="#7d8566" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
            <path d="M11 33V5" />
            <path d="M11 12c-4-1-7-4-7-8 4 0 7 3 7 7" />
            <path d="M11 18c4-1 7-4 7-8-4 0-7 3-7 7" />
            <path d="M11 25c-4-1-7-4-7-8 4 0 7 3 7 7" />
            <path d="M11 9c2-2 3-4 3-7-2 1-3 3-3 6" />
          </svg>
          <span>
            <span className={styles.brandName}>Peiwen Zhang</span>
            <span className={styles.brandRole}>HCI · PRODUCT · CREATIVE TECH</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <Link className={styles.drawU} href="/">
            Home
          </Link>
          <Link className={`${styles.drawU} ${styles.navCurrent}`} href="/experience" aria-current="page">
            Experience
          </Link>
          <Link className={styles.drawU} href="/#projects" scroll={false}>
            Projects
          </Link>
          <Link className={styles.drawU} href="/#playground" scroll={false}>
            Playground
          </Link>
          <Link className={styles.drawU} href="/about">
            About
          </Link>
        </nav>
        <div className={styles.lang}>
          中 / <span>EN</span>
        </div>
      </header>

      <main id="experience-content">
        <div className={styles.intro}>
          <h1>{intro.heading}</h1>
          <ul className={styles.stickers}>
            {intro.stickers.map(s => (
              <li key={s.label} className={s.tone === "blue" ? styles.stickerBlue : s.tone === "butter" ? styles.stickerButter : styles.stickerRose}>
                {s.label}
              </li>
            ))}
          </ul>
          <ul className={styles.facts}>
            {intro.facts.map(fact => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className={styles.grid}>
          <div data-leftcol className={styles.leftcol}>
            <div data-found className={styles.found} aria-hidden="true" />
            <div data-stage className={styles.stage}>
              <div
                data-scene="a"
                className={`${styles.scene} ${styles.sceneFinal}`}
                style={{ backgroundImage: sceneImage(chapters[0].id), backgroundPosition: "center 62%" }}
              />
              <div data-scene="b" className={`${styles.scene} ${styles.sceneOutRight}`} />
              <div data-drift="back" className={styles.drift} aria-hidden="true" />
              <div data-shadow className={styles.shadow} style={{ bottom: `calc(${chapters[0].feet}% - .5%)`, left: `${HOME_X}%` }} />
              <div
                data-peiwen
                className={styles.peiwen}
                role="img"
                aria-label="Peiwen walking"
                style={{ backgroundImage: `url(${IDLE_FRAME})`, bottom: `${chapters[0].feet}%`, left: `${HOME_X}%` }}
              />
              <div data-drift="front" className={`${styles.drift} ${styles.driftFront}`} aria-hidden="true" />
            </div>

            <nav className={styles.shelf} aria-label="Places, most recent first">
              <div className={styles.shelfHead}>
                <span>Along the way</span>
                <em data-count>1 of {chapters.length}</em>
              </div>
              <ol data-shelf className={styles.shelfList}>
                {chapters.map((c, i) => (
                  <li key={c.id} className={i === 0 ? styles.shelfItemHere + " " + styles.shelfItemGot : ""}>
                    <button
                      type="button"
                      data-got={i === 0 ? "true" : "false"}
                      data-here={i === 0 ? "true" : "false"}
                      aria-current={i === 0 ? "step" : "false"}
                      aria-label={`Walk to ${c.place}, where I picked up a ${KEEPSAKE_LABEL[c.keepsake]}`}
                    >
                      <span className={styles.slot}>
                        <img src={`/assets/experience/keepsakes/${c.keepsake}-64.webp`} width={44} height={44} alt="" />
                      </span>
                      <span className={styles.place}>
                        <span className={styles.drawU}>{c.city}</span>
                      </span>
                      <span className={styles.when}>{c.year}</span>
                      <span className={styles.learned}>{c.learned}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={styles.arrows}>
              <button type="button" data-prev disabled aria-label="Walk to the previous place">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M11 3 5 9l6 6" />
                </svg>
              </button>
              <span className={styles.walkHint}>
                <span className={styles.hintDesk}>← → to walk, or tap a keepsake</span>
                <span className={styles.hintTouch}>Swipe, or tap a keepsake</span>
              </span>
              <button type="button" data-next aria-label="Walk to the next place">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="m7 3 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.pageWrap}>
            <article data-page className={styles.page} aria-live="polite" dangerouslySetInnerHTML={{ __html: pageHTML(chapters[0]) }} />
          </div>
        </div>
        <div className={styles.footnotes}>
          <span>Explore at your own pace.</span>
          <span>More to come…</span>
        </div>
      </main>
    </div>
  );
}
