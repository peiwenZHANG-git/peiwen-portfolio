"use client";

import { LANG_STORAGE_KEY, useLang } from "./lang";
import styles from "./site-header.module.css";

/**
 * The 中 / EN switch in the header (2026-09-25). English is the default. Choosing 中
 * shows the Chinese version of the reading content (see components/lang.tsx) and is
 * remembered in localStorage.
 */

type Lang = "en" | "zh";

function setLang(lang: Lang) {
  const root = document.documentElement;
  if (lang === "zh") root.dataset.lang = "zh";
  else delete root.dataset.lang;
  // the page language screen readers read with; English-only chrome carries its own lang="en"
  root.lang = lang === "zh" ? "zh-CN" : "en";
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* not remembering is fine */
  }
}

export function LangToggle() {
  const lang = useLang();
  return (
    <span className={styles.langText} role="group" aria-label="Language">
      <button
        type="button"
        className={`${styles.langBtn} ${lang === "zh" ? styles.langOn : ""}`}
        aria-pressed={lang === "zh"}
        lang="zh-CN"
        onClick={() => setLang("zh")}
        title="中文"
      >
        中
      </button>
      {" / "}
      <button
        type="button"
        className={`${styles.langBtn} ${lang === "en" ? styles.langOn : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        title="English"
      >
        EN
      </button>
    </span>
  );
}
