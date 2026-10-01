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
      "I’m looking for a 6-month AI product internship, starting March 2027. Tap below to copy my email, I’d love to hear from you.",
    ],
    answerZh: [
      COMPANION_EMAIL,
      "我正在找一份 6 个月的 AI 产品实习，2027 年 3 月可以开始——点下面就能复制邮箱，很期待收到你的消息。",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" }],
    keywords: ["email", "e-mail", "mail", "contact", "reach", "write to", "get in touch", "hire", "hiring", "intern", "job", "available", "opportunit", "邮箱", "联系"],
  },
  // Added 2026-10-01 from Peiwen's "interview" (drafted by Claude, confirmed by Peiwen).
  // All hidden: they come up from typed questions, so the chip menu stays as it was.
  {
    id: "looking",
    question: "What kind of role are you looking for?",
    questionZh: "你在找什么样的工作？",
    hidden: true,
    answer: [
      "A 6-month AI product manager internship in Paris, as the final internship of my master’s. I can start in March 2027.",
      "If your team is building AI products, I’d love to talk!",
    ],
    answerZh: [
      "我在找一份 6 个月的 AI 产品经理实习，地点在巴黎，作为硕士第二年的毕业实习，2027 年 3 月可以开始。",
      "如果你们团队在做 AI 产品，很想聊聊！",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" }],
    keywords: ["looking for", "what role", "which role", "kind of role", "internship", "position", "when can you", "start date", "available from", "march", "找什么", "求职", "实习", "入职", "几月"],
  },
  {
    id: "ai-work",
    question: "What is AI-Work?",
    questionZh: "AI-Work 是什么？",
    hidden: true,
    answer: [
      "An AI assistant on my computer that handles my mail, files and browser, with me in control at every step: read-only by default, emails saved as drafts until I confirm, files never deleted.",
      "I use it every day with three real mailboxes.",
    ],
    answerZh: [
      "是我做的一个电脑上的 AI 助手，能帮我处理邮件、文件和浏览器，但每一步都在我的掌控里：默认只读，邮件先存草稿、我确认了才发，文件从不删除。",
      "我每天都在用它处理三个真实邮箱。",
    ],
    actions: [{ kind: "link", href: "https://github.com/peiwenZHANG-git/AI-Work", label: "See it on GitHub →", labelZh: "在 GitHub 上看看 →" }],
    keywords: ["ai-work", "ai work", "aiwork", "assistant", "mcp", "agent", "agents", "助手", "智能体"],
  },
  {
    id: "hardest",
    question: "What was the hardest decision in AI-Work?",
    questionZh: "做 AI-Work 最难的决定是什么？",
    hidden: true,
    answer: [
      "Not deciding what the AI can do, but what it must not do.",
      "I stuck to one rule: when it isn’t sure, it does nothing. I’d rather it stop and ask me than guess.",
    ],
    answerZh: [
      "难的不是决定 AI 能做什么，而是决定它不能做什么。",
      "我坚持一条规则：拿不准就不做。宁可让它停下来问我，也不让它猜。",
    ],
    keywords: ["hardest", "difficult", "challenge", "decision", "trade-off", "tradeoff", "最难", "困难", "挑战", "决定"],
  },
  {
    id: "why-pm",
    question: "Why product management, not design or research?",
    questionZh: "为什么想做 AI 产品经理？",
    hidden: true,
    answer: [
      "I’ve done research and I’ve done design, but what I enjoy most is deciding what a product should do, and what it shouldn’t.",
      "With AI that decision matters even more, and it’s where I feel most useful.",
    ],
    answerZh: [
      "研究和设计我都做过，但我最喜欢的，是决定一个产品该做什么、不该做什么。",
      "在 AI 产品里，这个判断更加重要，也是我觉得自己最能发挥作用的地方。",
    ],
    keywords: ["why product", "why pm", "why ai pm", "product manager", "product management", "not design", "designer", "researcher", "为什么做产品", "为什么想做产品", "产品经理"],
  },
  {
    id: "strengths",
    question: "What are your strengths and weaknesses?",
    questionZh: "你的优点和缺点是什么？",
    hidden: true,
    answer: [
      "My strength: I can take a fuzzy problem, break it into clear pieces, and write acceptance criteria that can actually be checked.",
      "Something I’m still working on: my French is only A2, so I’m learning a little more every day.",
    ],
    answerZh: [
      "优点：能把一个模糊的问题拆清楚，再写出真正能检查的验收标准。",
      "还在努力的地方：我的法语还在 A2，每天都在多学一点。",
    ],
    keywords: ["strength", "strengths", "weakness", "weaknesses", "good at", "improve", "working on", "优点", "缺点", "长处", "短板"],
  },
  {
    id: "ai-products",
    question: "Which AI products do you use?",
    questionZh: "你平时用哪些 AI 产品？",
    hidden: true,
    answer: [
      "ChatGPT and Claude, every day: for thinking things through, writing, and building (Claude Code helped me build this website).",
      "Using them so much is also how I learn what makes an AI feel trustworthy, and what doesn’t.",
    ],
    answerZh: [
      "ChatGPT 和 Claude，每天都用：想问题、写东西、做东西（这个网站就是 Claude Code 帮我一起做的）。",
      "用得多了，也让我更清楚什么样的 AI 让人信任，什么样的不会。",
    ],
    keywords: ["chatgpt", "gpt", "gemini", "which ai", "what ai", "ai products do you", "ai do you use", "favorite ai", "favourite ai", "用哪些", "常用", "哪个ai", "哪个 ai"],
  },
  {
    id: "engineers",
    question: "How do you work with engineers?",
    questionZh: "你和工程师意见不一样时怎么办？",
    hidden: true,
    answer: [
      "First we agree on the problem and on how we’ll know it’s solved. After that, a disagreement is usually settled by data or a quick test, not by who argues best.",
    ],
    answerZh: [
      "先对齐要解决的问题，以及怎样算解决了。之后有分歧，通常用数据或一个小测试来定，而不是看谁更会争。",
    ],
    keywords: ["engineer", "engineers", "developer", "developers", "disagree", "disagreement", "conflict", "work with", "工程师", "开发", "分歧", "意见不一样", "冲突"],
  },
  {
    id: "huashun",
    question: "What did you do at HuashunXin’an?",
    questionZh: "你在华顺信安做了什么？",
    hidden: true,
    answer: [
      "I was a product manager intern on FORadar, a tool companies use to keep track of their network assets.",
      "I went from customer interviews to breaking down requirements, prototypes in Axure and PRDs, and followed the work until it shipped. I also helped improve FOEYE 5.0.",
    ],
    answerZh: [
      "我在 FORadar 做产品经理实习生，这是一个帮企业管理网络资产的产品。",
      "我从客户访谈开始，拆需求、用 Axure 画原型、写 PRD，一直跟到版本上线。也参与了 FOEYE 5.0 的优化。",
    ],
    keywords: ["huashun", "huashunxin", "foradar", "foeye", "security", "cybersecurity", "华顺", "信安", "网络安全"],
  },
  {
    id: "yundao",
    question: "What did you do at Yundao Zhizao?",
    questionZh: "你在云道智造做了什么？",
    hidden: true,
    answer: [
      "I was a product intern on Futu 5.0, a simulation software release with 1 new module and 14 new features.",
      "After the electronics cooling module launched, sales grew 32.6%. The changes I pushed for after one-on-one customer interviews went with a 47.5% drop in complaints.",
    ],
    answerZh: [
      "我是伏图 5.0 的产品实习生，这个版本有 1 个新模块、14 个新功能。",
      "电子散热模块上线后销售额增长 32.6%。我在客户一对一访谈后推动的改进，对应投诉率下降了 47.5%。",
    ],
    keywords: ["yundao", "zhizao", "futu", "simulation", "cooling", "complaint", "complaints", "云道", "智造", "伏图", "仿真", "投诉"],
  },
  {
    id: "ab-test",
    question: "Tell me about an A/B test you ran.",
    questionZh: "讲一个 A/B 测试的例子？",
    hidden: true,
    answer: [
      "At Tantan I helped design and follow the A/B test for a zodiac-matching feature: what to compare, which numbers to watch, and when we could trust the result.",
      "I built SQL and Tableau reports on impressions and clicks to keep an eye on it.",
    ],
    answerZh: [
      "在探探，我参与设计并跟进了星座匹配功能的 A/B 测试：比较什么、看哪些数据、什么时候结果才可信。",
      "我用 SQL 和 Tableau 做了曝光和点击的报表来跟进它。",
    ],
    keywords: ["a/b test", "ab test", "a/b", "experiment", "experiments", "zodiac", "astrology", "metrics", "星座", "实验", "ab测试", "a/b测试"],
  },
  {
    id: "visa",
    question: "Do you need a visa? Can you work remote?",
    questionZh: "实习需要签证吗？可以远程吗？",
    hidden: true,
    answer: [
      "I’m a student in France, so the internship only needs an internship agreement (convention de stage) with my university. No extra visa sponsorship.",
      "On-site, hybrid or remote all work for me.",
    ],
    answerZh: [
      "我是在法国读书的学生，实习只需要和学校签实习协议（convention de stage），不需要公司另外办签证。",
      "到岗、混合、远程都可以。",
    ],
    keywords: ["visa", "permit", "sponsor", "sponsorship", "work permit", "remote", "remotely", "work remote", "from home", "hybrid", "on-site", "onsite", "convention", "签证", "居留", "远程", "坐班"],
  },
  {
    id: "future",
    question: "What’s your plan after the internship?",
    questionZh: "实习之后有什么打算？",
    hidden: true,
    answer: [
      "I’d like to start my career in Europe, building AI products. So after the internship, I’ll be looking for a job here first.",
    ],
    answerZh: [
      "我想先在欧洲开始我的职业生涯，做 AI 产品。所以实习之后，我会先试着在欧洲找工作。",
    ],
    keywords: ["after the internship", "after graduation", "future", "long term", "long-term", "plan", "plans", "5 years", "five years", "stay in", "europe", "以后", "未来", "打算", "规划", "毕业后", "留在"],
  },
  {
    id: "mbti",
    question: "What’s your MBTI?",
    questionZh: "你的 MBTI 是什么？",
    hidden: true,
    answer: [
      "ENFJ! Maybe that’s why I care so much about how people feel when they use something.",
    ],
    answerZh: [
      "ENFJ！大概这也是我那么在意人们用东西时感受的原因。",
    ],
    keywords: ["mbti", "enfj", "16 personalities", "personality type", "人格"],
  },
  {
    id: "paris-place",
    question: "Your favourite place in Paris?",
    questionZh: "在巴黎最喜欢的地方？",
    hidden: true,
    answer: [
      "My little studio! It’s small, but it’s where I cook, rest, and make things, like this website.",
    ],
    answerZh: [
      "我的小 studio！虽然不大，但我在这里做饭、休息、做东西，这个网站也是在这里做出来的。",
    ],
    keywords: ["favourite place", "favorite place", "place in paris", "where do you like", "最喜欢的地方", "巴黎最喜欢"],
  },
  {
    id: "movie",
    question: "Your favourite movie?",
    questionZh: "你最喜欢的电影？",
    hidden: true,
    answer: [
      "Titanic! A classic I never get tired of.",
    ],
    answerZh: [
      "《泰坦尼克号》！一部怎么看都不腻的经典。",
    ],
    keywords: ["favourite movie", "favorite movie", "favourite film", "favorite film", "movie", "movies", "film", "films", "titanic", "电影", "泰坦尼克"],
  },
  {
    id: "picture-book",
    question: "Why does this website look like a picture book?",
    questionZh: "为什么网站做成绘本的样子？",
    hidden: true,
    answer: [
      "I wanted people to get to know me the way you leaf through a little book, not the way you read a spreadsheet.",
    ],
    answerZh: [
      "我想让人像翻一本小书一样认识我，而不是看一张表格。",
    ],
    keywords: ["picture book", "picture-book", "illustration", "illustrated", "hand-drawn", "hand drawn", "drawing", "style", "website", "绘本", "手绘", "插画", "风格"],
  },
  {
    id: "who-made",
    question: "Are you real? Who made you?",
    questionZh: "你是真人还是 AI？",
    hidden: true,
    answer: [
      "I’m a little drawn version of Peiwen. She wrote everything I say herself.",
      "Want to talk to the real her? Send her an email!",
    ],
    answerZh: [
      "我是佩文画出来的小分身，我说的每句话都是她亲自写的。",
      "想和真正的她聊聊？给她发封邮件吧！",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" }],
    keywords: ["are you real", "are you ai", "are you an ai", "are you a bot", "bot", "robot", "chatbot", "who made you", "who are you", "real person", "真人", "机器人", "谁做的", "你是谁"],
  },
  {
    id: "what-ask",
    question: "What can I ask you?",
    questionZh: "我可以问你什么？",
    hidden: true,
    answer: [
      "Anything about me! My projects, my experience, the internship I’m looking for, AI-Work, or what I like to do in Paris.",
    ],
    answerZh: [
      "关于我的都可以！我的项目、经历、在找的实习、AI-Work，或者我在巴黎喜欢做什么。",
    ],
    actions: [{ kind: "ask", id: "projects", label: "What have you made?", labelZh: "你都做过什么？" }, { kind: "ask", id: "looking", label: "What role are you looking for?", labelZh: "你在找什么样的工作？" }],
    keywords: ["what can i ask", "what can you", "what do you know", "what should i ask", "help", "能问什么", "可以问什么", "你知道什么"],
  },
  {
    id: "private",
    question: "(age, salary, relationship)",
    questionZh: "（年龄、薪资、感情）",
    hidden: true,
    answer: [
      "That one’s better for a real conversation ☺ Send me an email!",
    ],
    answerZh: [
      "这个当面聊更合适 ☺ 给我发封邮件吧！",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email", labelZh: "复制我的邮箱" }],
    keywords: ["how old", "age", "birthday", "salary", "pay", "boyfriend", "girlfriend", "married", "single", "relationship", "年龄", "几岁", "多大", "生日", "工资", "薪资", "薪水", "男朋友", "女朋友", "对象", "结婚", "单身"],
  },
  {
    id: "ai-tools",
    question: "How do you work with AI coding tools?",
    questionZh: "你怎么和 AI 编程工具合作？",
    hidden: true,
    answer: [
      "Codex and Claude Code write most of the code. I define the problem, set the limits and write the acceptance criteria, then check every change against them.",
      "This website was made the same way: I designed the look and the interactions, and AI helped me build them.",
    ],
    answerZh: [
      "代码主要由 Codex 和 Claude Code 写，我负责定义问题、划定边界、写验收标准，然后对照标准检查每一处改动。",
      "这个网站也是这样做出来的：画面和交互由我设计，AI 帮我实现。",
    ],
    keywords: ["coding", "claude code", "claude", "codex", "vibe", "ai tools", "ai coding", "cursor", "copilot", "make this", "build this", "built this", "this website", "made this", "编程", "写代码", "怎么做的", "ai工具", "ai 工具", "工具"],
  },
  {
    id: "process",
    question: "What’s your product process?",
    questionZh: "你做产品的方法是什么？",
    hidden: true,
    answer: [
      "First I find where real users get stuck, then turn that into clear requirements, test a prototype early, and check with data whether the change worked.",
      "That’s roughly how I worked in all three internships, at Yundao, Huashun and Tantan.",
    ],
    answerZh: [
      "先弄清楚真实用户卡在哪里，再拆成具体需求，用原型尽快试，最后用数据看改得对不对。",
      "在云道、华顺、探探三段实习里，我基本都是按这个顺序做的。",
    ],
    keywords: ["process", "approach", "method", "how do you work", "workflow", "product thinking", "方法", "流程", "怎么做产品"],
  },
  {
    id: "tantan",
    question: "What did you learn at Tantan?",
    questionZh: "在探探学到了什么？",
    hidden: true,
    answer: [
      "That the same feature can mean something completely different in another country.",
      "Users in Indonesia, Taiwan and Singapore differ a lot in language, religion and dating habits, so we made decisions with A/B tests instead of guesses.",
    ],
    answerZh: [
      "学到了同一个功能，在不同国家可能完全是两回事。",
      "印尼、台湾、新加坡的用户在语言、宗教和交友习惯上差别很大，所以我们靠 A/B 测试来做决定，而不是靠猜。",
    ],
    keywords: ["tantan", "探探", "dating", "learn at", "learned at", "localization", "indonesia", "taiwan", "singapore", "学到"],
  },
  {
    id: "good-ai",
    question: "What makes a good AI product?",
    questionZh: "你心中好的 AI 产品是什么样的？",
    hidden: true,
    answer: [
      "One where people can see what it’s doing and stop it at any time.",
      "The more capable AI gets, the more it matters that people can use it with confidence. That’s why I want to be an AI product manager.",
    ],
    answerZh: [
      "让人看得懂它在做什么，也能随时叫停它。",
      "AI 越能干，「人能不能放心用」就越重要。这也是我想做 AI 产品经理的原因。",
    ],
    keywords: ["good ai", "ai product", "good product", "great product", "trust", "believe", "philosophy", "好的 ai", "好的ai", "ai 产品", "ai产品", "信任"],
  },
  {
    id: "reso",
    question: "What is Reso?",
    questionZh: "Reso 是什么？",
    hidden: true,
    answer: [
      "Captions for online meetings that show emotion: the speaker’s tone becomes the colour of the subtitles.",
      "In an 18-person study, people read others’ emotions correctly 63% of the time with it, up from 51%.",
    ],
    answerZh: [
      "一个给线上会议做的「带情绪的字幕」：把说话人的语气和情绪变成字幕颜色。",
      "我们做了 18 人的实验，用了它之后，大家读懂对方情绪的准确率从 51% 提高到了 63%。",
    ],
    actions: [{ kind: "link", href: "/projects/reso", label: "Open Reso →", labelZh: "打开 Reso →" }],
    keywords: ["reso", "caption", "captions", "subtitle", "subtitles", "emotion", "字幕", "情绪"],
  },
  {
    id: "french",
    question: "Do you speak French?",
    questionZh: "你会说法语吗？",
    hidden: true,
    answer: ["I’m learning! I’m at about A2, enough for a little everyday life ☺ At work I use English and Chinese."],
    answerZh: ["在学！现在大概是 A2，日常生活够用一点点 ☺ 工作上我用英语和中文。"],
    keywords: ["french", "français", "francais", "parlez", "speak", "language", "languages", "法语", "语言"],
  },
  {
    id: "why-france",
    question: "Why did you come to France?",
    questionZh: "为什么来法国读书？",
    hidden: true,
    answer: [
      "I’ve always been interested in French culture, and I love human-computer interaction. Studying HCI at Paris-Saclay brought the two together.",
    ],
    answerZh: ["因为我对法国文化一直很感兴趣，又很喜欢人机交互，在巴黎萨克雷读 HCI 正好把两件事放在了一起。"],
    keywords: ["why france", "why paris", "come to france", "study in france", "studying in france", "france", "saclay", "come to paris", "why did you come", "法国", "来巴黎", "为什么来"],
  },
  {
    id: "hobbies",
    question: "What do you do outside work?",
    questionZh: "工作以外你喜欢做什么？",
    hidden: true,
    answer: [
      "Swimming, taking photos, cooking and going somewhere new.",
      "And in Paris, my favourite thing is a bowl of pho or a big steak.",
    ],
    answerZh: ["游泳、拍照、做饭，还有去没去过的地方。", "在巴黎最喜欢的，是吃一碗 pho，或者来一大块牛排。"],
    keywords: ["hobby", "hobbies", "free time", "outside work", "outside of work", "weekend", "fun", "food", "eat", "pho", "steak", "swim", "photo", "cook", "爱好", "好吃", "周末", "吃"],
  },
  {
    id: "lately",
    question: "What are you up to lately?",
    questionZh: "你最近在忙什么？",
    answer: [
      "I’m doing my MSc in Human-Computer Interaction at Université Paris-Saclay, learning how people work with AI agents and immersive interfaces.",
      "This year I also spent five months as a product intern at Tantan, running A/B tests and localization research for users in Indonesia, Taiwan and Singapore.",
      "Now I’m looking for a 6-month AI product internship, starting March 2027.",
    ],
    answerZh: [
      "我在巴黎萨克雷大学读人机交互硕士，研究人与 AI 智能体、沉浸式界面之间的交互方式。",
      "今年我还在探探做了五个月的产品实习生，为印尼、台湾、新加坡的用户做 A/B 测试和本地化研究。",
      "现在我在找一份 6 个月的 AI 产品实习，2027 年 3 月可以开始。",
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
