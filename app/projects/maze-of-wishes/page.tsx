import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./maze-of-wishes.module.css";

/* Bilingual since 2026-09-25: every reading text is <L en zh />, the header's 中 / EN
   picks one (components/lang.tsx). Chinese: Claude's draft, for Peiwen to review. */

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
        <L en="Skip to case study" zh="跳到项目正文" />
      </a>
      <SiteHeader current="projects" />

      <main id="maze-content" className={styles.main} tabIndex={-1}>
        <Link className={styles.back} href="/projects">
          <L en="← Back to the attic" zh="← 回到阁楼" />
        </Link>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              <L
                en="Maze of Wishes · 2025 · Playful cross-device interaction"
                zh="Maze of Wishes · 愿望迷宫 · 2025 · 好玩的跨设备交互"
              />
            </p>
            <h1>
              <L
                en={<>Tilt your phone.<br />Guide Santa through the maze.</>}
                zh={<>倾斜手机，<br />带圣诞老人走出迷宫。</>}
              />
            </h1>
            <p className={styles.lead}>
              <L
                en="What if the phone became the controller?"
                zh="如果手机本身就是手柄呢？"
              />
            </p>
            <p>
              <L
                en="I turned live gravity data into a complete sensor-to-screen game: a phone steers Santa through a desktop maze, while the game teaches, constrains and responds to that movement."
                zh="我把手机实时的重力数据做成了一个从传感器到屏幕的完整游戏：用手机操控圣诞老人穿过电脑上的迷宫，而游戏本身负责教玩家怎么动、限制怎么动，并对每一次移动做出回应。"
              />
            </p>
            <p className={styles.annotation}>
              <L
                en="Designed and implemented independently in about two months."
                zh="大约两个月，独立完成设计与开发。"
              />
            </p>
            <a className={styles.jump} href="#pipeline">
              <L en="Follow the signal ↓" zh="跟着信号走 ↓" />
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
              <span>
                <L
                  en="Watch the working prototype · 0:13 ↗"
                  zh="看看可运行的原型 · 0:13 ↗"
                />
              </span>
              <L
                en="A phone and laptop share one local network during the live classroom demonstration."
                zh="课堂现场演示：手机和笔记本电脑连在同一个局域网里。"
              />
            </figcaption>
          </figure>
        </header>

        <section className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title">
            <L en="At a glance" zh="项目概览" />
          </h2>
          <dl className={styles.facts}>
            <div>
              <dt>
                <L en="Context" zh="背景" />
              </dt>
              <dd>
                <L
                  en={<>Basic Programming of Interactive Systems<br />Université Paris-Saclay · 2025</>}
                  zh={<>交互系统编程基础（课程）<br />巴黎-萨克雷大学 · 2025</>}
                />
              </dd>
            </div>
            <div>
              <dt>
                <L en="Project type" zh="项目类型" />
              </dt>
              <dd>
                <L
                  en={<>Individual project · ~2 months<br />Java · JavaFX · OSC</>}
                  zh={<>个人项目 · 约 2 个月<br />Java · JavaFX · OSC</>}
                />
              </dd>
            </div>
            <div>
              <dt>
                <L en="My role" zh="我的角色" />
              </dt>
              <dd>
                <L
                  en="Concept, interaction design, sensor mapping, UI/game design, Java implementation, debugging and live demo."
                  zh="概念、交互设计、传感器映射、UI 与游戏设计、Java 实现、调试，以及现场演示。"
                />
              </dd>
            </div>
          </dl>
          <p className={styles.ownership}>
            <L
              en={<><strong>Designed and implemented the complete prototype independently.</strong>{" "}I shaped the move from keyboard control to phone tilt, built the sensor pipeline and game loop, and prepared the classroom demonstration.</>}
              zh={<><strong>整个原型由我独立设计并实现。</strong>从键盘操控转向手机倾斜是我推动的，传感器数据链路和游戏循环是我搭的，课堂演示也是我准备的。</>}
            />
          </p>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div>
            <p className={styles.eyebrow}>
              <L en="Project materials" zh="项目资料" />
            </p>
            <h2 id="materials-title">
              <L en="See it beyond the page." zh="页面之外，还有这些。" />
            </h2>
          </div>
          <ul>
            <li>
              <a
                href={`${assetRoot}/resources/maze-of-wishes-demo.mp4`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <L en="Watch demo ↗" zh="观看演示 ↗" />
              </a>
            </li>
            <li>
              <a
                href={`${assetRoot}/resources/early-storyboard.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <L en="Early storyboard ↗" zh="早期故事板 ↗" />
              </a>
            </li>
            <li>
              <a
                href={`${assetRoot}/resources/project-documentation.docx`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <L en="Project documentation ↗" zh="项目文档 ↗" />
              </a>
            </li>
          </ul>
        </section>

        <div className={styles.layout}>
          <aside className={styles.contents}>
            <nav aria-label="Inside the project">
              <p>
                <L en="Inside the project" zh="项目目录" />
              </p>
              <a href="#shift">
                <L en="01 · Shift to tilt" zh="01 · 转向倾斜操控" />
              </a>
              <a href="#pipeline">
                <L en="02 · Signal pipeline" zh="02 · 信号链路" />
              </a>
              <a href="#mapping">
                <L en="03 · Movement mapping" zh="03 · 动作映射" />
              </a>
              <a href="#game-loop">
                <L en="04 · Game loop" zh="04 · 游戏循环" />
              </a>
              <a href="#collision">
                <L en="05 · Map + collision" zh="05 · 地图与碰撞检测" />
              </a>
              <a href="#demo-evidence">
                <L en="06 · Classroom demo" zh="06 · 课堂演示" />
              </a>
              <a href="#reflection">
                <L en="07 · Reflection" zh="07 · 反思" />
              </a>
            </nav>
          </aside>

          <article className={styles.story}>
            <section id="shift">
              <p className={styles.kicker}>
                <L
                  en="01 · From keyboard to phone tilt"
                  zh="01 · 从键盘到手机倾斜"
                />
              </p>
              <h2>
                <L
                  en="The interaction idea changed the project."
                  zh="一个交互想法，改变了整个项目。"
                />
              </h2>
              <p>
                <L
                  en="The early storyboard imagined a conventional keyboard maze with multiple levels. The stronger direction appeared when I returned to the physical inspiration: a handheld maze is understood through tilt, not arrow keys."
                  zh="最初的故事板设想的是一个常规的多关卡键盘迷宫。直到我回到最初的实物灵感，更好的方向才出现：手里的迷宫玩具，是靠倾斜来理解的，而不是方向键。"
                />
              </p>
              <div className={styles.pair}>
                <Figure
                  name="early-storyboard"
                  width={797}
                  height={1800}
                  alt="Early Maze of Wishes storyboard showing the initial keyboard-controlled maze concept"
                  className={styles.storyboard}
                >
                  <L
                    en={<><strong>Before:</strong> a keyboard maze concept with a larger level structure. The storyboard is process evidence; those extra levels did not enter the final build.</>}
                    zh={<><strong>之前：</strong>一个键盘操控、关卡更多的迷宫构想。故事板只是过程记录，那些额外的关卡并没有进入最终版本。</>}
                  />
                </Figure>
                <Figure
                  name="tilt-tutorial"
                  width={1262}
                  height={735}
                  alt="Maze of Wishes tutorial screen teaching the player to tilt the phone in four directions"
                >
                  <L
                    en={<><strong>After:</strong> the final tutorial asks the player to move a cake cursor by tilting the phone, teaching the controller through action.</>}
                    zh={<><strong>之后：</strong>最终的教程让玩家倾斜手机去移动一个蛋糕光标——在动手中学会这个“手柄”。</>}
                  />
                </Figure>
              </div>
              <p className={styles.pencilNote}>
                <span>↗</span>{" "}
                <L
                  en="The phone was not a companion screen. It became the physical input device."
                  zh="手机不是一块副屏，而是真正拿在手里的输入设备。"
                />
              </p>
            </section>

            <section id="pipeline">
              <p className={styles.kicker}>
                <L en="02 · How the interaction works" zh="02 · 交互是怎么运作的" />
              </p>
              <h2>
                <L
                  en="One continuous signal, from hand to screen."
                  zh="一条连续的信号，从手到屏幕。"
                />
              </h2>
              <p>
                <L
                  en="The core challenge was not drawing a maze. It was making an unfamiliar cross-device chain feel immediate enough to disappear during play."
                  zh="真正的难点不是画一个迷宫，而是让一条陌生的跨设备链路足够即时，玩的时候让人感觉不到它的存在。"
                />
              </p>
              <ol
                className={styles.pipeline}
                aria-label="Maze of Wishes sensor pipeline"
              >
                <li>
                  <span>1</span>
                  <strong>
                    <L en="Phone gravity sensor" zh="手机重力传感器" />
                  </strong>
                  <small>gx · gy · gz</small>
                </li>
                <li>
                  <span>2</span>
                  <strong>ZigSim</strong>
                  <small>
                    <L
                      en="packages the live sensor stream"
                      zh="打包实时传感器数据流"
                    />
                  </small>
                </li>
                <li>
                  <span>3</span>
                  <strong>OSC / UDP</strong>
                  <small>
                    <L
                      en="sends data over the local network"
                      zh="通过局域网发送数据"
                    />
                  </small>
                </li>
                <li>
                  <span>4</span>
                  <strong>
                    <L en="Java receiver" zh="Java 接收端" />
                  </strong>
                  <small>
                    <L
                      en={<>reads{" "}<code>/ZIGSIM/<wbr />&lt;uuid&gt;/<wbr />gravity</code></>}
                      zh={<>读取{" "}<code>/ZIGSIM/<wbr />&lt;uuid&gt;/<wbr />gravity</code></>}
                    />
                  </small>
                </li>
                <li>
                  <span>5</span>
                  <strong>TiltController</strong>
                  <small>
                    <L
                      en="applies bias, threshold and bounded speed"
                      zh="处理偏置、阈值和速度上下限"
                    />
                  </small>
                </li>
                <li>
                  <span>6</span>
                  <strong>
                    <L en="Game update" zh="游戏更新" />
                  </strong>
                  <small>
                    <L
                      en="predicts movement, checks the map and renders the next frame"
                      zh="预测移动、检查地图，再渲染下一帧"
                    />
                  </small>
                </li>
              </ol>
              <p className={styles.note}>
                <L
                  en={<><strong>Connection condition:</strong> the phone and computer must share a network, and the receiver listens on UDP port 5000.</>}
                  zh={<><strong>连接条件：</strong>手机和电脑必须在同一个网络里，接收端监听 UDP 5000 端口。</>}
                />
              </p>
            </section>

            <section id="mapping">
              <p className={styles.kicker}>
                <L en="03 · Sensor mapping" zh="03 · 传感器映射" />
              </p>
              <h2>
                <L
                  en="A small mapping that players could read with their hands."
                  zh="一套小小的映射，让玩家用手就能读懂。"
                />
              </h2>
              <p>
                <L
                  en={<>The receiver stores all three gravity axes, but the final controller uses <code>gx</code> and <code>gy</code>. It gives priority to one axis at a time, keeping movement mainly horizontal or vertical rather than drifting diagonally.</>}
                  zh={<>接收端会保存三个重力轴的数据，但最终的控制器只用 <code>gx</code> 和 <code>gy</code>。每次只优先响应一个轴，让移动基本保持水平或竖直，而不是斜着漂。</>}
                />
              </p>
              <div
                className={styles.mapping}
                aria-label="Phone tilt to Santa movement mapping"
              >
                <div>
                  <strong>
                    <span>
                      <L en="Tilt left" zh="向左倾斜" />
                    </span>
                    <b>
                      <L en="Santa moves left" zh="圣诞老人向左走" />
                    </b>
                  </strong>
                  <code>gy &gt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>
                      <L en="Tilt right" zh="向右倾斜" />
                    </span>
                    <b>
                      <L en="Santa moves right" zh="圣诞老人向右走" />
                    </b>
                  </strong>
                  <code>gy &lt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>
                      <L en="Tilt forward" zh="向前倾斜" />
                    </span>
                    <b>
                      <L en="Santa moves up" zh="圣诞老人向上走" />
                    </b>
                  </strong>
                  <code>gx &gt; 0</code>
                </div>
                <div>
                  <strong>
                    <span>
                      <L en="Tilt back" zh="向后倾斜" />
                    </span>
                    <b>
                      <L en="Santa moves down" zh="圣诞老人向下走" />
                    </b>
                  </strong>
                  <code>gx &lt; 0</code>
                </div>
              </div>
              <div className={styles.calibration}>
                <h3>
                  <L en="Calibrate, then move" zh="先校准，再移动" />
                </h3>
                <p>
                  <L
                    en={<>Pressing <kbd>Space</kbd> records the current phone orientation as the bias. A threshold ignores small movements; stronger tilt maps to a bounded speed range.</>}
                    zh={<>按下 <kbd>Space</kbd>，会把手机当前的朝向记为偏置。阈值会忽略细小的晃动；倾斜得越明显，速度越快，但限定在一个范围内。</>}
                  />
                </p>
                <p className={styles.small}>
                  <L
                    en="I implemented these parameters, but the archive does not document a formal rationale for their exact values. The page therefore treats them as prototype tuning, not optimized human-factors values."
                    zh="这些参数是我实现的，但存档里没有记录具体数值的正式依据。所以这里把它们当作原型阶段的调参，而不是经过优化的人因数值。"
                  />
                </p>
              </div>
            </section>

            <section id="game-loop">
              <p className={styles.kicker}>
                <L
                  en="04 · From controller to complete game"
                  zh="04 · 从控制器到完整的游戏"
                />
              </p>
              <h2>
                <L
                  en="The prototype had to explain what to do, and close the loop."
                  zh="原型得告诉玩家该做什么——还要让整个流程闭环。"
                />
              </h2>
              <Figure
                name="start-screen"
                width={1197}
                height={552}
                alt="Maze of Wishes start screen with cake cursor, sound control and Easy and Hard mode choices"
              >
                <L
                  en={<>The start flow introduces the playful visual language.{" "}<strong>Easy Mode is playable; Hard Mode appears in the menu but was not implemented.</strong></>}
                  zh={<>开始界面先铺开俏皮的视觉语言。<strong>简单模式可以玩；困难模式出现在菜单里，但并没有实现。</strong></>}
                />
              </Figure>
              <div
                className={styles.stateFlow}
                aria-label="Maze of Wishes game loop"
              >
                <div>
                  <strong>
                    <L en="Tutorial" zh="教程" />
                  </strong>
                  <span>
                    <L en="Learn tilt by moving the cake" zh="移动蛋糕，学会倾斜" />
                  </span>
                </div>
                <b>→</b>
                <div>
                  <strong>
                    <L en="Collect" zh="收集" />
                  </strong>
                  <span>
                    <L en="Find the birthday cake" zh="找到生日蛋糕" />
                  </span>
                </div>
                <b>→</b>
                <div>
                  <strong>
                    <L en="Deliver" zh="送达" />
                  </strong>
                  <span>
                    <L
                      en="Reach the goal before 90 seconds"
                      zh="在 90 秒内抵达终点"
                    />
                  </span>
                </div>
                <b>→</b>
                <div>
                  <strong>
                    <L en="Resolve" zh="结局" />
                  </strong>
                  <span>
                    <L en="Success or timeout feedback" zh="成功或超时的反馈" />
                  </span>
                </div>
              </div>
              <div className={styles.gameGrid}>
                <Figure
                  name="cake-required"
                  width={461}
                  height={271}
                  alt="Maze of Wishes warning telling the player to collect the cake first"
                >
                  <L
                    en="The goal is gated until the cake has been collected."
                    zh="拿到蛋糕之前，终点是锁着的。"
                  />
                </Figure>
                <Figure
                  name="potion-boost"
                  width={1254}
                  height={263}
                  alt="Maze of Wishes potion pickup and speed-up feedback"
                >
                  <L
                    en="A potion creates a temporary speed boost with visible feedback."
                    zh="药水会带来短暂的加速，并有清楚的视觉反馈。"
                  />
                </Figure>
                <Figure
                  name="success"
                  width={562}
                  height={328}
                  alt="Maze of Wishes success state after delivering the cake"
                >
                  <L
                    en="The success state closes the collect-and-deliver story."
                    zh="成功画面为“拿到蛋糕、送到终点”的故事画上句号。"
                  />
                </Figure>
                <Figure
                  name="timeout"
                  width={562}
                  height={332}
                  alt="Maze of Wishes timeout state after the 90-second timer expires"
                >
                  <L
                    en="The 90-second timer creates a clear failure state."
                    zh="90 秒倒计时带来一个明确的失败状态。"
                  />
                </Figure>
              </div>
              <p className={styles.small}>
                <L
                  en="Additional feedback includes breathing, absorption, scene and character animation. These details support clarity and tone; they are not separate game systems."
                  zh="其他反馈还包括呼吸、吸收效果，以及场景和角色动画。这些细节是为了让画面更清楚、气氛更对，并不是独立的游戏系统。"
                />
              </p>
            </section>

            <section id="collision">
              <p className={styles.kicker}>
                <L en="05 · Map + collision" zh="05 · 地图与碰撞检测" />
              </p>
              <h2>
                <L
                  en="Movement was checked before it reached the screen."
                  zh="每一步移动，在上屏之前都先检查一遍。"
                />
              </h2>
              <div className={styles.implementationGrid}>
                <Figure
                  name="final-map"
                  width={1024}
                  height={600}
                  alt="The final illustrated Maze of Wishes game map"
                >
                  <L
                    en="The final single-map play space combines the route, cake, potion and delivery goal."
                    zh="最终的单张地图把路线、蛋糕、药水和送达终点都放在了一起。"
                  />
                </Figure>
                <div>
                  <h3>
                    <L en="Predicted-position check" zh="预测位置检查" />
                  </h3>
                  <p>
                    <L
                      en="Before applying a movement, the Java game predicts Santa’s next position and checks a semantic map layer. In the working build, this prevented Santa from moving through walls."
                      zh="在真正移动之前，Java 程序会先预测圣诞老人的下一个位置，再去查一层语义地图。在可运行的版本里，这让圣诞老人不会穿墙。"
                    />
                  </p>
                  <h3>
                    <L en="Evidence boundary" zh="证据的边界" />
                  </h3>
                  <p>
                    <L
                      en="The archived mask file does not fully match the demonstrated final build. I therefore use the running prototype and source logic as evidence of the collision approach, without claiming that the archived mask proves robust pixel-perfect collision."
                      zh="存档里的遮罩文件和演示用的最终版本并不完全一致。所以我用运行中的原型和源代码逻辑来说明碰撞检测的做法，但不会说这份存档遮罩能证明碰撞检测稳定、精确到像素。"
                    />
                  </p>
                </div>
              </div>
              <Figure
                name="tiled-editor-crop"
                width={478}
                height={276}
                alt="Tiled editor view used while authoring the Maze of Wishes map"
              >
                <L
                  en="Tiled supported map authoring; JavaFX rendered the final experience and game state."
                  zh="地图用 Tiled 编辑；最终的画面和游戏状态由 JavaFX 渲染。"
                />
              </Figure>
            </section>

            <section id="demo-evidence">
              <p className={styles.kicker}>
                <L en="06 · Classroom demonstration" zh="06 · 课堂演示" />
              </p>
              <h2>
                <L
                  en="A working cross-device interaction, shown live."
                  zh="一个真正跑起来的跨设备交互，现场展示。"
                />
              </h2>
              <Figure
                name="demo-poster"
                width={1600}
                height={900}
                alt="Phone held beside a laptop running Maze of Wishes during a classroom demonstration"
              >
                <L
                  en="The supplied recording shows the phone-controlled game running on a laptop in class."
                  zh="这段录像记录了课堂上用手机操控、在笔记本电脑上运行的游戏。"
                />
              </Figure>
              <p className={styles.conclusion}>
                <L
                  en="The prototype was demonstrated live in class as a working cross-device interaction."
                  zh="这个原型在课堂上现场演示，作为一个能正常运行的跨设备交互。"
                />
              </p>
              <p>
                <L
                  en="No formal user study, participant protocol, validated scale or performance dataset was documented. The demonstration proves that the pipeline ran; it does not establish usability or player-experience outcomes."
                  zh="项目没有记录正式的用户研究、参与者流程、经过验证的量表或性能数据。演示只能证明这条链路跑通了，并不能说明可用性或玩家体验如何。"
                />
              </p>
            </section>

            <section id="reflection">
              <p className={styles.kicker}>
                <L en="07 · Reflection" zh="07 · 反思" />
              </p>
              <h2>
                <L
                  en="What this prototype demonstrates"
                  zh="这个原型证明了什么"
                />
              </h2>
              <ul className={styles.demonstrates}>
                <li>
                  <L
                    en="A playful interaction idea translated into a complete cross-device prototype."
                    zh="一个好玩的交互想法，落地成了完整的跨设备原型。"
                  />
                </li>
                <li>
                  <L
                    en="Live phone-sensor data mapped into understandable game movement."
                    zh="手机传感器的实时数据，被映射成玩家看得懂的游戏动作。"
                  />
                </li>
                <li>
                  <L
                    en="A technical pipeline integrated with tutorial, feedback, objectives and end states."
                    zh="技术链路和教程、反馈、目标、结局状态结合在了一起。"
                  />
                </li>
              </ul>
              <h3>
                <L en="Where the evidence stops" zh="证据止步于此" />
              </h3>
              <ul>
                <li>
                  <L
                    en="No formal participant study or documented feedback-based iteration."
                    zh="没有正式的参与者研究，也没有记录基于反馈的迭代。"
                  />
                </li>
                <li>
                  <L
                    en="The classroom demo confirms operation, not a validated interaction advantage."
                    zh="课堂演示只证明它能运行，不代表这种交互方式经过验证、更有优势。"
                  />
                </li>
                <li>
                  <L
                    en="Hard Mode is visible in the menu but has no implemented gameplay."
                    zh="困难模式出现在菜单里，但没有实现对应的玩法。"
                  />
                </li>
                <li>
                  <L
                    en="The archived collision mask does not fully match the final demonstrated build."
                    zh="存档的碰撞遮罩和最终演示版本并不完全一致。"
                  />
                </li>
                <li>
                  <L
                    en="The prototype depends on a shared local network and a fixed UDP port."
                    zh="原型依赖同一个局域网和固定的 UDP 端口。"
                  />
                </li>
              </ul>
              <p className={styles.reflection}>
                <L
                  en={<><strong>My takeaway:</strong> cross-device interaction becomes convincing when the technical chain and the player-facing explanation are designed together. The sensor mapping only mattered once the tutorial, constraints and feedback made it legible.</>}
                  zh={<><strong>我的收获：</strong>只有把技术链路和面向玩家的说明放在一起设计，跨设备交互才真正有说服力。传感器映射本身并不够，是教程、约束和反馈让它变得看得懂，它才有了意义。</>}
                />
              </p>
            </section>
          </article>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects">
            <L en="← Back to projects" zh="← 回到项目" />
          </Link>
          <a href="#maze-content">
            <L en="Back to top ↑" zh="回到顶部 ↑" />
          </a>
          <p>
            <L
              en="Maze of Wishes · Case Study v1"
              zh="Maze of Wishes · 项目案例 v1"
            />
          </p>
        </footer>
      </main>
    </div>
  );
}
