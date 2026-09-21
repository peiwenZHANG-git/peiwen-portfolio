"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projectsData";
import ProjectCard from "./project-card";
import ProjectPreview, { type Selection } from "./project-preview";
import styles from "./projects.module.css";

export default function ProjectClothesline() {
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

  return (
    <>
      <section className={styles.clothesline} aria-label="Projects on the clothesline">
        <div ref={viewport} className={styles.viewport} tabIndex={0} aria-label="Explore projects. Drag, swipe, or use left and right arrow keys.">
          <div className={styles.track}>
            <svg className={styles.rope} viewBox="0 0 1800 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 8 Q210 23 420 28 T900 38 Q1330 39 1800 8" />
              <path d="M0 10 Q208 25 422 29 T901 36 Q1332 41 1800 10" />
            </svg>
            {projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={(project, source) => { stop.current(); setSelection({ project, source }); }} />)}
          </div>
        </div>
        <p className={styles.hint}>drag to explore →</p>
      </section>
      {selection && <ProjectPreview selection={selection} onClose={() => setSelection(null)} />}
    </>
  );
}
