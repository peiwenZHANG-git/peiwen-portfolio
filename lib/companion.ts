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
 */

export const COMPANION_EMAIL = "peiwen.zhang@universite-paris-saclay.fr";

export type CompanionAction =
  | { kind: "copy-email"; label: string }
  | { kind: "link"; href: string; label: string }
  /** jump to another answer (used by the "try one of these" fallback) */
  | { kind: "ask"; id: string; label: string };

export type CompanionAnswer = {
  id: string;
  /** chip label: short, how a visitor would actually ask it */
  question: string;
  answer: string[];
  actions?: CompanionAction[];
  /** lower-case words / phrases that point a typed question here */
  keywords: string[];
  /** answers that only come up from typed questions, not as a chip */
  hidden?: boolean;
};

export const COMPANION_GREETING = "Hi, I’m little Peiwen! What would you like to know?";

export const COMPANION_ANSWERS: CompanionAnswer[] = [
  {
    id: "start",
    question: "Where should I start?",
    answer: [
      "If it’s your first time here, play with the things on my desk — each one opens a different corner of my world.",
      "If you only have five minutes, take a walk through my Experience.",
      "And if you’re curious about my projects, start with Reso.",
    ],
    actions: [
      { kind: "link", href: "/", label: "To the desk →" },
      { kind: "link", href: "/experience", label: "Walk with me →" },
      { kind: "link", href: "/projects/reso", label: "Open Reso →" },
    ],
    keywords: ["start", "first", "begin", "five minutes", "5 minutes", "quick", "best project", "recommend", "look at", "should i see", "should i read", "where to", "how you design", "your design", "design process", "先看", "推荐"],
  },
  {
    id: "cv",
    question: "Where’s your CV?",
    answer: [
      "It’s still being tucked into this little world!",
      "Send me a note and I’ll email you the latest version right away.",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email" }],
    keywords: ["cv", "resume", "résumé", "download", "简历"],
  },
  {
    id: "email",
    question: "What’s your email?",
    answer: [COMPANION_EMAIL, "Tap below to copy it — I’d love to hear from you."],
    actions: [{ kind: "copy-email", label: "Copy my email" }],
    keywords: ["email", "e-mail", "mail", "contact", "reach", "write to", "get in touch", "hire", "hiring", "intern", "job", "available", "opportunit", "邮箱", "联系"],
  },
  {
    id: "lately",
    question: "What are you up to lately?",
    answer: [
      "I’m doing my MSc in Human-Computer Interaction at Université Paris-Saclay, learning how people work with AI agents and immersive interfaces.",
      "This year I also spent six months as a product intern at Tantan, running A/B tests and localization research for users in Indonesia, Taiwan and Singapore.",
    ],
    keywords: ["lately", "recent", "now", "currently", "these days", "doing", "study", "studying", "master", "msc", "tantan", "最近", "现在"],
  },
  {
    id: "like",
    question: "What are you like?",
    answer: [
      "Curious about almost everything — and I feel things strongly, connect ideas everywhere, and always have something to say. I want to really take part in life, not just watch it.",
      "I have my own opinions and I love exploring. Honestly, my biggest strength and my biggest trouble come from the same place: I’m a little too interested in people, the world, and myself.",
    ],
    keywords: ["like as a person", "what are you like", "personality", "person", "yourself", "who are you", "character", "strength", "weakness", "性格", "你是谁"],
  },
  {
    id: "favorite",
    question: "Your favorite project?",
    answer: [
      "Arm-Swing VR — because I made it completely on my own, from the first idea to the working prototype.",
    ],
    actions: [{ kind: "link", href: "/projects/arm-swing-vr-locomotion", label: "Take a look →" }],
    keywords: ["favorite", "favourite", "proud", "best", "most", "arm-swing", "arm swing", "最喜欢"],
  },
  {
    id: "why-hci",
    question: "Why HCI?",
    answer: [
      "In product work in Beijing I kept noticing that the hard part usually wasn’t the technology — it was whether people could understand it and trust it.",
      "HCI is where I get to study that properly, especially now that we’re all learning to work with AI.",
    ],
    keywords: ["why hci", "hci", "human-computer", "human computer", "chose hci", "choose hci", "为什么选"],
  },
  {
    id: "unwritten",
    question: "Something not in the portfolio?",
    answer: [
      "I speak Chinese and English, and I’m learning French now. I’ve lived in Beijing, Osaka and Paris.",
      "And this whole website started as a picture book I wanted to walk around in.",
    ],
    keywords: ["not in", "secret", "fun fact", "hobby", "hobbies", "language", "languages", "french", "chinese", "english", "speak", "lived", "website", "this site", "picture book", "语言"],
  },
  {
    id: "projects",
    question: "What have you made?",
    hidden: true,
    keywords: ["project", "projects", "made", "built", "build", "work", "portfolio", "reso", "tangram", "maze", "music", "flight", "chess", "zoo", "作品", "项目"],
    answer: [
      "Eight things so far: Reso, Arm-Swing VR, Tangram, Music VR, Maze of Wishes, Flight Booking, Chess and the ZOO Organizer.",
      "They’re all hanging in the attic — come and have a look.",
    ],
    actions: [{ kind: "link", href: "/projects", label: "Go to Projects →" }],
  },
  {
    id: "experience",
    question: "Where have you worked?",
    hidden: true,
    keywords: ["experience", "worked", "work experience", "internship", "internships", "job", "company", "companies", "product manager", "pm", "huashun", "yundao", "beijing", "background", "经历", "实习"],
    answer: [
      "I’m doing an MSc in Human-Computer Interaction at Université Paris-Saclay, and this year I was a product intern at Tantan.",
      "Before that I did product work in Beijing at Huashun Xin’an and Yundao Zhizao, and a VR research exchange at Osaka University.",
    ],
    actions: [{ kind: "link", href: "/experience", label: "Walk with me →" }],
  },
  {
    id: "osaka",
    question: "What did you do in Osaka?",
    hidden: true,
    keywords: ["osaka", "japan", "vr", "xr", "virtual reality", "immersive", "autism", "unity", "accessibility", "日本", "大阪"],
    answer: [
      "In 2023 I joined a research exchange at Osaka University, where our team built a VR tool for children with autism.",
      "I made every touch on a virtual object give feedback in Unity, and designed calm, gentle sounds for it.",
    ],
    actions: [{ kind: "link", href: "/experience", label: "See the journey →" }],
  },
  {
    id: "skills",
    question: "What are your skills?",
    hidden: true,
    keywords: ["skill", "skills", "tool", "tools", "good at", "can you", "sql", "tableau", "axure", "coding", "program", "research", "a/b", "ab test", "技能", "会什么"],
    answer: [
      "User research and experiment design, A/B testing, requirements and PRDs in Axure, data with SQL and Tableau, and prototyping — including VR in Unity (C#).",
      "My projects show these best.",
    ],
    actions: [{ kind: "link", href: "/projects", label: "See my projects →" }],
  },
  {
    id: "where",
    question: "Where are you?",
    hidden: true,
    keywords: ["where are you", "where do you live", "location", "live", "based", "paris", "france", "city", "在哪"],
    answer: ["I’m in Paris right now, studying at Université Paris-Saclay. I’ve also lived in Beijing and Osaka."],
  },
  {
    id: "github",
    question: "Do you have GitHub?",
    hidden: true,
    keywords: ["github", "git", "code", "repository", "repo", "source"],
    answer: ["Yes — here’s my GitHub."],
    actions: [{ kind: "link", href: "https://github.com/peiwenZHANG-git", label: "Open GitHub →" }],
  },
];

/** what she says when a typed question doesn't match anything she knows */
export const COMPANION_FREEFORM = {
  answer: [
    "Hmm, I only know about me and this little world!",
    "Try one of these — or write to the real me.",
  ],
  actions: [
    { kind: "ask", id: "start", label: "Where should I start?" },
    { kind: "ask", id: "projects", label: "What have you made?" },
    { kind: "copy-email", label: "Copy my email" },
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

/** What little Peiwen says to herself when a visitor arrives on a page — a small
    guide to how that page works. `touch` swaps "drag/click" for "swipe/tap". */
export function companionPageLine(pathname: string, touch: boolean): string | null {
  if (pathname === "/projects") {
    return touch
      ? "The big projects hang on the top line, the small ones below. Swipe to look around, and tap one to peek inside!"
      : "The big projects hang on the top line, the small ones below. Drag to look around, and click one to peek inside!";
  }
  if (pathname.startsWith("/projects/")) return "Scroll down for the whole story of this one.";
  if (pathname === "/experience") {
    return touch
      ? "Walk with me! Swipe along the road, or tap a keepsake to jump to a city."
      : "Walk with me! Use \u2190 \u2192 to walk along the road, or click a keepsake to jump to a city.";
  }
  if (pathname === "/about") return "Turn the pages with the arrows at the bottom — three spreads, all about me.";
  return null;
}
