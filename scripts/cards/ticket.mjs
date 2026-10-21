import { C, svgDoc, text, mono } from '../lib/ui.mjs';

const W = 214;
const H = 80;
const STUB = 58;

const ICONS = {
  globe: (x, y) => `<circle cx="${x}" cy="${y}" r="11"/><ellipse cx="${x}" cy="${y}" rx="4.5" ry="11"/><path d="M${x - 11} ${y}h22M${x - 9} ${y - 6}h18M${x - 9} ${y + 6}h18"/>`,
  chat: (x, y) => `<path d="M${x - 12} ${y - 9}h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-14l-6 5v-5h-4a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3z"/><circle cx="${x - 6}" cy="${y}" r="1.4" fill="#fff"/><circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/><circle cx="${x + 6}" cy="${y}" r="1.4" fill="#fff"/>`,
  mail: (x, y) => `<rect x="${x - 12}" y="${y - 8}" width="24" height="17" rx="2.5"/><path d="M${x - 11} ${y - 6}l11 8 11-8"/>`,
  code: (x, y) => `<path d="M${x - 5} ${y - 8}l-8 8 8 8M${x + 5} ${y - 8}l8 8-8 8M${x + 2.5} ${y - 11}l-5 22"/>`,
};

function barcode(x, y, seed) {
  let s = '';
  let cx = x;
  for (let i = 0; i < 18; i++) {
    const w = ((seed * (i + 3)) % 3) + 1;
    if (i % 2 === 0) s += `<rect x="${cx}" y="${y}" width="${w}" height="12" fill="${C.ink}" opacity=".55"/>`;
    cx += w + 1;
  }
  return s;
}

export function ticket(t, i) {
  const defs = `<mask id="notch"><rect width="${W}" height="${H}" fill="#fff"/><circle cx="${STUB + 4}" cy="4" r="7" fill="#000"/><circle cx="${STUB + 4}" cy="${H - 4}" r="7" fill="#000"/></mask>
  <clipPath id="stub"><rect x="4" y="4" width="${STUB}" height="${H - 8}"/></clipPath>`;
  const css = `.wiggle{transform-box:fill-box;transform-origin:center;animation:wiggle 4s ease-in-out infinite;animation-delay:-${i}s}
  @keyframes wiggle{0%,80%,100%{transform:rotate(0)}85%{transform:rotate(-8deg)}90%{transform:rotate(8deg)}}`;
  const body = `
<g mask="url(#notch)">
  <rect x="4" y="6" width="${W - 8}" height="${H - 8}" rx="10" fill="#000" opacity=".14"/>
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="10" fill="${C.paper}" stroke="${C.rule}" stroke-width="1.5"/>
  <rect x="4" y="4" width="${STUB + 20}" height="${H - 8}" rx="10" fill="${t.color}" clip-path="url(#stub)"/>
</g>
<line x1="${STUB + 4}" y1="12" x2="${STUB + 4}" y2="${H - 12}" stroke="${C.rule}" stroke-width="2" stroke-dasharray="3 4"/>
<g class="wiggle" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[t.icon](4 + STUB / 2, H / 2)}</g>
${text(STUB + 16, 24, 'TICKET TO', { size: 8.5, weight: 700, fill: C.muted, extra: ' letter-spacing="1.4"' })}
${text(STUB + 16, 43, t.from, { size: 15, weight: 800, fill: t.color === C.ink ? C.ink : t.color })}
${mono(STUB + 16, 60, t.to, { size: Math.min(10.5, +(132 / (t.to.length * 0.61)).toFixed(1)), weight: 600 })}
${barcode(W - 52, 14, i + 2)}`;
  return svgDoc({ w: W, h: H, title: `${t.from} — ${t.to}`, body, css, defs });
}
