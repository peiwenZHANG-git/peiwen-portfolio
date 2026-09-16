# Experience 页规格书（v2 · 形式已定：翻页 + 纪念品目录 + 旅行手账）

- **状态**：形式已确认，见小样 v2（`experience-prototype-v2.html`）。当前处于第一阶段"静态资产"，插画和纪念品批准之前不写正式代码。
- **依据**：`STYLE_GUIDE.md`（已批准，全站故事逻辑见第 12 节）。
- **构图参考**：三张概念稿，即 CUC 秋、Japan 春、Paris-Saclay 冬。只参考版式和构图，**不参考它们的画风**。
- **画风参考**：Home（Static Master，`master.png`）。

## 形式一句话

Peiwen 沿路走过三个地方，每到一处就捡起一件纪念品。插画下方这一排纪念品同时是**目录**和**总结**；右边是一页贴在纸上的**旅行手账**，写着这一章的内容。
---

## 0. 这份规格书解决什么问题

仓库里还没有一个"正确的" Experience 页。`/storybook` 已经放弃，`/experience` 是 3D 原型，那个方向也已放弃。

已确认的方向是：沿用概念稿的**左插画 + 右文字栏**版式，但三张插画必须**按 Home 画风重画**。

按项目规则，每个章节先作为一张静态绘本插画成立，之后才做页面和动效。

**工作顺序：**

1. Peiwen 按本规格出三张插画。
2. Claude 对照 Home 审图，Peiwen 定稿。
3. Claude Code 搭页面（单独一轮，届时另写施工清单）。
4. 最后做动效和打磨。

---

## 1. 页面形式与版式（已确认）

**核心想法：** Peiwen 沿路走过三个地方，每到一处就捡起一件纪念品放进斜挎包。三件纪念品排成一行，既是这一页的**目录**，也是整段经历的**总结**。

**桌面端（1440 宽）**

```
┌──────────────────────────────────────────────────────────────┐
│  共用 Header                                                   │
│                     Experience                                │
│          Walk with me through my experiences.                 │
│   At every place, I picked up something to keep.             │
│                                                              │
│  ┌───────────────────────────────┐   ┌─────────────────────┐ │
│  │  章节插画（四周晕开）            │   │ [车票存根 地点|时间]  🍃│ │
│  │        Peiwen 在路上走          │   │ 机构名（手写体）      │ │
│  └───────────────────────────────┘   │ 学位 / 项目           │ │
│  Things I picked up along the way    │ What I took with me… │ │
│   (🎫)- - - - (🍂)- - - - (🌸)        │ 正文                  │ │
│  Paris-Saclay  Beijing·CUC  Osaka     │ 🌿 During this chapter│ │
│  2025–now      2021–2025    2023      │ 经历条目              │ │
│  一句学到的    一句学到的    一句学到的  └─────────────────────┘ │
│              (←)  (→)                    ↑ 一页撕边手账         │
└──────────────────────────────────────────────────────────────┘
```

| 区域 | 说明 |
|---|---|
| 插画区（约 60%） | 章节插画，四周晕开。Peiwen 站在底部小路上，约位于 40% 处 |
| 纪念品目录 | 三个圆形格子，用虚线连起来。每格包含：纪念品、地点、时间、一句"学到了什么"。**点击即导航** |
| 手账页（约 36%） | 一张撕边的单页纸：顶部车票存根（地点 + 时间），右上角用胶带贴着本站纪念品，接着是标题、学位、"What I took with me"、正文、经历条目 |

**交互**

1. 点纪念品、箭头，或者按 ← →（手机上左右滑），Peiwen 从画面一侧走出去。
2. 场景滑动切换，手账页同时翻页。
3. Peiwen 从另一侧走进来，停在 40% 处。
4. **第一次到达**某个地方时，纪念品从她脚边飞进下方对应的格子，格子由虚线淡影变为实心，计数变成"2 of 3 kept"。
5. 往回走（更早的章节）时，Peiwen 转身向左走，用走路帧翻转实现。
6. reduced motion 模式下：不播放走路和飞行动画，直接切换。

