"use client";

/**
 * Shared state for the background music.
 *
 * The <audio> element lives in app/layout.tsx (components/site-audio.tsx) so the loop
 * survives client-side navigation, but the button that controls it sits in the site
 * header — two different trees. This module is the bit in the middle: a plain
 * module-level singleton that both sides talk to, read through useSyncExternalStore.
 *
 * Rules (see design-assets/audio/MUSIC.md):
 * - Off by default; the choice is remembered in localStorage.
 * - Browsers refuse to autoplay audible media, so a resumed "on" that gets rejected
 *   arms a one-shot gesture listener instead of nagging.
 * - Volume is low and fades, unless the visitor asked for reduced motion.
 */

const STORAGE_KEY = "pw-music";
const VOLUME = 0.22;
const FADE_MS = 700;

let audio: HTMLAudioElement | null = null;
let playing = false;
let fadeFrame: number | null = null;
let armed: (() => void) | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeMusic(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMusicPlaying() {
  return playing;
}

/** Server render (and first client render) always starts from "off". */
export function getMusicPlayingServer() {
  return false;
}

export function registerAudio(element: HTMLAudioElement | null) {
  audio = element;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fadeTo(target: number, done?: () => void) {
  if (!audio) return;
  if (fadeFrame !== null) cancelAnimationFrame(fadeFrame);
  if (reducedMotion()) {
    audio.volume = target;
    done?.();
    return;
  }
  const element = audio;
  const from = element.volume;
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / FADE_MS);
    element.volume = from + (target - from) * k;
    if (k < 1) {
      fadeFrame = requestAnimationFrame(step);
    } else {
      fadeFrame = null;
      done?.();
    }
  };
  fadeFrame = requestAnimationFrame(step);
}

function disarm() {
  if (!armed) return;
  window.removeEventListener("pointerdown", armed);
  window.removeEventListener("keydown", armed);
  armed = null;
}

export function startMusic() {
  if (!audio) return;
  audio.volume = 0;
  audio.play().then(
    () => {
      disarm();
      playing = true;
      emit();
      fadeTo(VOLUME);
    },
    () => {
      // Blocked until the visitor interacts with the page: wait for that, once.
      if (armed) return;
      const onGesture = () => {
        disarm();
        startMusic();
      };
      armed = onGesture;
      window.addEventListener("pointerdown", onGesture, { once: true });
      window.addEventListener("keydown", onGesture, { once: true });
    },
  );
}

export function stopMusic() {
  disarm();
  playing = false;
  emit();
  const element = audio;
  if (!element) return;
  fadeTo(0, () => element.pause());
}

export function toggleMusic() {
  const next = !playing;
  if (next) startMusic();
  else stopMusic();
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Not remembering the choice is survivable; playing it anyway is not.
  }
}

/** Called once, when the <audio> element mounts. */
export function resumeStoredChoice() {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: stay off.
  }
  if (stored === "on") startMusic();
}

export function teardownMusic() {
  if (fadeFrame !== null) cancelAnimationFrame(fadeFrame);
  fadeFrame = null;
  disarm();
}
