/**
 * What little Peiwen says (2026-09-25, phase 1: preset questions only, no AI).
 *
 * Every answer is first person, short, and grounded in what the site already says
 * (lib/experience.ts, lib/projectsData.ts, the About book). The personal answers
 * (what I'm like, favorite project, why HCI, what's not in the portfolio, where to
 * start) were confirmed or rewritten by Peiwen on 2026-09-25.
 *
 * Typed questions ("Ask me anything…") are matched locally against each answer's
 * keywords — no AI, no server. Peiwen chose this on purpose: little Peiwen only talks
 * about Peiwen and this site. Anything that doesn't match gets a gentle "I only know
 * about me and this little world" plus a few questions to try.
 *
 * Bilingual (2026-09-27, Peiwen's decision): little Peiwen's lines are now translated
 * too, alongside the reading content — every question/answer/action carries an *Zh
 * counterpart, shown via <L>/useLang() the same way as the rest of the site.
 */

export const COMPANION_EMAIL = "peiwen.zhang@universite-paris-saclay.fr";

export type CompanionAction =
  | { kind: "copy-email"; label: string; labelZh: string }
  | { kind: "link"; href: string; label: string; labelZh: string }
  /** a file to download (the CVs in public/cv) */
  | { kind: "download"; href: string; filename: string; label: string; labelZh: string }
  /** jump to another answer (used by the "try one of these" fallback) */
  | { kind: "ask"; id: string; label: string; labelZh: string };

export type CompanionAnswer = {
  id: string;
  /** chip label: short, how a visitor would actually ask it */
  question: string;
  questionZh: string;
  answer: string[];
  answerZh: string[];
  actions?: CompanionAction[];
  /** lower-case words / phrases that point a typed question here */
  keywords: string[];
  /** answers that only come up from typed questions, not as a chip */
  hidden?: boolean;
};

export const COMPANION_GREETING = "Hi, I’m little Peiwen! What would you like to know?";
export const COMPANION_GREETING_ZH = "嗨，我是小佩文！想知道点什么？";