**与 About 的区分**：About 是"书桌上摊开的笔记本"（有桌面、封面、活页环）；Experience 只有"一页贴在纸上的手账"，没有桌子和本子。两页共用同一套纸片和胶带素材。

**手机端（390 宽）**：纵向排列，顺序为标题 → 插画 → 纪念品目录（隐藏"学到了什么"那一行）→ 箭头 → 手账页。

**章节顺序**：01 Paris-Saclay → 02 CUC → 03 Japan（已确认）。

**文案**：每章"学到了什么"那一句由 Peiwen 本人确定。小样里的 *Asking deeper questions / Designing from people's needs / Learning across cultures* 只是示例。

---

## 2. 插画资产规格（三张共用）

| 项 | 值 |
|---|---|
| 尺寸 | 2000 × 1400 px（10:7，与概念稿比例接近） |
| 格式 | PNG，带 alpha 通道 |
| 边缘 | 四周渐隐到完全透明，渐隐带宽度约 6–10%，形状不规则，像水彩晕开。不要矩形框，不要树叶或花瓣剪影边 |
| 留白 | 画面上方约 35% 以天空或纸色为主 |
| Peiwen | **不画进图里**（原因见下） |
| 图中文字 | 只保留真实地标上的字（CUC 校名石碑、Paris-Saclay 石碑），手写质感。其他文字一律不要，包括 Japan 石头上的 "Japan" |
| 交付位置 | `design-assets/experience-v2/`，保持原始 PNG |

**为什么不把 Peiwen 画进去：** 页面上 Peiwen 以**侧面**沿路行走（使用已有的侧面行走帧），而且全站必须是同一个形象。所以插画要交一张干净的底图，Peiwen 由代码叠加上去。

**小路的要求（因为是侧面行走）：** 画面最下方约 18–25% 的高度里，要有一段**大致水平、从左贯穿到右**的前景小路。路面平整、干净，没有遮挡物。远处可以再接一段弯进画面深处的小路，保留纵深感。

**通用提示词结构**：场景描述 + `STYLE_GUIDE.md` 第 8.2 节"风格锚定段" + 第 8.3 节"排除段"，再加上下面这段：

```
Wide landscape illustration, no people, no characters. In the foreground,
a clear, nearly horizontal path runs across the whole width of the bottom
fifth of the image, flat and uncluttered, seen from the side, then curves
gently into the distance. Upper third is calm pale sky and paper. Edges fade softly
to transparent like a watercolor wash, irregular, no frame.
```

每次出图都要附两张参考图：

1. **Home 截图**，作为画风参考。
2. **对应的概念稿**，作为构图参考，并注明 *composition reference only, do not copy its colors or rendering*。

---

## 3. 三个场景

### 01 · Paris-Saclay（冬夜）

**保留：** 远处的埃菲尔铁塔、校园建筑的暖窗、刻有 Paris-Saclay 的石碑、长椅、弯月。

**修改：**

- 去掉颗粒厚涂，改为薄涂。
- 夜空从蓝紫改为淡灰紫，饱和度很低。
- 路灯只画小暖点，不画光晕。
- 雪花大约减少一半。
- 树木用细线勾出，色块少。

```
A quiet winter evening on a university campus near Paris, picture-book
style. Pale grey-lavender sky with a thin crescent moon, a faint Eiffel
Tower silhouette far away, low campus buildings with a few small warm
windows, bare trees drawn in fine pencil lines, soft snow on the ground,
small warm dots for lamp lights, a snowy stone marker reading
"Paris-Saclay" on one side, a simple bench.
```

### 02 · Communication University of China（秋）

**保留：** 钟楼主楼、刻有"中国传媒大学"的校名石碑、两面竖旗（颜色压暗，不写字）、远处的故宫屋顶剪影、大树框景。

**修改：**

