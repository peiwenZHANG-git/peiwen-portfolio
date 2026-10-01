"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { usePageTransition } from "@/components/page-transition";
import { FairyGuide } from "@/components/fairy-guide";
import { L } from "@/components/lang";
import styles from "./home-desk.module.css";
import { handFont, bodyFont } from "./home-fonts";

/**
 * Home · "a room that wakes up" (2026-09-24).
 * Spec: claude/home-opening-2026-09-24.md (project doc). Replaces the 2026-09-21
 * version that stacked four GrabCut object layers with hop/sway on a background plate.
 *
 * ONE painted plate (`master.webp`, the accepted `home-master-lit`) is the only artwork.
 * Every opening stage is the same pixels under different exposure, never a crossfade
 * between separately generated images (which ghost and morph):
 *
 *   base    master, untouched: what you see once the room is lit
 *   dark    master under a strong brightness/saturate filter; in Stage 2 an ellipse
 *           mask centred on the lamp grows and wipes it away, right to left
 *   spill   master masked to a soft band around the window, a little brighter + cool:
 *           the outside light reaching the frame, sill and vine in Stage 1
 *   window  master masked to the glass only; dark in Stage 0, full colour from Stage 1
 *   snow    CSS flakes, clipped to the same glass mask
 *
 * The four entrances are transparent hotspots over the painted objects (no cut-out
 * layers, no hop): the painting already reads as one scene.
 *
 * Phases: sleep (Stage 0) → window (Stage 1) → lighting (Stage 2, ~3.4s) → lit.
 *
 * 2026-09-25: when the opening plays, the flower-fairy Peiwen (components/fairy-guide.tsx)
 * guides it — she waits by the window, then by the lamp, and finally flies to the corner
 * where she becomes the "Ask me" little Peiwen. Her notes replace the text hints.
 * The full intro only plays once (localStorage `peiwen-home-intro-seen`); `?intro=1`
 * replays it. Reduced motion goes straight to the lit room.
 */

type Phase = "sleep" | "window" | "lighting" | "lit";

const SEEN_KEY = "peiwen-home-intro-seen";
const LIGHTING_MS = 3400; // bulb warms up ~0.6s, then the light spreads across the desk

type Entrance = { key: string; href: string; label: string; className: string };

const ENTRANCES: Entrance[] = [
  {
    key: "experience",
    href: "/experience",
    label: "Postcards, a ginkgo leaf and a travel ticket. Go to Experience",
    className: styles.hsExperience,
  },
  {
    key: "about",
    href: "/about",
    label: "A spiral notebook tied with a ribbon, “About me”. Go to About",
    className: styles.hsAbout,
  },
  {
    key: "projects",
    href: "/projects",
    label: "A clipped index card, “Projects”. Go to Projects",
    className: styles.hsProjects,
  },
  // Playground removed 2026-09-27 (Peiwen's decision): it had no destination — /#playground
  // was never a real anchor and /playground 404s. The folded "Still exploring…" note stays
  // in the painting but is no longer a hotspot or labeled; bring it back once there's a
  // page for it.
];

/* Snow: fixed, hand-tuned-feeling pseudo-random layout (seeded so server and client
   render the same markup). Two layers: far = small, slow, dense; near = larger, fewer. */
function makeFlakes() {
  let s = 7;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const flakes: { left: number; size: number; dur: number; delay: number; drift: number; near: boolean }[] = [];
  for (let i = 0; i < 44; i += 1) {
    const near = i < 14;
    flakes.push({
      left: 32 + rand() * 49,
      size: near ? 3 + rand() * 2.5 : 1.6 + rand() * 1.4,
      dur: near ? 14 + rand() * 4 : 18 + rand() * 4,
      delay: -rand() * 22,
      drift: (rand() * 2 - 1) * 12,
      near,
    });
  }
  return flakes;
}
const FLAKES = makeFlakes();

