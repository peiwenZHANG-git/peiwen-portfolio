import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { bodyFont, handFont } from "../about/fonts";
import shell from "./shell.module.css";
import ProjectLife from "./project-life";
import ProjectsStage from "./projects-stage";
import ProjectArrows from "./project-arrows";
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
      <SiteHeader current="projects" />
      <ProjectsStage>
        <div className={styles.stage} data-stage>
        <div className={styles.title}>
          <h1>Projects</h1>
          <p>Things I’ve made, tested, and explored.</p>
        </div>
        <ProjectClothesline rope="featured" />
        <p className={styles.hint}><span className={styles.hintMobile}>drag to explore →</span><span className={styles.hintDesktop}><span>More</span><span>to discover</span><span>this way →</span></span></p>
        <ProjectClothesline rope="smaller" />
        <ProjectArrows />
        <ProjectLife />
        </div>
      </ProjectsStage>
    </div>
  );
}