export const COMPANION_ANSWERS: CompanionAnswer[] = [
  {
    id: "start",
    question: "Where should I start?",
    questionZh: "我该从哪里开始看？",
    answer: [
      "If it’s your first time here, play with the things on my desk. Each one opens a different corner of my world.",
      "If you only have five minutes, take a walk through my Experience.",
      "And if you’re curious about my projects, start with Reso.",
    ],
    answerZh: [
      "如果你是第一次来，可以随便点点我桌上的东西——每一件都通向我世界里不同的角落。",
      "如果只有五分钟，可以去我的「经历」页面走一走。",
      "如果对我的项目感兴趣，可以先看看 Reso。",
    ],
    actions: [
      { kind: "link", href: "/", label: "To the desk →", labelZh: "回到桌面 →" },
      { kind: "link", href: "/experience", label: "Walk with me →", labelZh: "陪我走一走 →" },
      { kind: "link", href: "/projects/reso", label: "Open Reso →", labelZh: "打开 Reso →" },
    ],
    keywords: ["start", "first", "begin", "five minutes", "5 minutes", "quick", "best project", "recommend", "look at", "should i see", "should i read", "where to", "how you design", "your design", "design process", "先看", "推荐", "从哪", "怎么看"],
  },
  {
    id: "cv",
    question: "Where’s your CV?",
    questionZh: "你的简历在哪？",
    answer: [
      "Right here: there’s an English one and a Chinese one, written for different readers.",
      "Pick the one you’d like:",
    ],
    answerZh: [
      "在这里！有英文版和中文版，是分别写给不同读者的。",
      "选一份吧：",
    ],
    actions: [
      { kind: "download", href: "/cv/peiwen-zhang-cv-en.pdf", filename: "Peiwen Zhang - CV.pdf", label: "English CV ↓", labelZh: "英文简历 ↓" },
      { kind: "download", href: "/cv/peiwen-zhang-cv-zh.pdf", filename: "张佩文-简历.pdf", label: "Chinese CV ↓", labelZh: "中文简历 ↓" },
    ],
    keywords: ["cv", "resume", "résumé", "download", "简历"],
  },
  {
    id: "email",
    question: "What’s your email?",
    questionZh: "你的邮箱是什么？",
    answer: [
      COMPANION_EMAIL,
      "I’m looking for a 6-month AI product internship. Tap below to copy my email, I’d love to hear from you.",
    ],
    answerZh: [
      COMPANION_EMAIL,
      "我正在找一份 6 个月的 AI 产品实习——点下面就能复制邮箱，很期待收到你的消息。",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" }],
    keywords: ["email", "e-mail", "mail", "contact", "reach", "write to", "get in touch", "hire", "hiring", "intern", "job", "available", "opportunit", "邮箱", "联系"],
  },
  {
    id: "lately",
    question: "What are you up to lately?",
    questionZh: "你最近在忙什么？",
    answer: [
      "I’m doing my MSc in Human-Computer Interaction at Université Paris-Saclay, learning how people work with AI agents and immersive interfaces.",
      "This year I also spent five months as a product intern at Tantan, running A/B tests and localization research for users in Indonesia, Taiwan and Singapore.",
      "Now I’m looking for a 6-month AI product internship.",
    ],
    answerZh: [
      "我在巴黎萨克雷大学读人机交互硕士，研究人与 AI 智能体、沉浸式界面之间的交互方式。",
      "今年我还在探探做了五个月的产品实习生，为印尼、台湾、新加坡的用户做 A/B 测试和本地化研究。",
      "现在我在找一份 6 个月的 AI 产品实习。",
    ],
    keywords: ["lately", "recent", "now", "currently", "these days", "doing", "study", "studying", "master", "msc", "tantan", "最近", "现在"],
  },
  {
    id: "like",
    question: "What are you like?",
    questionZh: "你是个什么样的人？",
    answer: [
      "Curious about almost everything. And I feel things strongly, connect ideas everywhere, and always have something to say. I want to really take part in life, not just watch it.",
      "I have my own opinions and I love exploring. Honestly, my biggest strength and my biggest trouble come from the same place: I’m a little too interested in people, the world, and myself.",
    ],
    answerZh: [
      "对几乎所有事情都很好奇——感受很强烈，脑子里的想法总能串到一起，也总有话想说。我想真正地参与生活，而不只是旁观。",
      "我有自己的想法，也很喜欢探索。说实话，我最大的优点和最大的麻烦其实来自同一个地方：我对人、对世界、对自己都有点太感兴趣了。",
    ],
    keywords: ["like as a person", "what are you like", "personality", "person", "yourself", "who are you", "character", "strength", "weakness", "性格", "你是谁"],
  },
  {
    id: "favorite",
    question: "Your favorite project?",
    questionZh: "你最喜欢的项目？",
    answer: [
      "Arm-Swing VR, because I made it completely on my own, from the first idea to the working prototype.",
    ],
    answerZh: [
      "Arm-Swing VR——因为它是我从最初的想法到可运行原型完全独立做出来的。",
    ],
    actions: [{ kind: "link", href: "/projects/arm-swing-vr-locomotion", label: "Take a look →", labelZh: "看看这个项目 →" }],
    keywords: ["favorite", "favourite", "proud", "best", "most", "arm-swing", "arm swing", "最喜欢"],
  },
  {
    id: "why-hci",
    question: "Why HCI?",
    questionZh: "为什么选人机交互？",
    answer: [
      "In product work in Beijing I kept noticing that the hard part usually wasn’t the technology. It was whether people could understand it and trust it.",
      "HCI is where I get to study that properly, especially now that we’re all learning to work with AI.",
    ],
    answerZh: [
      "在北京做产品的时候我发现，难的往往不是技术本身，而是人们能不能理解它、信任它。",
      "人机交互正好能让我认真研究这件事，尤其是现在大家都在学习怎么和 AI 一起工作。",
    ],
    keywords: ["why hci", "hci", "human-computer", "human computer", "chose hci", "choose hci", "为什么选"],
  },
  {
    id: "unwritten",
    question: "Something not in the portfolio?",
    questionZh: "作品集里没写的事？",
    answer: [
      "I speak Chinese and English, and I’m learning French now. I’ve lived in Beijing, Osaka and Paris.",
      "And this whole website started as a picture book I wanted to walk around in.",
    ],
    answerZh: [
      "我会说中文和英文，现在在学法语。我在北京、大阪、巴黎都生活过。",
      "这个网站最初的想法，是想做一本可以走进去的绘本。",
    ],
    keywords: ["not in", "secret", "fun fact", "hobby", "hobbies", "language", "languages", "french", "chinese", "english", "speak", "lived", "website", "this site", "picture book", "语言"],
  },
  {
    id: "projects",
    question: "What have you made?",
    questionZh: "你都做过什么？",
    hidden: true,
    keywords: ["project", "projects", "made", "built", "build", "work", "portfolio", "reso", "tangram", "maze", "music", "flight", "chess", "zoo", "作品", "项目"],
    answer: [
      "Eight things so far: Reso, Arm-Swing VR, Tangram, Music VR, Maze of Wishes, Flight Booking, Chess and the ZOO Organizer.",
      "They’re all hanging in the attic. Come and have a look.",
    ],
    answerZh: [
      "目前一共八个项目：Reso、Arm-Swing VR、七巧板、Music VR、愿望迷宫、机票预订、国际象棋，还有 ZOO Organizer。",
      "它们都挂在阁楼里——来看看吧。",
    ],
    actions: [{ kind: "link", href: "/projects", label: "Go to Projects →", labelZh: "去项目页 →" }],
  },
  {
    id: "experience",
    question: "Where have you worked?",
    questionZh: "你都在哪里工作过？",
    hidden: true,
    keywords: ["experience", "worked", "work experience", "internship", "internships", "job", "company", "companies", "product manager", "pm", "huashun", "yundao", "beijing", "background", "经历", "实习"],
    answer: [
      "I’m doing an MSc in Human-Computer Interaction at Université Paris-Saclay, and this year I was a product intern at Tantan.",
      "Before that I did product work in Beijing at Huashun Xin’an and Yundao Zhizao, and a VR research exchange at Osaka University.",
    ],
    answerZh: [
      "我在巴黎萨克雷大学读人机交互硕士，今年在探探做过产品实习生。",
      "在那之前我在北京的华顺信安和云道智造做过产品，也曾在大阪大学做过 VR 研究交流。",
    ],
    actions: [{ kind: "link", href: "/experience", label: "Walk with me →", labelZh: "陪我走一走 →" }],
  },
  {
    id: "osaka",
    question: "What did you do in Osaka?",
    questionZh: "你在大阪做了什么？",
    hidden: true,
    keywords: ["osaka", "japan", "vr", "xr", "virtual reality", "immersive", "autism", "unity", "accessibility", "日本", "大阪"],
    answer: [
      "In 2023 I joined a research exchange at Osaka University, where our team built a VR tool for children with autism.",
      "I made every touch on a virtual object give feedback in Unity, and designed calm, gentle sounds for it.",
    ],
    answerZh: [
      "2023 年我在大阪大学参加了一个研究交流项目，我们团队为自闭症儿童做了一个 VR 工具。",
      "我在 Unity 里让每一次触碰虚拟物体都有反馈，还为它设计了平静、温柔的声音。",
    ],
    actions: [{ kind: "link", href: "/experience", label: "See the journey →", labelZh: "看看这段经历 →" }],
  },
  {
    id: "skills",
    question: "What are your skills?",
    questionZh: "你会些什么技能？",
    hidden: true,
    keywords: ["skill", "skills", "tool", "tools", "good at", "can you", "sql", "tableau", "axure", "coding", "program", "research", "a/b", "ab test", "技能", "会什么"],
    answer: [
      "Product: user research and experiment design, A/B testing, requirements and PRDs, prototyping in Axure and Figma.",
      "Data and AI: SQL, Python and Tableau, and designing AI agents and their tools (MCP), plus VR prototyping in Unity (C#).",
      "My projects show these best.",
    ],
    answerZh: [
      "产品方面：用户研究和实验设计、A/B 测试、需求分析和 PRD、用 Axure 和 Figma 做原型。",
      "数据和 AI 方面：SQL、Python、Tableau，设计 AI 智能体和它的工具（MCP）——也会用 Unity（C#）做 VR 原型。",
      "这些在我的项目里体现得最清楚。",
    ],
    actions: [{ kind: "link", href: "/projects", label: "See my projects →", labelZh: "看看我的项目 →" }],
  },
  {
    id: "where",
    question: "Where are you?",
    questionZh: "你现在在哪？",
    hidden: true,
    keywords: ["where are you", "where do you live", "location", "live", "based", "paris", "france", "city", "在哪"],
    answer: ["I’m in Paris right now, studying at Université Paris-Saclay. I’ve also lived in Beijing and Osaka."],
    answerZh: ["我现在在巴黎，在巴黎萨克雷大学读书。之前也在北京和大阪生活过。"],
  },
  {
    id: "github",
    question: "Do you have GitHub?",
    questionZh: "你有 GitHub 吗？",
    hidden: true,
    keywords: ["github", "git", "code", "repository", "repo", "source"],
    answer: ["Yes, here’s my GitHub."],
    answerZh: ["有的——这是我的 GitHub。"],
    actions: [{ kind: "link", href: "https://github.com/peiwenZHANG-git", label: "Open GitHub →", labelZh: "打开 GitHub →" }],
  },
  {
    id: "linkedin",
    question: "Are you on LinkedIn?",
    questionZh: "你有领英吗？",
    hidden: true,
    keywords: ["linkedin", "linked in", "领英"],
    answer: ["Yes, here’s my LinkedIn."],
    answerZh: ["有的——这是我的领英。"],
    actions: [{ kind: "link", href: "https://www.linkedin.com/in/peiwen-zhang-hci", label: "Open LinkedIn →", labelZh: "打开领英 →" }],
  },
];

/** what she says when a typed question doesn't match anything she knows */
export const COMPANION_FREEFORM = {
  answer: [
    "Hmm, I only know about me and this little world!",
    "Try one of these, or write to the real me.",
  ],
  answerZh: [
    "嗯……我只了解我自己和这个小世界哦！",
    "可以试试下面这些问题——或者直接写信给真正的我。",
  ],
  actions: [
    { kind: "ask", id: "start", label: "Where should I start?", labelZh: "我该从哪里开始看？" },
    { kind: "ask", id: "projects", label: "What have you made?", labelZh: "你都做过什么？" },
    { kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" },
  ] as CompanionAction[],
};

/** find the answer a typed question is most likely asking for (null: no idea) */
export function matchCompanionAnswer(text: string): CompanionAnswer | null {
  const q = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}/+-]+/gu, " ").trim()} `;
  let best: CompanionAnswer | null = null;
  let bestScore = 0;
  for (const a of COMPANION_ANSWERS) {
    let score = 0;
    for (const k of a.keywords) {
      if (!q.includes(k)) continue;
      // longer, more specific phrases count more than single short words
      score += k.includes(" ") || k.length > 6 ? 3 : k.length <= 3 && /^[a-z]+$/.test(k) && !q.includes(` ${k} `) ? 0 : 2;
    }
    if (score > bestScore) {
      best = a;
      bestScore = score;
    }
  }
  return best;
}

export type CompanionPageLine = { en: string; zh: string };

/** What little Peiwen says to herself when a visitor arrives on a page — a small
    guide to how that page works. `touch` swaps "drag/click" for "swipe/tap". */
export function companionPageLine(pathname: string, touch: boolean): CompanionPageLine | null {
  if (pathname === "/projects") {
    return touch
      ? {
          en: "The big projects hang on the top line, the small ones below. Swipe to look around, and tap one to peek inside!",
          zh: "大项目挂在上面一排，小项目在下面。滑动看看四周，点一个进去瞧瞧！",
        }
      : {
          en: "The big projects hang on the top line, the small ones below. Drag to look around, and click one to peek inside!",
          zh: "大项目挂在上面一排，小项目在下面。拖动看看四周，点一个进去瞧瞧！",
        };
  }
  if (pathname.startsWith("/projects/"))
    return { en: "Scroll down for the whole story of this one.", zh: "往下滑，看看这个项目完整的故事。" };
  if (pathname === "/experience") {
    return touch
      ? {
          en: "Walk with me! Swipe along the road, or tap a keepsake to jump to a city.",
          zh: "陪我走一走！沿着这条路滑动，或者点一件纪念品直接跳到那座城市。",
        }
      : {
          en: "Walk with me! Use ← → to walk along the road, or click a keepsake to jump to a city.",
          zh: "陪我走一走！用 ← → 沿路走，或者点一件纪念品直接跳到那座城市。",
        };
  }
  if (pathname === "/about")
    return { en: "Turn the pages with the arrows on either side: three spreads, all about me.", zh: "用两侧的箭头翻页——一共三页，都是关于我的。" };
  return null;
}

/** the default "psst… ask me!" hint, for pages without their own companionPageLine */
export const COMPANION_PSST: CompanionPageLine = { en: "psst… ask me!", zh: "嘘…来问我吧！" };