- 橙红改为暗赭和蜂蜜色。
- 树叶大约减少一半，天空留出纸色。
- 去掉太阳光晕。

```
An autumn afternoon on a Beijing university campus, picture-book style.
A red-brick clock-tower building, a large stone marker carved with the
university name, two muted dusty-red vertical banners without text,
a faint palace roof silhouette in the far distance, one large tree
framing the left side with muted ochre and honey leaves, a few falling
leaves, calm pale warm sky.
```

### 03 · Japan / Osaka University（春）

**保留：** 远处的富士山、湖面、小桥、石灯笼、塔的轮廓、左侧樱花树框景。

**修改：**

- 天空改为淡灰蓝薄涂。
- 樱花改为灰粉，数量大约减半。
- 富士山按远景层处理，很淡，几乎不勾线。
- 石头上不写字。

```
A spring morning by a lake in Japan, picture-book style. A very faint
Mount Fuji in the far distance, calm lake, a small wooden bridge, a stone
lantern, a pagoda outline on one side, one cherry tree framing the left
with dusty-pink blossoms, a few drifting petals, a simple wooden fence,
pale blue-grey sky.
```

---

## 4. 验收清单（每张插画）

- [ ] 和 Home 并排放，颜色不比 Home 更鲜艳。
- [ ] 能看见勾线，能看见纸。
- [ ] 四周渐隐到透明，没有框，也没有剪影边。
- [ ] 没有辉光、没有高光、没有大投影。
- [ ] 上方约 35% 是天空或纸，画面整体留白不少于 40%。
- [ ] 画面里没有人物；最下方有一段横贯左右、平整干净的前景小路。
- [ ] 除了地标石碑，画面里没有文字。
- [ ] 三张放在一起，像同一位画家画的。

---

## 5. 待定项（出图前或搭页面前确认）

1. **章节顺序**：✅ 已定，沿用概念稿的 Saclay → CUC → Japan。
2. **Peiwen 行走形象**：✅ 已有侧面行走帧 `Right_Walking_v1.jpg`，共 6 帧，见第 6 节。**背包问题待你决定**。
3. **路由**：新 Experience 页是否替换现在的 `/experience`？如果替换，3D 原型需要挪到别的地址保留。这件事等搭页面那一轮再定。
4. **`pass-01-unify-shell` 分支**：先保留，不合并。它里面的 Header 组件、字体配置和 `--pw-*` 色板，搭 Experience 页时可以复用。

---

## 6. Peiwen 侧面行走帧（已有资产 · 审查结果）

**来源文件**

| 文件 | 用途 |
|---|---|
| `Right_Walking_v1.jpg` | **采用。** 向右走，6 帧 |
| `Left_Walking_v1.jpg` | 不需要单独使用。它和向右版是**完全的镜像**（逐像素比对，平均差异 < 1），代码里用 `scaleX(-1)` 翻转即可 |
| `Left_Walking_Strip_v1.jpg` | **不采用。** 图里带文字标签；第二行虽然标着 Left-Facing，其中两帧实际朝右 |
| `Peiwen_Character_v1.jpg`、`Walking_reference.jpg` | 仅作为角色设定参考，不直接使用 |

**优点**

- 6 帧的一致性非常好：身高 241–244 px，裙摆位置误差不超过 3 px，脚都落在同一条地平线上。做成动画不会抖。
- 画法是细铅笔线加薄涂，和 Home 属于同一画风。

**必须处理的问题**

1. **背景没法干净抠掉。** 文件是 JPG，没有透明通道；而且白色头发（RGB ≈ 238）和象牙纸底（≈ 250）几乎同色，自动抠图会把头发边缘一起吃掉。
   → 需要**重新导出为带透明背景的 PNG**。如果生成工具做不到透明背景，就改用纯中灰底（#808080）导出，由 Claude 负责抠图。
