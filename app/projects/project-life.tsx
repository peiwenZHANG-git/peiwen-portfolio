"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./projects.module.css";

/**
 * Small signs of life in the attic (desktop stage only): Peiwen now and then talks to
 * herself in a little hand-lettered bubble, and the sleeping cat answers a poke with a
 * meow. Everything here is decoration on top of the painting: the bubbles are hidden
 * from assistive tech, the two hotspots are ordinary buttons, and nothing runs on its own
 * when the visitor prefers reduced motion. The meow is synthesised (no audio file) and
 * only ever plays in answer to a click.
 */

const MUTTERINGS = [
  "Hmm… which rope should I follow next?",
  "Reso: can a caption show how someone feels?",
  "The snow looks so quiet today.",
  "Arm-Swing VR: my arms still remember the walk.",
  "I think the tangram wants to be a house.",
  "Flight Booking: a clearer journey, one step at a time.",
  "Someone left the window open a little.",
  "The failed print taught me more than the good one.",
  "Maybe one more prototype…",
  "Maze of Wishes needs one more tilt. Just one.",
  "Reso is still humming in my head.",
  "A chess coach that listens first, maybe?",
  "The cat knows something.",
  "The music VR still hums when I close my eyes.",
  "Nobody should get lost booking a flight.",
  "The zoo on my desk is getting crowded.",
  "In VR, swinging your arms is walking. Funny.",
  "Tea first. Then the next idea.",
];
const MEOWS = ["Mew!", "Mrrp?", "Prrr…", "Meow~"];
const BUBBLE_MS = 4400;

type Bubble = { id: number; who: "peiwen" | "cat"; text: string };

function meow(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.14);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.55);
  const vibrato = ctx.createOscillator();
  const vibratoDepth = ctx.createGain();
  vibrato.frequency.value = 6;
  vibratoDepth.gain.value = 12;
  vibrato.connect(vibratoDepth).connect(osc.frequency);
  const formant = ctx.createBiquadFilter();
  formant.type = "bandpass";
  formant.Q.value = 4;
  formant.frequency.setValueAtTime(900, t);
  formant.frequency.linearRampToValueAtTime(1900, t + 0.16);
  formant.frequency.linearRampToValueAtTime(1000, t + 0.55);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
  osc.connect(formant).connect(gain).connect(ctx.destination);
  osc.start(t);
  vibrato.start(t);
  osc.stop(t + 0.7);
  vibrato.stop(t + 0.7);
}

export default function ProjectLife() {
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const idRef = useRef(0);
  const lineRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const say = useCallback((who: Bubble["who"], text: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    idRef.current += 1;
    setBubble({ id: idRef.current, who, text });
    hideTimer.current = setTimeout(() => setBubble(null), BUBBLE_MS);
  }, []);

  const nextLine = useCallback(() => {
    const text = MUTTERINGS[lineRef.current % MUTTERINGS.length];
    lineRef.current += 1;
    return text;
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        if (!document.hidden) say("peiwen", nextLine());
        schedule(7000 + Math.random() * 5000);
      }, delay);
    };
    schedule(4500);
    return () => {
      clearTimeout(timer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [say, nextLine]);

  function pokeCat() {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioRef.current ??= new Ctx();
      void audioRef.current.resume();
      meow(audioRef.current);
    } catch {
      // No sound is fine; the bubble still answers.
    }
    say("cat", MEOWS[Math.floor(Math.random() * MEOWS.length)]);
  }

  return (
    <div className={styles.life}>
      <div className={styles.glow} aria-hidden="true" />
      <button type="button" className={`${styles.hotspot} ${styles.hotspotPeiwen}`} aria-label="Peiwen, by the window" onClick={() => say("peiwen", nextLine())} />
      <button type="button" className={`${styles.hotspot} ${styles.hotspotCat}`} aria-label="The sleeping cat. Poke it." onClick={pokeCat} />
      {bubble && (
        <div key={bubble.id} className={`${styles.bubble} ${bubble.who === "cat" ? styles.bubbleCat : styles.bubblePeiwen}`} aria-hidden="true">
          {bubble.text}
        </div>
      )}
    </div>
  );
}
