// 遊戲資料：候選人、人物、事件、成就老闆企劃、結局
// 文字佔位：{boss} 老闆名字、{he} 他/她、{rival} 主要對手、{party} 老闆政黨、{rparty} 對手政黨

const TYPES = {
  A: {
    label: '政治世家第三代', party: '🐢 烏龜黨',
    trait: '長輩說了算：「我吃的鹽比你吃的米多」', pro: '組織強、樁腳穩', con: '權貴標籤',
    names: { m: 'Andrew', f: 'Amy' },
    look: { m: { hair: 'slick', suit: '#2c3550', tie: '#8a8f99' }, f: { hair: 'long', suit: '#2c3550', inner: '#e9e9ee' } },
    start: { s: 31, r: 36, money: 55, trust: 50, net: 50 },
    defy: '長輩一通電話打來。{boss}掛掉電話，改成了另一個方案：',
    half: '長輩打電話來說這個不好，{boss}只做了一半。'
  },
  B: {
    label: '清新專業人士', party: '🐦 蜂鳥黨',
    trait: '專業固執，講著講著就回到本行', pro: '形象清新、網路聲量', con: '沒錢沒組織、靠黨',
    names: { m: 'Ben', f: 'Bella' },
    look: { m: { hair: 'short', suit: '#c9ccd3', tie: '#c8a23a', glasses: true }, f: { hair: 'bob', suit: '#c9ccd3', inner: '#fff', glasses: true } },
    start: { s: 29, r: 37, money: 30, trust: 55, net: 30 },
    defy: '{boss}說：「這題我有研究。」然後自己決定了：',
    half: '{boss}說：「這個不夠專業。」只做了一半。'
  },
  C: {
    label: '商業帝國老闆', party: '無黨籍',
    trait: '唯我獨尊：「我是你老闆還是你是我老闆？」', pro: '錢幾乎無限', con: '覺得自己什麼都懂',
    names: { m: 'Charles', f: 'Claire' },
    look: { m: { hair: 'thin', hairColor: '#a7a7a7', suit: '#3a3a3a', tie: '#c8a23a' }, f: { hair: 'bun', hairColor: '#8d8d8d', suit: '#3a3a3a', inner: '#c8a23a', glasses: true } },
    start: { s: 30, r: 36, money: 90, trust: 40, net: 20 },
    defy: '{boss}拍桌：「我是你老闆還是你是我老闆？」直接拍板：',
    half: '{boss}說：「這種小事不用我親自來。」只做了一半。'
  },
  D: {
    label: '現任市長拚連任', party: '🦚 孔雀黨',
    trait: '問 A 答 B', pro: '知名度高、有行政資源', con: '四年沒什麼政績',
    names: { m: 'Dylan', f: 'Diana' },
    look: { m: { hair: 'side', suit: '#263a63', tie: '#7a4fb0' }, f: { hair: 'bob', suit: '#263a63', inner: '#7a4fb0' } },
    start: { s: 36, r: 34, money: 50, trust: 50, net: 45 },
    defy: '記者問 A，{boss}答了 B。實際做出來的是：',
    half: '{boss}跑去做了另一件事，這個只做了一半。'
  },
  E: {
    label: '黨內推舉的資深黨員', party: '🐦 蜂鳥黨',
    trait: '謹慎過頭：「這個我們再研究一下」', pro: '政治資歷深、黨內支持穩、形象穩重', con: '沒有城市治理經驗、講話沒溫度',
    names: { m: 'Ethan', f: 'Emma' },
    look: { m: { hair: 'short', hairColor: '#333', suit: '#4a5a6a', tie: '#8fa3b8', glasses: true }, f: { hair: 'bob', hairColor: '#2a2a2a', suit: '#4a5a6a', inner: '#fff', glasses: true } },
    start: { s: 29, r: 37, money: 45, trust: 55, net: 35 },
    defy: '{boss}推了推眼鏡：「這個我們再研究一下。」最後做的是：',
    half: '{boss}說：「我們再研究一下。」只做了一半。'
  },
  F: {
    label: '草根律師・議會戰神', party: '🐦 蜂鳥黨',
    trait: '把稿子丟了，上台即興發揮', pro: '口才一流、群眾魅力', con: '衝太快，容易失言',
    names: { m: 'Frank', f: 'Fiona' },
    look: { m: { hair: 'side', hairColor: '#1a1a1a', suit: '#5a3b2a', tie: '#2e9e6a' }, f: { hair: 'bob', hairColor: '#1a1a1a', suit: '#5a3b2a', inner: '#2e9e6a' } },
    start: { s: 30, r: 36, money: 35, trust: 45, net: 40 },
    defy: '{boss}把你寫的稿子丟了，自己即興發揮：',
    half: '{boss}做到一半就開始即興，最後只完成一半。'
  }
};

// 配角
const NPC = {
  reporter: { name: '記者小周', role: '跑市政線', look: { hair: 'short', suit: '#5a6b7d', inner: '#fff' } },
  intern: { name: '實習小編', role: '大三，負責粉專', look: { hair: 'bob', hairColor: '#6b4a2e', suit: '#e07a5f', inner: '#fff' } },
  elder: { name: '家族長輩', role: '「我吃的鹽比你吃的米多」', look: { hair: 'thin', hairColor: '#ddd', suit: '#4a3b2a', tie: '#8b1e1e', glasses: true } },
  donor: { name: '神秘金主', role: '「交個朋友嘛」', look: { hair: 'slick', hairColor: '#111', suit: '#111', tie: '#c8a23a' } },
  councilor: { name: '同黨議員', role: '自己也要選', look: { hair: 'side', suit: '#3b5b4a', tie: '#c33' } },
  chief: { name: '里長伯', role: '地方實力派', look: { hair: 'thin', hairColor: '#555', suit: '#7d6b4a', inner: '#fff' } },
  pundit: { name: '名嘴', role: '《深夜熱炒台》', look: { hair: 'slick', hairColor: '#333', suit: '#8b1e1e', tie: '#111', glasses: true } },
  director: { name: '局處首長', role: '市府團隊', look: { hair: 'short', hairColor: '#555', suit: '#2c3550', tie: '#999', glasses: true } },
  volunteer: { name: '志工大姐', role: '群組管理員', look: { hair: 'bun', hairColor: '#333', suit: '#d4a373', inner: '#fff' } },
  foreign: { name: '外商代表', role: '來考察投資', look: { hair: 'short', hairColor: '#c9a15b', suit: '#1d3557', tie: '#e63946', skin: '#f3d6c6' } },
  shady: { name: '某商會會長', role: '「我們來自 X 國」', look: { hair: 'slick', hairColor: '#111', suit: '#6d1a1a', tie: '#c8a23a', glasses: true } },
  staff: { name: '副總幹事', role: '「總幹事，這怎麼辦？」', look: { hair: 'short', hairColor: '#333', suit: '#444', inner: '#fff', glasses: true } }
};