2. **分辨率偏低。** 现在每帧人物只有约 240 px 高。页面上她大约显示 140–180 px 高，高清屏需要 2 倍，也就是约 360 px。
   → 重新导出时，**每帧人物高度不低于 480 px**。
3. **和 Home 的形象不一致（需要你拍板）。** Home 里的 Peiwen 背着**棕色斜挎包**，穿的是偏棕的玫瑰色外套和棕色靴子；这套行走帧**没有背包**，裙子偏粉，鞋是深灰色。
   → ✅ **已定：以 Home 为准（方案 A）。** 行走帧补上斜挎包，颜色也调成和 Home 一致，详见下方"重新出图"。

**交付规格（重新导出时）**

- 6 张单帧 PNG，带透明背景，文件名 `peiwen-walk-right-01.png` 到 `-06.png`。
- 所有帧使用**同一个画布尺寸**（建议 600 × 720 px），人物脚底都落在距画布底边 40 px 的同一条线上。
- 图里不要地平线、不要文字、不要投影（接触阴影由 CSS 负责）。
- 交付位置：`design-assets/character/walk/`。

### 重新出图：带背包、Home 配色的侧面行走帧

**颜色对照**（从 Home 的 Peiwen 身上取样，只是大致值，出图时以参考图为准）

| 部位 | Home 的样子 | 大致色值 |
|---|---|---|
| 头发 | 暖白，细铅笔线勾出发丝 | ≈ `#F7F3EB` |
| 外套 | 灰玫瑰棕，偏棕、不偏粉，薄涂时能看出浓淡变化 | ≈ `#BFA090`（亮部可到 `#D3B09A`） |
| 斜挎包 | 焦糖棕小方包，带翻盖和两颗小扣 | ≈ `#C0895A` |
| 背带 | 细带，颜色与包相同，斜跨身体 | — |
| 袜子 | 白色 | — |
| 靴子 | 深棕灰色短靴 | ≈ `#453A31` |

**出图时附两张参考图**

1. **`Right_Walking_v1.jpg`**：用作**动作和比例参考**。6 帧的姿势、头身比、步幅都保持不变。
2. **Home 里 Peiwen 的局部截图**：用作**服装和颜色参考**，重点看背包、外套颜色和靴子。

**提示词**

```
Redraw this exact 6-frame side-view walk cycle of the same little girl,
facing right, keeping every pose, proportion, stride and head size
identical to the first reference image.
Change only her outfit to match the second reference image:
- a muted rose-brown knee-length coat (dusty, brownish, not pink),
- a small caramel-brown leather satchel with a front flap and two tiny
  buttons, hanging at her hip on the side facing the viewer, with a thin
  matching strap crossing her body over the far shoulder,
- white socks and short dark brown-grey boots.
Long warm-white hair drawn with fine pencil strands.
The satchel should swing very slightly with each step but stay in the same
position relative to her hip.
Fine warm-grey pencil linework with thin transparent watercolor washes,
picture-book style, same as the reference.
Each frame as a separate image on a transparent background (or flat
#808080 grey if transparency is not possible), same canvas size for all
frames, feet on the same baseline.
No ground line, no shadow, no text, no labels, no speech bubbles.
```

**如果一次生成 6 帧时背包位置总是对不上**

1. 先只生成**第 1 帧**，把背包画对。
2. 再用第 1 帧作为参考，逐帧生成剩下的 5 帧，提示词里加一句：*keep the satchel exactly as in this frame*。

**交付后 Claude 负责的部分**

- 逐帧检查：身高、脚底线、背包位置是否一致，颜色是否对齐 Home。
- 抠图（如果交的是灰底）。
- 统一画布尺寸，导出网页用的格式。

检查通过后，再由你确认一次动画效果。

### ✅ 定稿（2026-09-15）：侧面行走 v3，四拍循环

| 文件 | 姿势 |
|---|---|
| `peiwen-walk-right-01.png` | A：近腿在前，近侧手臂向后摆 |
| `peiwen-walk-right-02.png` | B：并腿 |
| `peiwen-walk-right-03.png` | C：远腿在前，近侧手臂向前摆（取自上一批图） |
| `peiwen-walk-right-04.png` | D：并腿 |

