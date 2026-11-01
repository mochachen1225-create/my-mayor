# 企劃單（草案）：過年親戚攻防戰

> 設計師草案，給總編與作者審閱。暫放在 my-mayor repo；開工時再依總編安排開新 repo。
> 暫定名稱：《過年親戚攻防戰》／英文 *Dodge the Aunties*（備選：*Lunar New Year Survival*）

## 1. 目的與時程
| 項目 | 內容 |
|---|---|
| 目的 | 季節型小遊戲：讓台灣玩家笑著認出自己家過年的樣子，讓外國玩家體驗台灣春節文化 |
| 要測什麼 | ① 重用市長遊戲的架構，能不能在一個月內做完一款新遊戲 ② 全球都懂的題材（被親戚追問）在 itch／Reddit 的反應 ③ 分享截圖的擴散 |
| 開發 | 2026 年 12 月（11/29 開票夜回顧收尾後才開工） |
| 上架 | 2027-01-09（六）itch 安靜上架 |
| 宣傳 | 1/23 起 Threads／IG、Reddit；2/4（小年夜）～2/10 是熱度高峰 |
| 收尾 | 2/10 連假結束後，2 月中發一篇「玩家最常拿到的結局」回顧 |
| 時長 | 一局約 8～10 分鐘，手機直式 |

2027 春節：小年夜 2/4（四）、除夕 2/5（五）、初一 2/6（六），連假 2/4～2/10（人事總處公告）。

## 2. 一句話
你是剛回老家過年的晚輩。從小年夜到初三，三姑六婆輪番上陣問「什麼時候結婚」「薪水多少」「怎麼又胖了」，你要在 15 秒內決定怎麼回答，保住**長輩好感**和**自己的理智**，平安活過這個年。

## 3. 核心玩法
- **時間軸**：小年夜（回家）→ 除夕（圍爐、領紅包）→ 初一（拜年、走春）→ 初二（回娘家，或接待回娘家的親戚）→ 初三（收尾、北返）。每天 3～5 個事件，共約 20 張卡。
- **親戚提問卡**：親戚出場（頭像加台詞），問一個問題，有 4 個回答方向，每題限時 15 秒（有慢慢來模式）：
  - 😇 **乖巧**：「會努力的～」→ 長輩好感＋、理智－
  - 🌀 **太極**：「先吃飯先吃飯！」轉移話題 → 好感持平，有機率被追問
  - 😏 **反擊**：「阿姨，表哥呢？」→ 理智＋、好感－，可能引爆家族八卦
  - 🎁 **用道具**：塞水果、端茶、講表弟的糗事、拿出手機給長輩看孫子照片……（要先有道具）
- **回答風格（更多可能性，作者 11/1 想補充）**：四個基本方向之外，每題從下面這些風格裡抽 4 個當選項，讓每次遇到同一題的回答都不太一樣：

| 風格 | 範例（被問「什麼時候結婚？」） | 效果 |
|---|---|---|
| 😇 溫柔乖巧 | 「有在努力了啦～阿姨幫我留意一下」 | 好感＋、理智－ |
| 🔪 犀利反擊 | 「阿姨，你當年幾歲結婚？後悔過嗎？」 | 理智＋＋、好感－－，可能讓全桌安靜 |
| 😂 幽默化解 | 「我在等房價先結婚」 | 好感＋、理智＋，有機率冷場 |
| 🌀 太極轉移 | 「哇這道菜好好吃，誰煮的？」 | 持平，被追問的機率高 |
| 🤥 善意謊言 | 「有啦，有一個在聊」 | 這局爽，但之後每個親戚都會追問「那個人」（埋伏筆） |
| 🙃 已讀不回 | 低頭滑手機 | 好感－、理智持平，阿嬤會出來救場 |
| 🔄 反問拖人下水 | 「表哥不是也還沒？」 | 親戚互咬，你脫身，但被表哥記仇 |
| 💬 認真回答 | 坦白說出自己的想法 | 有機率得到長輩真心理解（溫馨線），也可能被說教 |
| 🎁 用道具 | 遞上一盤水果、拿出手機給長輩看貓的照片 | 依道具不同，可以完全化解 |
| 🫂 找盟友 | 對阿嬤使眼色 | 阿嬤出手，一句話讓全場閉嘴（每局限用一次） |

