import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import styles from "./maze-of-wishes.module.css";

const assetRoot = "/assets/projects/maze-of-wishes";

export const metadata: Metadata = {
  title: "Maze of Wishes · Peiwen Zhang",
  description:
    "A playful cross-device interaction case study about turning phone tilt into a complete JavaFX maze game.",
};

function Figure({
  name,
  width,
  height,
  alt,
  children,
  priority = false,
  className = "",
}: {
  name: string;
  width: number;
  height: number;
  alt: string;
  children: ReactNode;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <a
        href={`${assetRoot}/${name}.webp`}
        aria-label={`Open full-size image: ${alt}`}
      >
        <Image
          src={`${assetRoot}/${name}.webp`}
          width={width}
          height={height}
          alt={alt}
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 850px"
          priority={priority}
        />
      </a>
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function MazeOfWishesPage() {
  return (
    <div
      className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`}
      tabIndex={-1}
    >
      <a className={shell.skipLink} href="#maze-content">
        Skip to case study
      </a>
      <SiteHeader current="projects" />

      <main id="maze-content" className={styles.main} tabIndex={-1}>
        <Link className={styles.back} href="/projects">
          ← Back to the attic
        </Link>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              Maze of Wishes · 2025 · Playful cross-device interaction
            </p>
            <h1>
              Tilt your phone.
              <br />
              Guide Santa through the maze.
            </h1>
            <p className={styles.lead}>
              What if the phone became the controller?
            </p>
            <p>
              I turned live gravity data into a complete sensor-to-screen game:
              a phone steers Santa through a desktop maze, while the game
              teaches, constrains and responds to that movement.
            </p>
            <p className={styles.annotation}>
              Designed and implemented independently in about two months.
            </p>
            <a className={styles.jump} href="#pipeline">
              Follow the signal ↓
            </a>
          </div>
          <figure id="demo" className={styles.heroDemo}>
            <video
              controls
              preload="metadata"
              playsInline
              poster={`${assetRoot}/demo-poster.webp`}
              aria-label="Watch the Maze of Wishes phone-tilt prototype classroom demonstration"
            >
              <source
                src={`${assetRoot}/resources/maze-of-wishes-demo.mp4`}
                type="video/mp4"
              />
              Your browser does not support embedded video.{" "}
              <a href={`${assetRoot}/resources/maze-of-wishes-demo.mp4`}>
                Open the demo video
              </a>
              .
            </video>
            <figcaption>
              <span>Watch the working prototype · 0:13 ↗</span>A phone and
              laptop share one local network during the live classroom
              demonstration.
            </figcaption>
          </figure>
        </header>

        <section className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title">At a glance</h2>
          <dl className={styles.facts}>
            <div>
              <dt>Context</dt>
              <dd>
                Basic Programming of Interactive Systems
                <br />
                Université Paris-Saclay · 2025
              </dd>
            </div>
            <div>
              <dt>Project type</dt>
              <dd>
                Individual project · ~2 months
                <br />
                Java · JavaFX · OSC
              </dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>
                Concept, interaction design, sensor mapping, UI/game design,
                Java implementation, debugging and live demo.
              </dd>
            </div>
          </dl>
          <p className={styles.ownership}>
            <strong>
              Designed and implemented the complete prototype independently.
            </strong>{" "}
            I shaped the move from keyboard control to phone tilt, built the
            sensor pipeline and game loop, and prepared the classroom
            demonstration.
          </p>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div>
            <p className={styles.eyebrow}>Project materials</p>
            <h2 id="materials-title">See it beyond the page.</h2>
          </div>
          <ul>
            <li>
              <a
                href={`${assetRoot}/resources/maze-of-wishes-demo.mp4`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch demo ↗
              </a>
            </li>
            <li>
              <a
                href={`${assetRoot}/resources/early-storyboard.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Early storyboard ↗
              </a>
            </li>
            <li>
              <a
                href={`${assetRoot}/resources/project-documentation.docx`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Project documentation ↗
              </a>
            </li>
          </ul>
        </section>

        <div className={styles.layout}>
          <aside className={styles.contents}>
            <nav aria-label="Inside the project">
              <p>Inside the project</p>
              <a href="#shift">01 · Shift to tilt</a>
              <a href="#pipeline">02 · Signal pipeline</a>
              <a href="#mapping">03 · Movement mapping</a>
              <a href="#game-loop">04 · Game loop</a>
              <a href="#collision">05 · Map + collision</a>
              <a href="#demo-evidence">06 · Classroom demo</a>
              <a href="#reflection">07 · Reflection</a>
            </nav>
          </aside>

          <article className={styles.story}>
            <section id="shift">
              <p className={styles.kicker}>01 · From keyboard to phone tilt</p>
              <h2>The interaction idea changed the project.</h2>
              <p>
                The early storyboard imagined a conventional keyboard maze with
                multiple levels. The stronger direction appeared when I returned
                to the physical inspiration: a handheld maze is understood
                through tilt, not arrow keys.
              </p>
              <div className={styles.pair}>
                <Figure
                  name="early-storyboard"
                  width={797}
                  height={1800}
                  alt="Early Maze of Wishes storyboard showing the initial keyboard-controlled maze concept"
                  className={styles.storyboard}
                >
                  <strong>Before:</strong> a keyboard maze concept with a larger
                  level structure. The storyboard is process evidence; those
                  extra levels did not enter the final build.
                </Figure>
                <Figure
                  name="tilt-tutorial"
                  width={1262}
                  height={735}
                  alt="Maze of Wishes tutorial screen teaching the player to tilt the phone in four directions"
                >
                  <strong>After:</strong> the final tutorial asks the player to
                  move a cake cursor by tilting the phone—teaching the
                  controller through action.
                </Figure>
              </div>
              <p className={styles.pencilNote}>
                <span>↗</span> The phone was not a companion screen. It became
                the physical input device.
              </p>
            </section>

            <section id="pipeline">
              <p className={styles.kicker}>02 · How the interaction works</p>
              <h2>One continuous signal, from hand to screen.</h2>
              <p>
                The core challenge was not drawing a maze. It was making an
                unfamiliar cross-device chain feel immediate enough to disappear
                during play.
              </p>
              <ol
                className={styles.pipeline}
                aria-label="Maze of Wishes sensor pipeline"
              >
                <li>
                  <span>1</span>
                  <strong>Phone gravity sensor</strong>
                  <small>gx · gy · gz</small>
                </li>
                <li>
                  <span>2</span>
                  <strong>ZigSim</strong>
                  <small>packages the live sensor stream</small>
                </li>
                <li>
                  <span>3</span>
                  <strong>OSC / UDP</strong>
                  <small>sends data over the local network</small>
                </li>
                <li>
                  <span>4</span>
                  <strong>Java receiver</strong>
                  <small>
                    reads{" "}
                    <code>
                      /ZIGSIM/
                      <wbr />
                      &lt;uuid&gt;/
                      <wbr />
                      gravity
                    </code>
                  </small>
                </li>
                <li>
                  <span>5</span>
                  <strong>TiltController</strong>
                  <small>applies bias, threshold and bounded speed</small>
                </li>
                <li>
                  <span>6</span>
                  <strong>Game update</strong>
                  <small>
                    predicts movement, checks the map and renders the next frame
                  </small>
                </li>
              </ol>
              <p className={styles.note}>
                <strong>Connection condition:</strong> the phone and computer
                must share a network, and the receiver listens on UDP port 5000.
              </p>
            </section>

            <section id="mapping">
              <p className={styles.kicker}>03 · Sensor mapping</p>
              <h2>A small mapping that players could read with their hands.</h2>
              <p>
                The receiver stores all three gravity axes, but the final
                controller uses <code>gx</code> and <code>gy</code>. It gives
                priority to one axis at a time, keeping movement mainly
                horizontal or vertical rather than drifting diagonally.
              </p>
              <div
                className={styles.mapping}
                aria-label="Phone tilt to Santa movement mapping"
              >
                <div>
                  <strong>
                    <span>Tilt left</span>
                    <b>Santa moves left</b>
                  </strong>
                  <code>gy &gt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>Tilt right</span>
                    <b>Santa moves right</b>
                  </strong>
                  <code>gy &lt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>Tilt forward</span>
                    <b>Santa moves up</b>
                  </strong>
                  <code>gx &gt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>Tilt back</span>
                    <b>Santa moves down</b>
                  </strong>
                  <code>gx &lt; 0</code>
                </div>
              </div>
              <div className={styles.calibration}>
                <h3>Calibrate, then move</h3>
                <p>
                  Pressing <kbd>Space</kbd> records the current phone
                  orientation as the bias. A threshold ignores small movements;
                  stronger tilt maps to a bounded speed range.
                </p>
                <p className={styles.small}>
                  I implemented these parameters, but the archive does not
                  document a formal rationale for their exact values. The page
                  therefore treats them as prototype tuning—not optimized
                  human-factors values.
                </p>
              </div>
            </section>

            <section id="game-loop">
              <p className={styles.kicker}>
                04 · From controller to complete game
              </p>
              <h2>
                The prototype had to explain what to do—and close the loop.
              </h2>
              <Figure
                name="start-screen"
                width={1197}
                height={552}
                alt="Maze of Wishes start screen with cake cursor, sound control and Easy and Hard mode choices"
              >
                The start flow introduces the playful visual language.{" "}
                <strong>
                  Easy Mode is playable; Hard Mode appears in the menu but was
                  not implemented.
                </strong>
              </Figure>
              <div
                className={styles.stateFlow}
                aria-label="Maze of Wishes game loop"
              >
                <div>
                  <strong>Tutorial</strong>
                  <span>Learn tilt by moving the cake</span>
                </div>
                <b>→</b>
                <div>
                  <strong>Collect</strong>
                  <span>Find the birthday cake</span>
                </div>
                <b>→</b>
                <div>
                  <strong>Deliver</strong>
                  <span>Reach the goal before 90 seconds</span>
                </div>
                <b>→</b>
                <div>
                  <strong>Resolve</strong>
                  <span>Success or timeout feedback</span>
                </div>
              </div>
              <div className={styles.gameGrid}>
                <Figure
                  name="cake-required"
                  width={461}
                  height={271}
                  alt="Maze of Wishes warning telling the player to collect the cake first"
                >
                  The goal is gated until the cake has been collected.
                </Figure>
                <Figure
                  name="potion-boost"
                  width={1254}
                  height={263}
                  alt="Maze of Wishes potion pickup and speed-up feedback"
                >
                  A potion creates a temporary speed boost with visible
                  feedback.
                </Figure>
                <Figure
                  name="success"
                  width={562}
                  height={328}
                  alt="Maze of Wishes success state after delivering the cake"
                >
                  The success state closes the collect-and-deliver story.
                </Figure>
                <Figure
                  name="timeout"
                  width={562}
                  height={332}
                  alt="Maze of Wishes timeout state after the 90-second timer expires"
                >
                  The 90-second timer creates a clear failure state.
                </Figure>
              </div>
              <p className={styles.small}>
                Additional feedback includes breathing, absorption, scene and
                character animation. These details support clarity and tone;
                they are not separate game systems.
              </p>
            </section>

            <section id="collision">
              <p className={styles.kicker}>05 · Map + collision</p>
              <h2>Movement was checked before it reached the screen.</h2>
              <div className={styles.implementationGrid}>
                <Figure
                  name="final-map"
                  width={1024}
                  height={600}
                  alt="The final illustrated Maze of Wishes game map"
                >
                  The final single-map play space combines the route, cake,
                  potion and delivery goal.
                </Figure>
                <div>
                  <h3>Predicted-position check</h3>
                  <p>
                    Before applying a movement, the Java game predicts Santa’s
                    next position and checks a semantic map layer. In the
                    working build, this prevented Santa from moving through
                    walls.
                  </p>
                  <h3>Evidence boundary</h3>
                  <p>
                    The archived mask file does not fully match the demonstrated
                    final build. I therefore use the running prototype and
                    source logic as evidence of the collision approach, without
                    claiming that the archived mask proves robust pixel-perfect
                    collision.
                  </p>
                </div>
              </div>
              <Figure
                name="tiled-editor-crop"
                width={478}
                height={276}
                alt="Tiled editor view used while authoring the Maze of Wishes map"
              >
                Tiled supported map authoring; JavaFX rendered the final
                experience and game state.
              </Figure>
            </section>

            <section id="demo-evidence">
              <p className={styles.kicker}>06 · Classroom demonstration</p>
              <h2>A working cross-device interaction, shown live.</h2>
              <Figure
                name="demo-poster"
                width={1600}
                height={900}
                alt="Phone held beside a laptop running Maze of Wishes during a classroom demonstration"
              >
                The supplied recording shows the phone-controlled game running
                on a laptop in class.
              </Figure>
              <p className={styles.conclusion}>
                The prototype was demonstrated live in class as a working
                cross-device interaction.
              </p>
              <p>
                No formal user study, participant protocol, validated scale or
                performance dataset was documented. The demonstration proves
                that the pipeline ran; it does not establish usability or
                player-experience outcomes.
              </p>
            </section>

            <section id="reflection">
              <p className={styles.kicker}>07 · Reflection</p>
              <h2>What this prototype demonstrates</h2>
              <ul className={styles.demonstrates}>
                <li>
                  A playful interaction idea translated into a complete
                  cross-device prototype.
                </li>
                <li>
                  Live phone-sensor data mapped into understandable game
                  movement.
                </li>
                <li>
                  A technical pipeline integrated with tutorial, feedback,
                  objectives and end states.
                </li>
              </ul>
              <h3>Where the evidence stops</h3>
              <ul>
                <li>
                  No formal participant study or documented feedback-based
                  iteration.
                </li>
                <li>
                  The classroom demo confirms operation, not a validated
                  interaction advantage.
                </li>
                <li>
                  Hard Mode is visible in the menu but has no implemented
                  gameplay.
                </li>
                <li>
                  The archived collision mask does not fully match the final
                  demonstrated build.
                </li>
                <li>
                  The prototype depends on a shared local network and a fixed
                  UDP port.
                </li>
              </ul>
              <p className={styles.reflection}>
                <strong>My takeaway:</strong> cross-device interaction becomes
                convincing when the technical chain and the player-facing
                explanation are designed together. The sensor mapping only
                mattered once the tutorial, constraints and feedback made it
                legible.
              </p>
            </section>
          </article>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects">← Back to projects</Link>
          <a href="#maze-content">Back to top ↑</a>
          <p>Maze of Wishes · Case Study v1</p>
        </footer>
      </main>
    </div>
  );
}
