# About 页 · 实现交接说明

给 Claude Code 的实现依据。设计已定稿，本文件描述**怎么把它搬进 Next.js 项目**，不涉及重新设计。

- 可交互参考实现：`about-prototype-stickers.html`（单文件，可直接在浏览器打开对照）
- 布局数据：`about-final/layout.js`
- 素材：`about-final/assets/`（58 个 WebP）

---

## 1. 页面结构

```
<main class="about">
  <div class="book">              ← 笔记本插画作底图
    <div class="page left"  />    ← 左页内容容器
    <div class="page right" />    ← 右页内容容器
  </div>
  <nav class="controls" />        ← 跨页切换
</main>
```

**笔记本底图**：`assets/notebook.webp`，`background-size:100% 100%`，容器 `aspect-ratio: 1390/853`，`max-width:1000px`。封面、内衬、活页环、纸页全都画在这一张图里，不要再用 border-image 拼装。

**两个页面容器**（数值是从插画里量出来的纸面位置，不要改）：

| | left | top | width | height |
|---|---|---|---|---|
| `.page.left` | 12.4% | 9% | 31.6% | 81% |
| `.page.right` | 50.9% | 9% | 31.6% | 81% |

两个容器都要 `container-type: inline-size`。**所有字号用 `cqw`**（1cqw = 页面宽度的 1%），不要用 `vw` 或 `px`——否则窗口缩放时文字和贴纸的比例会脱节。

---

## 2. 元素定位

每个元素绝对定位在所属页面容器内，坐标是页面宽高的百分比：

```js
{ left: '51.2%', top: '31.4%', width: '50%', rotate: 11 }
```

- `width` 只给宽度，高度由内容或图片比例决定（写信框例外，它有显式 `height`）
- `rotate` 单位是度，通过 `transform: rotate()`
- 部分元素带 `zoom`（整块缩放）、`filter: saturate()`（单独调饱和度）、`z-index`
- 少数元素坐标为负值或接近 0（如 `peiwen-swim` 在 `left:-25.6%`），是故意让它探出纸面，**页面容器不要设 `overflow:hidden`**

完整数据见 `layout.js`，格式：

```js
st(IMG['leaf-a'], 'left:4.1%;top:11.3%;width:11.6%;', 0)   // 贴纸
el(`<p class="body">…</p>`, 'left:6.1%;top:21.9%;…', 0)     // 文字块
```

---

## 3. 素材清单

**素材文件放在 `public/assets/about/`，代码里用 `/assets/about/<文件名>` 引用。**

`layout.js` 里写的是键名（如 `IMG['leaf-a']`），键名和文件名**不一致**，必须按下表映射：

| 键名 | 文件名 |
|---|---|
| `bird` | `04-sticker-C2-bird.webp` |
| `camera` | `02-sticker-A1-camera.webp` |
| `carousel` | `user-carousel.webp` |
| `clip1` | `02-sticker-A4a-paperclip-straight.webp` |
| `feather` | `03-sticker-B1-feather-ink.webp` |
| `flower` | `02-sticker-A2-flower-smile.webp` |
| `flower-daisy` | `user-flower-daisy.webp` |
| `flower-pink` | `user-flower-pink.webp` |
| `flower-sakura` | `user-flower-sakura.webp` |
| `globe` | `03-sticker-B3-globe.webp` |
| `heart-red` | `user-heart-red.webp` |
| `heart-single` | `user-heart-single.webp` |
| `leaf-a` | `user-leaf-a.webp` |
| `leaf-b` | `user-leaf-b.webp` |
| `leaf-d` | `user-leaf-d.webp` |
| `leaf-f` | `user-leaf-f.webp` |
| `leaf-i` | `user-leaf-i.webp` |
| `leaf-j` | `user-leaf-j.webp` |
| `mailbox` | `05-module-D1-mailbox.webp` |
| `note-thingsilove` | `user-note-thingsilove.webp` |
| `notebook` | `notebook.webp` |
| `notemask` | `notemask.webp` |
| `pass` | `03-sticker-B4-boarding-pass.webp` |
| `peiwen-camera` | `user-peiwen-camera.webp` |
| `peiwen-swim` | `user-peiwen-swim.webp` |
| `pill` | `pill.webp` |
| `pin` | `02-sticker-A3-pushpin.webp` |
| `portrait` | `portrait.webp` |
| `postcard` | `05-module-D2-postcard-panel.webp` |
| `postcard-airmail` | `user-postcard-airmail.webp` |
| `route-map` | `user-route-map.webp` |
| `skillet` | `user-skillet.webp` |
| `spark-2` | `user-spark-2.webp` |
| `spark-3` | `user-spark-3.webp` |
| `suitcase` | `03-sticker-B2-suitcase.webp` |
| `tape-pink-check` | `user-tape-pink-check.webp` |
| `tape-sage-check` | `user-tape-sage-check.webp` |
| `tape-straw-check` | `user-tape-straw-check.webp` |
| `title-beyonddesign` | `user-title-beyonddesign.webp` |
| `title-myjourney` | `user-title-myjourney.webp` |
| `uline` | `uline.webp` |

