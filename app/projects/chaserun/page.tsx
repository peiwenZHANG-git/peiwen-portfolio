import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./chaserun.module.css";

export const metadata: Metadata = {
  title: "ChaseRun: Make the run the workout · Peiwen Zhang",
  description: "An AR-glasses fitness game concept: you jog, jump and squat in place while the virtual track moves toward you, chasing a lazy ghost that stole your coins. A 60-second previsualization film.",
};

/* Added 2026-10-21. Same structure and styles as the AI-Work case study
   (ai-work.module.css copied, plus storyboard / compare / palette). Content follows
   Peiwen's ChaseRun_portfolio_brief.md and its claim boundaries: this is a concept
   previsualization film, NOT a working AR app; no user testing, no safety validation,
   no measured results; the glasses are a prop; the results-card numbers are
   illustrative; no 3D camera tracking was used. Stills are her 1600 x 900 exports;
   "outside-view" and "squat" are frames from the film (0:29 and 0:43). */

const A = "/assets/projects/chaserun";

const run: { img: string; en: string; zh: string; alt: string }[] = [
  { img: "safezone", en: "The glasses find a safe area on the floor.", zh: "眼镜在地面上找到一块安全区域。", alt: "First-person view of a corridor with a cyan outline on the floor and the words SAFE AREA DETECTED" },
  { img: "stolen", en: "A lazy ghost steals your saved coins.", zh: "一只懒幽灵偷走了你攒下的金币。", alt: "The ghost floats away with the coin bag, coins falling, and the words COINS STOLEN!" },
  { img: "go", en: "Run in place. The track moves toward you.", zh: "原地跑起来，赛道朝你移动。", alt: "The ghost waits ahead on a cyan track, with the word GO!, a ghost-distance bar and a speed bar" },
  { img: "incoming", en: "The ghost throws a hurdle at you.", zh: "幽灵朝你扔来一个栏杆。", alt: "A red-orange hurdle lands on the track in front of the ghost, the screen edges glow red, with the word INCOMING!" },
  { img: "jump", en: "Jump over it.", zh: "跳过去。", alt: "The hurdle on the track ahead with the word JUMP!" },
  { img: "squat", en: "Squat under the gate.", zh: "从门下蹲过去。", alt: "A gate stands across the track with the word SQUAT!" },
  { img: "boost", en: "Run faster to close the gap.", zh: "跑得更快，缩短距离。", alt: "The ghost is only 5 metres ahead and says NO NO NO!, with the word BOOST! and a full speed bar" },
  { img: "caught", en: "Catch it and get your coins back.", zh: "抓住它，拿回金币。", alt: "The coin bag in front of the camera with the words CAUGHT! and +500 COINS!" },
];