/* ---- external state read without setState-in-effect ---- */
function subscribeNothing() {
  return () => {};
}
function readStartPhase(): Phase {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "lit";
    // Portrait / narrow screens: the 4:3 cover crop cuts the lamp off, so there would be
    // nothing to click for Stage 2. Mobile composition is a later pass; until then these
    // screens start on the lit room.
    if (window.innerWidth / window.innerHeight < 1.15) return "lit";
    if (new URLSearchParams(window.location.search).get("intro") === "1") return "sleep";
    if (window.localStorage.getItem(SEEN_KEY) === "1") return "lit";
  } catch {
    /* storage blocked: just play the intro */
  }
  return "sleep";
}
function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function HomeDesk() {
  const { navigate, stageClassName, onStageTransitionEnd } = usePageTransition();
  // null on the server / first hydration pass: render nothing visible until we know
  // whether this visitor gets the intro, so returning visitors never see a dark flash.
  const startPhase = useSyncExternalStore<Phase | null>(subscribeNothing, readStartPhase, () => null);
  const [progress, setProgress] = useState<Phase | null>(null);
  const [played, setPlayed] = useState(false);
  // Once the visitor has pointed at (or tabbed to) anything on the desk, the
  // "pick something up" line and the entrance glow have done their job.
  const [touched, setTouched] = useState(false);
  const lightingTimer = useRef<number | null>(null);
  // The desk labels are laid out in master-image pixels (1774 wide) and scaled to the
  // stage with --k, so they stay glued to the painted paper at every screen size.
  const stageRef = useRef<HTMLDivElement>(null);
  // "Walk in through the object": on clicking a desk entrance, the camera dives into
  // that object (it grows and slides to the middle of the screen) while the page fades
  // to paper, and the destination page then rises out of that paper.
  const [dive, setDive] = useState<CSSProperties | null>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  // The lantern cursor's halo: a warm pool of light that follows the pointer. Moved by
  // writing CSS variables straight onto the element (no React re-render per mouse move).
  const glowRef = useRef<HTMLDivElement>(null);
  function moveGlow(e: PointerEvent<HTMLElement>) {
    const glow = glowRef.current;
    if (!glow || e.pointerType !== "mouse") return;
    glow.style.setProperty("--gx", `${e.clientX}px`);
    glow.style.setProperty("--gy", `${e.clientY}px`);
    glow.dataset.on = "1";
    // the same point in stage coordinates, for the dark layer's lantern-shaped hole
    const stage = stageRef.current;
    if (stage) {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--lx", `${e.clientX - r.left}px`);
      stage.style.setProperty("--ly", `${e.clientY - r.top}px`);
    }
  }
  function hideGlow() {
    if (glowRef.current) delete glowRef.current.dataset.on;
    stageRef.current?.style.setProperty("--lx", "-999px");
  }

  // Coming back from an inner page through its desk keepsake: start zoomed into that
  // same object, then pull the camera back out to the whole desk — the reverse of the
  // way in. Imperative on purpose: it's a one-off entrance, not render state.
  useEffect(() => {
    if (startPhase !== "lit") return;
    let from: string | null = null;
    try {
      from = window.sessionStorage.getItem("peiwen-return-from");
      window.sessionStorage.removeItem("peiwen-return-from");
    } catch {
      return;
    }
    if (!from || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const camera = cameraRef.current;
    const stage = stageRef.current;
    const target = stage?.querySelector<HTMLElement>(`[data-entrance="${from}"]`);
    if (!camera || !stage || !target) return;
    const s = stage.getBoundingClientRect();
    const o = target.getBoundingClientRect();
    const ox = o.left + o.width / 2 - s.left;
    const oy = o.top + o.height / 2 - s.top;
    const tx = window.innerWidth / 2 - s.left - ox;
    const ty = window.innerHeight / 2 - s.top - oy;
    const scale = Math.min(4, (window.innerWidth * 0.78) / o.width, (window.innerHeight * 0.78) / o.height);
    camera.style.transition = "none";
    camera.style.transformOrigin = `${ox}px ${oy}px`;
    camera.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    camera.style.opacity = "0";
    camera.getBoundingClientRect(); // commit the zoomed-in start before animating out
    camera.style.transition =
      "transform 1000ms cubic-bezier(0.2, 0, 0.1, 1), opacity 520ms cubic-bezier(0.25, 0.1, 0.25, 1)";
    camera.style.transform = "";
    camera.style.opacity = "";
    // Tidy up once the pull-back has finished. Not tied to effect cleanup on purpose:
    // the animation must always finish and clean itself up (React dev mode runs effects
    // twice, and a cleared timer here would leave these inline styles behind and slow
    // down the next dive).
    const tidy = (e: TransitionEvent) => {
      if (e.propertyName !== "transform") return;
      camera.style.transition = "";
      camera.style.transformOrigin = "";
      camera.removeEventListener("transitionend", tidy);
    };
    camera.addEventListener("transitionend", tidy);
  }, [startPhase]);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const width = stage.getBoundingClientRect().width;
      if (width > 0) stage.style.setProperty("--k", String(width / 1774));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [startPhase]);
  const phase: Phase | null = progress ?? startPhase;
  // the fairy only guides a real opening; when she has landed in the corner the
  // companion takes over (it waits for data-guide="done" on <main>)
  const guided = startPhase === "sleep";
  const [guideDone, setGuideDone] = useState(false);

  // Each intro control is disabled (or, for "Skip intro", replaced) once it has done its
  // job, which would drop a keyboard or screen-reader user's focus to <body>. When a step
  // was activated from the keyboard (a click with detail 0), focus moves on to the next
  // thing to use once it exists: window → lamp, lamp → the first desk entrance (after
  // the room has lit), "Skip intro" → the "Skip to content" link that takes its place.
  // Pointer clicks leave focus alone.
  const lampRef = useRef<HTMLButtonElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const entrancesRef = useRef<HTMLElement>(null);
  const focusNext = useRef<"lamp" | "desk" | "skip" | null>(null);
  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    let el: HTMLElement | null | undefined = null;
    if (target === "lamp" && phase === "window") el = lampRef.current;
    else if (target === "desk" && phase === "lit") el = entrancesRef.current?.querySelector<HTMLElement>("a[href]");
    else if (target === "skip" && phase === "lit") el = skipLinkRef.current;
    else return;
    focusNext.current = null;
    el?.focus({ preventScroll: true });
  }, [phase]);

  function openWindow(event: MouseEvent<HTMLButtonElement>) {
    if (phase !== "sleep") return;
    if (event.detail === 0) focusNext.current = "lamp";
    setProgress("window");
  }

  function lightRoom(event: MouseEvent<HTMLButtonElement>) {
    if (phase !== "window") return;
    if (event.detail === 0) focusNext.current = "desk";
    setProgress("lighting");
    setPlayed(true);
    if (lightingTimer.current) window.clearTimeout(lightingTimer.current);
    lightingTimer.current = window.setTimeout(() => {
      setProgress("lit");
      markSeen();
    }, LIGHTING_MS);
  }

  function skipIntro(event: MouseEvent<HTMLButtonElement>) {
    if (lightingTimer.current) window.clearTimeout(lightingTimer.current);
    if (event.detail === 0) focusNext.current = "skip";
    setProgress("lit");
    markSeen();
  }

  function handleEntranceClick(entrance: Entrance, event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const goesElsewhere = (entrance.href.split("#")[0] || "/") !== "/";
    const stage = stageRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (goesElsewhere && stage && !reduced) {
      // drop anything left over from a pull-back so the dive uses its own timing
      const camera = cameraRef.current;
      if (camera) {
        camera.style.transition = "";
        camera.style.transformOrigin = "";
        camera.style.opacity = "";
      }
      const s = stage.getBoundingClientRect();
      const o = event.currentTarget.getBoundingClientRect();
      // object centre, in stage coordinates
      const ox = o.left + o.width / 2 - s.left;
      const oy = o.top + o.height / 2 - s.top;
      // where it should end up: the middle of the window, filling most of it
      const tx = window.innerWidth / 2 - s.left - ox;
      const ty = window.innerHeight / 2 - s.top - oy;
      const scale = Math.min(4, (window.innerWidth * 0.78) / o.width, (window.innerHeight * 0.78) / o.height);
      setDive({
        transformOrigin: `${ox}px ${oy}px`,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      });
    }
    navigate(entrance.href, { originX: event.clientX, originY: event.clientY, departure: goesElsewhere ? "dive" : "default" });
  }

  const lit = phase === "lit";
  const phaseClass = phase ? styles[`phase_${phase}`] : styles.phase_boot;

  return (
    // lang="en": Home is English in 中 mode too; its few translated hints carry lang="zh-CN"
    <main
      lang="en"
      onPointerMove={moveGlow}
      onPointerLeave={hideGlow}
      // read by components/peiwen-companion.tsx: little Peiwen waits until the room is lit
      data-home-phase={phase ?? "boot"}
      data-guide={guided && !guideDone ? "active" : "done"}
      className={`${styles.viewport} ${phaseClass} ${guided ? styles.guided : ""} ${played ? styles.played : ""} ${touched ? styles.touched : ""} ${handFont.className} ${handFont.variable} ${bodyFont.variable}`}
    >
      {phase && !lit ? (
        <button type="button" className={styles.skip} onClick={skipIntro}>
          Skip intro
        </button>
      ) : (
        <a ref={skipLinkRef} className={styles.skip} href="#home-stage">
          Skip to content
        </a>
      )}

      <div className={styles.headerZone} inert={!lit}>
        <SiteHeader current="home" />
      </div>

      <div
        id="home-stage"
        ref={stageRef}
        className={`${styles.stage} ${stageClassName}`}
        onTransitionEnd={onStageTransitionEnd}
        tabIndex={-1}
      >
        <div ref={cameraRef} className={`${styles.camera} ${dive ? styles.diving : ""}`} style={dive ?? undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.layer}
            src="/assets/home-desk/master.webp"
            width={1774}
            height={887}
            alt="A small attic desk at night. Beyond a big arched window, snow falls over a sleeping city of blue roofs and lit windows. On the warm wooden desk lie travel postcards, a spiral notebook, a clipped index card and a tiny folded note, with a vase of daisies, a stack of books, a brass desk lamp and a little drawing of Peiwen pinned to the wall."
          />
          <div className={`${styles.layer} ${styles.dark}`} aria-hidden="true" />
          <div className={`${styles.layer} ${styles.spill}`} aria-hidden="true" />
          <div className={`${styles.layer} ${styles.windowLayer}`} aria-hidden="true" />
          <div className={`${styles.layer} ${styles.windowEdge}`} aria-hidden="true" />

          <div className={`${styles.layer} ${styles.snow}`} aria-hidden="true">
            {FLAKES.map((f, i) => (
              <span
                key={i}
                className={f.near ? styles.flakeNear : styles.flakeFar}
                style={
                  {
                    left: `${f.left}%`,
                    width: `${f.size}px`,
                    height: `${f.size}px`,
                    animationDuration: `${f.dur}s`,
                    animationDelay: `${f.delay}s`,
                    "--drift": `${f.drift}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className={styles.labels} aria-hidden="true">
            <div className={styles.sheets}>
              <p className={`${styles.sheet} ${styles.sheetWall}`}>
                <span className={styles.hi}>Currently learning:</span>
                <span>&middot; building with AI</span>
                <span>&middot; user research</span>
                <span>&middot; prototyping</span>
                <span>&middot; French (un peu!)</span>
              </p>
              <p className={`${styles.sheet} ${styles.sheetTicket}`}>Experience</p>
              <p className={`${styles.sheet} ${styles.sheetProjects}`}>
                <span>Projects</span>
                <span className={styles.rule} />
                <span className={styles.sub}>What I built.</span>
              </p>
              {/* "Still exploring…" removed with the Playground entrance (2026-09-27):
                  an unlabeled note reads better than one that goes nowhere. */}
            </div>
          </div>
          {/* light ink on the red leather cover: its own blend group, see .labelsLight */}
          <div className={styles.labelsLight} aria-hidden="true">
            <div className={styles.sheets}>
              <p className={`${styles.sheet} ${styles.sheetAbout}`}>
                <span>About me</span>
                <span className={styles.rule} />
                <span className={styles.sub}>Meet Peiwen.</span>
              </p>
            </div>
          </div>

          <div className={styles.lampSpark} aria-hidden="true" />
          <div className={styles.lampWarmth} aria-hidden="true" />

          <div className={styles.heading}>
            <h1 className={styles.title}>
              Peiwen&rsquo;s Little World
              <span className={styles.subtitle}>A small world of curiosity.</span>
            </h1>
            <p className={styles.intro}>
              I&rsquo;m Peiwen, an HCI student in Paris,
              <br />
              building AI products people can understand, and small interactive worlds.
            </p>
          </div>

          {/* its own element on the stage (not inside .heading), so its % position is
              measured against the whole desk and it can sit right above the entrances */}
          <p className={`${styles.invite} ${touched ? styles.inviteDone : ""}`} aria-hidden="true">
            <L en={<>click anything on the desk to explore &darr;</>} zh={<>点点桌上的东西，探索一下 &darr;</>} />
          </p>

          <p className={`${styles.hint} ${styles.hintWindow}`} aria-hidden="true">
            <L en={<>click the window &rarr;</>} zh={<>点一下窗户 &rarr;</>} />
            <small>
              <L en="the city outside is waiting" zh="窗外的城市在等你" />
            </small>
          </p>
          <p className={`${styles.hint} ${styles.hintLamp}`} aria-hidden="true">
            <L en={<>click the lamp &rarr;</>} zh={<>点一下台灯 &rarr;</>} />
            <small>
              <L en="light up the room" zh="把房间点亮" />
            </small>
          </p>

          <button
            type="button"
            className={`${styles.hotspot} ${styles.hsWindow}`}
            onClick={openWindow}
            disabled={phase !== "sleep"}
            aria-label="Open the window"
          />
          <button
            type="button"
            className={`${styles.hotspot} ${styles.hsLamp}`}
            ref={lampRef}
            onClick={lightRoom}
            disabled={phase !== "window"}
            aria-label="Switch on the desk lamp"
          />

          <nav
            ref={entrancesRef}
            aria-label="Desk"
            className={styles.entrances}
            inert={!lit}
            onPointerOver={() => setTouched(true)}
            onFocus={() => setTouched(true)}
          >
            {ENTRANCES.map((entrance, i) => (
              <Link
                key={entrance.key}
                data-entrance={entrance.key}
                href={entrance.href}
                className={`${styles.hotspot} ${styles.entrance} ${entrance.className}`}
                style={{ "--invite-delay": `${i * 320}ms` } as CSSProperties}
                aria-label={entrance.label}
                onClick={(e) => handleEntranceClick(entrance, e)}
              />
            ))}
          </nav>
        </div>
      </div>
      <div ref={glowRef} className={styles.lanternGlow} aria-hidden="true" />
      {guided && phase && <FairyGuide phase={phase} stageRef={stageRef} onDone={() => setGuideDone(true)} />}
    </main>
  );
}