机器可读的同一份映射在 `assets-manifest.json`，建议直接 import 它来建立键名到路径的字典，不要手抄。

素材规格统一：透明背景（`notebook.webp` 除外）、长边 ≤ 900px、已裁到内容边界——所以 CSS 里的 `width` 就等于图形的实际宽度，不含空白边距。

**另有 12 个文件没有被最终设计引用**（早几轮的产物，清单见 `UNUSED.txt`），可以不复制进 `public/`。

---

## 4. 字体

按 `STYLE_GUIDE.md` 全站规范：

- **Patrick Hand** — 标题、副标题、图说、Quick Facts 的标签与内容、chips、CV 按钮
- **Nunito** — 自我介绍正文、联系方式

Patrick Hand 只有一个字重，**不要设 `font-weight:700`**，否则浏览器合成假粗体会发糊。

---

## 5. 跨页切换

三个跨页：① Intro ② My Journey ③ Beyond。

**笔记本本体不做任何动画**，不要翻页、不要 3D 旋转。切换时：

1. 当前跨页所有元素淡出（200ms，轻微上浮 8px）
2. 新跨页元素**逐个**落位，每个间隔 220ms
3. 单个元素的入场：从 `scale(0.55) rotate(-6deg) translateY(20px)` 弹到最终状态，用 `cubic-bezier(0.34, 1.56, 0.64, 1)`（带过冲回弹）

导航：左右按钮 + 圆点 + 方向键。`prefers-reduced-motion` 下跳过弹跳，只做瞬时切换。

---

## 6. 写信模块（跨页③ 右页）

`postcard-panel.webp` 作 `border-image`（四边切片 60），内部是真实 `<textarea>`。点"Sent"按钮后显示确认文字然后淡出。

**目前是纯前端效果，不会真的发送。** 之后要接真实发送的话，加后端接口或改成 `mailto:`。

---

## 7. 待处理项

### 7.1 图片里的文字（无障碍问题）

四个元素的文字是画死在图里的，屏幕阅读器和搜索引擎读不到。已经为它们加了 `alt`：

| 素材 | alt |
|---|---|
| `title-myjourney` | My Journey |
| `title-beyonddesign` | A little beyond design |
| `route-map` | Route from Beijing to Osaka to Paris |
| `note-thingsilove` | Things I love: swimming, taking photos, travelling and exploring, cooking, discovering new possibilities in life |

`alt` 是最低限度的补救。**如果要做得更正规**，`note-thingsilove` 应该拆成：纸片底图 + `tape-pink-check` + `title-thingsilove` + 五条 DOM 文字（用 `heart-single` 作项目符号）。这样文字可选中、可改、可缩放。跨页① 的 Quick Facts 便签就是这种做法，可以照搬。这一项没做，因为用户选择了保留成品图。

### 7.2 移动端

**完全没做。** 现有实现只适配桌面。规格书里写的方案是"一张竖向插画纸页加贴纸式分段，不重建桌面场景"，需要单独设计一轮。当前这套双页并排的结构在窄屏下会挤成一团。

### 7.3 未接入的内容

- **CV 下载按钮**目前 `href="#"`，需要填真实 PDF 地址
- **LinkedIn** 没有链接，联系方式只有 Email 和 GitHub

---

## 8. 验收清单

按项目规范，每个 visual pass 后要检查：

- [ ] 桌面端三个跨页排版正确、无溢出
- [ ] 移动端（**目前必然不通过**，见 7.2）
- [ ] `prefers-reduced-motion` 下动画降级正常
- [ ] 键盘可操作：方向键切换跨页，Tab 能到达链接和输入框
- [ ] lint / typecheck / build 通过

---

## 附：本轮做的三项规整

1. **去重** —— 编辑器导出里有 19 个元素重复（同一坐标叠了两份），已合并
2. **坐标归位** —— 原本有 19 个元素写在左页容器里但坐标超过 100%（实际渲染在右页），已改挂到右页容器并按 `新值 = 旧值 − 121.84` 换算，视觉位置不变
3. **文案统一** —— 写信模块的"收到啦 ✓"改成"Sent ✓"；空的 placeholder 补成 "A thought, a question, or just a little hello…"
