import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./music-vr.module.css";

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
      <a className={shell.skipLink} href="#music-vr-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
      <SiteHeader current="projects" />

      <main id="music-vr-content" className={styles.main} tabIndex={-1}>
        <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}><L en="XR · Haptics · Accessibility · 2026" zh="XR · 触觉反馈 · 无障碍 · 2026" /></p>
            <h1><L en={<>Multi-Sensory<br />Music VR</>} zh={<>多感官<br />音乐 VR</>} /></h1>
            <p className={styles.lead}><L en="Making rhythm visible, tangible and spatial." zh="让节奏看得见、摸得着、有空间感。" /></p>
            <p><L en="A four-week Unity XR project exploring how musical rhythm could be translated into visual particles, spatial audio and controller haptics for a more multisensory music experience."
              zh="一个为期四周的 Unity XR 项目：探索怎样把音乐节奏转化为粒子效果、空间音频和手柄触觉反馈，让听音乐变成一种多感官的体验。" /></p>
            <p className={styles.annotation}><L en="Initially developed as a team project; the final prototype was completed independently by Peiwen after the other teammates left."
              zh="它起初是一个团队项目；其他队友离开后，最终原型由我独立完成。" /></p>
            <a className={styles.jump} href="#interaction"><L en="Follow the rhythm ↓" zh="跟着节奏往下看 ↓" /></a>
          </div>
          <figure id="demo" className={styles.heroDemo}>
            <a href={`${assetRoot}/resources/multi-sensory-music-vr-demo.mp4`} target="_blank" rel="noopener noreferrer" aria-label="Open the Multi-Sensory Music VR final demonstration">
              <Image src={`${assetRoot}/hero-sequencer.webp`} width={1920} height={1080} alt="VR music table with colored note blocks, scanner and a virtual character" priority sizes="(max-width: 700px) 86vw, 560px" />
            </a>
            <figcaption><span><L en="Watch the working prototype · 1:18 ↗" zh="观看可运行的原型 · 1:18 ↗" /></span><L en="A spatial block-based sequencer with a scanner, particles and character feedback." zh="一个空间化的方块音序器，带扫描线、粒子效果和角色反馈。" /></figcaption>
          </figure>
        </header>

        <section className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title"><L en="At a glance" zh="项目概览" /></h2>
          <dl className={styles.facts}>
            <div><dt><L en="Challenge" zh="挑战" /></dt><dd><L en="Music interaction often depends on hearing and traditional notation. This project explored whether rhythm could instead be communicated through visual, spatial and tactile cues." zh="音乐交互往往依赖听觉和传统乐谱。这个项目想试试：节奏能不能改用视觉、空间和触觉线索来传达？" /></dd></div>
            <div><dt><L en="Approach" zh="方法" /></dt><dd><L en="Prototype the interaction first with AR and physical vibration hardware, then rebuild it in VR after hardware and platform constraints made the original direction infeasible." zh="先用 AR 和实体振动硬件做交互原型；硬件和平台的限制让原方向走不通之后，再在 VR 里重建。" /></dd></div>
            <div><dt><L en="Final system" zh="最终系统" /></dt><dd><L en="A Unity VR prototype where users place colored note blocks on a table and experience each note through particles, spatial audio, controller haptics and character feedback." zh="一个 Unity VR 原型：用户把彩色音符方块放到桌上，通过粒子效果、空间音频、手柄触觉反馈和角色反馈来感受每一个音符。" /></dd></div>
            <div><dt><L en="My role" zh="我的角色" /></dt><dd><L en="Concept · Accessibility research · AR and hardware prototyping · XR interaction · Unity engineering · Haptics · Debugging · Presentation and report." zh="概念 · 无障碍调研 · AR 与硬件原型 · XR 交互 · Unity 开发 · 触觉反馈 · 调试 · 答辩与报告。" /></dd></div>
          </dl>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div><p className={styles.eyebrow}><L en="Project materials" zh="项目资料" /></p><h2 id="materials-title"><L en="See it in motion." zh="看它动起来。" /></h2></div>
          <ul><li><a href={`${assetRoot}/resources/multi-sensory-music-vr-demo.mp4`} target="_blank" rel="noopener noreferrer"><L en="Watch final demo ↗" zh="观看最终演示 ↗" /></a></li></ul>
        </section>

        <div className={styles.layout}>
          <aside className={styles.contents}>
            <nav aria-label="Inside the project">
              <p><L en="Inside the project" zh="项目目录" /></p>
              <a href="#question"><L en="01 · Design question" zh="01 · 设计问题" /></a>
              <a href="#ar"><L en="02 · Physical haptics" zh="02 · 实体触觉" /></a>
              <a href="#pivot"><L en="03 · AR → VR" zh="03 · 从 AR 到 VR" /></a>
              <a href="#interaction"><L en="04 · Direct manipulation" zh="04 · 直接操作" /></a>
              <a href="#timing"><L en="05 · Rhythm mapping" zh="05 · 节奏映射" /></a>
              <a href="#architecture"><L en="06 · Three channels" zh="06 · 三个感官通道" /></a>
              <a href="#feedback"><L en="07 · Embodied feedback" zh="07 · 具身反馈" /></a>
              <a href="#scope"><L en="08 · Scope" zh="08 · 范围" /></a>
            </nav>
          </aside>

          <article className={styles.story} aria-label="Multi-Sensory Music VR case study">
            <section id="question">
              <p className={styles.kicker}><L en="01 · Design question" zh="01 · 设计问题" /></p>
              <h2><L en="How can rhythm be represented through sight and touch?" zh="节奏，能不能用眼睛和手来感受？" /></h2>
              <p><L en="Rather than starting from sheet music or an audio-only interface, I explored rhythm as a sequence of visible, placeable events. The goal was an accessibility-oriented interaction that could communicate timing without relying on hearing alone."
                zh="我没有从乐谱或纯音频界面出发，而是把节奏看成一串看得见、放得下的事件。目标是做一个面向无障碍的交互：不只靠听觉，也能传达时间感。" /></p>
              <blockquote><L en="How can musical rhythm be represented through sight and touch, rather than relying on hearing alone?" zh="音乐节奏能不能通过视觉和触觉来表达，而不只依赖听觉？" /></blockquote>
              <p className={styles.note}><L en="This is a technical prototype, not an accessibility evaluation. It had no formal user study and no Deaf or Hard-of-Hearing participant testing."
                zh="这是一个技术原型，不是无障碍评估。没有做正式的用户研究，也没有聋人或听障参与者参与测试。" /></p>
            </section>

            <section id="ar">
              <p className={styles.kicker}><L en="02 · Begin with physical haptics" zh="02 · 从实体触觉开始" /></p>
              <h2><L en="The first idea was not VR." zh="最初的想法，并不是 VR。" /></h2>
              <p><L en="The initial Unity concept used AR, a moving scanner and an Arduino vibration motor. It was a hardware experiment: BPM timing and scanner events were used to trigger a physical vibration outside the visual interface. The archived source also records WebSocket-based hardware experimentation in this early path."
                zh="最初的 Unity 概念用的是 AR、一条移动的扫描线和一个 Arduino 振动马达。这是一次硬件实验：用 BPM 计时和扫描事件，在视觉界面之外触发一次实体振动。存档的源码里也记录了这条早期路线上基于 WebSocket 的硬件尝试。" /></p>
              <div className={styles.earlyFlow} aria-label="Early AR prototype technical chain">
                <div><strong><L en="AR blocks" zh="AR 方块" /></strong><span><L en="place a rhythm" zh="摆出一段节奏" /></span></div><b aria-hidden="true">→</b><div><strong><L en="Scanner" zh="扫描线" /></strong><span><L en="reaches a block" zh="碰到一个方块" /></span></div><b aria-hidden="true">→</b><div><strong><L en="Arduino motor" zh="Arduino 马达" /></strong><span><L en="physical vibration" zh="实体振动" /></span></div>
              </div>
              <div className={styles.earlyEvidence}>
                <Figure name="early-unity-scanner" width={640} height={480} alt="Early Unity scanner prototype recorded in the project WhatsApp video"><L en="Early Unity scanner state from the first prototype recording." zh="第一次原型录像里，早期 Unity 扫描线的样子。" /></Figure>
              </div>
              <p className={styles.pencilNote}><span aria-hidden="true">↳</span> <L en="The interaction idea was sensory mapping, not one display technology." zh="交互的核心是感官映射，而不是某一种显示技术。" /></p>
            </section>

            <section id="pivot">
              <p className={styles.kicker}><L en="03 · Technical pivot" zh="03 · 技术转向" /></p>
              <h2><L en="When the hardware path disappeared, the interaction had to survive." zh="硬件这条路断了，交互还得活下来。" /></h2>
              <p><L en="Two documented constraints changed the implementation: MRTK was incompatible with the available macOS setup, and access to the planned AR hardware was lost. I kept the core mapping and rebuilt the final prototype around a stable VR pipeline and controller haptics."
                zh="两个有记录的限制改变了实现方式：MRTK 和手头的 macOS 环境不兼容，原本计划用的 AR 硬件也用不了了。我保留了核心映射，围绕稳定的 VR 流程和手柄触觉反馈，重建了最终原型。" /></p>
              <div className={styles.pivot} aria-label="AR prototype moved through technical constraints to VR prototype">
                <div><span><L en="Before" zh="之前" /></span><strong><L en="AR prototype" zh="AR 原型" /></strong><small><L en="physical motor" zh="实体马达" /></small></div><b aria-hidden="true">→</b><div><span><L en="Constraint" zh="限制" /></span><strong><L en="MRTK + hardware access" zh="MRTK + 硬件无法使用" /></strong><small><L en="medium changed" zh="换了载体" /></small></div><b aria-hidden="true">→</b><div><span><L en="Final" zh="最终" /></span><strong><L en="VR prototype" zh="VR 原型" /></strong><small><L en="controller haptics" zh="手柄触觉反馈" /></small></div>
              </div>
              <p className={styles.conclusion}><L en="The sensory mapping mattered more than the display technology." zh="感官映射，比显示技术更重要。" /></p>
            </section>

            <section id="interaction">
              <p className={styles.kicker}><L en="04 · Direct manipulation" zh="04 · 直接操作" /></p>
              <h2><L en="Turn music into something you can place." zh="把音乐变成可以摆放的东西。" /></h2>
              <p><L en="The final system is a spatial block-based sequencer. A user picks up colored note blocks, places them on the interaction table, then lets a scanner travel across the sequence."
                zh="最终的系统是一个空间化的方块音序器：拿起彩色音符方块，放到交互桌上，再让扫描线扫过整段序列。" /></p>
              <ol className={styles.steps} aria-label="Final interaction flow">
                <li><span>01</span><strong><L en="Grab" zh="抓取" /></strong><small><L en="Pick up a colored note block." zh="拿起一个彩色音符方块。" /></small></li>
                <li><span>02</span><strong><L en="Place" zh="放置" /></strong><small><L en="Arrange it on the table." zh="把它摆到桌上。" /></small></li>
                <li><span>03</span><strong><L en="Scan" zh="扫描" /></strong><small><L en="The scanner moves through the sequence." zh="扫描线依次扫过序列。" /></small></li>
                <li><span>04</span><strong><L en="Trigger" zh="触发" /></strong><small><L en="Each note produces sensory feedback." zh="每个音符都会带来感官反馈。" /></small></li>
              </ol>
              <div className={styles.pair}>
                <Figure name="grab-place" width={1920} height={1080} alt="Unity XR view with a controller ray reaching toward colored note blocks"><L en="A controller ray makes the grab-and-place interaction visible." zh="手柄射线让“抓取—放置”的交互变得看得见。" /></Figure>
                <Figure name="scanner-trigger" width={1920} height={1080} alt="Scanner crossing a note block while particles appear in the Unity prototype"><L en="A scanner crossing triggers visible feedback." zh="扫描线经过方块时，触发看得见的反馈。" /></Figure>
              </div>
            </section>

            <section id="timing">
              <p className={styles.kicker}><L en="05 · Rhythm as time" zh="05 · 节奏即时间" /></p>
              <h2><L en="Map musical timing into interaction timing." zh="把音乐的时间，映射成交互的时间。" /></h2>
              <p><L en="In the final implementation, BPM sets the temporal scale and each note type contributes its duration ratio. That timing drives how the scanner traverses the table and how long a triggered feedback event can last."
                zh="在最终实现里，BPM 决定时间尺度，每种音符再贡献自己的时值比例。这个时长决定了扫描线怎样走过桌面，也决定了一次被触发的反馈能持续多久。" /></p>
              <div className={styles.formula} aria-label="Formula: duration milliseconds equals 60000 divided by BPM times note ratio"><code>duration_ms = (60000 / BPM) × note_ratio</code></div>
              <div className={styles.mapping}>
                <div><strong>BPM</strong><span><L en="sets the rhythm's time scale" zh="决定节奏的时间尺度" /></span></div><b aria-hidden="true">→</b><div><strong><L en="Note ratio" zh="音符比例" /></strong><span><L en="sets the note's duration" zh="决定音符的时值" /></span></div><b aria-hidden="true">→</b><div><strong><L en="Feedback" zh="反馈" /></strong><span><L en="maps duration into the event" zh="把时长映射进事件" /></span></div>
              </div>
              <p><L en="The source confirms that longer note types are mapped to stronger and longer controller haptics in the final prototype. This is an implemented mapping, not a claim that any one intensity is optimal for users."
                zh="源码可以确认：在最终原型里，越长的音符对应越强、越久的手柄振动。这是已经实现的映射，并不代表某个强度对用户来说就是最优的。" /></p>
            </section>

            <section id="architecture">
              <p className={styles.kicker}><L en="06 · System architecture" zh="06 · 系统架构" /></p>
              <h2><L en="Trigger three sensory channels from the same event." zh="同一个事件，触发三个感官通道。" /></h2>
              <p><L en="The technical centerpiece is one shared trigger path. When the moving scan position reaches a note block, the system starts audio, visual particles and VR controller haptics from that musical event."
                zh="技术上的核心是一条共享的触发路径：当移动的扫描位置碰到音符方块，系统就从这一个音乐事件出发，同时启动音频、粒子效果和 VR 手柄触觉反馈。" /></p>
              <div className={styles.architecture} aria-label="ScannerLineMover reaches NoteBlock then triggers audio, visual particles and VR controller haptics">
                <div><code>ScannerLineMover</code><span><L en="moves at the current BPM" zh="按当前 BPM 移动" /></span></div><b aria-hidden="true">→</b><div><code>NoteBlock</code><span><L en="calculates duration + note behavior" zh="计算时长 + 音符行为" /></span></div><b aria-hidden="true">→</b><div className={styles.channels}><strong><L en="Audio" zh="音频" /></strong><strong><L en="Particles" zh="粒子效果" /></strong><strong><L en="Controller haptics" zh="手柄触觉反馈" /></strong></div>
              </div>
              <div className={`${styles.pair} ${styles.supportingPair}`}>
                <Figure name="particle-trigger" width={1920} height={1080} alt="Particle effects appearing around triggered note blocks in the Unity prototype"><L en="A triggered block produces a visible particle response." zh="被触发的方块会冒出看得见的粒子效果。" /></Figure>
                <Figure name="haptic-mapping" width={1920} height={1080} alt="Unity sequencer view showing colored blocks, scanner line and vibration strength control"><L en="The prototype exposes BPM and vibration-strength controls alongside the sequence." zh="原型在序列旁边提供了 BPM 和振动强度的调节。" /></Figure>
              </div>
            </section>

            <section id="feedback">
              <p className={styles.kicker}><L en="07 · Virtual human feedback" zh="07 · 虚拟人反馈" /></p>
              <h2><L en="A character mirrors the rhythm." zh="一个小角色，跟着节奏动起来。" /></h2>
              <div className={styles.feedbackGrid}>
                <Figure name="virtual-boy-feedback" width={940} height={760} alt="Cropped Unity frame showing the virtual boy standing beside the music table"><L en="The character is kept visible beside the sequence as feedback is triggered." zh="反馈被触发时，角色一直站在序列旁边，看得见。" /></Figure>
                <div><p><L en={<>The final build includes <code>BoyHearingManager</code>: it starts a clapping animation when a note is triggered, adjusts the animation speed with the current rhythm and returns to idle after a period without triggering.</>}
                  zh={<>最终版本里有一个 <code>BoyHearingManager</code>：音符被触发时，它会启动拍手动画，按当前节奏调整动画速度；一段时间没有触发后，再回到待机状态。</>} /></p><p><L en="This is embodied feedback tied to the same music event. It is not presented as evidence of social presence or emotional benefit."
                  zh="这是和同一个音乐事件绑定的具身反馈，并不能当作社交临场感或情绪益处的证据。" /></p></div>
              </div>
            </section>

            <section id="scope">
              <p className={styles.kicker}><L en="08 · Reflection + scope" zh="08 · 反思 + 范围" /></p>
              <h2><L en="What the prototype demonstrates." zh="这个原型证明了什么。" /></h2>
              <ul className={styles.demonstrates}>
                <li><L en="A concrete translation from BPM and note duration into a running XR interaction." zh="把 BPM 和音符时值，具体转化成一个能跑起来的 XR 交互。" /></li>
                <li><L en="A technical pivot that preserved the interaction model while changing its hardware medium." zh="一次技术转向：换掉了硬件载体，却保住了交互模型。" /></li>
                <li><L en="Unity implementation across direct manipulation, scene flow, scanner timing, particles, spatial audio, haptics and character response." zh="Unity 实现覆盖了直接操作、场景流程、扫描计时、粒子效果、空间音频、触觉反馈和角色响应。" /></li>
              </ul>
              <h3><L en="Where the evidence stops" zh="证据到哪里为止" /></h3>
              <ul>
                <li><L en="No formal user study or comparison condition was conducted." zh="没有做正式的用户研究，也没有对照条件。" /></li>
                <li><L en="No Deaf or Hard-of-Hearing participants were tested." zh="没有聋人或听障参与者参与测试。" /></li>
                <li><L en="The prototype does not validate accessibility, usability, cognitive-load, therapeutic or emotional outcomes." zh="这个原型不能验证无障碍、易用性、认知负荷、治疗或情绪方面的效果。" /></li>
                <li><L en="AR hardware constraints meant the final build uses VR controller haptics instead of the original external motor path." zh="受 AR 硬件限制，最终版本用的是 VR 手柄振动，而不是最初的外接马达方案。" /></li>
                <li><L en="Visual complexity, musical variation and virtual-human behaviours remained limited by the four-week scope." zh="受四周时长所限，视觉丰富度、音乐变化和虚拟人的行为都还比较有限。" /></li>
              </ul>
              <p className={styles.reflection}><L en={<><strong>My takeaway:</strong> a multisensory interaction does not need to begin as an abstract feature list. It can start with one shared timing event, then make that event legible through placement, movement, sight, sound and touch.</>}
                zh={<><strong>我的收获：</strong>多感官交互不必从一张抽象的功能清单开始。它可以从一个共享的时间事件出发，再通过摆放、移动、视觉、声音和触觉，让这个事件变得可以被读懂。</>} /></p>
            </section>
          </article>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#music-vr-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a><p><L en="Multi-Sensory Music VR · Advanced Immersive Interaction · 2026" zh="多感官音乐 VR · 高级沉浸式交互课程 · 2026" /></p>
        </footer>
      </main>
    </div>
  );
}
