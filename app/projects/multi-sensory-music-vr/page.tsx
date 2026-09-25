import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import styles from "./music-vr.module.css";

const assetRoot = "/assets/projects/multi-sensory-music-vr";

export const metadata: Metadata = {
  title: "Multi-Sensory Music VR · Peiwen Zhang",
  description:
    "A Unity XR case study exploring how musical rhythm can be represented through visual particles, spatial audio and controller haptics.",
};

function Figure({
  name,
  width,
  height,
  alt,
  children,
  priority = false,
}: {
  name: string;
  width: number;
  height: number;
  alt: string;
  children: ReactNode;
  priority?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <a href={`${assetRoot}/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
        <Image
          src={`${assetRoot}/${name}.webp`}
          width={width}
          height={height}
          alt={alt}
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 850px"
          loading="eager"
          priority={priority}
        />
      </a>
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function MultiSensoryMusicVrPage() {
  return (
    <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
      <a className={shell.skipLink} href="#music-vr-content">Skip to case study</a>
      <SiteHeader current="projects" />

      <main id="music-vr-content" className={styles.main} tabIndex={-1}>
        <Link className={styles.back} href="/projects">← Back to the attic</Link>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>XR · Haptics · Accessibility · 2026</p>
            <h1>Multi-Sensory<br />Music VR</h1>
            <p className={styles.lead}>Making rhythm visible, tangible and spatial.</p>
            <p>A four-week Unity XR project exploring how musical rhythm could be translated into visual particles, spatial audio and controller haptics for a more multisensory music experience.</p>
            <p className={styles.annotation}>Initially developed as a team project; the final prototype was completed independently by Peiwen after the other teammates left.</p>
            <a className={styles.jump} href="#interaction">Follow the rhythm ↓</a>
          </div>
          <figure id="demo" className={styles.heroDemo}>
            <a href={`${assetRoot}/resources/multi-sensory-music-vr-demo.mp4`} target="_blank" rel="noopener noreferrer" aria-label="Open the Multi-Sensory Music VR final demonstration">
              <Image src={`${assetRoot}/hero-sequencer.webp`} width={1920} height={1080} alt="VR music table with colored note blocks, scanner and a virtual character" priority sizes="(max-width: 700px) 86vw, 560px" />
            </a>
            <figcaption><span>Watch the working prototype · 1:18 ↗</span>A spatial block-based sequencer with a scanner, particles and character feedback.</figcaption>
          </figure>
        </header>

        <section className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title">At a glance</h2>
          <dl className={styles.facts}>
            <div><dt>Challenge</dt><dd>Music interaction often depends on hearing and traditional notation. This project explored whether rhythm could instead be communicated through visual, spatial and tactile cues.</dd></div>
            <div><dt>Approach</dt><dd>Prototype the interaction first with AR and physical vibration hardware, then rebuild it in VR after hardware and platform constraints made the original direction infeasible.</dd></div>
            <div><dt>Final system</dt><dd>A Unity VR prototype where users place colored note blocks on a table and experience each note through particles, spatial audio, controller haptics and character feedback.</dd></div>
            <div><dt>My role</dt><dd>Concept · Accessibility research · AR and hardware prototyping · XR interaction · Unity engineering · Haptics · Debugging · Presentation and report.</dd></div>
          </dl>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div><p className={styles.eyebrow}>Project materials</p><h2 id="materials-title">See it in motion.</h2></div>
          <ul><li><a href={`${assetRoot}/resources/multi-sensory-music-vr-demo.mp4`} target="_blank" rel="noopener noreferrer">Watch final demo ↗</a></li></ul>
        </section>

        <div className={styles.layout}>
          <aside className={styles.contents}>
            <nav aria-label="Inside the project">
              <p>Inside the project</p>
              <a href="#question">01 · Design question</a>
              <a href="#ar">02 · Physical haptics</a>
              <a href="#pivot">03 · AR → VR</a>
              <a href="#interaction">04 · Direct manipulation</a>
              <a href="#timing">05 · Rhythm mapping</a>
              <a href="#architecture">06 · Three channels</a>
              <a href="#feedback">07 · Embodied feedback</a>
              <a href="#scope">08 · Scope</a>
            </nav>
          </aside>

          <article className={styles.story} aria-label="Multi-Sensory Music VR case study">
            <section id="question">
              <p className={styles.kicker}>01 · Design question</p>
              <h2>How can rhythm be represented through sight and touch?</h2>
              <p>Rather than starting from sheet music or an audio-only interface, I explored rhythm as a sequence of visible, placeable events. The goal was an accessibility-oriented interaction that could communicate timing without relying on hearing alone.</p>
              <blockquote>How can musical rhythm be represented through sight and touch, rather than relying on hearing alone?</blockquote>
              <p className={styles.note}>This is a technical prototype, not an accessibility evaluation. It had no formal user study and no Deaf or Hard-of-Hearing participant testing.</p>
            </section>

            <section id="ar">
              <p className={styles.kicker}>02 · Begin with physical haptics</p>
              <h2>The first idea was not VR.</h2>
              <p>The initial Unity concept used AR, a moving scanner and an Arduino vibration motor. It was a hardware experiment: BPM timing and scanner events were used to trigger a physical vibration outside the visual interface. The archived source also records WebSocket-based hardware experimentation in this early path.</p>
              <div className={styles.earlyFlow} aria-label="Early AR prototype technical chain">
                <div><strong>AR blocks</strong><span>place a rhythm</span></div><b aria-hidden="true">→</b><div><strong>Scanner</strong><span>reaches a block</span></div><b aria-hidden="true">→</b><div><strong>Arduino motor</strong><span>physical vibration</span></div>
              </div>
              <div className={styles.earlyEvidence}>
                <Figure name="early-unity-scanner" width={640} height={480} alt="Early Unity scanner prototype recorded in the project WhatsApp video">Early Unity scanner state from the first prototype recording.</Figure>
              </div>
              <p className={styles.pencilNote}><span aria-hidden="true">↳</span> The interaction idea was sensory mapping, not one display technology.</p>
            </section>

            <section id="pivot">
              <p className={styles.kicker}>03 · Technical pivot</p>
              <h2>When the hardware path disappeared, the interaction had to survive.</h2>
              <p>Two documented constraints changed the implementation: MRTK was incompatible with the available macOS setup, and access to the planned AR hardware was lost. I kept the core mapping and rebuilt the final prototype around a stable VR pipeline and controller haptics.</p>
              <div className={styles.pivot} aria-label="AR prototype moved through technical constraints to VR prototype">
                <div><span>Before</span><strong>AR prototype</strong><small>physical motor</small></div><b aria-hidden="true">→</b><div><span>Constraint</span><strong>MRTK + hardware access</strong><small>medium changed</small></div><b aria-hidden="true">→</b><div><span>Final</span><strong>VR prototype</strong><small>controller haptics</small></div>
              </div>
              <p className={styles.conclusion}>The sensory mapping mattered more than the display technology.</p>
            </section>

            <section id="interaction">
              <p className={styles.kicker}>04 · Direct manipulation</p>
              <h2>Turn music into something you can place.</h2>
              <p>The final system is a spatial block-based sequencer. A user picks up colored note blocks, places them on the interaction table, then lets a scanner travel across the sequence.</p>
              <ol className={styles.steps} aria-label="Final interaction flow">
                <li><span>01</span><strong>Grab</strong><small>Pick up a colored note block.</small></li>
                <li><span>02</span><strong>Place</strong><small>Arrange it on the table.</small></li>
                <li><span>03</span><strong>Scan</strong><small>The scanner moves through the sequence.</small></li>
                <li><span>04</span><strong>Trigger</strong><small>Each note produces sensory feedback.</small></li>
              </ol>
              <div className={styles.pair}>
                <Figure name="grab-place" width={1920} height={1080} alt="Unity XR view with a controller ray reaching toward colored note blocks">A controller ray makes the grab-and-place interaction visible.</Figure>
                <Figure name="scanner-trigger" width={1920} height={1080} alt="Scanner crossing a note block while particles appear in the Unity prototype">A scanner crossing triggers visible feedback.</Figure>
              </div>
            </section>

            <section id="timing">
              <p className={styles.kicker}>05 · Rhythm as time</p>
              <h2>Map musical timing into interaction timing.</h2>
              <p>In the final implementation, BPM sets the temporal scale and each note type contributes its duration ratio. That timing drives how the scanner traverses the table and how long a triggered feedback event can last.</p>
              <div className={styles.formula} aria-label="Formula: duration milliseconds equals 60000 divided by BPM times note ratio"><code>duration_ms = (60000 / BPM) × note_ratio</code></div>
              <div className={styles.mapping}>
                <div><strong>BPM</strong><span>sets the rhythm&apos;s time scale</span></div><b aria-hidden="true">→</b><div><strong>Note ratio</strong><span>sets the note&apos;s duration</span></div><b aria-hidden="true">→</b><div><strong>Feedback</strong><span>maps duration into the event</span></div>
              </div>
              <p>The source confirms that longer note types are mapped to stronger and longer controller haptics in the final prototype. This is an implemented mapping, not a claim that any one intensity is optimal for users.</p>
            </section>

            <section id="architecture">
              <p className={styles.kicker}>06 · System architecture</p>
              <h2>Trigger three sensory channels from the same event.</h2>
              <p>The technical centerpiece is one shared trigger path. When the moving scan position reaches a note block, the system starts audio, visual particles and VR controller haptics from that musical event.</p>
              <div className={styles.architecture} aria-label="ScannerLineMover reaches NoteBlock then triggers audio, visual particles and VR controller haptics">
                <div><code>ScannerLineMover</code><span>moves at the current BPM</span></div><b aria-hidden="true">→</b><div><code>NoteBlock</code><span>calculates duration + note behavior</span></div><b aria-hidden="true">→</b><div className={styles.channels}><strong>Audio</strong><strong>Particles</strong><strong>Controller haptics</strong></div>
              </div>
              <div className={`${styles.pair} ${styles.supportingPair}`}>
                <Figure name="particle-trigger" width={1920} height={1080} alt="Particle effects appearing around triggered note blocks in the Unity prototype">A triggered block produces a visible particle response.</Figure>
                <Figure name="haptic-mapping" width={1920} height={1080} alt="Unity sequencer view showing colored blocks, scanner line and vibration strength control">The prototype exposes BPM and vibration-strength controls alongside the sequence.</Figure>
              </div>
            </section>

            <section id="feedback">
              <p className={styles.kicker}>07 · Virtual human feedback</p>
              <h2>A character mirrors the rhythm.</h2>
              <div className={styles.feedbackGrid}>
                <Figure name="virtual-boy-feedback" width={940} height={760} alt="Cropped Unity frame showing the virtual boy standing beside the music table">The character is kept visible beside the sequence as feedback is triggered.</Figure>
                <div><p>The final build includes <code>BoyHearingManager</code>: it starts a clapping animation when a note is triggered, adjusts the animation speed with the current rhythm and returns to idle after a period without triggering.</p><p>This is embodied feedback tied to the same music event. It is not presented as evidence of social presence or emotional benefit.</p></div>
              </div>
            </section>

            <section id="scope">
              <p className={styles.kicker}>08 · Reflection + scope</p>
              <h2>What the prototype demonstrates.</h2>
              <ul className={styles.demonstrates}>
                <li>A concrete translation from BPM and note duration into a running XR interaction.</li>
                <li>A technical pivot that preserved the interaction model while changing its hardware medium.</li>
                <li>Unity implementation across direct manipulation, scene flow, scanner timing, particles, spatial audio, haptics and character response.</li>
              </ul>
              <h3>Where the evidence stops</h3>
              <ul>
                <li>No formal user study or comparison condition was conducted.</li>
                <li>No Deaf or Hard-of-Hearing participants were tested.</li>
                <li>The prototype does not validate accessibility, usability, cognitive-load, therapeutic or emotional outcomes.</li>
                <li>AR hardware constraints meant the final build uses VR controller haptics instead of the original external motor path.</li>
                <li>Visual complexity, musical variation and virtual-human behaviours remained limited by the four-week scope.</li>
              </ul>
              <p className={styles.reflection}><strong>My takeaway:</strong> a multisensory interaction does not need to begin as an abstract feature list. It can start with one shared timing event, then make that event legible through placement, movement, sight, sound and touch.</p>
            </section>
          </article>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects">← Back to projects</Link><a href="#music-vr-content">Back to top ↑</a><p>Multi-Sensory Music VR · Advanced Immersive Interaction · 2026</p>
        </footer>
      </main>
    </div>
  );
}