**规格**

- 画布 1145 × 1374，透明背景。
- 脚底已对齐到距画布底边 40 px 的同一条线上。
- 预览节奏为每帧约 170 ms。
- 向左走时，用 `scaleX(-1)` 翻转即可。

**已知小瑕疵（已接受）**

C 帧和其他三帧不是同一批生成的，人物高约 3%，背包位置也偏后一些，走到这一帧会有轻微跳动。以后如需打磨，在生成 A、B、D 的同一个对话里补画一张 C 即可替换。

**交付位置**

- 放入 `design-assets/character/walk/`，保留原始 PNG。
- 网页用的派生件在搭页面那一轮生成。

### ✅ 定稿（v3）

- 使用 4 帧循环：**A 跨步（近侧手臂向后）→ B 并腿 → C 跨步（近侧手臂向前）→ D 并腿**，每帧 170 ms。
- 文件为 `peiwen-walk-right-01.png` 到 `-04.png`，脚底已对齐到距画布底边 40 px 的同一条线。
- 向左走时，代码里用 `scaleX(-1)` 翻转即可。
- 已知小瑕疵（已接受）：C 帧来自上一批，人物比其他三帧高约 3%，背包位置也略有不同。之后如果补出同一批的 C，直接替换 `-03.png` 即可。

---

## 7. 纪念品（三件 · 需要手绘）

### 7.1 设定

| 章节 | 纪念品 | 画面描述 | "What I took with me"（**示例文案，请替换**） |
|---|---|---|---|
| 01 Paris-Saclay | 一张地铁票 | 淡灰蓝小纸票，一侧有打孔缺口，票面上只有一个很小的铁塔线稿，**不写字** | Asking deeper questions |
| 02 CUC | 一片银杏叶 | 一片干燥的扇形银杏叶，蜂蜜黄到淡赭，叶脉细线 | Designing from people's needs |
| 03 Japan | 一朵压花樱花 | 一朵压平的五瓣樱花，灰粉色，花心一点淡金 | Learning across cultures |

### 7.2 使用位置

同一张图用在四个地方，**不另画版本**：

1. 插画下方的纪念品目录（约 40 px）；
2. 手账页右上角，用胶带贴着（约 76 px）；
3. 捡起时从 Peiwen 脚边飞进目录的动画；
4. About 页书桌上的道具（见 `about-asset-spec.md` 第 1 节）。

### 7.3 资产规格

| 项 | 值 |
|---|---|
| 尺寸 | 每件 600 × 600 px |
| 格式 | PNG，透明背景 |
| 构图 | 物件居中，四周留出约 15% 空白，平放正视，**不画投影** |
| 画风 | 和 Home 一致：暖灰铅笔细线 + 透明薄涂 |
| 交付位置 | `design-assets/experience-v2/keepsakes/`，文件名 `keepsake-ticket.png`、`keepsake-ginkgo.png`、`keepsake-sakura.png` |

**出图方法**：三件在**同一个对话**里依次生成，附 Home 截图作为画风参考。

```
Match the reference image style exactly: fine warm-grey pencil linework with
thin transparent watercolor washes, picture-book style, very low saturation.
Draw a single small keepsake object, flat, seen from directly above,
centred with generous empty space around it, transparent background,
no shadow, no text, no letters, no border.
Object: [ONE OF THE THREE BELOW]
```

三件物件的描述：

- `a small pale blue-grey paper metro ticket with a round punched notch on one side and a tiny pencil sketch of the Eiffel Tower, no words`
- `a single dried ginkgo leaf, fan-shaped, honey-yellow fading to soft ochre, delicate vein lines`
- `a single pressed cherry blossom, five flat dusty-pink petals, a tiny pale gold centre`

**验收**：三件放在一起时大小相当，线条粗细一致，颜色都不比 Home 更鲜艳。

