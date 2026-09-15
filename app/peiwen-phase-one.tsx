"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./peiwen-phase-one.module.css";

export default function PeiwenPhaseOne({ enableRight = false }: { enableRight?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current!;
    const layer = root.querySelector<HTMLElement>("[data-layer]")!;
    const walker = root.querySelector<HTMLElement>("[data-walker]")!;
    const status = root.querySelector<HTMLElement>("[role=status]")!;
    const leftButton = root.querySelector<HTMLButtonElement>("[data-intent=left]")!;
    const rightButton = root.querySelector<HTMLButtonElement>("[data-intent=right]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    type Position = -1 | 0 | 1;
    let desired: Position = 0, position: Position = 0;
    let busy = false, disposed = false, ready = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const animations = new Set<Animation>();
    const animate = async (element: HTMLElement, frames: Keyframe[], duration: number) => {
      const animation = element.animate(frames, { duration, fill: "forwards" });
      animations.add(animation);
      try { await animation.finished; } catch { /* Unmount cancels pending motion. */ }
      animations.delete(animation);
      animation.cancel();
    };
    const pose = (position: Position) => `translate(${position * 54}px, ${position * -8}px)`;
    const run = async () => {
      if (busy || !ready || disposed) return;
      busy = true;
      while (desired !== position && !disposed) {
        const target = desired;
        root.dataset.moving = "true";
        layer.style.visibility = "visible";
        // Each journey completes at a planted-foot checkpoint; only latest intent is kept.
        const duration = reduce.matches ? 100 : 1080;
        const feet = [...walker.querySelectorAll<HTMLElement>("[data-foot]")];
        const steps = reduce.matches ? [] : feet.map((foot, side) => {
          const frames = Array.from({ length: 13 }, (_, i) => {
            const t = i / 12;
            const wave = Math.sin(t * Math.PI * 6 + side * Math.PI);
            // Linear quarter-strides counter the body's travel while a boot is planted.
            const lift = i > 0 && i < 12 && i % 4 === (side === 0 ? 2 : 0) ? -2 : 0;
            return { transform: `translate(${wave * -Math.sign(target - position) * 4.5}px, ${lift}px)`, offset: t };
          });
          return animate(foot, frames, duration);
        });
        await Promise.all([animate(walker, [{ transform: pose(position) }, { transform: pose(target) }], duration), ...steps]);
        if (disposed) break;
        walker.style.transform = pose(target);
        position = target;
        if (position === 0) {
          await animate(layer, [{ opacity: 1 }, { opacity: 0 }], reduce.matches ? 60 : 120);
          layer.style.visibility = "hidden";
        }
        root.dataset.state = position === -1 ? "LEFT_PREVIEW" : position === 1 ? "RIGHT_PREVIEW" : "IDLE";
        root.dataset.moving = "false";
        leftButton.setAttribute("aria-pressed", String(position === -1));
        rightButton?.setAttribute("aria-pressed", String(position === 1));
        status.textContent = position ? `${position === -1 ? "Left" : "Right"} preview. Press Escape to return Peiwen to the center.` : "Peiwen is at the center.";
      }
      busy = false;
    };
    const intent = (position: Position, delay = 0) => {
      clearTimeout(timer);
      timer = setTimeout(() => { desired = position; void run(); }, delay);
    };
    const direction = (button: HTMLElement): Position => button.dataset.intent === "left" ? -1 : enableRight && button.dataset.intent === "right" ? 1 : 0;
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-intent]");
      if (button) intent(direction(button), direction(button) ? 220 : 420);
    };
    const click = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-intent]");
      if (button) intent(direction(button));
    };
    const leave = () => intent(0, 420);
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("a,input,textarea,select,[contenteditable=true]")) return;
      if (event.key === "ArrowLeft" || event.key === "Escape" || (enableRight && event.key === "ArrowRight")) {
        event.preventDefault();
        intent(event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0);
      }
    };
    root.addEventListener("pointerover", pointer);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("click", click);
    window.addEventListener("keydown", key);
    void Promise.all([...root.querySelectorAll("img")].map(image => image.decode())).then(() => {
      ready = true;
      root.dataset.ready = "true";
      void run();
    }).catch(() => { status.textContent = "Preview artwork unavailable. The static scene is unchanged."; });
    return () => {
      disposed = true;
      clearTimeout(timer);
      animations.forEach(animation => animation.cancel());
      root.removeEventListener("pointerover", pointer);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
    };
  }, [enableRight]);

  return (
    <div ref={rootRef} className={styles.root} data-phase-one data-phase-two={enableRight || undefined} data-state="IDLE" data-moving="false">
      <div data-layer className={styles.layer} aria-hidden="true">
        <Image className={styles.patch} src="/peiwen-phase1/origin-clean-plate.png" width={120} height={230} unoptimized priority alt="" />
        <div data-walker className={styles.walker}>
          <span className={styles.shadow} />
          <Image className={styles.body} src="/peiwen-phase1/peiwen-original.png" width={120} height={230} unoptimized priority alt="" />
          <Image data-foot className={styles.leftFoot} src="/peiwen-phase1/peiwen-original.png" width={120} height={230} unoptimized priority alt="" />
          <Image data-foot className={styles.rightFoot} src="/peiwen-phase1/peiwen-original.png" width={120} height={230} unoptimized priority alt="" />
        </div>
      </div>
      <button className={styles.leftIntent} data-intent="left" aria-label="Preview Peiwen walking left" aria-pressed="false" />
      <button className={styles.returnIntent} data-intent="idle" aria-label="Return Peiwen to the center" />
      {enableRight && <button className={styles.rightIntent} data-intent="right" aria-label="Preview Peiwen walking right" aria-pressed="false" />}
      <span className={styles.srOnly} role="status" aria-live="polite">Peiwen is at the center.</span>
    </div>
  );
}
