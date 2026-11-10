"use client";

import { useSyncExternalStore } from "react";
import styles from "./swipe-hint.module.css";

/*
 * A one-off "swipe here" gesture for landscape phones (2026-11-09, real-phone test).
 * The companion's written hints covered a third of a ~294px-tall screen, so on phones
 * the places that scroll sideways (the Projects rope, the Experience road) show a small
 * line-drawn hand that sweeps across twice and fades. No words, nothing to dismiss.
 *
 * Only shown under (orientation: landscape) and (max-height: 500px), never with reduced
 * motion (swipe-hint.module.css), and once per page per visit (sessionStorage).
 * Decorative: aria-hidden, no pointer events.
 */

function subscribeNothing() {
  return () => {};
}

export function SwipeHint({ id, className = "" }: { id: string; className?: string }) {
  const key = `peiwen-swipe-hint-${id}`;
  const show = useSyncExternalStore(
    subscribeNothing,
    () => {
      try {
        return window.sessionStorage.getItem(key) !== "1";
      } catch {
        return true;
      }
    },
    () => false,
  );
  if (!show) return null;

  function done() {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: it simply shows again next visit */
    }
  }

  return (
    <span className={`${styles.hint} ${className}`} aria-hidden="true" onAnimationEnd={done}>
      <svg className={styles.hand} viewBox="0 0 32 32">
        <path d="M12.5 19V7.6a2 2 0 0 1 4 0V15" />
        <path d="M16.5 13.6a2 2 0 0 1 4 0V16" />
        <path d="M20.5 15a2 2 0 0 1 4 0v4.6c0 4.6-3 8.4-7.8 8.4h-1.3c-2.6 0-4.6-1.3-6-3.3l-3.2-4.5a1.9 1.9 0 0 1 3-2.3l3.3 3.6" />
      </svg>
    </span>
  );
}
