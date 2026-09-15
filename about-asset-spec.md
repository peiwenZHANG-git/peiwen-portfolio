# About 页插画资产规格书（v2 · 对齐 Home 画风）

用途：`/about`（Peiwen's Little World）视觉外壳的手绘资产。分工是 Peiwen 出图，Claude 负责接入。
在这批资产到齐之前，About 的视觉实现处于冻结状态。

> **v2 相对 v1 的改动**
> - 画风基准改为 **Home 页**，详见 `STYLE_GUIDE.md`。
> - 所有提示词改为"细线 + 薄涂 + 象牙纸"的写法，末尾统一附加风格锚定段和排除段。
> - 桌面提亮，皮革改为灰玫瑰棕，活页环改为哑光浅铜。
> - 参考图里所有装饰性文字和道具投影都去掉，道具数量减少。
> - 字体待定项并入全站规范。

---

## 0. 通用硬性约束

下面七条里，任意一条不满足，资产就接不进去，需要重出。

1. **画面里不能有任何文字。** 标题、图说、地名、导航、联系方式都是 DOM，图上出现文字会和 DOM 重影。这条也包括罐子、书脊、信纸上的装饰性句子。
2. **正面平视，不要透视角度。** 桌面场景可以带一点轻微的俯视感，但笔记本外壳、纸片、画框必须是正面平铺，否则会和 DOM 文字对不齐。
3. **不要把投影画进图里。** 接触阴影由 CSS 负责。图里如果带固定阴影，拼接和缩放时会露馅。
4. **源文件交 PNG（带 alpha）。** 不要预先压缩、不要裁切、不要加白底。转 WebP 和生成运行时派生件由我来做。
5. **透明区域必须完全透明（alpha = 0）**，不能是白色或接近白色。
6. **边框类资产（2 / 3 / 6 / 7）的四边必须是等宽或已声明宽度的稳定带状**，中间区域可以拉伸且不能有明显特征。原因见下面的"切片"说明。
7. **画风必须对齐 Home。** 出图时把 Home 截图作为风格参考图提供，并在每段提示词末尾附上下面的"风格锚定段"和"排除段"。

### 风格锚定段（附在每段提示词末尾）

```
Match the reference image style exactly: fine warm-grey graphite and ink
linework with thin transparent watercolor washes on warm ivory paper
(#F7F1E7). Very low saturation palette: sage green, dusty blue-grey, pale
straw, soft butter yellow, muted rose-brown. Plenty of paper showing through.
Near-frontal view, picture-book simplicity.
```

### 排除段（附在每段提示词末尾）

```
No text, no letters, no writing. No glow, no specular highlights, no gloss,
no cast shadows, no impasto texture, no saturated colors, no realistic
rendering, no 3D, no perspective distortion.
```

### 关于"切片"（border-image）

笔记本封面、纸页、照片框、纸片这四类资产上的文字长度会变，所以图必须能拉伸。做法是用 CSS 把图切成九宫格：四个角保持原样不缩放，四条边沿长度方向拉伸，中间区域填充。

这对画面有三个要求：

- **四个角的绘画细节必须落在声明的切片宽度之内。**
- **每条边的中段不能有独一无二的特征**，比如一个扣子、一处明显的破口、一道沿边长方向的渐变。这类特征在拉伸时会被拉成一条长条。
- 边缘自然的手工波动、毛边、纤维是**可以**的，拉伸后看起来仍然自然。

---

## 1. `desk-scene`（环境）

| 项 | 值 |
|---|---|
| 尺寸 | 2400 × 1500 px |
| 透明 | 否（不透明底图） |
| 用法 | `.desk` 的 `background-image`，`background-size: cover` |
| 移动端 | 不使用（移动端只保留一层淡晕染） |

**构图要求：**

