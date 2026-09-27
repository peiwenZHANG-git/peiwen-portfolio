# 背景音乐与声音（2026-09-25 重做，替代 2026-09-21 的单曲占位版）

## 用户决定

- 背景音乐是 **9 首随机播放**：每次来访从随机一首开始，放完再随机换一首，不会连着
  两次同一首。点列表里的某首就先放它，之后继续随机。候选里的 Cold Winter Night 没有选。
- 点右上角的唱片会**展开一个小纸片面板**，里面只有播放/暂停和曲目列表（2026-09-25 用户决定去掉雪声、音效两个开关）。
- **默认全部出声**：音乐、窗外的雪声（很轻，无缝循环）、About 和 Experience 的翻页声、
  Experience 里佩文走路时雪地上的脚步声、Projects 戳猫的叫声。
  唱片面板里的暂停**只停背景音乐**，雪声和音效一直保持开着（用户决定）。暂停会被记住。
- 猫有**四种叫声**，分别对应它的四种气泡：Mew! / Mrrp? / Prrr… / Meow~。随机出现，
  但不会连续两次一样。

## 机制

- `components/sound-library.ts`：曲目表、雪声和音效文件的路径。
- `components/music-store.ts`：模块级单例，用 `useSyncExternalStore` 读取。
  - `<audio>` 元素由它创建，所以跨页面跳转声音不断。
  - 管理音乐、雪声、音效三路声音，以及淡入淡出和 localStorage 记忆（`pw-sound`，
    会兼容读取旧的 `pw-music`）。
- `components/music-toggle.tsx`：顶栏的唱片和展开的面板。Esc 或点击面板外面会关闭。
- `components/site-audio.tsx`：挂在 layout 里，页面加载时恢复访客上次的选择。
- 声音规则：
  - **默认开启**。浏览器不允许自动播放有声音的媒体，所以第一次来访时，声音从访客第一次
    点击或按键开始（在 Home 上就是点开窗户那一下）。
  - 暂停只停背景音乐；雪声和音效（翻页、脚步、猫）始终开着。音乐的暂停状态记在
    localStorage（`pw-sound`），下次来访继续暂停。
- 音量：音乐 0.22，雪声 0.10，音效 0.32；音乐和雪声开关时有 700ms 淡入淡出。
  `prefers-reduced-motion` 下不做淡入淡出，唱片也不转。

## 素材

- 全部来自 Pixabay（Pixabay Content License：可免费商用，不要求署名；面板底部仍然写了
  “Music & sounds from Pixabay”）。
- 原始下载放在 `design-assets/audio/incoming/`，不进 Git，因为太大。
- 由 `scripts/prepare-audio.sh` 生成网站用的文件：
  - 音乐（`public/assets/audio/music/*.ogg|mp3`）：去掉首尾静音，响度统一到 -18 LUFS，
    1.2 秒淡入、3 秒淡出，96 kbps。
  - 雪声（`public/assets/audio/ambience/snow.*`）：取 56 秒一段，首尾交叉淡化做成无缝循环，
    响度 -26 LUFS。
  - 音效（`public/assets/audio/effects/*`）：翻页一个、猫叫四个，裁剪后统一响度。

| id | 曲名 | 作者 | Pixabay |
|---|---|---|---|
| echoes-of-winter | Echoes of Winter v1 | pardeeppatel | 274285 |
| snowy | Snowy | musingmoon | 269988 |
| nostalgic-winter | Nostalgic Winter Reflections | Metriko | 364732 |
| magical-celesta | Magical Fantasy Celesta | MusicViktor11 | 410854 |
| ballerina-shoes | Ballerina Shoes | geoffharvey | 222867 |
| fairys-farewell | Fairy's Farewell | Whatssmooth | 426378 |
| dreamy-whispers | Dreamy Whispers | Mohamed_hassan | 360533 |
| music-box-lullaby | Music Box Lullaby | Music_For_Videos | 165273 |
| music-box-melody | Music Box Melody | AmarantaMusic | 163538 |
| (snow) | Cold Snowfall Ambience | joelfazhari | 164512 |
| page-turn | Turn a Page | creatorshome | 336933 |
| cat-mew | Cute Cat Meow | dragon-studio | 472372 |
| cat-meow | Cat Meow Sound | virtual_vibes | 383823 |
| cat-mrrp | Cutie Cat | koiroylers | 355747 |
| cat-purr | Cat Purr SFX | dragon-studio | 482870 |
| snow-steps | Footsteps in thin snow | freesound_community | 46199 |

旧的占位曲 `public/assets/audio/theme-loop.*` 已不再使用，可以删掉。
