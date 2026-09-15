# Pass 01 · Storybook 外壳对齐 Home（英文版，纯代码）

- **分支**：`visual-direction-v2`（已确认）
- **依据**：`STYLE_GUIDE.md`（已批准，已按仓库现状核对，见文件开头的说明）
- **版本**：v2，已按实际仓库重新划定范围；**v2.1（2026-09-15）**写入下方「裁决记录」的 4 条

## 范围

**本轮只动 `/storybook`**（已实现的 Saclay → transition → CUC 两章），目标是让它的外壳和画风向 Home 靠拢。

以下内容本轮**不动**：

- **Home**：Static Master 已冻结。Home 是参照物，渲染结果必须保持像素级不变。当前允许的 `/?peiwen-phase1=1` 也不碰。
  **不变性基线 = `/?static-reconstruction=1` 和 `/?peiwen-phase1=1`**（Static Master），不是 `/`。
- **`/` 上的 `HomeHub`**：更早的实现，本轮不作为基准、也不改动。
- **`/experience`**：保留的 walking prototype。
- **`/about`**：仍在冻结中，只替换文档。
- **`fonts.ts` 里 About 使用的字体项**：如果删除 Courier Prime 会影响 About 的渲染，就保留它，留到 About 接入轮再改。
- **Japan 章节**：仍是 planned，本轮不新建。
- **Projects / Playground**：路由尚未建立。
- 任何插画源文件、信息架构、Experience 交互、中文模式。

## 裁决记录（2026-09-15，用户确认）

1. **「Home」= Static Master**（`app/home-master.tsx` + `public/home-master/master.png`）。不变性基线改为
   `/?static-reconstruction=1` 和 `/?peiwen-phase1=1`；`/` 上的 `HomeHub` 保持不动，也不作为基准。
2. **手写体 = Patrick Hand**（`next/font/google`, weight 400）。已回填 `STYLE_GUIDE.md` 6.1。
   `HomeHub` 用的系统字体栈（Segoe Print / Bradley Hand / Comic Sans MS / cursive）不是标准。
3. **色板来源**：Master 代码里有值的以 `app/home-master.module.css` 为准，没有的保留 `master.png` 取样值。
   新变量一律用 `--pw-*` 命名空间，**不得覆盖 `app/globals.css` `:root` 里已有的 `--paper` / `--ink` / `--muted`**
   （那是旧 Experience 原型的蓝紫色，覆盖会污染 `/experience`）。已回填 `STYLE_GUIDE.md` 第 2 节。
4. **Header 与页码是新建，不是对齐**：`/storybook` 目前没有 Header、没有页码、没有衬线体、没有文字发光、
   没有公司图标、没有剪影边。Header 以 **Master 的 header** 为模板（不是 `HomeHub` 的），抽取时 Master 渲染必须不变。
   storybook 内用 Patrick Hand + Nunito 替换 Geist，**作用域仅限 storybook**。
5. **饱和度**（实测后修订，详见 `STYLE_GUIDE.md` 第 11 节）：
   - **Saclay：`saturate(1.00)`** + 轻微暖移 + **减弱纸色 multiply 的 opacity**。原始 HSV-S 0.1191 已与 Home
     插画带 0.1189 相同，仅叠加层就压到 0.0796；`.90` 会掉到 0.0729，过灰。它的问题是色相不是饱和度。
   - **CUC：保持 `saturate(.50)`**，实测 0.2578。压到 0.15 需要 `.19`，接近去色。
   - **0.13–0.15 改写为「重画后的终点目标」**，不是本轮滤镜的目标。

## 开工前

1. **阅读文档**：`AGENTS.md`、`CLAUDE_HANDOFF.md`、`PROJECT_STATE.md`、`VISUAL_DIRECTION.md`、`ASSET_INDEX.md`、`README.md`、`STYLE_GUIDE.md`。
2. **替换文档**：把 `claude/about-asset-spec.md` 替换为根目录的 `about-asset-spec.md`。这里只替换文档，About 仍然冻结。
3. **核对字体和颜色**：
   - ~~核对 Home 实际加载的手写体，把字体名回填到 `STYLE_GUIDE.md` 第 6.1 节。~~ **已完成：Patrick Hand。**
   - ~~核对 Home 实际使用的颜色值。~~ **已完成**：以 `home-master.module.css` 为准，已回填规范第 2 节，
     并改用 `--pw-*` 命名空间。
4. **并入规范**：把 `STYLE_GUIDE.md` 的要点并入 `VISUAL_DIRECTION.md`，同时保留"Home 冻结"这一条的原文。
5. **截取基线**：先截 `/?static-reconstruction=1`、`/?peiwen-phase1=1` 和 `/storybook`（两章）的 before 截图，
   桌面 1440 宽 + 移动 390 宽。Static Master 的 before 截图同时作为不变性的基线。

## 提交计划

每一步单独提交。

1. **tokens**：从 Home 现有样式中抽出色板变量，供 storybook 使用。Home 的样式值保持不变，只允许做"等值替换"。
2. **fonts**：`/storybook` 改用 Home 的手写体和 Nunito，删除 storybook 中的衬线体，并去掉所有文字外发光。
3. **header**：让 `/storybook` 的 Header 与 Home 一致。
   - 如果 Home 已有可复用的组件，就直接复用。
   - 如果需要抽取组件，Home 的截图必须与基线一致，否则这一步改为"storybook 对齐 Home"，不改 Home 本身。
4. **storybook 文字与页码**：
   - 正文、公司名、职位信息改用 Nunito。
   - 公司图标改成单色线稿。
   - 页码格式为 `01 / 02`，分母从章节数据读取。
   - 操作提示改用手写体。
5. **过渡滤镜**（按规范第 11 节）：
   - ~~在实际运行时资产上测量饱和度。~~ **已完成**，结论见上方「裁决记录」第 5 条：
     Saclay `saturate(1.00)` + 暖移 + 减弱纸色 multiply，CUC 保持 `saturate(.50)`。
     `--scene-paper` 与 `--scene-warm` 的具体数值仍需在 1440 / 390 截图上目视定稿。
   - 加上纸色叠加和柔边遮罩（`public/assets/ui/edge-wash.webp`，用程序生成）。
   - 移除现有的剪影边。
   - 滤镜不能作用到单独一层的 Peiwen 上。transition 段的处理要和前后两章衔接自然。

## 验收

- **Home 不变性**：`/?static-reconstruction=1` 和 `/?peiwen-phase1=1` 的 before / after 截图必须一致。
  有任何差异就停下来报告。`/`（HomeHub）本轮不改动，也一并复查。
- **`/storybook`**：两章都要截 before / after，桌面 1440 宽 + 移动 390 宽。
- **交互检查**：reduced motion、键盘翻页、触控滑动。
- **构建检查**：`lint`、`typecheck`、`build` 全部通过。任何没跑的检查都标为"未验证"。
- **状态记录**：更新 `PROJECT_STATE.md` 和 `CLAUDE_HANDOFF.md`。
