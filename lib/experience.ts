/**
 * Experience chapter data. Copy is confirmed final by Peiwen; it must match
 * experience-v2/experience-prototype-v2.html exactly. Bullet/description strings
 * contain trusted inline markup (<b>, <b class="num">) for emphasis, not user input.
 */

export type DriftKind = "snow" | "ginkgo" | "sakura";
export type KeepsakeId = "ticket" | "ginkgo" | "sakura";
export type IconId = "work" | "cloud" | "vr";

export type ExperienceItem = {
  icon: IconId;
  heading: string;
  role: string;
  bullets: string[];
};

export type ExperienceChapter = {
  id: string;
  place: string;
  city: string;
  year: string;
  when: string;
  keepsake: KeepsakeId;
  keepsakeName: string;
  learned: string;
  /** feet position, percentage of stage height from the bottom */
  feet: number;
  drift: DriftKind;
  title: string;
  meta: string;
  chips: string[];
  desc: string;
  items: ExperienceItem[];
  note: string;
};

export const chapters: readonly ExperienceChapter[] = [
  {
    id: "saclay",
    place: "Paris-Saclay",
    city: "Paris-Saclay",
    year: "2025 – now",
    when: "2025 – now",
    keepsake: "ticket",
    keepsakeName: "a metro ticket",
    learned: "Research × global product",
    feet: 8.5,
    drift: "snow",
    title: "Université Paris-Saclay",
    meta: "MSc Human-Computer Interaction",
    chips: ["HCI × AI agents", "Experiment design", "Market research", "A/B testing"],
    desc: "I study how people work with AI agents and immersive interfaces, from design to evaluation, in courses like Design & Evaluation of Interactive Systems, Machine Learning, and Mixed Reality.",
    items: [
      {
        icon: "cloud",
        heading: "Tantan",
        role: "Product intern · Apr – Sep 2026 · users in Indonesia, Taiwan, Singapore",
        bullets: [
          "Benchmarked Tinder and Bumble and wrote localization reports on language, religion and culture to shape overseas strategy.",
          "Designed and ran <b>A/B tests</b> on matching by star sign, interests and MBTI, and turned the results into matching-logic changes.",
          "Tracked exposure and clicks with <b>SQL</b> and <b>Tableau</b>, and shared weekly data reports with product and operations.",
        ],
      },
    ],
    note: "Designing for people across languages and cultures.",
  },
  {
    id: "cuc",
    place: "Beijing, CUC",
    city: "Beijing",
    year: "2021 – 2025",
    when: "2021 – 2025",
    keepsake: "ginkgo",
    keepsakeName: "a ginkgo leaf",
    learned: "Product delivery & data",
    feet: 8.5,
    drift: "ginkgo",
    title: "Communication University of China",
    meta: "BEng Digital Media Technology",
    chips: ["Requirements analysis", "PRD & Axure", "SQL & Tableau", "Release management"],
    desc: "Where I built my base in computing and media: data structures, databases, machine learning, C++, HCI and statistics.",
    items: [
      {
        icon: "work",
        heading: "Beijing Huashun Xin'an Technology",
        role: "Product manager · Jun – Sep 2025",
        bullets: [
          "Turned customer interviews, surveys and focus groups into clear requirements for FORadar, a cyber-asset management product.",
          "Designed the asset overview, search and management flows in <b>Axure</b> and wrote the PRDs for engineering.",
          "Carried features from design to release: reviews, testing, acceptance and release notes; also contributed to FOEYE 5.0.",
        ],
      },
      {
        icon: "cloud",
        heading: "Yundao Zhizao",
        role: "Product intern · Mar – Jun 2024",
        bullets: [
          'Planned Fotu 5.0 and shipped <b>1 new module and 14 features</b>; the electronics thermal module grew sales by <b class="num">32.6%</b>.',
          'Tracked usage with SQL and Tableau: active users rose <b class="num">41%</b> and average use time reached <b class="num">4.7 h</b>.',
          'Found key pain points through 1:1 customer interviews; the fixes cut complaints by <b class="num">47.5%</b>.',
        ],
      },
    ],
    note: "Start from real user problems, then prove the impact with data.",
  },
  {
    id: "japan",
    place: "Osaka, Japan",
    city: "Osaka",
    year: "2023",
    when: "Mar – Sep 2023",
    keepsake: "sakura",
    keepsakeName: "a cherry blossom",
    learned: "VR prototyping & accessibility",
    feet: 6,
    drift: "sakura",
    title: "Osaka University",
    meta: "Sakura Science Exchange Program (JST) · core member",
    chips: ["VR prototyping", "Unity (C#)", "Audio design", "Accessibility"],
    desc: "A research exchange at Osaka University, supported by the Japan Science and Technology Agency, where our team built a virtual-reality tool for children with autism.",
    items: [
      {
        icon: "vr",
        heading: "VR assistive device for children with autism",
        role: "Research project · core member",
        bullets: [
          "Built <b>Unity (C#)</b> collision detection so every touch on a virtual object gave feedback, keeping children engaged.",
          "Designed calming audio feedback with dynamic range compression, low-pass filtering and reverb.",
        ],
      },
    ],
    note: "Designing calm, inclusive experiences for children.",
  },
] as const;

export const intro = {
  heading: "Walk with me through my experiences.",
  stickers: [
    { label: "HCI research in Paris", tone: "blue" as const },
    { label: "Product work in Beijing", tone: "butter" as const },
    { label: "VR prototyping in Osaka", tone: "rose" as const },
  ],
  facts: ["3 product roles", "1 VR research project", "2 degrees"],
};

/** Every scene shares this background-position; kept as one constant, not per-chapter data. */
export const scenePosition = "center 62%";
