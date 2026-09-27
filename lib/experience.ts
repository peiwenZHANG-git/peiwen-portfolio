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
  /** Chinese versions for the 中 / EN toggle */
  headingZh: string;
  roleZh: string;
  bulletsZh: string[];
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
  /** Chinese versions for the 中 / EN toggle (companion names/places kept as-is are noted below) */
  placeZh: string;
  cityZh: string;
  yearZh: string;
  whenZh: string;
  learnedZh: string;
  titleZh: string;
  metaZh: string;
  descZh: string;
  noteZh: string;
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
    placeZh: "巴黎", cityZh: "巴黎", yearZh: "2025 – 至今", whenZh: "2025 – 至今",
    learned: "Research × global product",
    learnedZh: "研究 × 全球化产品",
    feet: 8.5,
    drift: "snow",
    title: "Université Paris-Saclay",
    meta: "MSc Human-Computer Interaction",
    titleZh: "巴黎萨克雷大学", metaZh: "人机交互硕士（MSc HCI）",
    chips: ["HCI × AI agents", "Experiment design", "Market research", "A/B testing"],
    desc: "I study how people work with AI agents and immersive interfaces, from design to evaluation, in courses like Design & Evaluation of Interactive Systems, Machine Learning, and Mixed Reality.",
    descZh: "我在课程中学习人与 AI 智能体、沉浸式界面的交互方式，从设计一直到评估，包括交互系统设计与评估、机器学习、混合现实等。",
    items: [
      {
        icon: "cloud",
        heading: "Tantan",
        role: "Product intern · Apr – Sep 2026 · users in Indonesia, Taiwan, Singapore",
        headingZh: "探探", roleZh: "产品实习生 · 2026年4月–9月 · 面向印尼、台湾、新加坡用户",
        bulletsZh: [
          "对标 Tinder 和 Bumble，写语言、宗教、文化方面的本地化报告，为海外策略提供依据。",
          '以星座、兴趣、MBTI 为维度设计并跑了 <b>A/B 测试</b>，将结果转化为匹配逻辑的调整。',
          "用 <b>SQL</b> 和 <b>Tableau</b> 追踪曝光和点击数据，每周向产品和运营团队同步数据报告。",
        ],
        bullets: [
          "Benchmarked Tinder and Bumble and wrote localization reports on language, religion and culture to shape overseas strategy.",
          "Designed and ran <b>A/B tests</b> on matching by star sign, interests and MBTI, and turned the results into matching-logic changes.",
          "Tracked exposure and clicks with <b>SQL</b> and <b>Tableau</b>, and shared weekly data reports with product and operations.",
        ],
      },
    ],
    note: "Designing for people across languages and cultures.",
    noteZh: "为跨语言、跨文化的用户做设计。",
  },
  {
    id: "cuc",
    place: "Beijing, CUC",
    city: "Beijing",
    year: "2021 – 2025",
    when: "2021 – 2025",
    keepsake: "ginkgo",
    keepsakeName: "a ginkgo leaf",
    placeZh: "北京，中国传媒大学", cityZh: "北京", yearZh: "2021 – 2025", whenZh: "2021 – 2025",
    learned: "Product delivery & data",
    learnedZh: "产品落地与数据",
    feet: 8.5,
    drift: "ginkgo",
    title: "Communication University of China",
    meta: "BEng Digital Media Technology",
    titleZh: "中国传媒大学", metaZh: "数字媒体技术工学学士（BEng）",
    chips: ["Requirements analysis", "PRD & Axure", "SQL & Tableau", "Release management"],
    desc: "Where I built my base in computing and media: data structures, databases, machine learning, C++, HCI and statistics.",
    descZh: "在这里打下了计算机与媒体方向的底子：数据结构、数据库、机器学习、C++、人机交互和统计学。",
    items: [
      {
        icon: "work",
        heading: "Beijing Huashun Xin'an Technology",
        role: "Product manager · Jun – Sep 2025",
        headingZh: "北京华顺信安科技", roleZh: "产品经理 · 2025年6月–9月",
        bulletsZh: [
          "把客户访谈、问卷和焦点小组的结果，转化成网络资产管理产品 FORadar 的明确需求。",
          "在 <b>Axure</b> 中设计资产总览、搜索和管理流程，并撰写给研发的 PRD。",
          "把功能从设计一路推到发布：评审、测试、验收、发布说明，也参与了 FOEYE 5.0。",
        ],
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
        headingZh: "云道智造", roleZh: "产品实习生 · 2024年3月–6月",
        bulletsZh: [
          '规划 Fotu 5.0 并上线 <b>1 个新模块和 14 个新功能</b>；电子元件热成像模块的销量增长了 <b class="num">32.6%</b>。',
          '用 SQL 和 Tableau 追踪使用情况：活跃用户增长 <b class="num">41%</b>，人均使用时长达到 <b class="num">4.7 小时</b>。',
          "通过一对一客户访谈找到关键痛点；改进后投诉量下降了 <b class=\"num\">47.5%</b>。",
        ],
        bullets: [
          'Planned Fotu 5.0 and shipped <b>1 new module and 14 features</b>; the electronics thermal module grew sales by <b class="num">32.6%</b>.',
          'Tracked usage with SQL and Tableau: active users rose <b class="num">41%</b> and average use time reached <b class="num">4.7 h</b>.',
          'Found key pain points through 1:1 customer interviews; the fixes cut complaints by <b class="num">47.5%</b>.',
        ],
      },
    ],
    note: "Start from real user problems, then prove the impact with data.",
    noteZh: "从真实的用户问题出发，再用数据证明改进的效果。",
  },
  {
    id: "japan",
    place: "Osaka, Japan",
    city: "Osaka",
    year: "2023",
    when: "Mar – Sep 2023",
    keepsake: "sakura",
    keepsakeName: "a cherry blossom",
    placeZh: "大阪，日本", cityZh: "大阪", yearZh: "2023", whenZh: "2023年3月–9月",
    learned: "VR prototyping & accessibility",
    learnedZh: "VR 原型与无障碍设计",
    feet: 6,
    drift: "sakura",
    title: "Osaka University",
    meta: "Sakura Science Exchange Program (JST) · core member",
    titleZh: "大阪大学", metaZh: "樱花科技交流项目（JST）· 核心成员",
    chips: ["VR prototyping", "Unity (C#)", "Audio design", "Accessibility"],
    desc: "A research exchange at Osaka University, supported by the Japan Science and Technology Agency, where our team built a virtual-reality tool for children with autism.",
    descZh: "在大阪大学的一次研究交流，由日本科学技术振兴机构（JST）支持，我们团队为自闭症儿童开发了一个 VR 工具。",
    items: [
      {
        icon: "vr",
        heading: "VR assistive device for children with autism",
        role: "Research project · core member",
        headingZh: "为自闭症儿童设计的 VR 辅助设备", roleZh: "研究项目 · 核心成员",
        bulletsZh: [
          "用 <b>Unity（C#）</b>做碰撞检测，让虚拟物体的每一次触碰都有反馈，帮助孩子保持专注。",
          "通过动态范围压缩、低通滤波和混响，设计了让人平静的音频反馈。",
        ],
        bullets: [
          "Built <b>Unity (C#)</b> collision detection so every touch on a virtual object gave feedback, keeping children engaged.",
          "Designed calming audio feedback with dynamic range compression, low-pass filtering and reverb.",
        ],
      },
    ],
    note: "Designing calm, inclusive experiences for children.",
    noteZh: "为孩子设计平静、包容的体验。",
  },
] as const;

export const intro = {
  heading: "Walk with me through my experiences.",
  headingZh: "跟我走一遍，看看我都经历了什么。",
  stickers: [
    { label: "HCI research in Paris", labelZh: "在巴黎做人机交互研究", tone: "blue" as const },
    { label: "Product work in Beijing", labelZh: "在北京做产品", tone: "butter" as const },
    { label: "VR prototyping in Osaka", labelZh: "在大阪做 VR 原型", tone: "rose" as const },
  ],
  facts: ["3 product roles", "1 VR research project", "2 degrees"],
  factsZh: ["3 段产品工作", "1 个 VR 研究项目", "2 个学位"],
};

/** Every scene shares this background-position; kept as one constant, not per-chapter data. */
export const scenePosition = "center 62%";
