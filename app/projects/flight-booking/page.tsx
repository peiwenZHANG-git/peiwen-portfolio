import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./flight-booking.module.css";

const assetRoot = "/assets/projects/flight-booking";

export const metadata: Metadata = {
  title: "Flight Booking Experience · Peiwen Zhang",
  description: "A short UX case study about turning Story Interview breakdowns into clearer mobile booking and itinerary flows.",
};

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
    <a className={shell.skipLink} href="#flight-booking-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="flight-booking-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="2025 · Fundamentals of HCI 1 · Product UX" zh="2025 · 人机交互基础 1 · 产品 UX" /></p>
          <h1><L en={<>Flight Booking<br />Experience</>} zh={<>机票预订<br />体验</>} /></h1>
          <p className={styles.lead}><L en="Turning travel breakdowns into clearer booking and itinerary flows." zh="把出行中的卡点，变成更清楚的预订和行程流程。" /></p>
          <p><L en="A short UX case study about moving from Story Interviews to a high-fidelity mobile prototype for comparing fares, configuring a group booking, and keeping travel information together."
            zh="一个简短的 UX 案例：从 Story Interview（故事访谈）出发，做出一个高保真的手机原型，用来比价、配置多人订单，并把出行信息放在一起。" /></p>
          <a className={styles.jump} href="#breakdowns"><L en="See the decisions ↓" zh="看看设计决策 ↓" /></a>
        </div>
        <Figure name="fare-comparison" width={530} height={885} alt="Mobile ticket information screen comparing a primary fare with other booking sources" priority><L en="One clear comparison screen, instead of a wall of phone mockups." zh="一张清楚的比价页面，而不是一整墙的手机效果图。" /></Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Context" zh="背景" /></dt><dd><L en={<>Fundamentals of HCI 1<br />Universite Paris-Saclay · 2025</>} zh={<>人机交互基础 1<br />巴黎-萨克雷大学 · 2025</>} /></dd></div>
          <div><dt><L en="Project type" zh="项目类型" /></dt><dd><L en={<>Team of 4<br />High-fidelity mobile prototype</>} zh={<>4 人团队<br />高保真手机原型</>} /></dd></div>
          <div><dt><L en={<>Peiwen&apos;s contribution</>} zh="佩文的贡献" /></dt><dd><L en="Story Interviews, research synthesis, prototype and presentation." zh="故事访谈、研究归纳、原型制作和汇报展示。" /></dd></div>
        </dl>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}><L en="Project materials" zh="项目资料" /></p><h2 id="materials-title"><L en="See the course deliverable." zh="看看课程的最终交付。" /></h2></div>
        <a href={`${assetRoot}/resources/flight-booking-report.pdf`} target="_blank" rel="noopener noreferrer"><L en="Project report ↗" zh="项目报告 ↗" /></a>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}><nav aria-label="Case study chapters"><p className={styles.eyebrow}><L en="Inside the project" zh="项目目录" /></p><a href="#breakdowns"><L en="01 · Four breakdowns" zh="01 · 四个卡点" /></a><a href="#scope"><L en="02 · Redesign scope" zh="02 · 重新设计的范围" /></a><a href="#compare"><L en="03 · Compare" zh="03 · 比较" /></a><a href="#configure"><L en="04 · Configure" zh="04 · 配置" /></a><a href="#travel"><L en="05 · Travel" zh="05 · 出行" /></a><a href="#flow"><L en="06 · Prototype flow" zh="06 · 原型流程" /></a><a href="#contribution"><L en="07 · Contribution + limits" zh="07 · 贡献与局限" /></a></nav></aside>
        <article className={styles.story} aria-label="Flight Booking Experience case study">
          <section id="breakdowns">
            <p className={styles.eyebrow}><L en="01 / 20 Story Interviews" zh="01 / 20 场故事访谈" /></p><h2><L en="Four recurring breakdowns across the travel journey." zh="出行路上反复出现的四个卡点。" /></h2>
            <p><L en="Our team conducted Story Interviews with 20 people, mainly classmates and friends, then synthesised recurring points of friction. This was course-scale formative research, not a rigorous qualitative study."
              zh="我们团队和 20 个人做了故事访谈，大多是同学和朋友，然后归纳出反复出现的摩擦点。这是课程规模的形成性研究，不是严格的定性研究。" /></p>
            <ol className={styles.breakdowns}>
              <li><L en="Price and refund-rule transparency" zh="价格和退改规则不够透明" /></li>
              <li><L en="Fragmented itinerary information" zh="行程信息七零八落" /></li>
              <li><L en="Airport navigation and time planning" zh="机场找路和时间安排" /></li>
              <li><L en="Multi-passenger booking complexity" zh="多人预订太繁琐" /></li>
            </ol>
          </section>

          <section id="scope"><p className={styles.eyebrow}><L en="02 / What we chose to redesign" zh="02 / 我们选择重新设计的部分" /></p><h2><L en="Three moments where clarity matters most." zh="最需要清楚的三个时刻。" /></h2>
            <p className={styles.journey} aria-label="Before booking, during booking, after booking"><span><L en="Before booking" zh="预订前" /></span><i aria-hidden="true">→</i><span><L en="During booking" zh="预订中" /></span><i aria-hidden="true">→</i><span><L en="After booking" zh="预订后" /></span></p>
            <div className={styles.scope}><div><span><L en="Compare" zh="比较" /></span><p><L en="Make prices and refund/change rules easier to weigh across sources." zh="让不同渠道的价格和退改规则更容易放在一起权衡。" /></p></div><div><span><L en="Configure" zh="配置" /></span><p><L en="Let each passenger have their own add-ons without repeating work." zh="让每位乘客都能有自己的附加服务，又不用重复操作。" /></p></div><div><span><L en="Travel" zh="出行" /></span><p><L en="Bring itinerary, airport information and time planning into one place." zh="把行程、机场信息和时间安排放到同一个地方。" /></p></div></div>
            <p className={styles.small}><L en="The prototype deliberately spans the journey. It does not claim a production-complete airline system." zh="这个原型有意覆盖了整段出行，但并不是一个可以上线的完整航空系统。" /></p>
            <div className={styles.earlySketches}><h3><L en="Early screen sketches" zh="早期界面草图" /></h3><p className={styles.small}><L en="Three compact sketches set the directions for comparison, group configuration and itinerary support before the high-fidelity prototype." zh="在做高保真原型之前，三张小草图先定下了比价、多人配置和行程支持的方向。" /></p><div className={styles.sketchGrid}><Figure name="early-price-sketch" width={180} height={310} alt="Early sketch of the smart price comparison screen"><span><L en="Compare fares and rules." zh="比较票价和规则。" /></span></Figure><Figure name="early-passenger-sketch" width={180} height={310} alt="Early sketch of the multi-passenger confirmation screen"><span><L en="Configure passengers." zh="配置乘客。" /></span></Figure><Figure name="early-itinerary-sketch" width={180} height={425} alt="Early sketch of the My Itinerary screen"><span><L en="Keep travel details together." zh="把出行信息放在一起。" /></span></Figure></div></div>
          </section>

          <section id="compare"><p className={styles.eyebrow}><L en="03 / Compare" zh="03 / 比较" /></p><h2><L en="Compare fares and rules in one place." zh="在一个地方比较票价和规则。" /></h2><p><L en={<><strong>Breakdown:</strong> people described difficulty comparing prices across sources and making sense of refund/change rules. <strong>Prototype direction:</strong> keep the primary fare, alternative sources and a concise policy overview within the decision view.</>}
              zh={<><strong>卡点：</strong>大家说很难在不同渠道之间比价，也很难看懂退改规则。<strong>原型方向：</strong>在做决定的页面里，同时放下主票价、其他渠道和一份简洁的规则概要。</>} /></p>
            <div className={styles.triptych}><Figure name="search" width={402} height={874} alt="Flight search screen with route, date and traveller controls"><span><L en="Start with route, dates and travellers." zh="从航线、日期和出行人数开始。" /></span></Figure><Figure name="flight-results" width={402} height={874} alt="Flight result list showing route, duration, source and fare"><span><L en="Flight results establish the options." zh="航班结果先把选项摆出来。" /></span></Figure><Figure name="fare-comparison" width={530} height={885} alt="Ticket information screen with other sources and fares"><span><L en="A source-comparison view makes the difference visible before selection." zh="渠道比较页让差别在选择之前就一目了然。" /></span></Figure></div>
          </section>

          <section id="configure"><p className={styles.eyebrow}><L en="04 / Configure" zh="04 / 配置" /></p><h2><L en="Configure several passengers without repeating work." zh="配置多位乘客，不用一遍遍重复。" /></h2><p><L en={<><strong>Breakdown:</strong> each traveller may need different baggage, seat or other add-ons; repeated configuration can become tedious. <strong>Prototype direction:</strong> passenger-by-passenger sections preserve individual choices, while <em>apply to all passengers</em> handles shared changes.</>}
              zh={<><strong>卡点：</strong>每位旅客可能需要不同的行李、座位或其他附加服务，一遍遍重复配置很磨人。<strong>原型方向：</strong>按乘客分区，保留每个人的选择；共同的改动交给<em>“应用到所有乘客”</em>。</>} /></p>
            <div className={styles.triptych}><Figure name="multi-passengers" width={728} height={1235} alt="Multi-passenger order screen with sections for three passengers"><span><L en="Grouped passengers, one visible total and a payment CTA." zh="乘客分组显示，总价一眼可见，再加一个支付按钮。" /></span></Figure><Figure name="apply-to-all" width={804} height={1748} alt="Multi-passenger order screen with apply to all passengers selected"><span><L en="Apply one setting across the group." zh="一个设置，整组通用。" /></span></Figure><Figure name="baggage-dropdown" width={804} height={1748} alt="Multi-passenger order screen with baggage dropdown options open"><span><L en="Keep the individual baggage choice visible." zh="每个人的行李选择依然看得见。" /></span></Figure></div>
            <p className={styles.annotation}><span aria-hidden="true">↳</span> <L en="The group action supports repetition without erasing passenger-level control." zh="整组操作省去了重复，却没有抹掉每位乘客自己的控制权。" /></p>
          </section>

          <section id="travel"><p className={styles.eyebrow}><L en="05 / Travel" zh="05 / 出行" /></p><h2><L en="Keep post-booking information together." zh="把订票之后的信息放在一起。" /></h2><p><L en={<><strong>Breakdown:</strong> itinerary, airport, boarding and time-planning information can be scattered. <strong>Prototype direction:</strong> My Itinerary consolidates flight details with check-in, change/refund access, airport navigation and a personalised time plan.</>}
              zh={<><strong>卡点：</strong>行程、机场、登机和时间安排的信息常常散落各处。<strong>原型方向：</strong>“我的行程”把航班详情和值机、改签/退票入口、机场导航以及个性化的时间计划整合在一起。</>} /></p>
            <div className={styles.pair}><Figure name="itinerary-overview" width={402} height={874} alt="My Itinerary overview showing flight status and check-in actions"><span><L en="The itinerary starts with the active journey and its next actions." zh="行程页先展示当前这趟旅程和接下来要做的事。" /></span></Figure><Figure name="itinerary-details" width={804} height={1748} alt="Expanded itinerary showing airport information and personalised time plan"><span><L en="Details bring airport information and the time plan into the same flow." zh="详情页把机场信息和时间计划放进同一个流程里。" /></span></Figure></div>
          </section>

          <section id="flow"><p className={styles.eyebrow}><L en="06 / Prototype scope" zh="06 / 原型范围" /></p><h2><L en="A mobile flow across the journey." zh="贯穿整段旅程的手机流程。" /></h2><ol className={styles.flow}><li><L en="Search" zh="搜索" /></li><li><L en="Flight results" zh="航班结果" /></li><li><L en="Source comparison" zh="渠道比较" /></li><li><L en="Passenger add-ons" zh="乘客附加服务" /></li><li><L en="Payment transition" zh="进入支付" /></li><li><L en="Itinerary" zh="行程" /></li><li><L en="Airport support" zh="机场支持" /></li></ol><p className={styles.small}><L en="The screens demonstrate a high-fidelity prototype scope. Completed payment, live fare aggregation and working airport integrations are not documented." zh="这些界面展示的是高保真原型的范围。完整的支付、实时票价聚合和真正接通的机场服务都没有涉及。" /></p></section>

          <section id="contribution"><p className={styles.eyebrow}><L en="07 / Contribution + evidence boundary" zh="07 / 贡献与证据边界" /></p><h2><L en="Research synthesis made the prototype specific." zh="研究归纳让原型变得具体。" /></h2><p className={styles.contribution}><L en={<><strong>Team of four.</strong> Peiwen contributed to Story Interviews, research synthesis, prototyping and presentation.</>} zh={<><strong>4 人团队。</strong>我参与了故事访谈、研究归纳、原型制作和汇报展示。</>} /></p><h3><L en="Where the evidence stops" zh="证据到哪里为止" /></h3><ul><li><L en="20 Story Interviews were completed, but only synthesis-level evidence remains; complete raw notes and a formal coding process are not retained here." zh="20 场故事访谈都完成了，但留下来的只有归纳层面的材料；完整的原始笔记和正式的编码过程没有保存在这里。" /></li><li><L en="The redesign was presented as a high-fidelity prototype; no post-design usability study is documented." zh="重新设计以高保真原型的形式呈现；之后没有做可用性测试。" /></li><li><L en="No validated improvement, production implementation or live data integration is claimed." zh="这里不宣称任何经过验证的改进、上线实现或实时数据接入。" /></li></ul></section>
        </article>
      </div>
      <footer className={styles.footer}><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#flight-booking-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a><p><L en="Flight Booking Experience · Fundamentals of HCI 1 · 2025" zh="机票预订体验 · 人机交互基础 1 · 2025" /></p></footer>
    </main>
  </div>;
}
