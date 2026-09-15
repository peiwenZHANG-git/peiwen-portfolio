import Image from "next/image";
import Link from "next/link";
import {
  contact,
  cv,
  exploring,
  exploringNote,
  identity,
  intro,
  journey,
  languages,
  places,
  portrait,
  strengths,
} from "@/lib/about";
import { bodyFont, handFont } from "./fonts";
import styles from "./about.module.css";

/**
 * About me.
 *
 * The illustrated shell is Peiwen's own watercolour artwork, not CSS:
 *   desk-scene.webp   the desk AND the open notebook (leather cover, pages, rings)
 *   photo-frame.webp  the polaroid frame, transparent window
 *   paper-wide/block  torn paper, used as masks so CSS can tint them
 *   place-*.webp      the three travel postcards
 *   tape.webp         one reusable tape strip, used twice
 *   brush-swipe.webp  one watercolour stroke, masked and tinted per heading
 *
 * Everything readable — navigation, headings, copy, links, contact, CV — is real DOM
 * sitting on top of the artwork. On desktop the two page panels are positioned in
 * percentages measured from desk-scene.webp; type scales with the stage in cqw, bounded
 * by clamp() so it never drops below readable size. Below 1024px the scene is dropped
 * and the same DOM becomes a vertical column of pasted notes.
 */

