"use client";

import { useEffect } from "react";
import { resumeStoredChoice, teardownMusic } from "./music-store";

/**
 * Mounted once in app/layout.tsx so the site's sound survives client-side navigation:
 * restores the visitor's last choice (music / snow / little sounds) on the first load.
 * The audio elements themselves are created by components/music-store.ts; the controls
 * are the record panel in the site header (components/music-toggle.tsx).
 */
export function SiteAudio() {
  useEffect(() => {
    resumeStoredChoice();
    return () => teardownMusic();
  }, []);
  return null;
}
