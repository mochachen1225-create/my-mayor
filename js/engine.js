// 遊戲邏輯（不碰畫面，方便模擬測試）

const WEEKS = 17;
const POLL_WEEKS = [1, 6, 10, 14];
const POLICY_WEEKS = [3, 7, 11, 15]; // 每月一次政見發表
const BLACKOUT_WEEK = 16; // 11/18 起民調封關
const START = new Date(2026, 7, 3); // 8/3（週一），只用來算月日，不顯示年份
const VOTE_DAY = new Date(2026, 10, 28);
const STAT_KEYS = ['buzz', 'fav', 'money', 'trust', 'liver', 'con', 'net', 'team', 'conf', 'self', 'pocket'];
const FLAG_KEYS = ['promise', 'nerve', 'smear', 'insider', 'askedJob', 'book', 'gotv', 'ktv', 'students', 'unionDeal', 'donated', 'warm', 'dirty1', 'dirty2', 'ledger', 'rebel', 'respect', 'script', 'cut', 'tv', 'buy', 'foreign'];

const JITTER = ['s', 'r', 'fav', 'buzz', 'net', 'con'];
const LIVER_WORK = 2, LIVER_LATE = 4;
const S_GAIN = 0.6; // 支持度正向效果的倍率（平衡用）
// 隨機挑一句，最近說過的先不重複
const pick = (g, arr) => {
  g.said = g.said || [];
  let pool = arr.filter(x => !g.said.includes(x));
  if (!pool.length) pool = arr;
  const x = pool[Math.floor(g.rng() * pool.length)];
  g.said.push(x);
  if (g.said.length > 30) g.said.shift();
  return x;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function makeRng(seed) {
  if (seed === undefined) return Math.random;
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function newGame(type, gender, name, rng = Math.random) {
  const T = TYPES[type];
  // 主要對手一定是現任市長；抽到現任的話，對手從其他挑戰者隨機選一位
  const rivalType = type === 'D' ? ['A', 'B', 'C', 'E', 'F'][Math.floor(rng() * 5)] : 'D';
  const rivalGender = rng() < 0.5 ? 'm' : 'f';
  return {
    rng, type, gender, name: name || T.names[gender],
    he: gender === 'f' ? '她' : '他',
    rivalType, rivalGender, rivalName: TYPES[rivalType].names[rivalGender],
    thirdName: (() => { const ts = Object.keys(TYPES).filter(t => t !== type && t !== rivalType); const t = ts[Math.floor(rng() * ts.length)]; return TYPES[t].names[rng() < 0.5 ? 'm' : 'f']; })(),
    num: 1 + Math.floor(rng() * 4),
    week: 1, clock: 8,
    s: T.start.s, r: T.start.r,
    buzz: 40, fav: 50, money: T.start.money, trust: T.start.trust,
    liver: 80, con: 60, team: 70, conf: 60, show: 0, showMax: 0, self: 0, pocket: 0, net: T.start.net, favor: 0,
    f: { idle: 0 }, idleStreak: 0,
    used: new Set(), pending: [], lastPoll: null, swings: [], history: []
  };
}

function weekDate(w) {
  const d = new Date(START);
  d.setDate(d.getDate() + 7 * (w - 1));
  return d;
}

function weekLabel(w) {
  const d = weekDate(w);
  const nth = Math.floor((d.getDate() - 1) / 7) + 1;
  const daysLeft = Math.round((VOTE_DAY - d) / 86400000);
  return { month: d.getMonth() + 1, nth, daysLeft };
}

function fill(g, text) {
  if (!text) return '';
  const incNote = g.type === 'D' ? '更糟的是，影片裡還有市府宣傳片的畫面，被質疑公器私用。' : '';
  return text
    .replace(/\{boss\}/g, g.name)
    .replace(/\{he\}/g, g.he)
    .replace(/\{rival\}/g, (g.rivalType === 'D' ? '現任市長 ' : '') + g.rivalName)
    .replace(/\{party\}/g, TYPES[g.type].party)
    .replace(/\{rparty\}/g, TYPES[g.rivalType].party)
    .replace(/\{num\}/g, g.num)
    .replace(/\{incNote\}/g, incNote);
}

function eligible(g, ev) {
  if (g.used.has(ev.id)) return false;
  if (ev.for === 'inc' && g.type !== 'D') return false;
  if (ev.for === 'chal' && g.type === 'D') return false;
  if (ev.types && !ev.types.includes(g.type)) return false;
  if (ev.weeks && (g.week < ev.weeks[0] || g.week > ev.weeks[1])) return false;
  if (ev.needFavor && g.favor <= 0) return false;
  if (ev.needDonor && !g.f.donated) return false;
  if (ev.needLow && g.s > g.r - 5) return false; // 民調太低，議員才會找藉口
  if (ev.needBroke && g.money >= 30) return false;
  if (ev.needPromise && (g.f.promise || 0) < ev.needPromise) return false;
  if (ev.needNerve && (g.f.nerve || 0) < ev.needNerve) return false; // 錢快花完了，才會有人找上門
  if (ev.kind === 'crisis') return false;
  return true;
}

function pickEvent(g) {
  const pool = EVENTS.filter(ev => eligible(g, ev));
  if (!pool.length) return null;
  // 上一局遇過的事件，這局比較不容易再遇到
  const seen = g.seenBefore || new Set();
  const weight = ev => (ev.kind === 'money' ? 1.6 : ev.types ? 1.8 : ev.kind === 'daily' ? 0.8 : 1) * (seen.has(ev.id) ? 0.3 : 1);
  let total = pool.reduce((a, ev) => a + weight(ev), 0);
  let x = g.rng() * total;
  for (const ev of pool) { x -= weight(ev); if (x <= 0) return ev; }
  return pool[pool.length - 1];
}

// 一週的行程：民調、主線、突發（可能好幾件）、成就老闆
function planWeek(g) {
  const steps = [];
  if (POLL_WEEKS.includes(g.week)) steps.push({ step: 'poll' });
  if (POLICY_WEEKS.includes(g.week)) steps.push({ step: 'event', ev: policyEvent(g) });
  for (const ev of g.pending) steps.push({ step: 'event', ev });
  g.pending = [];
  const main = (MAIN[g.week] || []).map(e => typeof e === 'string' ? EVENTS.find(x => x.id === e) : e);
  for (const ev of main) steps.push({ step: 'event', ev });
  // 沒事的時候自己排行程；突發事件隨機插進來，有時候一整週都沒事
  // 每週有幾個空檔是隨機的：有時很閒、有時忙到沒空
  let slots = g.week === 13 || g.week === WEEKS ? 0 : main.length ? (g.rng() < 0.7 ? 1 : 0) : (g.rng() < 0.5 ? 1 : 2);
  let fires = main.length ? (g.rng() < 0.3 ? 1 : 0) : (g.rng() < 0.2 ? 0 : 1);
  if (!main.length && g.rng() < 0.2) fires++;
  if (g.week >= 9 && g.rng() < 0.2) fires++;
  if (g.type === 'D' && g.week > 1 && g.rng() < 0.5) fires++; // 現任：市政和選戰雙線作戰，事情特別多
  if (g.week === 1) fires = 1;
  if (g.type === 'D' && slots > 0 && g.rng() < 0.35) slots--;
  const mix = [];
  for (let i = 0; i < slots; i++) mix.push({ step: 'free' });
  for (let i = 0; i < fires; i++) {
    const ev = pickEvent(g);
    if (!ev) break;
    g.used.add(ev.id);
    mix.push({ step: 'event', ev: prepare(g, ev) });
  }
  for (let i = mix.length - 1; i > 0; i--) {
    const j = Math.floor(g.rng() * (i + 1));
    [mix[i], mix[j]] = [mix[j], mix[i]];
  }
  if (g.week === 1 && mix.length) mix.sort((a, b) => (a.step === 'free') - (b.step === 'free')); // 第一週先遇到事件，認識玩法
  return steps.concat(mix);
}

// 政見發表：諂媚、逆風各抽兩個，順序打亂
function policyEvent(g) {
  const take = (arr, n) => { const a = arr.slice(), out = []; while (out.length < n) out.push(a.splice(Math.floor(g.rng() * a.length), 1)[0]); return out; };
  const opts = take(POLICIES.sweet, 2).concat(take(POLICIES.headwind, 2));
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(g.rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  // 支票開越多，諂媚政策越容易被打「政策買票」
  const p = g.f.promise || 0;
  const withRisk = opts.map(o => o.fx.promise && p >= 2 ? { ...o, risk: { p: Math.min(0.65, 0.18 * (p - 1)), fx: { fav: -4, s: -0.5 }, r: '「又一張支票？」名嘴說這是政策買票。' } } : o);
  return { id: 'policy', kind: 'policy', who: 'staff', title: '本月政見發表', text: '今天要發表一個新政見。副總幹事問：「總幹事，要討好選民，還是說真話？」', opts: withRisk };
}

// 需要臨時產生內容的事件
function prepare(g, ev) {
  if (ev.dynamic !== 'typhoon') return ev;
  const recOff = g.rng() < 0.5;
  const right = g.rng() < 0.75; // 氣象署有七成五會對
  const storm = recOff ? right : !right;
  const good = { fav: 4, s: 0.6 }, bad = { fav: -6, s: -1, buzz: 6 };
  const offRes = storm ? ['晚上風雨交加，大家稱讚果斷。', good] : ['結果出大太陽，「月亮颱」迷因洗版。', bad];
  const onRes = storm ? ['上班尖峰暴雨，滿街翻傘照片。', bad] : ['風雨普通，沒人抱怨。', { fav: 2 }];
  const off = { t: recOff ? '✅ 聽氣象署的：放假' : '🏖️ 不管建議，放假！', fx: {}, ok: offRes[1], r: offRes[0] };
  const on = { t: recOff ? '🏢 不管建議，照常上班上課' : '✅ 聽氣象署的：照常上班上課', fx: {}, ok: onRes[1], r: onRes[0] };
  const rec = recOff ? '風雨可能達標，建議放假' : '風雨應該不會達標，建議不放';
  return { ...ev, text: ev.text.replace('{rec}', rec), opts: [off, on,
    { t: '🧥 暫停競選，坐鎮防災中心', fx: { fav: 3, buzz: -3, s: 0.4, liver: -5 }, r: '穩重形象加分，只是曝光少了。' }] };
}

// 戰情室行程板：每次給 6 個能做的事，「休息」一定在
function buildChoices(g, n = 6) {
  const pool = BUILD.filter(b => (!b.types || b.types.includes(g.type)) && b.id !== 'rest' && (!b.minWeek || g.week >= b.minWeek));
  const out = [];
  while (out.length < n - 1 && pool.length) {
    const i = Math.floor(g.rng() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  out.push(BUILD.find(b => b.id === 'rest'));
  return out;
}

function applyFx(g, fx, delta) {
  if (!fx) return;
  for (let [k, v] of Object.entries(fx)) {
    // 同樣的選擇，每次結果都有點不一樣
    if (typeof v === 'number' && JITTER.includes(k)) v *= 0.65 + g.rng() * 0.7;
    if (k === 's' || k === 'r') {
      const d = k === 's' && v > 0 ? v * S_GAIN * (g.boost || 1) : v;
      g[k] += d; delta[k] = (delta[k] || 0) + d;
    }
    else if (STAT_KEYS.includes(k) || k === 'favor') { g[k] += v; delta[k] = (delta[k] || 0) + v; }
    else if (FLAG_KEYS.includes(k)) {
      g.f[k] = (g.f[k] || 0) + v;
      if (k === 'dirty1' && !g.f.dirty1At) g.f.dirty1At = g.week;
      if (['dirty1', 'dirty2', 'buy', 'foreign'].includes(k)) g.f.took = 1;
      if (k === 'tv') delta.tv = 1;
    }
  }
  clampAll(g);
}

function clampAll(g) {
  for (const k of STAT_KEYS) g[k] = clamp(g[k], 0, 100);
  g.favor = Math.max(0, g.favor);
  g.s = clamp(g.s, 5, 70);
  g.r = clamp(g.r, 5, 70);
}

function canAfford(g, opt) { return !opt.need || g.money >= opt.need; }

// 玩家選了 opt；回傳發生了什麼
function choose(g, ev, opt, isBuild = false) {
  g.idleStreak = 0;
  g.boost = ev && ev.for === 'inc' ? 1.4 : 1; // 現任把市政危機處理好，加分比較多
  g.rPrev = g.r;
  const delta = {};
  const lines = [];
  let exec = opt;
  let defied = false;
  const opts = isBuild ? null : ev.opts;
  const bossActs = isBuild ? true : !ev.staff;

  if (bossActs) {
    let p = 0.5 + g.trust * 0.0045;
    if (opt.likes && opt.likes.includes(g.type)) p += 0.2;
    if (opt.hates && opt.hates.includes(g.type)) p -= 0.25;
    if (g.type === 'C') p -= 0.05;
    if (isBuild) p += 0.12; // 自己排的行程，老闆比較願意配合
    if (g.conf > 75) p += 0.05; // 總幹事有信心，老闆比較願意聽
    if (g.conf < 30) p -= 0.08; // 總幹事自己都沒把握，老闆更不想聽
    p = clamp(p, 0.35, 0.96);
    if (g.rng() > p) {
      defied = true;
      if (opts) {
        const others = opts.filter(o => o !== opt && canAfford(g, o));
        const liked = others.filter(o => o.likes && o.likes.includes(g.type));
        const from = liked.length ? liked : others;
        if (from.length) exec = from[Math.floor(g.rng() * from.length)];
        else defied = false;
      } else {
        // 成就老闆企劃：老闆不配合，效果打折
        exec = { ...opt, fx: halve(opt.fx), risk: null, ok: null };
      }
      if (defied) g.f.defied = (g.f.defied || 0) + 1;
      if (defied) lines.push({ kind: 'defy', text: opts ? fill(g, pick(g, TYPES[g.type].defy)) + ' ' + fill(g, exec.t) : fill(g, pick(g, TYPES[g.type].half)) });
    }
  }

  let failed = false;
  let bad = null;
  // 人潮型活動：聲量和民調不夠，就沒人來
  const crowdFail = exec.crowd && g.rng() < clamp(0.7 - g.buzz / 110 - (g.s - g.r) / 40, 0.05, 0.75);
  if (crowdFail) {
    const cost = {};
    for (const [k, v] of Object.entries(exec.fx || {})) if (typeof v === 'number' && v < 0) cost[k] = v;
    applyFx(g, cost, delta);
    applyFx(g, { fav: -2, buzz: -3, s: -0.2 }, delta);
    lines.push({ kind: 'bad', text: fill(g, CROWD_FAIL[Math.floor(g.rng() * CROWD_FAIL.length)]) });
    failed = true;
  } else applyFx(g, exec.fx, delta);
  if (crowdFail) { /* 已處理 */ }
  else if (exec.dirtyCheck) {
    if (g.f.dirty1 || g.f.dirty2 || g.f.foreign) {
      applyFx(g, { fav: -6, s: -1.5 }, delta);
      lines.push({ kind: 'bad', text: fill(g, '對手當場拿出捐款名單，{boss}愣在台上。') });
      failed = true;
    } else {
      applyFx(g, { fav: 3, s: 0.5 }, delta);
      lines.push({ kind: 'good', text: '對手拿不出證據，反而被追問。' });
    }
  } else if (exec.risk && (bad = rollRisk(g, exec))) {
    applyFx(g, bad.fx, delta);
    lines.push({ kind: 'bad', text: fill(g, bad.r) });
    failed = true;
  } else {
    applyFx(g, exec.ok, delta);
    if (exec.r) lines.push({ kind: 'good', text: fill(g, exec.r) });
  }
  if (exec.after) applyFx(g, exec.after, delta);

  // 老闆的好惡影響信任
  if (!defied && bossActs) {
    if (opt.likes && opt.likes.includes(g.type)) applyFx(g, { trust: 4 }, delta);
    else if (opt.hates && opt.hates.includes(g.type)) applyFx(g, { trust: -4 }, delta);
    else if (failed) applyFx(g, { trust: -2 }, delta);
    else applyFx(g, { trust: 1 }, delta);
  }
  // 總幹事替自己撈：有機會被老闆發現（私心越高越容易被發現）
  if (exec.selfish) {
    if (g.rng() < 0.15 + g.self / 150) {
      g.f.caught = (g.f.caught || 0) + 1;
      applyFx(g, { trust: -12, conf: -5, team: -3 }, delta);
      lines.push({ kind: 'bad', text: fill(g, pick(g, SELF_CAUGHT)) });
      if (g.trust < 30 && g.week >= 12) g.f.fired = 1;
    }
  }
  // 形象包裝：做對方向加分；包裝太多，作秀指數會讓人起疑
  if (exec.img && !failed) {
    const want = TYPES[g.type].image.to;
    if (g.show > 55 && g.rng() < (g.show - 45) / 100) {
      applyFx(g, { fav: -4, buzz: 2 }, delta);
      lines.push({ kind: 'bad', text: fill(g, pick(g, SHOW_FAIL)) });
      failed = true;
    } else if (exec.img.includes(want)) {
      applyFx(g, { fav: 3, s: 0.3 }, delta);
      lines.push({ kind: 'good', text: '🎭 形象加分：選民開始覺得' + g.name + '很「' + want + '」。' });
    }
  }
  if (exec.img) { g.show += exec.risk ? 15 : 12; g.showMax = Math.max(g.showMax, g.show); }
  // 沒有寫好的反應時，補一句選民、市場的反應
  if (!lines.some(l => l.kind === 'good' || l.kind === 'bad')) {
    const v = (delta.s || 0) - (delta.r || 0) + (delta.fav || 0) * 0.15 + (delta.buzz || 0) * 0.05;
    const pool = v > 0.4 ? MARKET.good : v < -0.2 ? MARKET.bad : MARKET.meh;
    lines.push({ kind: v < -0.2 ? 'bad' : 'good', text: fill(g, pick(g, pool)) });
  }
  // 團隊士氣：做得好大家有幹勁，出包或老闆不聽話就洩氣
  applyFx(g, { team: failed ? -3 : defied ? -2 : 1, conf: failed ? -4 : defied ? -2 : 2 }, delta);
  // 老闆在意的是乾淨還是贏？你的做法會影響他對你的信任（隱藏）
  const V = TYPES[g.type].values;
  const conMove = (exec.fx && exec.fx.con) || 0;
  let vt = 0, vline = null;
  if (conMove <= -5) {
    vt = V.win >= 0.8 && !failed ? 2 : -Math.round(V.clean * 6);
    vline = vt > 0 ? 'dirtyGood' : 'dirtyBad';
  } else if (conMove >= 4) {
    vt = V.clean >= 0.8 ? 3 : V.win >= 0.8 ? -2 : 1;
    vline = vt > 0 ? 'cleanGood' : 'cleanBad';
  }
  if (vt) {
    applyFx(g, { trust: vt }, delta);
    if (Math.abs(vt) >= 2 && g.rng() < 0.7) lines.push({ kind: 'say', mood: vt > 0 ? 'big' : 'sad', text: fill(g, pick(g, VALUE_LINES[vline])) });
  }
  // 老闆的反應，每次都不太一樣
  if (bossActs && !defied && !lines.some(l => l.kind === 'say') && g.rng() < 0.6) {
    lines.push({ kind: 'say', mood: failed ? 'sad' : 'big', text: fill(g, pick(g, failed ? TYPES[g.type].bad : TYPES[g.type].ok)) });
  }
  advanceClock(g, isBuild ? 3 : 1.5 + g.rng() * 2, ev && ev.late, delta);
  g.boost = 1;
  logSwing(g, isBuild ? fill(g, exec.t) : fill(g, ev.title), delta);
  if ((delta.r || 0) < -0.3) g.provoked = 1;
  if (isBuild && ['rally', 'billboard', 'ads', 'dance', 'handshake'].includes(exec.id) && !failed) g.bigMove = 1;
  return { exec, defied, lines, delta, failed };
}

// 老闆擅長的事比較不容易翻車，不擅長的比較容易
// risk 可以是一個壞結果，也可以是好幾個（各有機率）；回傳抽中的壞結果，沒抽中就是 null
function rollRisk(g, o) {
  const list = Array.isArray(o.risk) ? o.risk : [o.risk];
  const total = list.reduce((a, r) => a + r.p, 0);
  let shift = 0;
  if (o.likes && o.likes.includes(g.type)) shift -= 0.15;
  if (o.hates && o.hates.includes(g.type)) shift += 0.15;
  if (g.team < 35) shift += 0.1; // 團隊士氣低落，事情比較容易出包
  else if (g.team > 75) shift -= 0.05;
  const scale = clamp(total + shift, 0.05, 0.9) / total;
  let x = g.rng();
  for (const r of list) { x -= r.p * scale; if (x < 0) return r; }
  return null;
}

function halve(fx) {
  const o = {};
  for (const [k, v] of Object.entries(fx || {})) o[k] = typeof v === 'number' && v > 0 ? v / 2 : v;
  return o;
}

// 擺爛：時間到沒選
function timeout(g, ev, isBuild = false) {
  g.rPrev = g.r;
  g.idleStreak++;
  g.f.idle = (g.f.idle || 0) + 1;
  const delta = {};
  const fx = isBuild ? { trust: -3, buzz: -2, team: -4, conf: -3 } : { trust: -3 - g.idleStreak, fav: -3, s: -0.6, buzz: -2, team: -5, conf: -4 };
  applyFx(g, fx, delta);
  advanceClock(g, 1, ev && ev.late, delta);
  logSwing(g, '已讀不回：' + (isBuild ? '成就老闆企劃' : fill(g, ev.title)), delta);
  const q = '接下來呢' + '？'.repeat(Math.min(g.idleStreak, 4));
  const lines = [{ kind: 'boss', text: g.idleStreak >= 3 ? `${q}……你還在嗎？` : q }];
  if (!isBuild) lines.push({ kind: 'bad', text: '媒體寫：「' + g.name + '陣營已讀不回。」' });
  return { lines, delta, idle: g.idleStreak };
}

function logSwing(g, title, delta) {
  const v = (delta.s || 0) - (delta.r || 0) + (delta.fav || 0) * 0.08;
  if (Math.abs(v) >= 0.3) { g.swings.push({ title, v }); g.history.push({ title, v, week: g.week }); }
}

function advanceClock(g, hours, late, delta) {
  if (late) g.clock = Math.max(g.clock, 26);
  g.clock += hours;
  // 每件事都在燃燒總幹事的肝；過了午夜燒得更快
  applyFx(g, { liver: g.clock >= 24 ? -LIVER_LATE : -LIVER_WORK }, delta);
}

function clockText(g) {
  const h = Math.floor(g.clock) % 24;
  const m = Math.floor((g.clock % 1) * 60 / 5) * 5;
  return (g.clock >= 24 || h < 6 ? '🌙 ' : '☀️ ') + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

// 週末結算
function endWeek(g) {
  const notes = [];
  const T = g.type;
  g.s += ((g.fav - 50) / 25) * (g.buzz / 100) * 0.8;
  if (T === 'D') g.s -= 0.4;
  // 對手也在拚：每週一則對手動態
  g.rPrev = g.r;
  const news = [];
  // 對手會回擊：你打他，他就打回來；你辦大活動，他也跟著辦
  if (g.provoked && g.rng() < 0.65) {
    const c = pick(g, COUNTER);
    g.s += c.s; g.r += c.r || 0;
    news.push({ text: fill(g, c.t), up: true });
  } else if (g.bigMove && g.rng() < 0.5) {
    const c = pick(g, COPYCAT);
    g.r += c.r;
    news.push({ text: fill(g, c.t), up: true });
  }
  g.provoked = 0; g.bigMove = 0;
  const rn = RIVAL_NEWS[Math.floor(g.rng() * RIVAL_NEWS.length)];
  g.r += 0.42 + rn.r;
  news.push({ text: fill(g, rn.t), up: rn.r > 0 });
  if (g.rng() < 0.4) {
    const tn = THIRD_NEWS[Math.floor(g.rng() * THIRD_NEWS.length)];
    g.r += tn.r || 0;
    g.s += tn.s || 0;
    news.push({ text: fill(g, tn.t).replace(/\{third\}/g, g.thirdName), up: null });
  }
  g.buzz += (40 - g.buzz) * 0.15;
  g.show = Math.max(0, g.show - 10); // 一陣子沒包裝，大家就忘了
  if (g.week >= 11) {
    g.s += 0.15 * Math.min(g.f.nerve || 0, 4); // 逆風政策：選民慢慢理解
    g.s -= 0.06 * Math.max(0, (g.f.promise || 0) - 2); // 支票開太多：選民開始懷疑做不做得到
  }
  g.money += { A: 3, B: g.s >= g.r - 5 ? 4 : 1, C: 6, D: 4, E: 3, F: 2 }[T];
  g.liver += 4; // 週末補眠（現任事情比較多，自然比較累）
  // 睡眠
  const sleep = Math.max(0, 32 - g.clock);
  if (sleep < 3) { g.liver -= 3; g.team -= 3; notes.push(`你昨晚只睡了 ${sleep.toFixed(1)} 小時，整個團隊都很累。`); }
  else if (sleep < 6) notes.push(`你昨晚睡了 ${sleep.toFixed(1)} 小時。`);
  if (g.liver <= 0 && !g.f.hospital) {
    g.f.hospital = 1; g.liver = 20;
    notes.push('你在戰情室昏倒，被送進急診。你還在病床上用手機回訊息。');
  }
  // 做壞事一定會被抓：分批捐款三週後爆
  if (g.f.dirty1 && !g.f.exposed && g.week >= g.f.dirty1At + 3) {
    g.f.exposed = 1;
    g.pending.push(EXPOSED);
  }
  clampAll(g);
  g.week++;
  g.clock = 8;
  return { notes, news };
}

// 選民和市場的反應（沒有專屬文字時用）
const MARKET = {
  good: [
    '菜市場阿姨說：「這個我知道，電視上有看到！」',
    '網友留言：「這個候選人好像真的有在做事。」',
    '脆上有人發文：「{boss}這招不錯。」愛心比酸言酸語多。',
    '計程車司機跟乘客聊起{boss}，語氣是正面的。',
    '里長群組轉傳了相關新聞，下面一排讚。',
    '年輕人在脆上分享，留言說「有被打到」。',
    '早餐店老闆說：「這個人我有印象，不錯。」',
    '長輩群組轉了三次，還配了一張「讚」的圖。'
  ],
  meh: [
    '新聞只有一小則，沒什麼人討論。',
    '網友反應普通：「喔，然後呢？」',
    '社群上有人看到，但很快就被別的新聞蓋過去。',
    '菜市場阿姨說：「誰？沒聽過。」',
    '計程車司機說：「選舉嘛，大家都在做一樣的事。」'
  ],
  bad: [
    '網友留言：「又在作秀。」',
    '脆上一整排酸言酸語：「這也能當市長？」',
    '菜市場阿姨搖頭：「這個人不行啦。」',
    '長輩群組開始轉傳批評的貼文。',
    '計程車司機說：「這個我不會投。」'
  ]
};

const COUNTER = [
  { t: '{rival}陣營回擊：開記者會說你們「只會抹黑」，還拿出你們以前的發言對照。', s: -0.6 },
  { t: '{rival}的側翼連夜做了一整套梗圖反擊你們。', s: -0.5 },
  { t: '{rival}在政論節目上點名你們，說「選不贏就亂咬」。', s: -0.5, r: 0.2 },
  { t: '{rival}陣營放出你們志工的對話截圖，說是「網軍」。', s: -0.7 }
];
const COPYCAT = [
  { t: '{rival}看到你們辦得熱鬧，也跟著辦了一場更大的。', r: 0.5 },
  { t: '{rival}連夜在全市加掛兩倍看板，跟你們拚曝光。', r: 0.4 },
  { t: '{rival}也找了舞團、也辦了握手會，網友說「抄很大」。', r: 0.3 }
];

const RIVAL_NEWS = [
  { t: '{rival}辦了萬人造勢晚會，現場很熱。', r: 1.2 },
  { t: '{rival}掃街拜票跑了一整週。', r: 0.7 },
  { t: '{rival}上政論節目被問倒，片段被瘋傳。', r: -0.6 },
  { t: '{rival}陣營傳出內鬨，副總幹事出走。', r: -0.8 },
  { t: '{rival}推出新政見，反應普通。', r: 0.3 },
  { t: '{rival}的競選廣告開始大量放送。', r: 0.9 },
  { t: '{rival}失言：「年輕人不懂政治。」', r: -0.9 },
  { t: '{rival}請到知名企業家站台。', r: 1.0 },
  { t: '{rival}這週很低調，只跑了幾場座談。', r: 0.2 },
  { t: '{rival}的小編在留言區跟網友吵架。', r: -0.5 },
  { t: '{rival}去長青據點陪長輩跳廣場舞。', r: 0.6 },
  { t: '{rival}被爆選舉經費來源不明。', r: -1.2 },
  { t: '{rival}抱著小狗拍了一支廣告，點閱破百萬。', r: 0.8 },
  { t: '{rival}的家人在臉書幫忙拉票，留言區吵翻。', r: -0.3 }
];

const THIRD_NEWS = [
  { t: '其他候選人：{third}在路口跳舞拜票，聲量暴增但沒人當真。' },
  { t: '其他候選人：{third}說要「把 N City 變成全世界最好的城市」，被做成梗圖。' },
  { t: '其他候選人：{third}宣布「不排除退選」，棄保話題開始發酵。', r: 0.4 },
  { t: '其他候選人：{third}痛批兩大陣營，搶走了一點你的票。', s: -0.3 },
  { t: '其他候選人：{third}的看板被颱風吹走了。' }
];

const SHOW_FAIL = [
  '網友留言：「最近怎麼天天都在演親民？」這次沒人買單。',
  '脆上有人整理了{boss}這個月的「親民影片合集」，標題是〈演技大賞〉。',
  '名嘴說：「包裝得太用力了，看得出來是幕僚設計的。」',
  '長輩群組轉傳：「選前才這麼勤勞。」'
];

const SELF_CAUGHT = [
  '{boss}看到你的手機跳出一則訊息：「仲介費已入帳。」{boss}什麼都沒說，但眼神變了。',
  '副總幹事在茶水間小聲說：「總幹事最近好像很忙，忙的都不是選舉。」話傳到了{boss}耳裡。',
  '{boss}問你：「你最近是不是在接別的案子？」你說沒有。{boss}笑了一下。',
  '記者打電話來問：「總幹事是不是有在幫廠商牽線？」{boss}剛好在旁邊。'
];

const CROWD_FAIL = [
  '現場只來了 7 個人，其中 3 個是記者，2 個是你們的志工。',
  '空蕩蕩的椅子被對手拍下來，配文：「民氣在哪裡？」',
  '來的人比工作人員少。{boss}還是講完了全場。',
  '主持人一直喊「後面的朋友」，但後面沒有朋友。'
];

const EXPOSED = {
  id: 'exposed', kind: 'crisis', who: 'reporter', timer: 15,
  title: '分批捐款被踢爆了',
  text: '記者查到：捐款名單裡，有幾十位建設公司員工在同一天捐了一樣的金額。',
  opts: [
    { t: '🙇 認錯、全數退款', fx: { fav: -4, s: -1, money: -15, con: 6 }, r: '傷害控制住了，但很痛。' },
    { t: '🙄 「都是員工自發的」', fx: { fav: -8, s: -1.8 }, r: '沒有人相信。' },
    { t: '🫵 {boss}說「是幕僚處理的」', fx: { fav: -3, s: -0.8, trust: -12 }, r: '鏡頭帶到了你。' }
  ]
};

function doPoll(g) {
  const n = () => (g.rng() - 0.5) * 6;
  const s = clamp(g.s + n(), 3, 80), r = clamp(g.r + n(), 3, 80);
  const others = Math.max(4, (100 - g.s - g.r) * 0.4);
  const und = Math.max(0, 100 - s - r - others);
  const top = g.swings.slice().sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 2);
  g.swings = [];
  const res = { s, r, others, und, prev: g.lastPoll, top };
  // 民調漲，信心跟著漲
  if (res.prev) g.conf = clamp(g.conf + (res.s - res.prev.s) * 3 - (res.r - res.prev.r) * 2, 0, 100);
  g.lastPoll = res;
  // 落後或領先 8% 以上觸發危機
  const gap = g.r - g.s;
  if (gap >= 8) {
    const pool = EVENTS.filter(e => e.crisis === 'behind' && !g.used.has(e.id));
    if (pool.length) { const e = pool[Math.floor(g.rng() * pool.length)]; g.used.add(e.id); g.pending.push(e); }
  } else if (gap <= -8 && !g.used.has('ahead_relax')) {
    g.used.add('ahead_relax');
    g.pending.push(EVENTS.find(e => e.id === 'ahead_relax'));
  }
  return res;
}

function finish(g) {
  const noise = () => (g.rng() + g.rng() - 1) * 1.5;
  // 看起來穩贏，支持者反而不出門投票；最後一週有催票可以抵銷
  const lead = g.lastPoll ? g.lastPoll.s - g.lastPoll.r : 0;
  let turnoutDrop = 0;
  if (lead > 4) turnoutDrop = (lead - 2) * g.rng() * 0.8;
  if (g.f.gotv) turnoutDrop *= 0.3;
  if (turnoutDrop > 1.5) g.f.complacent = 1;
  const sF = g.s - turnoutDrop + noise(), rF = g.r + noise();
  const othersF = Math.max(4, (100 - g.s - g.r) * 0.5);
  const tot = sF + rF + othersF;
  const share = { s: sF / tot * 100, r: rF / tot * 100, o: othersF / tot * 100 };
  const margin = share.s - share.r;
  const turnout = Math.round((63 - turnoutDrop * 1.6 + (g.rng() - 0.5) * 4) * 10) / 10;
  const res = { share, margin, turnout, win: margin > 0, close: Math.abs(margin) < 1 };
  if (!res.close) decide(g, res);
  return res;
}

// 差距不到 1%：驗票、嗆聲或認輸
function resolveClose(g, res, choice) {
  const m = Math.abs(res.margin);
  const lines = [];
  if (res.win) {
    if (choice === 'accept') { g.f.graceWin = 1; lines.push('驗票結果出爐：維持原判，' + g.name + '當選。你的「歡迎驗票」被稱讚很有風度。'); }
    else if (choice === 'fight') { g.f.siege = 1; lines.push('兩邊支持者在選委會外面對嗆到半夜，驗票結果還是維持原判，但畫面很難看。'); }
    else { lines.push('支持者冷靜回家。驗票結果維持原判，' + g.name + '險勝。'); }
  } else {
    if (choice === 'recount') {
      g.f.recounted = 1;
      if (g.rng() < 0.3 * (1 - m)) { res.win = true; g.f.flipped = 1; lines.push('驗票驗出一整箱誤判的票！結果翻盤，' + g.name + '當選！'); }
      else lines.push('驗了三個星期，結果維持原判。');
    } else if (choice === 'protest') { g.f.siege = 1; lines.push('支持者包圍選委會三天三夜，結果沒有改變，還多了一堆罰單。'); }
    else { g.f.graceful = 1; lines.push(g.name + '打電話恭喜對手，敗選感言被說是「這次選舉最好看的一段」。'); }
  }
  decide(g, res);
  return lines;
}

function decide(g, res) {
  const margin = res.margin;
  const ctx = { type: g.type, win: res.win, margin, trust: g.trust, con: g.con, net: g.net, f: g.f, self: g.self, pocket: g.pocket, liver: g.liver, team: g.team };
  const ending = ENDINGS.find(e => e.when(ctx));
  const mgr = MGR_ENDINGS.find(e => e.when(ctx));
  const resultLine = res.win ? fill(g, '好消息是，{boss}當選了。') : fill(g, '{boss}落選了。');
  const hist = g.history.slice();
  const best = hist.filter(h => h.v > 0).sort((a, b) => b.v - a.v).slice(0, 3);
  const worst = hist.filter(h => h.v < 0).sort((a, b) => a.v - b.v).slice(0, 3);
  const notes = [];
  if (g.fav < 50) notes.push('好感度一直不夠高，聲量越大反而越扣分。');
  else if (g.buzz < 45) notes.push('好感度不錯，但曝光太少，很多選民根本不認識{boss}。');
  if ((g.f.idle || 0) >= 3) notes.push('你擺爛了 ' + g.f.idle + ' 次，老闆和選民都看在眼裡。');
  if ((g.f.defied || 0) >= 5) notes.push('{boss}有 ' + g.f.defied + ' 次沒照你的話做，信任要顧好。');
  if (g.f.complacent) notes.push('民調領先，支持者以為穩贏沒出門，投票率只有 ' + res.turnout + '%。');
  if (g.f.took) notes.push('碰了不該碰的錢，就算選上也會出事。');
  if ((g.f.promise || 0) >= 6) notes.push('開了太多討好的支票，名嘴和財政局都在算帳。');
  if ((g.f.nerve || 0) >= 3) notes.push('推了不少逆風政策，被罵，但也被記住了。');
  if (g.f.smear) notes.push('用了奧步。就算一時有效，選後官司也跑不掉。');
  if (g.showMax >= 70) notes.push('形象包裝做得太密集，選民開始覺得{boss}在作秀。');
  if (g.f.caught >= 2) notes.push('你替自己撈的事被老闆發現了 ' + g.f.caught + ' 次。');
  if (!notes.length) notes.push(margin > 0 ? '整場選戰打得很穩，好感和聲量都夠。' : '差一點點。下次多衝一點曝光，也許就翻過去了。');
  res.review = { best, worst, notes: notes.slice(0, 3).map(n => fill(g, n)) };
  res.ending = ending;
  res.text = fill(g, ending.text).replace('{resultLine}', resultLine);
  res.mgr = mgr;
  res.mgrText = fill(g, mgr.text).replace(/\{pocket\}/g, Math.round(g.pocket * 10));
  return res;
}

if (typeof module !== 'undefined') module.exports = { newGame, planWeek, buildChoices, choose, timeout, endWeek, doPoll, finish, resolveClose, decide, fill, weekLabel, clockText, canAfford, makeRng, WEEKS, BLACKOUT_WEEK };
