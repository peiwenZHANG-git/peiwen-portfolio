import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./arm-swing.module.css";

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
    <a className={shell.skipLink} href="#arm-swing-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />

    <main id="arm-swing-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="Arm-Swing VR Locomotion · 2026 · Embodied XR interaction" zh="摆臂式 VR 移动 · 2026 · 具身 XR 交互" /></p>
          <h1><L en={<>Move your body.<br />Move through space.</>} zh={<>动起你的身体，<br />穿过整个空间。</>} /></h1>
          <p className={styles.lead}><L en="How might virtual travel feel less like steering a cursor and more like moving yourself?" zh="在虚拟世界里移动，能不能不像在操控光标，而更像是自己在动？" /></p>
          <p><L en="I designed and implemented a continuous arm-swing locomotion technique that turns controller velocity into speed and gaze into three-dimensional direction."
            zh="我设计并实现了一种连续的摆臂移动方式：手柄的挥动速度变成移动速度，视线变成三维空间里的方向。" /></p>
          <p className={styles.annotation}><L en="One movement mapping, from ground travel to vertical flight." zh="同一套动作映射，从地面行进一直到向上飞行。" /></p>
          <a className={styles.jump} href="#system"><L en="See how it works ↓" zh="看看它怎么运作 ↓" /></a>
        </div>
        <figure id="demo" className={styles.heroDemo}>
          <video controls preload="metadata" playsInline poster={`${assetRoot}/demo-poster.webp`} aria-label="Watch the Arm-Swing VR Locomotion prototype demonstration">
            <source src={`${assetRoot}/resources/arm-swing-demo.mp4`} type="video/mp4" />
            Your browser does not support embedded video. <a href={`${assetRoot}/resources/arm-swing-demo.mp4`}>Open the demo video</a>.
          </video>
          <figcaption><span><L en="Watch the prototype in motion · 1:16 ↗" zh="看看原型动起来的样子 · 1:16 ↗" /></span><L en="The final course run moves continuously across ground, slopes and open air." zh="最终的跑图过程：在地面、斜坡和半空中连续穿行。" /></figcaption>
        </figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Context" zh="背景" /></dt><dd><L en={<>Mixed Reality &amp; VR Interaction<br />Spring 2026 · IPP</>} zh={<>混合现实与 VR 交互课程<br />2026 年春季 · IPP</>} /></dd></div>
          <div><dt><L en="Project type" zh="项目类型" /></dt><dd><L en={<>Individual project<br />Unity · Meta XR</>} zh={<>个人项目<br />Unity · Meta XR</>} /></dd></div>
          <div><dt><L en="My role" zh="我的角色" /></dt><dd><L en="Interaction concept, locomotion design, Unity implementation, runtime debugging, formative testing, results synthesis and demo." zh="交互概念、移动方式设计、Unity 实现、运行时调试、形成性测试、结果整理和演示。" /></dd></div>
        </dl>
        <p className={styles.scaffold}><L en={<><strong>Built individually within a course-provided VR parkour environment.</strong> The scene, coin course, scoring and base task framework were provided; my work focused on the locomotion technique and its integration.</>}
          zh={<><strong>在课程提供的 VR 跑酷环境里独立完成。</strong>场景、金币赛道、计分和基础任务框架是课程给的；我的工作集中在移动方式本身，以及把它接入整个系统。</>} /></p>
      </section>

      <section className={styles.materials} aria-labelledby="materials-title">
        <div><p className={styles.eyebrow}><L en="Project materials" zh="项目资料" /></p><h2 id="materials-title"><L en="See it beyond the page." zh="页面之外，还有这些。" /></h2></div>
        <ul>
          <li><a href={`${assetRoot}/resources/arm-swing-demo.mp4`} target="_blank" rel="noopener noreferrer"><L en="Watch demo ↗" zh="观看演示 ↗" /></a></li>
          <li><a href="https://u8739516597-dotcom.github.io/" target="_blank" rel="noopener noreferrer"><L en="View course archive ↗" zh="查看课程存档 ↗" /></a></li>
          <li><a href="https://drive.google.com/file/d/17dsN_9A_umsfHKKnd0NoPsK-qlCjL1b5/view?usp=sharing" target="_blank" rel="noopener noreferrer"><L en="Download APK ↗" zh="下载 APK ↗" /></a></li>
          <li><a href={`${assetRoot}/resources/arm-swing-presentation.pdf`} target="_blank" rel="noopener noreferrer"><L en="Presentation ↗" zh="答辩演示 ↗" /></a></li>
        </ul>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}><L en="Inside the project" zh="项目目录" /></p>
            <a href="#challenge"><L en="01 · The challenge" zh="01 · 挑战" /></a>
            <a href="#concepts"><L en="02 · Explore & choose" zh="02 · 探索与选择" /></a>
            <a href="#system"><L en="03 · Interaction mapping" zh="03 · 交互映射" /></a>
            <a href="#implementation"><L en="04 · Building it" zh="04 · 把它做出来" /></a>
            <a href="#debugging"><L en="05 · Runtime edge cases" zh="05 · 运行时的边界情况" /></a>
            <a href="#evaluation"><L en="06 · Formative testing" zh="06 · 形成性测试" /></a>
            <a href="#results"><L en="07 · What I learned" zh="07 · 我学到了什么" /></a>
          </nav>
        </aside>

        <article className={styles.story} aria-label="Arm-Swing VR Locomotion case study">
          <section id="challenge">
            <p className={styles.eyebrow}><L en="01 / The challenge" zh="01 / 挑战" /></p>
            <h2><L en="Design travel around the body, not a thumbstick." zh="围绕身体来设计移动，而不是摇杆。" /></h2>
            <p><L en="Virtual locomotion has to balance agency, precision and physical comfort. For a fast parkour course, I wanted movement to feel embodied while keeping a clear way to start, steer and stop."
              zh="虚拟移动要在掌控感、精确度和身体舒适之间找平衡。面对一条节奏很快的跑酷赛道，我希望移动有“用身体在动”的感觉，同时起步、转向和停下都依然清楚明确。" /></p>
            <blockquote><L en="How might arm movement become an understandable, controllable source of virtual speed?" zh="手臂的动作，能不能成为一种看得懂、控制得住的虚拟速度来源？" /></blockquote>
            <div className={styles.threeFrames} aria-label="Prototype course progression">
              <Figure name="gameplay-ground" width={1400} height={758} alt="First-person VR view travelling along the ground section of the parkour course"><L en="Ground travel" zh="地面行进" /></Figure>
              <Figure name="gameplay-transition" width={1400} height={758} alt="First-person VR view approaching the transition between parkour sections"><L en="Course transition" zh="赛段过渡" /></Figure>
              <Figure name="gameplay-flight" width={1400} height={758} alt="First-person VR view moving above the city course during vertical travel"><L en="Vertical travel" zh="垂直移动" /></Figure>
            </div>
          </section>

          <section id="concepts">
            <p className={styles.eyebrow}><L en="02 / Explore → choose" zh="02 / 探索 → 选择" /></p>
            <h2><L en="Three ways to leave the joystick behind." zh="告别摇杆的三种方式。" /></h2>
            <ol className={styles.concepts}>
              <li><span>01</span><h3><L en="Arm-Swing Power Glide" zh="摆臂滑行" /></h3><p><L en="Swing both controllers to build speed. Use body effort as the continuous movement signal." zh="挥动两只手柄来积累速度，把身体的用力程度当作连续的移动信号。" /></p></li>
              <li><span>02</span><h3><L en="Nod-to-Zoom Teleport" zh="点头瞬移" /></h3><p><L en="Choose a target with gaze, then use a head gesture to confirm the jump." zh="用视线选中目标，再用一个点头动作确认跳过去。" /></p></li>
              <li><span>03</span><h3><L en="Elastic World Pull" zh="弹性拉动世界" /></h3><p><L en="Grab and pull the world towards the body, turning reach into propulsion." zh="抓住世界往身边拉，把伸手的动作变成推进力。" /></p></li>
            </ol>
            <p className={styles.slideLinks}>
              <span aria-hidden="true">✎</span> <L en="The slides behind this step:" zh="这一步的幻灯片：" />{" "}
              <a href="https://drive.google.com/file/d/1Yu3T573hupCwZj9BVJq5NSAc7eCApzyJ/view?usp=sharing" target="_blank" rel="noopener noreferrer"><L en="3 Creative Ideas for VR Locomotion ↗" zh="VR 移动的三个创意 ↗" /></a>
              <span aria-hidden="true" className={styles.slideDot}>·</span>
              <a href="https://drive.google.com/file/d/1e-EcriRIjRLWaMXqHNB59H5v7EqJTJeG/view?usp=sharing" target="_blank" rel="noopener noreferrer"><L en="Pitch ↗" zh="项目提案 ↗" /></a>
            </p>
            <h3><L en="Why arm swing" zh="为什么选摆臂" /></h3>
            <p><L en="I chose arm swing because it offered the clearest continuous relationship between physical effort and virtual velocity. It could support slow adjustment and fast traversal using the same input, then extend into vertical movement without adding a second control scheme."
              zh="我选了摆臂，因为它在身体用力和虚拟速度之间，建立了最清楚、最连续的关系。同一种输入既能慢慢微调，也能快速穿行，还能自然延伸到垂直移动，不需要再加第二套操控方式。" /></p>
            <p className={styles.pencilNote}><span aria-hidden="true">↳</span> <L en="Keep the body-to-speed relationship visible." zh="让“身体 → 速度”的关系一直看得见。" /></p>
          </section>

          <section id="system">
            <p className={styles.eyebrow}><L en="03 / How it works" zh="03 / 它怎么运作" /></p>
            <h2><L en="One continuous mapping." zh="一套连续的映射。" /></h2>
            <ol className={styles.pipeline} aria-label="Locomotion input pipeline">
              <li><span><L en="Hold" zh="按住" /></span><L en="Either index trigger engages the movement clutch." zh="按住任意一个食指扳机，就接上了移动的“离合”。" /></li>
              <li><span><L en="Swing" zh="挥动" /></span><L en="Left and right controller velocities become one movement signal." zh="左右手柄的速度合成一个移动信号。" /></li>
              <li><span><L en="Shape" zh="塑形" /></span><L en="A nonlinear curve maps effort to speed, then applies a cap." zh="一条非线性曲线把用力程度映射成速度，再加上上限。" /></li>
              <li><span><L en="Look" zh="看向" /></span><L en="The HMD forward vector provides three-dimensional direction." zh="头显的前向向量给出三维方向。" /></li>
              <li><span><L en="Release" zh="松开" /></span><L en="Damping brings movement back towards zero." zh="阻尼让移动慢慢回到静止。" /></li>
            </ol>
            <div className={styles.directionDiagram} role="img" aria-label="Looking forward produces mostly horizontal movement; looking upward adds vertical movement through the same HMD direction mapping">
              <div><span className={styles.headset} aria-hidden="true">◉</span><b><L en="Look forward" zh="向前看" /></b><i aria-hidden="true">→ → →</i><p><L en="Mostly horizontal travel" zh="大多是水平移动" /></p></div>
              <div><span className={styles.headset} aria-hidden="true">◉</span><b><L en="Look upward" zh="向上看" /></b><i aria-hidden="true">↗ ↗ ↗</i><p><L en="The same vector adds vertical travel" zh="同一个向量，多了垂直方向" /></p></div>
            </div>
            <p><L en={<><strong>There are no separate walking and flying modes.</strong> Looking forward keeps movement mostly on the horizontal plane; looking upward naturally introduces a vertical component through the same HMD-forward mapping.</>}
              zh={<><strong>这里没有分开的“行走”和“飞行”模式。</strong>向前看时，移动基本保持在水平面上；向上看时，同一套头显前向映射会自然带出垂直方向的分量。</>} /></p>

            <h3><L en="From controller movement to speed" zh="从手柄动作到速度" /></h3>
            <div className={styles.pair}>
              <Figure name="speed-curve" width={1200} height={720} alt="Verified quadratic locomotion speed curve using exponent 2, sensitivity 12 and a maximum speed of 15"><L en="The quadratic curve makes small movements precise and stronger swings accelerate quickly before the cap." zh="二次曲线让小幅动作更精确，用力挥动时则会迅速加速，直到碰到上限。" /></Figure>
              <div className={styles.formula} aria-label="Speed mapping formula">
                <p><span>01</span><code>swingPower = |left velocity| + |right velocity|</code></p>
                <p><span>02</span><code>speed = min(swingPower² × sensitivity, maxSpeed)</code></p>
                <p><span>03</span><code>velocity = lerp(current, gaze × speed, smoothing)</code></p>
              </div>
            </div>
          </section>

          <section id="implementation">
            <p className={styles.eyebrow}><L en="04 / Unity implementation" zh="04 / Unity 实现" /></p>
            <h2><L en="Turning the mapping into a running system." zh="把映射变成一个真正跑起来的系统。" /></h2>
            <div className={styles.implementationGrid}>
              <div>
                <h3><L en="My implementation" zh="我的实现" /></h3>
                <p><L en="I wrote the custom locomotion component, connected controller velocity and HMD direction, added the trigger clutch, nonlinear curve, cap and damping, then integrated it with the provided parkour scene and task logic."
                  zh="我写了自定义的移动组件，把手柄速度和头显方向接起来，加上扳机离合、非线性曲线、速度上限和阻尼，再把它整合进课程提供的跑酷场景和任务逻辑里。" /></p>
                {/* scrolls sideways on narrow screens: focusable so it can be scrolled by keyboard */}
                <pre tabIndex={0} role="region" aria-label="Simplified locomotion logic"><code>{`if (triggerHeld && swingPower > 0.08) {
  speed = min(pow(swingPower, 2) * 12, 15)
  target = hmd.forward * speed
} else {
  target = zero // damp towards rest
}`}</code></pre>
              </div>
              <Figure name="unity-settings" width={512} height={410} alt="Unity Inspector showing sensitivity 12, maximum speed 15, exponent 2 and damping 5 for the locomotion component"><L en="Final scene values: exponent 2.0, sensitivity 12, speed cap 15 and damping 5." zh="场景里的最终参数：指数 2.0、灵敏度 12、速度上限 15、阻尼 5。" /></Figure>
            </div>
            <p className={styles.scaffold}><L en={<><strong>Course scaffold boundary:</strong> the environment, course layout, coins, scoring and base tasks came from the class. My contribution is the locomotion design, custom implementation, integration, debugging and evaluation presented here.</>}
              zh={<><strong>课程框架的边界：</strong>环境、赛道布局、金币、计分和基础任务来自课程。我的贡献是这里展示的移动方式设计、自定义实现、整合、调试和评估。</>} /></p>
          </section>

          <section id="debugging">
            <p className={styles.eyebrow}><L en="05 / Interaction engineering" zh="05 / 交互工程" /></p>
            <h2><L en="At high speed, passing through was too easy." zh="速度一快，就太容易“穿过去”了。" /></h2>
            <p><L en="The first implementation relied on collider triggers for coins and finish banners. Fast movement could cross a thin trigger between physics checks, so the player sometimes missed a coin or failed to advance even after visibly passing the marker."
              zh="第一版实现里，金币和终点横幅都靠碰撞触发器来判定。移动太快时，玩家可能在两次物理检测之间直接越过很薄的触发器——明明看着穿过了标记，却没吃到金币，或者没能进入下一段。" /></p>
            <div className={styles.debugFlow} aria-label="High-speed collision edge case and fallback solution">
              <div><span><L en="Edge case" zh="边界情况" /></span><strong><L en="High velocity" zh="高速移动" /></strong><i aria-hidden="true">→</i><strong><L en="Thin trigger missed" zh="漏掉薄触发器" /></strong></div>
              <div><span><L en="Fallback" zh="兜底方案" /></span><strong><L en="Distance check" zh="距离检测" /></strong><i aria-hidden="true">→</i><strong><L en="Reliable pickup / transition" zh="稳定拾取 / 切换" /></strong></div>
            </div>
            <div className={styles.pair}>
              <Figure name="banner-edge-case" width={1026} height={909} alt="Unity scene view showing the purple final banner across the parkour road"><L en="Banners were changed from solid obstacles to pass-through triggers, with proximity checks as a runtime fallback." zh="横幅从实心障碍改成了可穿过的触发器，并用距离检测作为运行时的兜底。" /></Figure>
              <Figure name="coin-proximity" width={780} height={681} alt="Unity scene view showing glowing purple coins placed along the course"><L en="Coins gained a small pickup radius so high-speed travel did not depend on one exact collision frame." zh="金币加了一个小的拾取半径，高速移动时就不必依赖某一帧恰好碰上。" /></Figure>
            </div>
            <p className={styles.annotation}><L en="The fix was not another interaction mode. It was a more forgiving runtime boundary." zh="解决办法不是再加一种交互模式，而是一个更宽容的运行时边界。" /></p>
          </section>

          <section id="evaluation">
            <p className={styles.eyebrow}><L en="06 / Formative evaluation" zh="06 / 形成性评估" /></p>
            <h2><L en="Three runs through the full course." zh="完整跑了三遍赛道。" /></h2>
            <p className={styles.note}><L en={<><strong>Three formative runs:</strong> Peiwen, the designer, and two classmates. This was an exploratory check of whether the system could be learned and completed, not a controlled comparison.</>}
              zh={<><strong>三次形成性测试：</strong>佩文（设计者本人）和两位同学。这是一次探索性的检查，看系统能不能被学会、能不能跑完，而不是对照实验。</>} /></p>
            <div className={styles.testingGrid}>
              <Figure name="testing-session" width={1400} height={1232} alt="A participant wearing a white VR headset and holding two controllers beside the Unity laptop during a test session"><L en="A real test session with the headset, two controllers and the running Unity course." zh="一次真实的测试：头显、两只手柄，还有正在运行的 Unity 赛道。" /></Figure>
              <div>
                <h3><L en="Task" zh="任务" /></h3><p><L en="Complete the parkour course and collect as many of 69 coins as possible." zh="跑完跑酷赛道，并尽可能多地收集 69 枚金币。" /></p>
                <h3><L en="Recorded" zh="记录内容" /></h3><ul><li><L en="Segment and total completion time" zh="分段用时和总用时" /></li><li><L en="Coins collected" zh="收集到的金币数" /></li><li><L en="Single 1–10 ratings for sickness, workload, presence and enjoyment" zh="晕动感、工作负荷、临场感和乐趣，各一个 1–10 分的评分" /></li></ul>
                <p className={styles.small}><L en="The creator’s run is retained and labelled rather than treated as an independent participant." zh="设计者本人的那次测试保留了下来并单独标注，没有当作独立参与者来看。" /></p>
              </div>
            </div>
          </section>

          <section id="results">
            <p className={styles.eyebrow}><L en="07 / Results" zh="07 / 结果" /></p>
            <h2><L en="Completed, engaging—and still formative." zh="跑得完，也好玩——但仍只是初步结果。" /></h2>
            <div className={styles.metrics}>
              <div><strong>134.1s</strong><span><L en="average completion time" zh="平均完成用时" /></span></div>
              <div><strong>94.2%</strong><span><L en="pooled coin collection" zh="总体金币收集率" /></span></div>
              <div><strong>3.0/10</strong><span><L en="reported sickness" zh="自评晕动感" /></span></div>
              <div><strong>7.7/10</strong><span><L en="reported presence" zh="自评临场感" /></span></div>
              <div><strong>8.7/10</strong><span><L en="reported enjoyment" zh="自评乐趣" /></span></div>
            </div>
            <p><L en="All three runs finished the course. The fastest run collected the fewest coins, suggesting a precision question worth studying further—but three observations cannot validate a general speed–accuracy trade-off."
              zh="三次测试都跑完了赛道。最快的那次收集的金币最少，这提示了一个值得继续研究的精度问题——但三次观察并不足以证明普遍存在的速度–准确度权衡。" /></p>
            <Figure name="participant-results" width={1400} height={280} alt="Participant-level table showing three segment times, total completion time and coins collected for Peiwen and two classmates"><L en="Participant-level evidence. Peiwen’s 132.1-second run collected 68/69 coins; the two classmates completed in 149.2 and 121.0 seconds." zh="每位参与者的数据。佩文用 132.1 秒跑完，收集了 68/69 枚金币；两位同学分别用了 149.2 秒和 121.0 秒。" /></Figure>
            <Figure name="subjective-results" width={1362} height={477} alt="Participant-level ratings for sickness, workload, presence and enjoyment, including averages of 3.0, 4.0, 7.7 and 8.7"><L en="Single-item ratings described the three experiences; they were not a validated questionnaire." zh="这些单项评分描述的是三次体验，并不是经过验证的量表。" /></Figure>

            <h3><L en="What I learned" zh="我学到了什么" /></h3>
            <p><L en="The prototype showed that one continuous mapping could connect bodily effort, speed and three-dimensional direction. It also exposed the cost of that embodiment: repeated arm movement can become tiring, while high speed makes precise collection harder."
              zh="这个原型说明，一套连续的映射可以把身体用力、速度和三维方向连在一起。它也暴露了具身交互的代价：反复摆臂会累，而速度一高，精确收集就更难。" /></p>
            <p><L en="My strongest technical lesson was to design for the behaviour of the running system, not only the intended interaction. Speed changed the reliability of collisions, so the interaction needed proximity-aware fallbacks."
              zh="技术上我最大的收获是：要为系统实际运行时的表现而设计，而不只是为预想中的交互设计。速度改变了碰撞的可靠性，所以交互需要基于距离的兜底方案。" /></p>

            <h3><L en="Where the evidence stops" zh="证据到哪里为止" /></h3>
            <ul>
              <li><L en="Only three runs were recorded, and one was completed by the designer." zh="只记录了三次测试，其中一次是设计者本人完成的。" /></li>
              <li><L en="There was no joystick baseline, control condition or counterbalancing." zh="没有摇杆基线，没有对照条件，也没有做顺序平衡。" /></li>
              <li><L en="The four subjective ratings were single items, not a named validated scale." zh="四项主观评分都是单题，不是有名有姓、经过验证的量表。" /></li>
              <li><L en="No statistical testing was appropriate for this formative sample." zh="这样的形成性样本不适合做统计检验。" /></li>
              <li><L en="The results do not prove that the curve reduced sickness or increased presence or enjoyment." zh="这些结果不能证明这条曲线降低了晕动感，或提升了临场感和乐趣。" /></li>
            </ul>
            <p className={styles.conclusion}><L en="These observations are directional, not evidence of a validated locomotion advantage. A next study should compare against joystick travel, recruit a larger independent sample and test longer sessions where fatigue becomes visible."
              zh="这些观察只指出了一个方向，并不能证明这种移动方式有经过验证的优势。下一步的研究应该和摇杆移动做对比，招募更多独立参与者，并测试更长的时段，让疲劳真正显现出来。" /></p>
          </section>

          <footer className={styles.footer}>
            <p><L en="Arm-Swing VR Locomotion · Mixed Reality & VR Interaction · 2026" zh="摆臂式 VR 移动 · 混合现实与 VR 交互 · 2026" /></p>
            <Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#arm-swing-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a>
          </footer>
        </article>
      </div>
    </main>
  </div>;
}
