/**
 * What little Peiwen says (2026-09-25, phase 1: preset questions only, no AI).
 *
 * Every answer is first person, short, and grounded in what the site already says
 * (lib/experience.ts, lib/projectsData.ts, the About book). Answers marked
 * `draft: true` speak for Peiwen's personal taste or feelings and are Claude's first
 * draft — Peiwen confirms or rewrites them. The flag is documentation only; nothing
 * renders differently.
 */

export const COMPANION_EMAIL = "peiwen.zhang@universite-paris-saclay.fr";

export type CompanionAction =
  | { kind: "copy-email"; label: string }
  | { kind: "link"; href: string; label: string };

export type CompanionAnswer = {
  id: string;
  /** chip label: short, how a visitor would actually ask it */
  question: string;
  answer: string[];
  actions?: CompanionAction[];
  draft?: boolean;
};

export const COMPANION_GREETING = "Hi, I’m little Peiwen! What would you like to know?";

export const COMPANION_ANSWERS: CompanionAnswer[] = [
  {
    id: "start",
    question: "Where should I start?",
    answer: [
      "If you only have five minutes: Reso shows how I design and test an idea, and Arm-Swing VR shows how I prototype.",
      "If you have a little longer, take a walk through my Experience — it’s the story of how I got here.",
    ],
    actions: [
      { kind: "link", href: "/projects/reso", label: "Open Reso →" },
      { kind: "link", href: "/experience", label: "Walk with me →" },
    ],
    draft: true,
  },
  {
    id: "cv",
    question: "Where’s your CV?",
    answer: [
      "It’s still being tucked into this little world!",
      "Send me a note and I’ll email you the latest version right away.",
    ],
    actions: [{ kind: "copy-email", label: "Copy my email" }],
  },
  {
    id: "email",
    question: "What’s your email?",
    answer: [COMPANION_EMAIL, "Tap below to copy it — I’d love to hear from you."],
    actions: [{ kind: "copy-email", label: "Copy my email" }],
  },
  {
    id: "lately",
    question: "What are you up to lately?",
    answer: [
      "I’m doing my MSc in Human-Computer Interaction at Université Paris-Saclay, learning how people work with AI agents and immersive interfaces.",
      "This year I also spent six months as a product intern at Tantan, running A/B tests and localization research for users in Indonesia, Taiwan and Singapore.",
    ],
  },
  {
    id: "like",
    question: "What are you like?",
    answer: [
      "Curious, and a bit of a collector — metro tickets, ginkgo leaves, small ideas from every city I’ve lived in.",
      "I like taking a messy problem and making it clear enough that anyone can follow it, and I always want things to feel a little warmer than they need to.",
    ],
    draft: true,
  },
  {
    id: "favorite",
    question: "Your favorite project?",
    answer: [
      "Hard to pick! Probably Reso — making tone visible in captions showed me how much one small design detail can change the way someone feels.",
    ],
    actions: [{ kind: "link", href: "/projects/reso", label: "Take a look →" }],
    draft: true,
  },
  {
    id: "why-hci",
    question: "Why HCI?",
    answer: [
      "In product work in Beijing I kept noticing that the hard part usually wasn’t the technology — it was whether people could understand it and trust it.",
      "HCI is where I get to study that properly, especially now that we’re all learning to work with AI.",
    ],
    draft: true,
  },
  {
    id: "unwritten",
    question: "Something not in the portfolio?",
    answer: [
      "I speak Chinese, English and French, and I’ve lived in Beijing, Osaka and Paris.",
      "And this whole website started as a picture book I wanted to walk around in.",
    ],
    draft: true,
  },
];

/** what she says when someone types a free question (phase 1: no AI yet) */
export const COMPANION_FREEFORM = {
  answer: [
    "Ooh, good question — but little me can’t chat freely yet, I’m still learning!",
    "Write to the real me and I’ll answer properly.",
  ],
  actions: [{ kind: "copy-email", label: "Copy my email" }] as CompanionAction[],
};
