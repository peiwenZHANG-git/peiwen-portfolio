"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/lib/projectsData";
import ProjectCard from "./project-card";
import ProjectPreview, { type Selection } from "./project-preview";
import { slotProps } from "./slots";
import { lowerRope, lowerSlope, upperRope, upperRopeFibres, upperRopePath, upperSlope } from "./rope-math";
import styles from "./projects.module.css";

export default function ProjectClothesline({ rope }: { rope: "featured" | "smaller" }) {
  const viewport = useRef<HTMLDivElement>(null);
  const stop = useRef(() => {});
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const element = viewport.current!;
    let drag: { id: number; x: number; time: number; velocity: number; distance: number } | null = null;
    let frame = 0;
    let suppressClick = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    stop.current = () => cancelAnimationFrame(frame);

    // Resistance: the rope drags a little behind the pointer, stretches (rubber-bands) at the ends and eases back.
    const track = element.firstElementChild as HTMLElement;
    let raw = 0;
    const maxScroll = () => Math.max(0, element.scrollWidth - element.clientWidth);
    const rubber = (d: number) => Math.sign(d) * Math.min(170, (Math.abs(d) * 0.5) / (1 + Math.abs(d) / 320));
    function setOver(over: number) {
      element.dataset.over = String(over);
      track.style.transform = over ? `translateX(${-over}px)` : "";
      element.dispatchEvent(new Event("scroll"));
    }
    function settle() {
      let last = performance.now();
      function step(now: number) {
        const dt = Math.min(now - last, 32);
        last = now;
        const over = Number(element.dataset.over || 0) * Math.pow(0.92, dt / 16);
        if (Math.abs(over) < 0.3) { setOver(0); return; }
        setOver(over);
        frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    }

    function down(event: PointerEvent) {
      cancelAnimationFrame(frame);
      suppressClick = false;
      // Native touch scrolling supplies bounded swipe and platform inertia.
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, time: event.timeStamp, velocity: 0, distance: 0 };
      raw = element.scrollLeft + Number(element.dataset.over || 0);
    }
    function move(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      drag.distance += Math.abs(dx);
      if (drag.distance > 5) {
        element.setPointerCapture(event.pointerId);
        element.dataset.dragging = "true";
        suppressClick = true;
        const pull = dx * 0.68;
        raw -= pull;
        const limit = maxScroll();
        element.scrollLeft = Math.max(0, Math.min(limit, raw));
        setOver(raw < 0 ? rubber(raw) : raw > limit ? rubber(raw - limit) : 0);
        drag.velocity = -pull / Math.max(1, event.timeStamp - drag.time);
      }
      drag.x = event.clientX;
      drag.time = event.timeStamp;
    }
    function up(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.id) return;
      const velocity = event.timeStamp - drag.time > 90 ? 0 : drag.velocity;
      if (element.hasPointerCapture(drag.id)) element.releasePointerCapture(drag.id);
      drag = null;
      delete element.dataset.dragging;
      if (Number(element.dataset.over || 0) !== 0) { settle(); return; }
      if (event.type === "pointercancel" || reduced.matches) return;
      let speed = Math.max(-1.2, Math.min(1.2, velocity));
      let last = performance.now();
      function coast(now: number) {
        const dt = Math.min(now - last, 32);
        const previous = element.scrollLeft;
        element.scrollLeft += speed * dt;
        speed *= Math.pow(0.86, dt / 16);
        last = now;
        if (Math.abs(speed) > 0.025 && element.scrollLeft !== previous) frame = requestAnimationFrame(coast);
      }
      frame = requestAnimationFrame(coast);
    }
    function click(event: MouseEvent) {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    }
    function wheel() { cancelAnimationFrame(frame); }
    function key(event: KeyboardEvent) {
      suppressClick = false;
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      cancelAnimationFrame(frame);
      const left = event.key === "Home" ? 0 : event.key === "End" ? element.scrollWidth : element.scrollLeft + (event.key === "ArrowRight" ? 260 : -260);
      element.scrollTo({ left, behavior: reduced.matches ? "instant" : "smooth" });
    }
    // Dragging must never select or pick up the artwork (no blue selection boxes, no browser image actions).
    const block = (event: Event) => event.preventDefault();
    element.addEventListener("selectstart", block);
    element.addEventListener("dragstart", block);
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    element.addEventListener("click", click, true);
    element.addEventListener("wheel", wheel, { passive: true });
    element.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("selectstart", block);
      element.removeEventListener("dragstart", block);
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      element.removeEventListener("click", click, true);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("keydown", key);
    };
  }, []);

  useEffect(() => {
    // Arrow buttons scroll both ropes together (desktop only).
    const element = viewport.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function go(event: Event) {
      const stageBox = element.closest("[data-stage]")?.getBoundingClientRect();
      if (!stageBox || window.innerWidth < 720) return;
      stop.current();
      element.scrollBy({ left: (event as CustomEvent<number>).detail * 380 * (stageBox.width / 1448), behavior: reduced.matches ? "instant" : "smooth" });
    }
    window.addEventListener("projects-scroll", go);
    return () => window.removeEventListener("projects-scroll", go);
  }, []);

  useLayoutEffect(() => {
    const element = viewport.current!;
    const svg = element.querySelector<SVGSVGElement>("svg[data-rope-line]");
    const papers = [...element.querySelectorAll<HTMLElement>("[data-piece]")];
    const items = [...element.querySelectorAll<HTMLElement>("[data-slot]")];
    const stage = element.closest<HTMLElement>("[data-stage]");
    const wide = matchMedia("(min-width: 720px)");
    // Desktop: papers ride the rope in illustration units. The viewport's top edge is 165 / 520 (see CSS).
    const ropeY = rope === "featured" ? upperRope : lowerRope;
    const ropeSlope = rope === "featured" ? upperSlope : lowerSlope;
    const origin = rope === "featured" ? 165 : 520;
    // The upper rope is a springy string: dragging loads it (it sags) and letting go makes it bounce.
    const springs = { a: 0, w: 0, a2: 0, w2: 0, lastVelocity: 0, drawn: 0 };
    const bend = (x: number) => {
      const s = Math.min(1, Math.max(0, (x + 10) / 1468));
      return springs.a * Math.sin(Math.PI * s) + springs.a2 * Math.sin(2 * Math.PI * s);
    };
    const bendSlope = (x: number) => {
      const s = Math.min(1, Math.max(0, (x + 10) / 1468));
      return ((springs.a * Math.PI) * Math.cos(Math.PI * s) + (springs.a2 * 2 * Math.PI) * Math.cos(2 * Math.PI * s)) / 1468;
    };
    const rope$ = (name: string) => element.parentElement!.querySelector<SVGPathElement>(`path[data-rope-path="${name}"]`);
    const ropeNodes = rope === "featured"
      ? ([["shadow", 3.2], ["body", 0], ["knots", 0.1], ["light", -0.8]] as const).map(([name, offset]) => ({ node: rope$(name), offset }))
      : [];
    const fibreNode = rope === "featured" ? rope$("fibres") : null;
    function drawRope() {
      if (rope !== "featured") return;
      const bent = Math.abs(springs.a) + Math.abs(springs.a2);
      if (bent < 0.02 && springs.drawn < 0.02) return;
      springs.drawn = bent;
      for (const { node, offset } of ropeNodes) node?.setAttribute("d", upperRopePath(offset, 0, 7, 0, bend, 6));
      fibreNode?.setAttribute("d", upperRopeFibres(bend));
    }
    const PILE_AT = 830; // where bunched-up papers rest against the post
    const PILE_SOFT = 55;
    const angle = (x: number) => Math.atan(ropeSlope(x)) * 180 / Math.PI;

    // Papers swing on their clips like real pegged paper: dragging the rope kicks each one and it settles back.
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const swing = items.map((_, index) => ({ a: 0, w: 0, omega: 0.0085 + ((index * 37) % 11) * 0.0004 }));
    let lastScroll = element.scrollLeft + Number(element.dataset.over || 0);
    let lastTime = 0;
    let frame = 0;

    function place() {
      if (!wide.matches || !stage) return;
      const u = stage.getBoundingClientRect().width / 1448;
      if (!u) return;
      const scrolled = (element.scrollLeft + Number(element.dataset.over || 0)) / u;
      items.forEach((item, index) => {
        const x0 = Number(item.dataset.x);
        let x = x0 - scrolled;
        let shift = 0;
        let jitter = 0;
        if (rope === "smaller" && x < PILE_AT) {
          // The lower rope is tied to the window post: papers pushed that far bunch up against it instead of vanishing.
          const p = 1 - Math.exp((x - PILE_AT) / PILE_SOFT);
          const squashed = PILE_AT - PILE_SOFT * p + (((index * 7) % 13) - 6) * 1.6 * p;
          shift = squashed - x;
          jitter = (((index * 5) % 7) - 3) * 1.4 * p;
          x = squashed;
        }
        item.style.setProperty("--rx", shift.toFixed(2));
        const bendY = rope === "featured" ? bend(x) : 0;
        const bendAngle = rope === "featured" ? Math.atan(bendSlope(x)) * 180 / Math.PI : 0;
        item.style.setProperty("--ry", (ropeY(x) + bendY + Number(item.dataset.dy) - origin).toFixed(2));
        item.style.setProperty("--rot", (Number(item.dataset.rot) + 0.5 * (angle(x) - angle(x0) + bendAngle) + jitter + swing[index].a).toFixed(2));
      });
      drawRope();
    }
    function tick(now: number) {
      const dt = Math.max(1, Math.min(32, now - lastTime));
      lastTime = now;
      const u = (stage?.getBoundingClientRect().width ?? 1448) / 1448;
      const position = element.scrollLeft + Number(element.dataset.over || 0);
      const velocity = (position - lastScroll) / u / dt; // illustration units per ms, + = papers move left
      lastScroll = position;
      const target = Math.max(-10, Math.min(10, -velocity * 3));
      let moving = Math.abs(velocity) > 0.002;
      for (const s of swing) {
        const k = s.omega * s.omega;
        s.w += (k * (target - s.a) - 2 * 0.5 * s.omega * s.w) * dt;
        s.a += s.w * dt;
        if (Math.abs(s.a) > 0.03 || Math.abs(s.w) > 0.0003) moving = true; else { s.a = 0; s.w = 0; }
      }
      if (rope === "featured" && !reduced.matches) {
        const overshoot = Math.abs(Number(element.dataset.over || 0));
        const acceleration = velocity - springs.lastVelocity;
        springs.lastVelocity = velocity;
        const load = Math.min(5, Math.abs(velocity) * 3.5 + overshoot * 0.03);
        const k1 = 0.013 * 0.013;
        springs.w += (k1 * (load - springs.a) - 2 * 0.25 * 0.013 * springs.w) * dt;
        springs.a += springs.w * dt;
        const k2 = 0.021 * 0.021;
        springs.w2 += (k2 * (0 - springs.a2) - 2 * 0.25 * 0.021 * springs.w2) * dt + acceleration * 0.2;
        springs.a2 += springs.w2 * dt;
        if (Math.abs(springs.a) > 0.05 || Math.abs(springs.w) > 0.0005 || Math.abs(springs.a2) > 0.05 || Math.abs(springs.w2) > 0.0005) moving = true;
        else { springs.a = springs.w = springs.a2 = springs.w2 = 0; }
      }
      place();
      frame = moving ? requestAnimationFrame(tick) : 0;
    }
    function onScroll() {
      place();
      if (!frame && !reduced.matches && wide.matches) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
    }

    // Mobile: hang each paper from the drawn SVG rope (quadratic curve y = 8 + 220 t (1 - t) in a 160-unit viewBox).
    function hang() {
      place();
      if (wide.matches || !svg) return;
      const line = svg.getBoundingClientRect();
      if (!line.width) return;
      const scale = line.height / 160;
      papers.forEach(paper => {
        const clip = paper.querySelector("svg")!.getBoundingClientRect();
        const t = Math.max(0, Math.min(1, (clip.left + clip.width / 2 - line.left) / line.width));
        const ropeLineY = line.top + (8 + 220 * t * (1 - t)) * scale;
        const margin = parseFloat(getComputedStyle(paper).marginTop) || 0;
        paper.style.setProperty("--rope-drop", `${margin + ropeLineY - 2 - clip.top}px`);
      });
    }
    const observer = new ResizeObserver(hang);
    observer.observe(element.firstElementChild!);
    if (stage) observer.observe(stage);
    element.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", hang);
    window.addEventListener("resize", hang);
    document.fonts?.ready.then(hang);
    hang();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      wide.removeEventListener("change", hang);
      window.removeEventListener("resize", hang);
    };
  }, [rope]);

  return (
    <>
      <section className={`${styles.clothesline} ${rope === "smaller" ? styles.smallerLine : ""}`} aria-label={rope === "featured" ? "Featured projects" : "Smaller projects"} data-rope={rope}>
        {rope === "featured" && <svg className={styles.stageRope} viewBox="0 0 1448 1086" preserveAspectRatio="none" aria-hidden="true">
          <path data-rope-path="shadow" className={styles.ropeShadow} d={upperRopePath(3.2)} />
          <path data-rope-path="body" className={styles.ropeBody} d={upperRopePath()} />
          <path data-rope-path="knots" className={styles.ropeKnots} d={upperRopePath(0.1)} />
          <path data-rope-path="light" className={styles.ropeLight} d={upperRopePath(-0.8)} />
          <path data-rope-path="fibres" className={styles.ropeFibres} d={upperRopeFibres()} />
        </svg>}
        <div ref={viewport} className={styles.viewport} tabIndex={0} aria-label={`${rope === "featured" ? "Featured" : "Smaller"} projects. Drag, swipe, or use left and right arrow keys.`}>
          <div className={styles.track}>
            <svg className={styles.rope} data-rope-line viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 8 Q500 118 1000 8" />
              <path d="M0 9 Q500 119 1000 9" />
            </svg>
            {rope === "featured" && <Decor name="sprig" src="botanical" only="desktop" />}
            {rope === "featured" && <Decor name="edge" src="botanical" only="desktop" />}
            {projects.filter((project) => project.rope === rope).map((project, index) => <Fragment key={project.id}>
              <ProjectCard project={project} onOpen={(project, source) => { stop.current(); setSelection({ project, source }); }} />
              {rope === "smaller" && <Decor name={["botanical", "flowers", "peiwen"][index]} src={["botanical", "flowers", "peiwen"][index]} />}
              {rope === "featured" && index === 2 && <Decor name="cat" src="cat" only="desktop" />}
            </Fragment>)}
            {rope === "smaller" && <Decor name="wip" src="wip" />}
          </div>
        </div>
      </section>
      {selection && <ProjectPreview selection={selection} onClose={() => setSelection(null)} />}
    </>
  );
}

function Decor({ name, src, only }: { name: string; src: string; only?: "desktop" }) {
  return (
    <span className={`${styles.decoration} ${only ? styles.desktopOnly : ""}`} aria-hidden="true" {...slotProps(`decor:${name}`)}>
      <Image src={`/assets/projects/attic-${src}.webp`} alt="" fill sizes="140px" draggable={false} />
    </span>
  );
}
