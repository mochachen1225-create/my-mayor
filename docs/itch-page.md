# itch.io 上架資料

## 基本設定
| 欄位 | 填什麼 |
|---|---|
| Title | My Mayor-to-Be（我推的市長） |
| Project URL | my-mayor（例如 `你的帳號.itch.io/my-mayor`） |
| Short description / tagline | You're the burnt-out campaign manager. Your candidate is random. Get them elected in 10 minutes. |
| Classification | Games |
| Kind of project | HTML |
| Release status | Released |
| Pricing | No payments（或 Donate，讓喜歡的人自由贊助） |
| Uploads | `my-mayor-itch.zip`，勾選 **This file will be played in the browser** |
| Embed options | Viewport 420 × 860；勾 **Mobile friendly**（Orientation: Portrait）、**Fullscreen button**；不勾 Automatically start on page load |
| Genre | Simulation |
| Tags | politics, satire, election, taiwan, choices-matter, multiple-endings, text-based, funny, mobile, short |
| Languages | English, Chinese (Traditional) |
| Inputs | Mouse, Touchscreen |
| Average session | About a half-hour（實際一局約 10 分鐘） |
| AI disclosure | 角色插畫用 AI 生成（itch.io 有「是否使用生成式 AI」的欄位，照實勾選） |

## itch 更新流程（2026-11-01 定案）
- **平常**：設計對話改好遊戲、推上 GitHub，通知總編。推上去**不會**自動更新 itch。
- **上線**：總編在開發日誌註明要順便更新哪個遊戲；**每週六台灣時間 13:00** 那一輪，作者 Mac 上的小弟腳本會先抓 repo 預設分支的最新版、跑 `scripts/build-itch.sh`、用 butler 傳到 `mocha-cat-team/my-mayor:html5`，成功後才發日誌。作者不用按任何東西。
- **要趕週六上線的修正**：當天台灣時間 13:00 前推上去。
- **金鑰**：存在 Mac 的 `butler login`，不放在 GitHub。
- **第一次用 butler 上傳之後（每個遊戲只做一次）**：到 itch 的 Edit game → Uploads，把新出現的 `html5` 檔勾 **This file will be played in the browser**，再刪掉舊的手動 zip。之後的更新都會沿用。
- `scripts/build-itch.sh` 要保持在一般 Mac 上能直接跑（bash＋zip，不依賴 CI）。
- **備用**：`.github/workflows/itch.yml` 可以在 GitHub Actions 手動按 Run workflow 上傳，但要在 GitHub Secrets 設 `BUTLER_API_KEY` 才會跑；目前沒設，不使用。
- **Newgrounds**：沒有上傳工具，作者手動上傳 `scripts/build-newgrounds.sh` 打包的 zip。

## 封面與截圖
- 已做好：`promo/itch/cover-630x500.png`（封面）、`promo/itch/screenshot-en-1~6.png`（英文截圖）、`promo/itch/screenshot-zh-1~6.png`（中文版，可當 IG 輪播）、試玩廣告 `promo/my-mayor-trailer-en.mp4`／`-zh.mp4`
- 封面圖（Cover image）：建議 630 × 500，可以用 `og.png` 改尺寸，或截首頁
- 截圖 3～5 張：首頁、抽老闆、突發事件卡、菜市場掃街小遊戲、開票夜
- 宣傳影片：`promo/my-mayor-promo.mp4`（上傳到 YouTube 後把連結貼在 Gameplay video）

## 頁面內容（英文）

**You're the campaign manager. Your boss is random. Your liver is not.**

*My Mayor-to-Be* is a short, satirical election game set in N City, a fictional Taiwanese metropolis. Four months until Election Day. One exhausted campaign manager. And a candidate you didn't get to choose.

Will you get the third-generation political heir who has never taken a bus? The idealistic professional who writes 40-page policy papers no one reads? The tycoon who thinks a city is just a big company? Or the incumbent mayor with four years of potholes to explain?

**How it plays**
- 🔥 **Put out fires.** Rats on the evening news. A typhoon: day off or not? Your social media intern just posted from the wrong account. You have 20 seconds.
- ✨ **Build up the boss.** Rallies, temple visits, talk shows, market walkabouts. Pick what to do on quiet days.
- 🤝 **Your boss doesn't always listen.** Earn their trust, or watch them improvise in front of the cameras.
- 📊 **Monthly internal polls**, then a 10-day polling blackout before Election Day. You're flying blind.
- 🏃 **Mini-game:** shake as many hands as you can at the morning market. Grandmas count triple.
- 🧵 **Netizens react to everything** on Crisp, the in-game social network.
- 📺 **Election night:** a live count, anchors calling the race, and the occasional last-minute comeback.

**58 endings.** 43 for your candidate, and 15 for you. Did you become the loyal right hand, the one who gets indicted, or the last person turning off the lights in the empty war room?

**About the setting**
Everything is fictional: the city, the people, the animal-themed parties. The *rituals* are real Taiwanese election culture: morning-market handshakes, election-eve rallies, the chant of “Dong-suan!” (Taiwanese for “get elected!”), and the polling blackout. The game satirizes campaign culture on all sides, not any real party or person. A short primer on the title screen explains the basics.

