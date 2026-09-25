"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { previewFromSwipe, type HubDestination, type HubPreview } from "../lib/home-hub";
import styles from "./home-hub.module.css";

type HubState = HubPreview | "ENTERING";

const OPENING_KEY = "peiwen-home-opening-seen";
const EXPLORED_KEY = "peiwen-home-explored";

export default function HomeHub() {
  const router = useRouter();
  const [opening, setOpening] = useState<boolean | null>(null);
  const [staticReconstruction, setStaticReconstruction] = useState(false);
  const [state, setState] = useState<HubState>("IDLE");
  const [enterTarget, setEnterTarget] = useState<HubDestination | null>(null);
  const [hint, setHint] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = useRef<{ x: number; y: number; type: string } | null>(null);
  const ignoreTouchClick = useRef(false);
  const lastPointerType = useRef("mouse");
  const pointerZone = useRef<HubPreview | null>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const world = useRef<HTMLElement>(null);

  const finishOpening = useCallback(() => {
    sessionStorage.setItem(OPENING_KEY, "1");
    pointerZone.current = null;
    lastPointer.current = null;
    setOpening(false);
  }, []);

  useEffect(() => {
    const isStatic = window.location.search.includes("static-reconstruction");
    if (isStatic) {
      const staticTimer = window.setTimeout(() => {
        setStaticReconstruction(true);
        setOpening(false);
      }, 0);
      return () => window.clearTimeout(staticTimer);
    }
    const seen = sessionStorage.getItem(OPENING_KEY) === "1";
    const revealTimer = window.setTimeout(() => setOpening(!seen), 0);
    if (seen) return () => window.clearTimeout(revealTimer);

    const timer = window.setTimeout(
      finishOpening,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 800 : 4000,
    );
    const finish = () => finishOpening();
    window.addEventListener("pointerdown", finish, { once: true });
    window.addEventListener("keydown", finish, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(revealTimer);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
    };
  }, [finishOpening]);

  useEffect(() => {
    if (opening !== false || state !== "IDLE" || sessionStorage.getItem(EXPLORED_KEY) === "1") {
      return;
    }
    const timer = window.setTimeout(() => setHint(true), 1700);
    return () => window.clearTimeout(timer);
  }, [opening, state]);

  useEffect(() => () => {
    if (intentTimer.current) clearTimeout(intentTimer.current);
    if (enterTimer.current) clearTimeout(enterTimer.current);
  }, []);

  const markExplored = useCallback(() => {
    sessionStorage.setItem(EXPLORED_KEY, "1");
    setHint(false);
  }, []);

  const showPreview = useCallback((next: HubPreview, delay = 0) => {
    if (state === "ENTERING") return;
    if (intentTimer.current) clearTimeout(intentTimer.current);
    const apply = () => {
      setState(next);
      if (next === "LEFT_PREVIEW" || next === "RIGHT_PREVIEW") markExplored();
    };
    if (delay) intentTimer.current = setTimeout(apply, delay);
    else apply();
  }, [markExplored, state]);

  const enter = useCallback((target: HubDestination) => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (intentTimer.current) clearTimeout(intentTimer.current);
    markExplored();
    setEnterTarget(target);
    setState("ENTERING");
    const delay = target === "RIGHT" ? 900 : 720;
    enterTimer.current = setTimeout(() => {
      if (target === "LEFT") {
        router.push("/experience");
        return;
      }
      router.push(target === "RIGHT" ? "/projects" : "/about");
      setEnterTarget(null);
      setState("IDLE");
    }, delay);
  }, [markExplored, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreview("LEFT_PREVIEW");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showPreview("RIGHT_PREVIEW");
      } else if (event.key === "Escape") {
        event.preventDefault();
        showPreview("IDLE");
      } else if ((event.key === "Enter" || event.key === " ") && event.target === document.body) {
        if (state === "LEFT_PREVIEW" || state === "RIGHT_PREVIEW") {
          event.preventDefault();
          enter(state === "LEFT_PREVIEW" ? "LEFT" : "RIGHT");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enter, showPreview, state]);

  const onWorldPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !world.current ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const previous = lastPointer.current;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    if (opening !== false ||
      (!previous && event.movementX === 0 && event.movementY === 0) ||
      (previous && previous.x === event.clientX && previous.y === event.clientY)) return;
    // Hit-testing only on new movement avoids hover caused by revealing/moving Peiwen.
    const target = event.target as Element;
    const next: HubPreview = target.closest("#about") ? "ABOUT_HOVER"
      : target.closest("#experience") ? "LEFT_PREVIEW"
      : target.closest("#projects") ? "RIGHT_PREVIEW" : "IDLE";
    if (pointerZone.current !== next) {
      pointerZone.current = next;
      showPreview(next, next === "IDLE" ? 420 : next === "ABOUT_HOVER" ? 0 : 220);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    world.current.style.setProperty("--parallax-x", `${x * -4}px`);
    world.current.style.setProperty("--parallax-y", `${y * -2}px`);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    lastPointerType.current = event.pointerType;
    pointerStart.current = { x: event.clientX, y: event.clientY, type: event.pointerType };
    ignoreTouchClick.current = false;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.type !== "touch") return;
    const deltaX = event.clientX - start.x;
    const preview = previewFromSwipe(deltaX);
    if (preview !== "IDLE" && Math.abs(deltaX) > Math.abs(event.clientY - start.y)) {
      ignoreTouchClick.current = true;
      showPreview(preview);
    }
  };

  const onZoneClick = (target: "LEFT" | "RIGHT") => {
    if (ignoreTouchClick.current) {
      ignoreTouchClick.current = false;
      return;
    }
    const preview = target === "LEFT" ? "LEFT_PREVIEW" : "RIGHT_PREVIEW";
    if (lastPointerType.current === "touch" && state !== preview) showPreview(preview);
    else enter(target);
  };

  const visualState = state === "ENTERING" && enterTarget ? `ENTERING_${enterTarget}` : state;

  return (
    <main
      ref={world}
      className={styles.hub}
      data-opening={opening === null ? "checking" : opening ? "active" : "done"}
      data-state={visualState}
      data-visual={staticReconstruction ? "static" : "interactive"}
      onPointerMove={onWorldPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <a className={styles.skipLink} href="#hub-navigation">Skip to navigation</a>

      <header className={styles.header}>
        <div className={styles.logoBlock}>
          <svg className={styles.logoMark} viewBox="0 0 52 64" aria-hidden="true">
            <path d="M25 59 C26 43 27 25 35 7 M27 42 C18 37 13 30 12 21 M28 34 C37 31 43 25 45 17 M26 49 C17 47 10 42 7 35" />
            <path d="M12 21 C9 15 12 9 18 6 C19 13 17 18 12 21 M45 17 C40 17 36 14 35 9 C41 9 44 12 45 17 M7 35 C4 30 5 25 9 22 C12 28 11 32 7 35" />
          </svg>
          <span><Link className={styles.logo} href="/" aria-label="Peiwen Zhang, Home">Peiwen Zhang</Link><span className={styles.logoMeta}>HCI · PRODUCT · CREATIVE TECH</span></span>
        </div>
        <nav id="hub-navigation" aria-label="Primary navigation">
          <Link href="/" aria-current="page">Home</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/#playground" scroll={false}>Playground</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className={styles.headerTools} aria-label="Language and music controls">
          <span>中 / <b>EN</b></span><span className={styles.record} aria-hidden="true"><i /> </span><span className={styles.musicNote} aria-hidden="true">♪</span>
        </div>
      </header>

      <section className={styles.scene} aria-label="Peiwen's Little World">
        {staticReconstruction && <>
          <Image className={styles.staticPlate} src="/assets/home-v2/home-static-scene-v2.webp" alt="" width={1536} height={440} priority />
          <div className={styles.staticFooter} aria-hidden="true">
            <span className={styles.footerNote}><svg viewBox="0 0 34 52"><path d="M17 50 C16 37 16 23 18 7 M17 28 C10 25 6 20 6 14 M17 22 C24 21 29 17 30 11" /><circle cx="6" cy="13" r="3" /><circle cx="30" cy="10" r="3" /></svg><span>Different places,<br />same curious me.</span></span>
            <span className={`${styles.footerNote} ${styles.footerRight}`}><svg viewBox="0 0 34 52"><path d="M16 50 C17 37 18 21 25 5 M17 31 C10 28 7 23 8 17 M20 23 C27 20 30 15 30 10" /><path d="M8 17 Q3 14 4 9 M30 10 Q27 5 29 2" /></svg><span>More to come...</span></span>
          </div>
        </>}
        <div className={styles.heroIdentity}>
          <h1>Peiwen Zhang</h1>
          <p>A small world of curiosity.</p>
        </div>
        <div className={`${styles.layer} ${styles.sky}`} aria-hidden="true">
          <svg className={styles.cloudOne} viewBox="0 0 420 208">
            <defs>
              <filter id="hub-pencil" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values=".81 0 0 0 .19  0 .82 0 0 .18  0 0 .84 0 .16  0 0 0 1 0" />
              </filter>
              <filter id="hub-cloud-wash" x="-10%" y="-20%" width="120%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="grain" />
                <feDisplacementMap in="SourceGraphic" in2="grain" scale="5" />
                <feGaussianBlur stdDeviation=".6" />
              </filter>
              <radialGradient id="hub-cloud-color">
                <stop stopColor="#c9cdd4" stopOpacity=".65" />
                <stop offset="1" stopColor="#e7dfcf" stopOpacity=".08" />
              </radialGradient>
              <g id="hub-cloud-drawing">
                <g fill="url(#hub-cloud-color)" stroke="none" filter="url(#hub-cloud-wash)">
                  <ellipse cx="122" cy="126" rx="73" ry="34" />
                  <ellipse cx="188" cy="104" rx="68" ry="54" />
                  <ellipse cx="258" cy="125" rx="73" ry="35" />
                  <ellipse cx="314" cy="145" rx="54" ry="19" />
                </g>
                <path d="M45 157 C18 151 35 138 72 138 M79 128 C68 105 102 88 132 98 M137 86 C134 52 194 42 214 75 M224 79 C259 64 288 89 280 110 M287 112 C320 104 340 125 328 136 M339 139 C382 136 398 155 362 160 M349 164 C262 170 168 164 87 168 M74 166 L48 164" />
              </g>
            </defs>
            <use href="#hub-cloud-drawing" />
          </svg>
          <svg className={styles.cloudTwo} viewBox="0 0 420 208"><use href="#hub-cloud-drawing" /></svg>
          <svg className={styles.mountains} viewBox="0 0 1440 430" preserveAspectRatio="none">
            <path d="M-40 350 C30 328 65 283 110 287 L163 244 Q176 231 191 248 L216 263 248 259 288 291 327 285 361 303 412 278 Q432 273 450 286 L479 312 522 301 564 318 606 307 651 324 689 314 730 332 777 316 820 330 873 321 920 341 986 331 1050 346 1130 333 1200 350 1290 343 1390 360 1490 351 L1490 450 L-40 450 Z" />
            <path d="M87 297 L161 248 181 244 210 271 M247 266 L287 298 327 292 M371 307 L414 284 435 283 477 318 M540 320 L567 326 607 313 M734 340 L777 323 819 337" />
          </svg>
        </div>

        <svg className={`${styles.layer} ${styles.ground}`} viewBox="0 0 1440 640" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="hub-meadow" x1="0" y1="0" x2=".35" y2="1">
              <stop stopColor="#aebc9b" /><stop offset=".46" stopColor="#d2d6b6" /><stop offset="1" stopColor="#e8dfbe" />
            </linearGradient>
            <linearGradient id="hub-path" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#e5dcc5" /><stop offset=".5" stopColor="#f5eddb" /><stop offset="1" stopColor="#fbf7ed" />
            </linearGradient>
            <filter id="hub-wash">
              <feTurbulence type="fractalNoise" baseFrequency=".055 .16" numOctaves="3" seed="8" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer><feFuncA type="linear" slope=".24" intercept=".5" /></feComponentTransfer>
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter="url(#hub-wash)">
            <path className={styles.hillBack} d="M-40 265 C130 235 265 312 465 343 S680 382 810 361 C1075 308 1190 234 1480 237 L1480 630 L-40 630 Z" />
            <path className={styles.hillFront} d="M-40 470 C230 368 395 474 681 449 C930 424 1120 310 1480 343 L1480 650 L-40 650 Z" />
          </g>
          <path className={styles.leftRoad} d="M740 526 C586 493 386 496 230 440 C117 397 298 376 348 341 C370 319 290 307 260 298 C294 311 393 321 365 348 C320 389 159 407 254 432 C407 474 568 459 760 487 Z" />
          <path className={styles.leftRoadLine} d="M740 526 C586 493 386 496 230 440 C117 397 298 376 348 341 M760 487 C568 459 407 474 254 432 C159 407 320 389 365 348" />
          <path className={styles.rightRoad} d="M380 640 C420 564 652 510 781 488 C976 453 988 434 1106 355 L1138 354 C1040 457 1020 466 802 518 C653 553 498 595 480 640 Z" />
          <path className={styles.rightRoadLine} d="M380 640 C420 564 652 510 781 488 C976 453 988 434 1106 355 M480 640 C498 595 653 553 802 518 C1020 466 1040 457 1138 354" />
        </svg>

        <Image className={`${styles.layer} ${styles.treeLeft}`} src="/assets/world/tree-v1.webp" alt="" width={522} height={860} loading="eager" />
        <Image className={`${styles.layer} ${styles.treeRight}`} src="/assets/world/tree-v1.webp" alt="" width={522} height={860} loading="eager" />

        <svg className={`${styles.layer} ${styles.house}`} viewBox="330 90 570 660" aria-hidden="true">
          <path fill="#faf6e9" d="M420 542 L544 320 L805 579 L780 709 L668 725 L426 709 Z" />
          <image href="/assets/hub/house-drawing.webp" x="330" y="90" width="570" height="660" />
          <path className={styles.roofWash} d="M545 310 Q579 309 617 326 L824 552 793 570 770 561 747 567 714 557 687 562 Z" />
          <path className={styles.window} d="M529 425 L564 422 L566 489 L527 489 Z M453 574 L504 570 L510 635 L454 633 Z M741 608 L777 608 L769 647 L732 648 Z" />
          <path className={styles.door} d="M556 583 L567 585 L568 722 L556 721 Z" />
        </svg>
        <Image className={`${styles.layer} ${styles.fence}`} src="/assets/hub/fence-drawing.webp" alt="" width={600} height={289} loading="eager" />

        <div className={`${styles.layer} ${styles.plants}`} aria-hidden="true">
          <Image src="/assets/world/flowers-1.webp" alt="" width={400} height={250} loading="eager" />
          <Image src="/assets/world/grass-tuft-2.webp" alt="" width={400} height={250} loading="eager" />
          <Image src="/assets/world/flowers-3.webp" alt="" width={400} height={250} loading="eager" />
        </div>
        <div className={`${styles.layer} ${styles.roadside}`} aria-hidden="true">
          <Image src="/assets/world/flowers-2.webp" alt="" width={100} height={100} />
          <Image src="/assets/world/grass-tuft-1.webp" alt="" width={100} height={100} />
          <Image src="/assets/world/flowers-2.webp" alt="" width={100} height={100} />
          <Image src="/assets/world/grass-tuft-3.webp" alt="" width={100} height={100} />
          <Image src="/assets/world/flowers-2.webp" alt="" width={100} height={100} />
        </div>

        <button id="experience" className={`${styles.intentZone} ${styles.leftZone}`} aria-label="Preview Experience. Click to walk there."
          onFocus={(event) => event.currentTarget.matches(":focus-visible") && showPreview("LEFT_PREVIEW")}
          onClick={() => onZoneClick("LEFT")} />
        <button id="projects" className={`${styles.intentZone} ${styles.rightZone}`} aria-label="Preview Projects. Click to enter the house."
          onFocus={(event) => event.currentTarget.matches(":focus-visible") && showPreview("RIGHT_PREVIEW")}
          onClick={() => onZoneClick("RIGHT")} />

        <div className={styles.characterPosition}>
          <button id="about" className={styles.characterButton} aria-label="About me. Meet Peiwen."
            onClick={() => enter("ABOUT")}>
            <span className={styles.characterArt} aria-hidden="true">
              <Image className={styles.idlePeiwen} src="/assets/hub/peiwen-idle-cutout.png" alt="" width={190} height={270} priority />
              <Image className={styles.leftPeiwen} src="/assets/hub/peiwen-walk-left-cutout.png" alt="" width={210} height={315} priority />
              <Image className={styles.rightPeiwen} src="/assets/hub/peiwen-walk-right-cutout.png" alt="" width={200} height={315} priority />
            </span>
            <svg className={styles.emphasis} viewBox="0 0 100 100" aria-hidden="true"><path d="M13 37 l-10 -7 M20 23 l-4 -12 M82 31 l10 -8" /></svg>
          </button>
        </div>

        <div className={`${styles.destination} ${styles.leftCopy}`} aria-hidden={state !== "LEFT_PREVIEW"}>
          <p>Experience</p><span>How I got here.</span>
        </div>
        <div className={`${styles.destination} ${styles.rightCopy}`} aria-hidden={state !== "RIGHT_PREVIEW"}>
          <p>Projects</p><span>What I built.</span>
        </div>
        <div className={`${styles.destination} ${styles.aboutCopy}`} aria-hidden={state !== "ABOUT_HOVER"}>
          <p>About me</p><span>Meet Peiwen.</span>
        </div>

        <div className={styles.prompt}>
          <p>Where would you like to go?</p>
          <span className={hint && state === "IDLE" ? styles.hintVisible : ""}>
            <span className={styles.mouseHint}>← Move to explore →</span>
            <span className={styles.swipeHint}>Swipe to wander</span>
          </span>
        </div>
        <p className={styles.srOnly} aria-live="polite">{announcement}</p>
        <span id="playground" className={styles.hashTarget} aria-hidden="true" />
      </section>

      <section className={styles.opening} aria-hidden={opening !== true}>
        <div className={styles.openingTitle}><p>Peiwen Zhang</p><span>A small world of curiosity.</span></div>
        <svg className={styles.openingSeed} viewBox="0 0 80 100" aria-hidden="true">
          <path className={styles.seedStem} d="M40 36 C39 50 43 64 49 78" />
          <g className={styles.seedFluff}>
            <path d="M40 36 Q17 35 10 24 M40 36 Q19 29 14 17 M40 36 Q23 23 21 12 M40 36 Q28 20 28 8 M40 36 Q34 19 35 7 M40 36 Q40 18 43 6 M40 36 Q46 19 51 9 M40 36 Q53 22 59 13 M40 36 Q60 26 66 19 M40 36 Q64 32 70 26 M40 36 Q60 38 69 33" />
            <path d="M10 24 Q7 21 8 18 M14 17 Q11 14 13 12 M21 12 Q18 9 20 7 M28 8 Q26 5 28 3 M35 7 Q33 4 35 2 M43 6 Q43 3 46 2 M51 9 Q53 5 55 5 M59 13 Q63 9 65 11 M66 19 Q70 16 72 18 M70 26 Q74 24 75 26 M69 33 Q73 32 75 34" />
          </g>
          <path className={styles.seedBody} d="M49 77 C46 78 48 87 54 91 C56 87 53 79 49 77 Z" />
        </svg>
        <p className={styles.welcome}>Welcome to my little world.</p>
      </section>
    </main>
  );
}
