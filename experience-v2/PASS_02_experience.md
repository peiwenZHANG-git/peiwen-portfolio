# Pass 02 · 正式实现 Experience 页（英文版）

- **依据**：`EXPERIENCE_SPEC.md`（设计竣工版）、`STYLE_GUIDE.md`（含 7.5 指针、9.5 全站故事逻辑）
- **交互与视觉参考**：`experience-prototype-v2.html`，这是可直接在浏览器打开的单文件小样。**所有尺寸、时长、文案、动效参数都以它为准**；如果小样和规格书有冲突，以小样为准，并记录下来。
- **素材**：`experience-v2-assets.zip`

---

## 0. 开工前

1. 阅读 `AGENTS.md`、`CLAUDE_HANDOFF.md`、`PROJECT_STATE.md`、`VISUAL_DIRECTION.md`、`ASSET_INDEX.md`、`STYLE_GUIDE.md`、`EXPERIENCE_SPEC.md`。
2. **Codex 可能仍在主文件夹里修改 Home。** 先运行 `git status`。如果主文件夹里有不是你的未提交改动，**不要碰、不要提交**，并从 `visual-direction-v2` 的最新提交新建独立工作区：
   ```
   git worktree add ../Peiwen-portfolio-exp -b experience-v2
   ```
   之后所有工作都在该工作区里进行。
3. `pass-01-unify-shell` 分支属于已放弃的 storybook 方向，**不合并**。其中的 `--pw-*` 色板、字体配置和 Header 写法可以参考，但不要直接合并。
4. 截取 before 截图：`/`、`/?static-reconstruction=1`、`/experience`，桌面端和移动端各一套。

## 1. 需要先停下来问 Peiwen 的事

- **路由。** 本方案计划让新页面**替换** `/experience`，并把旧的 R3F 原型移到 `/lab/experience-3d` 保留，不删除。开始写代码前先确认这一点；如果 Peiwen 不同意，改用 `/experience-v2`。
- **任何需要修改 Home 相关文件的情况**（`app/page.tsx`、`app/home-master.*`、`app/peiwen-phase-*`、`app/home-hub.*`、`app/globals.css` 的 `:root`）。

## 2. 素材接入

1. 把 zip 中的原图放到 `design-assets/experience-v2/`（原图不修改）：
   - `scenes/`：3 张场景图
   - `keepsakes/`：3 件纪念品
   - `peiwen-walk/`：4 帧走路图
   - 外加 6 张指针图
2. 在 `public/assets/experience/` 下生成运行时文件：
   - **场景**：WebP，宽 1400 和 2400 各一份（带透明通道）。
   - **纪念品**：WebP 或 PNG，180 px 和 64 px 各一份（64 px 用作飘落物）。
   - **走路帧**：4 帧按**同一个裁切框**裁掉空白，统一高度 400 px。**不能各自裁切**，否则走路时人物会左右抖动。脚底线距底边约 3 px。
   - **指针**：放到 `public/assets/ui/`，保留 1x 和 2x。
3. 更新 `ASSET_INDEX.md`，写明来源、尺寸和用途。

## 3. 实现清单（每一步单独 commit）

1. **route-shell**：新路由骨架、页面级 Patrick Hand + Nunito（`next/font`，作用域限于该页）、`--pw-*` 设计变量（挂在页面根类上，不动 `:root`）、共用 Header（按 Master 的样子，不从 Home 代码抽取）。
2. **content**：把章节数据写成类型化的数据文件（例如 `lib/experience.ts`），包含三章的全部文案，与小样完全一致。页面文字全部是真实 DOM。
3. **layout**：标题、贴纸短语、事实行；左栏（舞台、纪念品目录、箭头和提示）在桌面端 sticky；右栏为手账页；移动端改为单列。
4. **stage**：场景切换（滑动和淡入淡出）、Peiwen 走出走入（走路帧 150 ms 一帧，往回走时翻转）、各场景的脚底高度和背景定位。
5. **keepsakes**：目录（未到达显示灰色、到达后变彩色、当前站有下划线）、第一次到达时纪念品飞入格子的动画、"n of 3 kept" 计数。
6. **journal**：撕边纸页、车票存根、胶带贴纪念品、翻页动画、数字成果高亮。
7. **drift**：三种飘落动效，参数照搬小样（层数、数量、尺寸、速度、风向、摇摆、翻面、渐显淡出）。实现方式为独立组件，用 `requestAnimationFrame` 驱动，页面不可见时暂停。
8. **cursor-and-feedback**：铅笔、手和握拳指针，hover 时画线，点击时画圈，插画区域内的脚印。只在 `pointer: fine` 时启用 JS 效果。
9. **a11y-and-motion**：
   - 键盘：← → 切换章节；纪念品按钮有清楚的 `aria-label` 和 `aria-current`；focus 环使用 `--accent`。
   - 触屏：滑动切换。
   - `prefers-reduced-motion`：关闭走路、飞入、翻页、飘落、画线、画圈、脚印，直接切换。
   - 动画进行中忽略重复触发。
10. **docs**：更新 `PROJECT_STATE.md`、`CLAUDE_HANDOFF.md`、`VISUAL_DIRECTION.md`（记录 Experience v2 已实现，并保留 Home 冻结的原文）。

## 4. 不做的事

- 不修改 Home、About、Projects、Playground，也不修改全局架构。
- 不做中文版（`中 / EN` 保持现状）。
- 不修改或重画任何素材，不新增素材。
- 不引入新依赖。如果需要截图工具，用 `npm install --no-save` 临时安装。
- 不 push，不合并回 `visual-direction-v2`。

## 5. 验收（全部完成后停下来汇报）

- **截图对比**：新页面和小样并排，桌面 1440×900 和移动 390×844，三章各一张。另附第一屏截图，确认左栏在 1440×900 下完整可见。
- **Home 不变性**：`/?static-reconstruction=1` 的 before 和 after 截图一致。
- **交互检查**：键盘、触屏滑动、reduced motion、页面不可见时暂停，逐项验证。
- **构建检查**：`lint`、`typecheck`、`build` 全部通过，没跑的标注"未验证"。
- **性能**：首屏场景图使用优先加载，其余两张懒加载；控制台零报错。
- **汇报内容**：用一段话说明完成了什么、和小样有哪些差异、还剩什么问题。
