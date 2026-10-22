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
 * Rules (Peiwen, 2026-09-25, revised 2026-10-16): sound is ON by default — music,
 * snow and effects. The record panel's play / pause is ONE switch for ALL of it:
 * pausing silences the music, the snow outside and the little sounds (pages,
 * footsteps, the cat); playing brings them all back. The pause is remembered in
 * localStorage, so a visitor who turned the sound off gets a silent site next time.
 * Browsers refuse to autoplay audible media, so unless the visitor remembered a pause,
 * the sound starts on their first gesture (pointerdown, touchstart or keydown anywhere;
 * on Home that is the click that opens the window) and fades in over ~1.5s from silence.
 * That trigger happens once per visit; afterwards only the record panel controls sound.
 * If the browser still refuses, nothing is shown as playing and the next gesture tries
 * again. Volumes are low and fade in/out; the audio fade stays under reduced motion
 * (only visual effects are skipped, in CSS).
 */

const STORAGE_KEY = "pw-sound";
const MUSIC_VOLUME = 0.22;
const SNOW_VOLUME = 0.1;
const EFFECT_VOLUME = 0.32;
/** per-effect overrides: the footsteps sit well under everything (Peiwen, 2026-09-25) */
const EFFECT_VOLUMES: Partial<Record<EffectName, number>> = { steps: 0.14 };
const FADE_MS = 700;
/** the first-gesture start rises slowly from silence */
const START_FADE_MS = 1500;

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

/** `remember: false` is for changes the visitor did not choose (a blocked autoplay) */
function set(patch: Partial<SoundState>, remember = true) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
  if (!remember) return;
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

function fadeTo(el: HTMLAudioElement, target: number, done?: () => void, ms = FADE_MS) {
  const running = fades.get(el);
  if (running !== undefined) cancelAnimationFrame(running);
  fades.delete(el);
  const from = el.volume;
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / ms);
    // floating-point overshoot (-4e-12) would make the volume setter throw
    el.volume = Math.min(1, Math.max(0, from + (target - from) * k));
    if (k < 1) {
      fades.set(el, requestAnimationFrame(step));
    } else {
      fades.delete(el);
      done?.();
    }
  };
  fades.set(el, requestAnimationFrame(step));
}

/** play from silence and fade up; resolves false if the browser refuses */
function playOrWait(el: HTMLAudioElement, volume: number, ms = FADE_MS): Promise<boolean> {
  el.volume = 0;
  return el.play().then(
    () => {
      fadeTo(el, volume, undefined, ms);
      return true;
    },
    () => false,
  );
}

/** a visitor-requested start that the browser refused: say so, don't pretend */
function failed() {
  set({ playing: false }, false);
}

/* ---- first gesture ---- */

const GESTURES = ["pointerdown", "touchstart", "keydown", "pointerup", "touchend"] as const;
let attempting = false;

function disarm() {
  if (!armed) return;
  for (const type of GESTURES) window.removeEventListener(type, armed, true);
  armed = null;
}

/** Waits for the visitor's first gesture, then starts all sound with a slow fade. The
    listeners are passive and never stop the event, so the click still opens the window
    or follows its link. Touch only counts as "user activation" for the browser on
    pointerup/touchend, so those stay armed too: the listeners are removed as soon as a
    start succeeds, not before. */
function armFirstGesture() {
  if (armed) return;
  const onGesture = () => {
    if (attempting) return;
    if (state.playing) {
      disarm();
      return;
    }
    ensureElements();
    if (!music) return;
    if (!music.src) loadTrack(state.track);
    attempting = true;
    void playOrWait(music, MUSIC_VOLUME, START_FADE_MS).then((ok) => {
      attempting = false;
      if (!ok) return;
      if (!armed) {
        // paused from the record panel while the browser was still deciding
        if (music) fadeTo(music, 0, () => music?.pause());
        return;
      }
      disarm();
      if (state.playing) return;
      set({ playing: true }, false);
      if (snow) void playOrWait(snow, SNOW_VOLUME, START_FADE_MS);
    });
  };
  armed = onGesture;
  for (const type of GESTURES) window.addEventListener(type, onGesture, { capture: true, passive: true });
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
    if (music && state.playing) void playOrWait(music, MUSIC_VOLUME).then((ok) => ok || failed());
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

/** the snow outside the window: on whenever the sound is on */
function startSnow() {
  ensureElements();
  if (snow && snow.paused) void playOrWait(snow, SNOW_VOLUME);
}

export function startMusic() {
  ensureElements();
  if (!music) return;
  if (!music.src) loadTrack(state.track);
  disarm();
  set({ playing: true });
  void playOrWait(music, MUSIC_VOLUME).then((ok) => ok || failed());
  startSnow();
}

/** turns ALL sound off: the music, the snow, and any little sound still playing */
export function stopMusic() {
  set({ playing: false });
  disarm();
  for (const el of [music, snow, ...liveEffects]) {
    if (el && !el.paused) fadeTo(el, 0, () => el.pause());
  }
  liveEffects.clear();
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
  disarm();
  void playOrWait(music, MUSIC_VOLUME).then((ok) => ok || failed());
  startSnow();
}

/* ---- effects ---- */

const effectCache = new Map<EffectName, HTMLAudioElement>();
/** effects currently sounding, so turning the sound off can silence them mid-play */
const liveEffects = new Set<HTMLAudioElement>();

/** A small sound for something the visitor just did (a page turning, the cat).
    Silent while the sound is off (the record panel's pause covers everything).
    `ms` cuts a longer sound short with a quick fade (footsteps for one walk), and
    `randomStart` starts somewhere inside it so repeated walks don't sound identical. */
export function playEffect(name: EffectName, opts: { ms?: number; randomStart?: boolean } = {}) {
  if (typeof Audio === "undefined" || !state.playing) return;
  let base = effectCache.get(name);
  if (!base) {
    base = new Audio(pick(EFFECTS[name]));
    base.preload = "auto";
    effectCache.set(name, base);
  }
  const shot = base.cloneNode(true) as HTMLAudioElement;
  liveEffects.add(shot);
  shot.addEventListener("ended", () => liveEffects.delete(shot), { once: true });
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
    window.setTimeout(
      () => fadeTo(shot, 0, () => {
        shot.pause();
        liveEffects.delete(shot);
      }),
      Math.max(0, opts.ms - 450),
    );
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
  // sound on by default, starting at the first gesture; a remembered pause keeps
  // everything silent
  if (saved.music !== false) armFirstGesture();
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
