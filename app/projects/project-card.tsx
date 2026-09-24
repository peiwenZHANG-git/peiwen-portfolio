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
    <div className={styles.pair} data-project={project.id} role="group" aria-label={project.title}
      style={{ "--rotation": `${project.rotation}deg` } as CSSProperties}>
      <button type="button" className={`${styles.piece} ${styles.illustration}`} data-piece="illustration"
        data-cover-status={project.cover ? "final" : "placeholder"}
        aria-haspopup="dialog" aria-label={`Preview ${project.title} from illustration${project.cover ? "" : " (cover pending)"}`}
        onClick={(event) => onOpen(project, event.currentTarget)}>
        <ProjectClip />
        {project.cover && <span className={styles.cover} aria-hidden="true">
          <Image src={project.cover} alt="" fill sizes={project.rope === "featured" ? "(max-width: 719px) 58vw, 180px" : "(max-width: 719px) 46vw, 120px"} draggable={false} />
        </span>}
      </button>
      <button type="button" className={`${styles.piece} ${styles.titleNote}`} data-piece="title"
        aria-haspopup="dialog" aria-label={`Preview ${project.title} from title note`}
        onClick={(event) => onOpen(project, event.currentTarget)}>
        <ProjectClip />
        <span className={styles.cardTitle}>{project.label}</span>
        <span className={styles.coverSubtitle}>{project.coverSubtitle}</span>
      </button>
    </div>
  );
}