export default function ChaseRunPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#chaserun-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="chaserun-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="ChaseRun · 2026 · AR experience design" zh="ChaseRun · 2026 · AR 体验设计" /></p>
          <h1><L en="Make the run the workout." zh="让跑酷本身成为锻炼。" /></h1>
          <p className={styles.lead}><L en="An AR-glasses fitness game: you jog, jump and squat in place while the virtual track moves toward you, chasing a lazy ghost that stole your coins."
            zh="一款为 AR 眼镜设计的健身追逐游戏：你站在原地跑、跳、蹲，虚拟赛道朝你移动；你追的是一只偷走你金币的懒幽灵。" /></p>
          <p className={styles.annotation}><L en="A concept, shown as a 60-second film." zh="一个概念，用 60 秒的影片来呈现。" /></p>
          <a className={styles.jump} href="#iteration"><L en="See how feedback changed it ↓" zh="看反馈怎么改变了它 ↓" /></a>
        </div>
        <figure id="film" className={styles.heroDemo}>
          <video controls preload="metadata" playsInline poster={`${A}/film-poster.webp`} aria-label="Watch the 60-second ChaseRun concept film">
            <source src={`${A}/resources/chaserun-film.mp4`} type="video/mp4" />
            Your browser does not support embedded video. <a href={`${A}/resources/chaserun-film.mp4`}>Open the film</a>.
          </video>
          <figcaption><span><L en="Watch the concept film · 1:00 · with sound" zh="观看概念影片 · 1:00 · 有声音" /></span><L en="A previsualization film made from real footage and 3D renders. It is not a working AR app, and the glasses in it are an ordinary pair used as a prop."
            zh="用实拍画面和 3D 渲染合成的预演影片。它不是可运行的 AR 应用，片中的眼镜是普通眼镜，只是道具。" /></figcaption>
        </figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview">
        <h2 id="overview"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Context" zh="背景" /></dt><dd><L en={<>AR Experience Design &amp; Previsualization<br />HCI M2 · Université Paris-Saclay<br />Sep – Oct 2026</>} zh={<>AR 体验设计与预演课程（AREDP）<br />HCI 硕士二年级 · 巴黎萨克雷大学<br />2026 年 9 月 – 10 月</>} /></dd></div>
          <div><dt><L en="Deliverables" zh="交付物" /></dt><dd><L en={<>Individual project<br />60-second concept film (1080p, original music and sound)<br />7-minute startup-style pitch</>} zh={<>个人项目<br />60 秒概念影片（1080p，原创配乐和音效）<br />7 分钟创业式 pitch</>} /></dd></div>
          <div><dt><L en="My role" zh="我的角色" /></dt><dd><L en="Concept and interaction design, story and storyboard, filming (behind and in front of the camera), art direction, and reviewing and accepting every shot, version by version."
            zh="概念与交互设计、故事与分镜、实拍（拍摄和出镜）、美术方向，以及每个镜头的逐版评审与验收。" /></dd></div>
        </dl>
        <p className={styles.small}><L en="Tools: Blender (Eevee), Python with OpenCV for floor registration and compositing, and AI coding assistants (Codex and Claude), which wrote the compositing, interface and Blender scripts and generated the music, working to my direction. See 05 for who did what."
          zh="工具：Blender（Eevee 渲染）、Python 和 OpenCV（地面配准与合成），以及 AI 编程助手（Codex 和 Claude），合成、界面、Blender 脚本和配乐生成由它们按我的要求编写。分工详见第 05 节。" /></p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}><L en="Inside the project" zh="项目目录" /></p>
            <a href="#problem"><L en="01 · The problem" zh="01 · 问题" /></a>
            <a href="#design"><L en="02 · Core design" zh="02 · 核心设计" /></a>
            <a href="#iteration"><L en="03 · Design iteration" zh="03 · 设计迭代" /></a>
            <a href="#run"><L en="04 · One run, shot by shot" zh="04 · 一次奔跑，逐个镜头" /></a>
            <a href="#made"><L en="05 · How the film was made" zh="05 · 影片怎么做出来的" /></a>
            <a href="#evidence"><L en="06 · Reflection and limits" zh="06 · 反思与局限" /></a>
          </nav>
        </aside>
        <article className={styles.story} aria-label="ChaseRun case study">
          <section id="problem">
            <p className={styles.eyebrow}><L en="01 / The problem" zh="01 / 问题" /></p>
            <h2><L en="Cardio at home is boring. Runner games are played sitting down." zh="在家做有氧很无聊，跑酷游戏却是坐着玩的。" /></h2>
            <ul>
              <li><L en="Running in place at home has no goal and no story." zh="在家原地跑，没有目标，也没有故事。" /></li>
              <li><L en="Endless-runner phone games like Temple Run and Subway Surfers are fun, but you usually play them sitting down." zh="Temple Run、Subway Surfers 这样的跑酷手游很好玩，但通常是坐着玩的。" /></li>
            </ul>
            <p className={styles.note}><L en={<><strong>Design question:</strong> could the runner game itself be the workout?</>}
              zh={<><strong>设计问题：</strong>能不能让跑酷游戏本身成为锻炼？</>} /></p>
          </section>

          <section id="design">
            <p className={styles.eyebrow}><L en="02 / Core design" zh="02 / 核心设计" /></p>
            <h2><L en="You stay in place. The world comes to you." zh="你留在原地，世界朝你而来。" /></h2>
            <ol className={styles.rules} aria-label="ChaseRun core design">
              <li><span>01</span><div><strong><L en="Move in place" zh="原地运动" /></strong><p><L en="You only jog, jump and squat on the spot. The virtual track moves toward you, which creates the feeling of moving forward." zh="你只在原地慢跑、跳、蹲，虚拟赛道朝你移动，营造前进的感觉。" /></p></div></li>
              <li><span>02</span><div><strong>SafeZone</strong><p><L en="The AR glasses find a safe area on the floor, and you stay inside it the whole time." zh="AR 眼镜识别地面上的一块安全区域，你始终留在里面。" /></p></div></li>
              <li><span>03</span><div><strong><L en="AR, not VR" zh="用 AR，而不是 VR" /></strong><p><L en="You can still see your own room, so jumping and squatting should feel safer, and your hands are free: no phone to hold." zh="你仍然看得到自己的房间，所以跳和蹲应该更安全；双手是空的，不用拿手机。" /></p></div></li>
              <li><span>04</span><div><strong><L en="The chase" zh="追逐机制" /></strong><p><L en="Run fast enough to close the distance to the ghost. It throws hurdles (jump over them) and gates (squat under them). Catch it and you get your coins back." zh="跑得够快才能缩短和幽灵的距离。幽灵会扔出栏杆（要跳过）和门（要蹲过）。抓住它，就能拿回金币。" /></p></div></li>
            </ol>
            <h3><L en="Two colours, two meanings" zh="两种颜色，两种意思" /></h3>
            <ul className={styles.palette}>
              <li><span className={styles.swatch} style={{ background: "#2ec8e6" }} aria-hidden="true" /><L en="Cyan: normal information (the SafeZone, the track, the interface)" zh="青色：正常信息（SafeZone、赛道、界面）" /></li>
              <li><span className={styles.swatch} style={{ background: "#f0602e" }} aria-hidden="true" /><L en="Orange-red: danger (obstacles, warnings)" zh="橙红色：危险（障碍物、警告）" /></li>
            </ul>
            <p><L en="The interface borrows from games: pop-up prompts, a speed bar, a score, a ghost-distance bar and a results card."
              zh="界面采用游戏风格：弹出提示、速度条、分数、幽灵距离条和结算卡。" /></p>
            <div className={styles.pair}>
              <figure className={styles.figure}>
                <a href={`${A}/safezone.webp`} aria-label="Open full-size image: safe area detected">
                  <Image src={`${A}/safezone.webp`} width={1600} height={900} alt={run[0].alt} sizes="(max-width: 700px) 92vw, 420px" />
                </a>
                <figcaption><L en="The SafeZone, outlined in cyan on the real floor." zh="SafeZone：真实地面上的青色轮廓。" /></figcaption>
              </figure>
              <figure className={styles.figure}>
                <a href={`${A}/incoming.webp`} aria-label="Open full-size image: incoming hurdle">
                  <Image src={`${A}/incoming.webp`} width={1600} height={900} alt={run[3].alt} sizes="(max-width: 700px) 92vw, 420px" />
                </a>
                <figcaption><L en="Danger in orange-red: a hurdle is coming, and the edges of the view glow red." zh="危险用橙红色：栏杆飞来，画面边缘泛红。" /></figcaption>
              </figure>
            </div>
          </section>

          <section id="iteration">
            <p className={styles.eyebrow}><L en="03 / Design iteration" zh="03 / 设计迭代" /></p>
            <h2><L en="What changed, and why." zh="改了什么，为什么改。" /></h2>
            <ol className={styles.iteration}>
              <li><span><L en="From running outdoors to running in place" zh="从户外跑改成原地跑" /></span>
                <p><L en="The first idea was running forward outdoors. In feedback on the first draft, one classmate said they would worry about hitting something when jumping with glasses on. Suddenly jumping or dodging while running forward also risks collisions and falls, so I moved all movement into the SafeZone, on the spot. This has not been safety-tested."
                  zh="最初的设想是在户外向前跑。初稿之后的反馈里，有同学说戴着眼镜跳起来会担心撞到东西。边跑边突然跳或躲，本来也有碰撞和摔倒的风险，所以我把所有动作都改成在 SafeZone 里原地完成。这一点没有经过安全测试。" /></p></li>
              <li><span><L en="Turning the chase around, after my teacher’s feedback" zh="根据老师的反馈，把追逐方向反过来" /></span>
                <p><L en="In the first draft a monster chased you from behind, and all you saw was a distance bar, never the monster. The feedback: you can’t chase something you can’t see. In the final version the ghost is ahead of you. You can see it, it throws obstacles at you, and in the end you catch it."
                  zh="初稿里是怪兽在身后追你，你只看得到一个距离条，从来看不到怪兽本身。老师的反馈是：看不见的东西没法追。终版改成幽灵在你前方：你看得见它，它朝你扔障碍物，最后你抓住它。" /></p></li>
              <li><span><L en="A reason to run" zh="给奔跑一个理由" /></span>
                <p><L en="I added a story: a lazy ghost steals the coins you’ve saved. Now the run has a motive." zh="我加了一个情节：一只懒幽灵偷走了你攒下的金币。奔跑从此有了动机。" /></p></li>
              <li><span><L en="A third-person shot" zh="加一个第三人称镜头" /></span>
                <p><L en="An outside view shows that the player really does stay in one place." zh="从外部视角证明，玩家确实一直留在原地。" /></p></li>
              <li><span><L en="Music that speeds up with you, after a classmate’s suggestion" zh="根据同学的建议，让音乐跟着你加速" /></span>
                <p><L en="A classmate suggested that the faster you run, the faster the music should be. In the final film, the music’s tempo follows the running speed. In the film this is a scripted effect, not driven by real running data." zh="有同学建议“跑得越快，音乐越快”。终版影片里，配乐的节奏会随跑速变化。在影片里这是预先做好的效果，不是由真实跑步数据驱动的。" /></p></li>
              <li><span><L en="One set of obstacles" zh="统一障碍物" /></span>
                <p><L en="The hurdles and gates the ghost throws are the same Blender models the player then jumps over and squats under." zh="幽灵扔出的栏杆和门，和玩家后来跳过、蹲过的，是同一个 Blender 模型。" /></p></li>
            </ol>
            <table className={styles.compare}>
              <caption className={styles.small} style={{ captionSide: "bottom", textAlign: "left", padding: "10px 16px" }}><L en="First draft (presented 2 October) compared with the final version." zh="初稿（10 月 2 日汇报）和终版的对照。" /></caption>
              <thead><tr><th scope="col"><span className={styles.srOnly}><L en="Aspect" zh="方面" /></span></th><th scope="col"><L en="First draft" zh="初稿" /></th><th scope="col"><L en="Final" zh="终版" /></th></tr></thead>
              <tbody>
                <tr><th scope="row"><L en="Film" zh="影片" /></th><td><L en="15 seconds, silent" zh="15 秒，无声" /></td><td><L en="60 seconds, a full story, original music and sound" zh="60 秒，完整故事，原创配乐和音效" /></td></tr>
                <tr><th scope="row"><L en="Opponent" zh="对手" /></th><td><L en="A monster behind you, never on screen" zh="身后的怪兽，从不出现在画面里" /></td><td><L en="A 3D ghost ahead of you that steals coins and throws obstacles" zh="前方的 3D 幽灵，偷金币、扔障碍" /></td></tr>
                <tr><th scope="row"><L en="3D objects" zh="3D 物体" /></th><td><L en="Hurdle, gate" zh="栏杆、门" /></td><td><L en="Plus the ghost and the coin bag; thrown and real obstacles are the same model" zh="另加幽灵和钱袋；扔出的和真正要过的障碍是同一个模型" /></td></tr>
                <tr><th scope="row"><L en="Viewpoint" zh="视角" /></th><td><L en="First person only" zh="只有第一人称" /></td><td><L en="Plus third person" zh="另加第三人称" /></td></tr>
                <tr><th scope="row"><L en="Interface" zh="界面" /></th><td><L en="Small text" zh="小字界面" /></td><td><L en="Game-style interface" zh="游戏风格界面" /></td></tr>
              </tbody>
            </table>
            <h3><L en="What classmates said about the first draft" zh="同学对初稿的评价" /></h3>
            <p><L en="In the peer review after the first draft, 6 of 7 ratings were 5 out of 5 and one was 4. Praise centred on the visuals, the sound and the mix of fun and fitness; one classmate compared it to Subway Surfers. One comment pointed out that similar ideas already exist."
              zh="初稿之后的同学互评里，7 份评分中有 6 份是 5 分（满分 5 分），1 份是 4 分。好评集中在画面、音效和“有趣 + 健身”；有人把它比作 Subway Surfers。也有一条意见指出，类似的点子已经存在。" /></p>
            <p className={styles.small}><L en="These are classmates’ ratings of a 15-second draft, not a user test of the game." zh="这些是同学对一段 15 秒初稿的评分，不是对游戏的用户测试。" /></p>
            <h3><L en="Asking classmates who exercise" zh="请有健身习惯的同学看" /></h3>
            <p><L en="After the first draft I also asked five or six classmates who exercise regularly to watch the 15-second film. I asked them whether exercising at home feels boring and whether they would want to play this game. One of them said they would worry about hitting something when jumping with glasses on. That is why I moved the game from outdoors to moving in place, and it fed into the later changes: the game-style interface, the sound effects and the music that changes speed. This was informal feedback from a small group, not a user test."
              zh="初稿之后，我还请五六位有健身习惯的同学看了那段 15 秒影片，问了他们：在家锻炼会不会觉得无聊，以及会不会想玩这个游戏。其中有人说，戴着眼镜跳起来会担心撞到东西。所以我把游戏从户外改成了原地运动，后来加上的游戏风格界面、各种音效和会变速的音乐也和这些反馈有关。这是小范围的非正式反馈，不是用户测试。" /></p>
          </section>

          <section id="run">
            <p className={styles.eyebrow}><L en="04 / One run, shot by shot" zh="04 / 一次奔跑，逐个镜头" /></p>
            <h2><L en="From “coins stolen” to “caught”." zh="从“金币被偷”到“抓住了”。" /></h2>
            <ol className={styles.storyboard} aria-label="Eight frames from the film, in order">
              {run.map((s, i) => <li key={s.img}>
                <a href={`${A}/${s.img}.webp`} aria-label={`Open full-size frame ${i + 1}`}>
                  <Image src={`${A}/${s.img}.webp`} width={1600} height={900} alt={s.alt} sizes="(max-width: 1000px) 45vw, 220px" />
                </a>
                <p><span aria-hidden="true">{i + 1}</span><L en={s.en} zh={s.zh} /></p>
              </li>)}
            </ol>
            <figure className={styles.shot}>
              <a href={`${A}/results.webp`} aria-label="Open full-size image: results card">
                <Image src={`${A}/results.webp`} width={1600} height={900}
                  alt="A RUN COMPLETE! results card reading COINS RECOVERED, with time, score, calories and maximum speed"
                  sizes="(max-width: 700px) 92vw, 850px" />
              </a>
              <figcaption><L en="The results card at the end of the run. The numbers on it are illustrative, not measurements."
                zh="跑完后的结算卡。上面的数字是示意值，不是测量数据。" /></figcaption>
            </figure>
          </section>

          <section id="made">
            <p className={styles.eyebrow}><L en="05 / How the film was made" zh="05 / 影片怎么做出来的" /></p>
            <h2><L en="Real footage, 3D renders, one composite." zh="实拍、3D 渲染，合成为一。" /></h2>
            <ol className={styles.flow}>
              <li><span><L en="1 · Film" zh="1 · 拍摄" /></span><L en="Real first-person and third-person footage, shot indoors." zh="在室内拍摄真实的第一人称和第三人称视频。" /></li>
              <li><span><L en="2 · Pin the floor" zh="2 · 地面配准" /></span><L en="OpenCV planar homography from 4 floor points, so the track, SafeZone and obstacles sit on the real floor in every frame. Keyframed by hand where needed." zh="用 OpenCV 在地面上取 4 个点算平面单应性，让赛道、SafeZone 和障碍物在每一帧都贴在真实地面上。必要时手动打关键帧。" /></li>
              <li><span><L en="3 · Render" zh="3 · 渲染" /></span><L en="The ghost, coin bag, hurdle and gate are Blender meshes with materials and keyframed animation, rendered in Eevee as transparent image sequences." zh="幽灵、钱袋、栏杆和门都是 Blender 网格，有材质和关键帧动画，用 Eevee 渲染成透明背景的图像序列。" /></li>
              <li><span><L en="4 · Composite" zh="4 · 合成" /></span><L en="Python layers the renders onto the footage, then adds the game interface and the sound." zh="用 Python 把渲染图叠到实拍画面上，再加上游戏界面和声音。" /></li>
            </ol>
            <div className={styles.pair}>
              <figure className={`${styles.figure} ${styles.ghostShot}`}>
                <a href={`${A}/ghost-render.webp`} aria-label="Open full-size image: the ghost rendered in Blender">
                  <Image src={`${A}/ghost-render.webp`} width={1600} height={900} alt="The ghost character rendered in Blender: a white, smiling ghost holding a brown coin bag with a dollar sign" sizes="(max-width: 700px) 92vw, 420px" />
                </a>
                <figcaption><L en="The ghost, rendered in Blender. The 3D assets are built by Blender scripts that AI coding assistants (Codex and Claude) wrote to my direction." zh="Blender 里渲染的幽灵。3D 素材由 Blender 脚本生成，脚本由 AI 编程助手（Codex 和 Claude）按我的要求编写。" /></figcaption>
              </figure>
              <figure className={styles.figure}>
                <a href={`${A}/outside-view.webp`} aria-label="Open full-size image: the third-person outside view">
                  <Image src={`${A}/outside-view.webp`} width={1600} height={900} alt="Third-person OUTSIDE VIEW: Peiwen jogging in place inside the cyan SafeZone outline, with the ghost-distance and speed bars" sizes="(max-width: 700px) 92vw, 420px" />
                </a>
                <figcaption><L en="The third-person shot (0:29): me, jogging in place inside the SafeZone." zh="第三人称镜头（0:29）：我在 SafeZone 里原地慢跑。" /></figcaption>
              </figure>
            </div>
            <p><L en="I also tried a full 3D camera solve. The tracking was unstable, so I dropped it and used planar floor registration instead."
              zh="我也试过完整的三维相机追踪（camera solve），结果不稳定，最后没有采用，改用平面地面配准。" /></p>
            <p className={styles.contribution}><L en={<><strong>Who did what:</strong> the concept, the filming, the art direction and the review of every shot were mine. The compositing, the interface, the Blender scripts and the generated music were written by AI coding assistants (Codex and Claude), working to my direction; I accepted or sent back each version.</>}
              zh={<><strong>分工：</strong>概念、拍摄、美术方向和每个镜头的验收由我完成。合成、界面、Blender 脚本和配乐生成，由 AI 编程助手（Codex 和 Claude）按我的要求编写；每一版是否通过，由我决定。</>} /></p>
            <p className={styles.pencilNote}><span aria-hidden="true">↳</span> <L en="I directed; the AI tools built; I signed off." zh="我来指挥，AI 来制作，我来验收。" /></p>
          </section>

          <section id="evidence">
            <p className={styles.eyebrow}><L en="06 / Reflection and next steps" zh="06 / 反思与下一步" /></p>
            <h2><L en="Reflection, and where the evidence stops" zh="反思，以及证据到哪里为止" /></h2>
            <h3><L en="What I took from this" zh="我从中学到的" /></h3>
            <p><L en="The course did not ask us to build on real AR glasses. It asked us to turn the film into something that could make money. That changed how I looked at the design. After my teacher’s feedback, I moved the ghost from behind the player to in front of them to increase motivation: you can see what you are chasing. It also made me start asking what users fear and want from exercising at home, what would make the experience comfortable, and how that could turn into revenue. I have only begun to look into these questions, and the answers in the pitch are still hypotheses."
              zh="这门课没有要求在真正的 AR 眼镜上开发，而是要把成品视频包装成一个能盈利的产品。这改变了我看设计的方式。根据老师的反馈，我把鬼从玩家身后移到身前，是为了增加动力：看得见才有追的目标。它也让我开始思考：用户在家锻炼时害怕什么、想要什么，怎样让体验舒适，以及这些怎么变成收入。我刚刚开始研究这些问题，宣讲里的答案目前还只是假设。" /></p>
            <ul>
              <li><L en="ChaseRun is a concept shown as a previsualization film. It is not a working AR prototype or app." zh="ChaseRun 是一个用预演影片呈现的概念，不是可运行的 AR 原型或应用。" /></li>
              <li><L en="I have not run a user test of the game. The feedback came from my teacher, classmates’ ratings of a 15-second draft, and informal conversations with five or six classmates who exercise regularly. There is no safety validation and no measured effect on fitness." zh="我没有对这个游戏做过用户测试。反馈来自老师、同学对 15 秒初稿的评分，以及和五六位有健身习惯的同学的非正式交流。没有安全性验证，也没有测量过任何健身效果。" /></li>
              <li><L en="The glasses in the film are an ordinary pair used as a prop, and the numbers on the results card are illustrative." zh="片中的眼镜是普通眼镜作道具，结算卡上的数字是示意值。" /></li>
              <li><L en="The business model in the pitch is still a hypothesis." zh="pitch 里的商业模式仍然只是假设。" /></li>
            </ul>
            <p className={styles.note}><L en={<><strong>Next step:</strong> test the assumptions behind the design with real users, namely that seeing the ghost ahead keeps people motivated and that jumping and squatting in place with glasses on feels comfortable, before building a prototype on real AR glasses.</>}
              zh={<><strong>下一步：</strong>先找真实用户验证设计背后的假设，也就是看得见前方的幽灵能让人保持动力、戴着眼镜原地跳和蹲让人感觉舒适，然后再在真实 AR 眼镜上做原型。</>} /></p>
          </section>
          <footer className={styles.footer}><p><L en="ChaseRun · Individual course project · Université Paris-Saclay · 2026" zh="ChaseRun · 个人课程项目 · 巴黎萨克雷大学 · 2026" /></p><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#chaserun-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a></footer>
        </article>
      </div>
    </main>
  </div>;
}
