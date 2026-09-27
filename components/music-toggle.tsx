"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { getSoundState, getSoundStateServer, playTrack, subscribeMusic, toggleMusic } from "./music-store";
import { TRACKS } from "./sound-library";
import styles from "./music-toggle.module.css";

/**
 * The little record in the header (2026-09-25): it spins while the sound is on, and a
 * click opens a small paper panel — play / pause and the playlist. Music is on by
 * default; pausing stops the music only — the snow outside and the little sounds
 * (page turns, footsteps, the cat) stay on.
 * State lives in components/music-store.ts.
 *
 * Used by components/site-header.tsx on every page.
 */
export function MusicToggle({ className }: { className?: string }) {
  const sound = useSyncExternalStore(subscribeMusic, getSoundState, getSoundStateServer);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const current = TRACKS[sound.track];

  // Escape or a click outside closes; focus goes into the panel when it opens
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus({ preventScroll: true });
      }
    }
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={sound.playing ? `Music: ${current.title} is playing. Open the music panel` : "Music is paused. Open the music panel"}
        title={sound.playing ? `♪ ${current.title}` : "Music & sounds"}
        onClick={() => setOpen((v) => !v)}
        data-playing={sound.playing || undefined}
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

      {open && (
        <div ref={panelRef} id={panelId} className={styles.panel} role="dialog" aria-label="Music and sounds">
          <div className={styles.head}>
            <button
              type="button"
              className={styles.play}
              onClick={toggleMusic}
              aria-label={sound.playing ? "Pause the music" : "Play the music"}
            >
              {sound.playing ? (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <rect x="5" y="4" width="3.4" height="12" rx="1" />
                  <rect x="11.6" y="4" width="3.4" height="12" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6 4.2v11.6c0 .6.7 1 1.2.7l9-5.8a.8.8 0 0 0 0-1.4l-9-5.8C6.7 3.2 6 3.6 6 4.2z" />
                </svg>
              )}
            </button>
            <p className={styles.now}>
              <span className={styles.label}>{sound.playing ? "now playing" : "music paused"}</span>
              <span className={styles.nowTitle}>{current.title}</span>
            </p>
          </div>

          <ol className={styles.tracks} aria-label="Playlist">
            {TRACKS.map((t, i) => {
              const isCurrent = i === sound.track;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`${styles.track} ${isCurrent ? styles.trackOn : ""}`}
                    aria-current={isCurrent && sound.playing ? "true" : undefined}
                    onClick={() => playTrack(i)}
                  >
                    <span className={styles.trackMark} aria-hidden="true">
                      {isCurrent && sound.playing ? "♪" : i + 1}
                    </span>
                    <span className={styles.trackTitle}>{t.title}</span>
                    <span className={styles.trackArtist}>{t.artist}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className={styles.credit}>Music &amp; sounds from Pixabay</p>
        </div>
      )}
    </div>
  );
}
