// 語言：zh（繁體中文）或 en（English）
// 先看玩家選過的；在 itch.io 上一律先英文；其他地方看瀏覽器語言（中文介面 → 中文，其他 → 英文）
const LANG_KEY = 'mymayor.lang';
const LANG = (() => {
  try { const s = localStorage.getItem(LANG_KEY); if (s === 'zh' || s === 'en') return s; } catch (e) { /* 沒差 */ }
  if (/(^|\.)(itch\.io|itch\.zone|hwcdn\.net)$/i.test(location.hostname)) return 'en';
  return /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
})();
const I18N = { en: {} }; // 英文對照表由 js/i18n.en.js 填入：{ 中文原文: 英文 }
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// T('還有 {0} 件', n)：翻譯並代入參數；{M0} 代表「第 0 個參數當月份名稱」（英文用）
function T(s, ...args) {
  let out = LANG === 'en' && I18N.en[s] !== undefined ? I18N.en[s] : s;
  if (args.length) {
    out = out.replace(/\{M(\d+)\}/g, (m, i) => MONTHS_EN[args[+i] - 1] || args[+i])
      .replace(/\{(\d+)\}/g, (m, i) => (args[+i] !== undefined ? args[+i] : m));
  }
  return out;
}

function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* 沒差 */ }
  location.reload();
}

// 把資料裡的中文字串換成英文（只換對照表裡有的；函式、數字不動）
function translateDeep(x) {
  if (typeof x === 'string') return I18N.en[x] !== undefined ? I18N.en[x] : x;
  if (Array.isArray(x)) { for (let i = 0; i < x.length; i++) x[i] = translateDeep(x[i]); return x; }
  if (x && typeof x === 'object' && !(x instanceof Set) && !(x instanceof Date)) {
    for (const k of Object.keys(x)) x[k] = translateDeep(x[k]);
  }
  return x;
}
