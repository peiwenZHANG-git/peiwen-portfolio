# Peiwen's Little World · 全站风格规范

> 状态：**已批准（2026-09-15）**，并入 `VISUAL_DIRECTION.md`，作为所有页面和新资产的验收标准。
> 当前语言范围：**仅英文版**。中文版的字体与排版之后单独处理。
>
> **与仓库现状的关系（2026-09-15 核对后补充）**
> - 本规范里的 Experience、Projects、About 截图属于**概念稿**。已经实现的只有 `/storybook` 的 Saclay → CUC 两章；Japan 仍处于 planned 状态；Projects 路由尚未建立。
> - 各条规则只在对应页面实际建立或接入时生效。
> 范围：本规范只统一"画风 + 字体 + 界面外壳"。不改信息架构、不改 Experience 交互、不改 Peiwen 已确认形象。
>
> **2026-09-21 更新：Home 冻结解除。** 用户明确要求把 Home 从 Static Master（山谷版）
> 换成一个可交互的桌面场景（"小佩文的桌面一角"，物体即入口），并且是**直接替换**，
> 不经过 `/lab` 草稿并行。旧的 `app/home-master.tsx` + `public/home-master/master.png`
> 不再是基准，作为历史版本保留、可回滚，但不再是"其他页面向它靠拢"的参照物。
> 详细方案见项目文档 `claude/home-desk-2026-09-21.md`。本文件第 2 节的色板、
> 第 3 节的插画语言仍然适用于新的桌面场景，唯一的例外见下方第 2 节末尾的冬夜蓝色条目。

---

## 1. 一句话标准

**细铅笔／墨线勾形 + 很薄的透明水彩 + 大面积暖象牙纸留白。画面没有边框，四周化进纸里。**

判断一张图合不合格，最快的方法是和 Home 截图并排放。如果它看起来比 Home 更"响"、更"满"、更"亮"或更"真"，就不合格。

---

## 2. 色板

数值来源在 2026-09-15 核对后分两类：

- **Master 代码里有值的**，以 `app/home-master.module.css` 为准。
- **Master 代码里没有值的**（插画内部颜色），保留从 `master.png` 取样的区域平均值。

变量统一使用 `--pw-*` 命名空间。`app/globals.css` 的 `:root` 已被旧 Experience 原型占用
（`--paper: #929ac3`、`--ink: #292d45`、`--muted: #414765`），**不得覆盖这三个名字**。

```css
:root {
  /* 纸 */
  --pw-paper:        #F7F3E9;  /* Master .viewport background */
  --pw-paper-shade:  #ECE8E4;  /* 取样：云、远景、纸的暗部 */

  /* 墨 */
  --pw-ink:          #3B3837;  /* Master .viewport color */
  --pw-ink-line:     #504434;  /* 取样：插画里的勾线（暖棕灰，不是纯黑） */
  --pw-ink-soft:     #837D78;  /* Master .subtitle — 副标题、正文 */
  --pw-ink-faint:    #76716C;  /* Master .tagline — 小标签、脚注、页码 */

  /* 自然色（插画与界面共用；Master 代码中无对应值，保留取样值） */
  --pw-sage:         #919979;  /* 树叶、枝条 icon */
  --pw-dust-blue:    #B1B5C2;  /* 远山、天空晕染 */
  --pw-straw:        #CEC4A6;  /* 草地、小路 */
  --pw-butter:       #E7BC6B;  /* 小黄花、光点 */
  --pw-rose-brown:   #AF886C;  /* Peiwen 外套、木头、皮革 */

  /* 唯一强调色 */
  --pw-accent:       #D74B3C;  /* Master .language span；只用于"当前状态" */
}
```

Master 代码里另外几个值按角色单独使用，不进入色板：

| 用途 | 值 | 出处 |
|---|---|---|
| 导航选中态下划线 | `#494542` | `.navigation a[aria-current]` |
| focus 可见轮廓 | `#655847` | `.stage a:focus-visible` |
| sky prompt 文字 | `#7B7772` | `.prompt`（比 `--pw-ink-soft` 略深的副标题变体） |
| skip link 底色 | `#FFFAF0` | `.skip` |

