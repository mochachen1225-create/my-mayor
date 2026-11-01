# scripts：可重複使用的工具

這些是從《我推的市長》抽出來的，**用在新遊戲前要照實際的檔名、函式名、畫面調整**，不要盲目直接跑。

| 檔案 | 用途 | 需要 |
|---|---|---|
| `wrap_i18n.js` | 把 JS 檔裡的中文字串包成 `T('…', 參數)`；樣板字串會在 HTML 標籤處切開 | `npm i acorn acorn-walk` |
| `rename_local_t.js` | 把函式裡「名稱是 T」的區域變數改名成 `TY`，避免蓋掉翻譯函式（宣告那一行另外改） | 同上 |
| `extract_i18n.js` | 抽出所有要翻譯的字串（data.js 的資料常數＋程式裡的 `T('…')`），輸出 `[{zh, ctx}]` | 同上 |
| `stage_scenes.js` | 照劇本演一局：靜態畫面截圖、會動的畫面連拍（試玩廣告素材） | Playwright（雲端已預裝）、本地伺服器 |
| `caption_cards.html` | 試玩廣告的字卡和片尾卡樣板（用 Playwright 截成 PNG） | 本地伺服器（片尾卡要載入角色圖） |
| `build_promo_with_ai_clips.py` | 把 Flow／Gemini 的 AI 影片（自動加「AI 生成畫面」標示、可模糊 AI 亂生的文字）和真實遊戲畫面剪成宣傳短片 | ffmpeg |
| `stage_feature_example.js` | 拍某個新功能的畫面（範例：辯論的弱點題、觀眾好感連拍、翻車迷因），改 `G.rng` 控制劇情 | Playwright、本地伺服器 |
| `build_trailer.py` | 把截圖＋連拍＋字卡＋音樂剪成 1080×1920 的試玩廣告 | ffmpeg |

`build-itch.sh`、`build-newgrounds.sh` 放在每個遊戲 repo 自己的 `scripts/`（見 references/07）。
