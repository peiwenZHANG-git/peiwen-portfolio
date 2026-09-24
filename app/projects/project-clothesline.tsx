"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/lib/projectsData";
import ProjectCard from "./project-card";
import ProjectPreview, { type Selection } from "./project-preview";
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

    function down(event: PointerEvent) {
      cancelAnimationFrame(frame);
      suppressClick = false;
      // Native touch scrolling supplies bounded swipe and platform inertia.
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, time: event.timeStamp, velocity: 0, distance: 0 };
    }
    function move(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      drag.distance += Math.abs(dx);
      if (drag.distance > 5) {
        element.setPointerCapture(event.pointerId);
        element.dataset.dragging = "true";
        suppressClick = true;
        element.scrollLeft -= dx;
        drag.velocity = -dx / Math.max(1, event.timeStamp - drag.time);
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
      if (event.type === "pointercancel" || reduced.matches) return;
      let speed = Math.max(-2.5, Math.min(2.5, velocity));
      let last = performance.now();
      function coast(now: number) {
        const dt = Math.min(now - last, 32);
        const previous = element.scrollLeft;
        element.scrollLeft += speed * dt;
        speed *= Math.pow(0.92, dt / 16);
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
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    element.addEventListener("click", click, true);
    element.addEventListener("wheel", wheel, { passive: true });
    element.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
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
    if (rope !== "smaller") return;
    const element = viewport.current!;
    const scene = element.closest("main")!;
    const track = element.firstElementChild as HTMLElement;
    const papers = [...element.querySelectorAll<HTMLElement>("[data-piece]")];
    function alignPapers() {
      if (window.innerWidth < 720) {
        papers.forEach(paper => paper.style.removeProperty("--rope-drop"));
        return;
      }
      const bounds = scene.getBoundingClientRect();
      const scale = Math.max(bounds.width / 1448, bounds.height / 1086);
      const imageLeft = bounds.left + (bounds.width - 1448 * scale) / 2;
      const imageTop = bounds.top + (bounds.height - 1086 * scale) / 2;
      const baseline = track.getBoundingClientRect().top + parseFloat(getComputedStyle(track).paddingTop);
      // Trace the painted lower rope in the original 1448 x 1086 background.
      const drops = papers.map(paper => {
        const clip = paper.querySelector("svg")!.getBoundingClientRect();
        const x = (clip.left + clip.width / 2 - imageLeft) / scale;
        const t = Math.max(0, Math.min(1, (x - 807) / 641));
        return imageTop + (554 + 109 * t - 138 * t * t) * scale - baseline + 22;
      });
      papers.forEach((paper, index) => paper.style.setProperty("--rope-drop", `${drops[index]}px`));
    }
    const observer = new ResizeObserver(alignPapers);
    observer.observe(scene);
    element.addEventListener("scroll", alignPapers, { passive: true });
    alignPapers();
    return () => { observer.disconnect(); element.removeEventListener("scroll", alignPapers); };
  }, [rope]);

  return (
    <>
      <section className={`${styles.clothesline} ${rope === "smaller" ? styles.smallerLine : ""}`} aria-label={rope === "featured" ? "Featured projects" : "Smaller projects"} data-rope={rope}>
        <div ref={viewport} className={styles.viewport} tabIndex={0} aria-label={`${rope === "featured" ? "Featured" : "Smaller"} projects. Drag, swipe, or use left and right arrow keys.`}>
          <div className={styles.track}>
            {rope === "featured" && <svg className={styles.rope} viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 8 Q500 148 1000 8" />
              <path d="M0 9 Q500 149 1000 9" />
            </svg>}
            {projects.filter((project) => project.rope === rope).map((project, index) => <Fragment key={project.id}>
              <ProjectCard project={project} onOpen={(project, source) => { stop.current(); setSelection({ project, source }); }} />
              {rope === "smaller" && <span className={styles.decoration} aria-hidden="true">
                <Image src={`/assets/projects/attic-${["botanical", "flowers", "peiwen"][index]}.webp`} alt="" fill sizes="105px" draggable={false} />
              </span>}
            </Fragment>)}
            {rope === "smaller" && <span className={styles.decoration} aria-hidden="true">
              <Image src="/assets/projects/attic-wip.webp" alt="" fill sizes="105px" draggable={false} />
            </span>}
          </div>
        </div>
      </section>
      {selection && <ProjectPreview selection={selection} onClose={() => setSelection(null)} />}
    </>
  );
}