- **伏筆系統**：善意謊言、被記仇這類選擇會記住，後面的事件回來找你（重用市長的「翻舊帳」）。例如初二帶「那個人」的照片來看。
- **反擊值**：連續犀利反擊會累積「家族傳說度」，結局可能是「從此過年沒人敢問你」。
- **溫柔值**：連續溫柔回應會累積「乖孫度」，紅包變厚，但理智消耗快。
- **找出平衡**：最高分的玩法是溫柔和犀利交替，讓遊戲不會只有一種最佳解。
- **三個數值**（重用市長遊戲的 HUD 框）：
  - 👵 **長輩好感**（0～100）：決定紅包厚度和結局
  - 🧠 **理智**（0～100）：歸零就「爆氣」，觸發特別事件（重用肝歸零的機制）
  - 🧧 **紅包**：累積金額；也可以發紅包給小孩換好感
- **連擊**：連續化解提問，「今年的我好會」。
- **網友反應**：每題後面 2～3 則「脆」留言（「我阿姨也這樣問」「反擊太爽了吧」），重用市長的系統。
- **小遊戲**（2～3 個，各 10 秒，可跳過）：
  1. **搶紅包**：桌上紅包快速出現，點紅包、避開「我們來談談你的未來」卡
  2. **麻將桌躲問題**：打牌時有問題飛來，點「碰！」打斷話題
  3. **北返搶票**（開場或收尾）：開賣 10 秒內點對車次
- **家族群組事件**：長輩傳早安圖、轉傳奇怪的養生訊息，你要回貼圖還是已讀。

## 4. 親戚角色（6～8 位，都是類型，不寫真人）
| 角色 | 招牌問題 | 弱點（反擊／溫馨的出口） |
|---|---|---|
| 熱心大姑 | 「交男／女朋友沒？」 | 一聊到她自己年輕時的戀愛就停不下來 |
| 比較型二嬸 | 「你堂哥年薪多少你知道嗎？」 | 堂哥其實偷偷跟你借過錢 |
| 健康魔人三叔 | 「怎麼又胖了／瘦了？」 | 推銷保健食品時，你問「這有認證嗎」 |
| 科技苦手阿公 | 「這個手機怎麼又不會動了？」 | 幫他修好，好感大增（溫馨線） |
| 嘴硬心軟阿嬤 | 「吃飽沒？再吃一碗！」 | 永遠站在你這邊的隱藏王牌 |
| 炫耀型表姐 | 「我們家小孩上資優班了喔」 | 她的小孩私下跟你抱怨補習 |
| 熊孩子表弟 | 「哥哥／姐姐陪我打電動！」 | 陪他玩，好感＋、理智－ |
| 神秘的遠房親戚 | 「你還記得我嗎？」（你完全不記得） | 硬猜名字的小遊戲 |

## 4.5 主角設定（照《我推的市長》的做法）
開場先設定主角：
1. **名字**（可自訂）、**性別**（男／女，只影響稱呼和頭像）、**年紀**（滑桿 16～40 歲，影響部分問題和台詞，例如「都快三十了還……」）
2. **選一個身分**（提案 5 種）：

| 身分 | 會被問的招牌問題 | 特色 |
|---|---|---|
| 🎒 **學生**（高中／大學） | 「考幾分？」「以後要做什麼？」「讀這個找得到工作嗎？」 | 紅包比較多，但被管最多 |
| 💼 **上班族** | 「薪水多少？」「什麼時候升官？」「買房了沒？」 | 被期待要包紅包給小孩 |
| 🎨 **自由工作者**（接案、創業、YouTuber） | 「這樣有勞保嗎？」「什麼時候要找正職？」 | 長輩看不懂你在做什麼，反擊空間最大 |
| 💍 **剛結婚** | 「什麼時候生？」「過年要回誰家？」 | 初二回娘家事件特別多，有另一半的家人加入 |
| 🔄 **剛換工作／轉職中** | 「怎麼又換了？」「之前那份不是很好嗎？」 | 進階難度，親戚最愛問 |

