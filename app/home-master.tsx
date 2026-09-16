import Image from "next/image";
import Link from "next/link";
import { Patrick_Hand } from "next/font/google";
import styles from "./home-master.module.css";
import PeiwenPhaseOne from "./peiwen-phase-one";

const hand = Patrick_Hand({ weight: "400", subsets: ["latin"], display: "swap" });

export default function HomeMaster({ phaseOne = false, phaseTwo = false, phaseThree = false, phaseFour = false, phaseFive = false }: { phaseOne?: boolean; phaseTwo?: boolean; phaseThree?: boolean; phaseFour?: boolean; phaseFive?: boolean }) {
  return (
    <main className={`${styles.viewport} ${hand.className}`} data-visual="master-static" data-state="IDLE">
      <a className={styles.skip} href="#master-navigation">Skip to navigation</a>
      <div className={styles.stage}>
        <Image className={styles.plate} src="/home-master/master.png" width={1536} height={1024} unoptimized priority alt="Peiwen looking over a watercolor valley, with a winding path to a village on the left and a cottage on the right." />
        <Image className={styles.plate} src="/home-master/text-clean-plate.png" width={1536} height={1024} unoptimized priority alt="" />
        <header>
          <Link className={styles.logo} href="/">Peiwen Zhang</Link>
          <p className={styles.tagline}>HCI · PRODUCT · CREATIVE TECH</p>
          <nav id="master-navigation" className={styles.navigation} aria-label="Primary navigation">
            <Link href="/" aria-current="page">Home</Link>
            <Link href="/experience">Experience</Link>
            <Link href="/#projects">Projects</Link>
            <Link href="/#playground">Playground</Link>
            <Link href="/#about">About</Link>
          </nav>
          <p className={styles.language} aria-label="Language: English">中 / <span>EN</span></p>
        </header>
        <h1 className={styles.title}>Peiwen Zhang</h1>
        <p className={styles.subtitle}>A small world of curiosity.</p>
        <p className={styles.prompt} data-home-prompt>Where would you like to go?</p>
        <p className={styles.footerLeft}>Different places,<br /><span>same curious me...</span></p>
        <p className={styles.footerRight}>More to come...</p>
        {phaseOne && <PeiwenPhaseOne enableRight={phaseTwo} enableAbout={phaseThree} coordinated={phaseFour} enableEnvironment={phaseFive} />}
      </div>
    </main>
  );
}
