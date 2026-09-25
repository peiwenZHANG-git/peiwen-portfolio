"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./page-transition.module.css";

/**
 * Site-wide page-to-page transition — "Airy Paper Dissolve" family.
 *
 * v5 (2026-09-22, same day, third live-feedback round): after three rounds of "still
 * feels fast" on a single global fade (v4 → v4.1 → v4.2, 470ms → 680ms → 880ms), the
 * user asked for a choreography change, not another timing tweak:
 *
 *   GLOBAL DEPARTURE (this file, unchanged in spirit) + PAGE-SPECIFIC ARRIVAL
 *   (each destination page choreographs its own reveal, in its own CSS module).
 *
 * This file now owns ONLY the old page leaving:
 *   1. DEPART — opacity 1→0, translateY 0→-3px, blur 0→0.5px, ~420ms.
 *   2. A short "warm paper breathing gap" (~80ms) where the departed page sits
 *      invisible (still `#f7f3e9` behind it, via `.backdrop` below) — route switch
 *      happens ~60ms into that gap (~480ms from the click).
 *   3. Phase resets to idle once the new route has actually mounted.
 *
 * It does NOT drive any "arrival" animation for the new page anymore — no more
 * `.arriving`/`enterFrom` concept. `stageClassName`/`onStageTransitionEnd` are still
 * exposed exactly as before, applied by each page to its own main-content wrapper —
 * but now they only ever do anything (fade the content out) while THAT page is the one
 * being navigated AWAY from. The moment a page mounts as a destination, its wrapper is
 * simply idle (opaque, untransformed) — invisible-as-a-mechanism, not literally
 * invisible. Each destination page's OWN inner elements (a "visual" region, staggered
 * text groups) carry their own `animation: … both` CSS, keyed to fire automatically on
 * mount, entirely independent of this file. See `app/experience/experience.module.css`
 * (`.revealVisual` / `.revealHeading` / `.revealStickers` / `.revealFacts`) and
 * `app/about/about-book.module.css` + `about.module.css` (`.revealBook` /
 * `.revealHeading` / `.revealTags` / `.revealStats`) for those.
 *
 * This split is deliberate, not incidental: stacking a global "new page fades in" on
 * top of a page-specific fade (what v4/v4.1/v4.2 risked once per-page choreography was
 * added) makes content look soft/swimmy — two systems both writing to `opacity` on
 * overlapping timelines. Keeping this file's classes on the OUTER wrapper (only ever
 * non-idle while departing) and each page's own reveal animations on INNER elements
 * avoids that: the outer wrapper's opacity is always 1 by the time a page is being
 * looked at as a destination, so nothing here ever fights with a page's own reveal.
 *
 * Home is not given its own arrival choreography this round (not asked for) — it
 * simply appears once mounted, same as always.
 *
 * `usePageTransition().navigate(href, opts)` keeps its exact call signature.
 * `prefers-reduced-motion` and same-route/hash-only navigations still skip straight to
 * `router.push`. Reduced motion for each page's own reveal animations is handled in
 * their own CSS (gated behind `@media (prefers-reduced-motion: no-preference)`, so the
 * default/fallback state is simply "fully visible, no animation").
 *
 * History: v4 introduced "Airy Paper Dissolve" as one global fade (depart+arrive both
 * owned by this file, ~470ms). v4.1/v4.2 were pure timing passes on that same shape
 * (→680ms, →880ms) that kept feeling too fast because departure and arrival were still
 * symmetric halves of one crossfade. v5 is the first round to change the shape itself.
 */

type NavigateOptions = {
  scroll?: boolean;
  /** Accepted for API compatibility with existing call sites; unused by this design. */
  originX?: number;
  originY?: number;
  /** "dive" (2026-09-24): used by Home's desk entrances. The page camera zooms into the
      clicked object (Home drives that transform on its own inner layer); this file
      only stretches the fade to match, so the zoom stays visible before the paper
      takes over. Everything else about the departure is unchanged. */
  departure?: "default" | "dive";
};

type Phase = "idle" | "departing" | "departed";

const DEPART_MS = 420;
/** Total "warm paper breathing gap" window after departure finishes and before this
    file resets to idle (420–500ms from the click). */
const GAP_MS = 80;
/** How far into that gap the real navigation fires — ~480ms from the click. */
const ROUTE_SWITCH_DELAY_MS = 60;

