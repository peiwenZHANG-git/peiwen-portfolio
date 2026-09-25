"use client";

import styles from "./projects.module.css";

function go(direction: number) {
  window.dispatchEvent(new CustomEvent("projects-scroll", { detail: direction }));
}

export default function ProjectArrows() {
  return (
    <>
      <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} aria-label="Scroll projects left" onClick={() => go(-1)}>
        <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M35 12H6M14 4 5 12l9 8" /></svg>
      </button>
      <button type="button" className={`${styles.arrow} ${styles.arrowRight}`} aria-label="Scroll projects right" onClick={() => go(1)}>
        <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M5 12h29M26 4l9 8-9 8" /></svg>
      </button>
    </>
  );
}