---

## 8. 旅行手账页（代码实现，不需要出图）

- **纸张**：复用 About 的 `page-sheet` 或 `paper-scrap-block` 资产，颜色比页面底色略亮一点，四周撕边。
  - 与 About 的区别：只有**一张单页**，没有桌面、没有封面、没有活页环。
- **车票存根**：顶部一条小票，左边手写地名，右边写时间，中间一道虚线。票面用 `paper-scrap-wide` 加 CSS 着色，文字是真实 DOM。
- **纪念品**：右上角贴一件纪念品，上面压一条胶带（`paper-scrap-wide` 缩小后用 CSS 着色）。
- **"What I took with me"**：用手写体写一句，前面画一道淡奶黄色的荧光笔痕，用 `brush-swipe` 资产。
- **翻页**：切换章节时，纸页沿左边翻过去。开启"减少动态效果"时改为直接替换。

---

## 9. 交互规则（以小样 v2 为准）

- **收集**：Peiwen 到达一个新地点、停下之后，纪念品从她脚边飞进目录，从虚线淡影变成实心；已经收集过的，不再重复播放这段动画。
- **目录计数**：显示 `1 of 3 kept`，随收集增加。
- **导航方式**：点纪念品、点箭头、键盘 ← →、手机上左右滑动，都可以切换章节。
- **行走方向**：去后面的章节向右走，回到前面的章节向左走（走路帧水平翻转）。
- **减少动态效果**：不播放行走和飞行动画，直接切换内容，纪念品直接变成实心。
- **无障碍**：纪念品按钮的读屏文字为"Walk to {地点}, where I picked up {纪念品}"。

---

## 10. 出图顺序（更新）

1. **三件纪念品**（第 7 节）：先画这个，因为它们体积小、画得快，而且决定了整套风格。
2. **三张场景插画**（第 3 节）：从 01 Paris-Saclay 开始。
3. 全部定稿后，再由 Claude Code 搭页面，届时另写施工清单。

---

## 7. 纪念品（新资产）

| 章节 | 纪念品 | 为什么选它 |
|---|---|---|
| Paris-Saclay | 一张巴黎地铁票（票面不写字，可以画一个极简的铁塔线条） | 新城市、新生活的开始 |
| CUC | 一片银杏叶 | 北京的秋天，也是 About 桌上那片叶子的来源 |
| Japan | 一朵樱花 | 大阪的春天 |

**规格（三件相同）**

- 600 × 600 px，PNG，透明背景。
- 物件居中，四周留白约 15%。
- 画风：Home 的铅笔线加薄涂。颜色为低饱和的淡灰蓝（车票）、蜂蜜黄（银杏）、灰粉（樱花）。
- 不要文字、不要投影、不要厚涂。
- 三件放在一起必须像同一个人画的，所以请**在同一个对话里连续生成**。
- 交付位置：`design-assets/experience-v2/keepsakes/`，文件名 `keepsake-ticket.png`、`keepsake-ginkgo.png`、`keepsake-sakura.png`。

**同一套图会用在三个地方**：Experience 的纪念品目录（显示约 40 px）、手账页右上角（约 76 px）、About 桌面上的道具（放大显示）。所以要求**在 40 px 这么小的时候，一眼也能认出是什么**：形状简单，轮廓清楚。

**提示词**（附 Home 截图作为画风参考）

```
Three small keepsake objects, drawn one per image, in exactly the style of
the reference: fine warm-grey pencil linework with thin transparent
watercolor washes, picture-book simplicity, very low saturation.
1) a small Paris metro ticket, pale dusty blue-grey, with a tiny simple
   Eiffel Tower line drawing on it, a small punched notch, no letters or numbers;
2) a single ginkgo leaf, soft honey yellow;
3) a single five-petal cherry blossom, dusty pink.
Each object centered on a transparent background with generous empty space
around it, flat frontal view, clear simple silhouette that still reads at a
very small size. No text, no shadow, no background, no border.
```