- **中央 64% 宽 × 78% 高必须是安静的桌面。** 这块区域不放道具、不要强纹理、不要强明暗，因为笔记本会盖在上面。
- **道具只放在外圈边带里，总数不超过 4 样：** 一小罐雏菊、一低摞书（书脊不写字）、几片银杏叶、一封折好的信（信上不写字）。参考图里的钢笔、明信片堆、带字的罐子都去掉。
- **桌面几乎就是纸色。** 用极淡的 `--straw` 木纹薄涂，不画深棕木头，也不画窗光斜影。
- **气氛晕染：** 上方偏左一片淡灰蓝晕染，右上一片极淡的奶黄光。
- **四周化进纸里**，不要有明确的桌子边缘。

**生成提示词：**

```
A pale wooden desk surface seen from slightly above, drawn like a quiet
picture-book page. The wood is barely there: a faint straw-coloured wash
with a few loose graphite grain lines, almost the colour of the paper.
The centre of the image is empty and calm. Around the outer edges only:
a small jar of white daisies, a low stack of plain books, a few dried ginkgo
leaves, one folded plain letter. A soft blue-grey wash drifts in the upper
left, a very faint butter-yellow warmth in the upper right. The edges of the
desk dissolve into the ivory paper.
No notebook, no pen, no frame.
```

---

## 2. `cover-frame`（笔记本封面框）

| 项 | 值 |
|---|---|
| 尺寸 | 1280 × 860 px |
| 透明 | 是，**内部必须完全透明** |
| 切片 | 四边各 **96 px** |
| 用法 | `.cover` 的 `border-image` |

**构图要求：**

- **只画一圈封面边框**，宽度均匀，约 96 px。
- **颜色用灰玫瑰棕**（接近 `--rose-brown` `#AF886C`，可以稍深一档）。不要砖红，不要酒红，也不要有皮革光泽。
- **质感靠薄涂的色块浓淡加铅笔勾边来表现**，而不是靠写实的皮革纹理。
- **四个转角的画法必须完全落在 96 px 之内。**
- **中间 1088 × 668 px 全透明。** 纸页是另一张资产，会垫在下面。
- **每条边的中段不要有独特物件**，包括缝线断点、压印图案、扣子。

**生成提示词：**

```
A border frame only: the cover of an open notebook, painted as a uniform
band around all four edges. Muted rose-brown cloth-like cover in thin uneven
watercolor wash, soft warm-grey pencil outline, slightly wobbly hand-drawn
edges, one faint stitched line running evenly along the band. The entire
centre is empty and transparent.
No metal hardware, no straps, no buckles. Transparent background.
```

---

## 3. `page-sheet`（纸页）

| 项 | 值 |
|---|---|
| 尺寸 | 1100 × 760 px |
| 透明 | 是（纸张外围透明） |
| 切片 | 四边各 **64 px** |
| 用法 | `.page` 的 `border-image`；右页用 `scaleX(-1)` 镜像 |

**构图要求：**

- **纸色 = `--paper` `#F7F1E7`**，要和页面底色一致，这样笔记本才像"画在同一张纸上"。
- **四边是轻微的手撕或毛边**，外沿可以有一线极淡的暖灰铅笔边。
- **中央接近均匀。** 纤维要细、要匀，不要有大块水渍或渐变。
- **不画投影。**

**生成提示词：**

```
A single sheet of warm ivory paper (#F7F1E7), flat frontal scan.
Softly deckled edges on all four sides with a faint warm-grey pencil edge
line, fine even paper fibre across the whole sheet. The centre is calm and
uniform.
No folds, no creases, no stains, no ruling, no holes.
Transparent background outside the paper.
```

---

## 3b. `page-grain`（纸纤维平铺贴图）

| 项 | 值 |
|---|---|
| 尺寸 | 512 × 512 px |
| 透明 | 是（只有纤维，底透明） |
| 用法 | 叠在纸页和全站背景上 `repeat`，全站共用一张 |

3 号纸页的中央被拉伸后，纤维会变稀。这张无缝平铺的纤维贴图用来补回真实的纸感。它也可以作为全站纸底纹理使用，让 About 和 Home 的纸质感一致。

**生成提示词：**

```
Seamless tileable texture of warm ivory paper fibre and tooth, extremely
subtle, scanned flat, no visible pattern or repetition, edges tile perfectly.
Transparent background, only the fibre. No colour cast.
```

