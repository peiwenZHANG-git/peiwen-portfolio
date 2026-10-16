import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bodyFont, handFont } from "../../about/fonts";
import shell from "../shell.module.css";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import styles from "./ai-work.module.css";

export const metadata: Metadata = {
  title: "AI-Work: Keep the human in control · Peiwen Zhang",
  description: "A personal project: a local Windows assistant (42 MCP tools) that acts on my own mail, files, apps and browser, designed so that I stay in control.",
};

/* Added 2026-10-16. Same structure and styles as the Reso case study (reso.module.css
   was copied, plus .heroShot and .rules). Only facts Peiwen supplied are used: no
   invented metrics, quotes or features. The one screenshot is Peiwen's own capture of
   the AI-Work mail page (her address blurred). */

const GITHUB = "https://github.com/peiwenZHANG-git/AI-Work";

export default function AiWorkPage() {
  return <div className={`${shell.shell} ${handFont.variable} ${bodyFont.variable} ${styles.root}`} tabIndex={-1}>
    <a className={shell.skipLink} href="#ai-work-content"><L en="Skip to case study" zh="跳到项目正文" /></a>
    <SiteHeader current="projects" />
    <main id="ai-work-content" className={styles.main} tabIndex={-1}>
      <Link className={styles.back} href="/projects"><L en="← Back to the attic" zh="← 回到阁楼" /></Link>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><L en="AI-Work · 2026 · AI agents / Human-in-the-loop" zh="AI-Work · 2026 · AI 智能体 / 人在回路中" /></p>
          <h1><L en="Keep the human in control." zh="让人始终掌控。" /></h1>
          <p className={styles.lead}><L en="A local Windows assistant (42 MCP tools) that acts on my own mail, files, apps and browser, designed so that I stay in control."
            zh="一个运行在 Windows 本地的助手（42 个 MCP 工具），能操作我自己的邮件、文件、应用和浏览器，设计目标是让我始终掌控它。" /></p>
          <p className={styles.annotation}><L en="More capable is not the same as more trustworthy." zh="更强，不等于更可信。" /></p>
          <a className={styles.jump} href="#rules"><L en="Read the product rules ↓" zh="直接看产品规则 ↓" /></a>
        </div>
        <figure className={styles.heroShot}>
          <a href="/assets/projects/ai-work/draft-preview.webp" aria-label="Open full-size image: AI-Work mail page with a generated draft">
            <Image src="/assets/projects/ai-work/draft-preview.webp" width={1600} height={834} priority
              alt="AI-Work’s mail page: on the left, the instruction for the email; on the right, the generated draft with separate buttons to save it as a draft or to save and prepare to send"
              sizes="(max-width: 700px) 92vw, 640px" />
          </a>
          <figcaption><L en="AI-Work’s mail page. I describe the email, it writes a draft, and saving and sending are separate steps. My email address is blurred."
            zh="AI-Work 的邮件页面：我描述想写的邮件，它生成草稿；保存和发送是分开的两步。截图里我的邮箱地址做了模糊处理。" /></figcaption>
        </figure>
      </header>

      <section className={styles.overview} aria-labelledby="overview">
        <h2 id="overview"><L en="At a glance" zh="项目概览" /></h2>
        <dl className={styles.facts}>
          <div><dt><L en="Context" zh="背景" /></dt><dd><L en={<>Personal project<br />Aug – Sep 2026</>} zh={<>个人项目<br />2026 年 8 月 – 9 月</>} /></dd></div>
          <div><dt><L en="My role" zh="我的角色" /></dt><dd><L en="Defined the product, wrote the requirements and acceptance criteria, wrote the remote-access threat model, directed AI coding tools (Codex, Claude Code) to implement it, and reviewed every change against the acceptance criteria."
            zh="定义产品，写需求和验收标准，写远程访问威胁模型，指挥 AI 编程工具（Codex、Claude Code）实现，并按验收标准逐项审查每一处改动。" /></dd></div>
          <div><dt><L en="Links" zh="链接" /></dt><dd><a href={GITHUB} target="_blank" rel="noopener noreferrer"><L en="Code on GitHub ↗" zh="GitHub 上的代码 ↗" /></a></dd></div>
        </dl>
        <p className={styles.small}><L en="A personal project, not a team or commercial product. It has not been released, and I am its only user."
          zh="这是个人项目，不是团队项目，也不是商业产品。它没有发布，唯一的用户是我自己。" /></p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.contents}>
          <nav aria-label="Case study chapters">
            <p className={styles.eyebrow}><L en="Inside the project" zh="项目目录" /></p>
            <a href="#problem"><L en="01 · The problem" zh="01 · 问题" /></a>
            <a href="#rules"><L en="02 · Product rules" zh="02 · 产品规则" /></a>
            <a href="#built"><L en="03 · How it was built" zh="03 · 怎么做出来的" /></a>
            <a href="#validation"><L en="04 · Validation" zh="04 · 验证" /></a>
            <a href="#reflection"><L en="05 · Reflection" zh="05 · 反思" /></a>
            <a href="#evidence"><L en="06 · Where the evidence stops" zh="06 · 证据到哪里为止" /></a>
          </nav>
        </aside>
        <article className={styles.story} aria-label="AI-Work case study">
          <section id="problem">
            <p className={styles.eyebrow}><L en="01 / The problem" zh="01 / 问题" /></p>
            <h2><L en="Useful, but hard to trust." zh="很有用，却很难信任。" /></h2>
            <p><L en="An AI agent that can act directly on my mail, files, apps and browser is genuinely useful. It is also hard to trust."
              zh="一个能直接操作我的邮件、文件、应用和浏览器的 AI 智能体，确实很有用，但也很难让人信任。" /></p>
            <p className={styles.note}><L en={<><strong>The problem is not capability. It is control.</strong> The question is not what the agent can do, but whether the person stays in charge of it.</>}
              zh={<><strong>问题不在能力，而在控制感。</strong>关键不是它能做什么，而是人能不能一直掌控它。</>} /></p>
            <figure className={styles.diagram} aria-label="Where AI-Work sits: between the AI and my mail, files, apps and browser, with me confirming or stopping">
              <div className={styles.chain}>
                <div className={styles.node}><span className={styles.nodeTitle}><L en="The AI" zh="AI" /></span><span className={styles.nodeSub}><L en="asks to do something" zh="提出要做的事" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={`${styles.node} ${styles.nodeKey}`}><span className={styles.nodeTitle}>AI-Work</span><span className={styles.nodeSub}><L en="42 MCP tools + the product rules" zh="42 个 MCP 工具 + 产品规则" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={styles.node}><span className={styles.nodeTitle}><L en="My computer" zh="我的电脑" /></span><span className={styles.nodeSub}><L en="mail · files · apps · browser" zh="邮件 · 文件 · 应用 · 浏览器" /></span></div>
              </div>
              <p className={styles.human}><span aria-hidden="true">↑</span> <L en="Me, at the computer: I confirm, or I stop it." zh="我在电脑前：确认，或者叫停。" /></p>
              <figcaption><L en="Where AI-Work sits. Every action passes through its rules before it reaches my computer." zh="AI-Work 所处的位置：每个操作都要先过它的规则，才能碰到我的电脑。" /></figcaption>
            </figure>
          </section>

          <section id="rules">
            <p className={styles.eyebrow}><L en="02 / Product rules" zh="02 / 产品规则" /></p>
            <h2><L en="Safety, written as product rules." zh="把安全要求写成产品规则。" /></h2>
            <p><L en="I turned the safety requirements into four rules the product must follow."
              zh="我把安全要求写成了产品必须遵守的四条规则。" /></p>
            <ol className={styles.rules} aria-label="AI-Work product rules">
              <li><span>01</span><div><strong><L en="Read-only by default" zh="默认只读" /></strong><p><L en="By default, it can only read." zh="默认情况下，它只能读取。" /></p></div></li>
              <li><span>02</span><div><strong><L en="Draft first, then confirm" zh="先存草稿，再确认" /></strong><p><L en="An email is saved as a draft and sent only after I explicitly confirm it." zh="邮件先存为草稿，经过我明确的二次确认后才发送。" /></p></div></li>
              <li><span>03</span><div><strong><L en="No overwrite, no delete" zh="不覆盖，不删除" /></strong><p><L en="Files are never overwritten or deleted." zh="文件不会被覆盖，也不会被删除。" /></p></div></li>
              <li><span>04</span><div><strong><L en="Fail closed" zh="拿不准就拒绝" /></strong><p><L en="When it cannot tell whether an action is safe, it refuses." zh="无法判断一个操作是否安全时，它拒绝执行。" /></p></div></li>
            </ol>
            <figure className={styles.shot}>
              <a href="/assets/projects/ai-work/mail-search.webp" aria-label="Open full-size image: AI-Work cross-mailbox search">
                <Image src="/assets/projects/ai-work/mail-search.webp" width={1600} height={647}
                  alt="AI-Work’s cross-mailbox search, marked read-only and metadata only, with the option to search the local summary without opening the mailbox websites, showing two school notices"
                  sizes="(max-width: 700px) 92vw, 850px" />
              </a>
              <figcaption><L en="Rule 01 in practice: searching across my mailboxes is read-only. It searches the local summary’s metadata and does not open the mailbox websites."
                zh="规则 01 的实际样子：跨邮箱搜索是只读的，只搜本地摘要里的元数据，不打开邮箱网站。" /></figcaption>
            </figure>
            <figure className={styles.diagram} aria-label="Sending an email: the AI writes a draft, the draft is saved, and it is sent only if I confirm">
              <div className={styles.chain}>
                <div className={styles.node}><span className={styles.nodeTitle}><L en="1 · AI writes" zh="1 · AI 写" /></span><span className={styles.nodeSub}><L en="a draft from my instruction" zh="按我的指令写出草稿" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={styles.node}><span className={styles.nodeTitle}><L en="2 · Saved as a draft" zh="2 · 存为草稿" /></span><span className={styles.nodeSub}><L en="nothing has been sent" zh="什么都还没发出去" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={`${styles.node} ${styles.nodeKey}`}><span className={styles.nodeTitle}><L en="3 · I confirm" zh="3 · 我确认" /></span><span className={styles.nodeSub}><L en="only then is it sent" zh="这时才会发送" /></span></div>
              </div>
              <p className={styles.human}><span aria-hidden="true">↳</span> <L en="No confirmation, no email." zh="我不确认，邮件就不会发。" /></p>
              <figcaption><L en="Rule 02 in practice: writing and sending are two separate steps." zh="规则 02 的实际流程：写和发是分开的两步。" /></figcaption>
            </figure>
          </section>

          <section id="built">
            <p className={styles.eyebrow}><L en="03 / How it was built" zh="03 / 怎么做出来的" /></p>
            <h2><L en="I wrote the rules. AI tools wrote the code." zh="规则我来写，代码交给 AI。" /></h2>
            <p><L en="I wrote the requirements, the acceptance criteria and the remote-access threat model. Codex and Claude Code worked as my development team, and I reviewed every change they made against the acceptance criteria."
              zh="需求、验收标准和远程访问威胁模型由我来写。Codex 和 Claude Code 是我的开发团队，它们做的每一处改动，我都按验收标准逐项审查。" /></p>
            <figure className={styles.diagram} aria-label="The review loop: I write the criteria, the AI tools implement, I review each change; a change that does not meet the criteria goes back">
              <div className={styles.chain}>
                <div className={`${styles.node} ${styles.nodeKey}`}><span className={styles.nodeTitle}><L en="I write the criteria" zh="我写验收标准" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={styles.node}><span className={styles.nodeTitle}><L en="Codex · Claude Code" zh="Codex · Claude Code" /></span><span className={styles.nodeSub}><L en="implement" zh="实现" /></span></div>
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={`${styles.node} ${styles.nodeKey}`}><span className={styles.nodeTitle}><L en="I review each change" zh="我审查每一处改动" /></span><span className={styles.nodeSub}><L en="against the criteria" zh="对照验收标准" /></span></div>
              </div>
              <p className={styles.human}><span aria-hidden="true">↺</span> <L en="Doesn’t meet the criteria? It goes back to the AI tools." zh="不符合标准？退回给 AI 工具重做。" /></p>
              <figcaption><L en="How each change was accepted." zh="每一处改动是怎么被接受的。" /></figcaption>
            </figure>
            <p className={styles.contribution}><L en={<><strong>My role:</strong> product definition, requirements, acceptance criteria, the threat model, and review. The code was written by AI coding tools.</>}
              zh={<><strong>我的角色：</strong>定义产品、写需求和验收标准、写威胁模型，以及审查。代码由 AI 编程工具编写。</>} /></p>
          </section>

          <section id="validation">
            <p className={styles.eyebrow}><L en="04 / Validation" zh="04 / 验证" /></p>
            <h2><L en="Checked against real scenarios." zh="用真实场景来验收。" /></h2>
            <div className={styles.numbers}>
              <div className={styles.resultInsight}>
                <strong>9</strong>
                <p className={styles.resultLabel}><L en="real-world acceptance scenarios" zh="个真实场景验收" /></p>
              </div>
              <div className={styles.resultInsight}>
                <strong>694</strong>
                <p className={styles.resultLabel}><L en="automated tests, all passing" zh="项自动化测试，全部通过" /></p>
              </div>
              <div className={styles.resultInsight}>
                <strong>3</strong>
                <p className={styles.resultLabel}><L en="real mailboxes in daily use" zh="个真实邮箱日常在用" /></p>
              </div>
            </div>
            <p className={styles.small}><L en="These checks verify that the features work and that the rules hold. They are not a user-experience evaluation."
              zh="这些检查验证的是功能能用、规则守得住，不是用户体验评估。" /></p>
            <figure className={styles.shot}>
              <a href="/assets/projects/ai-work/system-status.webp" aria-label="Open full-size image: AI-Work status page">
                <Image src="/assets/projects/ai-work/system-status.webp" width={1600} height={607}
                  alt="AI-Work’s status page with six checks: MCP, credentials and the mail assistant pass, the daily digest fails, and the browser and Remote checks show unknown"
                  sizes="(max-width: 700px) 92vw, 850px" />
              </a>
              <figcaption><L en="AI-Work’s status page. Each check reports PASS, FAIL or UNKNOWN. When a check can’t be run safely, it says UNKNOWN instead of guessing. The FAIL is real: one mailbox couldn’t be read that day."
                zh="AI-Work 的系统状态页：每项检查显示 PASS、FAIL 或 UNKNOWN。没法安全检测的项目就显示 UNKNOWN，不去猜。图里的 FAIL 是真实情况：那天有一个邮箱没读取成功。" /></figcaption>
            </figure>
          </section>

          <section id="reflection">
            <p className={styles.eyebrow}><L en="05 / Reflection" zh="05 / 反思" /></p>
            <h2><L en="More capable is not the same as more trustworthy." zh="更强，不等于更可信。" /></h2>
            <p><L en="This project made me realise that making an AI more capable and making it more trustworthy are two different jobs. The interface and the rules have to let the person see what it is doing, and stop it."
              zh="这个项目让我意识到：让 AI 更强，和让 AI 更可信，是两件事。界面和规则要让用户看得懂、能叫停。" /></p>
            <p className={styles.pencilNote}><span aria-hidden="true">↳</span> <L en="See it. Stop it." zh="看得懂，能叫停。" /></p>
          </section>

          <section id="evidence">
            <p className={styles.eyebrow}><L en="06 / Limitations" zh="06 / 局限" /></p>
            <h2><L en="Where the evidence stops" zh="证据到哪里为止" /></h2>
            <ul>
              <li><L en="This is a personal project. I did no user research or usability testing, so I make no claim that it works for other people." zh="这是个人项目，没有做用户研究或可用性测试，所以不声称它对其他用户有效。" /></li>
              <li><L en="The 9 acceptance scenarios and 694 tests verify function and safety. They are not a user-experience evaluation." zh="9 个验收场景和 694 项测试验证的是功能和安全，不是用户体验评估。" /></li>
              <li><L en="Daily use means my own 3 mailboxes." zh="日常使用指的是我自己的 3 个邮箱。" /></li>
            </ul>
          </section>
          <footer className={styles.footer}><p><L en="AI-Work · Personal project · 2026" zh="AI-Work · 个人项目 · 2026" /></p><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#ai-work-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a></footer>
        </article>
      </div>
    </main>
  </div>;
}