**被 Master 代码取代的旧取样值**（保留备查）：`--paper #F7F1E7`、`--ink #242224`、
`--ink-soft #716D6C`、`--ink-faint #918E88`、`--accent #D96A60`。

使用规则：

- **饱和度上限约 35%。** 任何大面积颜色都不能比 `--pw-butter` 更鲜艳。
- **强调色全站只用在"当前状态"上**，包括语言切换、CV 按钮和 focus 环。不要用来做装饰。
- **季节色必须向色板靠拢，不能另立一套。** 秋天用暗赭或蜂蜜色，不用橙红；春天用灰粉，不用樱花粉；冬夜用淡灰紫，不用蓝紫渐变。
- **例外：Home 桌面场景窗外的冬夜（2026-09-21 用户明确要求）。** 允许使用真正的冷蓝色调
  （不是灰紫），作为室内暖光和室外冷蓝的对比。**这条例外只适用于 Home 的窗外**；
  Experience 的 Paris-Saclay 冬夜场景仍然遵守"淡灰紫、不用蓝紫渐变"，除非之后单独提出改动。
  **数值已回填（2026-09-21）**：`--pw-window-blue: #9BABC7`，从定稿背景图
  `home-bg-v1-processed.png` 窗外夜空区域取样（上方天空色带均值，真蓝而非灰紫），
  在 `app/home-desk.module.css` 的 `.viewport` 局部变量里声明，未写入全局 `:root`。

---

## 3. 插画语言

| 维度 | 要 | 不要 |
|---|---|---|
| 线 | 细铅笔／墨线，暖棕灰，线条略断、略抖 | 无线稿的纯色块、粗黑描边、矢量等宽线 |
| 上色 | 透明薄涂，能看见纸 | 厚涂、油画颗粒、impasto 纹理、满版渐变 |
| 光 | 平光；光源用几颗小暖点表示 | 辉光、bloom、光晕、星星闪烁、镜面高光 |
| 阴影 | 物体脚下一小块淡接触影 | 大投影、强明暗、体积光 |
| 透视 | 绘本式轻微纵深，偏正面 | 强透视、广角、写实室内空间 |
| 边缘 | 无框；天空化进纸，地面用草叶笔触散开 | 矩形框、圆角框、树叶／花瓣剪影边、贴纸白边 |
| 密度 | 至少 40% 是纸或淡天空；细节集中在左右和前景 | 满版铺满的树叶、花、道具 |
| 图中文字 | 仅限地标本身（石碑、校名），手写感，尽量少 | 装饰性文字（罐子、书脊、便签上的句子） |

---

## 4. 景深分层

同一张图里，四个层次按以下方式处理。

- **前景**：对比度最高，勾线最清楚，可以部分遮挡中景。
- **中景**：Peiwen 和地标所在的层。颜色最完整，是视线落点。
- **背景**：降饱和、降对比、线条变淡。
- **远景**：接近 `--pw-paper-shade` 和 `--pw-dust-blue`，几乎不勾线，只是一层气氛。

---

## 5. Peiwen

- **全站唯一形象是 Home 里那个**：白色长发、玫瑰棕外套、棕色斜挎包、白袜、棕靴。
- **任何页面不得出现其他版本。** 这条包括 Projects 阁楼里穿裙子、不背包的那一版。
- 新出图时，必须把 Home 的 Peiwen 当作角色参考图一起提供。
- 已决定：Projects 页使用 Home 的**背影站姿**，不采用"双手背后"版本。
- 其他新姿势需要单独提出，经批准后才能使用。
- **例外：About 页的"贴纸版 Peiwen"（2026-09-20 批准）。** About 是她的私人手账，允许出现换装的贴纸形象：
  `peiwen-camera`（粉色连衣裙、拿相机）和 `peiwen-swim`（泳衣、抱泳圈）。脸、发型、发色必须与 Home 一致，
  画风按第 3 节。**这条例外只适用于 About**，Home、Experience、Projects 仍然只用 Home 的已确认形象；
  新增其他换装版本同样需要单独批准。

---

## 6. 字体

