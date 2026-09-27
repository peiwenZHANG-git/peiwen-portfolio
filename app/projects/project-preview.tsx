"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projectsData";
import { L } from "@/components/lang";
import styles from "./projects.module.css";

export type Selection = { project: Project; source: HTMLButtonElement };

export default function ProjectPreview({ selection, onClose }: {
  selection: Selection;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const paper = useRef<HTMLElement>(null);
  const closing = useRef(false);
  const { project, source } = selection;

  const sourceTransform = (element: HTMLElement) => {
    const from = source.getBoundingClientRect();
    const to = element.getBoundingClientRect();
    return `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  };

  useEffect(() => {
    const modal = dialog.current!;
    const sheet = paper.current!;
    modal.showModal();
    const from = source.getBoundingClientRect();
    const to = sheet.getBoundingClientRect();
    const animation = matchMedia("(prefers-reduced-motion: reduce)").matches ? null : sheet.animate([
      { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: 0.6 },
      { transform: "none", opacity: 1 },
    ], { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
    return () => { animation?.cancel(); modal.close(); source.focus({ preventScroll: true }); };
  }, [source]);

  async function close() {
    if (closing.current) return;
    closing.current = true;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && paper.current) {
      // End an in-flight opening before measuring the return destination.
      paper.current.getAnimations().forEach((animation) => animation.cancel());
      await paper.current.animate([
        { transform: "none", opacity: 1 },
        { transform: sourceTransform(paper.current), opacity: 0 },
      ], { duration: 240, easing: "ease-in", fill: "forwards" }).finished;
    }
    onClose();
  }

  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="project-title"
      onCancel={(event) => { event.preventDefault(); void close(); }}>
      <article ref={paper} className={styles.preview}>
        <button type="button" className={styles.close} onClick={() => void close()} autoFocus><L en="Close ×" zh="关闭 ×" /></button>
        <p className={styles.previewLabel}><L en={`From the attic · ${project.subtitle}`} zh={`这是我做过的项目 · ${project.subtitleZh}`} /></p>
        <div className={styles.previewImage}>
          <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 719px) 85vw, 780px" />
        </div>
        <h2 id="project-title"><L en={project.title} zh={project.titleZh} /></h2>
        <p><L en={project.description} zh={project.descriptionZh} /></p>
        <Link className={styles.caseStudy} href={project.href}><L en="View case study →" zh="看完整项目 →" /></Link>
      </article>
    </dialog>
  );
}
