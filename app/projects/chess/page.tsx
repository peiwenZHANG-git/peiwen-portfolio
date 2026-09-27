import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./chess.module.css";

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
    <a className={shell.skipLink} href="#chess-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="chess-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true">♞ </span><L en="HCI Interaction Concept · 2025" zh="HCI 交互概念 · 2025" /></p>
          <h1><L en="Chess" zh="国际象棋" /></h1>
          <p className={styles.lead}><L en="Designing a chess experience around why people come to play." zh="围绕“人为什么来下棋”，设计一种国际象棋体验。" /></p>
          <p><L en="A one-week HCI concept exploring intent-based navigation, flexible game setup, learning modes, voice notes and parallel media experiences."
            zh="一个为期一周的 HCI 概念设计，探索了基于意图的导航、灵活的对局设置、学习模式、语音笔记，以及边下棋边看视频的并行媒体体验。" /></p>
          <p className={styles.heroMeta}><L en="Université Paris-Saclay · M1 HCI · Fundamentals of Human-Computer Interaction · 1 week · Team of 4" zh="巴黎-萨克雷大学 · HCI 硕士一年级 · 人机交互基础 · 1 周 · 4 人团队" /></p>
          <p className={styles.role}><L en={<><strong>My role</strong> Research · Concept Development · Low-fi Prototyping · Prototype Interaction · User Testing</>}
            zh={<><strong>我的角色</strong> 调研 · 概念发展 · 低保真原型 · 原型交互 · 用户测试</>} /></p>
          <a className={styles.jump} href="#intent"><L en="Start with intent ↓" zh="从意图开始看 ↓" /></a>
        </div>
        <Figure name="main" width={2560} height={1664} alt="High-fidelity chess platform prototype showing Watch, Play, Learn and Community as primary intent-based navigation" priority><L en="One homepage, organized around different reasons to come to chess." zh="一个首页，围绕人们来下棋的不同理由来组织。" /></Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Challenge" zh="挑战" /></dt><dd><L en="A chess platform can serve quick play, learning, watching, reflection and community, yet conventional navigation often treats them as parallel feature lists." zh="一个国际象棋平台可以承载快棋、学习、观战、复盘和社区，但传统导航常常把它们当成一排并列的功能清单。" /></dd></div>
          <div><dt><L en="Approach" zh="方法" /></dt><dd><L en="We explored an intent-first interaction model, then developed low- and high-fidelity flows around different ways of engaging with chess." zh="我们先探索了“意图优先”的交互模型，再围绕不同的下棋方式，做出低保真和高保真的流程。" /></dd></div>
          <div><dt><L en="My contribution" zh="我的贡献" /></dt><dd><L en="Research, concept development, low-fidelity prototyping, prototype interaction and informal user testing." zh="调研、概念发展、低保真原型、原型交互，以及非正式的用户测试。" /></dd></div>
        </dl>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}><L en="Project materials" zh="项目资料" /></p><h2 id="materials-title"><L en="Explore the original prototype." zh="看看原始原型。" /></h2></div>
        <div><a href="https://www.figma.com/design/zIYzqPrzlfBqGpQNDrgiDB/Hci1-Ta4?node-id=102-2" target="_blank" rel="noopener noreferrer"><L en="View prototype ↗" zh="查看原型 ↗" /></a><a href="https://youtu.be/0n3FSCH9q-E" target="_blank" rel="noopener noreferrer"><L en="Watch prototype demo ↗" zh="观看原型演示 ↗" /></a></div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}><nav aria-label="Case study chapters"><p className={styles.eyebrow}><L en="Inside the concept" zh="概念目录" /></p><a href="#challenge"><L en="01 · Design challenge" zh="01 · 设计挑战" /></a><a href="#intent"><L en="02 · Intent model" zh="02 · 意图模型" /></a><a href="#lowfi"><L en="03 · Low-fi exploration" zh="03 · 低保真探索" /></a><a href="#ideas"><L en="04 · Interaction ideas" zh="04 · 交互想法" /></a><a href="#testing"><L en="05 · Informal testing" zh="05 · 非正式测试" /></a><a href="#reflection"><L en="06 · Reflection + scope" zh="06 · 反思与范围" /></a></nav></aside>
        <article className={styles.story} aria-label="Chess HCI interaction concept case study">
          <section id="challenge"><p className={styles.eyebrow}><L en="01 / Design challenge" zh="01 / 设计挑战" /></p><h2><L en="Design around intent rather than feature categories." zh="围绕意图来设计，而不是功能分类。" /></h2><p><L en="How might a chess platform adapt to different intentions — playing, learning, watching and reflecting — instead of forcing every user through the same experience?" zh="一个国际象棋平台，能不能顺着不同的意图——下棋、学习、观战、复盘——做出调整，而不是让每个人都走同一条路？" /></p><p className={styles.annotation}><span aria-hidden="true">↳</span> <L en="The concept started with the reason for arriving, then shaped the path through the platform." zh="这个概念先问“你为什么来”，再据此铺出在平台里的路径。" /></p></section>

          <section id="intent"><p className={styles.eyebrow}><L en="02 / Intent model" zh="02 / 意图模型" /></p><h2><L en="Start with intent, not features." zh="从意图出发，而不是从功能出发。" /></h2><div className={styles.intentGrid}><Figure name="intent-question" width={2560} height={1664} alt="Onboarding prototype asking what the user wants to do: play, learn, challenge, watch, join community or browse"><span><L en="The onboarding question represents an interaction concept, not an adaptive algorithm." zh="引导页上的这个问题代表的是一种交互概念，而不是自适应算法。" /></span></Figure><div className={styles.intentMap}><p><L en="Intent" zh="意图" /></p><span><L en="Quick play" zh="快速对局" /></span><span><L en="Learn" zh="学习" /></span><span><L en="Challenge" zh="挑战" /></span><span><L en="Watch" zh="观战" /></span><span><L en="Community" zh="社区" /></span><span><L en="Browse" zh="随便逛逛" /></span><strong>↓</strong><p><L en="Navigation cues" zh="导航提示" /></p><small><L en="Play · Learn · Watch · Community" zh="下棋 · 学习 · 观战 · 社区" /></small></div></div><p><L en="Rather than starting from a feature taxonomy, we explored what users were trying to do in a particular moment: play quickly, learn, challenge themselves, watch, socialise or simply browse." zh="我们没有从功能分类出发，而是去想用户在某个时刻想做什么：快速下一盘、学点东西、挑战自己、看别人下、和人交流，或者只是随便逛逛。" /></p></section>

          <section id="lowfi"><p className={styles.eyebrow}><L en="03 / Low-fi exploration" zh="03 / 低保真探索" /></p><h2><L en="From flow to interaction model." zh="从流程到交互模型。" /></h2><p><L en="The low-fidelity prototype helped us test the relationship between onboarding, modes and task-specific flows before investing in detailed screens." zh="在投入精细界面之前，低保真原型帮我们先检验了引导、模式和具体任务流程之间的关系。" /></p><Figure name="lowfi-flow" width={5532} height={3090} alt="Low-fidelity chess prototype flow connecting question page, main page, game modes, review and learning screens"><span><L en="A one-week process map: establish the flow and mode structure before polishing individual screens." zh="一周的流程图：先把流程和模式结构定下来，再去打磨单个界面。" /></span></Figure></section>

          <section id="ideas"><p className={styles.eyebrow}><L en="04 / Interaction ideas" zh="04 / 交互想法" /></p><h2><L en="Four ways the concept responded to intent." zh="这个概念回应意图的四种方式。" /></h2>
            <div className={styles.idea}><div><p className={styles.storyTag}><L en="01 · PLAY" zh="01 · 下棋" /></p><h3><L en="Make starting a game feel lightweight" zh="让开一局棋变得轻松" /></h3><p><L en={<><strong>Problem:</strong> preset-heavy game setup can turn a simple intention into a choice-heavy step.</>} zh={<><strong>问题：</strong>预设选项太多的对局设置，会把一个简单的念头变成一道选择题。</>} /></p><p><L en={<><strong>Concept:</strong> a continuous duration control frames game time as a spectrum from quick games to longer sessions.</>} zh={<><strong>概念：</strong>用一个连续的时长控件，把对局时间变成一条从快棋到长局的光谱。</>} /></p></div><Figure name="duration" width={2560} height={1664} alt="Chess prototype with a Choose Game Duration modal and a slider from three to sixty minutes"><span><L en="The concept explored a time spectrum rather than a dense list of presets." zh="这个概念尝试用一条时间光谱，代替密密麻麻的预设列表。" /></span></Figure></div>
            <div className={`${styles.idea} ${styles.reverse}`}><Figure name="learning-history" width={2560} height={1664} alt="Chess prototype Game History view with Learn, Review and Challenge navigation"><span><L en="Learning is represented as a distinct mode of use." zh="学习被呈现为一种独立的使用模式。" /></span></Figure><div><p className={styles.storyTag}><L en="02 · LEARN" zh="02 · 学习" /></p><h3><L en="Treat learning as a mode, not a side feature" zh="把学习当成一种模式，而不是附属功能" /></h3><p><L en="Learning was treated as a distinct way of using the platform rather than a secondary content section. The prototype separated lessons, review and challenge while preserving access to previous games." zh="学习被当作使用平台的一种独立方式，而不是次要的内容板块。原型把课程、复盘和挑战分开，同时保留了回看过往对局的入口。" /></p></div></div>
            <div className={styles.notes}><div><p className={styles.storyTag}><L en="03 · REFLECT" zh="03 · 复盘" /></p><h3><L en="Capture thoughts without leaving the board" zh="不离开棋盘，也能记下想法" /></h3><p><L en="Notes and voice input explored how players might capture thoughts during a game without switching to a separate note-taking tool." zh="笔记和语音输入探索的是：玩家怎样在对局中记下想法，而不用切到另一个记笔记的工具。" /></p><p><L en="The prototype represented a speech-recognition state, making the interaction visible rather than treating speech as an invisible background action." zh="原型专门画出了“正在识别语音”的状态，让这个交互被看见，而不是把语音当成后台里看不见的动作。" /></p></div><div className={styles.screenPair}><Figure name="board-notes" width={2560} height={1664} alt="Chess board prototype with Notes, Voice Input, Music and TV controls"><span><L en="Board state with note and media controls." zh="带笔记和媒体控件的棋盘界面。" /></span></Figure><Figure name="voice-state" width={2560} height={1664} alt="Chess board prototype showing a Recognizing speech interaction state"><span><L en="A visible prototype state for voice input." zh="语音输入时可见的原型状态。" /></span></Figure></div></div>
            <div className={styles.idea}><Figure name="parallel-media" width={2560} height={1664} alt="Chess board prototype with a lightweight media window alongside the game"><span><L en="Media sits alongside, rather than replacing, the board." zh="媒体放在棋盘旁边，而不是取代棋盘。" /></span></Figure><div><p className={styles.storyTag}><L en="04 · WATCH" zh="04 · 观看" /></p><h3><L en="Explore parallel media while playing" zh="边下棋，边看点什么" /></h3><p><L en="The concept also explored what happens when playing is not the only activity. A lightweight media layer could support watching or listening alongside the game." zh="这个概念也探索了：当下棋不是唯一在做的事时会怎样。一个轻量的媒体层，可以让人一边下棋一边看或听。" /></p><p className={styles.small}><L en="That possibility also creates new competition for screen space and attention." zh="但这种可能性也带来了新的争夺——屏幕空间和注意力。" /></p></div></div>
          </section>

          <section id="testing"><p className={styles.eyebrow}><L en="05 / Informal user testing" zh="05 / 非正式用户测试" /></p><h2><L en="Testing surfaced new trade-offs." zh="测试暴露了新的取舍。" /></h2><p><L en="Informal user testing helped us identify where experimental interaction ideas introduced new usability risks." zh="非正式的用户测试帮我们看到：哪些实验性的交互想法带来了新的可用性风险。" /></p><dl className={styles.findings}><div><dt><L en="Discoverability" zh="可发现性" /></dt><dd><L en="Some experimental controls were not immediately obvious." zh="有些实验性的控件，第一眼并不容易被发现。" /></dd></div><div><dt><L en="Voice in noisy environments" zh="嘈杂环境里的语音" /></dt><dd><L en="Speech interaction raised practical questions in noisy or shared spaces." zh="在嘈杂或多人共处的空间里，语音交互会遇到很实际的问题。" /></dd></div><div><dt><L en="Floating media on smaller screens" zh="小屏幕上的浮动媒体" /></dt><dd><L en="Parallel media could obstruct game content when screen space was limited." zh="屏幕空间有限时，并行的媒体窗口可能会挡住棋局内容。" /></dd></div></dl><p className={styles.small}><L en="The available project record does not preserve participant counts or a formal test protocol, so these observations are presented as formative feedback rather than validated usability results." zh="现有的项目记录没有保留参与人数，也没有正式的测试流程，所以这些观察只作为形成性反馈呈现，而不是经过验证的可用性结论。" /></p></section>

          <section id="reflection"><p className={styles.eyebrow}><L en="06 / Reflection + scope" zh="06 / 反思与范围" /></p><h2><L en="What I learned." zh="我学到了什么。" /></h2><div className={styles.reflections}><div><h3><L en="A concept needs a reason to exist." zh="一个概念，需要存在的理由。" /></h3><p><L en="New interactions are useful only when they connect to a different intention: play, learn, watch or reflect." zh="新的交互只有和某种不同的意图连起来——下棋、学习、观战或复盘——才真正有用。" /></p></div><div><h3><L en="More activity creates more competition for attention." zh="事情越多，注意力越要被争抢。" /></h3><p><L en="Voice, TV and notes can expand an experience while adding discoverability, screen-space and context-management questions." zh="语音、电视和笔记能让体验更丰富，但也带来了可发现性、屏幕空间和情境切换的问题。" /></p></div><div><h3><L en="Low-fi was useful for a one-week project." zh="一周的项目，低保真很好用。" /></h3><p><L en="It made it possible to resolve flow, mode and conceptual structure before moving into high-fidelity screens." zh="它让我们在进入高保真界面之前，就先把流程、模式和概念结构理清楚。" /></p></div></div><div className={styles.scope}><h3><L en="Prototype scope" zh="原型范围" /></h3><p><L en="This was a one-week Figma interaction concept. It did not include a production chess engine, front-end code, backend, real-time multiplayer system or rule-validation code." zh="这是一个用 Figma 做的、为期一周的交互概念，不包含可上线的象棋引擎、前端代码、后端、实时多人对战系统或规则校验代码。" /></p><p><L en="The project focused on interaction structure, prototyping and formative feedback." zh="项目的重点是交互结构、原型制作和形成性反馈。" /></p></div></section>
        </article>
      </div>
      <footer className={styles.footer}><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#chess-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a><p><L en="Chess · Fundamentals of Human-Computer Interaction · 2025" zh="国际象棋 · 人机交互基础 · 2025" /></p></footer>
    </main>
  </div>;
}