---

## 8. 手账页的素材（复用，不新画）

- **纸**：复用 About 的 `page-sheet`（撕边纸页）和 `page-grain`（纸纤维）。
- **胶带**：复用 About 的 `paper-scrap`（灰度纸片），由 CSS 上 `--straw` 色。
- **车票存根**：由 CSS 实现（浅色底 + 虚线分隔），不需要出图。
- **图标**：单色线稿 SVG，由代码实现。

---

## 9. 出图顺序

1. **纪念品三件**。先出，因为 About 桌面也要用它们做参考。
2. **场景 01 Paris-Saclay**，审过之后再出 02 CUC、03 Japan。
3. About 的其余资产（按 `about-asset-spec.md`，桌面道具以纪念品为准）。

---

## 10. 内容决定（依据 CV）

- **内容重点**：展示专业能力，而不是"学到了什么"。标题下方有一行核心能力（Product strategy / User research / Data & experiments / Prototyping）；每个纪念品下方写能力标签；手账页包含技能标签、2–3 条要点（数字成果高亮），最后保留一句带温度的话。
- **章节归属**：探探实习（2026.04–09）归入 Paris-Saclay；华顺信安（产品经理，2025.06–09）和云道智造（2024.03–06）归入 CUC；Japan 为大阪大学的樱花科学交流项目（JST 主办，核心成员）。
- **地点标签**：Paris-Saclay / Beijing · CUC / Osaka · Japan。
- **英文文案**：已经过 Peiwen 确认，以小样 `experience-prototype-v2.html` 中的内容为准。
- **联系方式**：Experience 页不出现联系方式。

---

## 11. 竣工版定稿要点（以小样为准）

- **顶部**：只有标题 *Walk with me through my experiences.*（不再使用 "Experience" 小标题）。标题下是三张手写"贴纸"短语：HCI research in Paris / Product work in Beijing / VR prototyping in Osaka，胶带颜色分别为淡灰蓝、蜂蜜黄、淡粉，对应三件纪念品。最下面是一行浅灰事实：3 product roles · 1 VR research project · 2 degrees。
- **能力标签只保留一处**：纪念品目录中每站下方。手账页里不放技能标签。
- **纪念品目录**：城市名（Paris-Saclay / Beijing / Osaka）、年份（2025 – now / 2021 – 2025 / 2023）、能力标签。当前站的城市名下方有铅笔下划线。
- **操作提示**：放在两个箭头按钮之间，用小字显示。桌面端为 "← → to walk, or tap a keepsake"，触屏端为 "Swipe, or tap a keepsake"。
- **手账页**：顶部车票存根（Paris-Saclay / Beijing, CUC / Osaka, Japan）、右上角胶带贴着纪念品、标题、学位、简介、"What I did here" 经历要点（数字成果高亮），末尾一句带温度的话。
- **布局**：左栏（插画 + 目录 + 箭头）在桌面端固定（sticky），右栏手账页可以滚动。1440×900 下第一屏能完整看到左栏。
- **场景**：三张均为 10:7 的正式插画。Peiwen 的脚底高度分别为 8.5% / 8.5% / 6%（相对舞台高度），舞台比例 10:6，背景定位 center 62%。CUC 已降饱和 18%。
- **飘落动效**：Paris-Saclay 三层雪（细雪 10、手绘雪花 4、近景柔雪 3）；CUC 银杏三层（远 3、中 4、近 2，尺寸 8–11 / 15–20 / 24–32 px，钟摆摇晃加偶尔翻面）；Japan 樱花四层（以单片花瓣为主，尺寸 6–9 / 10–14 / 16–20 整花 / 18–24 px）。所有飘落物都带风向、在顶部渐显、落地前淡出；开启"减少动态效果"时关闭，页面不可见时暂停。
- **指针**：按 `STYLE_GUIDE.md` 第 7.5 节执行（铅笔、捡起的手、画线、画圈、脚印）。
