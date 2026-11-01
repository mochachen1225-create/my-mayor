// 用法：先在遊戲 repo 跑 python3 -m http.server 8765，再 node stage_scenes.js <zh|en> <輸出資料夾>
// 換遊戲時要改：裡面呼叫的全域函式（roomScreen、eventCard、sweepGame…）、事件 id、選項位置
// 拍宣傳素材：照劇本演一局。靜態畫面截圖；會動的地方（翻牌、小遊戲、開票）連拍
const { chromium } = require('playwright');
const fs = require('fs');
const [,, lang, out] = process.argv;
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 800 }, deviceScaleFactor: 2.4 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const shot = n => p.screenshot({ path: `${out}/${n}.png` });
  // 連拍：回傳 [檔名, 秒數]，直到 stop() 被呼叫
  const burst = name => {
    fs.mkdirSync(`${out}/${name}`, { recursive: true });
    const list = []; let on = true; const t0 = Date.now(); let i = 0;
    const done = (async () => { while (on) { const f = `${out}/${name}/${String(i++).padStart(4, '0')}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 88 }); list.push([f, (Date.now() - t0) / 1000]); } })();
    return async () => { on = false; await done; fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(list)); return list.length; };
  };
  await p.addInitScript(l => { localStorage.setItem('mymayor.lang', l); localStorage.setItem('mymayor.sound', 'off'); localStorage.setItem('mymayor.version', '2.1'); }, lang);
  await p.goto('http://localhost:8765/index.html');
  await p.waitForTimeout(1800); await shot('title');
  await p.click('#go'); await p.waitForTimeout(800);
  await p.evaluate(() => { const r = Math.random; Math.random = () => 0.55; setTimeout(() => { Math.random = r; }, 100); });
  let stop = burst('flip'); await p.click('#flip'); await p.waitForTimeout(3300); console.log('flip frames', await stop());
  await shot('setup');
  await p.click('#go'); await p.waitForTimeout(700); await shot('profile');
  await p.click('#go'); await p.waitForTimeout(400);
  await p.evaluate(() => { roomScreen(); G.week = 1; updateHud(); });
  await p.waitForTimeout(400);
  const card = (id, week, extra) => p.evaluate(([id, week, extra]) => { closeOverlay(); G.week = week; Object.assign(G, extra || {}); updateHud(); const ev = EVENTS.find(e => e.id === id); window._c = eventCard(ev.dynamic ? prepare(G, ev) : ev, 2, false); }, [id, week, extra]);
  // 1) 小編用錯帳號
  await card('intern', 1); await p.waitForTimeout(1500); await shot('intern_card');
  await p.evaluate(() => { G.rng = () => 0.9; });
  await p.click('.overlay .opt:nth-child(2)'); await p.waitForTimeout(1600); await shot('intern_res');
  // 2) 老鼠：老闆不聽
  await card('rat_inc', 3, { trust: 20 }); await p.waitForTimeout(1500); await shot('rat_card');
  await p.evaluate(() => { let k = 0; G.rng = () => (k++ === 0 ? 0.999 : 0.9); });
  await p.click('.overlay .opt:nth-child(1)'); await p.waitForTimeout(1800); await shot('rat_res');
  await p.evaluate(() => { const o = document.querySelector('.overlay .card'); o.scrollTop = o.scrollHeight; }); await p.waitForTimeout(500); await shot('rat_crisp');
  // 3) 颱風：倒數剩 3 秒
  await p.evaluate(() => { G.rng = Math.random; });
  await card('typhoon_inc', 4); await p.waitForTimeout(2000); await shot('typhoon_card');
  await p.waitForSelector('.overlay.hurry', { timeout: 30000 }); await p.waitForTimeout(1300); await shot('typhoon_hurry');
  await p.click('.overlay .opt:nth-child(1)'); await p.waitForTimeout(1500); await shot('typhoon_res');
  // 4) 菜市場掃街
  await p.evaluate(() => { closeOverlay(); G.week = 6; updateHud(); window._m = sweepGame(); });
  await p.waitForTimeout(1500); await shot('mg_intro');
  stop = burst('mg'); await p.click('#mg-go');
  const tEnd = Date.now() + 10300;
  while (Date.now() < tEnd) {
    for (const c of await p.$$('.mg-cell.on')) { const t = await c.textContent(); if (!/🙅|📸/.test(t)) { await p.waitForTimeout(250); await c.click().catch(() => {}); } }
    await p.waitForTimeout(60);
  }
  await p.waitForSelector('#mg-done'); await p.waitForTimeout(1200); console.log('mg frames', await stop()); await shot('mg_end');
  // 5) 爆肝
  await p.evaluate(() => { closeOverlay(); G.week = 11; G.clock = 27; G.liver = 4; updateHud(); window._r = forcedRest(); });
  await p.waitForTimeout(1800); await shot('liver');
  // 6) 開票夜：小贏、前半段落後
  stop = burst('night');
  await p.evaluate(() => { closeOverlay(); G.week = 18; G.s = 46; G.r = 43.5; G.f.complacent = 0; G.rng = () => 0.5; electionNight(); });
  await p.waitForTimeout(12500); console.log('night frames', await stop()); await shot('night_end');
  if (await p.$('#closebox .opt')) { await p.click('#closebox .opt'); await p.waitForTimeout(500); }
  await p.click('#next'); await p.waitForTimeout(600); await p.click('#go'); await p.waitForTimeout(1500); await shot('ending');
  await ctx.close(); await b.close();
  console.log(lang, 'errors', errs);
})();