### 6.1 三层体系

| 角色 | 字体 | 用在哪里 |
|---|---|---|
| **手写体** | **Patrick Hand**（`next/font/google`，weight 400，`display: "swap"`） | logo、导航、页面标题、场景名、节标题、脚注、按钮 |
| **正文** | **Nunito**（400 / 600） | 所有段落、经历描述、职位信息、联系方式 |
| **小标签** | Nunito 600，全大写，`letter-spacing: 0.18em` | `HCI · PRODUCT · CREATIVE TECH` 这类 eyebrow |

**2026-09-15 核对结果**：Static Master（`app/home-master.tsx`）和 `/about`（`app/about/fonts.ts`）
都已经在用 Patrick Hand，`/about` 同时已在用 Nunito，所以本规范沿用这两款，不引入新字体。
`/` 默认渲染的 `HomeHub` 用的是系统字体栈 `"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`，
不是自托管 webfont，在不同机器上渲染不一致，**不作为字体标准**；HomeHub 本轮不改动。

**全站删除衬线体。** 注意：衬线体只出现在 Experience 的**概念稿**里。仓库中 `/storybook` 实际继承的是
`app/layout.tsx` 的 `--font-geist-sans`（无衬线），所以这条在代码里表现为「把 Geist 换成 Patrick Hand +
Nunito」，而不是「删除衬线体」。

### 6.2 字号与行高（桌面端）

| 用途 | 字号 | 行高 | 颜色 |
|---|---|---|---|
| 页面主标题 | 44–48px | 1.2 | `--pw-ink` |
| 场景／机构名 | 34–38px | 1.2 | `--pw-ink` |
| 副标题 | 22–24px | 1.4 | `--pw-ink-soft` |
| 导航 | 17–18px | — | `--pw-ink`，选中态加下划线 |
| 正文 | 16px | 1.7 | `--pw-ink-soft` |
| 小标签／页码／脚注 | 12–14px | 1.5 | `--pw-ink-faint` |

### 6.3 禁止

- 文字外发光、描边、阴影。
- 长段落使用手写体（超过 2 行就改用 Nunito）。
- 同一屏里出现两款以上手写体。

### 6.4 中文（暂缓）

- 本轮只做英文版。
- 中文字体（候选：霞鹜文楷 + Noto Sans SC）等英文版完成后再定。
- 在此之前，中文模式保持现状，不做改动。

---

## 7. 界面外壳（全站共用组件）

### 7.1 Header

**所有页面使用同一个 Header**。已经抽成共用组件 `components/site-header.tsx`
（Experience、About 在用），字号、间距、选中态下划线按下面几条。Home 桌面版接入时对齐这个组件，
不再单独维护一份 Master 专属 header 标记（旧的 `app/home-master.tsx` header 已随桌面场景一起替换）。
Projects 页在建立时同样接入。

**2026-09-15 核对**：`/storybook` **目前完全没有 Header**（没有 logo、导航、语言切换），所以这一条在本轮
表现为「新建并接入」，不是「对齐」。

- **左侧**：灰绿线稿枝条（`--pw-sage`）、手写体 "Peiwen Zhang"，下方是小标签。Experience 页当前的橙色叶子需要换掉。
- **中间**：导航使用手写体。选中态是一条细手绘下划线，颜色 `--pw-ink`（Master 实际用 `#494542`）。全站只用这一种选中样式，不再使用粉色笔刷胶囊，也不再使用衬线加下划线的版本。
- **右侧**：`中 / EN` 切换，当前语言用 `--pw-accent` 下划线标出，其后是背景音乐开关
  （`components/music-toggle.tsx`）。**已知冲突（2026-09-21 记录，未处理）**：这条规则写的是
  "黑胶唱片改成扁平样式，不加投影和高光"，但音乐开关实现时加了两道高光弧（用来让转动的唱片
  看得出在转，纯同心圆转多快都像静止）。这条待专门讨论——可能是换一种不加高光的不对称标记
  （比如封面上的一道裂纹、一个偏心的花纹），而不是干脆去掉，因为去掉后转动又会变得不可见。

### 7.2 页脚小注

