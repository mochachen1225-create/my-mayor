// 把程式裡的中文字串包成 T('...', 參數...)；HTML 標籤留在外面
const acorn = require('acorn'), walk = require('acorn-walk'), fs = require('fs');
const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 2022 });
const CJK = /[一-鿿]/;
const targets = [];
walk.ancestor(ast, {
  Literal(node, anc) {
    if (typeof node.value !== 'string' || !CJK.test(node.value)) return;
    const p = anc[anc.length - 2];
    if (p && p.type === 'Property' && p.key === node) return;
    if (p && p.type === 'CallExpression' && p.callee.type === 'Identifier' && p.callee.name === 'T' && p.arguments[0] === node) return;
    targets.push(node);
  },
  TemplateLiteral(node, anc) {
    const p = anc[anc.length - 2];
    if (p && p.type === 'TaggedTemplateExpression') return;
    if (node.quasis.some(q => CJK.test(q.value.raw))) targets.push(node);
  }
});
targets.sort((a, b) => a.start - b.start);
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
function rewrite(start, end) {
  let out = '', pos = start;
  for (const t of targets) {
    if (t.start < pos || t.end > end) continue;
    out += src.slice(pos, t.start) + gen(t);
    pos = t.end;
  }
  return out + src.slice(pos, end);
}
// 把一串「文字＋插值」切成 HTML 標籤和文字節點，中文的文字節點包成 T
function genParts(parts, asTemplate) {
  // parts: [{text}] 或 [{expr}]
  let flat = '', exprs = [];
  for (const p of parts) {
    if (p.text !== undefined) flat += p.text;
    else { flat += '\u0000' + exprs.length + '\u0000'; exprs.push(p.expr); }
  }
  const restore = s => s.replace(/\u0000(\d+)\u0000/g, (m, i) => '${' + exprs[+i] + '}');
  const pieces = flat.split(/(<[^>]*>)/);
  let out = '';
  for (const piece of pieces) {
    if (piece.startsWith('<') || !CJK.test(piece)) { out += restore(piece); continue; }
    const m = piece.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const args = [];
    const body = m[2].replace(/\u0000(\d+)\u0000/g, (mm, i) => '{' + (args.push(exprs[+i]) - 1) + '}');
    out += m[1] + '${T(' + [q(body)].concat(args).join(', ') + ')}' + m[3];
  }
  return out;
}
function gen(node) {
  if (node.type === 'Literal') {
    const v = node.value;
    if (!/<[^>]*>/.test(v)) {
      const m = v.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!m[1] && !m[3]) return 'T(' + q(v) + ')';
    }
    // 含 HTML 或前後空白：改成樣板字串
    return '`' + genParts([{ text: v.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') }]) + '`';
  }
  const parts = [];
  node.quasis.forEach((qq, i) => {
    parts.push({ text: qq.value.raw });
    if (i < node.expressions.length) { const e = node.expressions[i]; parts.push({ expr: rewrite(e.start, e.end) }); }
  });
  return '`' + genParts(parts) + '`';
}
const result = rewrite(0, src.length);
fs.writeFileSync(process.argv[3] || file, result);
console.log(file, 'wrapped', targets.length);
