import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../../about/about.module.css";
import styles from "./reso.module.css";

export const metadata: Metadata = {
  title: "Reso — Making tone visible · Peiwen Zhang",
  description: "A captioning design case study: two prototype directions, an 18-person hearing-proxy evaluation, and a lesson in visual legibility.",
};

function Figure({ name, width, height, alt, children, priority = false }: {
  name: string; width: number; height: number; alt: string; children: ReactNode; priority?: boolean;
}) {
  return <figure className={styles.figure}>
    <a href={`/assets/projects/reso/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
      <Image src={`/assets/projects/reso/${name}.webp`} width={width} height={height} alt={alt}
        sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 850px" priority={priority} />
    </a>
    <figcaption>{children}</figcaption>
  </figure>;
}

export default function ResoPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#reso-content">Skip to case study</a>
    <header className={shell.header}>
      <Link className={shell.logo} href="/" aria-label="Peiwen Zhang, Home">
        <span className={shell.logoName}>Peiwen Zhang</span>
        <span className={shell.logoRole}>HCI · PRODUCT · CREATIVE TECH</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Home</Link><Link href="/experience">Experience</Link>
        <Link href="/projects" aria-current="location">Projects</Link>
        <Link href="/#playground">Playground</Link><Link href="/about">About me</Link>
      </nav>
    </header>
    <main id="reso-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects">← Back to the attic</Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Reso · 2026 · Accessibility & interaction design</p>
          <h1>Making tone visible.</h1>
          <p className={styles.lead}>What do captions leave unsaid?</p>
          <p>Reso explores how emotion-coloured captions and voice-rhythm visuals might carry some of the context that words alone leave behind.</p>
          <p className={styles.annotation}>A promising signal. A lesson in legibility.</p>
          <a className={styles.jump} href="#results">Read the findings ↓</a>
        </div>
        <Figure name="working-prototype" width={1600} height={879} priority alt="Reso browser speech capture behind a transparent caption and rhythm overlay">
          The working prototype: browser speech capture with a local caption overlay.
        </Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview">
        <h2 id="overview">At a glance</h2>
        <dl className={styles.facts}>
          <div><dt>Context</dt><dd>Design Project 1 and 2<br />Université Paris-Saclay · 2026<br />Supervised by Prof. Ouriel Grynszpan</dd></div>
          <div><dt>My contribution · DP1</dt><dd>Co-designed the early prototypes with Moizza.</dd></div>
          <div><dt>My contribution · DP2</dt><dd>Prototype design, study setup, participant testing, data collection, and post-study prototype revision.</dd></div>
        </dl>
        <p className={styles.small}>DP2 team: Moizza Azhar, Peiwen Zhang, Bill Tang, Daniyal Nasiri-Bavil, and Osuke Sashida. System implementation and study findings below are team outcomes; my contributions are identified separately.</p>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div>
          <p className={styles.eyebrow}>Project materials</p>
          <h2 id="materials-title">See the work in context.</h2>
        </div>
        <ul>
          <li><a href="/assets/projects/reso/resources/reso-demo.mp4" target="_blank" rel="noopener noreferrer">Watch demo ↗</a></li>
          <li><a href="https://danietzio.github.io/deafDHH.github.io/" target="_blank" rel="noopener noreferrer">Try the experiment ↗</a></li>
          <li><a href="/assets/projects/reso/resources/reso-project-report.pdf" target="_blank" rel="noopener noreferrer">Project report ↗</a></li>
          <li><a href="/assets/projects/reso/resources/reso-presentation.pdf" target="_blank" rel="noopener noreferrer">Presentation ↗</a></li>
          <li><a href="/assets/projects/reso/resources/reso-analysis-report.html" target="_blank" rel="noopener noreferrer">Analysis report ↗</a></li>
        </ul>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}>Inside the project</p>
            <a href="#gap">01 · The question</a>
            <a href="#prototypes">02 · Early exploration</a>
            <a href="#system">03 · Working system</a>
            <a href="#study">04 · The evaluation</a>
            <a href="#results">05 · What we learned</a>
            <a href="#iteration">06 · Making it clearer</a>
            <a href="#reflection">07 · Looking back</a>
          </nav>
        </aside>
        <article className={styles.story} aria-label="Reso case study">
          <section id="gap">
            <p className={styles.eyebrow}>01 / The gap</p>
            <h2>The words arrive. The tone may not.</h2>
            <p>A transcript can preserve what someone says without conveying how they say it. Reso began with that design gap: how might captions make emotional tone and changes in vocal intensity easier to interpret?</p>
            <p>Our intended context was online communication for Deaf and Hard-of-Hearing (DHH) people. This was an exploration of a design possibility, not a validated account of DHH users’ needs.</p>
            <div className={styles.pair}>
              <Figure name="plain-captions" width={1125} height={180} alt="Plain white caption on a black background">Plain captions: words without added emotion or rhythm cues.</Figure>
              <Figure name="enriched-captions" width={1112} height={211} alt="Green emotion-coloured caption above a voice-intensity graph">Reso: colour and rhythm together. These source examples show different utterances.</Figure>
            </div>
            <h3>The design space</h3>
            <p>We explored two forms: a screen-based prototype and an AR headset concept. Across these directions, the question was the same: could emotional colour and visual sound patterns add useful context without becoming another thing to decode?</p>
          </section>

          <section id="prototypes">
            <p className={styles.eyebrow}>02 / DP1 · Two prototypes</p>
            <h2>Make the idea tangible before building it.</h2>
            <p><strong>My role:</strong> I co-designed the early prototypes with Moizza, exploring a screen-based interface and an AR headset direction.</p>
            <div className={styles.pair}>
              <Figure name="paper-sound-blocks" width={1130} height={896} alt="Paper screen prototype with a meeting transcript and square sound blocks">Screen prototype: abstract blocks explored how to make sound visible.</Figure>
              <Figure name="paper-emotion-colours" width={1120} height={818} alt="Paper caption prototype using several text colours and an emotion legend">Emotion-colour exploration: the caption itself carries an additional cue.</Figure>
            </div>
            <p className={styles.small}>The AR headset concept was part of DP1; the selected source material does not include an AR mockup to reproduce here.</p>
            <h3>First study · 3-person Wizard-of-Oz testing</h3>
            <p>The early team study used Wizard-of-Oz testing to try the concept before a complete system existed. Emotion colour felt intuitive, while the abstract sound blocks were difficult to understand. This was formative feedback from three people, not evidence of effectiveness at scale.</p>
            <h3>Scope decision · Take the screen-based direction forward</h3>
            <p>DP2 developed the caption-overlay direction into a working system. The AR direction remained an exploration. The key question carried forward was whether the extra visual information would help people interpret emotion—or compete for their attention.</p>
          </section>

          <section id="system">
            <p className={styles.eyebrow}>03 / DP2 · Built system</p>
            <h2>From speech to a visible layer of context.</h2>
            <ol className={styles.flow} aria-label="Working system flow">
              <li><span>01</span>Browser speech capture</li>
              <li><span>02</span>Local transparent overlay / control panel</li>
              <li><span>03</span>Emotion tagging</li>
              <li><span>04</span>Coloured captions + rhythm visualization</li>
            </ol>
            <div className={styles.systemDetail}>
              <Figure name="overlay-control-panel" width={663} height={988} alt="Emotion Speech Overlay control panel with speech input, listening controls and display settings">The local control panel used alongside the overlay.</Figure>
              <div><h3>My part in the working prototype</h3>
                <p className={styles.contribution}><strong>My DP2 contribution:</strong> prototype design, study setup, participant testing, data collection, and post-study prototype revision.</p>
                <p>The team’s proof of concept translated caption text into emotion tags and paired the coloured output with a rhythm display. Emotion tags were an interpretive aid, not a definitive reading of a speaker’s feelings.</p>
                <p className={styles.small}>The working overlay and the controlled evaluation interface are distinct. The study compared two visual conditions using recorded clips.</p>
              </div>
            </div>
            <div id="demo" className={styles.demo}>
              <h3>Reso, built</h3>
              <p>A short working-prototype recording: browser speech capture sends recognised text to the local overlay, where captions receive emotion colour and a live rhythm trace.</p>
              <video controls preload="metadata" playsInline poster="/assets/projects/reso/working-prototype.webp" aria-label="Reso working prototype demonstration">
                <source src="/assets/projects/reso/resources/reso-demo.mp4" type="video/mp4" />
                <track kind="captions" src="/assets/projects/reso/resources/reso-demo-en.vtt" srcLang="en" label="English" default />
                Your browser does not support embedded video. <a href="/assets/projects/reso/resources/reso-demo.mp4">Open the demo video</a>.
              </video>
              <p className={styles.small}>Edited to a 30-second product demonstration from the original local recording. The final unclassified phrase is retained because it shows a real prototype limitation.</p>
            </div>
          </section>

          <section id="study">
            <p className={styles.eyebrow}>04 / Study setup</p>
            <h2>One participant. Both interfaces.</h2>
            <p className={styles.note}><strong>18 hearing proxy participants, aged 18–30.</strong> No DHH participants took part. Muted clips do not reproduce the lived experience of being Deaf or Hard-of-Hearing.</p>
            <p>In a within-subjects evaluation, each participant experienced plain captions (Condition A) and emotion-coloured captions with a live voice-intensity graph (Condition B). The stimuli were muted, single-speaker clips. <a className={styles.inlineLink} href="https://danietzio.github.io/deafDHH.github.io/" target="_blank" rel="noopener noreferrer">Open experiment ↗</a></p>
            <div className={styles.pair}>
              <Figure name="condition-a" width={1122} height={1119} alt="Condition A study interface with a speaker video, plain caption and emotion response options"><strong>Condition A</strong> · Plain captions.</Figure>
              <Figure name="condition-b" width={1016} height={785} alt="Condition B study interface with a speaker video, coloured caption and voice-intensity graph"><strong>Condition B</strong> · Emotion colour + live voice-intensity graph.</Figure>
            </div>
            <h3>What we measured</h3>
            <ul><li>Emotion recognition accuracy</li><li>Reaction time</li><li>Raw NASA-TLX workload</li><li>Qualitative feedback on clarity and usability</li></ul>
            <p><strong>My contribution:</strong> study setup, participant testing, and data collection. The analysis and results are presented as team work.</p>
          </section>

          <section id="results">
            <p className={styles.eyebrow}>05 / Results</p>
            <h2>Better recognition. More mixed experience.</h2>
            <div className={styles.result}><span>50.9% <span aria-hidden="true">→</span> 63.0%</span><p>Emotion recognition accuracy<br /><strong>Approximately +12 percentage points</strong> · p &lt; .05 · medium effect</p></div>
            <div className={styles.tableWrap}><table>
              <caption>Team results · 18 hearing proxy participants</caption>
              <thead><tr><th scope="col">Measure</th><th scope="col">A · Plain</th><th scope="col">B · Enriched</th><th scope="col">Finding</th></tr></thead>
              <tbody>
                <tr><th scope="row">Emotion accuracy</th><td>50.9%</td><td>63.0%</td><td>p &lt; .05; medium effect</td></tr>
                <tr><th scope="row">Reaction time</th><td>3.73 s</td><td>4.21 s</td><td>Not significant</td></tr>
                <tr><th scope="row">Raw NASA-TLX</th><td>39.1</td><td>44.1</td><td>Not significant</td></tr>
              </tbody>
            </table></div>
            <p className={styles.note}>Condition B combined colour and rhythm. The accuracy difference cannot be attributed to colour alone. Neither faster responses nor reduced workload was demonstrated.</p>
            <Figure name="emotion-results" width={1504} height={721} alt="Accuracy by emotion: the largest increases were Angry, approximately 33 percentage points, and Sad, approximately 28 percentage points">Original team chart. Angry improved by about 33 pp and Sad by about 28 pp; gains were not uniform across emotions.</Figure>
            <Figure name="workload-results" width={1600} height={753} alt="Team NASA-TLX subscale chart comparing Conditions A and B, with higher effort and frustration means for B">Original workload breakdown. Overall Raw NASA-TLX rose from 39.1 to 44.1; the overall difference was not statistically significant.</Figure>
            <h3>What failed · The graph asked too much of people</h3>
            <p>Emotion colour was generally described as helpful. The rhythm graph was often confusing or distracting: people had trouble understanding what it represented and how to read it. Adding a signal did not automatically make the interface easier to use.</p>
            <p>Qualitative feedback helps explain this tension, but it does not isolate the causal effect of either visual feature.</p>
          </section>

          <section id="iteration">
            <p className={styles.eyebrow}>06 / Feedback → iteration</p>
            <h2>A graph needs a way in.</h2>
            <dl className={styles.iteration}>
              <div><dt>Feedback</dt><dd>The rhythm graph lacked clear reference points and was difficult to interpret.</dd></div>
              <div><dt>My revision</dt><dd>I added clearer labels and a visible scale to help users interpret changes in voice intensity and rhythm.</dd></div>
              <div><dt>What remains to test</dt><dd>Whether the revised graph is easier to understand and less distracting. The reported evaluation does not establish the revised version’s effectiveness.</dd></div>
            </dl>
            <p className={styles.small}>The revision is documented here from my confirmed contribution. A verified before/after screenshot is still needed; the images above show earlier project material.</p>
          </section>

          <section id="reflection">
            <p className={styles.eyebrow}>07 / Reflection & limitations</p>
            <h2>More information is not automatically better accessibility.</h2>
            <p>My main lesson from Reso is that visual enrichment only helps if it is instantly legible. The next design question is not how much more we can show, but what someone can understand at a glance.</p>
            <h3>Where the evidence stops</h3>
            <ul>
              <li>All 18 participants were hearing proxy users; these findings do not establish improvements for DHH users.</li>
              <li>No DHH co-design informed this iteration.</li>
              <li>Muted, single-speaker clips do not represent the dynamics of real meetings.</li>
              <li>The emotion categories were limited.</li>
              <li>Colour and rhythm were evaluated together, so their separate effects remain unknown.</li>
            </ul>
            <p>A meaningful next step would be co-design with DHH people, followed by evaluation of clearer visual cues in real, multi-speaker communication. That is future work, not a result claimed by this project.</p>
          </section>
          <footer className={styles.footer}><p>Reso · Design Project 1 & 2 · Université Paris-Saclay · 2026</p><Link href="/projects">← Back to projects</Link><a href="#reso-content">Back to top ↑</a></footer>
        </article>
      </div>
    </main>
  </div>;
}
