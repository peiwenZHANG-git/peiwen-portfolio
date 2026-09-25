"use client";

import type { ReactNode } from "react";
import { usePageTransition } from "@/components/page-transition";
import styles from "./projects.module.css";

/** The scene region of /projects. Carries the shared page-transition classes so the
    page fades out like About and Experience when leaving through the header. */
export default function ProjectsStage({ children }: { children: ReactNode }) {
  const { stageClassName, onStageTransitionEnd } = usePageTransition();
  return (
    <main id="projects-content" className={`${styles.scene} ${stageClassName}`} tabIndex={-1} onTransitionEnd={onStageTransitionEnd}>
      {children}
    </main>
  );
}
