import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../../about/about.module.css";
import styles from "./chess.module.css";

const assetRoot = "/assets/projects/chess";

export const metadata: Metadata = {
  title: "Chess · Peiwen Zhang",
  description: "A short HCI interaction concept about designing a chess experience around why people come to play.",
};

function Figure({ name, width, height, alt, children, priority = false }: { name: string; width: number; height: number; alt: string; children?: ReactNode; priority?: boolean }) {
  return <figure className={styles.figure}>
    <a href={`${assetRoot}/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
      <Image src={`${assetRoot}/${name}.webp`} width={width} height={height} alt={alt} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 900px" priority={priority} />
    </a>
    {children && <figcaption>{children}</figcaption>}
  </figure>;
}

export default function ChessPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#chess-content">Skip to case study</a>
    <header className={shell.header}>
      <Link className={shell.logo} href="/" aria-label="Peiwen Zhang, Home"><span className={shell.logoName}>Peiwen Zhang</span><span className={shell.logoRole}>HCI · PRODUCT · CREATIVE TECH</span></Link>
      <nav aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/experience">Experience</Link><Link href="/projects" aria-current="location">Projects</Link><Link href="/#playground">Playground</Link><Link href="/about">About me</Link></nav>
    </header>
    <main id="chess-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects">← Back to the attic</Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true">♞ </span>HCI Interaction Concept · 2025</p>
          <h1>Chess</h1>
          <p className={styles.lead}>Designing a chess experience around why people come to play.</p>
          <p>A one-week HCI concept exploring intent-based navigation, flexible game setup, learning modes, voice notes and parallel media experiences.</p>
          <p className={styles.heroMeta}>Université Paris-Saclay · M1 HCI · Fundamentals of Human-Computer Interaction · 1 week · Team of 4</p>
          <p className={styles.role}><strong>My role</strong> Research · Concept Development · Low-fi Prototyping · Prototype Interaction · User Testing</p>
          <a className={styles.jump} href="#intent">Start with intent ↓</a>
        </div>
        <Figure name="main" width={2560} height={1664} alt="High-fidelity chess platform prototype showing Watch, Play, Learn and Community as primary intent-based navigation" priority>One homepage, organized around different reasons to come to chess.</Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title">At a glance</h2>
        <dl className={styles.facts}>
          <div><dt>Challenge</dt><dd>A chess platform can serve quick play, learning, watching, reflection and community, yet conventional navigation often treats them as parallel feature lists.</dd></div>
          <div><dt>Approach</dt><dd>We explored an intent-first interaction model, then developed low- and high-fidelity flows around different ways of engaging with chess.</dd></div>
          <div><dt>My contribution</dt><dd>Research, concept development, low-fidelity prototyping, prototype interaction and informal user testing.</dd></div>
        </dl>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}>Project materials</p><h2 id="materials-title">Explore the original prototype.</h2></div>
        <div><a href="https://www.figma.com/design/zIYzqPrzlfBqGpQNDrgiDB/Hci1-Ta4?node-id=102-2" target="_blank" rel="noopener noreferrer">View prototype ↗</a><a href="https://youtu.be/0n3FSCH9q-E" target="_blank" rel="noopener noreferrer">Watch prototype demo ↗</a></div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}><nav aria-label="Case study chapters"><p className={styles.eyebrow}>Inside the concept</p><a href="#challenge">01 · Design challenge</a><a href="#intent">02 · Intent model</a><a href="#lowfi">03 · Low-fi exploration</a><a href="#ideas">04 · Interaction ideas</a><a href="#testing">05 · Informal testing</a><a href="#reflection">06 · Reflection + scope</a></nav></aside>
        <article className={styles.story} aria-label="Chess HCI interaction concept case study">
          <section id="challenge"><p className={styles.eyebrow}>01 / Design challenge</p><h2>Design around intent rather than feature categories.</h2><p>How might a chess platform adapt to different intentions — playing, learning, watching and reflecting — instead of forcing every user through the same experience?</p><p className={styles.annotation}><span aria-hidden="true">↳</span> The concept started with the reason for arriving, then shaped the path through the platform.</p></section>

          <section id="intent"><p className={styles.eyebrow}>02 / Intent model</p><h2>Start with intent, not features.</h2><div className={styles.intentGrid}><Figure name="intent-question" width={2560} height={1664} alt="Onboarding prototype asking what the user wants to do: play, learn, challenge, watch, join community or browse"><span>The onboarding question represents an interaction concept, not an adaptive algorithm.</span></Figure><div className={styles.intentMap}><p>Intent</p><span>Quick play</span><span>Learn</span><span>Challenge</span><span>Watch</span><span>Community</span><span>Browse</span><strong>↓</strong><p>Navigation cues</p><small>Play · Learn · Watch · Community</small></div></div><p>Rather than starting from a feature taxonomy, we explored what users were trying to do in a particular moment: play quickly, learn, challenge themselves, watch, socialise or simply browse.</p></section>

          <section id="lowfi"><p className={styles.eyebrow}>03 / Low-fi exploration</p><h2>From flow to interaction model.</h2><p>The low-fidelity prototype helped us test the relationship between onboarding, modes and task-specific flows before investing in detailed screens.</p><Figure name="lowfi-flow" width={5532} height={3090} alt="Low-fidelity chess prototype flow connecting question page, main page, game modes, review and learning screens"><span>A one-week process map: establish the flow and mode structure before polishing individual screens.</span></Figure></section>

          <section id="ideas"><p className={styles.eyebrow}>04 / Interaction ideas</p><h2>Four ways the concept responded to intent.</h2>
            <div className={styles.idea}><div><p className={styles.storyTag}>01 · PLAY</p><h3>Make starting a game feel lightweight</h3><p><strong>Problem:</strong> preset-heavy game setup can turn a simple intention into a choice-heavy step.</p><p><strong>Concept:</strong> a continuous duration control frames game time as a spectrum from quick games to longer sessions.</p></div><Figure name="duration" width={2560} height={1664} alt="Chess prototype with a Choose Game Duration modal and a slider from three to sixty minutes"><span>The concept explored a time spectrum rather than a dense list of presets.</span></Figure></div>
            <div className={`${styles.idea} ${styles.reverse}`}><Figure name="learning-history" width={2560} height={1664} alt="Chess prototype Game History view with Learn, Review and Challenge navigation"><span>Learning is represented as a distinct mode of use.</span></Figure><div><p className={styles.storyTag}>02 · LEARN</p><h3>Treat learning as a mode, not a side feature</h3><p>Learning was treated as a distinct way of using the platform rather than a secondary content section. The prototype separated lessons, review and challenge while preserving access to previous games.</p></div></div>
            <div className={styles.notes}><div><p className={styles.storyTag}>03 · REFLECT</p><h3>Capture thoughts without leaving the board</h3><p>Notes and voice input explored how players might capture thoughts during a game without switching to a separate note-taking tool.</p><p>The prototype represented a speech-recognition state, making the interaction visible rather than treating speech as an invisible background action.</p></div><div className={styles.screenPair}><Figure name="board-notes" width={2560} height={1664} alt="Chess board prototype with Notes, Voice Input, Music and TV controls"><span>Board state with note and media controls.</span></Figure><Figure name="voice-state" width={2560} height={1664} alt="Chess board prototype showing a Recognizing speech interaction state"><span>A visible prototype state for voice input.</span></Figure></div></div>
            <div className={styles.idea}><Figure name="parallel-media" width={2560} height={1664} alt="Chess board prototype with a lightweight media window alongside the game"><span>Media sits alongside, rather than replacing, the board.</span></Figure><div><p className={styles.storyTag}>04 · WATCH</p><h3>Explore parallel media while playing</h3><p>The concept also explored what happens when playing is not the only activity. A lightweight media layer could support watching or listening alongside the game.</p><p className={styles.small}>That possibility also creates new competition for screen space and attention.</p></div></div>
          </section>

          <section id="testing"><p className={styles.eyebrow}>05 / Informal user testing</p><h2>Testing surfaced new trade-offs.</h2><p>Informal user testing helped us identify where experimental interaction ideas introduced new usability risks.</p><dl className={styles.findings}><div><dt>Discoverability</dt><dd>Some experimental controls were not immediately obvious.</dd></div><div><dt>Voice in noisy environments</dt><dd>Speech interaction raised practical questions in noisy or shared spaces.</dd></div><div><dt>Floating media on smaller screens</dt><dd>Parallel media could obstruct game content when screen space was limited.</dd></div></dl><p className={styles.small}>The available project record does not preserve participant counts or a formal test protocol, so these observations are presented as formative feedback rather than validated usability results.</p></section>

          <section id="reflection"><p className={styles.eyebrow}>06 / Reflection + scope</p><h2>What I learned.</h2><div className={styles.reflections}><div><h3>A concept needs a reason to exist.</h3><p>New interactions are useful only when they connect to a different intention: play, learn, watch or reflect.</p></div><div><h3>More activity creates more competition for attention.</h3><p>Voice, TV and notes can expand an experience while adding discoverability, screen-space and context-management questions.</p></div><div><h3>Low-fi was useful for a one-week project.</h3><p>It made it possible to resolve flow, mode and conceptual structure before moving into high-fidelity screens.</p></div></div><div className={styles.scope}><h3>Prototype scope</h3><p>This was a one-week Figma interaction concept. It did not include a production chess engine, front-end code, backend, real-time multiplayer system or rule-validation code.</p><p>The project focused on interaction structure, prototyping and formative feedback.</p></div></section>
        </article>
      </div>
      <footer className={styles.footer}><Link href="/projects">← Back to projects</Link><a href="#chess-content">Back to top ↑</a><p>Chess · Fundamentals of Human-Computer Interaction · 2025</p></footer>
    </main>
  </div>;
}
