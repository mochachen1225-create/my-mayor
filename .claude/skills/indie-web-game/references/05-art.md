# 5. 美術

## 原則
- 角色**不能像任何真人**，特別是政治人物。避免「特定髮型＋眼鏡＋年紀」的組合讓人聯想；宣傳圖選比較不會引起聯想的角色。
- 顏色避免明顯對應真實政黨（例如單用綠、藍、白綠）；選舉物件用紅底黃字這種不分黨的配色。
- 程式產生的 SVG 頭像當備用：插畫載入失敗或在禁止 AI 的平台時使用。

## Cloudflare Workers AI 生角色
- 環境有 `CLOUDFLARE_ACCOUNT_ID`，代理會自動帶憑證：`curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/black-forest-labs/flux-2-dev`，multipart 欄位 `prompt`、`width`、`height`；回傳 JSON，圖在 `result.image`（base64）。
- 先用 `ai/models/search?task=Text-to-Image` 看目前有哪些模型。
- **表情一致的做法**：先生一張「微笑」當基準，再把它當參考圖（multipart 欄位 `input_image_0=@base.png`）生其他表情：「Same character, same art style, same outfit, same background and framing. Change only the facial expression. …」。一致性很好。
- 風格提示詞固定一段放最前面（可愛日系動畫、乾淨線條、平塗、大眼、純色背景、no text），再加角色描述（年紀、職業、髮型、服裝顏色），最後加「Fictional original character, not based on any real person」。
- 4 條執行緒平行跑，每張約 12 秒，失敗重試 3 次。
- **免費額度**：每天 10,000 neurons，我們大約 50 張就用完。剩下的隔天再生，或請作者升級付費方案。
- 後製：裁成以臉為中心的正方形、縮成 256×256、WebP quality 80（48 張共約 360KB）。
- 前端：`avatar()` 看到 `look.art` 就輸出包在圓形 SVG 裡的 `<image>`，原本頭像的 CSS 尺寸可以直接沿用；表情檔名 `A_m_smile.webp` 這種格式。
- 分享截圖不能用 SVG 裡的外部圖片，要另外用 `Image()` 載入、在 canvas 上裁圓形。

## 無 AI 版本（Newgrounds 用）
- Newgrounds 美術區明文禁止 AI 圖，社群也很反感，所以要準備無 AI 版本。
- 打包時在 `index.html` 的第一個 `<script>` 前插入 `<script>window.NO_ART = true;</script>`，並且不放 `art/`；game.js 看到 NO_ART 就不設定 `look.art`，全部用 SVG 頭像。
- 宣傳圖也要另外做無 AI 版本，影片裡有 AI 插畫就不要用。

## 作者手繪素材
- 作者用 Procreate 畫，「不厲害但可以畫一點」。先給點子：形狀簡單、一眼看懂、有梗（例如「爆肝的肝」：圓滾滾、黑眼圈、冒汗、拿咖啡、綁布條）。
- 可以先給 Gemini 提示詞，讓作者生參考圖找感覺，再自己畫。提示詞要求：粗黑線、3 種顏色、平塗、沒有陰影、角色在上方、下方留三分之一空白、純白背景、沒有文字。提醒作者：AI 參考圖只拿來找感覺，上傳的必須是自己畫的。
- **去背**：只把「從邊緣連通的白色」變透明（PIL `ImageDraw.floodfill` 從角落填），汗滴、眼白等內部白色才會保留。
- 手寫字有錯字就裁掉，用手寫風字體（例如 Google Fonts 的 Gaegu）重打正確拼法。
- 深色背景上黑線條會看不清，手繪圖示通常配暖黃底比較好。
- 用 HTML＋Playwright 排版加字；本機圖片要轉成 data URI 再放進 `setContent`，不然載不出來。
