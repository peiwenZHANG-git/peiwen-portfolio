"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import saclay from "@/design-assets/keyframes/experience/paris-saclay-approved.png";
import cuc from "@/design-assets/keyframes/experience/cuc-approved.png";
import { getJourneyState, getProgressTarget, getSlowdownWeight } from "@/lib/journey";
import { STORYBOOK_SCENES, sampleStorybook } from "@/lib/storybook";
import styles from "./storybook.module.css";

const plates = { "paris-saclay-approved": saclay, "cuc-approved": cuc };
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const interactive = (target: EventTarget | null) => target instanceof Element &&
  !!target.closest("a, button, input, select, textarea, summary, [contenteditable=true], article");

export default function StorybookReview({ initialProgress }: { initialProgress: number }) {
  const root = useRef<HTMLElement>(null);
  const details = useRef<HTMLDetailsElement>(null);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState(() => ({ progress: initialProgress, journey: getJourneyState(initialProgress) }));
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const ready = loaded.length === STORYBOOK_SCENES.length;

  useEffect(() => {
    const element = root.current;
    if (!element || !ready) return;
    let progress = initialProgress;
    let target = initialProgress;
    let journey = getJourneyState(progress);
    let pointer: { id: number; y: number } | null = null;
    const keys = new Set<string>();
    const forwardKeys = ["w", "arrowup"];
    const backwardKeys = ["s", "arrowdown"];
    let lastTime = performance.now();
    let frame = 0;
    const move = (delta: number) => {
      if (Number.isFinite(delta)) target = getProgressTarget(progress, target, delta);
    };
    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const direction = Number(forwardKeys.some((key) => keys.has(key))) - Number(backwardKeys.some((key) => keys.has(key)));
      const near = getSlowdownWeight(progress);
      if (direction) move(direction * dt * 0.048 * (near ? 0.62 : 1));
      const next = Math.abs(target - progress) < 0.00001 ? target :
        progress + (target - progress) * (1 - Math.exp(-(near ? 2.8 : 4) * dt));
      if (next !== progress) {
        journey = getJourneyState(next, progress, journey);
        progress = next;
        setState({ progress, journey });
      }
      frame = requestAnimationFrame(tick);
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || interactive(event.target)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      move(event.deltaY * unit * 0.0003);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || interactive(event.target)) return;
      const key = event.key.toLowerCase();
      if (![...forwardKeys, ...backwardKeys].includes(key)) return;
      event.preventDefault();
      keys.add(key);
    };
    const keyup = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    const clear = () => { keys.clear(); pointer = null; };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || interactive(event.target)) return;
      pointer = { id: event.pointerId, y: event.clientY };
      element.setPointerCapture(event.pointerId);
      element.focus({ preventScroll: true });
    };
    const drag = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      move((pointer.y - event.clientY) * 0.00055);
      pointer.y = event.clientY;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", drag);
    element.addEventListener("pointerup", clear);
    element.addEventListener("pointercancel", clear);
    element.addEventListener("lostpointercapture", clear);
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", drag);
      element.removeEventListener("pointerup", clear);
      element.removeEventListener("pointercancel", clear);
      element.removeEventListener("lostpointercapture", clear);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [initialProgress, ready]);

  const sample = sampleStorybook(state.progress, reducedMotion);
  const narration = sample.scene.narration;
  const announcement = state.journey.phase === "active" && state.journey.milestoneId === sample.scene.milestoneId
    ? narration.arrivalAnnouncement : null;

  return (
    <main ref={root} className={styles.review} tabIndex={-1} aria-label="Peiwen's storybook journey review"
      aria-describedby="storybook-instructions" data-progress={state.progress} data-phase={state.journey.phase}
      data-milestone={state.journey.milestoneId} data-scene={sample.scene.id} data-transition={sample.transition}
      data-ready={ready} data-reduced-motion={reducedMotion}>
      <a className="skip-link" href="#storybook-details" onClick={() => { if (details.current) details.current.open = true; }}>Skip to Experience details</a>
      <h1 className={styles.srOnly}>Walk with Peiwen through her experiences</h1>
      <p id="storybook-instructions" className={styles.srOnly}>Scroll, use W/S or the up/down arrow keys, or swipe vertically to move forward and backward. This review uses temporary illustrated plates; sideways movement is not available.</p>
      {/* ponytail: exactly two adjacent review scenes stay decoded; revisit loading only
          when more chapters are approved. No old Canvas or shared character is mounted. */}
      <div className={styles.art} aria-hidden="true" style={{ visibility: ready ? "visible" : "hidden" }}>
        {STORYBOOK_SCENES.map((scene, index) => (
          <div key={scene.id} className={styles.plate} data-plate={scene.id} style={{
            opacity: index === 0 ? 1 : sample.incomingOpacity,
            // 2.05% bleed lets the incoming 0.98 scale still cover every viewport edge.
            transform: `scale(${sample.scales[index]})`,
            "--desktop-position": scene.framing.desktop,
            "--mobile-position": scene.framing.mobile,
          } as CSSProperties}>
            <Image src={plates[scene.visual.backgroundPlate]} alt="" fill sizes="(max-width: 700px) 1400px, 105vw"
              loading="eager" draggable={false}
              onLoad={async (event) => {
                try { await event.currentTarget.decode(); }
                catch { setFailed(true); return; }
                setLoaded((current) => current.includes(scene.id) ? current : [...current, scene.id]);
              }} onError={() => setFailed(true)} />
          </div>
        ))}
      </div>
      {!ready && <p className={styles.loading} role="status">{failed ? "The review artwork could not load. Please reload to try again." : "Loading the storybook…"}</p>}
      <details ref={details} className={styles.details}>
        <summary>Experience details</summary>
        <article id="storybook-details" tabIndex={-1} aria-label="Current Experience details">
          {narration.organization ? <>
            <h2>{narration.organization}</h2>
            <p>{narration.identity}{narration.period && ` · ${narration.period}`}</p>
            {narration.summary && <p>{narration.summary}</p>}
          </> : <p>CUC illustration preview. Experience details have not been confirmed.</p>}
          <p>Temporary review plates · not the final website.</p>
          <p>Scroll / W–S / ↑↓ / vertical swipe. Reverse to return.</p>
        </article>
      </details>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </main>
  );
}