- 親戚的問題依主角設定變化：題庫的每一題標註適用的身分和年紀範圍，抽題時篩選（例如學生被問成績、上班族被問薪水），同一位親戚會針對不同主角問不同問題。
- **頭像不依主角變化**：主角只有男女兩套頭像，親戚頭像也共用，不用為每種主角畫不同的圖。
- 感情狀態（單身／交往中）不用另外選，學生、上班族、自由工作者預設單身就會被問；剛結婚的改問生小孩。

## 5. 結局（暫定 20＋6 種）
**依好感和理智分成 4 大類，每類再分細結局：**
- 🧧 **紅包大豐收**（好感高、理智高）：「年度最佳晚輩」「阿嬤的心頭肉」「紅包厚到要用背包裝」
- 😇 **委屈求全**（好感高、理智低）：「乖了一整個年，回台北哭了一場」「被安排了三場相親」
- 😏 **家族傳說**（好感低、理智高）：「一句反擊在家族群組流傳十年」「從此過年沒人敢問你薪水」
- 🌋 **爆氣離席**（理智歸零）：「年夜飯吃到一半去便利商店坐了兩小時」「初一就訂了回程車票」
- **特殊結局**：
  - 「你幫阿公修好手機，他偷偷多塞一個紅包」（溫馨）
  - 「表弟說你是他最喜歡的哥哥／姐姐」（溫馨）
  - 「全家一起被二嬸的炫耀反噬」（反擊成功）
  - 「搶票成功，但車廂裡全是剛被追問完的人」（共鳴）
  - 「躲在廁所 47 分鐘」（隱藏）
- **「今年的你」結局**（像市長的總幹事結局，6 種）：例如「年度太極大師」「家族群組管理員」「麻將桌常勝軍」

**規則**：每個嘴賤的親戚都有反擊或溫馨的出口；結局讓玩家笑，不讓玩家覺得被羞辱。

## 6. 內容原則
- 全部虛構，不寫真人，不影射任何真實家庭。
- **不嘲笑特定族群**：單身、已婚、胖瘦、收入、學歷、性向、生育選擇，都是「被問的人很煩」的笑點，**不是「被問的人很可笑」**。玩家永遠是被同理的那一方。
- 回答選項不要有歧視性用語；反擊要機智，不刻薄。
- 不寫成某一代人的壞話：長輩有可愛、溫暖的一面，結局要讓人想回家。
- 外國玩家也懂：首頁有「Taiwanese Lunar New Year in 60 seconds」小知識（紅包、圍爐、初二回娘家、麻將、早安圖）。

## 7. 技術
- 照 indie-web-game skill：純 HTML／CSS／JS，engine／data／game 分開，中英雙語（`T()`＋`i18n.en.js`），平衡模擬，手機實測。
- 可以直接重用：HUD 數值框、事件卡、倒數與慢慢來模式、連擊、網友留言、小遊戲框架、觀眾好感條（改成「長輩好感」）、歸零事件、結局圖鑑、分享截圖、itch／Newgrounds 打包。
- 預估：設計 2 天、實作 5～7 天、翻譯與測試 2 天、素材與宣傳 2～3 天。

## 8. 美術需求
### 遊戲內頭像（Gemini 生成，用市長遊戲的風格參考圖）
主角男女各一（4 種表情：微笑、大笑、崩潰、無言）＋ 8 位親戚（各 2 種表情：問問題、被反擊）。
共用的第一則提示詞同 `docs/gemini-npc-prompts.md`，再加「Cozy Lunar New Year mood; red and gold accents are fine, but no text or characters on clothing.」