- 左右两侧用手写体小字，配线稿小图标（花或枝条）和一条手绘曲线，与 Home 一致。
- Experience 左下角的 "Scroll · ←→ to walk" 改用手写体。

### 7.3 图标

- 统一使用单色线稿图标，线宽和 Home 的枝条相同，颜色 `--pw-ink-soft` 或 `--pw-sage`。
- 不使用彩色品牌 logo（LinkedIn 蓝、GitHub 黑块）、emoji 风格图标或 app 图标式圆角方块。
- Experience 的公司小图标也改成线稿。**2026-09-15 核对：`/storybook` 目前没有任何公司图标，本条暂无对象。**

### 7.4 其他

- **页码**统一为 `01 / 02` 格式：两位数，斜杠两侧留空格，分母从实际章节数据读取（`STORYBOOK_SCENES.length`，当前 = 2），颜色 `--pw-ink-faint`。
  **2026-09-15 核对：`/storybook` 目前没有页码，本条为新建。**
- **全站禁止卡片和面板**，包括毛玻璃、投影卡片和 HUD 式浮层。文字应该像"印在绘本留白里"。
- **插画边缘**统一使用一张手绘水彩遮罩（`mask-image`）。**2026-09-15 核对：`/storybook` 目前没有剪影边，
  所以这是新增柔边，不是替换。**

---

## 8. 出图规范

### 8.1 每次出图都要做的事

1. 附上 **Home 截图**作为风格参考图。
2. 如果画面里有 Peiwen，附上 Home 里的 Peiwen 作为角色参考图。
3. 在提示词末尾加上下面的**风格锚定段**。

### 8.2 风格锚定段（通用）

```
Match the reference image style exactly: fine warm-grey graphite and ink
linework with thin transparent watercolor washes on warm ivory paper
(#F7F3E9). Very low saturation palette: sage green, dusty blue-grey, pale
straw, soft butter yellow, muted rose-brown. At least 40% of the image is
calm paper or pale sky. No frame and no border: the edges dissolve softly
into the paper, and the ground fades out with loose grass strokes. Detail
is clustered at the sides and in the foreground, the centre stays quiet.
Gentle picture-book depth, near-frontal view.
```

### 8.3 通用排除段

```
No glow, no bloom, no lens flare, no sparkles, no specular highlights,
no cast shadows, no impasto or oil-paint texture, no saturated colors,
no blue-purple gradients, no heavy shading, no realistic rendering,
no 3D, no strong perspective, no leafy or cut-out border, no decorative text.
```

**Home 桌面场景的窗外例外**：上面这段排除清单里的 "no blue-purple gradients" 对 Home 的
窗外不生效（见第 2 节的冬夜例外）；其余排除项照常适用。

### 8.4 各场景的单独修改要求

**Experience · Communication University of China（秋）**
- 橙红改成暗赭和蜂蜜色。
- 树叶数量减半，天空留出纸色。
- 去掉太阳辉光。
- 保留：校名石碑、红色旗帜（颜色压暗）、钟楼。这几样负责告诉观众"这是哪里"。

**Experience · Japan（春）**
- 天空改成淡灰蓝薄涂。
- 樱花改成灰粉，密度减半。
- 富士山改成远景层处理（更淡、几乎不勾线）。
- 保留：富士山、石灯笼、刻字石头。

**Experience · Paris-Saclay（冬）**
- 去掉整张的颗粒纹理。
- 夜空改成淡灰紫。
- 路灯只画小暖点，不带光晕。
- 雪花数量减少。
- 保留：埃菲尔铁塔（本场景主地标）、石碑、长椅。

**Home · 桌面场景（2026-09-21，取代 Static Master）**
- 小佩文的书桌一角，第一人称视角（看向桌面和窗外，不是看向她本人）。
- 窗外：固定冬夜，真蓝色调（本节例外），远处的城、飘雪、暖黄的室内窗光作对比。
- 桌上的可交互物体：活页笔记本（→ About）、明信片一叠 + 银杏叶 + 车票（→ Experience）、
  胶卷／老式相机（→ Projects）、水晶球（→ Playground）。
