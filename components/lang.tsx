"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/**
 * Bilingual content (2026-09-25). Only the reading content is translated — project
 * case studies, Experience and the About notebook; navigation, little Peiwen and
 * the hand-lettered words in the paintings stay English (Peiwen's decision).
 *
 * Both languages are rendered into the page, and <html data-lang> decides which one
 * shows (app/globals.css). An inline script in app/layout.tsx sets data-lang from
 * localStorage before the first paint, so a visitor who chose 中文 never sees an
 * English flash. Works in server components: no client state needed.
 *
 *   <p><L en="Hello" zh="你好" /></p>
 */
export function L({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <span data-l="en">{en}</span>
      <span data-l="zh" lang="zh-CN">
        {zh}
      </span>
    </>
  );
}

export const LANG_STORAGE_KEY = "pw-lang";

/** runs in <head> before paint: restore the visitor's language (and `<html lang>`, so
    screen readers switch voice with it — see setLang in components/lang-toggle.tsx) */
export const LANG_BOOT_SCRIPT = `try{var l=localStorage.getItem("${LANG_STORAGE_KEY}");if(l==="zh"){document.documentElement.dataset.lang="zh";document.documentElement.lang="zh-CN";}}catch(e){}`;

/**
 * The current language, for the rare spot that needs it in JS rather than through
 * `<L>` — an HTML attribute like a placeholder can't hold two `data-l` spans. Reads
 * `<html data-lang>` (see components/lang-toggle.tsx), so it always agrees with what
 * `<L>` is showing on the page.
 */
function subscribeLang(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
  return () => mo.disconnect();
}
function readLang(): "en" | "zh" {
  return document.documentElement.dataset.lang === "zh" ? "zh" : "en";
}
export function useLang(): "en" | "zh" {
  return useSyncExternalStore(subscribeLang, readLang, () => "en");
}