- ⏱ About 10 minutes per run
- 🐢 Too fast? Turn on **Take-It-Easy mode** on the title screen to remove all timers
- 📱 Made for phones, works on desktop
- 🌏 English / 繁體中文 (auto-detected, switchable on the title screen)
- 💾 Progress and unlocked endings are saved in your browser

## 頁面內容（中文，可以放在英文下面）

**你是競選總幹事。老闆是抽到的。肝是你自己的。**

《我推的市長》是一款以虛構城市 N City 為舞台的選舉小遊戲。離投票還有四個月，你要把一個不是你選的老闆送上市長寶座。

- 有火就滅火：老鼠上新聞、颱風要不要放假、小編用錯帳號，20 秒內決定
- 沒火就成就老闆：造勢、跑廟、上政論節目、菜市場掃街
- 老闆不一定聽你的
- 每月內參民調，最後 10 天民調封關
- 58 種結局：老闆的 43 種，加上你自己的 15 種

一局約 10 分鐘，手機直接玩。本遊戲純屬虛構，人物、政黨、城市皆非真實。

## Devlog 第一篇（已發布，2026-11-01）

**標題**：Why I made a game about Taiwanese election chaos

> Every four years, Taiwan turns into a festival of campaign trucks, flags, and candidates shaking hands at 6 a.m. morning markets. Supporters chant “Dong-suan!” (Taiwanese for “get elected!”). Rats make the evening news. Someone always has to decide whether tomorrow is a typhoon day off.
>
> Taiwan's real local elections are on November 28. So I made a small game about the people behind the candidates: the exhausted campaign managers.
>
> In *My Mayor-to-Be*, your candidate is random, they don't always listen, and the internet has an opinion about everything you do. One run takes about 10 minutes, and there are 58 endings, including some where the campaign manager ends up in more trouble than the candidate.
>
> Everything is fictional: the city, the people, the animal parties. It pokes fun at campaign culture on all sides, not at anyone real.
>
> The English version is brand new, so if anything reads strangely, please tell me. And I'd love to know: which ending did you get?

- 第二篇：選舉當週（11/28 前後）發，例如「Taiwan votes today! Here's what election night looks like in the game」，順便加一點新內容

## YouTube Shorts（英文版廣告 `promo/my-mayor-trailer-en.mp4`）

**標題**：In Taiwan, grandmas count triple votes 👵🗳️

**說明欄**：
> A tiny browser game about running a Taiwanese mayoral campaign. Your boss is random. Your liver is not.
> Free to play: search “My Mayor-to-Be” on itch.io
> (link in channel profile)
>
> #indiegame #taiwan #browsergame #election #gamedev

- Shorts 說明欄和留言的連結不能點：把 itch 連結放在頻道個人資料（Customization → Basic info → Links）
- 上傳後把 Shorts 網址貼回 itch 頁面的 Gameplay video
- 中文版（`promo/my-mayor-trailer-zh.mp4`）可另外上傳，標題例如「台灣選舉的總幹事有多慘」

## 宣傳紀錄
| 日期 | 管道 | 內容 |
|---|---|---|
| 2026-11-01 | itch Devlog | Why I made a game about Taiwanese election chaos |
| 2026-11-01 | YouTube Shorts | 英文版試玩廣告（In Taiwan, grandmas count triple votes） |
| 2026-11-01 | Newgrounds | 上傳，https://www.newgrounds.com/portal/view/1059947 （審核中） |
| 2026-11-01 | Reddit r/playmygame | 功能介紹型貼文（附截圖、Shorts） |
| 2026-11-01 | Reddit r/BrowserGaming | 標題梗「My Mayor-to-Be: my candidate won and thanked everyone… except me」＋ itch 連結＋自己留第一則留言 |

### 已做好、待排程的素材
- `promo/my-mayor-debate-zh.mp4`／`-en.mp4`：辯論升級短片（11/14，跟開發日誌 #3 同天；Shorts、脆、IG）
- `promo/my-mayor-election-night-zh.mp4`／`-en.mp4`：開票夜短片（11/29 選後回顧，跟開發日誌 #4 一起；投票日當天和前幾天不發選舉相關內容）
- 兩支都含 AI 生成畫面（左下角已標示），上傳 YouTube／IG 時也要勾 AI 標示

- `promo/kv/`：主視覺圖（作者生成的 AI 圖，左下角已標示）。`debate-*`（11/14）、`election-*`（11/29）；`-wide` 是 1920×1080，給開發日誌封面；`-square` 是 1080×1080，給 IG／脆；`-zh`／`-en` 有標題，`-clean` 沒標題，可以自己加字

### 之後
- r/taiwan：帳號太新不能發，養 1～2 週後再發（稿子在對話紀錄，發前更新日期）
- Newgrounds 審核通過後：發自我介紹 News Post
- 11/23～11/29 選舉週：itch 第二篇 Devlog、投票日當天各平台發一則
- 脆：中文貼文＋中文版廣告
