// 手感：音效、震動、彩帶、飄字（只管畫面，不碰遊戲邏輯）
const SOUND_KEY = 'mymayor.sound';
let audioCtx = null;

function soundOn() {
  try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch (e) { return true; }
}
function setSound(on) {
  try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch (e) { /* 沒差 */ }
}

// 用 WebAudio 現場合成，不用載音檔
function tone(freq, start, dur, type = 'sine', vol = 0.18, slide = 0) {
  const t = audioCtx.currentTime + start;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

const SFX = {
  tap: () => tone(660, 0, 0.06, 'triangle', 0.12),
  pop: () => tone(520, 0, 0.08, 'square', 0.08, 500),
  good: () => { tone(660, 0, 0.12, 'triangle'); tone(990, 0.09, 0.18, 'triangle'); },
  bad: () => { tone(220, 0, 0.25, 'sawtooth', 0.1, -90); },
  tick: () => tone(1200, 0, 0.03, 'square', 0.05),
  combo: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.14, 'triangle', 0.14)),
  drum: () => { tone(110, 0, 0.18, 'sine', 0.3, -60); },
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.16)),
  lose: () => [392, 370, 349, 294].forEach((f, i) => tone(f, i * 0.28, 0.32, 'sawtooth', 0.07, -10)),
  hand: () => { tone(880, 0, 0.05, 'square', 0.07); tone(1320, 0.04, 0.07, 'triangle', 0.1); },
  boo: () => tone(180, 0, 0.18, 'sawtooth', 0.09, -60)
};

function sfx(name) {
  if (!soundOn() || !SFX[name]) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    SFX[name]();
  } catch (e) { /* 不支援就安靜 */ }
}

function vibrate(pattern) {
  if (!soundOn()) return;
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* 沒差 */ }
}

// 彩帶：在畫面上撒一下就消失
function confetti(n = 80) {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  const W = c.width = innerWidth * 2, H = c.height = innerHeight * 2;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const colors = ['#e0a526', '#d93636', '#2e9e6a', '#3a5ba0', '#ffd166', '#ff7aa2'];
  const ps = Array.from({ length: n }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35,
    vx: (Math.random() - 0.5) * 34, vy: -Math.random() * 38 - 10,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
    w: 10 + Math.random() * 12, h: 6 + Math.random() * 8, c: colors[Math.floor(Math.random() * colors.length)]
  }));
  const t0 = performance.now();
  (function frame(now) {
    const k = (now - t0) / 1600;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 1.4; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * k); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (k < 1) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

// 數值變化：在 HUD 的格子上飄出「+3」「-5」
function floatDelta(el, v) {
  if (!el || !v) return;
  const r = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'floater ' + (v > 0 ? 'up' : 'down');
  f.textContent = (v > 0 ? '+' : '') + v;
  f.style.left = (r.left + r.width / 2) + 'px';
  f.style.top = (r.top + 6) + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

function shakeEl(el) {
  if (!el) return;
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}