- 氛围装饰（不可点）：书堆、花瓶、笔筒、墙上钉的小佩文照片、窗台的猫、小房子摆件。
- 每个可交互物体最终要能单独出图（独立图层，透明底），才能做悬停时的抬起反应；
  背景桌面本身也要单独一张，物体的位置留白但不留可见接缝。
- 详细的构图区块、图层清单和逐个出图提示词见 `claude/home-desk-2026-09-21.md`。
- **接入状态（2026-09-21）**：`app/home-desk.tsx` + `app/home-desk.module.css` 已实现并接管
  `app/page.tsx` 默认路由；背景层与四个物体图层已定位、悬停 hop/sway 反应已接入、四个物体是
  真正的 `<Link>`（Tab 可达、focus 环可见）。移动端沿用旧 Master 的"固定像素舞台 + 外层滚动"
  方案，不是专门的竖屏构图（待办里明确标注为下一步）。lint/typecheck/build 尚未在本次改动上
  跑过——见 `claude/home-desk-2026-09-21.md` 待办的说明。

**Projects · 阁楼**
- 构图保留：晾绳、窗外的巴黎、小猫。
- 补上勾线，压平透视。
- 道具减少约三分之一。
- 墙和地板提亮到接近 `--pw-paper`。
- Peiwen 换成已确认形象。
- 画面里的晾绳卡片不要带字（"Picture Books" 等文字改由 DOM 提供）。

**About**
- 见更新后的 `about-asset-spec.md`。

---

## 9. 验收清单

**每张新图接入前检查：**

- [ ] 和 Home 并排放，颜色没有明显更鲜艳。
- [ ] 能看见勾线，能看见纸。
- [ ] 没有框、没有剪影边，四周化进纸里。
- [ ] 没有辉光、高光、投影。
- [ ] 留白 ≥ 40%。
- [ ] Peiwen 与 Home 形象一致。
- [ ] 除地标外，画面里没有文字。

**每个页面交付前检查：**

- [ ] Header 与 Home 完全一致。
- [ ] 页面上只出现手写体 + Nunito 两款字体，没有衬线体。
- [ ] 没有文字发光。
- [ ] 桌面端和移动端都检查过。
- [ ] 开启 reduced motion 后页面正常。
- [ ] 键盘和触控操作正常。
- [ ] lint、typecheck、build 全部通过。

---

## 10. 已决定事项

1. **语言**：先做英文版，中文之后再考虑。
2. **Experience 章节数**：规划为 3 章（Saclay、CUC、Japan）。已实现的只有 Saclay 和 CUC；页码的分母
   **从实际数据读取**（`STORYBOOK_SCENES.length`），Japan 建成之前显示 `/ 02`，不虚标总数。
3. **Projects 的 Peiwen**：使用 Home 的背影站姿。这条在 Projects 页实际建立时执行，本轮不涉及。
4. **过渡方案**：对 Experience 插画做降饱和，加纸色叠加和柔边，让整体画风先协调起来。参数见第 11 节。
   2026-09-15 实测后修订：Saclay **不降饱和**（`saturate(1.00)` + 暖移 + 减弱纸色叠加），CUC 保持 `.50`；
   0.13–0.15 改为**重画后的终点目标**。

---

## 11. 过渡处理：Experience 插画降饱和（2026-09-15 实测后修订）

### 11.1 测量方法

在 `/storybook` **实际加载的运行时资产**上测量，而不是概念截图：
`design-assets/keyframes/experience/paris-saclay-approved.png` 和 `cuc-approved.png`（各 1448×1086）。
指标为全图逐像素 **HSV 饱和度均值**（HSL 均值与本规范原表对不上，不使用）。
管线按 11.3 建模：`saturate(s)` → `contrast(.93)` → 10% 纸色薄洗 → 纸色 multiply。

参照物：`public/home-master/master.png` 全幅 **0.0966**，下半幅插画带 **0.1189**。

### 11.2 实测结果与结论

