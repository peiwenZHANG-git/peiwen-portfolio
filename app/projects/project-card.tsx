import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projectsData";
import { slotProps } from "./slots";
import styles from "./projects.module.css";

export function ProjectClip() {
  return (
    <svg className={styles.clip} viewBox="0 0 18 48" aria-hidden="true">
      <path d="M4.5 1.5 12.5 1 15 5 14.2 23 13.4 46.5 4 46 3 27 2 7Z" fill="#a08b70" stroke="#6b5a47" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M6 4 5.4 22 6.6 44M10.5 4 10 21 11 44" fill="none" stroke="#c4b294" strokeWidth="1" opacity=".55" />
      <path d="M2.8 25.5 14 24.5M3.4 29 13.4 28M4 45 12.6 45.5" fill="none" stroke="#6b5a47" strokeWidth="1.1" />
      <circle cx="8.6" cy="26.6" r="1.6" fill="#7a6a58" opacity=".8" />
    </svg>
  );
}

export default function ProjectCard({ project, onOpen }: {
  project: Project;
  onOpen: (project: Project, button: HTMLButtonElement) => void;
}) {
  const ill = slotProps(`${project.id}:ill`);
  const note = slotProps(`${project.id}:note`);
  return (
    <div className={styles.pair} data-project={project.id} role="group" aria-label={project.title}
      style={{ "--rotation": `${project.rotation}deg` } as CSSProperties}>
      <button type="button" className={`${styles.piece} ${styles.illustration}`} data-piece="illustration" {...ill}
        data-cover-status={project.cover ? "final" : "placeholder"}
        aria-haspopup="dialog" aria-label={`Preview ${project.title} from illustration${project.cover ? "" : " (cover pending)"}`}
        onClick={(event) => onOpen(project, event.currentTarget)}>
        <ProjectClip />
        {project.cover && <span className={styles.cover} aria-hidden="true">
          <Image src={project.cover} alt="" fill sizes={project.rope === "featured" ? "(max-width: 719px) 58vw, 180px" : "(max-width: 719px) 46vw, 120px"} draggable={false} />
        </span>}
      </button>
      <button type="button" className={`${styles.piece} ${styles.titleNote}`} data-piece="title" {...note}
        aria-haspopup="dialog" aria-label={`Preview ${project.title} from title note`}
        onClick={(event) => onOpen(project, event.currentTarget)}>
        <ProjectClip />
        <span className={styles.cardTitle}>{project.label}</span>
        <span className={styles.coverSubtitle}>{project.coverSubtitle}</span>
      </button>
    </div>
  );
}
