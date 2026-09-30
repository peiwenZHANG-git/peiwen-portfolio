"use client";

import { createContext, useContext, useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { L } from "@/components/lang";
import { handFont } from "@/app/home-fonts";
import styles from "./rotate-guard.module.css";

/**
 * Site-wide "turn your phone sideways" gate (Peiwen's decision, 2026-09-28: the whole
 * site reads better landscape-only on phones, not just About). Mounted once in
 * app/layout.tsx, wrapping every route, so there's exactly one implementation and one
 * overlay instead of each page reinventing it — this replaces the About-page-only
 * version that used to live in about-page.tsx / about-book.module.css.
 *
 * Phones only (`max-width: 600px`) — tablets in portrait (iPad etc., ~768px+) are left
 * alone, same cutoff About always used. "View anyway" is per-page: it resets on every
 * route change (see the pathname effect below), so it asks again on a fresh page
 * rather than staying dismissed for the whole visit once someone rotates back.
 *
 * `useRotateBlocked()` lets an individual page read the same boolean if it wants to
 * mark a specific region `inert` itself (About does, for its header/intro/notebook
 * separately) — but the global wrap below already makes the entire page inert while
 * blocked, so most routes don't need to touch this at all.
 */
const PHONE_PORTRAIT_QUERY = "(orientation: portrait) and (max-width: 600px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE_PORTRAIT_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function getSnapshot() {
  return window.matchMedia(PHONE_PORTRAIT_QUERY).matches;
}
function getServerSnapshot() {
  return false;
}

const RotateBlockedContext = createContext(false);

export function useRotateBlocked() {
  return useContext(RotateBlockedContext);
}

export function RotateGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const portrait = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [viewAnyway, setViewAnyway] = useState(false);
  const titleId = useId();
  // Resets "View anyway" on every route change. Adjusted during render (React's
  // documented pattern for "reset state when a prop changes") rather than in an
  // effect, which would call setState synchronously mid-effect and trigger
  // react-hooks/set-state-in-effect — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setViewAnyway(false);
  }

  const blocked = portrait && !viewAnyway;

  return (
    <RotateBlockedContext.Provider value={blocked}>
      {/* display: contents — this wrapper only exists to carry `inert` down onto
          every route's real content while the card below covers the screen. */}
      <div className={styles.inertWrap} inert={blocked || undefined}>
        {children}
      </div>
      {blocked && (
        <div
          className={`${styles.rotate} ${handFont.variable}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <svg
            viewBox="0 0 120 90"
            width="120"
            height="90"
            fill="none"
            stroke="#8c6a52"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="14" y="10" width="34" height="62" rx="6" />
            <path d="M27 64h8" />
            <rect x="58" y="42" width="54" height="30" rx="6" strokeDasharray="4 4" />
            <path d="M40 4c22-4 40 8 44 28" />
            <path d="M78 26l6 7 6-8" />
          </svg>
          {/* names the dialog in whichever language is showing (the hidden one is display: none) */}
          <p id={titleId} className={styles.rotateTitle}>
            <L en="Turn your phone sideways" zh="把手机横过来" />
          </p>
          <p className={styles.rotateText}>
            <L en="It looks better this way." zh="这个小世界横着看最舒服。" />
          </p>
          <p className={styles.rotateHint}>
            <L en="Best viewed on a computer." zh="推荐用电脑网页版观看，体验更完整。" />
          </p>
          <button type="button" className={styles.rotateBtn} onClick={() => setViewAnyway(true)}>
            <L en="View anyway" zh="还是要看看" />
          </button>
        </div>
      )}
    </RotateBlockedContext.Provider>
  );
}
