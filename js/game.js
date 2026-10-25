// 畫面與流程
const app = document.getElementById('app');
const SAVE_KEY = 'mymayor.endings';
const EVENTS_KEY = 'mymayor.seenEvents';
let G = null;

const $ = sel => app.querySelector(sel);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SAVE_KEY) || '[]')); } catch (e) { return new Set(); }
}
function loadSeenEvents() {
  try { return new Set(JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')); } catch (e) { return new Set(); }
}
function saveSeenEvents() {
  let all = new Set([...loadSeenEvents(), ...G.used]);
  if (all.size > EVENTS.length * 0.7) all = new Set(G.used); // 大部分都看過了，就從頭輪
  try { localStorage.setItem(EVENTS_KEY, JSON.stringify([...all])); } catch (e) { /* 沒差 */ }
}

function saveSeen(id) {
  const s = loadSeen(); s.add(id);
  try { localStorage.setItem(SAVE_KEY, JSON.stringify([...s])); } catch (e) { /* 無痕模式就算了 */ }
  return s;
}

function lookOf(type, gender, mood) {
  return { ...TYPES[type].look[gender], mood };
}
function bossFace(mood) { return avatar(lookOf(G.type, G.gender, mood)); }

function show(html, cls = '') {
  app.innerHTML = `<div class="screen ${cls}">${html}</div>`;
  return app.firstElementChild;
}

function toast(text, ms = 2200) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = text;
  app.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

// ---------------- 標題 ----------------
function titleScreen() {
  const seen = loadSeen();
  const faces = Object.keys(TYPES).map(t => avatar(TYPES[t].look[t === 'B' || t === 'E' ? 'f' : 'm'])).join('');
  show(`
    <div class="faces">${faces}</div>
    <div class="tag">市長不是神，是幕僚造出來的神。</div>
    <h1>我推的市長</h1>
    <p class="muted">爆肝的幕僚團隊，想辦法把你的市長送上寶座。<br>一局約 10 分鐘。</p>
    <button class="btn" id="go">開始上班</button>
    <button class="btn ghost" id="manual">📖 總幹事手冊</button>
    <button class="btn ghost" id="gal">結局圖鑑（${seen.size} / ${ENDINGS.length}）</button>
    <p class="muted" style="margin-top:22px;font-size:12px">本遊戲純屬虛構，人物、政黨、城市皆非真實。</p>
  `, 'title');
  $('#go').onclick = drawScreen;
  $('#gal').onclick = () => gallery(titleScreen);
  $('#manual').onclick = openManual;
}

// ---------------- 抽老闆 ----------------
function drawScreen() {
  const order = Object.keys(TYPES);
  show(`
    <p class="muted center">你接到一通電話：「明天來戰情室報到，你是總幹事。」</p>
    <h2 class="center" style="margin:6px 0">你的老闆是……</h2>
    <p class="muted center">翻牌決定，你沒得選。</p>
    <div class="grid">${order.map(t => `
      <div class="flip" data-t="${t}"><div class="inner">
        <div class="face front">?<small>候選人</small></div>
        <div class="face back">${avatar(TYPES[t].look.m)}<b>${TYPES[t].label}</b><span class="muted" style="font-size:12px">${TYPES[t].party}</span></div>
      </div></div>`).join('')}
    </div>
    <button class="btn" id="flip">翻牌</button>
  `);
  $('#flip').onclick = async () => {
    $('#flip').disabled = true;
    const type = order[Math.floor(Math.random() * order.length)];
    const cards = [...app.querySelectorAll('.flip')];
    for (const c of cards) { c.classList.add('open'); await sleep(180); }
    await sleep(500);
    cards.forEach(c => c.classList.add(c.dataset.t === type ? 'pick' : 'dim'));
    await sleep(1200);
    setupScreen(type);
  };
}

// ---------------- 選性別、取名 ----------------
function setupScreen(type) {
  const T = TYPES[type];
  let gender = 'm';
  let typed = false;
  show(`
    <div class="center">
      <p class="muted">翻牌結果</p>
      <span class="badge">${T.label}・${T.party}</span>
    </div>
    <div class="traits">
      🧠 性格：${T.trait}<br>
      👍 優勢：${T.pro}<br>
      👎 弱點：${T.con}
    </div>
    <p class="center" style="margin:6px 0 10px"><b>選擇外觀</b></p>
    <div class="pick2">
      <button data-g="m" class="on">${avatar(T.look.m)}男</button>
      <button data-g="f">${avatar(T.look.f)}女</button>
    </div>
    <p class="field">幫你的老闆取個名字</p>
    <input class="name" id="nm" maxlength="12" value="${T.names.m}">
    <button class="btn" id="go">進入戰情室 →</button>
  `);
  const nm = $('#nm');
  nm.oninput = () => { typed = true; };
  app.querySelectorAll('.pick2 button').forEach(b => b.onclick = () => {
    gender = b.dataset.g;
    app.querySelectorAll('.pick2 button').forEach(x => x.classList.toggle('on', x === b));
    if (!typed) nm.value = T.names[gender];
  });
  $('#go').onclick = () => {
    G = newGame(type, gender, nm.value.trim().slice(0, 12) || T.names[gender]);
    G.seenBefore = loadSeenEvents();
    profileScreen();
  };
}

// 候選人檔案：先認識你抽到的老闆
function profileScreen() {
  const T = TYPES[G.type];
  const gap = Math.round(G.r - G.s);
  const pos = gap > 0 ? `起跑時，民調大約落後${esc(G.rivalName)} ${gap} 個百分點。` : `起跑時，民調大約領先${esc(G.rivalName)} ${-gap} 個百分點。`;
  show(`
    <p class="muted center">候選人檔案</p>
    <div class="profile-face">${bossFace('big')}</div>
    <h2 class="center" style="margin:4px 0">${esc(G.name)}</h2>
    <div class="center"><span class="badge">${T.label}・${T.party}</span></div>
    <div class="traits">${esc(fill(G, T.bio))}</div>
    <div class="traits">
      <b>👍 強項</b><br>${T.pros.map(x => '・' + esc(fill(G, x))).join('<br>')}<br><br>
      <b>👎 弱點</b><br>${T.cons.map(x => '・' + esc(fill(G, x))).join('<br>')}<br><br>
      <b>🙄 不聽話的時候</b><br>・${esc(T.trait)}
    </div>
    <div class="traits">
      <b>🎯 主要對手</b>
      <div class="who" style="margin:8px 0">${avatar({ ...TYPES[G.rivalType].look[G.rivalGender], mood: 'smile' })}<div><b>${esc(G.rivalName)}</b><br><small>${TYPES[G.rivalType].label}・${TYPES[G.rivalType].party}</small></div></div>
      ${esc(TYPES[G.rivalType].short)}<br>
      ・強項：${esc(TYPES[G.rivalType].pros[0].replace(/\{he\}/g, G.rivalGender === 'f' ? '她' : '他'))}<br>
      ・弱點：${esc(TYPES[G.rivalType].cons[0].replace(/\{he\}/g, G.rivalGender === 'f' ? '她' : '他'))}<br><br>
      ${pos}<br>
      <small class="muted">另外還有一位小黨候選人 ${esc(G.thirdName)}，票不多，但可能搶走你的票。</small>
    </div>
    <div class="traits"><b>💡 總幹事筆記</b><br>${esc(fill(G, T.tip))}</div>
    <button class="btn" id="go">我了解了，進戰情室 →</button>
  `);
  $('#go').onclick = introScreen;
}

function introScreen() {
  roomScreen();
  overlay(`
    <div class="head" style="background:#3a5ba0"><span>📋 報到須知</span></div>
    <div class="body">
      <div class="eyebrow">你要輔選的市長候選人</div>
      <div class="who">${bossFace('big')}<div><b>${esc(G.name)}</b><br><small>${TYPES[G.type].label}・${TYPES[G.type].party}</small></div></div>
      <p>而你是<b>競選總幹事</b>，整個戰情室都會來問你「怎麼辦？」距離投票還有 <b>4 個月</b>：</p>
      <p>🔥 <b>有火就滅火</b>：緊急卡牌跳出來，<b>20 秒內</b>決定。<br>
      ✨ <b>沒火就成就老闆</b>：挑一個企劃，把老闆推出去。<br>
      🤝 <b>老闆不一定聽你的</b>：信任越高，越聽話。<br>
      📊 每月一次內參民調，最後 10 天民調封關。<br>
      🫀 顧好你的肝。</p>
      <button class="btn" id="ok">開工</button>
      <button class="btn ghost" id="man2">📖 先看總幹事手冊</button>
    </div>`, 'k-main');
  $('#ok').onclick = () => runGame();
  $('#man2').onclick = openManual;
}

// ---------------- 戰情室 ----------------
function roomScreen() {
  show(`
    <div class="hud">
      <div class="row"><span class="date" id="date"></span><span><button class="mbtn" id="mbtn" aria-label="總幹事手冊">📖</button> <span class="clock" id="clock"></span></span></div>
      <div class="box">
        <div class="boxtitle">👤 候選人 <b id="bx-name"></b></div>
        <div class="stats">
          <div class="stat" id="st-buzz"><i>聲量</i>📣 <span></span><div class="bar"><div></div></div></div>
          <div class="stat" id="st-fav"><i>民調好感度</i>😊 <span></span><div class="bar"><div></div></div></div>
          <div class="stat" id="st-money"><i>競選資金</i>💰 <span></span><div class="bar"><div></div></div></div>
          <div class="stat" id="st-trust"><i>對你的信任</i>🤝 <span></span><div class="bar"><div></div></div></div>
        </div>
      </div>
      <div class="box">
        <div class="boxtitle">🧑‍💼 總幹事（你）</div>
        <div class="stats three">
          <div class="stat" id="st-liver"><i>肝的健康</i>🫀 <span></span><div class="bar"><div></div></div></div>
          <div class="stat" id="st-team"><i>團隊士氣</i>💪 <span></span><div class="bar"><div></div></div></div>
          <div class="stat" id="st-conf"><i>你的信心</i>🔥 <span></span><div class="bar"><div></div></div></div>
        </div>
      </div>
      <div class="box rivalbox"><div class="rivalrow" id="rivalrow"></div></div>
    </div>
    <div class="stage">
      <div class="bubble" id="bubble">接下來呢？</div>
      <div class="boss" id="boss"></div>
      <div class="who" id="bossname"></div>
    </div>
  `, 'room');
  $('#mbtn').onclick = openManual;
  $('#boss').innerHTML = bossFace('smile');
  $('#bossname').textContent = `${G.name}・${TYPES[G.type].party}`;
  updateHud();
}

const lastHud = {};
function updateHud() {
  if (!$('#date')) return;
  const w = Math.min(G.week, WEEKS);
  const L = weekLabel(w);
  $('#date').innerHTML = `<b>${L.month}月 第${L.nth}週</b>・距投票 <b>${L.daysLeft}</b> 天`;
  const ck = $('#clock');
  ck.textContent = clockText(G);
  ck.classList.toggle('late', G.clock >= 24);
  $('#bx-name').textContent = G.name;
  for (const k of ['buzz', 'fav', 'money', 'trust', 'liver', 'team', 'conf']) {
    const el = $('#st-' + k);
    const v = Math.round(G[k]);
    el.querySelector('span').textContent = v;
    el.querySelector('.bar div').style.width = v + '%';
    el.classList.toggle('low', v < 25);
    if (lastHud[k] !== undefined && lastHud[k] !== v) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    lastHud[k] = v;
  }
  // 對手聲勢：看不到確切數字，只看得到大概強弱和趨勢
  const rr = $('#rivalrow');
  if (rr) {
    const lvl = G.r >= 45 ? '很強' : G.r >= 38 ? '強' : G.r >= 32 ? '普通' : '偏弱';
    const tr = G.rPrev === undefined ? '' : G.r > G.rPrev + 0.05 ? '↑' : G.r < G.rPrev - 0.05 ? '↓' : '→';
    rr.innerHTML = `<span>🎯 主要對手 ${G.rivalType === "D" ? "現任市長 " : ""}${esc(G.rivalName)} 聲勢</span><div class="bar"><div style="width:${Math.min(100, G.r * 1.6)}%"></div></div><b>${lvl} ${tr}</b>`;
  }
  const mood = G.liver < 20 || G.trust < 25 ? 'sad' : G.s > G.r + 3 ? 'big' : 'smile';
  const bossEl = $('#boss');
  if (bossEl) bossEl.innerHTML = bossFace(mood);
}

function bossSays(text, shake) {
  const b = $('#bubble');
  if (!b) return;
  b.textContent = text;
  if (shake) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
}

function overlay(inner, kind) {
  const old = app.querySelector('.overlay');
  if (old) old.remove();
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="card ${kind || ''}">${inner}</div>`;
  // 卡牌不蓋住上方的數值列，讓玩家邊看數值邊做決定
  const hud = app.querySelector('.hud');
  if (hud) o.style.top = hud.offsetHeight + 'px';
  app.appendChild(o);
  return o;
}
function closeOverlay() { const o = app.querySelector('.overlay'); if (o) o.remove(); }

const KIND_LABEL = {
  fire: '⚠ 突發狀況', main: '📌 選戰大事', money: '💰 有人來訪', tv: '📺 政論節目',
  daily: '☕ 戰情室日常', crisis: '🚨 危機', topic: '🎤 座談主題', build: '✨ 沒有火，來成就老闆'
};

// 倒數計時：切到背景時暫停
function countdown(seconds, onTick, onEnd) {
  let left = seconds * 1000, last = performance.now(), stop = false;
  function loop(now) {
    if (stop) return;
    if (!document.hidden && !app.querySelector('.manual')) left -= now - last; // 看手冊時暫停
    last = now;
    onTick(Math.max(0, left) / (seconds * 1000), Math.ceil(Math.max(0, left) / 1000));
    if (left <= 0) { stop = true; onEnd(); return; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  return () => { stop = true; };
}

function chipsHtml(delta) {
  const vis = { buzz: '📣聲量', fav: '😊民調好感度', money: '💰資金', trust: '🤝信任', liver: '🫀肝', team: '💪士氣', conf: '🔥信心', con: '😇良心' };
  const out = [];
  const arrow = (v, good) => `<span class="chip ${good ? 'up' : 'down'}">`;
  if (delta.s) out.push(arrow(0, delta.s > 0) + `📈 民心 ${delta.s > 0 ? '↑' : '↓'}${Math.abs(delta.s) >= 1 ? (delta.s > 0 ? '↑' : '↓') : ''}</span>`);
  if (delta.r) out.push(arrow(0, delta.r < 0) + `🎯 對手 ${delta.r > 0 ? '↑' : '↓'}</span>`);

  for (const [k, lab] of Object.entries(vis)) {
    const v = Math.round(delta[k] || 0);
    if (v) out.push(arrow(0, v > 0) + `${lab} ${v > 0 ? '+' : ''}${v}</span>`);
  }
  return out.length ? `<div class="chips">${out.join('')}</div>` : '';
}

// 結果卡：先看選民和市場的反應＋數值變化，老闆的話放在最下面小小的
function resultHtml(res) {
  const main = res.lines.filter(l => l.kind !== 'say' && l.kind !== 'boss');
  const boss = res.lines.filter(l => l.kind === 'say' || l.kind === 'boss');
  return main.map(l => `<div class="res ${l.kind}">${esc(l.text)}</div>`).join('')
    + chipsHtml(res.delta)
    + boss.map(l => `<div class="res say"><div class="who" style="margin:0">${bossFace(l.kind === 'boss' ? 'sad' : l.mood)}<span><b>${esc(G.name)}</b>：${l.kind === 'boss' ? '「' + esc(l.text) + '」' : esc(l.text)}</span></div></div>`).join('');
}

// 顯示一張事件卡，等玩家選或時間到
function eventCard(ev, queueLeft, isBuild) {
  return new Promise(resolve => {
    const opts = isBuild ? buildChoices(G) : ev.opts;
    const kind = isBuild ? 'build' : ev.kind;
    let secs = Math.min(isBuild ? 20 : (ev.timer || 20), G.week >= BLACKOUT_WEEK ? 10 : 99);
    if (G.conf < 30) secs = Math.max(6, secs - 5); // 信心太低，你慌了
    const npc = isBuild ? null : NPC[ev.who];
    const whoHtml = isBuild
      ? `<div class="who">${bossFace('smile')}<div><b>${esc(G.name)}</b><br><small>「今天要做什麼？」</small></div></div>`
      : npc ? `<div class="who">${avatar(npc.look)}<div><b>${npc.name}</b><br><small>${npc.role}</small></div></div>` : '';
    const title = isBuild ? '沒有話題，就創造話題' : fill(G, ev.title);
    const text = isBuild ? '今天沒有火要滅。挑一個企劃，把老闆推出去。' : fill(G, ev.text);
    const o = overlay(`
      <div class="head"><span>${KIND_LABEL[kind]}</span><span>${queueLeft > 0 ? `<span class="q">還有 ${queueLeft} 件等你</span> ` : ''}⏱ <b id="sec">${secs}</b></span></div>
      <div class="timer"><div id="tbar"></div></div>
      <div class="body">
        ${whoHtml}
        <h2>${esc(title)}</h2>
        <p>${esc(text)}</p>
        <div id="opts">${opts.map((op, i) => `<button class="opt" data-i="${i}" ${canAfford(G, op) ? '' : 'disabled'}>${esc(fill(G, op.t))}${op.crowd ? `<small>人潮型活動：聲量和民調不夠，可能沒人來</small>` : ''}${op.need && !canAfford(G, op) ? `<small>資金不足（需要 ${op.need}）</small>` : ''}</button>`).join('')}</div>
      </div>`, 'k-' + kind);
    let done = false;
    const finish = res => {
      if (done) return; done = true; stop();
      updateHud();
      if (res.idle) bossSays(res.lines[0].text, true);
      else bossSays(res.failed ? '……這樣真的好嗎？' : '好，接下來呢？');
      o.querySelector('.timer div').style.width = '0';
      o.querySelector('#opts').innerHTML = resultHtml(res) + `<button class="btn" id="next">繼續</button>`;
      o.querySelector('#next').onclick = () => { closeOverlay(); resolve(res); };
    };
    const stop = countdown(secs, (frac, s) => {
      const bar = o.querySelector('#tbar'); if (bar) bar.style.width = frac * 100 + '%';
      const sec = o.querySelector('#sec'); if (sec) sec.textContent = s;
    }, () => finish(timeout(G, ev, isBuild)));
    o.querySelectorAll('.opt').forEach(b => b.onclick = () => finish(choose(G, ev, opts[+b.dataset.i], isBuild)));
  });
}

// 沒火的時候：戰情室行程板，自己挑要做什麼
function stageDefault() {
  const st = $('.stage');
  if (!st) return;
  st.innerHTML = `<div class="bubble" id="bubble">接下來呢？</div><div class="boss" id="boss"></div><div class="who" id="bossname"></div>`;
  $('#bossname').textContent = `${G.name}・${TYPES[G.type].party}`;
  updateHud();
}

function actTags(op) {
  const t = [];
  const fx = op.fx || {};
  if (fx.money < 0) t.push(`💰${fx.money}`);
  if (fx.money > 0) t.push(`💰+${fx.money}`);
  if (fx.liver <= -5) t.push('🫀 很累');
  if (fx.liver > 0) t.push('🫀 回血');
  if (op.crowd) t.push('👥 看人氣');
  if (fx.con < 0) t.push('😈 良心');
  if (op.risk) t.push('🎲 有風險');
  return t.join('　');
}

function showResult(title, res) {
  return new Promise(resolve => {
    const o = overlay(`
      <div class="head"><span>✨ ${esc(title)}</span></div>
      <div class="body">${resultHtml(res)}<button class="btn" id="next">繼續</button></div>`, 'k-build');
    o.querySelector('#next').onclick = () => { closeOverlay(); resolve(); };
  });
}

function boardStep(left) {
  if (G.liver <= 8) return forcedRest();
  return new Promise(resolve => {
    const opts = buildChoices(G, 6);
    const st = $('.stage');
    st.innerHTML = `
      <div class="board">
        <div class="board-head">
          <div class="mini">${bossFace('smile')}</div>
          <div style="flex:1"><b>今天沒有火，要做什麼？</b><br><small>${esc(G.name)}：「接下來呢？」</small></div>
          <div class="bsec">⏱ <span id="bsec">30</span></div>
        </div>
        <div class="timer"><div id="bbar"></div></div>
        <div class="board-grid">${opts.map((op, i) => `
          <button class="act" data-i="${i}" ${canAfford(G, op) ? '' : 'disabled'}>
            <span>${esc(fill(G, op.t))}</span>
            <small>${canAfford(G, op) ? actTags(op) : `資金不足（需要 ${op.need}）`}</small>
          </button>`).join('')}
        </div>
        ${left > 0 ? `<p class="muted center" style="color:#aaa;margin:8px 0 0">這週還有 ${left} 件事</p>` : ''}
      </div>`;
    let done = false;
    const finish = async (title, res) => {
      if (done) return; done = true; stop();
      updateHud();
      await showResult(title, res);
      stageDefault();
      if (res.idle) bossSays(res.lines[0].text, true);
      resolve(res);
    };
    const stop = countdown(G.week >= BLACKOUT_WEEK ? 15 : 30, (frac, sec) => {
      const b = $('#bbar'); if (b) b.style.width = frac * 100 + '%';
      const e = $('#bsec'); if (e) e.textContent = sec;
    }, () => finish('你發呆了一整天', timeout(G, null, true)));
    st.querySelectorAll('.act').forEach(b => b.onclick = async () => {
      const op = opts[+b.dataset.i];
      const res = choose(G, null, op, true);
      if (op.followup === 'topic' && !res.lines.some(l => l.kind === 'bad' || l.kind === 'defy')) {
        // 座談、講政見：再選要講的主題
        if (done) return; done = true; stop();
        updateHud();
        await showResult(fill(G, op.t), res);
        const pool = TOPICS.slice();
        const pick4 = [];
        while (pick4.length < 4) pick4.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        await eventCard({ id: 'topic', kind: 'topic', who: 'staff', timer: 15,
          title: '今天要講哪個主題？', text: '台下坐滿了人，主持人看向{boss}。你在旁邊比手勢提示……', opts: pick4 }, left, false);
        stageDefault();
        resolve(res);
        return;
      }
      finish(fill(G, op.t), res);
    });
  });
}

// 肝快爆了：不管要做什麼，今天都只能休息
async function forcedRest() {
  G.f.rests = (G.f.rests || 0) + 1;
  const rest = BUILD.find(b => b.id === 'rest');
  const res = choose(G, null, { ...rest, fx: { liver: 18 } }, true);
  res.lines = [{ kind: 'bad', text: '你在戰情室的沙發上睡著了，叫都叫不醒。副總幹事說：「總幹事今天強制休假。」' }];
  updateHud();
  bossSays('總幹事呢？接下來呢？', true);
  await showResult('你爆肝了，被強制休息一天', res);
  stageDefault();
  return res;
}

// 民調時，副總幹事給的建議：告訴玩家現在卡在哪裡
function tipsHtml() {
  const t = [];
  if (G.fav < 50) t.push('好感度偏低：現在越多人討論你，反而越扣分。先做讓人有好感的事。');
  else if (G.buzz < 45) t.push('好感度不錯，但沒什麼人在討論你：多製造話題、多曝光，民調才會動。');
  if (G.money < 20) t.push('競選資金快見底了：可以辦募款、推募款小物。');
  if (G.trust < 40) t.push('老闆不太信任你：陪他吃宵夜聊天，或多選他擅長的事。');
  if (G.liver < 30) t.push('你的肝快撐不住了，排一天休息吧。');
  if (G.team < 40) t.push('團隊士氣低落，事情容易出包。請大家喝個飲料吧。');
  if (G.conf < 30) t.push('總幹事，你看起來很慌。信心太低，做決定的時間會變短，老闆也不太想聽你的。');
  if (!t.length) t.push('數字都不錯，保持下去，好感度和聲量都高，民調就會一直往上。');
  return `<div class="res note" style="font-size:14px;margin-top:10px">🗒️ 副總幹事：${t.slice(0, 2).map(esc).join('<br>')}</div>`;
}

function pollCard() {
  return new Promise(resolve => {
    const p = doPoll(G);
    const L = weekLabel(G.week);
    const prev = p.prev;
    const diff = prev ? p.s - prev.s : null;
    const row = (lab, v, color) => `<div class="pollrow"><div class="lab"><span>${lab}</span><b>${v.toFixed(1)}%</b></div><div class="track"><div style="background:${color}" data-w="${v}"></div></div></div>`;
    const gap = p.s - p.r;
    const comment = gap > 5 ? '領先中，但別輕敵。' : gap > -3 ? '五五波，每一票都重要。' : gap > -8 ? '小幅落後，還追得上。' : '大幅落後……戰情室一片安靜。';
    const o = overlay(`
      <div class="head"><span>📊 ${L.month} 月內參民調</span><span class="q">誤差 ±3%</span></div>
      <div class="body">
        ${row(`${esc(G.name)}（${TYPES[G.type].party}）`, p.s, '#e0a526')}
        ${row(`${esc(G.rivalName)}（${TYPES[G.rivalType].party}）`, p.r, '#7a6ba8')}
        ${row('其他候選人', p.others, '#aaa')}
        ${row('還沒決定', p.und, '#ddd')}
        ${p.top && p.top.length ? `<p style="margin:12px 0 4px"><b>這個月影響最大的事：</b></p>${p.top.map(t => `<div class="res ${t.v > 0 ? 'good' : 'bad'}" style="font-size:14px;margin:4px 0">${t.v > 0 ? '📈' : '📉'} ${esc(t.title)}</div>`).join('')}` : ''}
        ${tipsHtml()}
        <p style="margin-top:12px">${comment}${diff !== null ? `<br>比上次 ${diff >= 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)}%` : ''}</p>
        <button class="btn" id="ok">知道了</button>
      </div>`, 'k-poll');
    requestAnimationFrame(() => o.querySelectorAll('.track div').forEach(d => d.style.width = d.dataset.w + '%'));
    bossSays(gap >= 0 ? '我就說吧！' : '接下來呢？', gap < 0);
    o.querySelector('#ok').onclick = () => { closeOverlay(); resolve(); };
  });
}

function weekCard(info) {
  const notes = info.notes || [];
  const news = info.news || [];
  return new Promise(resolve => {
    const L = weekLabel(G.week);
    const blackout = G.week >= BLACKOUT_WEEK;
    const o = overlay(`
      <div class="body weekcard">
        <div class="muted">N City 戰情室</div>
        <div class="big">${L.month}月 第${L.nth}週</div>
        <div>距離投票還有 <b>${L.daysLeft}</b> 天</div>
        ${news.length ? `<p style="margin:12px 0 4px;text-align:left"><b>📰 上週對手動態</b></p>${news.map(n => `<div class="res ${n.up === null ? 'note' : n.up ? 'bad' : 'good'}" style="text-align:left;font-size:14px">${esc(n.text)}</div>`).join('')}` : ''}
        ${notes.map(n => `<div class="res note">${esc(n)}</div>`).join('')}
        ${blackout ? '<div class="res bad">🔥 最後衝刺！民調封關，看不到任何數字，只能憑直覺。每件事只剩 10 秒可以決定。</div>' : ''}
        <button class="btn" id="ok">開工</button>
      </div>`, '');
    updateHud();
    o.querySelector('#ok').onclick = () => { closeOverlay(); resolve(); };
  });
}

async function runGame() {
  closeOverlay();
  let notes = {};
  while (G.week <= WEEKS) {
    await weekCard(notes);
    const steps = planWeek(G);
    let left = steps.filter(s => s.step !== 'poll').length;
    for (const st of steps) {
      if (st.step === 'poll') { await pollCard(); continue; }
      left--;
      if (st.step === 'free') await boardStep(left);
      else await eventCard(st.ev, left, false);
    }
    notes = endWeek(G);
  }
  electionNight();
}

// ---------------- 開票 ----------------
async function electionNight() {
  const res = finish(G);
  const seen = saveSeen(res.ending.id);
  saveSeenEvents();
  show(`
    <p class="muted" style="color:#ccc">11 月 28 日 晚上 8 點</p>
    <h2>開票夜</h2>
    <div id="nightface" style="margin:10px auto;width:120px;height:120px">${bossFace('flat')}</div>
    <div class="votes">
      <div class="pollrow"><div class="lab"><span>${esc(G.name)}</span><b id="v1">0.0%</b></div><div class="track"><div id="b1" style="background:#e0a526"></div></div></div>
      <div class="pollrow"><div class="lab"><span>${esc(G.rivalName)}</span><b id="v2">0.0%</b></div><div class="track"><div id="b2" style="background:#7a6ba8"></div></div></div>
      <div class="pollrow"><div class="lab"><span>其他</span><b id="v3">0.0%</b></div><div class="track"><div id="b3" style="background:#aaa"></div></div></div>
    </div>
    <div class="big-result" id="verdict">開票中……</div>
    <button class="btn" id="next" style="visibility:hidden">看結局</button>
  `, 'end');
  const target = [res.share.s, res.share.r, res.share.o];
  const t0 = performance.now(), dur = 4500;
  await new Promise(done => {
    function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      // 前半段讓數字互咬一下
      const wobble = k < 0.7 ? Math.sin(k * 20) * 2 * (1 - k) : 0;
      const vals = [target[0] * e + wobble, target[1] * e - wobble, target[2] * e];
      vals.forEach((v, i) => {
        $('#v' + (i + 1)).textContent = Math.max(0, v).toFixed(1) + '%';
        $('#b' + (i + 1)).style.width = Math.max(0, v) + '%';
      });
      if (k < 1) requestAnimationFrame(step); else done();
    }
    requestAnimationFrame(step);
  });
  $('#verdict').textContent = res.win ? `🎉 ${G.name} 凍蒜！` : `😢 ${G.name} 落選`;
  $('#nightface').innerHTML = bossFace(res.win ? 'big' : 'sad');
  const btn = $('#next');
  btn.style.visibility = 'visible';
  btn.textContent = '選戰檢討會 →';
  btn.onclick = () => reviewScreen(res, seen);
}

function statsOf() {
  return [
    ['🫀', '爆肝被強制休息', (G.f.rests || 0) + ' 次'],
    ['😶', '擺爛（時間到沒選）', (G.f.idle || 0) + ' 次'],
    ['🙄', '老闆不聽你的', (G.f.defied || 0) + ' 次'],
    ['😇', '最後的良心', Math.round(G.con)]
  ];
}

function reviewScreen(res, seen) {
  const R = res.review;
  const row = (h, good) => `<div class="res ${good ? 'good' : 'bad'}" style="text-align:left;font-size:14px">${good ? '📈' : '📉'} ${esc(h.title)}<span class="muted" style="font-size:12px">（${weekLabel(h.week).month}月）</span></div>`;
  show(`
    <h2>選戰檢討會</h2>
    <p class="muted" style="color:#ccc">${res.win ? '贏了，但也要知道是怎麼贏的。' : '輸了，來看看問題出在哪。'}</p>
    <div class="story">
      <b>👍 幫最多的決定</b>
      ${R.best.length ? R.best.map(h => row(h, true)).join('') : '<div class="muted">沒有特別突出的。</div>'}
      <br><b>👎 傷最重的決定</b>
      ${R.worst.length ? R.worst.map(h => row(h, false)).join('') : '<div class="muted">沒有明顯的失誤。</div>'}
      <br><b>🗒️ 總評</b>
      ${R.notes.map(n => `<div style="margin:4px 0">・${esc(n)}</div>`).join('')}
    </div>
    <div class="story" style="margin-top:10px">
      <b>📋 這局的數據</b>
      ${statsOf().map(([e, k, v]) => `<div class="statline"><span>${e} ${k}</span><b>${v}</b></div>`).join('')}
    </div>
    <button class="btn" id="go">看結局 →</button>
  `, 'end');
  $('#go').onclick = () => endingScreen(res, seen);
}

function endingScreen(res, seen) {
  const e = res.ending;
  show(`
    <div class="emoji">${e.emoji}</div>
    <p class="muted" style="color:#ccc">${res.win ? '當選' : '落選'}・得票 ${res.share.s.toFixed(1)}% vs ${res.share.r.toFixed(1)}%</p>
    <h2>${esc(e.title)}</h2>
    <div class="story">${esc(res.text)}</div>
    <p class="muted" style="color:#ccc">已解鎖結局 ${seen.size} / ${ENDINGS.length}</p>
    <button class="btn" id="share">📤 分享結局截圖</button>
    <button class="btn ghost" id="gal">📚 結局圖鑑</button>
    <button class="btn ghost" id="again">🔁 再當一次幕僚</button>
  `, 'end');
  $('#share').onclick = () => shareEnding(res);
  $('#gal').onclick = () => gallery(() => endingScreen(res, loadSeen()));
  $('#again').onclick = drawScreen;
}

function gallery(back) {
  const seen = loadSeen();
  show(`
    <h2 class="center">結局圖鑑</h2>
    <p class="muted center">已解鎖 ${seen.size} / ${ENDINGS.length}</p>
    <div class="gallery">${ENDINGS.map(e => seen.has(e.id)
      ? `<div><span class="e">${e.emoji}</span>${esc(e.title)}</div>`
      : `<div class="lock"><span class="e">🔒</span>？？？<small style="display:block;font-size:12px;margin-top:4px">${esc(e.hint || '')}</small></div>`).join('')}</div>
    <button class="btn" id="back">返回</button>
  `);
  $('#back').onclick = back;
}

// ---------------- 分享截圖 ----------------
function svgToImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" '));
  });
}

function wrapText(ctx, text, maxW) {
  const lines = []; let cur = '';
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; } else cur += ch;
  }
  if (cur) lines.push(cur);
  return lines;
}

async function shareEnding(res) {
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await document.fonts.ready; } catch (e) { /* 沒差 */ }
  const font = (s) => `${s}px ColorEmoji, Huninn, "PingFang TC", "Noto Sans TC", sans-serif`;
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2b2f36'); g.addColorStop(1, '#3d3150');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.textAlign = 'center'; x.fillStyle = '#e0a526';
  x.font = font(40); x.fillText('市長不是神，是幕僚造出來的神。', W / 2, 100);
  x.fillStyle = '#fff'; x.font = font(84); x.fillText('我推的市長', W / 2, 200);
  try {
    const img = await svgToImage(bossFace(res.win ? 'big' : 'sad'));
    x.drawImage(img, W / 2 - 130, 240, 260, 260);
  } catch (e) { /* 頭像畫不出來就略過 */ }
  x.font = font(46); x.fillText(`${G.name}・${TYPES[G.type].label}`, W / 2, 560);
  x.font = font(64); x.fillStyle = res.win ? '#ffd166' : '#ff9a9a';
  x.fillText(res.win ? '🎉 凍蒜！' : '😢 落選', W / 2, 650);
  x.font = font(38); x.fillStyle = '#ccc';
  x.fillText(`得票 ${res.share.s.toFixed(1)}% vs ${res.share.r.toFixed(1)}%`, W / 2, 710);
  x.fillStyle = '#fff'; x.font = font(56);
  x.fillText(`${res.ending.emoji} ${res.ending.title}`, W / 2, 810);
  x.font = font(38); x.fillStyle = '#eee';
  const lines = wrapText(x, res.text, W - 200).slice(0, 4);
  lines.forEach((l, i) => x.fillText(l, W / 2, 870 + i * 52));
  x.font = font(32); x.fillStyle = '#ffd166';
  const st = statsOf();
  st.forEach(([e, k, v], i) => x.fillText(`${e} ${k} ${v}`, W / 2, 1090 + i * 42));
  x.fillStyle = '#e0a526'; x.font = font(36);
  x.fillText('你也來當幕僚，看你能不能把市長送上寶座 →', W / 2, H - 45);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  const file = new File([blob], 'my-mayor.png', { type: 'image/png' });
  const text = `我在《我推的市長》幫 ${G.name} 打選戰，結局是「${res.ending.title}」！你也來試試：${location.href}`;
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  // 不支援分享時：直接把圖片秀出來，讓玩家長按儲存
  const url = c.toDataURL('image/png');
  const o = overlay(`
    <div class="body center">
      <h2>結局截圖</h2>
      <img src="${url}" alt="結局截圖" style="width:100%;border-radius:12px">
      <p class="muted">長按圖片儲存，再傳到 LINE 給朋友。</p>
      <button class="btn" id="cp">複製分享文字</button>
      <button class="btn ghost" id="cl">關閉</button>
    </div>`, '');
  o.querySelector('#cp').onclick = async () => {
    try { await navigator.clipboard.writeText(text); toast('已複製分享文字'); } catch (e) { toast('複製失敗，請手動輸入網址'); }
  };
  o.querySelector('#cl').onclick = closeOverlay;
}

// ---------------- 總幹事手冊 ----------------
// 蓋在畫面最上層；遊戲中打開時，倒數計時會暫停
function openManual() {
  const m = document.createElement('div');
  m.className = 'manual';
  m.innerHTML = `<div class="mcard">
    <div class="mhead"><b>📖 總幹事手冊</b><button id="mclose" aria-label="關閉">✕</button></div>
    <div class="mbody">
      <h3>🎯 選上的關鍵</h3>
      <p><b>民調好感度高的時候，聲量越大，民調漲得越快。</b></p>
      <ul>
        <li>好感度高於 50、聲量又高 → 民調每週自動往上漲</li>
        <li>好感度低於 50 → 聲量越大，扣得越多（越紅越被罵）</li>
        <li>聲量很低 → 好感度再高，民調也幾乎不動</li>
      </ul>
      <p>順序是：<b>先拉好感度，再衝聲量。</b></p>

      <h3>🔥 有火就滅火</h3>
      <ul>
        <li>突發事件只有 20 秒，最後兩週只剩 10 秒</li>
        <li>誠實、負責的選項通常最穩：道歉、公開說明、親自到現場</li>
        <li>「推給中央」「說是抹黑」「不回應」很常翻車</li>
        <li>時間到沒選，就是擺爛，老闆會一直問「接下來呢？」</li>
      </ul>

      <h3>✨ 沒火就成就老闆</h3>
      <ul>
        <li>行程上的小標籤：💰 花錢、🫀 很累、👥 看人氣（聲量太低可能沒人來）、🎲 有風險</li>
        <li>座談、講政見之後，要再選講什麼主題</li>
        <li>錢少的時候記得募款；造勢、廣告效果大，但要錢</li>
      </ul>

      <h3>🤝 讓老闆聽你的</h3>
      <p>信任太低，老闆會自己做別的事。多選他擅長的事，信任會上升，也比較不會翻車：</p>
      <ul>
        <li>政治世家：掃街、里長、宮廟、長輩出面</li>
        <li>清新專業：政見、座談、白皮書</li>
        <li>商業老闆：廣告、外商、花錢辦大事</li>
        <li>現任市長：視察、把市政危機處理好</li>
        <li>資深黨員：貓、國際交流、長照與住宅</li>
        <li>草根律師：街頭演講、即興、上節目</li>
      </ul>
      <p>信任掉了，就陪老闆吃宵夜聊天。</p>

      <h3>🧑‍💼 總幹事自己</h3>
      <ul>
        <li>🫀 肝的健康：太低會被強制休息一天</li>
        <li>💪 團隊士氣：太低事情容易出包，請大家喝飲料打打氣</li>
        <li>🔥 你的信心：太低你會慌，做決定的時間變短，老闆也不想聽</li>
      </ul>

      <h3>⚠️ 千萬別做</h3>
      <ul>
        <li>收黑錢、買票、境外資金：做壞事<b>一定會被抓</b>，選上也沒用</li>
        <li>一直攻擊對手：對手會回擊</li>
        <li>民調領先就放鬆：支持者以為穩贏，投票日不出門</li>
      </ul>

      <h3>📊 看內參民調</h3>
      <p>每個月一次。下面有「副總幹事建議」，會告訴你現在卡在哪裡。最後 10 天民調封關，只能憑直覺。</p>
    </div>
  </div>`;
  app.appendChild(m);
  m.querySelector('#mclose').onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
}

titleScreen();
