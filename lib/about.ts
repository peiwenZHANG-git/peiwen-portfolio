/**
 * About page content contract.
 *
 * Every user-facing string, link and asset path for `/about` lives here so the page
 * component stays layout-only. Values marked `placeholder: true` are NOT confirmed
 * public information; the page renders them as inert text with a visible marker
 * instead of a live link, so nothing ships broken. Flip `placeholder` to `false`
 * and supply the real `href` and `value` to turn an entry into a real link without
 * any layout change.
 */

export type PaperTone = "rose" | "blue" | "green" | "sand";

export type ContactLink = {
  id: string;
  label: string;
  /** Text shown on the page. */
  value: string;
  /** Full URL or mailto:. Ignored while `placeholder` is true. */
  href: string;
  /** True until Peiwen confirms the public value. */
  placeholder: boolean;
};

export const identity = {
  name: "Peiwen Zhang",
  roleLine: "HCI · Product · AI · XR",
  greeting: "Hi, I’m Peiwen.",
  marginNote: "Collecting little moments for a brighter tomorrow.",
  closingNote: "A small step, a brighter tomorrow.",
} as const;

export const portrait = {
  src: "/assets/about/portrait.webp",
  width: 900,
  height: 891,
  alt:
    "Peiwen Zhang smiling at a restaurant table, holding a wooden spoon in one hand and " +
    "chopsticks in the other, with a bowl of rice in front of her.",
  caption: identity.name,
  captionRole: identity.roleLine,
} as const;

export const intro: readonly string[] = [
  "I’m an HCI master’s student at Université Paris-Saclay, with a background in Digital Media Technology and product development.",
  "I’m interested in how emerging technologies can become more intuitive, thoughtful and human-centered.",
];

export const places: readonly { id: string; name: string; tone: PaperTone }[] = [
  { id: "beijing", name: "Beijing", tone: "rose" },
  { id: "japan", name: "Japan", tone: "blue" },
  { id: "paris", name: "Paris", tone: "green" },
];

export const journey: readonly { id: string; title: string; detail: string }[] = [
  { id: "digital-media", title: "Digital Media", detail: "Communication University of China" },
  { id: "product", title: "Product", detail: "users · requirements · iteration" },
  { id: "vr", title: "VR / Interactive Systems", detail: "Sakura Science · Japan" },
  { id: "hci", title: "Human–Computer Interaction", detail: "Université Paris-Saclay" },
];

export const exploring: readonly { id: string; label: string; tone: PaperTone }[] = [
  { id: "human-ai", label: "Human–AI Interaction", tone: "blue" },
  { id: "women-tech", label: "Women & Technology", tone: "rose" },
  { id: "emotion-ai", label: "Emotion, Intimacy & AI", tone: "sand" },
  { id: "xr", label: "XR / Spatial Interaction", tone: "green" },
];

export const exploringNote = "also curious about beauty tech ✦";

export const strengths: readonly {
  id: string;
  title: string;
  detail: string;
  tone: PaperTone;
}[] = [
  {
    id: "product-thinking",
    title: "Product thinking",
    detail: "turning messy needs into clear products",
    tone: "rose",
  },
  {
    id: "research-mindset",
    title: "Research mindset",
    detail: "user research · experiments · evaluation",
    tone: "blue",
  },
  {
    id: "technical-fluency",
    title: "Technical fluency",
    detail: "Python · Unity/C# · AI prototyping",
    tone: "green",
  },
  {
    id: "cross-cultural",
    title: "Cross-cultural perspective",
    detail: "China · Japan · France",
    tone: "sand",
  },
];

export const languages: readonly {
  id: string;
  /** BCP 47 tag, so assistive tech pronounces the name in the right language. */
  lang: string;
  name: string;
  level: string;
}[] = [
  { id: "zh", lang: "zh", name: "中文", level: "native" },
  { id: "en", lang: "en", name: "English", level: "B2, almost everywhere" },
  { id: "fr", lang: "fr", name: "Français", level: "A2, still learning ☺" },
];

/**
 * REPLACE BEFORE PUBLISHING.
 * The repository contains no confirmed public contact details, so all three entries
 * are placeholders. Set `value`, `href` and `placeholder: false` for each one.
 */
export const contact: readonly ContactLink[] = [
  {
    id: "email",
    label: "Email",
    value: "your.name@example.com",
    href: "mailto:your.name@example.com",
    placeholder: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/your-handle",
    href: "https://www.linkedin.com/in/your-handle",
    placeholder: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/your-handle",
    href: "https://github.com/your-handle",
    placeholder: true,
  },
];

/**
 * CV download.
 * `href` stays null until the PDF exists. While it is null the page renders the same
 * paper label in an inert, clearly-marked state — no broken link, no layout change.
 * To ship it: drop the file at `public/peiwen-zhang-cv.pdf` and set
 * `href: "/peiwen-zhang-cv.pdf"`.
 */
export const cv: {
  href: string | null;
  label: string;
  downloadName: string;
  pendingNote: string;
} = {
  href: null,
  label: "Download my CV",
  downloadName: "peiwen-zhang-cv.pdf",
  pendingNote: "PDF coming soon",
};
