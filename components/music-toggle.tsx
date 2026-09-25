"use client";

import { useSyncExternalStore } from "react";
import {
  getMusicPlaying,
  getMusicPlayingServer,
  subscribeMusic,
  toggleMusic,
} from "./music-store";
import styles from "./music-toggle.module.css";

/**
 * The background-music switch: a small vinyl record that spins while the track plays,
 * with a music note beside it.
 *
 * Sits in the header row, after the 中 / EN toggle (user decision, 2026-09-21). Used by
 * components/site-header.tsx (/experience, /about) and app/home-master.tsx (Home, which
 * has its own header markup). The <audio> element it controls lives in app/layout.tsx.
 *
 * Placeholder artwork: a plain filled record. Swap in the hand-drawn sticker when that
 * is approved — see design-assets/audio/MUSIC.md.
 */
export function MusicToggle({ className }: { className?: string }) {
  const playing = useSyncExternalStore(subscribeMusic, getMusicPlaying, getMusicPlayingServer);

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      aria-pressed={playing}
      aria-label={playing ? "Turn background music off" : "Turn background music on"}
      title={playing ? "Music on" : "Music off"}
      onClick={toggleMusic}
      data-playing={playing || undefined}
    >
      <svg className={styles.record} viewBox="0 0 34 34" aria-hidden="true">
        <circle className={styles.disc} cx="17" cy="17" r="15.4" />
        <circle className={styles.groove} cx="17" cy="17" r="10.6" />
        <circle className={styles.groove} cx="17" cy="17" r="6.4" />
        {/* A perfectly concentric record looks motionless however fast it turns, so the
            sheen and the speck on the label are what actually read as rotation. */}
        <path className={styles.sheen} d="M6.9 10.4A12.6 12.6 0 0 1 22.6 5.6" />
        <path className={styles.sheen} d="M27.4 23.3a12.6 12.6 0 0 1-9.2 6.1" />
        <circle className={styles.hole} cx="17" cy="17" r="3.2" />
        <circle className={styles.speck} cx="17" cy="13.4" r="0.95" />
      </svg>
      <svg className={styles.note} viewBox="0 0 16 22" aria-hidden="true">
        <path d="M6.4 16.6V3.4l6.4-1.7v13" />
        <ellipse cx="3.9" cy="17.6" rx="2.6" ry="2" />
        <ellipse cx="10.3" cy="15.9" rx="2.6" ry="2" />
      </svg>
    </button>
  );
}
