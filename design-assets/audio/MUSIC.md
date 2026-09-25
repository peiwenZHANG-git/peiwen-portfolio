# 背景音乐（2026-09-21）

用户确认的方案：**全站一首**、**手绘唱片机开关**、曲子先用占位。

## 机制

- 拆成三块：
  - `components/site-audio.tsx`：只有 `<audio>` 元素，挂在 `app/layout.tsx` 的 `<body>` 里，
    只挂载一次，所以 Home / Experience / About 之间跳转时音乐不中断、不重新开始。
  - `components/music-toggle.tsx`：可见的开关，放在**顶栏 中 / EN 后面**（2026-09-21 用户决定）。
    因为按钮在顶栏、音频在根布局，是两棵树，所以用下面这个共享状态连起来。
  - `components/music-store.ts`：模块级单例 + `useSyncExternalStore`，管播放状态、淡入淡出、
    localStorage 和被拦截后的手势补播。
- 顶栏有两套：`components/site-header.tsx`（Experience / About）和 `app/home-master.tsx`
  （Home 自己的绝对定位顶栏，`.music` 放在 left 1380 / top 30）。两处都要放开关。
  **Home 是冻结的 static master，这是唯一加进去的元素。**
- **默认关闭**。浏览器不允许自动播放有声音的媒体，而且不该对着陌生人直接出声。
- 开关状态记在 `localStorage["pw-music"]`。回访的人如果上次是开的，进站会尝试恢复；
  浏览器拒绝时（还没有交互手势）不弹提示，而是挂一次性监听，等他第一次点击/按键时开始。
- 音量 0.22，开关都带 700ms 淡入淡出，不会"砰"一下。
- `prefers-reduced-motion`：唱片不转，淡入淡出也跳过。
- 私密模式下 localStorage 抛异常时静默失败，保持关闭。

## 素材

- 音频：`public/assets/audio/theme-loop.ogg` + `.mp3`（两个格式，Chrome/Firefox 走 ogg，
  Safari 走 mp3）。当前是占位：软钢琴，Am7–Fmaj7–Cmaj7–G6，72 BPM，26.67 秒，首尾无缝。
  换正式曲子时保持同样的文件名和时长量级即可，代码不用改。
- 控件图形：**当前是 SVG 占位**，画在 `music-toggle.tsx` 里。正式版应为手绘黑胶贴纸，
  批准后替换 `<svg>`，同时删掉 CSS 里的 .disc / .groove / .hole 颜色规则。转动的只能是唱片本体。

## 外观

一张实心黑胶（26px，手机横屏 22px）加一个音符：
- **关**：唱片和音符都是淡的（0.62 / 0.3），静止。
- **开**：唱片变实、3.4 秒转一圈，音符亮起并轻轻上下浮动。
- 唱片上有两道高光弧和标签旁一个小白点。**同心圆是完全对称的，没有这两样东西，
  转多快都看不出在转**，换手绘贴纸时也必须保留某种不对称的标记。
- `prefers-reduced-motion`：不转、不浮动、不做过渡。

## 待办

- 正式曲子（可商用授权）。
- 手绘唱片机贴纸。
- 是否需要首次进站的一次性提示（"有背景音乐"），目前没有做。
