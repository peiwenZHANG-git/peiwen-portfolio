import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projectsData";
import styles from "./projects.module.css";

export function ProjectClip() {
  return (
    <svg className={styles.clip} viewBox="0 0 18 48" aria-hidden="true">
      <path d="M5 2 12 1 15 5 14 22 13 46 4 45 3 26 2 7Z" fill="#af9a80" stroke="#786956" strokeWidth="1.1" />
      <path d="M6 4 5 21 7 43M11 4 10 20 11 43" fill="none" stroke="#d0bda3" strokeWidth="1.2" opacity=".7" />
      <path d="m3 24 11-1M4 27l9-1M5 44l7 1" fill="none" stroke="#776754" strokeWidth="1.1" />
    </svg>
  );
}

export default function ProjectCard({ project, onOpen }: {
  project: Project;
  onOpen: (project: Project, button: HTMLButtonElement) => void;
}) {
  return (
    <button type="button" className={`${styles.card} ${styles[project.size]}`}
      style={{ "--rotation": `${project.rotation}deg` } as CSSProperties}
      aria-haspopup="dialog" data-project={project.id}
      onClick={(event) => onOpen(project, event.currentTarget)}>
      <ProjectClip />
      <span className={styles.cover}>
        <Image src={project.image} alt="" fill sizes="(max-width: 719px) 76vw, 320px" draggable={false} />
      </span>
      <span className={styles.cardTitle}>{project.title}</span>
      <span className={styles.tags}>{project.subtitle}</span>
      <span className={styles.open} aria-hidden="true">open →</span>
    </button>
  );
}
