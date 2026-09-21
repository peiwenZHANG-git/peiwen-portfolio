import type { Metadata } from "next";
import Link from "next/link";
import { bodyFont, handFont } from "../about/fonts";
import shell from "../about/about.module.css";
import ProjectClothesline from "./project-clothesline";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects · Peiwen Zhang",
  description: "Things I’ve made, tested, and explored. Come into Peiwen’s working attic.",
};

export default function ProjectsPage() {
  return (
    <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`}>
      <a className={shell.skipLink} href="#projects-content">Skip to projects</a>
      <header className={`${shell.header} ${styles.header}`}>
        <Link className={shell.logo} href="/" aria-label="Peiwen Zhang, Home">
          <span className={shell.logoName}>Peiwen Zhang</span>
          <span className={shell.logoRole}>HCI · PRODUCT · CREATIVE TECH</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/projects" aria-current="page">Projects</Link>
          <Link href="/#playground">Playground</Link>
          <Link href="/about">About me</Link>
        </nav>
      </header>
      <main id="projects-content" className={styles.scene} tabIndex={-1}>
        <div className={styles.title}>
          <h1>Projects</h1>
          <p>Things I’ve made, tested, and explored.</p>
          <Link href="/projects/reso">Read Reso: making tone visible →</Link>
        </div>
        <ProjectClothesline />
      </main>
    </div>
  );
}