---

## 4. `binder-ring`（活页环）

| 项 | 值 |
|---|---|
| 尺寸 | 140 × 200 px |
| 透明 | 是 |
| 用法 | `.binder` 的 `background-repeat: repeat-y` |

**构图要求：**

- **一个活页环，垂直居中。**
- **颜色是哑光浅铜灰，接近 `--straw` 偏暖。** 参考图里金属反光的黄铜不要。
- **以勾线为主，只加一层薄涂。**
- **上下边缘必须无缝衔接。** 环的上方和下方要留出空白，这样平铺后环与环之间才有规律的间距。

**生成提示词：**

```
A single ring-binder loop drawn with a soft warm-grey pencil line and a thin
pale antique-bronze wash, matte, slightly irregular, like a picture-book
drawing. Centred vertically with empty space above and below. The top and
bottom edges of the image tile seamlessly.
Transparent background.
```

---

## 5. 三张明信片 `place-beijing` / `place-japan` / `place-paris`

| 项 | 值 |
|---|---|
| 尺寸 | 各 460 × 330 px |
| 透明 | 否（画面满幅） |
| 用法 | `.placeStamp` 里的 `<img>`，外面套 6 号照片框 |

**构图要求：**

- **三张必须同一批出图，风格一致**，而且要和 Experience 重画后的三个场景属于同一色调家族。
- **画面内不要地名文字，也不要白边。** 地名是 DOM，白边由 6 号照片框提供。
- **每张只画一个主体，留出大片天空纸色。**

**生成提示词（按地点替换主体）：**

```
A tiny postcard-sized picture-book illustration.
Subject: [a Beijing palace roof with muted ochre tiles under a pale sky
 / a few dusty-pink cherry blossom branches in front of a faint blue-grey Mount Fuji
 / the Eiffel Tower as a soft pencil silhouette under a pale grey-blue sky with sage trees below].
One simple subject, lots of empty pale sky, very little detail.
No border, no white margin, no signature.
```

---

## 6. `photo-frame`（照片框）

| 项 | 值 |
|---|---|
| 尺寸 | 700 × 780 px |
| 透明 | 是，**内部完全透明** |
| 切片 | 上 / 左 / 右 **48 px**，下 **190 px** |
| 用法 | `.polaroid` 的 `border-image`；真实照片和明信片从中间透出 |

**构图要求：**

- **拍立得式边框**：上、左、右三边窄，下边宽。下边留给图说，但图上不要写字。
- **纸色与 `--paper` 一致或稍亮一点**，外沿加一线淡铅笔边。
- **手裁质感**，不是精确的矩形。
- **中间完全透明。**
- **不画胶带。** 胶带如果需要，另用第 7 类纸片加 CSS 实现。

**生成提示词：**

```
An empty instant-photo paper frame on warm ivory paper, soft warm-grey
pencil edge line. Narrow border on the top and both sides, a much wider
blank border at the bottom. The entire inner window is empty and
transparent. Slightly hand-cut irregular edges, fine paper texture.
No photo inside, no tape, no handwriting. Transparent background.
```

---

## 7. `paper-scrap-wide` / `paper-scrap-block`（灰度纸片）

| 项 | 值 |
|---|---|
| 尺寸 | wide 820 × 440 px；block 620 × 520 px |
| 透明 | 是 |
| 颜色 | **灰度或近白**，颜色由 CSS 上色 |
| 用法 | "What I bring" 四张纸、两张便签、CV 纸签、标题胶带的形状遮罩 |

**为什么要两张：** 能力卡是横向的，便签偏方形。一张图拉伸到两种比例，毛边会变形。

**为什么是灰度：** 同一张图可以用 CSS 上四种颜色。v2 的配色改为色板里的低饱和色：灰粉（由 `--accent` 大幅提亮得到）、`--dust-blue`、`--sage`、`--butter`，每种颜色都以约 25% 的浓度叠在纸上。参考图里那几张偏亮的彩色纸片需要压淡。

**构图要求：**