| 檔名 | 提示詞 |
|---|---|
| `aunt_eager` | A cheerful East Asian auntie in her 50s, curly short perm hair, bright red knitted sweater, leaning in with a curious, nosy smile. |
| `aunt_compare` | An East Asian aunt in her 50s, neat bob, pearl necklace, beige cardigan, raising one eyebrow with a polite but competitive smile. |
| `uncle_health` | An East Asian uncle in his 60s, tanned, grey crew cut, polo shirt, holding a bottle of health supplements, enthusiastic. |
| `grandpa` | An East Asian grandpa in his 80s, thin white hair, reading glasses on his nose, holding a smartphone upside down, confused but sweet. |
| `grandma` | A tiny East Asian grandma in her 80s, white hair in a bun, floral padded jacket, holding out a bowl of rice, warm stubborn smile. |
| `cousin_brag` | An East Asian woman in her 30s, stylish long hair, cream coat, showing her phone proudly. |
| `cousin_kid` | An energetic East Asian boy about 8 years old, messy hair, red hoodie, holding a game controller, grinning. |
| `relative_mystery` | An East Asian middle-aged man with a friendly but unfamiliar face, generic grey jacket, waving as if he knows you very well. |
| `player_f` / `player_m` | A young East Asian adult in their late 20s, casual sweater, holding a red envelope, tired polite smile (then: laughing / exhausted / speechless). |

### Flow 影片（宣傳用，視點數而定，Fast）
共用風格開頭同市長遊戲，影片結尾加「Vertical 9:16 video. No on-screen text, no subtitles.」
1. **圍爐連環問**：A Lunar New Year family dinner table full of dishes; aunties and uncles lean in one by one asking questions; the young adult in the middle keeps smiling while sweat drops multiply comically.
2. **躲進廁所**：The young adult quietly escapes the noisy family gathering and hides in a small bathroom, sighing with relief, phone in hand, while muffled voices call their name outside.
3. **阿公的手機**：A sweet moment: the young adult fixes grandpa's phone; grandpa beams and secretly slips an extra red envelope into their hand.
4. **北返車站**：A crowded train station after the holiday, travelers with bags of homemade food from their families, tired but smiling.

### 宣傳圖
- itch 封面：主角被一圈親戚頭像包圍，對話框只畫「？」，不放文字。
- 截圖 6 張：照市長的版型。

## 9. 宣傳
- **itch 開發日誌**：「Why every Taiwanese adult dreads Lunar New Year dinner」
- **Reddit**：r/playmygame（交換回饋）、r/taiwan（文化角度，帳號已經養夠）、r/AsianParentStories 這類版要先看版規，可能不適合推銷
- **Threads／IG**：「你家的大姑是哪一型？」角色圖輪播，讓玩家留言認親戚
- **分享截圖**：「我活過了今年的年夜飯：理智剩 3%，紅包 12,000」

## 9.5 其他點子（備用，可挑）
- **今年的家族群組**：遊戲中穿插家族群組訊息（早安圖、養生謠言、長輩轉傳），你決定回貼圖、糾正還是已讀；糾正謠言要小心措辭。
- **紅包經濟學**：你也要包紅包給小孩，金額太少會被說小氣，太多錢包見底，結局會算你今年「紅包淨收入」。
- **年夜飯座位表**：開場選座位，坐在誰旁邊會影響被問的題目（坐阿嬤旁邊最安全，坐二嬸旁邊最危險）。
- **親戚好感度圖鑑**：每位親戚有自己的好感度，結局可能是「跟三叔變成好朋友」。
- **天氣與意外**：寒流、停電、小孩打翻湯，隨機事件打斷問題（救援或加碼）。
- **外國另一半模式**（剛結婚身分的變化）：帶外國另一半回家，你要當翻譯，翻得太直白會出事。好笑，也適合外國玩家。

## 10. 待確認
- [ ] 名稱（中、英）
- [x] 主角設定：照市長的做法，自訂名字、性別、年紀，再選 5 種身分之一（作者 11/1 確認）
- [x] repo 名稱：`dodge-the-aunties`（作者 11/1 確認；開 repo 的時間之後再定）
- [x] 企劃框架作者 OK，12 月開工前再一起細設計
- [ ] Flow 點數有沒有預算
