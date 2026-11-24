import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import { SearchChart } from "./search-chart";
import styles from "./visual-search.module.css";

/* Bilingual: every reading text is <L en zh />. Chinese: Claude's draft, for Peiwen to review.
   Numbers are recomputed from the team's log_merge.csv (270 trials) and the analysis notebook;
   see the note in "How far the evidence goes". */

const assetRoot = "/assets/projects/visual-search";

export const metadata: Metadata = {
  title: "Visual Search Experiment · Peiwen Zhang",
  description: "A within-subject experiment on whether contrast, an added border, or both let people find a target at a glance, however many items are on screen.",
};

function Figure({ name, width, height, alt, children, priority = false }: { name: string; width: number; height: number; alt: string; children?: ReactNode; priority?: boolean }) {
  return <figure className={styles.figure}>
    <a href={`${assetRoot}/${name}.webp`} aria-label={`Open full-size image: ${alt}`}>
      <Image src={`${assetRoot}/${name}.webp`} width={width} height={height} alt={alt} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 760px" priority={priority} />
    </a>
    {children && <figcaption>{children}</figcaption>}
  </figure>;
}

export default function VisualSearchPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#vs-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="vs-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="Experiment · Visual perception" zh="实验 · 视觉感知" /></p>
          <h1><L en="Visual Search Experiment" zh="视觉搜索实验" /></h1>
          <p className={styles.lead}><L en="Do more items slow you down? It depends on how the target stands out." zh="东西变多，会让人找得更慢吗？这取决于目标是怎么“跳出来”的。" /></p>
          <p><L en="A within-subject experiment testing whether a luminance contrast, an added border, or both together let people spot a target at a glance, however many items are on screen."
            zh="一个被试内实验：检验亮度对比、加一圈边框，或两者叠加，能不能让人一眼找到目标，不管屏幕上有多少个物体。" /></p>
          <p className={styles.heroMeta}><L en="Université Paris-Saclay · M1 HCI · Experimental Design & Analysis · Jan–Feb 2026 · 6 participants · 270 trials · Team of 3" zh="巴黎-萨克雷大学 · HCI 硕士一年级 · 实验设计与分析 · 2026 年 1–2 月 · 6 名被试 · 270 次试验 · 3 人团队" /></p>
          <p className={styles.role}><L en={<><strong>My role</strong> Experiment design · Data analysis · Report writing</>}
            zh={<><strong>我的角色</strong> 实验设计 · 数据分析 · 报告撰写</>} /></p>
          <a className={styles.jump} href="#results"><L en="Jump to the results ↓" zh="直接看结果 ↓" /></a>
        </div>
        <Figure name="conditions" width={1328} height={1562} alt="Nine experimental displays: contrast, addition, and contrast plus addition, each with 9, 25 and 49 grey squares" priority>
          <L en="The nine displays: three ways to make the target stand out, three crowd sizes. (Red circles mark the target in this figure only; participants did not see them.)"
            zh="九种画面：三种让目标突出的方式，三种拥挤程度。（红圈只在这张图里标出目标，被试看不到。）" />
        </Figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview-title">
        <h2 id="overview-title"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Question" zh="问题" /></dt><dd><L en="A feature is “preattentive” if finding it takes the same time no matter how many items surround it. Which of our cues behave that way?" zh="如果一个特征是“前注意”的，那么不管周围有多少物体，找到它所需的时间都一样。我们的哪些线索具备这个特性？" /></dd></div>
          <div><dt><L en="Approach" zh="方法" /></dt><dd><L en="A 3 × 3 full-factorial design: three cue types × three object counts, every participant in every condition, five repetitions each." zh="3 × 3 全因子设计：三种线索 × 三种物体数量，每位被试做完所有条件，每个条件重复 5 次。" /></dd></div>
          <div><dt><L en="Finding" zh="发现" /></dt><dd><L en="Contrast and an added border each stayed fast as the crowd grew. Using both together was slower, and slower with more items." zh="亮度对比和加边框单独使用时，物体变多也依然很快；两者叠加反而更慢，而且物体越多越慢。" /></dd></div>
        </dl>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}><nav aria-label="Case study chapters"><p className={styles.eyebrow}><L en="Inside the study" zh="研究目录" /></p><a href="#question"><L en="01 · The question" zh="01 · 问题" /></a><a href="#design"><L en="02 · Experiment design" zh="02 · 实验设计" /></a><a href="#results"><L en="03 · Results" zh="03 · 结果" /></a><a href="#limits"><L en="04 · How far the evidence goes" zh="04 · 证据能走多远" /></a><a href="#next"><L en="05 · Next steps + scope" zh="05 · 下一步与范围" /></a></nav></aside>
        <article className={styles.story} aria-label="Visual search experiment case study">
          <section id="question"><p className={styles.eyebrow}><L en="01 / The question" zh="01 / 问题" /></p><h2><L en="Can a cue make the crowd irrelevant?" zh="一个线索，能让“人多”变得无关紧要吗？" /></h2>
            <p><L en="Some visual differences pop out: you notice them without scanning. If a cue is preattentive, adding more items to the display should not change how long it takes to find the target. If it is not, search time grows with the crowd." zh="有些视觉差异会“跳”出来，不用逐个扫描就能注意到。如果一个线索是前注意的，往画面里多放些物体，找到目标的时间不该变长；如果不是，搜索时间会随物体数量增加。" /></p>
            <p><L en="We tested two cues, and their combination:" zh="我们测试了两个线索，以及它们的组合：" /></p>
            <dl className={styles.findings}>
              <div><dt><L en="H1 · Contrast" zh="H1 · 对比" /></dt><dd><L en="The target differs in luminance from the others. Prediction: search time does not depend on object count." zh="目标的亮度和其他物体不同。预测：搜索时间与物体数量无关。" /></dd></div>
              <div><dt><L en="H2 · Addition" zh="H2 · 添加" /></dt><dd><L en="The target has a border line added, in the same colour and luminance. Prediction: same, no dependence on object count." zh="目标多了一圈边框线（颜色和亮度相同）。预测：同样与物体数量无关。" /></dd></div>
              <div><dt><L en="H3 · Both" zh="H3 · 两者叠加" /></dt><dd><L en="Contrast and border together. Prediction: not faster than a single cue, and possibly slower as items are added." zh="对比和边框同时使用。预测：不会比单一线索更快，物体增加时还可能变慢。" /></dd></div>
            </dl>
            <p className={styles.annotation}><L en="Two of the three predictions are “nothing changes”, which turns out to be the harder kind to show." zh="三个预测里有两个是“什么都不会变”——事后看，这恰恰是最难证明的那种。" /></p>
          </section>

          <section id="design"><p className={styles.eyebrow}><L en="02 / Experiment design" zh="02 / 实验设计" /></p><h2><L en="Nine conditions, one task." zh="九个条件，同一个任务。" /></h2>
            <div className={styles.factors}>
              <div><p><L en="Difference type" zh="差异类型" /></p><span><L en="Contrast · Addition · Contrast + Addition" zh="对比 · 添加 · 对比 + 添加" /></span></div>
              <div><p><L en="Object count" zh="物体数量" /></p><span><L en="Low 3 × 3 = 9 · Medium 5 × 5 = 25 · High 7 × 7 = 49" zh="低 3 × 3 = 9 · 中 5 × 5 = 25 · 高 7 × 7 = 49" /></span></div>
            </div>
            <p><L en="The measure was visual search time: from the moment the display appears to the moment the participant presses the space bar on finding the target. A validation grid then asked them to click where it was." zh="测量指标是视觉搜索时间：从画面出现，到被试找到目标并按下空格。随后出现一个验证网格，让被试点击目标所在的位置。" /></p>
            <Figure name="procedure" width={1422} height={562} alt="Trial flow: task description, practice, countdown, find the target and press space, click to validate, then repeat"><L en="One trial: countdown, find the target, press space, click to confirm." zh="一次试验：倒计时、找目标、按空格、点击确认。" /></Figure>
            <h3><L en="Controlling what we could" zh="能控制的，都尽量控制" /></h3>
            <p><L en="Every participant did every condition (within-subject), five times each: 9 conditions × 5 = 45 trials per person, 270 in total with six participants." zh="每位被试都做完所有条件（被试内设计），每个条件 5 次：9 个条件 × 5 = 每人 45 次试验，6 位被试共 270 次。" /></p>
            <p><L en="Cue type was counterbalanced with a three-level Latin square across three blocks, so different people met the cues in different orders. Object count was randomised inside each block: with six participants there was not enough for a Latin square on that factor too." zh="线索类型用三水平拉丁方分成三个 block 来平衡顺序，让不同的人以不同的顺序遇到这些线索。物体数量在每个 block 内随机：只有六位被试，没法再对这个因素也做拉丁方。" /></p>
            <Figure name="touchstone" width={2048} height={1139} alt="The experiment design built in Touchstone2: difference type with Latin square, object count randomised with five replications, six participants"><L en="The design in Touchstone2. Its own statistical-power panel already showed that six participants is a small sample." zh="在 Touchstone2 里搭出的实验设计。它自带的统计功效面板，已经提示六位被试是个很小的样本。" /></Figure>
            <p className={styles.small}><L en="The experiment ran as a static JavaScript web page on each participant's own laptop, with times logged automatically from keyboard input." zh="实验是一个静态的 JavaScript 网页，被试在自己的笔记本上完成，时间由键盘输入自动记录。" /></p>
          </section>

          <section id="results"><p className={styles.eyebrow}><L en="03 / Results" zh="03 / 结果" /></p><h2><L en="Two cues stay flat. Together they slow down." zh="单独用都很平，叠加起来就变慢。" /></h2>
            <SearchChart />
            <p><L en={<><strong>Contrast and Addition (H1, H2).</strong> Search time barely moved with the crowd: from 9 to 49 items it rose by about 100 ms for Contrast and about 80 ms for Addition, against baselines of 1.2 to 1.4 seconds. Neither effect of object count was significant.</>} zh={<><strong>对比与添加（H1、H2）。</strong>搜索时间几乎不随物体数量变化：从 9 个到 49 个，对比条件约增加 100 毫秒，添加条件约增加 80 毫秒，而基线是 1.2 到 1.4 秒。两者的物体数量效应都不显著。</>} /></p>
            <p><L en={<><strong>Contrast + Addition (H3).</strong> The mean was about 2.6 seconds with 9 items and about 5.4 and 5.6 seconds with 25 and 49. Object count had a large effect, and the 9-item displays were reliably faster than both larger ones.</>} zh={<><strong>对比 + 添加（H3）。</strong>9 个物体时平均约 2.6 秒，25 个和 49 个时分别约 5.4 秒和 5.6 秒。物体数量的效应很大，9 个物体的画面明显快于另外两种。</>} /></p>
            <div className={styles.tableWrap}><table className={styles.table}>
              <caption><L en="Repeated-measures ANOVA on object count, per cue type (6 participants, 3 levels: F(2, 10))" zh="每种线索下，物体数量的重复测量方差分析（6 名被试、3 个水平：F(2, 10)）" /></caption>
              <thead><tr><th scope="col"><L en="Cue" zh="线索" /></th><th scope="col"><L en="Linear fit, all trials" zh="线性拟合（全部试验）" /></th><th scope="col">F</th><th scope="col">p</th><th scope="col"><L en="Verdict" zh="结论" /></th></tr></thead>
              <tbody>
                <tr><th scope="row"><L en="Contrast (H1)" zh="对比（H1）" /></th><td><L en="+2.6 ms per item, r = 0.06" zh="每个物体 +2.6 毫秒，r = 0.06" /></td><td>3.87</td><td>0.057</td><td><L en="No significant effect (borderline)" zh="效应不显著（接近临界）" /></td></tr>
                <tr><th scope="row"><L en="Addition (H2)" zh="添加（H2）" /></th><td><L en="+2.1 ms per item, r = 0.05" zh="每个物体 +2.1 毫秒，r = 0.05" /></td><td>0.32</td><td>0.733</td><td><L en="No significant effect" zh="效应不显著" /></td></tr>
                <tr><th scope="row"><L en="Contrast + Addition (H3)" zh="对比 + 添加（H3）" /></th><td><L en="+71 ms per item, r = 0.29" zh="每个物体 +71 毫秒，r = 0.29" /></td><td>12.72</td><td>0.002</td><td><L en="Significant, large effect (generalised η² = 0.32)" zh="显著，效应很大（广义 η² = 0.32）" /></td></tr>
              </tbody>
            </table></div>
            <p><L en="For H3, pairwise comparisons (paired t-tests, FDR-corrected) put 9 items against 25 at p = 0.020 and against 49 at p = 0.020. 25 against 49 did not differ (p = 0.65)." zh="H3 的两两比较（配对 t 检验，FDR 校正）：9 个对 25 个 p = 0.020，9 个对 49 个 p = 0.020；25 个对 49 个没有差异（p = 0.65）。" /></p>
          </section>

          <section id="limits"><p className={styles.eyebrow}><L en="04 / How far the evidence goes" zh="04 / 证据能走多远" /></p><h2><L en="“No significant effect” is not “no effect”." zh="“不显著”不等于“没有效应”。" /></h2>
            <dl className={styles.findings}>
              <div><dt><L en="Flat is hard to prove" zh="“平”很难证明" /></dt><dd><L en="H1 and H2 predicted no change. With six people, a non-significant test cannot separate “no effect” from “a small effect we could not detect”. The 95% intervals are about ±0.7 to 0.8 seconds, and H1's p = 0.057 is close to the line. The honest reading is that the data are consistent with preattentive search, not that they prove it." zh="H1 和 H2 预测的是“没有变化”。只有六个人，一个不显著的检验分不清“真的没有效应”和“有个小效应但没测出来”。95% 区间大约是 ±0.7 到 0.8 秒，H1 的 p = 0.057 也离界线很近。更诚实的说法是：数据与前注意搜索相符，而不是证明了它。" /></dd></div>
              <div><dt><L en="A step, not a steady climb" zh="是台阶，不是匀速爬升" /></dt><dd><L en="In the combined condition the slowdown arrives between 9 and 25 items and then flattens (5.4 s to 5.6 s). A steady climb is what a one-by-one scan predicts, and a straight line fits poorly (r = 0.29 over all trials). One trial took 29.5 seconds; the median is 3.3 s against a mean of 4.5 s." zh="叠加条件里，变慢发生在 9 个到 25 个之间，之后趋于平缓（5.4 秒到 5.6 秒）。逐个扫描应该是匀速上升，而直线拟合得不好（全部试验 r = 0.29）。有一次试验用了 29.5 秒；中位数是 3.3 秒，均值是 4.5 秒。" /></dd></div>
              <div><dt><L en="Uncontrolled setting" zh="没有受控的环境" /></dt><dd><L en="Participants used their own laptops, so screen size, resolution and refresh rate varied, and lighting and fatigue could not be controlled. They were classmates and friends with normal vision, so the sample says little about people in general." zh="被试用各自的笔记本，屏幕尺寸、分辨率和刷新率不一致，光线和疲劳程度也无法控制。他们是视力正常的同学和朋友，所以这个样本对更广泛的人群说明不了太多。" /></dd></div>
            </dl>
            <p className={styles.small}><L en="Note on numbers: this page recomputes the figures from the team's trial log (270 rows) and the analysis notebook. The linear-fit correlation for the combined condition is reported as r = 0.29 over all trials (0.48 on participant means), not the higher value in an earlier draft of the report." zh="关于数字：本页的数字是根据团队的试验记录（270 行）和分析 notebook 重新计算的。叠加条件的线性相关，按全部试验算是 r = 0.29（按被试均值算是 0.48），而不是报告早期稿里更高的那个值。" /></p>
          </section>

          <section id="next"><p className={styles.eyebrow}><L en="05 / Next steps + scope" zh="05 / 下一步与范围" /></p><h2><L en="What a better version would change." zh="更好的版本会改什么。" /></h2>
            <p><L en="More participants would let object count be counterbalanced with a Latin square as well, and would give the “flat” hypotheses a real chance of being tested. A lab session with one screen, a fixed refresh rate and controlled lighting would remove the hardware noise." zh="更多被试，才能对物体数量也用拉丁方来平衡顺序，也才能让“平”的假设得到真正的检验。在实验室里用同一块屏幕、固定的刷新率和受控的光线，可以去掉硬件带来的噪声。" /></p>
            <h3><L en="What I took from this" zh="我从中学到的" /></h3>
            <p><L en="The rigour an experiment asks for: settle the conditions and their order before collecting anything, and claim only what the data can carry." zh="学到了实验的严谨：数据收集之前，先把条件和顺序定好；结论只写数据撑得起的部分。" /></p>
            <div className={styles.scope}><h3><L en="Scope" zh="范围" /></h3><p><L en="This was a small course experiment: six participants, and a web page rather than lab equipment. It is a worked example of designing, running and analysing a within-subject experiment, not a general claim about visual perception." zh="这是一个小型课程实验：六位被试、一个网页而不是实验室设备。它是“设计、实施并分析一个被试内实验”的完整练习，不是关于视觉感知的普遍结论。" /></p></div>
          </section>
        </article>
      </div>
      <footer className={styles.footer}><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#vs-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a><p><L en="Visual Search Experiment · Experimental Design & Analysis" zh="视觉搜索实验 · 实验设计与分析" /></p></footer>
    </main>
  </div>;
}
