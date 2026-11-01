# 7. 上架與維護

## 打包腳本（要能在一般 Mac 上直接跑）
- `scripts/build-itch.sh [輸出路徑]`：zip 裡只放 `index.html style.css og.png js art`，`index.html` 一定要在 zip 最外層。
- `scripts/build-newgrounds.sh [輸出路徑]`：同上但不放 `art/`，並插入 `window.NO_ART = true`。
- 只用 bash＋zip＋perl，不要用 GNU 專用的寫法（`realpath -m`、`sed -i '0,/…/'`）。相對路徑以執行時所在的資料夾為準。
- 打包後解壓到乾淨的資料夾，用本地伺服器實際打開測一次。

## itch.io
- Kind of project：HTML；上傳 zip，勾「This file will be played in the browser」。
- Embed：直式手機遊戲用 420×860，勾 Mobile friendly、Portrait、Fullscreen button。
- 填 Genre、Tags（例如 politics, satire, election, taiwan, choices-matter, multiple-endings, funny, mobile, short）、Languages。**AI disclosure 預設四項全勾**（Graphics、Text、Code、Sound）。
- 首次上架：slug 先跟總編確認，建好頁面後把網址回填到分享文字和打包腳本。
- 頁面文案：開頭一句講清楚「你是誰、好笑在哪」，再列玩法、結局數、虛構聲明、時間、慢慢來模式、語言。
- itch 上預設英文（i18n.js 依網域判斷）；作者自己測過中文的話，瀏覽器會記住，要用無痕視窗確認。
- Distribute → Widget 只是給別的網站嵌入用的，不用調。

## Newgrounds（工作室 2026-11 起暫停，只上 itch；以下留作參考）
- 用無 AI 版 zip；Embed 400×800，勾 Touchscreen friendly。
- 圖示是橫的（見 06）。分級表：沒有色情暴力就選 None；政治諷刺、提到買票或喝酒，就在 Adult Themes／Drugs-Alcohol 選 Some，大約會是 T。
- Commentary（作者的話）：同 itch 文案再口語一點，最後一句說圖示是作者手繪的，問大家拿到哪個結局。
- 上傳後會先審核；審核中就有網址了。社群重視「人」，上線後發一篇自我介紹 News Post。

## 其他平台（評估過的）
- **Game Jolt**：可以免費上傳，跟 itch 類似。
- **CrazyGames**：流量大，要申請開發者帳號、通過審核，可能要加它的 SDK。
- **Poki、Kongregate**：要挑選或申請，不適合小品遊戲。
- **Steam**：每款上架費 100 美元，收入滿 1,000 美元才退，免費遊戲等於直接花掉；要做成電腦版、填 AI 揭露。小品網頁遊戲不建議。
- **日本**：unityroom 只收 Unity／Godot；ふりーむ！據說規定比較嚴（例如禁止連網），要先做日文版。
- **App Store**：網頁包一層殼常被以 4.2「最低功能」退件，而且要年費。留在網頁就好。
- 以上都是當時查到的資料，真的要做之前再搜尋一次最新規定。

## 版本更新與上線流程（照總編的安排）
1. 設計師改好 → 版本號＋CHANGES → 模擬＋實測 → 推上 GitHub（Pages 自動更新）→ 通知總編。
2. 總編在開發日誌註明要更新哪個遊戲；**每週六台灣時間 13:00**，作者 Mac 上的腳本抓預設分支的最新版、跑 `build-itch.sh`、用 butler 傳到 `帳號/遊戲:html5`，成功才發日誌。要趕上線的修正，在 13:00 前推上去。
3. **第一次用 butler 上傳後**（每個遊戲只做一次）：作者到 Edit game → Uploads，把新的 html5 檔勾「played in the browser」，再刪掉舊的手動 zip。
4. Newgrounds 沒有上傳工具，作者手動上傳。
5. GitHub Actions 的手動上傳（workflow_dispatch＋butler）只當備用；金鑰放在 Mac 的 `butler login`，不放 GitHub。
6. 金鑰等於整個帳號的鑰匙：不要請作者把金鑰傳給你，也不要印出來。
