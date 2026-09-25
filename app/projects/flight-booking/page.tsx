import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import styles from "./flight-booking.module.css";

const assetRoot = "/assets/projects/flight-booking";

export const metadata: Metadata = {
  title: "Flight Booking Experience · Peiwen Zhang",
  description: "A short UX case study about turning Story Interview breakdowns into clearer mobile booking and itinerary flows.",
};

function Figure({ name, width, height, alt, children, priority = false }: { name: string; width: number; height: number; alt: string; children?: ReactNode; priority?: boolean }) {
  return <figure className={styles.figure}>
    <a href={`${assetRoot}/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
      <Image src={`${assetRoot}/${name}.webp`} width={width} height={height} alt={alt} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 850px" priority={priority} />
    </a>
    {children && <figcaption>{children}</figcaption>}
  </figure>;
}

export default function FlightBookingPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#flight-booking-content">Skip to case study</a>
    <SiteHeader current="projects" />
    <main id="flight-booking-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects">← Back to the attic</Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>2025 · Fundamentals of HCI 1 · Product UX</p>
          <h1>Flight Booking<br />Experience</h1>
          <p className={styles.lead}>Turning travel breakdowns into clearer booking and itinerary flows.</p>
          <p>A short UX case study about moving from Story Interviews to a high-fidelity mobile prototype for comparing fares, configuring a group booking, and keeping travel information together.</p>
          <a className={styles.jump} href="#breakdowns">See the decisions ↓</a>
        </div>
        <Figure name="fare-comparison" width={530} height={885} alt="Mobile ticket information screen comparing a primary fare with other booking sources" priority>One clear comparison screen, instead of a wall of phone mockups.</Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title">At a glance</h2>
        <dl className={styles.facts}>
          <div><dt>Context</dt><dd>Fundamentals of HCI 1<br />Universite Paris-Saclay · 2025</dd></div>
          <div><dt>Project type</dt><dd>Team of 4<br />High-fidelity mobile prototype</dd></div>
          <div><dt>Peiwen&apos;s contribution</dt><dd>Story Interviews, research synthesis, prototype and presentation.</dd></div>
        </dl>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}>Project materials</p><h2 id="materials-title">See the course deliverable.</h2></div>
        <a href={`${assetRoot}/resources/flight-booking-report.pdf`} target="_blank" rel="noopener noreferrer">Project report ↗</a>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}><nav aria-label="Case study chapters"><p className={styles.eyebrow}>Inside the project</p><a href="#breakdowns">01 · Four breakdowns</a><a href="#scope">02 · Redesign scope</a><a href="#compare">03 · Compare</a><a href="#configure">04 · Configure</a><a href="#travel">05 · Travel</a><a href="#flow">06 · Prototype flow</a><a href="#contribution">07 · Contribution + limits</a></nav></aside>
        <article className={styles.story} aria-label="Flight Booking Experience case study">
          <section id="breakdowns">
            <p className={styles.eyebrow}>01 / 20 Story Interviews</p><h2>Four recurring breakdowns across the travel journey.</h2>
            <p>Our team conducted Story Interviews with 20 people, mainly classmates and friends, then synthesised recurring points of friction. This was course-scale formative research, not a rigorous qualitative study.</p>
            <ol className={styles.breakdowns}>
              <li>Price and refund-rule transparency</li>
              <li>Fragmented itinerary information</li>
              <li>Airport navigation and time planning</li>
              <li>Multi-passenger booking complexity</li>
            </ol>
          </section>

          <section id="scope"><p className={styles.eyebrow}>02 / What we chose to redesign</p><h2>Three moments where clarity matters most.</h2>
            <p className={styles.journey} aria-label="Before booking, during booking, after booking"><span>Before booking</span><i aria-hidden="true">→</i><span>During booking</span><i aria-hidden="true">→</i><span>After booking</span></p>
            <div className={styles.scope}><div><span>Compare</span><p>Make prices and refund/change rules easier to weigh across sources.</p></div><div><span>Configure</span><p>Let each passenger have their own add-ons without repeating work.</p></div><div><span>Travel</span><p>Bring itinerary, airport information and time planning into one place.</p></div></div>
            <p className={styles.small}>The prototype deliberately spans the journey. It does not claim a production-complete airline system.</p>
            <div className={styles.earlySketches}><h3>Early screen sketches</h3><p className={styles.small}>Three compact sketches set the directions for comparison, group configuration and itinerary support before the high-fidelity prototype.</p><div className={styles.sketchGrid}><Figure name="early-price-sketch" width={180} height={310} alt="Early sketch of the smart price comparison screen"><span>Compare fares and rules.</span></Figure><Figure name="early-passenger-sketch" width={180} height={310} alt="Early sketch of the multi-passenger confirmation screen"><span>Configure passengers.</span></Figure><Figure name="early-itinerary-sketch" width={180} height={425} alt="Early sketch of the My Itinerary screen"><span>Keep travel details together.</span></Figure></div></div>
          </section>

          <section id="compare"><p className={styles.eyebrow}>03 / Compare</p><h2>Compare fares and rules in one place.</h2><p><strong>Breakdown:</strong> people described difficulty comparing prices across sources and making sense of refund/change rules. <strong>Prototype direction:</strong> keep the primary fare, alternative sources and a concise policy overview within the decision view.</p>
            <div className={styles.triptych}><Figure name="search" width={402} height={874} alt="Flight search screen with route, date and traveller controls"><span>Start with route, dates and travellers.</span></Figure><Figure name="flight-results" width={402} height={874} alt="Flight result list showing route, duration, source and fare"><span>Flight results establish the options.</span></Figure><Figure name="fare-comparison" width={530} height={885} alt="Ticket information screen with other sources and fares"><span>A source-comparison view makes the difference visible before selection.</span></Figure></div>
          </section>

          <section id="configure"><p className={styles.eyebrow}>04 / Configure</p><h2>Configure several passengers without repeating work.</h2><p><strong>Breakdown:</strong> each traveller may need different baggage, seat or other add-ons; repeated configuration can become tedious. <strong>Prototype direction:</strong> passenger-by-passenger sections preserve individual choices, while <em>apply to all passengers</em> handles shared changes.</p>
            <div className={styles.triptych}><Figure name="multi-passengers" width={728} height={1235} alt="Multi-passenger order screen with sections for three passengers"><span>Grouped passengers, one visible total and a payment CTA.</span></Figure><Figure name="apply-to-all" width={804} height={1748} alt="Multi-passenger order screen with apply to all passengers selected"><span>Apply one setting across the group.</span></Figure><Figure name="baggage-dropdown" width={804} height={1748} alt="Multi-passenger order screen with baggage dropdown options open"><span>Keep the individual baggage choice visible.</span></Figure></div>
            <p className={styles.annotation}><span aria-hidden="true">↳</span> The group action supports repetition without erasing passenger-level control.</p>
          </section>

          <section id="travel"><p className={styles.eyebrow}>05 / Travel</p><h2>Keep post-booking information together.</h2><p><strong>Breakdown:</strong> itinerary, airport, boarding and time-planning information can be scattered. <strong>Prototype direction:</strong> My Itinerary consolidates flight details with check-in, change/refund access, airport navigation and a personalised time plan.</p>
            <div className={styles.pair}><Figure name="itinerary-overview" width={402} height={874} alt="My Itinerary overview showing flight status and check-in actions"><span>The itinerary starts with the active journey and its next actions.</span></Figure><Figure name="itinerary-details" width={804} height={1748} alt="Expanded itinerary showing airport information and personalised time plan"><span>Details bring airport information and the time plan into the same flow.</span></Figure></div>
          </section>

          <section id="flow"><p className={styles.eyebrow}>06 / Prototype scope</p><h2>A mobile flow across the journey.</h2><ol className={styles.flow}><li>Search</li><li>Flight results</li><li>Source comparison</li><li>Passenger add-ons</li><li>Payment transition</li><li>Itinerary</li><li>Airport support</li></ol><p className={styles.small}>The screens demonstrate a high-fidelity prototype scope. Completed payment, live fare aggregation and working airport integrations are not documented.</p></section>

          <section id="contribution"><p className={styles.eyebrow}>07 / Contribution + evidence boundary</p><h2>Research synthesis made the prototype specific.</h2><p className={styles.contribution}><strong>Team of four.</strong> Peiwen contributed to Story Interviews, research synthesis, prototyping and presentation.</p><h3>Where the evidence stops</h3><ul><li>20 Story Interviews were completed, but only synthesis-level evidence remains; complete raw notes and a formal coding process are not retained here.</li><li>The redesign was presented as a high-fidelity prototype; no post-design usability study is documented.</li><li>No validated improvement, production implementation or live data integration is claimed.</li></ul></section>
        </article>
      </div>
      <footer className={styles.footer}><Link href="/projects">← Back to projects</Link><a href="#flight-booking-content">Back to top ↑</a><p>Flight Booking Experience · Fundamentals of HCI 1 · 2025</p></footer>
    </main>
  </div>;
}
