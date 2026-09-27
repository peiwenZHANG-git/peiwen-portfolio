"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playEffect } from "@/components/music-store";
import styles from "./projects.module.css";

/**
 * Small signs of life in the attic (desktop stage only): Peiwen now and then talks to
 * herself in a little hand-lettered bubble, and the sleeping cat answers a poke with a
 * meow. Everything here is decoration on top of the painting: the bubbles are hidden
 * from assistive tech, the two hotspots are ordinary buttons, and nothing runs on its own
 * when the visitor prefers reduced motion. The meow (a real recording since 2026-09-25,
 * public/assets/audio/effects/cat-*) only ever plays in answer to a click.
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
// each bubble has its own real cat sound (components/sound-library.ts)
const MEOWS = [
  { text: "Mew!", sound: "mew" },
  { text: "Mrrp?", sound: "mrrp" },
  { text: "Prrr…", sound: "purr" },
  { text: "Meow~", sound: "meow" },
] as const;
const BUBBLE_MS = 4400;

type Bubble = { id: number; who: "peiwen" | "cat"; text: string };

export default function ProjectLife() {
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const idRef = useRef(0);
  const lineRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // a different voice every poke: random, but never the same one twice in a row
  const lastMeow = useRef(-1);
  function pokeCat() {
    let i = Math.floor(Math.random() * (MEOWS.length - 1));
    if (i >= lastMeow.current) i += 1;
    lastMeow.current = i;
    playEffect(MEOWS[i].sound);
    say("cat", MEOWS[i].text);
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