type StageContextValue = {
  navigate: (href: string, opts?: NavigateOptions) => void;
  /** Apply to a page's own OUTER main-content element(s) — never to its header, and
      never to the inner elements a page uses for its own arrival reveal. Only ever
      non-idle while THIS page is the one being navigated away from. */
  stageClassName: string;
  /** Attach to exactly one element per page (the primary/largest content region that
      also carries `stageClassName`) to drive the departure phase machine's timing. */
  onStageTransitionEnd: (e: TransitionEvent<HTMLElement>) => void;
};

const PageTransitionContext = createContext<StageContextValue | null>(null);

// useSyncExternalStore instead of useState+useEffect: this subscribes directly to the
// browser's own matchMedia state rather than mirroring it into local state via a
// synchronous setState-in-effect (which lint flags as a cascading-render risk — an
// extra render pass right after mount, on every load). getServerSnapshot returns the
// same conservative default (no reduced motion) the old effect-based version started
// with before its first correction, so there's no behavior change, just no extra pass.
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<"default" | "dive">("default");
  const pendingHref = useRef<string | null>(null);
  const pendingScroll = useRef<boolean | undefined>(undefined);
  const prevPathname = useRef(pathname);
  // Bumped on every real navigate() call so `.paperLight` below can key off it and
  // remount fresh each time — a clean CSS-animation restart with no manual class
  // add/remove/reflow dance. State, not a ref: it's read during render (as a JSX
  // `key`), and reading a ref's `.current` during render is unsafe (lint-flagged) —
  // it can observe a mutation that happened outside React's render pass. Setting it
  // alongside `setPhase` in the same event handler still batches into one render.
  const [transitionId, setTransitionId] = useState(0);

  const navigate = useCallback(
    (href: string, opts: NavigateOptions = {}) => {
      const targetPath = href.split("#")[0] || "/";
      const isSameRoute = targetPath === pathname || targetPath === "";

      if (isSameRoute || reducedMotion) {
        router.push(href, opts.scroll === undefined ? undefined : { scroll: opts.scroll });
        return;
      }

      setTransitionId((id) => id + 1);
      setMode(opts.departure ?? "default");
      pendingHref.current = href;
      pendingScroll.current = opts.scroll;
      setPhase("departing");
    },
    [pathname, reducedMotion, router],
  );

  // The departure fade has finished (page is fully invisible). Hold it there, invisible,
  // for the short warm-paper gap, and fire the real navigation partway through it.
  const handleDeparted = useCallback(() => {
    setPhase("departed");
    const t = setTimeout(() => {
      if (pendingHref.current) {
        router.push(pendingHref.current, pendingScroll.current === undefined ? undefined : { scroll: pendingScroll.current });
        pendingHref.current = null;
      }
    }, ROUTE_SWITCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [router]);

  // Once the new route has actually mounted (pathname changed) while held in the
  // departed/invisible state, wait out the rest of the gap, then reset to idle. This
  // file's job is done at that point — the new page's own CSS takes over entirely.
  useEffect(() => {
    if (phase === "departed" && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      const t = setTimeout(() => setPhase("idle"), Math.max(GAP_MS - ROUTE_SWITCH_DELAY_MS, 0));
      return () => clearTimeout(t);
    }
    prevPathname.current = pathname;
  }, [pathname, phase]);

  const onStageTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLElement>) => {
      if (e.propertyName !== "opacity") return;
      if (phase === "departing") handleDeparted();
    },
    [phase, handleDeparted],
  );

  const diveClass = mode === "dive" ? ` ${styles.dive}` : "";
  const stageClassName =
    phase === "departing"
      ? `${styles.stage} ${styles.departing}${diveClass}`
      : phase === "departed"
        ? `${styles.stage} ${styles.departed}${diveClass}`
        : styles.stage;

  return (
    <PageTransitionContext.Provider value={{ navigate, stageClassName, onStageTransitionEnd }}>
      {/* Always mounted, never animated — see the top comment. Sits behind every
          route's own full-bleed background so the instant between the old page
          unmounting and the new one mounting reads as "the same paper", not a flash of
          the (mismatched, unrelated) lavender token still declared on :root. */}
      <div className={styles.backdrop} aria-hidden="true" />
      {children}
      {phase !== "idle" && <div className={styles.paperLight} aria-hidden="true" key={transitionId} />}
    </PageTransitionContext.Provider>
  );
}

/** Duration of this file's own global departure phase (depart + gap). Each
    destination page's own arrival choreography runs independently after this. */
export const PAGE_TRANSITION_TOTAL_MS = DEPART_MS + GAP_MS;

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return ctx;
}
