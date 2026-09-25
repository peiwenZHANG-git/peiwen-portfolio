import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import styles from "./arm-swing.module.css";

const assetRoot = "/assets/projects/arm-swing-vr-locomotion";

export const metadata: Metadata = {
  title: "Arm-Swing VR Locomotion · Peiwen Zhang",
  description: "An embodied XR interaction case study about mapping controller movement and gaze into continuous three-dimensional travel.",
};

function Figure({ name, width, height, alt, children, priority = false }: {
  name: string; width: number; height: number; alt: string; children: ReactNode; priority?: boolean;
}) {
  return <figure className={styles.figure}>
    <a href={`${assetRoot}/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
      <Image src={`${assetRoot}/${name}.webp`} width={width} height={height} alt={alt}
        sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 850px" priority={priority} />
    </a>
    <figcaption>{children}</figcaption>
  </figure>;
}

export default function ArmSwingPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#arm-swing-content">Skip to case study</a>
    <SiteHeader current="projects" />

    <main id="arm-swing-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects">← Back to the attic</Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Arm-Swing VR Locomotion · 2026 · Embodied XR interaction</p>
          <h1>Move your body.<br />Move through space.</h1>
          <p className={styles.lead}>How might virtual travel feel less like steering a cursor and more like moving yourself?</p>
          <p>I designed and implemented a continuous arm-swing locomotion technique that turns controller velocity into speed and gaze into three-dimensional direction.</p>
          <p className={styles.annotation}>One movement mapping, from ground travel to vertical flight.</p>
          <a className={styles.jump} href="#system">See how it works ↓</a>
        </div>
        <figure id="demo" className={styles.heroDemo}>
          <video controls preload="metadata" playsInline poster={`${assetRoot}/demo-poster.webp`} aria-label="Watch the Arm-Swing VR Locomotion prototype demonstration">
            <source src={`${assetRoot}/resources/arm-swing-demo.mp4`} type="video/mp4" />
            Your browser does not support embedded video. <a href={`${assetRoot}/resources/arm-swing-demo.mp4`}>Open the demo video</a>.
          </video>
          <figcaption><span>Watch the prototype in motion · 1:16 ↗</span>The final course run moves continuously across ground, slopes and open air.</figcaption>
        </figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title">At a glance</h2>
        <dl className={styles.facts}>
          <div><dt>Context</dt><dd>Mixed Reality &amp; VR Interaction<br />Spring 2026 · IPP</dd></div>
          <div><dt>Project type</dt><dd>Individual project<br />Unity · Meta XR</dd></div>
          <div><dt>My role</dt><dd>Interaction concept, locomotion design, Unity implementation, runtime debugging, formative testing, results synthesis and demo.</dd></div>
        </dl>
        <p className={styles.scaffold}><strong>Built individually within a course-provided VR parkour environment.</strong> The scene, coin course, scoring and base task framework were provided; my work focused on the locomotion technique and its integration.</p>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}>Project materials</p><h2 id="materials-title">See it beyond the page.</h2></div>
        <ul>
          <li><a href={`${assetRoot}/resources/arm-swing-demo.mp4`} target="_blank" rel="noopener noreferrer">Watch demo ↗</a></li>
          <li><a href="https://u8739516597-dotcom.github.io/" target="_blank" rel="noopener noreferrer">View course archive ↗</a></li>
          <li><a href="https://drive.google.com/file/d/17dsN_9A_umsfHKKnd0NoPsK-qlCjL1b5/view?usp=sharing" target="_blank" rel="noopener noreferrer">Download APK ↗</a></li>
          <li><a href={`${assetRoot}/resources/arm-swing-presentation.pdf`} target="_blank" rel="noopener noreferrer">Presentation ↗</a></li>
        </ul>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}>Inside the project</p>
            <a href="#challenge">01 · The challenge</a>
            <a href="#concepts">02 · Explore &amp; choose</a>
            <a href="#system">03 · Interaction mapping</a>
            <a href="#implementation">04 · Building it</a>
            <a href="#debugging">05 · Runtime edge cases</a>
            <a href="#evaluation">06 · Formative testing</a>
            <a href="#results">07 · What I learned</a>
          </nav>
        </aside>

        <article className={styles.story} aria-label="Arm-Swing VR Locomotion case study">
          <section id="challenge">
            <p className={styles.eyebrow}>01 / The challenge</p>
            <h2>Design travel around the body, not a thumbstick.</h2>
            <p>Virtual locomotion has to balance agency, precision and physical comfort. For a fast parkour course, I wanted movement to feel embodied while keeping a clear way to start, steer and stop.</p>
            <blockquote>How might arm movement become an understandable, controllable source of virtual speed?</blockquote>
            <div className={styles.threeFrames} aria-label="Prototype course progression">
              <Figure name="gameplay-ground" width={1400} height={758} alt="First-person VR view travelling along the ground section of the parkour course">Ground travel</Figure>
              <Figure name="gameplay-transition" width={1400} height={758} alt="First-person VR view approaching the transition between parkour sections">Course transition</Figure>
              <Figure name="gameplay-flight" width={1400} height={758} alt="First-person VR view moving above the city course during vertical travel">Vertical travel</Figure>
            </div>
          </section>

          <section id="concepts">
            <p className={styles.eyebrow}>02 / Explore → choose</p>
            <h2>Three ways to leave the joystick behind.</h2>
            <ol className={styles.concepts}>
              <li><span>01</span><h3>Arm-Swing Power Glide</h3><p>Swing both controllers to build speed. Use body effort as the continuous movement signal.</p></li>
              <li><span>02</span><h3>Nod-to-Zoom Teleport</h3><p>Choose a target with gaze, then use a head gesture to confirm the jump.</p></li>
              <li><span>03</span><h3>Elastic World Pull</h3><p>Grab and pull the world towards the body, turning reach into propulsion.</p></li>
            </ol>
            <h3>Why arm swing</h3>
            <p>I chose arm swing because it offered the clearest continuous relationship between physical effort and virtual velocity. It could support slow adjustment and fast traversal using the same input, then extend into vertical movement without adding a second control scheme.</p>
            <p className={styles.pencilNote}><span aria-hidden="true">↳</span> Keep the body-to-speed relationship visible.</p>
          </section>

          <section id="system">
            <p className={styles.eyebrow}>03 / How it works</p>
            <h2>One continuous mapping.</h2>
            <ol className={styles.pipeline} aria-label="Locomotion input pipeline">
              <li><span>Hold</span>Either index trigger engages the movement clutch.</li>
              <li><span>Swing</span>Left and right controller velocities become one movement signal.</li>
              <li><span>Shape</span>A nonlinear curve maps effort to speed, then applies a cap.</li>
              <li><span>Look</span>The HMD forward vector provides three-dimensional direction.</li>
              <li><span>Release</span>Damping brings movement back towards zero.</li>
            </ol>
            <div className={styles.directionDiagram} role="img" aria-label="Looking forward produces mostly horizontal movement; looking upward adds vertical movement through the same HMD direction mapping">
              <div><span className={styles.headset} aria-hidden="true">◉</span><b>Look forward</b><i aria-hidden="true">→ → →</i><p>Mostly horizontal travel</p></div>
              <div><span className={styles.headset} aria-hidden="true">◉</span><b>Look upward</b><i aria-hidden="true">↗ ↗ ↗</i><p>The same vector adds vertical travel</p></div>
            </div>
            <p><strong>There are no separate walking and flying modes.</strong> Looking forward keeps movement mostly on the horizontal plane; looking upward naturally introduces a vertical component through the same HMD-forward mapping.</p>

            <h3>From controller movement to speed</h3>
            <div className={styles.pair}>
              <Figure name="speed-curve" width={1200} height={720} alt="Verified quadratic locomotion speed curve using exponent 2, sensitivity 12 and a maximum speed of 15">The quadratic curve makes small movements precise and stronger swings accelerate quickly before the cap.</Figure>
              <div className={styles.formula} aria-label="Speed mapping formula">
                <p><span>01</span><code>swingPower = |left velocity| + |right velocity|</code></p>
                <p><span>02</span><code>speed = min(swingPower² × sensitivity, maxSpeed)</code></p>
                <p><span>03</span><code>velocity = lerp(current, gaze × speed, smoothing)</code></p>
              </div>
            </div>
          </section>

          <section id="implementation">
            <p className={styles.eyebrow}>04 / Unity implementation</p>
            <h2>Turning the mapping into a running system.</h2>
            <div className={styles.implementationGrid}>
              <div>
                <h3>My implementation</h3>
                <p>I wrote the custom locomotion component, connected controller velocity and HMD direction, added the trigger clutch, nonlinear curve, cap and damping, then integrated it with the provided parkour scene and task logic.</p>
                <pre aria-label="Simplified locomotion logic"><code>{`if (triggerHeld && swingPower > 0.08) {
  speed = min(pow(swingPower, 2) * 12, 15)
  target = hmd.forward * speed
} else {
  target = zero // damp towards rest
}`}</code></pre>
              </div>
              <Figure name="unity-settings" width={512} height={410} alt="Unity Inspector showing sensitivity 12, maximum speed 15, exponent 2 and damping 5 for the locomotion component">Final scene values: exponent 2.0, sensitivity 12, speed cap 15 and damping 5.</Figure>
            </div>
            <p className={styles.scaffold}><strong>Course scaffold boundary:</strong> the environment, course layout, coins, scoring and base tasks came from the class. My contribution is the locomotion design, custom implementation, integration, debugging and evaluation presented here.</p>
          </section>

          <section id="debugging">
            <p className={styles.eyebrow}>05 / Interaction engineering</p>
            <h2>At high speed, passing through was too easy.</h2>
            <p>The first implementation relied on collider triggers for coins and finish banners. Fast movement could cross a thin trigger between physics checks, so the player sometimes missed a coin or failed to advance even after visibly passing the marker.</p>
            <div className={styles.debugFlow} aria-label="High-speed collision edge case and fallback solution">
              <div><span>Edge case</span><strong>High velocity</strong><i aria-hidden="true">→</i><strong>Thin trigger missed</strong></div>
              <div><span>Fallback</span><strong>Distance check</strong><i aria-hidden="true">→</i><strong>Reliable pickup / transition</strong></div>
            </div>
            <div className={styles.pair}>
              <Figure name="banner-edge-case" width={1026} height={909} alt="Unity scene view showing the purple final banner across the parkour road">Banners were changed from solid obstacles to pass-through triggers, with proximity checks as a runtime fallback.</Figure>
              <Figure name="coin-proximity" width={780} height={681} alt="Unity scene view showing glowing purple coins placed along the course">Coins gained a small pickup radius so high-speed travel did not depend on one exact collision frame.</Figure>
            </div>
            <p className={styles.annotation}>The fix was not another interaction mode. It was a more forgiving runtime boundary.</p>
          </section>

          <section id="evaluation">
            <p className={styles.eyebrow}>06 / Formative evaluation</p>
            <h2>Three runs through the full course.</h2>
            <p className={styles.note}><strong>Three formative runs:</strong> Peiwen, the designer, and two classmates. This was an exploratory check of whether the system could be learned and completed, not a controlled comparison.</p>
            <div className={styles.testingGrid}>
              <Figure name="testing-session" width={1400} height={1232} alt="A participant wearing a white VR headset and holding two controllers beside the Unity laptop during a test session">A real test session with the headset, two controllers and the running Unity course.</Figure>
              <div>
                <h3>Task</h3><p>Complete the parkour course and collect as many of 69 coins as possible.</p>
                <h3>Recorded</h3><ul><li>Segment and total completion time</li><li>Coins collected</li><li>Single 1–10 ratings for sickness, workload, presence and enjoyment</li></ul>
                <p className={styles.small}>The creator’s run is retained and labelled rather than treated as an independent participant.</p>
              </div>
            </div>
          </section>

          <section id="results">
            <p className={styles.eyebrow}>07 / Results</p>
            <h2>Completed, engaging—and still formative.</h2>
            <div className={styles.metrics}>
              <div><strong>134.1s</strong><span>average completion time</span></div>
              <div><strong>94.2%</strong><span>pooled coin collection</span></div>
              <div><strong>3.0/10</strong><span>reported sickness</span></div>
              <div><strong>7.7/10</strong><span>reported presence</span></div>
              <div><strong>8.7/10</strong><span>reported enjoyment</span></div>
            </div>
            <p>All three runs finished the course. The fastest run collected the fewest coins, suggesting a precision question worth studying further—but three observations cannot validate a general speed–accuracy trade-off.</p>
            <Figure name="participant-results" width={1400} height={280} alt="Participant-level table showing three segment times, total completion time and coins collected for Peiwen and two classmates">Participant-level evidence. Peiwen’s 132.1-second run collected 68/69 coins; the two classmates completed in 149.2 and 121.0 seconds.</Figure>
            <Figure name="subjective-results" width={1362} height={477} alt="Participant-level ratings for sickness, workload, presence and enjoyment, including averages of 3.0, 4.0, 7.7 and 8.7">Single-item ratings described the three experiences; they were not a validated questionnaire.</Figure>

            <h3>What I learned</h3>
            <p>The prototype showed that one continuous mapping could connect bodily effort, speed and three-dimensional direction. It also exposed the cost of that embodiment: repeated arm movement can become tiring, while high speed makes precise collection harder.</p>
            <p>My strongest technical lesson was to design for the behaviour of the running system, not only the intended interaction. Speed changed the reliability of collisions, so the interaction needed proximity-aware fallbacks.</p>

            <h3>Where the evidence stops</h3>
            <ul>
              <li>Only three runs were recorded, and one was completed by the designer.</li>
              <li>There was no joystick baseline, control condition or counterbalancing.</li>
              <li>The four subjective ratings were single items, not a named validated scale.</li>
              <li>No statistical testing was appropriate for this formative sample.</li>
              <li>The results do not prove that the curve reduced sickness or increased presence or enjoyment.</li>
            </ul>
            <p className={styles.conclusion}>These observations are directional, not evidence of a validated locomotion advantage. A next study should compare against joystick travel, recruit a larger independent sample and test longer sessions where fatigue becomes visible.</p>
          </section>

          <footer className={styles.footer}>
            <p>Arm-Swing VR Locomotion · Mixed Reality &amp; VR Interaction · 2026</p>
            <Link href="/projects">← Back to projects</Link><a href="#arm-swing-content">Back to top ↑</a>
          </footer>
        </article>
      </div>
    </main>
  </div>;
}
