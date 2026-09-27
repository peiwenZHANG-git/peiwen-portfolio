"use client";

import { EFFECTS, SNOW, TRACKS, trackSources, type EffectName } from "./sound-library";

/**
 * Shared state for everything the site plays (rewritten 2026-09-25).
 *
 *   music    nine gentle tracks (components/sound-library.ts) in shuffle: every visit
 *            starts on a random one, and when a track ends another random one follows
 *            (never the same one twice in a row)
 *   snow     a quiet loop of snowfall outside the window
 *   effects  small one-shots: a page turning in the About notebook, the attic cat
 *
 * The audio elements are created here, once, so they survive client-side navigation.
 * The controls live in the record panel in the site header (components/music-toggle).
 * Both sides read this module through useSyncExternalStore.
 *
 * Rules (Peiwen, 2026-09-25): sound is ON by default — music, snow and effects.
 * The record panel's play / pause is for the MUSIC only: the snow outside and the
 * little sounds (pages, footsteps, the cat) always stay on. A music pause is
 * remembered in localStorage.
 * Browsers refuse to autoplay audible media, so on a first visit the sound starts with
 * the visitor's first click or key press (on Home that is opening the window).
 * Volumes are low and fade in/out, unless the visitor asked for reduced motion.
 */

const STORAGE_KEY = "pw-sound";
const MUSIC_VOLUME = 0.22;
const SNOW_VOLUME = 0.1;
const EFFECT_VOLUME = 0.32;
/** per-effect overrides: the footsteps sit well under everything (Peiwen, 2026-09-25) */
const EFFECT_VOLUMES: Partial<Record<EffectName, number>> = { steps: 0.14 };
const FADE_MS = 700;

export type SoundState = {
  playing: boolean;
  track: number;
};

const SERVER_STATE: SoundState = { playing: false, track: 0 };
let state: SoundState = SERVER_STATE;

let music: HTMLAudioElement | null = null;
let snow: HTMLAudioElement | null = null;

// Dev hot reload swaps this module for a fresh copy without reloading the page; the
// old copy's audio would keep playing with nothing left to pause it. Silence it.
type SoundWindow = Window & { __pwSoundElements?: HTMLAudioElement[] };
if (typeof window !== "undefined") {
  for (const el of (window as SoundWindow).__pwSoundElements ?? []) el.pause();
  (window as SoundWindow).__pwSoundElements = [];
}
const fades = new Map<HTMLAudioElement, number>();
let armed: (() => void) | null = null;
const listeners = new Set<() => void>();

function set(patch: Partial<SoundState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ music: state.playing, track: state.track }),
    );
  } catch {
    /* not remembering the choice is survivable */
  }
}

export function subscribeMusic(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function getSoundState() {
  return state;
}
export function getSoundStateServer() {
  return SERVER_STATE;
}
/** kept for older callers: is the music playing? */
export function getMusicPlaying() {
  return state.playing;
}
export function getMusicPlayingServer() {
  return false;
}

/* ---- plumbing ---- */

function canPlayOgg() {
  return typeof Audio !== "undefined" && new Audio().canPlayType("audio/ogg; codecs=vorbis") !== "";
}
function pick(src: { ogg: string; mp3: string }) {
  return canPlayOgg() ? src.ogg : src.mp3;
}
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fadeTo(el: HTMLAudioElement, target: number, done?: () => void) {
  const running = fades.get(el);
  if (running !== undefined) cancelAnimationFrame(running);
  fades.delete(el);
  if (reducedMotion()) {
    el.volume = target;
    done?.();
    return;
  }
  const from = el.volume;
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / FADE_MS);
    el.volume = from + (target - from) * k;
    if (k < 1) {
      fades.set(el, requestAnimationFrame(step));
    } else {
      fades.delete(el);
      done?.();
    }
  };
  fades.set(el, requestAnimationFrame(step));
}

function disarm() {
  if (!armed) return;
  window.removeEventListener("pointerdown", armed);
  window.removeEventListener("keydown", armed);
  armed = null;
}

/** play, or — if the browser blocks it — try again on the visitor's first gesture */
function playOrWait(el: HTMLAudioElement, volume: number) {
  el.volume = 0;
  el.play().then(
    () => fadeTo(el, volume),
    () => {
      if (armed) return;
      const onGesture = () => {
        disarm();
        if (state.playing && music) playOrWait(music, MUSIC_VOLUME);
        if (snow && snow.paused) playOrWait(snow, SNOW_VOLUME);
      };
      armed = onGesture;
      window.addEventListener("pointerdown", onGesture, { once: true });
      window.addEventListener("keydown", onGesture, { once: true });
    },
  );
}

