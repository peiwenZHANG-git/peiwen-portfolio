import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./reso.module.css";

export const metadata: Metadata = {
  title: "Reso — Making tone visible · Peiwen Zhang",
  description: "A captioning design case study: two prototype directions, an 18-person hearing-proxy evaluation, and a lesson in visual legibility.",
};

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
    <a className={shell.skipLink} href="#reso-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="reso-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="Reso · 2026 · Accessibility & interaction design" zh="Reso · 2026 · 无障碍与交互设计" /></p>
          <h1><L en="Making tone visible." zh="让语气被看见。" /></h1>
          <p className={styles.lead}><L en="What do captions leave unsaid?" zh="字幕没有说出口的，是什么？" /></p>
          <p><L en="Reso explores how emotion-coloured captions and voice-rhythm visuals might carry some of the context that words alone leave behind."
            zh="Reso 探索的是：用带情绪颜色的字幕和声音节奏的可视化，能不能把单靠文字传达不了的那部分语境带回来。" /></p>
          <p className={styles.annotation}><L en="A promising signal. A lesson in legibility." zh="一个有希望的信号，也是一堂关于“看得懂”的课。" /></p>
          <a className={styles.jump} href="#results"><L en="Read the findings ↓" zh="直接看结论 ↓" /></a>
        </div>
        <figure id="demo" className={styles.heroDemo}>
          <video controls preload="metadata" playsInline poster="/assets/projects/reso/working-prototype.webp" aria-label="Watch Reso working prototype demonstration">
            <source src="/assets/projects/reso/resources/reso-demo.mp4" type="video/mp4" />
            <track kind="captions" src="/assets/projects/reso/resources/reso-demo-en.vtt" srcLang="en" label="English" default />
            Your browser does not support embedded video. <a href="/assets/projects/reso/resources/reso-demo.mp4">Open the demo video</a>.
          </video>
          <figcaption><span><L en="Watch Reso in action · 0:30 ↗" zh="看看 Reso 的实际效果 · 0:30 ↗" /></span><L en="The working prototype: browser speech capture with a local caption overlay." zh="可运行的原型：浏览器采集语音，本地字幕浮层实时显示。" /></figcaption>
        </figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview">
        <h2 id="overview"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Context" zh="背景" /></dt><dd><L en={<>Design Project 1 and 2<br />Université Paris-Saclay · 2026<br />Supervised by Prof. Ouriel Grynszpan</>} zh={<>设计课题 1 与 2<br />巴黎-萨克雷大学 · 2026<br />指导老师：Ouriel Grynszpan 教授</>} /></dd></div>
          <div><dt><L en="My contribution · DP1" zh="我的贡献 · DP1" /></dt><dd><L en="Co-designed the early prototypes with Moizza." zh="与 Moizza 共同设计了早期原型。" /></dd></div>
          <div><dt><L en="My contribution · DP2" zh="我的贡献 · DP2" /></dt><dd><L en="Prototype design, study setup, participant testing, data collection, and post-study prototype revision." zh="原型设计、实验搭建、参与者测试、数据收集，以及实验后的原型迭代。" /></dd></div>
        </dl>
        <p className={styles.small}><L en="DP2 team: Moizza Azhar, Peiwen Zhang, Bill Tang, Daniyal Nasiri-Bavil, and Osuke Sashida. System implementation and study findings below are team outcomes; my contributions are identified separately."
          zh="DP2 团队：Moizza Azhar、Peiwen Zhang、Bill Tang、Daniyal Nasiri-Bavil、Osuke Sashida。下文的系统实现和研究结论是团队成果，我个人的贡献会单独标出。" /></p>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div>
          <p className={styles.eyebrow}><L en="Project materials" zh="项目资料" /></p>
          <h2 id="materials-title"><L en="See the work in context." zh="看看完整的资料。" /></h2>
        </div>
        <ul>
          <li><a href="/assets/projects/reso/resources/reso-demo.mp4" target="_blank" rel="noopener noreferrer"><L en="Watch demo ↗" zh="观看演示 ↗" /></a></li>
          <li><a href="https://danietzio.github.io/deafDHH.github.io/" target="_blank" rel="noopener noreferrer"><L en="Try the experiment ↗" zh="体验实验 ↗" /></a></li>
          <li><a href="/assets/projects/reso/resources/reso-project-report.pdf" target="_blank" rel="noopener noreferrer"><L en="Project report ↗" zh="项目报告 ↗" /></a></li>
          <li><a href="/assets/projects/reso/resources/reso-presentation.pdf" target="_blank" rel="noopener noreferrer"><L en="Presentation ↗" zh="答辩演示 ↗" /></a></li>
          <li><a href="/assets/projects/reso/resources/reso-analysis-report.html" target="_blank" rel="noopener noreferrer"><L en="Analysis report ↗" zh="数据分析报告 ↗" /></a></li>
        </ul>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}><L en="Inside the project" zh="项目目录" /></p>
            <a href="#gap"><L en="01 · The question" zh="01 · 问题" /></a>
            <a href="#prototypes"><L en="02 · Early exploration" zh="02 · 早期探索" /></a>
            <a href="#system"><L en="03 · Working system" zh="03 · 可运行的系统" /></a>
            <a href="#study"><L en="04 · The evaluation" zh="04 · 评估实验" /></a>
            <a href="#results"><L en="05 · What we learned" zh="05 · 我们学到了什么" /></a>
            <a href="#iteration"><L en="06 · Making it clearer" zh="06 · 让它更清楚" /></a>
            <a href="#reflection"><L en="07 · Looking back" zh="07 · 回顾" /></a>
          </nav>
        </aside>
        <article className={styles.story} aria-label="Reso case study">
          <section id="gap">
            <p className={styles.eyebrow}><L en="01 / The gap" zh="01 / 缺口" /></p>
            <h2><L en="The words arrive. The tone may not." zh="字到了，语气却未必。" /></h2>
            <p><L en="A transcript can preserve what someone says without conveying how they say it. Reso began with that design gap: how might captions make emotional tone and changes in vocal intensity easier to interpret?"
              zh="文字稿能记下一个人说了什么，却传达不了他是怎么说的。Reso 就从这个设计缺口出发：字幕能不能让情绪语气和声音强弱的变化更容易被理解？" /></p>
            <p><L en="Our intended context was online communication for Deaf and Hard-of-Hearing (DHH) people. This was an exploration of a design possibility, not a validated account of DHH users’ needs."
              zh="我们设想的场景是聋人和听障人士（DHH）的线上交流。这是对一种设计可能性的探索，并不是对 DHH 用户需求的验证。" /></p>
            <div className={styles.pair}>
              <Figure name="plain-captions" width={1125} height={180} alt="Plain white caption on a black background"><L en="Plain captions: words without added emotion or rhythm cues." zh="普通字幕：只有文字，没有情绪或节奏提示。" /></Figure>
              <Figure name="enriched-captions" width={1112} height={211} alt="Green emotion-coloured caption above a voice-intensity graph"><L en="Reso: colour and rhythm together. These source examples show different utterances." zh="Reso：颜色与节奏一起出现。两张示例来自不同的语句。" /></Figure>
            </div>
            <h3><L en="The design space" zh="设计空间" /></h3>
            <p><L en="We explored two forms: a screen-based prototype and an AR headset concept. Across these directions, the question was the same: could emotional colour and visual sound patterns add useful context without becoming another thing to decode?"
              zh="我们探索了两种形态：屏幕原型和 AR 头显概念。两个方向要回答的是同一个问题：情绪颜色和声音的视觉图案，能不能在补充有用语境的同时，不变成又一样需要费力解读的东西？" /></p>
          </section>

          <section id="prototypes">
            <p className={styles.eyebrow}><L en="02 / DP1 · Two prototypes" zh="02 / DP1 · 两个原型" /></p>
            <h2><L en="Make the idea tangible before building it." zh="先让想法摸得着，再动手做。" /></h2>
            <p><L en={<><strong>My role:</strong> I co-designed the early prototypes with Moizza, exploring a screen-based interface and an AR headset direction.</>}
              zh={<><strong>我的角色：</strong>和 Moizza 共同设计早期原型，分别探索了屏幕界面和 AR 头显两个方向。</>} /></p>
            <div className={`${styles.pair} ${styles.prototypePair}`}>
              <Figure name="paper-sound-blocks" width={1130} height={896} alt="Paper screen prototype with a meeting transcript and square sound blocks"><L en="Screen prototype: abstract blocks explored how to make sound visible." zh="屏幕原型：用抽象的方块尝试把声音“画”出来。" /></Figure>
              <Figure name="paper-emotion-colours" width={1120} height={818} alt="Paper caption prototype using several text colours and an emotion legend"><L en="Emotion-colour exploration: the caption itself carries an additional cue." zh="情绪颜色探索：字幕本身多带了一层提示。" /></Figure>
            </div>
            <p className={styles.small}><L en="The AR headset concept was part of DP1; the selected source material does not include an AR mockup to reproduce here."
              zh="AR 头显概念属于 DP1 的一部分；手头的资料里没有可以放在这里的 AR 效果图。" /></p>
            <h3><L en="First study · 3-person Wizard-of-Oz testing" zh="第一次测试 · 3 人“绿野仙踪”式测试" /></h3>
            <p><L en="The early team study used Wizard-of-Oz testing to try the concept before a complete system existed. Emotion colour felt intuitive, while the abstract sound blocks were difficult to understand. This was formative feedback from three people, not evidence of effectiveness at scale."
              zh="在完整系统还没做出来时，团队先用“绿野仙踪”（Wizard-of-Oz）的方式试了这个概念：情绪颜色让人觉得很直观，抽象的声音方块却很难看懂。这只是三个人的形成性反馈，不能证明大规模下的效果。" /></p>
            <h3><L en="Scope decision · Take the screen-based direction forward" zh="范围决定 · 继续推进屏幕方向" /></h3>
            <p><L en="DP2 developed the caption-overlay direction into a working system. The AR direction remained an exploration. The key question carried forward was whether the extra visual information would help people interpret emotion—or compete for their attention."
              zh="DP2 把字幕浮层这个方向做成了可运行的系统，AR 方向则停留在探索阶段。带到下一阶段的关键问题是：多出来的视觉信息，到底是在帮人读懂情绪，还是在和字幕抢注意力？" /></p>
          </section>

          <section id="system">
            <p className={styles.eyebrow}><L en="03 / DP2 · Built system" zh="03 / DP2 · 做出来的系统" /></p>
            <h2><L en="From speech to a visible layer of context." zh="从语音，到一层看得见的语境。" /></h2>
            <ol className={styles.flow} aria-label="Working system flow">
              <li><span>01</span><L en="Browser speech capture" zh="浏览器语音采集" /></li>
              <li><span>02</span><L en="Local transparent overlay / control panel" zh="本地透明浮层 / 控制面板" /></li>
              <li><span>03</span><L en="Emotion tagging" zh="情绪标注" /></li>
              <li><span>04</span><L en="Coloured captions + rhythm visualization" zh="彩色字幕 + 节奏可视化" /></li>
            </ol>
            <div className={styles.systemDetail}>
              <Figure name="overlay-control-panel" width={663} height={988} alt="Emotion Speech Overlay control panel with speech input, listening controls and display settings"><L en="The local control panel used alongside the overlay." zh="与浮层配合使用的本地控制面板。" /></Figure>
              <div><h3><L en="My part in the working prototype" zh="我在可运行原型中的部分" /></h3>
                <p className={styles.contribution}><L en={<><strong>My DP2 contribution:</strong> prototype design, study setup, participant testing, data collection, and post-study prototype revision.</>}
                  zh={<><strong>我在 DP2 的贡献：</strong>原型设计、实验搭建、参与者测试、数据收集，以及实验后的原型迭代。</>} /></p>
                <p><L en="The team’s proof of concept translated caption text into emotion tags and paired the coloured output with a rhythm display. Emotion tags were an interpretive aid, not a definitive reading of a speaker’s feelings."
                  zh="团队的概念验证会把字幕文字转成情绪标签，再把着色后的字幕和节奏显示配在一起。情绪标签只是辅助理解，并不是对说话人感受的定论。" /></p>
                <p className={styles.small}><L en="The working overlay and the controlled evaluation interface are distinct. The study compared two visual conditions using recorded clips."
                  zh="可运行的浮层和对照实验用的界面是两套东西。实验用录好的视频片段比较了两种视觉条件。" /></p>
              </div>
            </div>
            <h3><L en="Reso, built" zh="做出来的 Reso" /></h3>
            <p><L en="The demo above shows the full flow: browser speech capture sends recognised text to the local overlay, where captions receive emotion colour and a live rhythm trace."
              zh="上面的演示展示了完整流程：浏览器采集语音，把识别出的文字送到本地浮层，字幕在那里被染上情绪颜色，并配上实时的节奏曲线。" /></p>
            <p className={styles.small}><L en="The 30-second edit retains the final unclassified phrase because it shows a real prototype limitation."
              zh="这段 30 秒的剪辑保留了最后一句没被分类的话，因为它如实反映了原型的局限。" /></p>
          </section>

          <section id="study">
            <p className={styles.eyebrow}><L en="04 / Study setup" zh="04 / 实验设计" /></p>
            <h2><L en="One participant. Both interfaces." zh="同一个人，两种界面。" /></h2>
            <p className={styles.note}><L en={<><strong>18 hearing proxy participants, aged 18–30.</strong> No DHH participants took part. Muted clips do not reproduce the lived experience of being Deaf or Hard-of-Hearing.</>}
              zh={<><strong>18 名听人代理参与者，年龄 18–30 岁。</strong>没有 DHH 参与者。把视频静音，并不能还原聋人或听障人士的真实经验。</>} /></p>
            <p><L en="In a within-subjects evaluation, each participant experienced plain captions (Condition A) and emotion-coloured captions with a live voice-intensity graph (Condition B). The stimuli were muted, single-speaker clips."
              zh="这是一个被试内实验：每位参与者都体验了普通字幕（条件 A）和带实时声音强度曲线的情绪彩色字幕（条件 B）。实验材料是静音的单人说话片段。" /> <a className={styles.inlineLink} href="https://danietzio.github.io/deafDHH.github.io/" target="_blank" rel="noopener noreferrer"><L en="Open experiment ↗" zh="打开实验 ↗" /></a></p>
            <div className={styles.pair}>
              <Figure name="condition-a" width={1122} height={1119} alt="Condition A study interface with a speaker video, plain caption and emotion response options"><L en={<><strong>Condition A</strong> · Plain captions.</>} zh={<><strong>条件 A</strong> · 普通字幕。</>} /></Figure>
              <Figure name="condition-b" width={1016} height={785} alt="Condition B study interface with a speaker video, coloured caption and voice-intensity graph"><L en={<><strong>Condition B</strong> · Emotion colour + live voice-intensity graph.</>} zh={<><strong>条件 B</strong> · 情绪颜色 + 实时声音强度曲线。</>} /></Figure>
            </div>
            <h3><L en="What we measured" zh="我们测了什么" /></h3>
            <ul><li><L en="Emotion recognition accuracy" zh="情绪识别准确率" /></li><li><L en="Reaction time" zh="反应时间" /></li><li><L en="Raw NASA-TLX workload" zh="Raw NASA-TLX 工作负荷" /></li><li><L en="Qualitative feedback on clarity and usability" zh="关于清晰度和易用性的定性反馈" /></li></ul>
            <p><L en={<><strong>My contribution:</strong> study setup, participant testing, and data collection. The analysis and results are presented as team work.</>}
              zh={<><strong>我的贡献：</strong>实验搭建、参与者测试和数据收集。分析和结果属于团队成果。</>} /></p>
          </section>

          <section id="results">
            <p className={styles.eyebrow}><L en="05 / Results" zh="05 / 结果" /></p>
            <h2><L en="Better recognition. More mixed experience." zh="识别更准了，体验却更复杂了。" /></h2>
            <div className={styles.resultInsight}>
              <p className={styles.resultLabel}><L en="Emotion-recognition accuracy" zh="情绪识别准确率" /></p>
              <strong>50.9% <span aria-hidden="true">→</span> 63.0%</strong>
              <p className={styles.resultDelta}><L en="+12 percentage points" zh="提高 12 个百分点" /></p>
              <p><L en="p < .05 · medium effect" zh="p < .05 · 中等效应量" /></p>
            </div>
            <p><L en="The combined Reso condition improved emotion-recognition accuracy. Because Condition B contained both emotion colour and the rhythm graph, the difference cannot be attributed to colour alone."
              zh="Reso 的组合条件提高了情绪识别准确率。但条件 B 同时包含情绪颜色和节奏曲线，所以这个差异不能只归功于颜色。" /></p>
            <div className={styles.emotionHighlights} aria-label="Largest accuracy gains by emotion">
              <p><span aria-hidden="true">↳</span> <L en="Angry" zh="愤怒" /> <strong>+33 pp</strong></p>
              <p><L en="Sad" zh="悲伤" /> <strong>+28 pp</strong></p>
            </div>
            <Figure name="emotion-results" width={1504} height={721} alt="Accuracy by emotion: the largest increases were Angry, approximately 33 percentage points, and Sad, approximately 28 percentage points"><L en="Original team chart. The gains were largest for Angry and Sad, but were not uniform across emotions." zh="团队原始图表。愤怒和悲伤的提升最大，但各种情绪的提升并不均匀。" /></Figure>
            <p className={styles.small}><L en={<><strong>Reaction time:</strong> 3.73 s → 4.21 s; the difference was not significant.</>} zh={<><strong>反应时间：</strong>3.73 秒 → 4.21 秒，差异不显著。</>} /></p>

            <div className={styles.resultInsight}>
              <p className={styles.resultLabel}><L en="Raw NASA-TLX workload" zh="Raw NASA-TLX 工作负荷" /></p>
              <strong>39.1 <span aria-hidden="true">→</span> 44.1</strong>
              <p className={styles.resultDelta}><L en="+5 points" zh="增加 5 分" /></p>
              <p><L en="Not significant" zh="差异不显著" /></p>
            </div>
            <p><L en={<><strong>Cognitive load did not improve.</strong> The largest increases were Effort (31.1 → 43.3) and Frustration (30.3 → 38.9).</>}
              zh={<><strong>认知负荷没有改善。</strong>涨得最多的是努力程度（31.1 → 43.3）和挫败感（30.3 → 38.9）。</>} /></p>
            <Figure name="workload-results" width={1600} height={753} alt="Team NASA-TLX subscale chart comparing Conditions A and B, with higher effort and frustration means for B"><L en="Original workload breakdown. Overall Raw NASA-TLX increased, but the difference was not statistically significant." zh="团队原始的负荷分项图。Raw NASA-TLX 总分上升了，但差异没有统计显著性。" /></Figure>
            <h3><L en="What failed · The graph asked too much of people" zh="哪里没成功 · 曲线对人要求太高了" /></h3>
            <p><L en="Emotion colour was generally described as helpful. The rhythm graph was often confusing or distracting: people had trouble understanding what it represented and how to read it. Adding a signal did not automatically make the interface easier to use."
              zh="大家普遍觉得情绪颜色有帮助；节奏曲线却常常让人困惑或分心——很多人看不懂它代表什么、该怎么读。多加一个信号，并不会自动让界面更好用。" /></p>
            <p><L en="Qualitative feedback helps explain this tension, but it does not isolate the causal effect of either visual feature."
              zh="定性反馈能帮助解释这种矛盾，但无法单独分离出任何一个视觉元素的因果作用。" /></p>
          </section>

          <section id="iteration">
            <p className={styles.eyebrow}><L en="06 / Feedback → iteration" zh="06 / 反馈 → 迭代" /></p>
            <h2><L en="A graph needs a way in." zh="一张图，需要一个入口。" /></h2>
            <ol className={styles.iteration}>
              <li><span><L en="DP1 · Abstract blocks" zh="DP1 · 抽象方块" /></span><p><L en="The equaliser-like blocks were difficult to understand as a representation of volume." zh="像均衡器一样的方块，很难让人看出它代表的是音量。" /></p></li>
              <li><span><L en="DP2 · Rhythm graph" zh="DP2 · 节奏曲线" /></span><p><L en="The graph made the signal more continuous, but evaluation participants still found it confusing or distracting." zh="曲线让信号变得更连续，但实验参与者仍然觉得它令人困惑或分心。" /></p></li>
              <li><span><L en="Peiwen’s revision · Label + scale" zh="佩文的修改 · 标签 + 刻度" /></span><p><L en="I added clearer labels and a visible scale so changes in voice intensity and rhythm were easier to interpret." zh="我加上了更清楚的标签和可见的刻度，让声音强度和节奏的变化更容易读懂。" /></p></li>
            </ol>
            <p className={styles.pencilNote}><span aria-hidden="true">↳</span> <L en="Give the signal a way in." zh="给信号一个入口。" /></p>
            <p><L en="The next question is whether the revised graph is easier to understand and less distracting. The reported evaluation does not establish the revised version’s effectiveness."
              zh="接下来要问的是：修改后的曲线是不是更容易理解、更不让人分心。上面的实验并不能证明修改版的效果。" /></p>
            <p className={styles.small}><L en={<><strong>Before/after image pending.</strong> No verified post-study screenshot is available, so this iteration is documented in words only.</>}
              zh={<><strong>前后对比图待补。</strong>目前没有经过核实的实验后截图，所以这次迭代只用文字记录。</>} /></p>
          </section>

          <section id="reflection">
            <p className={styles.eyebrow}><L en="07 / Reflection & limitations" zh="07 / 反思与局限" /></p>
            <h2><L en="More information is not automatically better accessibility." zh="信息更多，不等于更无障碍。" /></h2>
            <p><L en="My main lesson from Reso is that visual enrichment only helps if it is instantly legible. The next design question is not how much more we can show, but what someone can understand at a glance."
              zh="Reso 给我最大的收获是：视觉上的补充，只有在一眼就能看懂时才真正有用。下一个设计问题不是还能多显示什么，而是人一眼能看懂什么。" /></p>
            <h3><L en="Where the evidence stops" zh="证据到哪里为止" /></h3>
            <ul>
              <li><L en="All 18 participants were hearing proxy users; these findings do not establish improvements for DHH users." zh="18 名参与者都是听人代理用户；这些结果不能证明对 DHH 用户有改善。" /></li>
              <li><L en="No DHH co-design informed this iteration." zh="这次迭代没有经过 DHH 人士参与的共同设计。" /></li>
              <li><L en="Muted, single-speaker clips do not represent the dynamics of real meetings." zh="静音的单人片段，代表不了真实会议里的互动。" /></li>
              <li><L en="The emotion categories were limited." zh="情绪类别比较有限。" /></li>
              <li><L en="Colour and rhythm were evaluated together, so their separate effects remain unknown." zh="颜色和节奏是一起评估的，它们各自的作用仍然未知。" /></li>
            </ul>
            <p><L en="A meaningful next step would be co-design with DHH people, followed by evaluation of clearer visual cues in real, multi-speaker communication. That is future work, not a result claimed by this project."
              zh="有意义的下一步，是和 DHH 人士一起做共同设计，再在真实的多人交流中评估更清楚的视觉提示。这是未来的工作，不是这个项目宣称的成果。" /></p>
          </section>
          <footer className={styles.footer}><p><L en="Reso · Design Project 1 & 2 · Université Paris-Saclay · 2026" zh="Reso · 设计课题 1 与 2 · 巴黎-萨克雷大学 · 2026" /></p><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#reso-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a></footer>
        </article>
      </div>
    </main>
  </div>;
}
