// 扁平風圓形頭像（圓底、圓臉、西裝）
let avatarSeq = 0;

function avatar(o) {
  const id = 'av' + (avatarSeq++);
  const skin = o.skin || '#f6d7bd', skinD = '#e8c2a3', ink = '#2a2a2a';
  const hc = o.hairColor || '#22252c';
  const back = {
    bob: `<path d="M34 58 Q34 28 60 28 Q86 28 86 58 L86 84 Q80 90 74 84 L74 60 L46 60 L46 84 Q40 90 34 84 Z" fill="${hc}"/>`,
    long: `<path d="M33 58 Q33 26 60 26 Q87 26 87 58 L90 100 Q76 104 72 96 L72 62 L48 62 L48 96 Q44 104 30 100 Z" fill="${hc}"/>`,
    bun: `<circle cx="60" cy="27" r="9" fill="${hc}"/>`
  }[o.hair] || '';
  const hair = {
    slick: `<path d="M38 56 Q34 28 60 28 Q86 28 82 56 Q80 42 70 39 Q58 44 44 41 Q39 46 38 56 Z" fill="${hc}"/>`,
    side: `<path d="M38 58 Q33 27 62 28 Q87 30 82 58 Q79 41 66 37 Q52 43 40 47 Z" fill="${hc}"/>`,
    short: `<path d="M38 54 Q36 30 60 30 Q84 30 82 54 Q78 40 60 38 Q42 40 38 54 Z" fill="${hc}"/>`,
    thin: `<path d="M37 62 Q35 42 44 37 L45 57 Z M83 62 Q85 42 76 37 L75 57 Z" fill="${hc}"/><path d="M44 37 Q60 30 76 37" stroke="${hc}" stroke-width="3" fill="none"/>`,
    bob: `<path d="M37 56 Q37 30 60 30 Q83 30 83 56 Q76 40 58 40 Q46 42 37 56 Z" fill="${hc}"/>`,
    long: `<path d="M37 56 Q37 30 60 30 Q83 30 83 56 Q72 38 52 40 Q42 44 37 56 Z" fill="${hc}"/>`,
    bun: `<path d="M38 54 Q38 32 60 32 Q82 32 82 54 Q74 40 60 40 Q46 40 38 54 Z" fill="${hc}"/>`
  }[o.hair] || '';
  const neckwear = o.tie
    ? `<path d="M50 90 L60 108 L70 90 Z" fill="#fff"/><path d="M57 92 L63 92 L62 98 L65 112 L60 117 L55 112 L58 98 Z" fill="${o.tie}"/>`
    : `<path d="M50 90 L60 104 L70 90 Z" fill="${o.inner || '#fff'}"/>`;
  const glasses = o.glasses
    ? `<g stroke="${ink}" stroke-width="1.6" fill="none"><circle cx="52" cy="58" r="6"/><circle cx="68" cy="58" r="6"/><path d="M58 58 L62 58"/></g>` : '';
  const mood = o.mood || 'smile';
  const mouth = {
    smile: `<path d="M54 68 Q60 72 66 68" stroke="${ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    big: `<path d="M53 67 Q60 76 67 67 Z" fill="${ink}"/>`,
    sad: `<path d="M54 71 Q60 66 66 71" stroke="${ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    flat: `<path d="M55 69 L65 69" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>`
  }[mood];
  const sweat = mood === 'sad' ? `<path d="M80 44 Q83 50 80 52 Q77 50 80 44 Z" fill="#7ec3f0"/>` : '';
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><clipPath id="${id}"><circle cx="60" cy="60" r="58"/></clipPath></defs>
  <g clip-path="url(#${id})"><circle cx="60" cy="60" r="58" fill="${o.bg || '#f1eeea'}"/>
  ${back}
  <rect x="52" y="74" width="16" height="18" fill="${skinD}"/>
  <path d="M16 122 Q20 96 46 89 L74 89 Q100 96 104 122 Z" fill="${o.suit || '#2c3550'}"/>
  ${neckwear}
  <path d="M46 89 L56 106 M74 89 L64 106" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>
  <circle cx="40" cy="59" r="4" fill="${skinD}"/><circle cx="80" cy="59" r="4" fill="${skinD}"/>
  <ellipse cx="60" cy="56" rx="20" ry="23" fill="${skin}"/>
  ${hair}
  <circle cx="52" cy="58" r="2" fill="${ink}"/><circle cx="68" cy="58" r="2" fill="${ink}"/>
  ${glasses}${mouth}${sweat}
  </g></svg>`;
}