function ensureElements() {
  if (music || typeof Audio === "undefined") return;
  music = new Audio();
  music.preload = "none";
  music.addEventListener("ended", () => {
    // shuffle: any other track
    const next = randomTrack(state.track);
    set({ track: next });
    loadTrack(next);
    if (music) playOrWait(music, MUSIC_VOLUME);
  });
  snow = new Audio();
  snow.preload = "none";
  snow.loop = true;
  snow.src = pick(SNOW);
  (window as SoundWindow).__pwSoundElements = [music, snow];
}

/** a random track, never `not` */
function randomTrack(not = -1) {
  let i = Math.floor(Math.random() * (TRACKS.length - (not >= 0 ? 1 : 0)));
  if (not >= 0 && i >= not) i += 1;
  return i;
}

function loadTrack(index: number) {
  if (!music) return;
  music.src = pick(trackSources(TRACKS[index].id));
}

/* ---- music ---- */

/** the snow outside the window: always on once the site may make sound */
function startSnow() {
  ensureElements();
  if (snow && snow.paused) playOrWait(snow, SNOW_VOLUME);
}

export function startMusic() {
  ensureElements();
  if (!music) return;
  if (!music.src) loadTrack(state.track);
  set({ playing: true });
  playOrWait(music, MUSIC_VOLUME);
  startSnow();
}

/** pauses the music only; the snow and the little sounds carry on */
export function stopMusic() {
  set({ playing: false });
  const el = music;
  if (el) fadeTo(el, 0, () => el.pause());
}

export function toggleMusic() {
  if (state.playing) stopMusic();
  else startMusic();
}

/** jump to a track (and play it) */
export function playTrack(index: number) {
  ensureElements();
  if (!music) return;
  set({ track: index, playing: true });
  loadTrack(index);
  playOrWait(music, MUSIC_VOLUME);
  startSnow();
}

/* ---- effects ---- */

const effectCache = new Map<EffectName, HTMLAudioElement>();

/** A small sound for something the visitor just did (a page turning, the cat).
    Always on — pausing the music doesn't silence these.
    `ms` cuts a longer sound short with a quick fade (footsteps for one walk), and
    `randomStart` starts somewhere inside it so repeated walks don't sound identical. */
export function playEffect(name: EffectName, opts: { ms?: number; randomStart?: boolean } = {}) {
  if (typeof Audio === "undefined") return;
  let base = effectCache.get(name);
  if (!base) {
    base = new Audio(pick(EFFECTS[name]));
    base.preload = "auto";
    effectCache.set(name, base);
  }
  const shot = base.cloneNode(true) as HTMLAudioElement;
  shot.volume = EFFECT_VOLUMES[name] ?? EFFECT_VOLUME;
  if (opts.randomStart) {
    const setStart = () => {
      const room = shot.duration - (opts.ms ?? 0) / 1000 - 0.2;
      if (room > 0) shot.currentTime = Math.random() * room;
    };
    if (shot.readyState >= 1) setStart();
    else shot.addEventListener("loadedmetadata", setStart, { once: true });
  }
  shot.play().catch(() => {
    /* blocked or not loaded: an effect is never worth an error */
  });
  if (opts.ms) {
    window.setTimeout(() => fadeTo(shot, 0, () => shot.pause()), Math.max(0, opts.ms - 450));
  }
}

/* ---- lifecycle (components/site-audio.tsx) ---- */

/** called once on mount: restore what the visitor chose last time */
export function resumeStoredChoice() {
  let saved: Partial<{ music: boolean }> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch {
    /* private mode or blocked storage: just use the defaults */
  }
  // shuffle: each visit starts on a random track
  state = { playing: false, track: randomTrack() };
  for (const listener of listeners) listener();
  // music on by default (only a remembered pause keeps it off); the snow always
  if (saved.music !== false) startMusic();
  else startSnow();
}

export function teardownMusic() {
  for (const frame of fades.values()) cancelAnimationFrame(frame);
  fades.clear();
  disarm();
}

/** kept for older callers; the elements are created here now */
export function registerAudio(element: HTMLAudioElement | null) {
  void element;
}
