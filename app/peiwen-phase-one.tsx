"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./peiwen-phase-one.module.css";
import PeiwenAboutHover from "./peiwen-about-hover";
import PeiwenLeftEnvironment from "./peiwen-left-environment";

export default function PeiwenPhaseOne({ enableRight = false, enableAbout = false, coordinated = false, enableEnvironment = false }: { enableRight?: boolean; enableAbout?: boolean; coordinated?: boolean; enableEnvironment?: boolean }) {
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
    type Intent = Position | "about";
    let desired: Intent = 0, position = 0;
    const about = root.querySelector<HTMLElement>("[data-about-overlay]");
    const hit = root.querySelector<HTMLButtonElement>("[data-about-hit]");
    const prompt = root.parentElement!.querySelector<HTMLElement>("[data-home-prompt]");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let aboutActive = false, idleSince = performance.now(), lastX = -1, lastY = -1;
    let pending: Intent | undefined;
    let busy = false, disposed = false, ready = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const animations = new Set<Animation>();
    let motionToken = 0;
    let pointerPoll = 0;
    const lastPointer = { x: -1, y: -1, movedSinceMotion: false };
    const animate = async (element: HTMLElement, frames: Keyframe[], duration: number) => {
      const animation = element.animate(frames, { duration, fill: "forwards" });
      animations.add(animation);
      try { await animation.finished; } catch { /* Unmount cancels pending motion. */ }
      animations.delete(animation);
      animation.cancel();
    };
    const travel = (destination: Position) => destination === -1 && enableEnvironment ? -330 : destination * 54;
    const pose = (x: number) => `translate(${x}px, ${x * -8 / 54}px)`;
    const setAbout = async (active: boolean) => {
      aboutActive = active;
      about!.dataset.active = String(active);
      hit!.setAttribute("aria-expanded", String(active));
      if (active) prompt!.style.opacity = ".55";
      else prompt!.style.removeProperty("opacity");
      // Wait for the approved CSS head/fade transitions, never race a walking overlay.
      await Promise.allSettled([...about!.getAnimations({ subtree: true }), ...prompt!.getAnimations()].map(animation => animation.finished));
    };
    const destinationFor = (value: Intent) => value === "about" ? 0 : travel(value);
    const commitActiveMotion = () => {
      if (!animations.size) return;
      // Freeze the exact interpolated frame before cancelling; cancellation would
      // otherwise snap the sprite back to the previous planted-foot checkpoint.
      const matrix = new DOMMatrix(getComputedStyle(walker).transform);
      const x = Number.isFinite(matrix.m41) ? matrix.m41 : position;
      position = x;
      walker.style.transform = pose(x);
      if (coordinated && hit) hit.style.transform = pose(x);
      for (const animation of animations) animation.cancel();
      animations.clear();
    };
    const interruptToAbout = () => {
      clearTimeout(timer);
      pending = undefined;
      motionToken += 1;
      commitActiveMotion();
      root.dataset.moving = "false";
      desired = "about";
      void run();
    };
    const run = async () => {
      if (busy || !ready || disposed) return;
      busy = true;
      lastPointer.movedSinceMotion = false;
      while ((position !== destinationFor(desired) || (aboutActive ? desired !== "about" : desired === "about" && !aboutActive)) && !disposed) {
        root.dataset.moving = "true";
        if (enableEnvironment) root.dataset.environment = desired === -1 ? "left" : "none";
        if (coordinated && aboutActive) {
          await setAbout(false);
          if (disposed) break;
        }
        const destination = destinationFor(desired);
        // Center is a planted-foot checkpoint, not an Idle stop or overlay handoff.
        const crossesCenter = coordinated && position !== 0 && destination !== 0 && Math.sign(destination) !== Math.sign(position);
        const direction = Math.sign(destination - position);
        const shortStep = crossesCenter
          ? 0
          : direction < 0
            ? Math.max(destination, position - 55)
            : Math.min(destination, position + 55);
        const target = shortStep;
        if (target !== position) {
          const motion = motionToken;
          layer.style.visibility = "visible";
          // Repeat the approved short-step gait; long distances are several steps.
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
          const walkFrames = [{ transform: pose(position) }, { transform: pose(target) }];
          await Promise.all([animate(walker, walkFrames, duration), ...(coordinated && hit ? [animate(hit, walkFrames, duration)] : []), ...steps]);
          if (disposed || motion !== motionToken) continue;
          walker.style.transform = pose(target);
          if (coordinated && hit) hit.style.transform = pose(target);
          position = target;
          if (position === 0 && (!coordinated || desired === 0 || desired === "about")) {
            await animate(layer, [{ opacity: 1 }, { opacity: 0 }], reduce.matches ? 60 : 120);
            layer.style.visibility = "hidden";
          }
        }
        if (coordinated && desired === "about" && position === 0 && !disposed) await setAbout(true);
        if (disposed) break;
        if (coordinated && !aboutActive && position !== destinationFor(desired)) continue;
        root.dataset.state = aboutActive ? "ABOUT_HOVER" : position < 0 ? "LEFT_PREVIEW" : position > 0 ? "RIGHT_PREVIEW" : "IDLE";
        root.dataset.moving = "false";
        if (!aboutActive && position === 0) idleSince = performance.now();
        leftButton.setAttribute("aria-pressed", String(position < 0));
        rightButton?.setAttribute("aria-pressed", String(position > 0));
        status.textContent = position ? `${position < 0 ? "Left" : "Right"} preview. Press Escape to return Peiwen to the center.` : "Peiwen is at the center.";
      }
      busy = false;
    };
    const intent = (position: Intent, delay = 0) => {
      if (coordinated && pending === position && !busy) return;
      if (coordinated && position === "about" && busy) {
        interruptToAbout();
        return;
      }
      clearTimeout(timer);
      pending = position;
      timer = setTimeout(() => { pending = undefined; desired = position; void run(); }, delay);
    };
    const direction = (button: HTMLElement): Position => button.dataset.intent === "left" ? -1 : enableRight && button.dataset.intent === "right" ? 1 : 0;
    const pointer = (event: PointerEvent) => {
      if (coordinated) return;
      if (event.pointerType !== "mouse") return;
      if (root.dataset.state === "ABOUT_HOVER" && document.activeElement?.matches("[data-about-hit]")) return;
      if ((event.target as HTMLElement).closest("[data-about-hit]")) { clearTimeout(timer); return; }
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-intent]");
      if (button) intent(direction(button), direction(button) ? 220 : 420);
    };
    const click = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("[data-about-hit]")) return;
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-intent]");
      if (button) intent(direction(button));
    };
    const leave = () => intent(0, 420);
    const key = (event: KeyboardEvent) => {
      if (!coordinated && root.dataset.state === "ABOUT_HOVER") return;
      if ((event.target as HTMLElement).closest("a,input,textarea,select,[contenteditable=true]")) return;
      if (event.key === "ArrowLeft" || event.key === "Escape" || (enableRight && event.key === "ArrowRight")) {
        event.preventDefault();
        if (coordinated && document.activeElement === hit) hit?.blur();
        intent(event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0);
      }
    };
    const aboutIntent = () => { clearTimeout(timer); desired = position < 0 ? -1 : position > 0 ? 1 : 0; };
    const move = (event: PointerEvent) => {
      if (!coordinated) return;
      const moved = event.clientX !== lastX || event.clientY !== lastY;
      lastX = event.clientX; lastY = event.clientY;
      if (!event.isTrusted || !fine.matches || event.pointerType !== "mouse" || !moved || event.timeStamp <= idleSince) return;
      const box = hit!.getBoundingClientRect();
      if (event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom) {
        intent("about");
      } else if (document.activeElement !== hit) {
        const button = (event.target as HTMLElement).closest<HTMLElement>("[data-intent]");
        if (button && root.contains(button)) intent(direction(button), direction(button) ? 220 : 420);
        else intent(0, 420);
      }
    };
    const focus = () => intent("about");
    const blur = () => { if (desired === "about" || aboutActive || pending === "about") intent(0); };
    const down = (event: PointerEvent) => event.preventDefault();
    const updatePointer = (event: PointerEvent, markMoved = false) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      lastPointer.movedSinceMotion = markMoved;
    };
    const isPointerOnPeiwen = () => {
      if (lastPointer.x < 0 || lastPointer.y < 0) return false;
      const box = hit!.getBoundingClientRect();
      return lastPointer.x >= box.left && lastPointer.x <= box.right
        && lastPointer.y >= box.top && lastPointer.y <= box.bottom;
    };
    const pollPeiwenContact = () => {
      // WAAPI motion does not reliably synthesize hit-area boundary events.
      if (ready && busy && !aboutActive && desired !== "about" && lastPointer.movedSinceMotion && isPointerOnPeiwen()) {
        lastPointer.movedSinceMotion = false;
        interruptToAbout();
      }
      pointerPoll = requestAnimationFrame(pollPeiwenContact);
    };
    const hitEnter = (event: PointerEvent) => {
      const moved = event.clientX !== lastX || event.clientY !== lastY;
      updatePointer(event);
      if (moved && event.isTrusted && fine.matches && event.pointerType === "mouse") intent("about");
    };
    const trackPointer = (event: PointerEvent) => updatePointer(event, true);
    if (coordinated) {
      hit!.addEventListener("focus", focus);
      hit!.addEventListener("blur", blur);
      hit!.addEventListener("pointerdown", down);
      hit!.addEventListener("pointerenter", hitEnter);
      hit!.addEventListener("pointerover", hitEnter);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointermove", trackPointer, { passive: true });
      window.addEventListener("blur", leave);
    }
    pointerPoll = requestAnimationFrame(pollPeiwenContact);
    root.addEventListener("peiwen-about", aboutIntent);
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
      if (coordinated) {
        hit!.removeEventListener("focus", focus);
      hit!.removeEventListener("blur", blur);
      hit!.removeEventListener("pointerdown", down);
      hit!.removeEventListener("pointerenter", hitEnter);
      hit!.removeEventListener("pointerover", hitEnter);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("blur", leave);
      prompt?.style.removeProperty("opacity");
      root.dataset.environment = "none";
      }
      cancelAnimationFrame(pointerPoll);
      root.removeEventListener("peiwen-about", aboutIntent);
      root.removeEventListener("pointerover", pointer);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
    };
  }, [enableRight, coordinated, enableEnvironment]);

  return (
      <div ref={rootRef} className={styles.root} data-phase-one data-phase-two={enableRight || undefined} data-environment={enableEnvironment ? "none" : undefined} data-state="IDLE" data-moving="false">
        {enableEnvironment && <PeiwenLeftEnvironment />}
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
      {enableAbout && <PeiwenAboutHover controlled={coordinated} />}
      <span className={styles.srOnly} role="status" aria-live="polite">Peiwen is at the center.</span>
    </div>
  );
}
