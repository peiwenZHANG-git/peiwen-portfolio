"use client";

import { useEffect, useRef } from "react";
import { registerAudio, resumeStoredChoice, teardownMusic } from "./music-store";

/**
 * The background-music <audio> element, and nothing else.
 *
 * Mounted once in app/layout.tsx so the same element survives client-side navigation
 * between Home, Experience and About — the loop never restarts or cuts out when the
 * route changes. The visible control is <MusicToggle> in the site header; the two talk
 * through components/music-store.ts.
 *
 * The track is a PLACEHOLDER (see design-assets/audio/MUSIC.md): a synthesized piano
 * loop, 26.67s, seamless. Replacing it is a file swap — no code change — as long as the
 * new files keep these names.
 */
export function SiteAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    registerAudio(ref.current);
    resumeStoredChoice();
    return () => {
      teardownMusic();
      registerAudio(null);
    };
  }, []);

  return (
    <audio ref={ref} loop preload="none" aria-hidden="true">
      {/* ogg first: Chrome and Firefox loop it gaplessly. Safari falls back to mp3. */}
      <source src="/assets/audio/theme-loop.ogg" type="audio/ogg" />
      <source src="/assets/audio/theme-loop.mp3" type="audio/mpeg" />
    </audio>
  );
}