// ---------------- 事件 ----------------
// kind: fire 突發 / main 主線 / money 金主 / tv 政論 / daily 戰情室日常 / crisis 落後或領先
// for: 'inc' 只有現任、'chal' 只有挑戰者；types: 限定老闆類型；staff: true 代表幕僚自己處理，老闆不會不聽話
const EVENTS = [
  // ===== 雙面事件 =====
  { id: 'lunch_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [2, 15],
    title: '免費營養午餐的廚餘山',
    text: '免費午餐上路後，廚餘一天好幾噸。局長在議會脫口說「剩菜可以給弱勢」，影片已經在瘋傳。',
    opts: [
      { t: '🙇 {boss}親自道歉，要求局長收回', fx: { fav: 4, s: 0.5, trust: 2 }, r: '風波暫歇，局長臉很臭。' },
      { t: '✂️ 切割局長：「那是他個人意見」', fx: { fav: -2, s: 0.3, net: -5 }, r: '市府團隊人心浮動，但火滅得快。' },
      { t: '🔥 反批對手「拿孩子的午餐做政治」', fx: { buzz: 6, fav: -4, r: -0.5 }, r: '支持者爽了，中間選民皺眉。' }
    ] },
  { id: 'lunch_chal', kind: 'fire', for: 'chal', who: 'reporter', weeks: [2, 15],
    title: '某國中傳出午餐腹瀉',
    text: '有家長在臉書爆料，孩子吃完免費午餐後拉肚子。目前查到的只有 3 位學生。要不要打？',
    opts: [
      { t: '⚔️ 大打食安：「市府倉促上路！」', fx: { buzz: 8 }, risk: { p: 0.5, fx: { fav: -6, s: -1, con: -5 }, r: '查證後只有少數個案，網友罵你造謠、拿孩子做政治。' }, r: '議題延燒，市府灰頭土臉。', ok: { s: 1, r: -1 } },
      { t: '🧾 提出午餐改善政見，不點名', fx: { fav: 4, s: 0.6 }, r: '溫和理性，但沒什麼人轉發。' },
      { t: '🤐 先觀望', fx: { buzz: -2 }, r: '風頭過了，什麼都沒發生。' }
    ] },
  { id: 'temple_self', kind: 'fire', who: 'reporter', weeks: [2, 16],
    title: '參拜影片被說沒禮貌',
    text: '{boss}在廟裡拿香的動作被拍到，網友說「拜拜像在趕行程」。宮廟群組已經在傳。',
    opts: [
      { t: '🙏 隔天回廟裡重新參拜、跟廟方致意', fx: { fav: 3, liver: -4, s: 0.4 }, r: '主委說：「年輕人有心就好。」', likes: ['A'] },
      { t: '📝 發聲明：「影片角度問題」', fx: { fav: -3, buzz: 3 }, r: '網友逐格分析，越描越黑。' },
      { t: '😅 自嘲拍短片：「香拿反的市長候選人」', fx: { buzz: 7, fav: 2 }, risk: { p: 0.35, fx: { fav: -5, s: -0.8 }, r: '長輩們覺得你不尊重神明，宮廟票跑了。' }, r: '迷因翻轉成好感。' }
    ] },
  { id: 'temple_attack', kind: 'fire', who: 'staff', weeks: [3, 16],
    title: '對手拜拜影片外流',
    text: '有人傳來一段{rival}在廟裡動作很隨便的影片。副總幹事問：「要不要放出去？」',
    opts: [
      { t: '📤 讓側翼放出去', fx: { r: -1, buzz: 4, con: -6 }, risk: { p: 0.3, fx: { fav: -5, s: -1 }, r: '被查出是你們放的，廟方兩邊都不爽。' }, r: '對手忙著道歉。' },
      { t: '🚫 不放：「我們不打這種仗」', fx: { con: 5, trust: 2 }, r: '副總幹事嘆氣，但老闆點點頭。' },
      { t: '🙏 改成安排老闆去同一間廟好好參拜', fx: { fav: 3, s: 0.5, liver: -3 }, r: '不戰而勝的對比畫面。' }
    ] },
  { id: 'typhoon_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [4, 11], timer: 15, dynamic: 'typhoon',
    title: '颱風要不要放假？',
    text: '氣象署的建議是：「{rec}」。全市在等{boss}一句話，晚上十點前要宣布。', opts: [] },
  { id: 'typhoon_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [4, 11], timer: 15,
    title: '颱風夜，行程要不要跑？',
    text: '颱風逼近，今晚原本排了三場座談。市長在防災中心坐鎮，畫面滿滿。',
    opts: [
      { t: '🏃 照跑行程', fx: { buzz: 3 }, risk: { p: 0.6, fx: { fav: -6, s: -1 }, r: '被罵「颱風天還在選舉」。' }, r: '居然沒人注意。' },
      { t: '🧥 暫停競選，去避難所當志工', fx: { fav: 5, s: 0.7, liver: -5 }, risk: { p: 0.25, fx: { fav: -3, buzz: 4 }, r: '被說作秀，因為帶了攝影師。' }, r: '樸實的照片被大量分享。' },
      { t: '📢 發文批市府防災不周', fx: { buzz: 5, r: -0.5 }, risk: { p: 0.45, fx: { fav: -5 }, r: '「人家在救災你在罵」。' }, r: '剛好哪裡淹水，批得很準。' }
    ] },
  { id: 'dome_inc', kind: 'fire', for: 'inc', who: 'reporter', weeks: [2, 16],
    title: '天穹體育館又漏水了',
    text: '演唱會唱到一半，觀眾席下起小雨。網友做出「室內也要帶傘」的迷因，記者在市府門口等老闆回應。',
    opts: [
      { t: '🎤 立刻出面道歉，宣布全面檢修', fx: { fav: 3, money: -5, s: 0.4 }, r: '誠意加分，但工程款要再編。' },
      { t: '🧑‍🔧 派局長去現場，老闆先不出面', fx: { fav: -2, net: -2 }, r: '被說「市長躲起來」。' },
      { t: '😎 自嘲：「N City 市民本來就該帶傘」', fx: { buzz: 8 }, risk: { p: 0.5, fx: { fav: -7, s: -1 }, r: '歌迷不覺得好笑。' }, r: '迷因翻轉，年輕人覺得市長很有梗。' }
    ] },
  { id: 'dome_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [2, 16],
    title: '天穹體育館漏水，打不打？',
    text: '演唱會觀眾席滴水。要趁勢攻擊市府，還是另闢蹊徑？',
    opts: [
      { t: '☂️ 帶傘去體育館門口開記者會', fx: { buzz: 8, r: -0.8 }, risk: { p: 0.3, fx: { fav: -3 }, r: '被說太刻意。' }, r: '畫面很有梗，各台都播了。' },
      { t: '📐 提出「場館總體檢」政見', fx: { fav: 4, s: 0.5 }, r: '專業形象加分。', likes: ['B'] },
      { t: '💰 「我來蓋一座不漏水的」', fx: { buzz: 5 }, risk: { p: 0.5, fx: { fav: -4 }, r: '被酸「有錢了不起」。' }, r: '老闆的狂言意外有人買單。', likes: ['C'] }
    ] },
  { id: 'web_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [3, 16],
    title: '市府網站當機五小時',
    text: '機房跳電又過熱，市府網站全掛。網友：「說好的智慧城市呢？」對手說可能是駭客攻擊。',
    opts: [
      { t: '📋 公開完整原因與改善時程', fx: { fav: 3, s: 0.4 }, r: '透明處理，風波快速平息。' },
      { t: '👔 局長請辭負責', fx: { fav: 2, net: -6 }, r: '有人負責了，但團隊士氣低落。' },
      { t: '🙄 「小事，已經修好了」', fx: { fav: -5, buzz: 4, s: -0.6 }, r: '被做成「小事市長」梗圖。' }
    ] },
  { id: 'web_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [3, 16],
    title: '市府網站大當機',
    text: '市府網站掛了五小時，原因不明。要怎麼打？',
    opts: [
      { t: '🛡️ 質疑資安：「是不是被駭了？」', fx: { buzz: 5, r: -0.6 }, risk: { p: 0.4, fx: { fav: -4 }, r: '結果只是跳電，被說危言聳聽。' }, r: '市府答不出來，形象受損。' },
      { t: '💻 提出數位市政政見', fx: { fav: 4, s: 0.5 }, r: '工程師社群按讚。', likes: ['B'] },
      { t: '🤐 不跟進', fx: {}, r: '平靜的一天。' }
    ] },
  { id: 'kinder_inc', kind: 'fire', for: 'inc', who: 'reporter', weeks: [3, 14], timer: 15,
    title: '幼兒園虐童案，市府被批太慢',
    text: '家長說之前就陳情過，市府沒有即時處理。民間團體要開記者會，呼籲市長「回到市政崗位」。',
    opts: [
      { t: '🏛️ 暫停競選三天，親自督辦', fx: { fav: 5, s: 0.8, buzz: -3, liver: -5 }, r: '家長團體接受道歉。' },
      { t: '📄 要求局處三天內提報告', fx: { fav: -1 }, r: '中規中矩，沒有加分。' },
      { t: '🗯️ 「有人在消費孩子」', fx: { fav: -8, s: -1.5, buzz: 5 }, r: '全網炎上，這句話被做成看板。' }
    ] },
  { id: 'kinder_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [3, 14], timer: 15,
    title: '幼兒園虐童案',
    text: '家長說市府拖延處理。要怎麼回應？',
    opts: [
      { t: '👪 陪家長開記者會', fx: { fav: 4, s: 0.6, r: -0.6 }, risk: { p: 0.3, fx: { fav: -4 }, r: '被說消費受害家庭。' }, r: '家長感謝有人出聲。' },
      { t: '🧸 提出兒少保護政見', fx: { fav: 3, s: 0.4 }, r: '穩健加分。' },
      { t: '⚔️ 猛打市長失職', fx: { buzz: 6, r: -0.8, con: -3 }, risk: { p: 0.4, fx: { fav: -5 }, r: '家長說不想被政治化。' }, r: '市府招架不住。' }
    ] },
  { id: 'fireworks_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [1, 4], timer: 15,
    title: '河濱煙火人潮失控',
    text: '煙火結束，捷運站擠爆，有人被困一小時。網友罵翻：「辦活動不管散場？」',
    opts: [
      { t: '🙇 道歉並公布檢討報告', fx: { fav: 3, s: 0.3 }, r: '負責任的態度被肯定。' },
      { t: '📊 強調「人數破紀錄，城市行銷成功」', fx: { fav: -4, buzz: 5 }, r: '被罵只在意數字。' },
      { t: '🚇 推給捷運公司', fx: { fav: -3, net: -3 }, r: '捷運公司隔天發聲明打臉。' }
    ] },
  { id: 'fireworks_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [1, 4],
    title: '煙火散場大塞車',
    text: '河濱煙火散場失控，現場一片混亂。',
    opts: [
      { t: '🎆 提出「大型活動安全計畫」', fx: { fav: 3, s: 0.4 }, r: '專業加分。' },
      { t: '📸 去捷運站拍片批市府', fx: { buzz: 5, r: -0.5 }, risk: { p: 0.3, fx: { fav: -3 }, r: '被說蹭熱度。' }, r: '畫面有感。' },
      { t: '🤐 不跟', fx: {}, r: '平靜的一天。' }
    ] },
  { id: 'food_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [5, 15], timer: 15,
    title: '連鎖餐廳集體食物中毒',
    text: '知名連鎖餐廳多家分店傳出食物中毒，有人送急診。要怎麼處理？',
    opts: [
      { t: '🔒 全部分店勒令停業', fx: { fav: 5, s: 0.6, buzz: 4 }, risk: { p: 0.3, fx: { fav: -3 }, r: '業者喊冤，被說作秀。' }, r: '展現魄力。' },
      { t: '🧪 先採檢，依結果處分', fx: { fav: 1 }, r: '程序正確，但被說太慢。' },
      { t: '🍽️ 老闆親自去現場「試吃」安民心', fx: { buzz: 6 }, risk: { p: 0.4, fx: { fav: -5, liver: -10 }, r: '老闆跟著拉肚子。' }, r: '勇氣可嘉。' }
    ] },
  { id: 'video_self', kind: 'fire', who: 'reporter', weeks: [6, 15],
    title: '競選影片素材出包',
    text: '新的競選影片被網友抓到用了未授權的運動賽事畫面。{incNote}',
    opts: [
      { t: '🙇 立刻下架、公開道歉', fx: { fav: 2, buzz: -2 }, r: '止血成功。' },
      { t: '✂️ 怪罪外包廣告公司', fx: { fav: -3, net: -3 }, r: '廣告公司發聲明：「是你們給的素材。」' },
      { t: '🙈 不回應，等新聞過去', fx: { fav: -4, s: -0.6 }, r: '網友開始逐格比對其他影片。' }
    ] },
  { id: 'video_attack', kind: 'fire', who: 'staff', weeks: [6, 15],
    title: '對手競選影片出包',
    text: '{rival}的競選影片被抓到使用未授權畫面。要不要追打？',
    opts: [
      { t: '⚔️ 追打「侵權候選人」', fx: { buzz: 4, r: -0.6, con: -2 }, r: '對手忙著滅火。' },
      { t: '😏 發一支「我們的素材都是自己拍的」短片', fx: { buzz: 6, fav: 2 }, r: '機智回擊，好感加分。' },
      { t: '🤐 不打', fx: { con: 2 }, r: '風度翩翩。' }
    ] },
  { id: 'pig', kind: 'fire', who: 'councilor', weeks: [4, 16],
    title: '豬隊友出沒',
    text: '同黨議員自作主張，發了一張 AI 合成圖攻擊{rival}，圖做得很爛，網友說是火上加油。',
    opts: [
      { t: '✂️ 公開切割：「不是我們的立場」', fx: { fav: 3, net: -6, cut: 1 }, r: '議員很受傷，以後不太想幫忙。' },
      { t: '🤝 私下請議員刪文', fx: { favor: 1, fav: 1 }, r: '議員刪了，但說「你欠我一次」。' },
      { t: '😑 裝沒看到', fx: { fav: -4, s: -0.5 }, r: '「默許側翼」的標籤貼上來了。' }
    ] },
  { id: 'funeral', kind: 'fire', who: 'reporter', weeks: [3, 16],
    title: '告別式上的競選貼紙',
    text: '{boss}去地方告別式拈香，簽名旁邊被志工貼上競選貼紙，被轟踩紅線。',
    opts: [
      { t: '🙇 親自向家屬致歉', fx: { fav: 3, liver: -3 }, r: '家屬接受，風波平息。' },
      { t: '🧾 怪志工自作主張', fx: { fav: -3, net: -3 }, r: '志工群組炸鍋。' },
      { t: '🤐 不回應', fx: { fav: -5, s: -0.6 }, r: '新聞連播三天。' }
    ] },
  { id: 'oldpost', kind: 'fire', who: 'reporter', weeks: [5, 15], timer: 15,
    title: '十二年前的舊文被挖出來',
    text: '有人挖出{boss}十二年前在部落格寫的爭議文章，一天湧進幾十萬則留言。',
    opts: [
      { t: '📣 直接表態：「我現在不是這樣想」', fx: { fav: 3, s: 0.3 }, r: '明快處理，討論降溫。' },
      { t: '📚 長文解釋當時的脈絡', fx: { buzz: 5 }, risk: { p: 0.5, fx: { fav: -5 }, r: '太長沒人看，只被截圖斷章取義。' }, r: '懂的人懂了。', likes: ['B'] },
      { t: '🔁 反挖對手的舊文', fx: { buzz: 6, r: -0.5, con: -5 }, r: '兩邊互挖，選民都累了。' }
    ] },
  { id: 'xcity', kind: 'fire', who: 'reporter', weeks: [4, 14],
    title: 'X 國城市邀請交流',
    text: '海峽對岸 X 國的友好城市邀請 N City 辦城市論壇。記者問{boss}：去不去？',
    opts: [
      { t: '🤝 去：「交流才有和平與商機」', fx: { buzz: 5 }, risk: { p: 0.5, fx: { fav: -5, s: -0.8 }, r: '被貼「親 X 國」標籤，年輕人反彈。' }, r: '商界、觀光業讚聲。', ok: { s: 0.8, money: 5 } },
      { t: '🛡️ 不去：「主權不能被矮化」', fx: { buzz: 4 }, risk: { p: 0.5, fx: { fav: -4, money: -5 }, r: '被說「斷送觀光商機」，商家抱怨。' }, r: '年輕選民按讚。', ok: { s: 0.8 } },
      { t: '🫥 「時機不對，再評估」', fx: { fav: -1, buzz: -2 }, r: '兩邊都不滿意，但也沒得罪誰。' }
    ] },
  { id: 'absentee', kind: 'fire', who: 'reporter', weeks: [5, 13],
    title: '不在籍投票，表態嗎？',
    text: '外地工作的年輕人希望能不在籍投票。記者追問{boss}的立場。',
    opts: [
      { t: '✅ 支持，喊出「讓遊子回家投票」', fx: { buzz: 4 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被質疑配套不足、有安全疑慮。' }, r: '年輕選民好感上升。', ok: { s: 0.6 } },
      { t: '⚠️ 反對：「配套不夠，選務安全優先」', fx: { buzz: 3 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被說「怕年輕人投票」。' }, r: '穩健派選民認同。', ok: { s: 0.6 } },
      { t: '🤷 「這是中央的事」', fx: { fav: -2 }, r: '安全，但被說沒立場。' }
    ] },
  { id: 'invest', kind: 'fire', who: 'foreign', weeks: [3, 15],
    title: '外商要來 N City 設亞洲總部',
    text: '某國際科技大廠在考察三座城市。對方代表下週只有一天空檔，誰去拉都有機會。',
    opts: [
      { t: '✈️ 老闆親自帶隊簡報', fx: { liver: -6 }, risk: { p: 0.4, fx: { buzz: 2 }, r: '對方客氣聽完，說會再評估。' }, r: '對方表示 N City 是首選！', ok: { s: 1.2, fav: 4, buzz: 6 }, likes: ['C'] },
      { t: '📊 做一份超強的投資白皮書寄過去', fx: { liver: -4, fav: 2 }, r: '專業度被稱讚，新聞小小一則。', likes: ['B'] },
      { t: '📸 搶先發新聞稿「我們談成了」', fx: { buzz: 6 }, risk: { p: 0.6, fx: { fav: -7, s: -1 }, r: '外商發聲明：「我們沒有談任何事。」' }, r: '先搶到功勞。' }
    ] },

  // ===== 老闆專屬 =====
  { id: 'elder_stage', kind: 'fire', types: ['A'], who: 'elder', weeks: [3, 16],
    title: '長輩今晚要上台助選',
    text: '家族長輩說今晚造勢要上台講幾句話。上次他一開口就說了「我們家就是權貴」。',
    opts: [
      { t: '🙅 勸{boss}跟長輩說「這次我自己來」', fx: { trust: -3, rebel: 1 }, risk: { p: 0.4, fx: { trust: -4 }, r: '長輩大怒，{boss}被罵了一頓。' }, r: '{boss}第一次對長輩說「不」。', ok: { fav: 3 } },
      { t: '📝 幫長輩寫好講稿', fx: { liver: -3 }, risk: { p: 0.5, fx: { fav: -6, s: -1 }, r: '長輩沒照稿念，又說出名言。' }, r: '長輩照念了，平安下莊。' },
      { t: '🎤 讓長輩自由發揮', fx: { buzz: 8 }, risk: { p: 0.7, fx: { fav: -8, s: -1.5 }, r: '「我們本來就是權貴，怎麼樣？」上了頭版。' }, r: '長輩意外很有魅力。' }
    ] },
  { id: 'notelite', kind: 'fire', types: ['A'], who: 'staff', weeks: [2, 12],
    title: '證明我不是權貴',
    text: '副總幹事提案拍親民影片，要甩掉權貴標籤。哪一個？',
    opts: [
      { t: '🍊 徒手捏爆一顆橘子', fx: { buzz: 7 }, risk: { p: 0.7, fx: { fav: -5 }, r: '「捏爆橘子身分就會改變嗎？」被酸到不行。' }, r: '居然很療癒。' },
      { t: '🚇 拍搭捷運通勤', fx: { buzz: 4 }, risk: { p: 0.5, fx: { fav: -4 }, r: '被拍到車廂裡有三個隨扈。' }, r: '樸實可愛。' },
      { t: '🙋 不演了，直接承認出身', fx: { fav: 3, rebel: 1, trust: -2 }, r: '「我出身好，但我想做事。」意外有人買單。' }
    ] },
  { id: 'god_dream', kind: 'fire', types: ['C'], who: 'staff', weeks: [3, 14],
    title: '城隍爺又託夢了',
    text: '{boss}早上進辦公室說：「城隍爺昨晚又託夢，叫我改政見。」',
    opts: [
      { t: '🙏 順著發新聞稿「神明指示」', fx: { buzz: 8 }, risk: { p: 0.6, fx: { fav: -5 }, r: '「那你真的是在做夢。」網友笑翻。' }, r: '宮廟系統很買單。', likes: ['C'] },
      { t: '🧠 委婉說服：「神明應該是要你聽民意」', fx: { respect: 1, trust: -2 }, risk: { p: 0.4, fx: { trust: -5 }, r: '「你比城隍爺懂？」' }, r: '{boss}想了想：「你說得也有道理。」' },
      { t: '🤐 當作沒聽到', fx: {}, r: '{boss}自己在臉書發了。', after: { buzz: 4, fav: -2 } }
    ] },
  { id: 'factory', kind: 'fire', types: ['C'], who: 'reporter', weeks: [5, 15],
    title: '自家集團的設廠案',
    text: '市府正在審的工業區設廠案，申請人剛好是{boss}的集團子公司。記者問：「選上之後要迴避嗎？」',
    opts: [
      { t: '🧱 宣布選上就交付信託、全面迴避', fx: { fav: 5, s: 0.6, trust: -2, respect: 1 }, r: '{boss}很不甘願，但效果很好。' },
      { t: '💼 「我比任何人都懂產業，為什麼要迴避？」', fx: { buzz: 6, fav: -5, s: -0.8 }, r: '利益衝突的標籤貼牢了。', likes: ['C'] },
      { t: '🔀 轉移話題，改講就業機會', fx: { fav: -1 }, r: '記者窮追不捨。' }
    ] },
  { id: 'party_res', kind: 'fire', types: ['B'], who: 'councilor', weeks: [4, 14],
    title: '黨部說資源要看民調',
    text: '黨部來電：「議員們擔心被拖累，下個月的資源要看你民調。」外界還在說你是「犧牲打」。',
    opts: [
      { t: '🤝 主動陪同黨議員跑行程，拉抬他們', fx: { liver: -6, net: 6, money: 8 }, r: '議員們開始覺得你不是累贅。' },
      { t: '💪 嗆聲：「我不是犧牲打，我是來贏的」', fx: { buzz: 6 }, risk: { p: 0.4, fx: { net: -5 }, r: '黨部覺得你太衝。' }, r: '支持者熱血沸騰。', ok: { fav: 3 } },
      { t: '📱 改走小額募款', fx: { money: 6, fav: 2 }, r: '小額捐款湧入，雖然不多但很有感。' }
    ] },
  { id: 'nerd', kind: 'fire', types: ['B'], who: 'reporter', weeks: [3, 15],
    title: '講著講著又回到本行',
    text: '市場拜票時，阿姨問菜價，{boss}講了十分鐘自己專業領域的國際情勢。',
    opts: [
      { t: '🎬 剪成「市長教室」系列短片', fx: { buzz: 6, fav: 2 }, r: '年輕人覺得很有料。' },
      { t: '🗣️ 幫{boss}準備「市政三十秒版本」', fx: { liver: -3, trust: -2 }, risk: { p: 0.4, fx: { trust: -3 }, r: '{boss}說：「三十秒講不清楚。」' }, r: '下次拜票順多了。', ok: { fav: 3, s: 0.4 } },
      { t: '🤷 隨便{he}', fx: { fav: -3 }, r: '「這個人好像不懂市場菜價。」' }
    ] },
  { id: 'qa_b', kind: 'fire', types: ['D'], who: 'reporter', weeks: [2, 16], timer: 15,
    title: '記者會問 A 答 B',
    text: '記者問天穹體育館漏水的進度，{boss}回答了一段捷運新路線的願景。',
    opts: [
      { t: '📝 幫{boss}做「一問一答」小卡', fx: { liver: -3, script: 1 }, risk: { p: 0.5, fx: { trust: -2 }, r: '{boss}看了一眼就收進口袋。' }, r: '下一場記者會答得乾淨俐落。', ok: { fav: 3 } },
      { t: '🎞️ 自嘲剪輯「市長的平行宇宙」', fx: { buzz: 7 }, risk: { p: 0.5, fx: { fav: -4 }, r: '被當成「承認自己答非所問」。' }, r: '意外變成可愛梗。' },
      { t: '🙈 減少記者會', fx: { buzz: -5, fav: -1 }, r: '「市長躲記者」。' }
    ] },
  { id: 'record', kind: 'fire', types: ['D'], who: 'pundit', weeks: [4, 14],
    title: '名嘴盤點四年政績',
    text: '政論節目做了一張「四年政績」圖卡，上面一片空白。',
    opts: [
      { t: '📈 連夜做政績懶人包反擊', fx: { liver: -6, fav: 3, s: 0.4 }, r: '湊出了十二項，其中三項是開幕剪綵。' },
      { t: '🔮 改講「下一個四年」的願景', fx: { buzz: 4 }, risk: { p: 0.4, fx: { fav: -3 }, r: '「前四年在幹嘛？」' }, r: '轉移焦點成功。' },
      { t: '😠 告名嘴', fx: { buzz: 6, fav: -5 }, r: '名嘴更紅了。' }
    ] },

  // ===== 戰情室日常（幕僚自己處理）=====
  { id: 'intern', kind: 'daily', staff: true, who: 'intern', weeks: [1, 16], timer: 15,
    title: '小編用錯帳號了！',
    text: '實習小編用競選粉專回了一則「哈哈這候選人好爛」，本來要用自己的帳號。已經 20 個讚了。',
    opts: [
      { t: '🗑️ 立刻刪文，當沒發生', fx: {}, risk: { p: 0.5, fx: { fav: -4, buzz: 6 }, r: '已經被截圖，「刪文市長」上熱搜。' }, r: '好險，沒人截到。' },
      { t: '😂 將錯就錯：「我們小編今天壓力很大」', fx: { buzz: 8, fav: 3 }, r: '網友笑翻，粉專追蹤暴增。' },
      { t: '😡 把小編罵到哭', fx: { liver: -3, con: -3 }, r: '小編離職，在 Dcard 發了一篇長文。', after: { fav: -3 } }
    ] },
  { id: 'bento', kind: 'daily', staff: true, who: 'volunteer', weeks: [1, 16], timer: 15,
    title: '便當訂錯了',
    text: '志工大姐訂了 200 個便當，送來才發現便當盒上印著{rival}的競選標誌。',
    opts: [
      { t: '🍱 照吃，拍照說「吃飽才有力氣打敗他」', fx: { buzz: 6, fav: 2 }, r: '網友：「好有風度。」' },
      { t: '🗑️ 偷偷撕掉貼紙再吃', fx: {}, risk: { p: 0.3, fx: { buzz: 5, fav: -2 }, r: '被志工拍到，傳上網。' }, r: '神不知鬼不覺。' },
      { t: '💸 全部退掉重訂', fx: { money: -4, liver: -2 }, r: '大家晚了兩小時吃飯。' }
    ] },
  { id: 'meme', kind: 'daily', staff: true, who: 'intern', weeks: [2, 16],
    title: '迷因爆紅，但意思被曲解',
    text: '你們做的政見梗圖爆紅了，可是大家拿來嘲諷{boss}。',
    opts: [
      { t: '🏄 順勢衝浪：再出一張自嘲版', fx: { buzz: 7, fav: 2 }, r: '網友：「這陣營有在看留言。」' },
      { t: '📢 出文澄清原意', fx: { fav: -2 }, r: '越解釋越好笑。' },
      { t: '🧘 不理它', fx: { buzz: 3 }, r: '三天後大家忘了。' }
    ] },
  { id: 'groupchat', kind: 'daily', staff: true, who: 'volunteer', weeks: [3, 16],
    title: '志工群組吵起來了',
    text: '兩派志工為了「誰負責發面紙」在群組吵到半夜，有人揚言退出。',
    opts: [
      { t: '🍵 親自買飲料去調解', fx: { liver: -4, money: -2, net: 3 }, r: '大家和好，還多了兩個志工。' },
      { t: '📜 訂下群組規則', fx: { liver: -2 }, risk: { p: 0.4, fx: { net: -3 }, r: '大姐覺得被管，退群了。' }, r: '秩序恢復。' },
      { t: '🔇 關掉通知去睡覺', fx: { liver: 4 }, r: '隔天少了五個志工。', after: { net: -3 } }
    ] },
  { id: 'typo', kind: 'daily', staff: true, who: 'staff', weeks: [2, 14], timer: 15,
    title: '看板字印錯了',
    text: '全市 300 面看板已經掛上去了，才發現「市政」印成「市正」。',
    opts: [
      { t: '🔧 全部撤下重印', fx: { money: -10, liver: -3 }, r: '花了錢，但沒人發現。' },
      { t: '😏 拍片：「我們很正，所以是市正」', fx: { buzz: 7 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被說連字都不會寫。' }, r: '居然變成流行語。' },
      { t: '🤞 祈禱沒人發現', fx: {}, risk: { p: 0.6, fx: { fav: -4, buzz: 5 }, r: '網友發現了。' }, r: '真的沒人發現。' }
    ] },
  { id: 'influencer', kind: 'daily', staff: true, who: 'intern', weeks: [3, 15],
    title: '網紅開價合作',
    text: '百萬訂閱的網紅願意拍一支跟{boss}的合作影片，開價不便宜。',
    opts: [
      { t: '💸 付錢拍', fx: { money: -12, buzz: 10, s: 0.6 }, need: 12, r: '影片破百萬觀看。' },
      { t: '🧃 請網紅來戰情室「真實體驗」', fx: { buzz: 6 }, risk: { p: 0.4, fx: { fav: -4 }, r: '網紅拍到戰情室的白板策略。' }, r: '自然的畫面很加分。' },
      { t: '🙅 不拍', fx: {}, r: '網紅轉去拍{rival}了。', after: { r: 0.4 } }
    ] },
  { id: 'oversleep', kind: 'daily', staff: true, who: 'staff', weeks: [6, 16], timer: 15,
    title: '你已經 36 小時沒睡了',
    text: '副總幹事看著你：「你臉色好差。」桌上還有三份新聞稿要改。',
    opts: [
      { t: '☕ 再喝一杯咖啡，撐下去', fx: { liver: -10, buzz: 2 }, r: '新聞稿準時發出。' },
      { t: '😴 回家睡一覺', fx: { liver: 12, buzz: -2 }, r: '醒來世界沒有毀滅。' },
      { t: '🧑‍🤝‍🧑 把工作分給實習生', fx: { liver: 6 }, risk: { p: 0.4, fx: { fav: -3 }, r: '新聞稿出現錯字。' }, r: '實習生意外可靠。' }
    ] },

  // ===== 金主 / 壞事 =====
  { id: 'donor1', kind: 'money', staff: true, who: 'donor', weeks: [2, 8],
    title: '金主來訪',
    text: '某建設公司老闆拎著紙袋來：「一點心意，交個朋友。」',
    opts: [
      { t: '🧾 公開收、依法申報', fx: { money: 8, fav: -1 }, r: '帳目清楚，只是被說跟建商好。' },
      { t: '🧩 請他讓員工分批小額捐', fx: { money: 18, con: -10, dirty1: 1 }, r: '帳面上很漂亮。（這件事遲早會被發現）' },
      { t: '🙅 婉拒', fx: { con: 6, r: 0.4 }, r: '金主轉身去找{rival}。' }
    ] },
  { id: 'donor2', kind: 'money', staff: true, who: 'donor', weeks: [8, 15],
    title: '金主又來了，這次要的更多',
    text: '「選上以後，那塊地的容積率幫個忙。這是誠意。」紙袋比上次大很多。',
    opts: [
      { t: '💼 收下', fx: { money: 30, con: -18, dirty2: 1 }, r: '資金一夜暴增。（這是定時炸彈）' },
      { t: '📼 收下，但偷偷錄音留證據', fx: { money: 30, con: -8, dirty2: 1, ledger: 1 }, r: '錄音檔鎖進保險箱。' },
      { t: '🚪 請他離開', fx: { con: 8 }, r: '他冷笑：「你們會後悔。」', after: { r: 0.5 } }
    ] },
  { id: 'votebuy', kind: 'money', staff: true, who: 'chief', weeks: [12, 16],
    title: '里長伯的「傳統做法」',
    text: '里長伯小聲說：「我這區有兩千票，一票五百，包你穩。」',
    opts: [
      { t: '💵 交給你處理', fx: { money: -15, s: 2, con: -25, buy: 1 }, r: '票好像穩了。（做壞事一定會被抓）' },
      { t: '🙅 斷然拒絕', fx: { con: 8, net: -4 }, r: '里長伯很不爽，轉去幫{rival}。', after: { r: 0.4 } },
      { t: '🧭 改請里長辦公益活動', fx: { money: -6, favor: 1, fav: 2 }, r: '合法又有溫度。' }
    ] },
  { id: 'redmoney', kind: 'money', staff: true, who: 'shady', weeks: [7, 15],
    title: '境外資金牽線',
    text: '某商會會長說他代表 X 國的朋友：「資金、網軍、媒體，我們都可以幫忙。你只要牽個線。」',
    opts: [
      { t: '🤝 答應牽線', fx: { money: 35, buzz: 8, con: -30, foreign: 1 }, r: '資源突然多到用不完。（做壞事一定會被抓）' },
      { t: '🚨 當場拒絕，並報給調查單位', fx: { con: 10, fav: 3 }, r: '你的名字出現在國安單位的感謝名單上。' },
      { t: '🙄 只說「我考慮看看」', fx: { con: -4 }, r: '會長留下名片，說會再聯絡。' }
    ] },

  // ===== 政論節目 =====
  { id: 'tv1', kind: 'tv', who: 'pundit', weeks: [3, 9],
    title: '要不要派{boss}上政論節目？',
    text: '《深夜熱炒台》邀{boss}上節目，對面坐的是最會酸人的名嘴。',
    opts: [
      { t: '🎤 上！', fx: { tv: 1, liver: -3 }, risk: { p: 0.45, fx: { fav: -6, buzz: 8, s: -0.8 }, r: '被名嘴問倒，片段被剪成迷因。' }, r: '舌戰群雄，片段瘋傳。', ok: { buzz: 10, fav: 4, s: 1 } },
      { t: '🧑‍💼 派發言人', fx: { tv: 1, buzz: 3 }, r: '平穩過關，不痛不癢。' },
      { t: '📝 只發新聞稿', fx: { buzz: -1 }, r: '名嘴說：「不敢來。」' }
    ] },
  { id: 'tv2', kind: 'tv', who: 'pundit', weeks: [9, 16],
    title: '名嘴把你上週的決定斷章取義',
    text: '《名嘴大亂鬥》把{boss}上週的發言剪成相反的意思，今晚還要再談。',
    opts: [
      { t: '📺 老闆 call in 澄清', fx: { tv: 1, buzz: 6 }, risk: { p: 0.4, fx: { fav: -4 }, r: '被主持人打斷，越描越黑。' }, r: '澄清成功，主持人尷尬。', ok: { fav: 3 } },
      { t: '🎬 自己剪完整版放上網', fx: { fav: 3, liver: -3 }, r: '網友：「原來是被剪接。」' },
      { t: '🤐 已讀不回', fx: { fav: -3 }, r: '名嘴連講了三集。' }
    ] },

  // ===== 議員、里長 =====
  { id: 'payback', kind: 'fire', needFavor: true, who: 'chief', weeks: [6, 17],
    title: '欠的人情來討了',
    text: '之前幫過忙的人來電：「週末宮廟遶境，{boss}要來，而且站台要把我排前面。」',
    opts: [
      { t: '✅ 照辦', fx: { favor: -1, liver: -4, s: 0.3 }, r: '人情還了，地方很滿意。' },
      { t: '🙏 派副手去', fx: { favor: -1, net: -3 }, r: '對方覺得被看輕。' },
      { t: '🙅 推掉', fx: { net: -8 }, r: '「以後別來找我。」', after: { r: 0.4 } }
    ] },

  // ===== 天災：現任視察、挑戰者幫忙，幕僚都要寫稿 =====
  { id: 'flood_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [2, 12], timer: 15, late: true,
    title: '凌晨兩點，舊城區淹水',
    text: '暴雨一小時下了 120 毫米，舊城區水淹半層樓。{boss}要去視察，你要在出發前寫好講稿。',
    opts: [
      { t: '🥾 穿雨鞋涉水視察，你連夜寫稿', fx: { fav: 5, s: 0.8, liver: -8 }, risk: { p: 0.25, fx: { fav: -4 }, r: '雨鞋太新，被說作秀。' }, r: '畫面感人，講稿也到位。' },
      { t: '🖥️ 坐鎮災害應變中心開記者會', fx: { fav: 2, liver: -5 }, r: '穩重，但少了現場感。' },
      { t: '📱 先發一篇臉書，天亮再去', fx: { liver: 2 }, risk: { p: 0.6, fx: { fav: -7, s: -1.2 }, r: '「市長在睡覺，市民在泡水。」' }, r: '剛好雨停了，沒人注意。' }
    ] },
  { id: 'flood_chal', kind: 'fire', for: 'chal', who: 'volunteer', weeks: [2, 12], timer: 15, late: true,
    title: '凌晨兩點，舊城區淹水',
    text: '暴雨成災。志工群組炸開了：「我們要不要去幫忙清淤？」你得同時準備一份聲明稿。',
    opts: [
      { t: '🧹 帶志工去清淤，你連夜寫稿', fx: { fav: 6, s: 0.8, liver: -9 }, risk: { p: 0.25, fx: { fav: -4 }, r: '有人拍到{boss}只在鏡頭前拿鏟子。' }, r: '一身泥巴的照片被瘋傳。' },
      { t: '🍙 默默送物資，不發新聞', fx: { fav: 3, money: -6, con: 4 }, r: '居民記住了。' },
      { t: '📢 發聲明批市府排水失能', fx: { buzz: 5, r: -0.6 }, risk: { p: 0.5, fx: { fav: -5 }, r: '「災民還在泡水，你在選舉。」' }, r: '批得剛好，市府被追問。' }
    ] },

  // ===== 選戰路線 =====
  { id: 'family', kind: 'fire', who: 'staff', weeks: [6, 16],
    title: '對手家人的八卦',
    text: '有人提供{rival}家人的爆料：小孩出國留學的錢來源不明。副總幹事眼睛發亮。',
    opts: [
      { t: '💣 開記者會爆料', fx: { r: -1.5, buzz: 8, con: -12 }, risk: { p: 0.45, fx: { fav: -8, s: -1.5 }, r: '證據不足，被告加重誹謗，網友說「打家人太low」。' }, r: '對手陣營大亂。' },
      { t: '🕊️ 拒絕：「我們打政策，不打家人」', fx: { con: 8, fav: 3 }, r: '副總幹事碎念，但這段話被媒體引用。' },
      { t: '🤫 交給側翼「不小心」流出', fx: { r: -0.8, con: -8 }, risk: { p: 0.4, fx: { fav: -6, s: -1 }, r: '側翼帳號被查出跟你們有關。' }, r: '神不知鬼不覺。' }
    ] },
  { id: 'designer', kind: 'daily', staff: true, who: 'intern', weeks: [1, 6],
    title: '競選視覺要找誰做？',
    text: '主視覺、看板、文宣都要做了。預算有限。',
    opts: [
      { t: '🎨 花錢請專業設計公司', fx: { money: -14, fav: 4, buzz: 4 }, need: 14, r: '質感一流，被設計圈稱讚。' },
      { t: '🤖 用 AI 免費生成', fx: {}, risk: { p: 0.6, fx: { fav: -4, buzz: 6 }, r: '看板上的人有六根手指。' }, r: '居然還不錯看。' },
      { t: '👦 讓副總幹事的姪子做（他說他會）', fx: {}, risk: { p: 0.5, fx: { fav: -3, buzz: 4 }, r: '被抓到抄襲國外設計。' }, r: '樸實的手作感，意外有親和力。' }
    ] },
  { id: 'corp', kind: 'money', staff: true, who: 'donor', weeks: [4, 14],
    title: '財團要贊助造勢晚會',
    text: '某大財團願意全額贊助下一場造勢晚會，合法、會開收據。條件是舞台上要放他們的 logo。',
    opts: [
      { t: '🤝 接受', fx: { money: 18, fav: -4 }, r: '晚會很盛大，但「財團候選人」的標籤也來了。', likes: ['C'] },
      { t: '🙅 婉拒，改辦小型的', fx: { fav: 2, con: 4 }, r: '規模小，但很溫馨。' },
      { t: '🔀 接受，但 logo 只放在後台', fx: { money: 12 }, risk: { p: 0.4, fx: { fav: -5 }, r: '記者拍到後台。' }, r: '兩全其美。' }
    ] },
  { id: 'cat', kind: 'daily', staff: true, who: 'intern', weeks: [2, 16],
    title: '{boss}的貓闖進直播',
    text: '直播講政見講到一半，{boss}家的貓跳上桌，把麥克風推倒了。觀看人數暴增。',
    opts: [
      { t: '🐱 開「市長貓」帳號', fx: { buzz: 10, fav: 4 }, r: '貓的追蹤數一週就超越老闆。' },
      { t: '📋 剪掉貓，重播政見', fx: { fav: 1 }, r: '網友：「貓呢？」' },
      { t: '🛍️ 推出貓咪募款小物', fx: { money: 10, buzz: 6 }, risk: { p: 0.3, fx: { fav: -2 }, r: '被說消費寵物。' }, r: '貓咪貼紙秒殺。' }
    ] },
  { id: 'flyer', kind: 'fire', who: 'volunteer', weeks: [10, 17], timer: 15,
    title: '黑函滿天飛',
    text: '一夜之間，社區信箱都塞了匿名黑函，說{boss}私生活不檢點。',
    opts: [
      { t: '⚖️ 立刻報案，提告散布者', fx: { fav: 3, liver: -3 }, r: '「清者自清」的形象加分。' },
      { t: '📢 開記者會逐條澄清', fx: { buzz: 4 }, risk: { p: 0.4, fx: { fav: -3 }, r: '反而讓更多人知道黑函內容。' }, r: '說服了大部分人。' },
      { t: '🔁 「一定是{rival}陣營幹的」', fx: { r: -0.6, buzz: 5 }, risk: { p: 0.5, fx: { fav: -5 }, r: '沒有證據，被反告。' }, r: '輿論轉向對手。' }
    ] },
  { id: 'fanclub', kind: 'daily', staff: true, who: 'volunteer', weeks: [4, 16],
    title: '後援會想辦應援',
    text: '年輕支持者自組後援會，想做{boss}的應援手燈和小卡，還想辦握手會。',
    opts: [
      { t: '🤝 辦握手會！', fx: { buzz: 8, fav: 3, liver: -6 }, risk: { p: 0.25, fx: { fav: -3 }, r: '{boss}握到第三百個人時臉垮了，被拍到。' }, r: '排隊排到巷口，「我推的市長」上了熱搜。' },
      { t: '🎴 授權他們做小卡、手燈', fx: { money: 6, buzz: 5 }, r: '應援色在街上隨處可見。' },
      { t: '😬 婉拒：「我們是選舉，不是追星」', fx: { fav: -2 }, r: '後援會解散了一半。' }
    ] },

  { id: 'venue_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [5, 15],
    title: '對手申請市府廣場辦造勢',
    text: '{rival}陣營申請下個月在市府廣場辦大型造勢。審核權在市府手上，局長小聲問：「要不要……慢慢審？」',
    opts: [
      { t: '✅ 依法核准', fx: { con: 5, fav: 2 }, r: '「市長氣度不錯。」連對手支持者都這樣說。' },
      { t: '🐢 「文件不齊」，一直退件', fx: { r: -1, con: -12 }, risk: { p: 0.7, fx: { fav: -8, s: -1.5 }, r: '公文被記者拿到，「行政濫權」上了頭版。（做壞事一定會被抓）' }, r: '對手只好換到偏遠場地。' },
      { t: '🎪 核准，但同一天在隔壁辦市府音樂節', fx: { r: -0.6, con: -6 }, risk: { p: 0.5, fx: { fav: -5, s: -0.8 }, r: '網友：「這也太明顯了吧。」' }, r: '人潮被分流了。' }
    ] },
  { id: 'venue_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [5, 15],
    title: '造勢場地被卡了',
    text: '你們申請市府廣場辦造勢，被退件三次，理由都是「文件不齊」。',
    opts: [
      { t: '📢 開記者會控訴「行政濫權」', fx: { buzz: 8, r: -0.8 }, risk: { p: 0.3, fx: { fav: -2 }, r: '被說愛哭。' }, r: '市府被罵翻，隔天就核准了。' },
      { t: '🏟️ 改到河濱辦，主打「人民的廣場」', fx: { fav: 4, money: -5, s: 0.5 }, r: '人潮反而更多。' },
      { t: '🤝 請議員去議會質詢施壓', fx: { favor: 1, net: 3 }, r: '議員幫你出了口氣，但你欠他一次。' }
    ] },

  { id: 'hollow', kind: 'fire', types: ['E'], who: 'pundit', weeks: [3, 15],
    title: '被酸「講話沒溫度」',
    text: '名嘴說{boss}講話像在念論文：「選民感受不到{he}的心。」',
    opts: [
      { t: '🐱 拍{boss}在家顧貓的日常', fx: { buzz: 8, fav: 4, warm: 1 }, r: '「原來{he}會對貓撒嬌！」好感暴增。', likes: ['E'] },
      { t: '😂 讓{boss}硬擠一個笑話', fx: { buzz: 5 }, risk: { p: 0.6, fx: { fav: -4 }, r: '冷場三秒，被剪成迷因。' }, r: '居然有點可愛。', ok: { warm: 1 } },
      { t: '📑 回應：「我們用政策說話」', fx: { fav: 1 }, r: '支持者說讚，其他人沒感覺。' }
    ] },
  { id: 'forum', kind: 'fire', types: ['E'], who: 'foreign', weeks: [4, 14],
    title: '國際城市論壇邀請演講',
    text: '國際城市論壇邀{boss}用英文演講，主題是 N City 的未來。',
    opts: [
      { t: '🌐 去，全英文演講', fx: { buzz: 5, fav: 3, s: 0.5, liver: -4 }, r: '外媒報導，國際形象加分。', likes: ['E'] },
      { t: '🏘️ 不去，留在 N City 跑基層', fx: { s: 0.6, warm: 1, liver: -5 }, r: '「這次{he}有來我們市場耶。」' },
      { t: '🎥 錄影參加，兩邊都顧', fx: { buzz: 3 }, risk: { p: 0.3, fx: { fav: -2 }, r: '網路卡頓，畫面定格在{boss}的鬼臉。' }, r: '效率很高。' }
    ] },
  { id: 'adlib', kind: 'fire', types: ['F'], who: 'staff', weeks: [3, 16], timer: 15,
    title: '{boss}又把稿子丟了',
    text: '造勢晚會上，{boss}把你熬夜寫的講稿丟到一旁：「我今天要講心裡的話！」群眾已經在尖叫了。',
    opts: [
      { t: '🔥 隨{he}去，現場氣氛最重要', fx: { buzz: 10, s: 0.8 }, risk: { p: 0.45, fx: { fav: -6, s: -1 }, r: '講到激動，說出一句會被剪三天的話。' }, r: '全場沸騰，影片破百萬。', likes: ['F'] },
      { t: '📟 在台下舉大字報提詞', fx: { trust: -2 }, risk: { p: 0.4, fx: { buzz: 4 }, r: '{boss}沒看，還在台上說：「我的幕僚在下面很緊張。」' }, r: '{boss}瞄了一眼，順利收尾。', ok: { fav: 2 } },
      { t: '🎶 請 DJ 提早放音樂收尾', fx: { trust: -5 }, r: '{boss}下台後臭臉一整晚。' }
    ] },
  { id: 'court', kind: 'fire', types: ['F'], who: 'reporter', weeks: [5, 15],
    title: '律師本色：要不要告？',
    text: '對手陣營說{boss}「當年打官司都在幫壞人」。{boss}說：「我要告到他道歉。」',
    opts: [
      { t: '⚖️ 開記者會宣布提告', fx: { buzz: 6 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被說「動不動就告」。' }, r: '律師氣勢全開。', likes: ['F'] },
      { t: '📂 公布當年的案件，讓事實說話', fx: { fav: 4, liver: -5, s: 0.4 }, r: '被扭曲的事一件件澄清了。' },
      { t: '🙏 勸{boss}忍下來', fx: { trust: -4, con: 3 }, risk: { p: 0.4, fx: { buzz: 3 }, r: '{boss}忍了兩天，還是在臉書罵了。' }, r: '風波自然退燒。' }
    ] },
  { id: 'temptation', kind: 'money', types: ['F'], staff: true, who: 'donor', weeks: [6, 15],
    title: '老朋友說要「幫忙」',
    text: '{boss}的老朋友說：「選舉很花錢，我有個海外帳戶可以先借你們用。」',
    opts: [
      { t: '🙅 拒絕，並提醒{boss}守住初心', fx: { con: 10, trust: -2 }, r: '{boss}沉默了一下：「你說得對。」' },
      { t: '💼 收下再說', fx: { money: 25, con: -20, dirty2: 1 }, r: '錢到位了。（做壞事一定會被抓）' },
      { t: '🧾 請他改成公開捐款', fx: { money: 6 }, r: '對方覺得麻煩，只捐了一點。' }
    ] },

  { id: 'deepfake', kind: 'fire', who: 'intern', weeks: [12, 17], timer: 15,
    title: 'AI 假影片瘋傳',
    text: '一支 AI 合成影片在群組瘋傳，裡面的{boss}說：「N City 的老人都該搬走。」聲音、表情都超像。',
    opts: [
      { t: '🔬 找鑑識專家公開比對破綻', fx: { fav: 3, money: -6, liver: -4 }, r: '專家指出影片裡的時鐘在倒轉。謠言破了。' },
      { t: '🎥 {boss}立刻開直播親自澄清', fx: { buzz: 6, fav: 2 }, risk: { p: 0.3, fx: { fav: -3 }, r: '長輩們看完直播還是只記得假影片。' }, r: '真人比假人有溫度。' },
      { t: '🤐 不理，越回應越紅', fx: {}, risk: { p: 0.6, fx: { fav: -6, s: -1.2 }, r: '長輩群組又轉了三萬次。' }, r: '剛好被別的新聞蓋過去。' }
    ] },
  { id: 'mole', kind: 'daily', staff: true, who: 'staff', weeks: [6, 15], timer: 15,
    title: '戰情室有內鬼',
    text: '你們昨天才定案的政見，今天早上就被{rival}搶先發表了。白板的照片一定被傳出去了。',
    opts: [
      { t: '🕵️ 放假消息抓內鬼', fx: { liver: -4 }, risk: { p: 0.4, fx: { net: -4 }, r: '抓錯人，冤枉了最認真的志工。' }, r: '抓到了！是新來的工讀生。對手反而被假消息騙了。', ok: { r: -0.6, buzz: 4 } },
      { t: '🔐 全面收手機、白板上鎖', fx: { net: -3 }, r: '安全了，但大家覺得被當賊。' },
      { t: '🙌 公開說「好政見歡迎大家抄」', fx: { fav: 4, buzz: 4 }, r: '網友：「這格局。」' }
    ] },
  { id: 'hotmic', kind: 'fire', who: 'intern', weeks: [3, 16], timer: 15,
    title: '以為關麥了',
    text: '直播結束，{boss}以為鏡頭關了，伸懶腰說：「終於講完了，這些問題好無聊。」直播其實還開著。',
    opts: [
      { t: '🙇 馬上回來道歉：「我是說我好累」', fx: { fav: -1 }, r: '誠實的累，網友勉強接受。' },
      { t: '😂 剪成「市長下班模式」系列', fx: { buzz: 8 }, risk: { p: 0.4, fx: { fav: -5 }, r: '被說不尊重提問的市民。' }, r: '真實感爆棚，意外圈粉。' },
      { t: '🗑️ 刪掉影片', fx: {}, risk: { p: 0.7, fx: { fav: -6, buzz: 6 }, r: '早就被錄下來了，「刪片市長」上熱搜。' }, r: '幸好只有十幾個人在看。' }
    ] },
  { id: 'egg', kind: 'fire', who: 'volunteer', weeks: [6, 16], timer: 15,
    title: '掃街時被丟雞蛋',
    text: '車隊掃街時，有人從騎樓丟了一顆雞蛋，正中{boss}的西裝。現場都是鏡頭。',
    opts: [
      { t: '😊 笑著擦掉：「蛋白質很營養」', fx: { fav: 5, buzz: 6, s: 0.5 }, r: '風度滿分的畫面被大量轉傳。' },
      { t: '🚓 立刻報警，暫停掃街', fx: { fav: 1 }, r: '安全第一，但氣勢斷了。' },
      { t: '😡 怒指「一定是對手指使」', fx: { buzz: 5, r: -0.4 }, risk: { p: 0.6, fx: { fav: -5 }, r: '丟蛋的人是不滿停車費的路人。' }, r: '輿論一面倒同情你。' }
    ] },
  { id: 'centralload', kind: 'fire', types: ['B', 'E', 'F'], who: 'reporter', weeks: [4, 15],
    title: '中央政策拖累',
    text: '蜂鳥黨中央的新政策引發眾怒，選民把氣出在地方候選人身上：「你們黨就是這樣。」',
    opts: [
      { t: '🗣️ 公開跟中央唱反調', fx: { fav: 4, net: -6 }, r: '中間選民加分，黨內有人不爽。' },
      { t: '🤝 幫中央解釋政策', fx: { fav: -3, net: 4 }, r: '黨部很滿意，選民不買單。' },
      { t: '🔀 只談 N City 的事', fx: { fav: 1 }, r: '躲過一劫，但被說沒立場。' }
    ] },
  { id: 'votingday', kind: 'main', who: 'intern', weeks: [99, 99], title: '投票日早上',
    text: '投票日當天，法律禁止拉票。小編問：「可以發一張{boss}去投票的照片，配『大家記得出門投票』嗎？」',
    opts: [
      { t: '📸 只發投票照，不寫任何拉票字眼', fx: { buzz: 2 }, r: '合法又有存在感。' },
      { t: '🙏 發「拜託大家支持 {num} 號」', fx: { s: 0.5, con: -8 }, risk: { p: 0.8, fx: { s: -1.5, fav: -6 }, r: '被檢舉違法拉票，開票前就上新聞。（做壞事一定會被抓）' }, r: '居然沒人檢舉。' },
      { t: '🤐 什麼都不發', fx: {}, r: '安靜等開票。' }
    ] },

  { id: 'surprise', kind: 'fire', who: 'reporter', weeks: [14, 16], timer: 15,
    title: '十一月驚奇',
    text: '投票前兩週，一家週刊說手上有{boss}的「重大爆料」，明天出刊，要你們今晚回應。內容是什麼，你們也不知道。',
    opts: [
      { t: '🛡️ 先發制人：今晚開記者會「歡迎檢驗」', fx: { buzz: 5, fav: 2, liver: -4 }, r: '週刊出刊，內容只是{boss}大學時被當掉的成績單。' },
      { t: '⚖️ 發律師函要求撤稿', fx: { buzz: 4 }, risk: { p: 0.5, fx: { fav: -5, s: -0.8 }, r: '「心虛才發律師函。」' }, r: '週刊縮小篇幅，影響有限。' },
      { t: '🙈 不回應，等出刊再說', fx: {}, risk: { p: 0.5, fx: { fav: -4, s: -1 }, r: '標題寫：「{boss}陣營拒絕回應」。' }, r: '爆料內容很弱，沒人在意。' }
    ] },
  { id: 'prompter', kind: 'main', who: 'staff', weeks: [99, 99], timer: 10,
    title: '電視辯論・提詞機壞了',
    text: '辯論開始前五分鐘，{boss}的提詞機黑屏了。副總幹事臉色發白。',
    opts: [
      { t: '🧠 讓{boss}脫稿上陣', fx: { buzz: 4 }, risk: { p: 0.4, fx: { fav: -5, s: -0.8 }, r: '{boss}講到一半忘詞，空白了五秒。' }, r: '脫稿反而更真誠！', ok: { fav: 4, s: 0.6 }, likes: ['F'] },
      { t: '📝 你在鏡頭外舉大字報', fx: { liver: -3 }, r: '平穩過關，你的手舉到抽筋。' },
      { t: '🙏 請主辦單位延後五分鐘', fx: { fav: -2 }, r: '對手陣營酸「還沒準備好」。' }
    ] },

  { id: 'rat_inc', kind: 'fire', for: 'inc', who: 'director', weeks: [2, 16], timer: 15,
    title: '老鼠在捷運站跑給你看',
    text: '有人拍到老鼠在捷運站月台散步，影片破百萬。議員質問：「N City 的老鼠到底變多還是變少？」局長說：「沒有數老鼠的模型。」',
    opts: [
      { t: '🧹 宣布全市大掃除、斷絕廚餘源頭', fx: { fav: 4, money: -6, s: 0.5 }, r: '雖然慢，但大家看到市府在做事。' },
      { t: '🗑️ 把公園垃圾桶全部封起來', fx: { buzz: 5 }, risk: { p: 0.6, fx: { fav: -6, s: -0.8 }, r: '網友：「垃圾桶封印術？老鼠會改去吃別的。」' }, r: '公園乾淨了一點。' },
      { t: '📊 回應：「陳情案件有下降」', fx: { fav: -4, buzz: 3 }, r: '「市民不陳情是因為放棄了。」' }
    ] },
  { id: 'rat_chal', kind: 'fire', for: 'chal', who: 'staff', weeks: [2, 16], timer: 15,
    title: '老鼠成了選戰話題',
    text: '市區鼠患的影片到處都是。副總幹事說：「這題可以打，但要打得漂亮。」',
    opts: [
      { t: '🐀 帶記者去後巷「抓老鼠實境秀」', fx: { buzz: 8 }, risk: { p: 0.35, fx: { fav: -3 }, r: '{boss}看到老鼠尖叫的畫面被做成迷因。' }, r: '畫面超有梗，各台都播。' },
      { t: '📐 提出「垃圾不落地 2.0」政見', fx: { fav: 4, s: 0.6 }, r: '專業又具體。', likes: ['B', 'E'] },
      { t: '⚔️ 猛批「市府只做輿情管理」', fx: { r: -0.6, buzz: 4 }, risk: { p: 0.3, fx: { fav: -3 }, r: '被說製造恐慌。' }, r: '市府招架不住。' }
    ] },
  { id: 'trash', kind: 'fire', who: 'chief', weeks: [3, 16],
    title: '垃圾車路線改了，里民大暴動',
    text: '垃圾車改時間，里長伯說里民都在罵：「倒個垃圾要追三條街！」{incTrash}',
    opts: [
      { t: '🚛 請{boss}去追一次垃圾車體驗民情', fx: { buzz: 6, fav: 3, liver: -3 }, risk: { p: 0.3, fx: { fav: -2 }, r: '{boss}追不到，被路人拍到在後面喘。' }, r: '「這個人懂我們的痛。」' },
      { t: '📝 承諾當選後恢復原路線', fx: { s: 0.5, favor: 1 }, r: '里長伯滿意，你欠他一次。' },
      { t: '🤷 「這是環保局的事」', fx: { fav: -4 }, r: '里民覺得被敷衍。' }
    ] },

  { id: 'familyshow', kind: 'fire', who: 'staff', weeks: [3, 14],
    title: '要不要讓家人亮相？',
    text: '副總幹事說：「選民想看{boss}的另一面。造勢晚會，要不要請家人上台？」',
    opts: [
      { t: '👨‍👩‍👧 全家一起上台', fx: { fav: 4, buzz: 5, s: 0.5 }, risk: { p: 0.35, fx: { fav: -4, buzz: 4 }, r: '小孩在台上說：「爸媽在家都在吵選舉的事。」' }, r: '溫馨畫面，好感大增。', likes: ['A', 'F'], hates: ['E'] },
      { t: '💌 只請另一半拍一支暖心影片', fx: { fav: 3, buzz: 3 }, r: '「原來{he}在家是這樣的人。」' },
      { t: '🛡️ 都不要，保護家人隱私', fx: { con: 4, trust: 3 }, r: '{boss}私下跟你說了聲謝謝。', likes: ['E', 'C'] }
    ] },

  // ===== 落後 / 領先危機 =====
  { id: 'behind_poll', kind: 'crisis', crisis: 'behind', who: 'reporter', weeks: [1, 17],
    title: '對手宣稱領先 15%',
    text: '{rival}陣營公布自家民調：「領先 15%！」支持者開始動搖，記者在等你回應。',
    opts: [
      { t: '📊 公布我們的內參數字', fx: { buzz: 4 }, risk: { p: 0.5, fx: { fav: -3 }, r: '我們的數字也不好看。' }, r: '穩住軍心。' },
      { t: '😭 打悲情牌：「我們需要你！」', fx: { buzz: 6, s: 1 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被說太早喊救命。' }, r: '支持者回流。' },
      { t: '⚔️ 開始打負面選戰', fx: { r: -1.2, con: -8, fav: -2 }, r: '對手掉了一點，你的良心也是。' }
    ] },
  { id: 'behind_donor', kind: 'crisis', crisis: 'behind', who: 'donor', weeks: [1, 17],
    title: '金主：「還有機會嗎？」',
    text: '大金主打電話來：「民調這樣，我要考慮一下。」',
    opts: [
      { t: '📈 熬夜做翻盤簡報給他看', fx: { liver: -6 }, risk: { p: 0.4, fx: { money: -10 }, r: '金主看完還是撤了。' }, r: '金主被說服，繼續支持。' },
      { t: '🙏 請{boss}親自打電話', fx: { trust: -2 }, risk: { p: 0.3, fx: { money: -8 }, r: '{boss}在電話裡說錯話。' }, r: '金主感受到誠意。', ok: { money: 5 } },
      { t: '👋 放手', fx: { money: -12 }, r: '少了一筆錢。' }
    ] },
  { id: 'behind_cut', kind: 'crisis', crisis: 'behind', who: 'councilor', weeks: [1, 17],
    title: '同黨議員開始切割',
    text: '議員的看板上，{boss}的照片不見了。議員說：「我要顧自己的選區。」',
    opts: [
      { t: '🤝 主動去議員選區陪掃街', fx: { liver: -6, net: 4 }, r: '議員又把照片貼回去了。' },
      { t: '🙏 欠人情，請議員幫忙動員', fx: { favor: 1, s: 0.5 }, r: '議員答應了，但會記帳。' },
      { t: '🤷 隨他', fx: { cut: 1, s: -0.5 }, r: '母雞變成孤鳥。' }
    ] },
  { id: 'ahead_relax', kind: 'crisis', crisis: 'ahead', who: 'staff', weeks: [1, 17],
    title: '老闆開始輕敵',
    text: '民調大幅領先，{boss}開始在記者面前說：「這場選舉沒有懸念。」',
    opts: [
      { t: '🧯 提醒{he}「選到最後一秒」', fx: { trust: -2 }, risk: { p: 0.4, fx: { fav: -3 }, r: '{he}不聽，又講了一次。' }, r: '{boss}收斂了。', ok: { fav: 2 } },
      { t: '📅 把行程排滿，讓{he}沒空亂講', fx: { liver: -6, s: 0.4 }, r: '累，但安全。' },
      { t: '🍾 先慶祝一下也無妨', fx: { fav: -5, s: -1.2 }, r: '「傲慢」標籤貼上來了。' }
    ] }
];

// 主線事件（固定週次）
const MAIN = {
  5: [{ id: 'register', kind: 'main', who: 'staff',
    title: '候選人登記日',
    text: '今天到選委會登記，各家媒體都在。要怎麼去？',
    opts: [
      { t: '🎉 大陣仗遊行去登記', fx: { money: -10, buzz: 8, s: 0.6 }, need: 10, r: '氣勢如虹。' },
      { t: '🚲 騎腳踏車低調去', fx: { buzz: 4, fav: 3 }, r: '清新形象加分。', likes: ['B'] },
      { t: '👨‍👩‍👧 帶全家人一起去', fx: { buzz: 5 }, risk: { p: 0.4, fx: { fav: -3 }, r: '長輩又搶話了。' }, r: '溫馨畫面。', likes: ['A'] }
    ] }],
  12: [{ id: 'number', kind: 'main', who: 'staff',
    title: '號次抽籤',
    text: '{boss}抽到了 {num} 號。要怎麼做口號？',
    opts: [
      { t: '🔢 諧音梗口號', fx: { buzz: 6, fav: 2 }, r: '朗朗上口。' },
      { t: '🙅 不玩號碼，主打政見', fx: { fav: 2, s: 0.3 }, r: '穩健。' },
      { t: '🔮 說這是「天選號碼」', fx: { buzz: 5 }, risk: { p: 0.4, fx: { fav: -3 }, r: '被酸迷信。' }, r: '宮廟系統很喜歡。', likes: ['C'] }
    ] }],
  13: [
    'prompter',
    { id: 'debate1', kind: 'main', who: 'pundit', timer: 10,
      title: '電視辯論・第一題',
      text: '主持人：「請問你四年後要讓 N City 的房價怎麼樣？」',
      opts: [
        { t: '🏠 「社宅加倍，讓年輕人住得起」', fx: { fav: 3, s: 0.5 }, r: '年輕觀眾按讚。' },
        { t: '📉 「房價會跌」', fx: { buzz: 6 }, risk: { p: 0.5, fx: { fav: -4 }, r: '有房的人嚇壞了。' }, r: '勇敢。' },
        { t: '🔄 反問對手', fx: { r: -0.5, buzz: 3 }, r: '對手愣住。' }
      ] },
    { id: 'debate2', kind: 'main', who: 'pundit', timer: 10,
      title: '電視辯論・第二題',
      text: '{rival}質問：「你的團隊有人收過不明政治獻金嗎？」',
      opts: [
        { t: '😤 「絕對沒有！」', fx: {}, r: '', dirtyCheck: true },
        { t: '🔁 反問：「那你呢？」', fx: { buzz: 4, r: -0.3 }, r: '兩邊互咬。' },
        { t: '📂 「歡迎查帳」', fx: { fav: 3 }, r: '底氣十足。', dirtyCheck: true }
      ] },
    { id: 'debate3', kind: 'main', who: 'pundit', timer: 10,
      title: '電視辯論・結辯',
      text: '最後一分鐘，鏡頭對準{boss}。',
      opts: [
        { t: '😭 感性：講自己的家人', fx: { fav: 4, s: 0.6 }, r: '有人哭了。' },
        { t: '📋 理性：重申三大政見', fx: { fav: 2, s: 0.4 }, r: '清楚有力。', likes: ['B'] },
        { t: '⚔️ 最後一擊：猛攻對手', fx: { r: -0.8, fav: -2, buzz: 5 }, r: '火藥味十足。' }
      ] }
  ],
  17: [{ id: 'eve', kind: 'main', who: 'staff',
    title: '選前之夜',
    text: '明天就投票了。最後一晚怎麼過？',
    opts: [
      { t: '🎆 辦超大型選前之夜', fx: { money: -20, s: 1.5, buzz: 10, liver: -8 }, need: 20, r: '十萬人揮舞旗幟。' },
      { t: '🛵 車隊掃街到最後一秒', fx: { s: 1, liver: -10 }, r: '每條巷子都喊過了。' },
      { t: '📰 只發新聞稿，讓大家早點休息', fx: { fav: 2, liver: 8 }, risk: { p: 0.5, fx: { s: -0.6 }, r: '被說氣勢不足。' }, r: '團隊精神飽滿迎接開票。' }
    ] }, 'votingday']
};

// ---------------- 成就老闆企劃（沒火的時候）----------------
const BUILD = [
  { id: 'street', t: '🚶 拜託同黨議員帶{boss}掃街拜票', fx: { s: 0.8, liver: -5, favor: 1 }, likes: ['A', 'D'] },
  { id: 'market', t: '🥬 跑傳統市場拜票', fx: { s: 0.6, fav: 2, liver: -4 }, hates: ['C'],
    risk: { p: 0.25, fx: { fav: -3, buzz: 4 }, r: '{boss}問阿姨：「一斤高麗菜一千塊嗎？」' } },
  { id: 'short', t: '📱 拍親民短影音', fx: { buzz: 6, fav: 1 }, risk: { p: 0.3, fx: { fav: -3 }, r: '太做作，被留言酸。' } },
  { id: 'tvgo', t: '📺 派{boss}上政論節目', fx: { tv: 1, liver: -3 }, risk: { p: 0.4, fx: { fav: -4, buzz: 6 }, r: '被名嘴問倒。' }, ok: { buzz: 8, s: 0.8 } },
  { id: 'policy', t: '📋 發政見記者會', fx: { fav: 3, s: 0.5 }, likes: ['B'] },
  { id: 'press', t: '📰 發新聞稿製造話題', fx: { buzz: 4 }, risk: { p: 0.3, fx: { buzz: -2 }, r: '沒有任何媒體刊登。' } },
  { id: 'rally', crowd: true, t: '🎉 辦大型造勢晚會', fx: { money: -12, s: 1.2, buzz: 6, liver: -5 }, need: 12 },
  { id: 'chief', t: '🏘️ 拜託里長動員', fx: { s: 0.7, favor: 1 }, likes: ['A'] },
  { id: 'templego', t: '🛕 參加宮廟遶境', fx: { s: 0.5, liver: -4, fav: 1 }, likes: ['A', 'C'] },
  { id: 'ads', t: '💰 買電視和網路廣告', fx: { money: -15, s: 1, buzz: 4 }, need: 15, likes: ['C'] },
  { id: 'paper', t: '🌙 熬夜寫政策白皮書', fx: { fav: 4, liver: -8, s: 0.4 }, likes: ['B'] },
  { id: 'attack', t: '⚔️ 攻擊對手的弱點', fx: { r: -0.9, con: -6, buzz: 4 }, risk: { p: 0.3, fx: { fav: -4 }, r: '被說抹黑，反彈。' } },
  { id: 'meme', t: '😂 自曝糗事創造話題', fx: { buzz: 8 }, risk: { p: 0.35, fx: { fav: -3 }, r: '糗過頭了。' }, ok: { fav: 2 } },
  { id: 'fund', t: '🙇 小額募款', fx: { money: 10, fav: 1 } },
  { id: 'rest', t: '😴 讓大家休息一天', fx: { liver: 12, trust: 3 } },
  { id: 'listen', t: '👂 陪{boss}吃宵夜聊天', fx: { trust: 7, liver: -2 } },
  { id: 'invest', t: '🌏 拜訪外商，拉投資', fx: { liver: -4 }, risk: { p: 0.5, fx: {}, r: '對方很客氣，沒下文。' }, ok: { s: 0.8, fav: 3 }, likes: ['C', 'D'] },
  { id: 'youth', t: '🎓 跑大學校園座談', fx: { fav: 2, buzz: 3, s: 0.3 }, likes: ['B'], hates: ['A'] },
  { id: 'party', t: '🐦 向黨部爭取資源', types: ['B'], fx: { money: 10 }, risk: { p: 0.4, fx: { net: -3 }, r: '黨部說：「民調先拉起來再說。」' } },
  { id: 'elder', t: '👴 請家族長輩出面拉票', types: ['A'], fx: { s: 0.9, money: 6 }, risk: { p: 0.4, fx: { fav: -4 }, r: '長輩又說了「我們家就是權貴」。' } },
  { id: 'cityhall', t: '🏛️ 用市長身分視察工地', types: ['D'], fx: { fav: 2, s: 0.5 }, risk: { p: 0.3, fx: { fav: -3 }, r: '被抓到「行政資源輔選」。' } },
  { id: 'tour', crowd: true, t: '🗺️ 跑遍十二區講政見', fx: { s: 0.7, fav: 2, liver: -7 }, likes: ['B'] },
  { id: 'handshake', crowd: true, t: '🤝 辦支持者握手會', fx: { buzz: 6, fav: 2, liver: -5 }, hates: ['C'] },
  { id: 'merch', t: '🛍️ 推出募款小物', fx: { money: 8, buzz: 3 }, risk: { p: 0.3, fx: { fav: -2 }, r: '設計太醜，被做成梗圖。' } },
  { id: 'clean', t: '🕊️ 宣布「正向選戰，不打負面」', fx: { con: 6, fav: 3 }, risk: { p: 0.3, fx: { buzz: -3 }, r: '太溫和，沒有新聞。' } },
  { id: 'company', t:'🏭 請集團員工全體動員', types: ['C'], fx: { s: 0.8 }, risk: { p: 0.4, fx: { fav: -5 }, r: '員工匿名爆料：「被逼去造勢。」' } }
];

// ---------------- 結局 ----------------
// 依序判斷，第一個符合的就是結局
const ENDINGS = [
  { id: 'foreign', emoji: '🕵️', title: '國安單位的早晨',
    text: '選後第二週，國安單位帶走了你的手機。那位「商會會長」早就在監控名單上。不管{boss}有沒有選上，你的名字都上了新聞。',
    when: g => g.f.foreign },
  { id: 'buy', emoji: '🚔', title: '賄選，當選無效',
    text: '里長伯在偵訊室裡十分鐘就全招了。檢方以賄選起訴，{boss}的選舉結果被訴請無效。',
    when: g => g.f.buy },
  { id: 'hospital', emoji: '🏥', title: '在病床上看開票',
    text: '你的肝先投降了。開票夜，你躺在病床上，用手機看完整場開票。{resultLine}',
    when: g => g.f.hospital },
  { id: 'ledger', emoji: '📁', title: '保險箱裡的錄音檔',
    text: '{boss}當選了。你把那段錄音檔鎖進保險箱。往後四年，市府的每一個重大案子，都會有人來問你的意見。',
    when: g => g.win && g.f.dirty2 && g.f.ledger },
  { id: 'raid', emoji: '⚖️', title: '清晨六點的敲門聲',
    text: '{resultLine}但那包錢的事沒有結束。某天清晨六點，調查局敲門了。做過的事，終究會被找到。',
    when: g => g.f.dirty2 },
  { id: 'scapegoat', emoji: '🧾', title: '「都是幕僚處理的」',
    text: '政治獻金的事被爆出來。{boss}在記者會上說：「我完全不知情，都是幕僚處理的。」鏡頭帶到了你。',
    when: g => (g.f.dirty1 || g.f.dirty2) && g.trust < 45 },
  { id: 'A_true', emoji: '🗣️', title: '【真結局】我自己的話',
    text: '當選感言，{boss}把長輩準備的講稿放到一旁：「接下來，我要用自己的方式當市長。」長輩在台下，第一次沒有說話。',
    when: g => g.type === 'A' && g.win && g.f.rebel >= 2 },
  { id: 'B_true', emoji: '🐦', title: '【真結局】蜂鳥全壘打',
    text: '黑馬翻盤！{boss}當選，而且同黨議員全數上壘。蜂鳥黨第一次在 N City 拿下過半。',
    when: g => g.type === 'B' && g.win && !g.f.cut && g.net >= 35 },
  { id: 'C_true', emoji: '🤝', title: '【真結局】你說得對',
    text: '開票結束，{boss}走到你面前，停了很久，說出這輩子第一次說的話：「你說得對。」',
    when: g => g.type === 'C' && g.win && g.f.respect >= 1 && g.trust >= 55 },
  { id: 'D_true', emoji: '📜', title: '【真結局】照稿念的那一次',
    text: '敗選之夜。你最後一次幫{boss}寫感言，{he}第一次一字不差地照稿念完。台下的支持者哭了，你也是。',
    when: g => g.type === 'D' && !g.win && g.f.script >= 2 },
  { id: 'E_true', emoji: '🐾', title: '【真結局】不再空心',
    text: '就職典禮上，{boss}抱著貓上台，說了一段沒有講稿的話。名嘴第一次說：「{he}好像真的有溫度。」',
    when: g => g.type === 'E' && g.win && g.f.warm >= 2 },
  { id: 'F_true', emoji: '🪨', title: '【真結局】守住初心',
    text: '{boss}當選了。上任那天，你遞給{he}一張紙條：「別忘了你為什麼出來選。」四年後，{he}乾乾淨淨地卸任。',
    when: g => g.type === 'F' && g.win && g.con >= 70 },
  { id: 'recount', emoji: '🗳️', title: '驗票！',
    text: '兩邊差距不到 0.5%。雙方都宣布要聲請驗票。你又要三個月不能睡了。',
    when: g => Math.abs(g.margin) < 0.5 },
  { id: 'ghost', emoji: '👻', title: '失聯的幕僚',
    text: '整場選戰，{boss}最常說的一句話是：「接下來呢？」投票日當天，你的位子上只剩一杯冷掉的咖啡。{resultLine}',
    when: g => g.f.idle >= 6 },
  { id: 'poached', emoji: '🕴️', title: '投票前一週被挖角',
    text: '{rival}陣營開了你兩倍薪水。你在投票前一週換了識別證。',
    when: g => g.net >= 70 && g.con <= 30 },
  { id: 'spokes', emoji: '🏆', title: '凍蒜！你入閣當發言人',
    text: '{boss}當選了！上任第一天，{he}把市府發言人的名牌交到你手上。',
    when: g => g.win && g.trust >= 80 },
  { id: 'nothanks', emoji: '😶', title: '感謝名單沒有你',
    text: '{boss}當選了。當選感言感謝了長輩、議員、里長、志工，還有隔壁的便當店。沒有你。',
    when: g => g.win && g.trust < 40 },
  { id: 'A_win', emoji: '🪑', title: '垂簾聽政',
    text: '{boss}當選了。市長室後面多了一張椅子，長輩每天都來坐。',
    when: g => g.type === 'A' && g.win },
  { id: 'B_win', emoji: '🌅', title: '黑馬翻盤',
    text: '沒有人看好的{boss}贏了！只是同黨議員在選戰中途切割過，進了議會，路不好走。',
    when: g => g.type === 'B' && g.win },
  { id: 'C_win', emoji: '🏢', title: 'N City 股份有限公司',
    text: '{boss}當選了。上任第一天就開除一半局處長，市府改成打卡制。',
    when: g => g.type === 'C' && g.win },
  { id: 'D_win', emoji: '🔁', title: '再混四年',
    text: '{boss}連任成功。名嘴的新圖卡標題是：「混四年，再混四年。」',
    when: g => g.type === 'D' && g.win },
  { id: 'E_win', emoji: '🐈', title: '貓比市長紅',
    text: '{boss}當選了。就職典禮上，{he}的貓比{he}還受歡迎，市府粉專改由貓代言。',
    when: g => g.type === 'E' && g.win },
  { id: 'F_win', emoji: '📣', title: '四十分鐘的就職演說',
    text: '{boss}當選了。就職典禮上，{he}把講稿丟了，講了四十分鐘。你在台下默默把稿子收好。',
    when: g => g.type === 'F' && g.win },
  { id: 'pundit', emoji: '🎤', title: '轉行當名嘴',
    text: '選後你轉戰政論節目，罵起前老闆最狠，收視率很好。',
    when: g => !g.win && g.f.tv >= 3 && g.trust < 50 },
  { id: 'B_lose', emoji: '🐣', title: '母雞雖敗，小雞全上',
    text: '{boss}輸了，但同黨議員全數當選。黨部說：「這次不是犧牲打。」',
    when: g => g.type === 'B' && !g.win && !g.f.cut },
  { id: 'clean', emoji: '🕊️', title: '乾淨落選',
    text: '輸了，但你一毛不該拿的錢都沒拿。四年後，另一位候選人用三倍薪水把你挖走。',
    when: g => !g.win && !g.f.took && g.con >= 70 },
  { id: 'together', emoji: '🤝', title: '四年後再一起',
    text: '敗選之夜，{boss}拍拍你的肩膀：「四年後，再一起。」',
    when: g => !g.win && g.trust >= 60 },
  { id: 'memoir', emoji: '📖', title: '回憶錄上架',
    text: '選後你寫了一本《戰情室的一百二十天》，在書店上架了。{boss}沒有來簽書會。',
    when: g => !g.win && g.con >= 55 },
  { id: 'win', emoji: '🎊', title: '凍蒜！',
    text: '{boss}當選了！你在戰情室的沙發上睡了三天三夜。',
    when: g => g.win },
  { id: 'lose', emoji: '🌃', title: '燈一盞一盞關掉',
    text: '{boss}落選了。戰情室的燈一盞一盞關掉，白板上還寫著明天的行程。',
    when: g => true }
];