| 场景 | 原始 | 只加叠加层（`saturate(1.0)`） | 旧起点 `.90` / `.50` | 达到 0.13–0.15 所需 | **本轮采用** |
|---|---|---|---|---|---|
| Paris-Saclay | 0.1191 | **0.0796** | `.90` → 0.0729 | 已低于目标 | **`saturate(1.00)`** |
| CUC | 0.4230 | 0.4059 | `.50` → **0.2578** | `saturate(.14–.19)` | **`saturate(.50)`** |
| Japan（planned） | 未测（资产未接入） | — | `.70` | — | 建成后按 11.1 重测 |

**Saclay 不降饱和。** 它的原始饱和度 0.1191 与 Home 插画带的 0.1189 基本相同；仅纸色叠加就已把它压到
0.0796，比 Home 更灰，再乘 `.90` 会掉到 0.0729，画面发死。Saclay 的问题是**色相**（蓝紫）而非饱和度，
因此改为：`saturate(1.00)` + 轻微暖移 + **减弱纸色 multiply 的 opacity**。

**CUC 保持 `.50`。** 实测落在 0.2578。压到 0.15 需要 `saturate(.19)`，那已接近去色，秋天的感觉会消失，
正是本规范一直警告的问题。

**0.13–0.15 是重画之后的终点目标，不是本轮滤镜的目标。** 滤镜只负责把颜色先拉到一个不打架的区间；
密度和笔触的差距由第 8.4 节的重画解决，重画完成后删除这些 filter，届时再按 11.1 复测至 0.13–0.15。

### 11.3 实现

`data-scene` 已存在于 `app/storybook/storybook-review.tsx` 的 `<main>` 上，取值为 `lib/storybook.ts`
里的场景 id：`saclay-winter`、`cuc-autumn`。

```css
.sceneArt         { filter: saturate(var(--scene-sat)) contrast(.93); }
.sceneArt::before { background: var(--pw-paper); opacity: .10; }                     /* 纸色薄洗 */
.sceneArt::after  { background: var(--pw-paper); mix-blend-mode: multiply;
                    opacity: var(--scene-paper); }                                   /* 纸色叠加 */
.sceneWarm        { background: var(--pw-straw); mix-blend-mode: soft-light;
                    opacity: var(--scene-warm, 0); }                                 /* 暖移，仅 Saclay */
.sceneFrame       { mask-image: url(/assets/ui/edge-wash.webp); }                    /* 柔边 */

[data-scene="saclay-winter"] { --scene-sat: 1;   --scene-paper: .45; --scene-warm: .12; }
[data-scene="cuc-autumn"]    { --scene-sat: .50; --scene-paper: 1;   --scene-warm: 0;   }
```

几点说明：

- **`--scene-paper` 和 `--scene-warm` 的具体数值是起点，需要在 1440 / 390 截图上目视定稿。** `.45` 和 `.12`
  来自计算，未经屏幕确认。
- **柔边遮罩**：先用程序生成的 `public/assets/ui/edge-wash.webp` 上线。等手绘水彩遮罩到位后，替换这一张文件即可。
- **注意范围**：降饱和只作用于插画本身，不能作用到 Peiwen 精灵上。当前两张 review plate 的 Peiwen 是**烤在底图里**
  的（见 ASSET_INDEX「temporary review plates」），没有独立图层可以豁免——这是已知代价，记录在案，本轮不修图。
- **transition 段**：`sampleStorybook` 同时挂载两张 plate 并交叉淡入，两套变量各自作用在自己的 plate 上，
  过渡期间两者独立生效，不需要额外插值。

---

## 12. Experience × About 画风统一（2026-09-20）

两页并排时不像同一个网站（整页平均饱和度 Experience 0.074、About 0.180）。用户在对比页上选定：
两边向中间靠拢，Experience 略提饱和并加暖，About 往回收并去掉纯装饰贴纸，共用底色 `#F4EDE1`。
全部通过 CSS 实现，不重新出图。当时 Home（Static Master）不在范围内，仍然冻结；
2026-09-21 起该冻结已解除（见文件开头），Home 换成新的桌面场景，不再沿用这版山谷画面。

具体数值、作用范围和验收项见 `design-assets/VISUAL_UNIFY.md`。今后新页面（Projects 等）以这组数值为基准。