- **一块手撕或手裁的纸**，四边不规则，有毛边和纤维，外沿可带极淡的铅笔线。
- **纯白到浅灰，不要带色相。**
- **中间平坦均匀。**

**生成提示词：**

```
A single piece of hand-torn white paper, flat frontal scan, greyscale only.
Irregular torn edges with visible paper fibre and a faint pencil edge on all
four sides, fine tooth texture, the centre flat and even. Pure white to
light grey, no colour cast. No fold, no curl.
Transparent background outside the paper.
```

---

## 8. `brush-swipe`（水彩笔触）

| 项 | 值 |
|---|---|
| 尺寸 | 700 × 140 px |
| 透明 | 是 |
| 颜色 | **灰度**，颜色由 CSS 上色 |
| 用法 | 标题底下的高亮笔触，`mask-image`；也用作全站导航的备选选中态（未启用） |

**构图要求：**

- **一笔横扫的水彩，左右两端羽化出去。** 左右各留 40 px 透明余量，不能被画布边缘切断。
- **笔触浓淡不匀，整体偏淡。** 上下边缘不平行，略有起伏。
- **整体向右上飘 1–2°。**

**生成提示词：**

```
A single pale horizontal watercolor brush stroke, greyscale, on white paper.
Soft feathered ends that fade out, uneven light pigment density, slightly
wavy top and bottom edges, drifting up about one degree to the right.
Transparent margin on the left and right so the stroke is not cut off.
No outline, no splatter, no droplets. Transparent background.
```

---

## 9. 不需要出图的部分（由代码实现）

- **图标**：邮箱、LinkedIn、GitHub、下载，以及 "How I got into HCI" 里的四个图标。这些由我用单色线稿 SVG 实现，线宽对齐 Home 的枝条图标，不使用彩色品牌 logo。
- **接触阴影、纸张叠放阴影**：用 CSS 实现。
- **小花、小叶装饰**：优先复用 Home 已有的枝条和花朵资产，不新增。

---

## 交付方式

放到你机器上的 `C:\Users\21781\Documents\ChatGPT\Peiwen-portfolio\design-assets\about\`，保持原始 PNG。

收到后，我会：

1. 生成 `public/assets/about/` 下的 WebP 运行时派生件。
2. 更新 `ASSET_INDEX.md`。
3. 按 `STYLE_GUIDE.md` 第 9 节的清单逐张验收，然后做 asset-integration pass。

原图不会被修改或覆盖。

---

## 接入轮的范围（资产到齐后）

**会做：**

- **用资产替换现有的 CSS/SVG 近似实现**：删掉 4 个 `feTurbulence` 滤镜、CSS 木纹、CSS 皮革渐变、CSS 活页环、CSS 明信片、CSS 不规则圆角。
- **按参考图调整构图**：笔记本缩到约视口的 82%，肖像放大，简介贴近照片，明信片自然簇拥，右页留白加大，纸片行高不齐。整体密度要比参考图低。
- **字体按 `STYLE_GUIDE.md` 第 6 节统一**：手写体用于标题和标签，Nunito 用于正文和联系方式，删除衬线体。
- **Header 换成全站共用组件。**
- **移动端**：一张竖向插画纸页加贴纸式分段，不重建桌面场景。

**不会做：**

- **不重新设计信息架构。** 左页仍是 肖像 / intro / Beijing·Japan·Paris / How I got into HCI，右页仍是 Currently exploring / What I bring / I speak / Contact / CV。
- **不动其他页面的插画和布局。** Home、Experience、Projects、Playground 和全局架构都不在本轮范围内（全站 Header 和字体统一是单独的一轮）。
- **不把页面压成一张图。** 所有文字保持真实 DOM。

---

## 待定项

1. **手写体**：跟随全站规范，使用 Home 当前在用的那一款，接入时在代码中核对。不再单独挑选 Patrick Hand、Caveat 或 Gaegu。
2. **`fonts.ts` 里的 Courier Prime**：在全站字体统一那一轮中换成 Nunito，不等 About 资产到齐。
