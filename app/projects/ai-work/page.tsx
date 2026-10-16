import type { Metadata } from "next";
import type { ReactNode } from "react";
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
   was copied, plus .pending and .rules). Only facts Peiwen supplied are used: no
   invented metrics, quotes, screenshots or features. Images are clearly marked
   placeholders until she provides real screenshots. */

const GITHUB = "https://github.com/peiwenZHANG-git/AI-Work";

function Pending({ children }: { children: ReactNode }) {
  return <figure className={styles.pendingFigure}>
    <div className={styles.pending} role="img" aria-label="Screenshot pending">
      <span><L en="Screenshot pending" zh="截图待补" /></span>
    </div>
    <figcaption>{children}</figcaption>
  </figure>;
}

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
        <Pending><L en="A screenshot or short demo of AI-Work will go here." zh="这里之后会放 AI-Work 的截图或简短演示。" /></Pending>
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
            <Pending><L en="A screenshot of the draft-then-confirm step will go here." zh="这里之后会放“先存草稿、再确认发送”这一步的截图。" /></Pending>
          </section>

          <section id="built">
            <p className={styles.eyebrow}><L en="03 / How it was built" zh="03 / 怎么做出来的" /></p>
            <h2><L en="I wrote the rules. AI tools wrote the code." zh="规则我来写，代码交给 AI。" /></h2>
            <ol className={styles.flow} aria-label="How AI-Work was built">
              <li><span>01</span><L en="Requirements and acceptance criteria" zh="需求和验收标准" /></li>
              <li><span>02</span><L en="Remote-access threat model" zh="远程访问威胁模型" /></li>
              <li><span>03</span><L en="Codex and Claude Code implement" zh="Codex 和 Claude Code 实现" /></li>
              <li><span>04</span><L en="I review every change against the criteria" zh="我按验收标准逐项审查每一处改动" /></li>
            </ol>
            <p><L en="I wrote the requirements, the acceptance criteria and the remote-access threat model. Codex and Claude Code worked as my development team, and I reviewed every change they made against the acceptance criteria."
              zh="需求、验收标准和远程访问威胁模型由我来写。Codex 和 Claude Code 是我的开发团队，它们做的每一处改动，我都按验收标准逐项审查。" /></p>
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
                <strong>631</strong>
                <p className={styles.resultLabel}><L en="automated tests" zh="项自动化测试" /></p>
              </div>
              <div className={styles.resultInsight}>
                <strong>3</strong>
                <p className={styles.resultLabel}><L en="real mailboxes in daily use" zh="个真实邮箱日常在用" /></p>
              </div>
            </div>
            <p className={styles.small}><L en="These checks verify that the features work and that the rules hold. They are not a user-experience evaluation."
              zh="这些检查验证的是功能能用、规则守得住，不是用户体验评估。" /></p>
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
              <li><L en="The 9 acceptance scenarios and 631 tests verify function and safety. They are not a user-experience evaluation." zh="9 个验收场景和 631 项测试验证的是功能和安全，不是用户体验评估。" /></li>
              <li><L en="Daily use means my own 3 mailboxes." zh="日常使用指的是我自己的 3 个邮箱。" /></li>
            </ul>
          </section>
          <footer className={styles.footer}><p><L en="AI-Work · Personal project · 2026" zh="AI-Work · 个人项目 · 2026" /></p><Link href="/projects"><L en="← Back to projects" zh="← 回到项目" /></Link><a href="#ai-work-content"><L en="Back to top ↑" zh="回到顶部 ↑" /></a></footer>
        </article>
      </div>
    </main>
  </div>;
}
