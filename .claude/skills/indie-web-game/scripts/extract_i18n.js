const acorn = require('acorn'), walk = require('acorn-walk'), fs = require('fs'), vm = require('vm');
const root = process.argv[2];
const CJK = /[一-鿿]/;
const out = new Map(); // zh -> context
const add = (s, ctx) => { if (CJK.test(s) && !out.has(s)) out.set(s, ctx); };
// 1) data.js：跑起來，走訪所有物件
const c = { console }; vm.createContext(c);
vm.runInContext(fs.readFileSync(root + '/js/data.js', 'utf8').replace(/^const /gm, 'var '), c);
const names = ['CHANGES', 'TYPES', 'VALUE_LINES', 'NPC', 'EVENTS', 'MAIN', 'TOPICS', 'POLICIES', 'BUILD', 'ENDINGS', 'MGR_ENDINGS', 'THREAD_USERS', 'THREADS', 'SWEEP_PEOPLE'];
function walkData(x, path) {
  if (typeof x === 'string') return add(x, path);
  if (Array.isArray(x)) return x.forEach((v, i) => walkData(v, path + '[' + i + ']'));
  if (x && typeof x === 'object') for (const k of Object.keys(x)) walkData(x[k], path + '.' + k + (x.id ? '' : ''));
}
for (const n of names) {
  const v = c[n];
  if (Array.isArray(v)) v.forEach((e, i) => walkData(e, n + '[' + (e && e.id ? e.id : i) + ']'));
  else walkData(v, n);
}
// 2) engine.js、game.js：T('...') 的第一個參數
for (const f of ['js/engine.js', 'js/game.js']) {
  const src = fs.readFileSync(root + '/' + f, 'utf8');
  const lines = src.split('\n');
  walk.simple(acorn.parse(src, { ecmaVersion: 2022, locations: true }), {
    CallExpression(n) {
      if (n.callee.type === 'Identifier' && n.callee.name === 'T' && n.arguments[0] && n.arguments[0].type === 'Literal')
        add(n.arguments[0].value, f + ':' + n.loc.start.line + ' ' + lines[n.loc.start.line - 1].trim().slice(0, 160));
    }
  });
}
const arr = [...out.entries()].map(([zh, ctx]) => ({ zh, ctx }));
fs.writeFileSync(process.argv[3], JSON.stringify(arr, null, 1));
console.log('strings', arr.length, 'chars', arr.reduce((a, x) => a + x.zh.length, 0));
