import { C, LINES, svgDoc, text, sign } from '../lib/ui.mjs';

const W = 840;
const H = 156;

export function endLine({ profile }) {
  const e = profile.endOfLine;
  const colors = Object.values(LINES).map((l) => l.color);
  const strip = colors.map((c, i) => `<rect x="4" y="${4 + i * 33}" width="12" height="33" fill="${c}"/>`).join('');
  const car = (x, front) => `<rect x="${x}" y="40" width="${front ? 70 : 64}" height="30" rx="${front ? 15 : 6}" fill="#fff" stroke="${C.ink}" stroke-width="2.5"/>
<rect x="${x + 2}" y="58" width="${front ? 66 : 60}" height="5" fill="${C.brand}"/>
<rect x="${x + 10}" y="46" width="16" height="9" rx="2" fill="#bfe3f5"/><rect x="${x + 32}" y="46" width="16" height="9" rx="2" fill="#bfe3f5"/>`;

  const css = `
  .depart{animation:depart 7s ease-in infinite}
  @keyframes depart{0%,35%{transform:translateX(0);opacity:1}90%{transform:translateX(300px);opacity:0}100%{transform:translateX(300px);opacity:0}}`;
  const defs = `<pattern id="hazard" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="16" fill="#ffd200"/><rect x="8" width="8" height="16" fill="${C.ink}"/></pattern>
  <clipPath id="sc"><rect x="4" y="4" width="${W - 8}" height="${H - 12}" rx="14"/></clipPath>
  <clipPath id="track"><rect x="560" y="20" width="262" height="70"/></clipPath>`;

  const body = `${sign(4, 4, W - 8, H - 12)}
<g clip-path="url(#sc)">${strip}<rect x="4" y="${H - 30}" width="${W - 8}" height="22" fill="url(#hazard)"/></g>
${text(40, 48, e.title, { size: 22, weight: 800 })}
${text(40, 74, e.th, { size: 14.5, fill: C.muted })}
${text(40, 104, e.quote, { size: 12, fill: C.brand, weight: 600, extra: ' letter-spacing=".5"' })}
<line x1="560" y1="74" x2="820" y2="74" stroke="${C.ink}" stroke-width="3"/>
<g clip-path="url(#track)"><g class="depart">${car(570)}${car(638)}${car(706, true)}</g></g>
${text(W - 24, H - 40, 'MIND THE GAP', { size: 10, weight: 800, fill: C.ink, anchor: 'end', extra: ' letter-spacing="2"' })}`;

  return svgDoc({ w: W, h: H, title: `${e.title}. ${e.quote}`, body, css, defs });
}
