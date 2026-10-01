"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./peiwen-about-hover.module.css";

export default function PeiwenAboutHover({ controlled = false }: { controlled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (controlled) return; // Phase 4's existing walk controller owns all state/input.
    const node = ref.current!;
    const root = node.closest<HTMLElement>("[data-phase-one]")!;
    const button = node.querySelector<HTMLButtonElement>("button")!;
    const prompt = root.parentElement!.querySelector<HTMLElement>("[data-home-prompt]")!;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = false, idleSince = performance.now();
    let lastX = -1, lastY = -1;
    const hide = () => {
      if (!active) return;
      active = false;
      node.dataset.active = "false";
      button.setAttribute("aria-expanded", "false");
      prompt.style.removeProperty("opacity");
      root.dataset.state = "IDLE";
      idleSince = performance.now();
    };
    const show = () => {
      if (active || root.dataset.state !== "IDLE" || root.dataset.moving === "true" || root.dataset.ready !== "true") return;
      root.dispatchEvent(new Event("peiwen-about"));
      active = true;
      node.dataset.active = "true";
      button.setAttribute("aria-expanded", "true");
      prompt.style.opacity = ".55";
      root.dataset.state = "ABOUT_HOVER";
    };
    const move = (event: PointerEvent) => {
      const moved = event.clientX !== lastX || event.clientY !== lastY;
      lastX = event.clientX; lastY = event.clientY;
      if (!event.isTrusted || event.pointerType !== "mouse" || !fine.matches || !moved || event.timeStamp <= idleSince) return;
      const box = button.getBoundingClientRect();
      if (event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom) show();
      else if (document.activeElement !== button) hide();
    };
    const focus = () => show();
    const blur = () => hide();
    const down = (event: PointerEvent) => { event.preventDefault(); }; // No touch/click-to-focus hover or navigation.
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && active) { hide(); button.blur(); }
    };
    const sync = () => {
      // A returned Idle never arms itself from a stationary pointer or synthetic enter.
      if (root.dataset.state === "IDLE") idleSince = performance.now();
      const x = root.dataset.state === "LEFT_PREVIEW" ? -54 : root.dataset.state === "RIGHT_PREVIEW" ? 54 : 0;
      button.style.transform = `translate(${x}px, ${-x * 8 / 54}px)`;
      // Phase 4's hit area stays enterable while Peiwen walks; its controller owns intent.
      button.disabled = !controlled && root.dataset.moving === "true";
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-state", "data-moving"] });
    button.addEventListener("focus", focus);
    button.addEventListener("blur", blur);
    button.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("keydown", key, true);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      observer.disconnect();
      button.removeEventListener("focus", focus);
      button.removeEventListener("blur", blur);
      button.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      prompt.style.removeProperty("opacity");
    };
  }, [controlled]);

  return (
    <div ref={ref} className={styles.about} data-about-overlay data-active="false">
      <div className={styles.pose} aria-hidden="true">
        <Image className={styles.patch} src="/peiwen-phase1/origin-clean-plate.png" width={120} height={230} unoptimized priority alt="" />
        <Image className={styles.head} src="/peiwen-phase1/peiwen-original.png" width={120} height={230} unoptimized priority alt="" />
      </div>
      <button data-about-hit className={styles.hit} aria-label="About me. Meet Peiwen." aria-expanded="false" aria-controls="peiwen-about-note" />
      <div id="peiwen-about-note" className={styles.note}>
        <span>About me</span>
        <span>Meet Peiwen.</span>
      </div>
    </div>
  );
}
