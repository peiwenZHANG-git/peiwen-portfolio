# Experience × About 画风统一（2026-09-20）

> 状态：**已由用户在对比页上选定**（滑杆 71%，About 去掉纯装饰贴纸，Experience 不加贴纸）。
> 本文件优先于 `design-assets/about/IMPLEMENTATION.md` 里与颜色、饱和度、装饰贴纸有关的描述。
> `layout.js` 与 `about-prototype-stickers.html` 已按本文件更新，二者和本文件一致。

## 为什么改

同时打开 `/experience` 和 `/about`，看起来不像同一个网站。实测整页平均 HSV 饱和度：
Experience **0.074**，About **0.180**，相差约 2.4 倍。About 的深红皮面是全页最重的色块，
贴纸在制作过程中被累计提高了约 1.8 倍饱和度，装饰贴纸也超出了"不得为了丰富而增加素材"的原则。

处理方式是**两边向中间靠拢**：Experience 略提饱和、略加暖；About 往回收，并且减少装饰。
全部用 CSS 实现，**不重新出图**。

## 1. 两页共用

| 项 | 值 |
|---|---|
| 页面底色 | `#F4EDE1` |

Experience 当前是 `#F7F1E7`，About 当前是 `#EDE4D6` 加两团径向晕染（晕染删除）。
Home（Static Master，`#F7F3E9`）按 STYLE_GUIDE 冻结，**不改**。两者差距很小，不影响跳转观感；
如果并排检查时觉得有落差，再单独讨论，不要自行改 Home。

## 2. Experience（`app/experience/`）

| 作用对象 | 滤镜 |
|---|---|
| 场景插画（`.scene`，三张季节场景） | `saturate(1.32) sepia(.05)` |
| 纪念品图片（地铁票 / 银杏叶 / 樱花，含目录里的已收集状态和飞入动画） | `saturate(1.32) sepia(.05)` |
| 手账卡片右上角的票根小图 | `saturate(1.32) sepia(.05)` |

**不要作用到：**

- **Peiwen 精灵**：全站形象以 Home 为准，颜色不能变
- **文字、Header、界面控件**
- **飘落粒子**：数量多、每帧更新，加 filter 容易掉帧；如果看起来和场景不协调，先截图，不要自行处理
- **纪念品未收集时的灰色状态**（`grayscale(1)` 保持不变，收集后才叠加上面的滤镜）

同一个元素已有其他 filter 时（例如 drop-shadow），把 `saturate(...) sepia(...)` 拼在已有 filter 前面，
不要覆盖掉原有的值。

## 3. About（`app/about/`）

| 作用对象 | 值 |
|---|---|
| 所有贴纸图片（`Sticker` 组件里的 `<img>`） | `filter: saturate(.70)` |
| 笔记本底图 | `filter: saturate(.65) sepia(.20) brightness(1.06) contrast(.93)` |
| 人像照片（拍立得里的 `portrait.webp`） | `filter: saturate(.87) sepia(.07)` |
| 笔记本整体投影 | `drop-shadow(0 8px 20px rgba(90,70,45,.12))`（原来是 `.20`） |

**笔记本底图的滤镜必须单独加在一层上**（例如 `::before` 或独立的 div），不能直接写在书的容器上，
否则左右页面里的所有内容都会被一起染色。参考原型里的写法：

```css
.book::before {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: url(/assets/about/notebook.webp);
  background-size: 100% 100%;
  filter: saturate(.65) sepia(.20) brightness(1.06) contrast(.93);
}
.page { z-index: 1; }
```

### 3.1 布局数据的变化（`layout.js`）

- **删除 24 个纯装饰元素**：所有 `leaf-*`、`spark-*`、`heart-*`、配角的 `flower-daisy` / `flower-pink`、
  `tape-straw-check` / `tape-sage-check`，以及手写 SVG 的小爱心和小闪线。三个跨页的主体内容全部保留。
- **三处单独加过的饱和度往回收**：拍立得背板 `2.5 → 1.44`，chips `1.6 → 1.17`，CV 按钮 `1.9 → 1.26`。

删除后每个跨页的元素数量：

| 跨页 | 左页 | 右页 |
|---|---|---|
| ① Intro | 8 | 6 |
| ② My Journey | 4 | 7 |
| ③ Beyond | 5 | 8 |

## 4. 验收

- [ ] 两个页面并排截图，颜色的"响度"看起来是同一个网站
- [ ] Peiwen 在 Experience 里的颜色与改动前一致
- [ ] About 笔记本页面里的文字没有被染色（和改动前同样清晰）
- [ ] reduced motion 下正常
- [ ] lint / typecheck / build 通过
