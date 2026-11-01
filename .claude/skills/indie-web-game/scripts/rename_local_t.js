// 把函式裡宣告了 `const T = …` 的區域變數改名成 TY，避免蓋掉全域翻譯函式 T()
// 只改「名稱是 T」的識別字；T(...) 呼叫、物件屬性 .T、物件 key 都不動
// 用法：node rename_local_t.js js/game.js
const acorn = require('acorn'), walk = require('acorn-walk'), fs = require('fs');
const f = process.argv[2];
let src = fs.readFileSync(f, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 2022 });
const edits = new Set();
walk.ancestor(ast, {
  VariableDeclarator(d, anc) {
    if (d.id.type !== 'Identifier' || d.id.name !== 'T') return;
    edits.add(d.id.start); // 宣告本身（acorn-walk 走訪時不會當成 Identifier）
    const fn = [...anc].reverse().find(a => /Function/.test(a.type));
    if (!fn) return;
    walk.ancestor(fn.body, {
      Identifier(id, a2) {
        if (id.name !== 'T') return; // 一定要檢查名稱，否則會把所有識別字都改壞
        const p = a2[a2.length - 2];
        if (p && p.type === 'CallExpression' && p.callee === id) return;
        if (p && p.type === 'MemberExpression' && p.property === id && !p.computed) return;
        if (p && p.type === 'Property' && p.key === id && !p.shorthand) return;
        edits.add(id.start);
      }
    });
  }
});
[...edits].sort((a, b) => b - a).forEach(s => { src = src.slice(0, s) + 'TY' + src.slice(s + 1); });
fs.writeFileSync(f, src);
console.log(f, 'renamed', edits.size);