const CV_ICON = (
  <svg className={styles.cvIcon} viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M9 2.4v9M5.2 8.2 9 12l3.8-3.8M3 15h12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function JourneyArrow() {
  return (
    <svg className={styles.journeyArrow} viewBox="0 0 44 16" aria-hidden="true">
      <path
        d="M3 8.8C13 7.4 26 7.8 39 8.4M33.5 3.8C35.8 6 38 7.5 40.8 8.5 38 9.8 35.9 11.5 34 13.8"
        fill="none"
        stroke="#b49a84"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    /* body keeps its global `overflow: hidden`, so the About route scrolls inside its
       own shell. tabIndex keeps that scroll container reachable for keyboard-only
       users (the axe "scrollable-region-focusable" rule). */
    <div className={`${styles.shell} ${handFont.variable} ${bodyFont.variable}`} tabIndex={0}>
      <a className={styles.skipLink} href="#about-content">
        Skip to content
      </a>

      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="Peiwen Zhang, Home">
          <span className={styles.logoName}>{identity.name}</span>
          <span className={styles.logoRole}>{identity.roleLine}</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/#projects" scroll={false}>
            Projects
          </Link>
          <Link href="/#playground" scroll={false}>
            Playground
          </Link>
          <Link href="/about" aria-current="page">
            About me
          </Link>
        </nav>
        <p className={styles.headerNote}>{identity.marginNote}</p>
      </header>

      <main id="about-content" className={styles.stageWrap} tabIndex={-1}>
        <div className={styles.stage}>
          {/* ------------------------------ LEFT PAGE ------------------------------ */}
          <div className={`${styles.panel} ${styles.panelLeft}`}>
            <div className={styles.introRow}>
              <figure className={styles.polaroid}>
                <span className={`${styles.tape} ${styles.tapePortrait}`} aria-hidden="true" />
                <Image
                  className={styles.portraitImage}
                  src={portrait.src}
                  alt={portrait.alt}
                  width={portrait.width}
                  height={portrait.height}
                  sizes="(max-width: 1024px) 60vw, 22vw"
                  priority
                />
                <span className={styles.polaroidFrame} aria-hidden="true" />
                <figcaption>
                  <span className={styles.polaroidName}>{portrait.caption}</span>
                  <span className={styles.polaroidRole}>{portrait.captionRole}</span>
                </figcaption>
              </figure>

              <div className={styles.introText}>
                <h1 className={styles.greeting}>
                  <span className={`${styles.marker} ${styles.markerRose}`}>
                    {identity.greeting}
                  </span>
                  <span className={styles.heart} aria-hidden="true">
                    ♡
                  </span>
                </h1>
                {intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <ul className={styles.places}>
              {places.map((place) => (
                <li key={place.id} className={styles.place} data-place={place.id}>
                  <Image
                    className={styles.placeArt}
                    src={`/assets/about/place-${place.id}.webp`}
                    alt=""
                    width={640}
                    height={459}
                    sizes="(max-width: 1024px) 30vw, 9vw"
                  />
                  <span className={styles.placeName}>{place.name}</span>
                </li>
              ))}
            </ul>

            <section aria-labelledby="about-journey">
              <h2 id="about-journey" className={styles.heading}>
                <span className={`${styles.marker} ${styles.markerSand}`}>How I got into HCI</span>
              </h2>
              <ol className={styles.journeyList}>
                {journey.map((step, index) => (
                  <li key={step.id} className={styles.journeyStep}>
                    {index > 0 ? <JourneyArrow /> : null}
                    <span className={styles.journeyBody}>
                      <span className={styles.journeyTitle}>{step.title}</span>
                      <span className={styles.journeyDetail}>{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <p className={styles.pageFootNote}>{identity.closingNote}</p>
          </div>

          {/* ------------------------------ RIGHT PAGE ----------------------------- */}
          <div className={`${styles.panel} ${styles.panelRight}`}>
            <section aria-labelledby="about-exploring">
              <h2 id="about-exploring" className={styles.heading}>
                <span className={`${styles.marker} ${styles.markerRose}`}>
                  Currently exploring…
                </span>
              </h2>
              <div className={styles.exploringBody}>
                <ul className={styles.exploringList}>
                  {exploring.map((topic) => (
                    <li key={topic.id} data-tone={topic.tone}>
                      <span className={styles.dot} aria-hidden="true" />
                      {topic.label}
                    </li>
                  ))}
                </ul>
                <p className={styles.asideNote}>
                  <span className={`${styles.tape} ${styles.tapeNote}`} aria-hidden="true" />
                  {exploringNote}
                </p>
              </div>
            </section>

            <section aria-labelledby="about-strengths">
              <h2 id="about-strengths" className={styles.heading}>
                <span className={`${styles.marker} ${styles.markerSand}`}>What I bring</span>
              </h2>
              <ul className={styles.strengths}>
                {strengths.map((item) => (
                  <li key={item.id} className={styles.card} data-tone={item.tone}>
                    <span className={styles.cardTitle}>{item.title}</span>
                    <span className={styles.cardDetail}>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className={styles.lowerRow}>
              <section className={styles.note} aria-labelledby="about-languages">
                <h2 id="about-languages" className={`${styles.heading} ${styles.headingSm}`}>
                  <span className={`${styles.marker} ${styles.markerBlue}`}>I speak…</span>
                </h2>
                <ul className={styles.languages}>
                  {languages.map((language) => (
                    <li key={language.id}>
                      <span className={styles.languageName} lang={language.lang}>
                        {language.name}
                      </span>
                      <span className={styles.languageLevel}>— {language.level}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.note} aria-labelledby="about-contact">
                <h2 id="about-contact" className={`${styles.heading} ${styles.headingSm}`}>
                  <span className={`${styles.marker} ${styles.markerRose}`}>
                    Let&rsquo;s keep in touch
                  </span>
                </h2>
                <ul className={styles.contact}>
                  {contact.map((entry) => (
                    <li key={entry.id}>
                      <span className={styles.contactLabel}>{entry.label}</span>
                      {entry.placeholder ? (
                        <span className={styles.contactPending}>
                          {entry.value}
                          <span className={styles.pendingTag}>to add</span>
                        </span>
                      ) : (
                        <a
                          className={styles.contactLink}
                          href={entry.href}
                          {...(entry.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer noopener" }
                            : {})}
                        >
                          {entry.value}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={styles.cvRow}>
              {cv.href ? (
                <a className={styles.cvLabel} href={cv.href} download={cv.downloadName}>
                  {CV_ICON}
                  {cv.label}
                </a>
              ) : (
                <span className={styles.cvLabel} data-pending="true">
                  {CV_ICON}
                  {cv.label}
                  <span className={styles.pendingTag}>{cv.pendingNote}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
