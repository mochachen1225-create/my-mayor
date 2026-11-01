// 拍辯論畫面（960×1920）：弱點題、翻舊帳、觀眾好感跳動（連拍）、辯論後迷因
const { chromium } = require('playwright');
const fs = require('fs');
const [,, lang, out] = process.argv;
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 400, height: 800 }, deviceScaleFactor: 2.4 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const shot = n => p.screenshot({ path: `${out}/${n}.png` });
  const burst = name => { fs.mkdirSync(`${out}/${name}`, { recursive: true }); const list = []; let on = true; const t0 = Date.now(); let i = 0;
    const done = (async () => { while (on) { const f = `${out}/${name}/${String(i++).padStart(4, '0')}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 88 }); list.push([f, (Date.now() - t0) / 1000]); } })();
    return async () => { on = false; await done; fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(list)); return list.length; }; };
  await p.addInitScript(l => { localStorage.setItem('mymayor.lang', l); localStorage.setItem('mymayor.sound', 'off'); localStorage.setItem('mymayor.version', '2.2'); }, lang);
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  await p.click('#go'); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Math.random; Math.random = () => 0.4; setTimeout(() => { Math.random = r; }, 100); }); // 商業大老闆
  await p.click('#flip'); await p.waitForTimeout(3200); await p.click('#go'); await p.click('#go'); await p.waitForTimeout(300);
  await p.evaluate(() => { roomScreen(); G.week = 13; G.trust = 60; G.f.promise = 4; updateHud();
    const rng = G.rng; G.rng = () => 0.1; window._evs = debateEvents(G); G.rng = rng; }); // 第一題強制抽到弱點題（房價）
  const card = i => p.evaluate(i => { closeOverlay(); window._c = eventCard(i < 3 ? _evs[i] : lazyEvent(G, 'debate_after'), 3 - i, false); }, i);
  // 1) 弱點題
  await card(0); await p.waitForTimeout(1200); await shot('q_weak');
  await p.evaluate(() => { G.rng = () => 0.6; }); // 不脫稿、不翻車
  let stop = burst('answer1'); await p.click('.overlay .opt:nth-child(1)'); await p.waitForTimeout(1800); await stop();
  // 2) 翻舊帳
  await card(1); await p.waitForTimeout(1200); await shot('q_attack');
  // 老闆脫稿（翻車），觀眾好感往下掉
  await p.evaluate(() => { let k = 0; G.trust = 0; G.rng = () => (k++ < 2 ? 0.999 : 0.9); });
  stop = burst('answer2'); await p.click('.overlay .opt:nth-child(1)'); await p.waitForTimeout(1800); await stop(); await shot('a_attack');
  // 3) 結辯
  await card(2); await p.waitForTimeout(800);
  await p.evaluate(() => { G.debate.aud = Math.min(G.debate.aud, 40); G.rng = () => 0.9; });
  await p.click('.overlay .opt:nth-child(3)'); await p.waitForTimeout(1200);
  // 4) 辯論後：翻車迷因
  await p.evaluate(() => { G.debate.aud = 30; });
  await card(3); await p.waitForTimeout(1200); await shot('after_flop');
  console.log(lang, 'errors', errs, 'aud', await p.evaluate(() => G.debate.aud));
  await b.close();
})();
