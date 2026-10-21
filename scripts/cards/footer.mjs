import { C, svgDoc, frame, mono } from '../lib/ui.mjs';
import { pixelText } from '../lib/font.mjs';
import { sprite, COW } from '../lib/sprite.mjs';

const W = 840;
const H = 178;

export function footer({ profile }) {
  const f = profile.footer;
  const railY = 140;
  const sleepers = Array.from({ length: 52 }, (_, i) => `<rect x="${12 + i * 16}" y="${railY + 2}" width="4" height="8" fill="#cdb4a6"/>`).join('');
  const car = (x, cow) => `<rect x="${x}" y="${railY - 18}" width="40" height="16" rx="3" fill="#f7f1ea" stroke="${C.ink}" stroke-width="2"/><rect x="${x + 1}" y="${railY - 9}" width="38" height="3" fill="${C.orange}"/>${cow ? sprite(COW, { x: x + 10, y: railY - 33, scale: 1, classes: { E: 'blink' } }) : `<rect x="${x + 8}" y="${railY - 15}" width="9" height="6" fill="#ffe8a3"/><rect x="${x + 23}" y="${railY - 15}" width="9" height="6" fill="#ffe8a3"/>`}`;
  const sparkles = [[60, 40], [770, 56], [700, 26], [120, 96]].map(([x, y], i) => pixelText('✦', { x, y, scale: 2, fill: i % 2 ? C.orange : C.yellow, cls: 'tw' }).replace('class="tw"', `class="tw" style="animation-delay:-${i * 0.6}s"`)).join('');

  const css = `
  .tw{animation:twinkle 2.4s steps(2) infinite}
  @keyframes twinkle{50%{opacity:.2}}
  .loop{animation:loop 16s linear infinite}
  @keyframes loop{from{transform:translateX(860px)}to{transform:translateX(-140px)}}`;
  const defs = `<clipPath id="fc"><rect x="4" y="8" width="824" height="160" rx="16"/></clipPath>`;

  const body = `${frame(4, 8, 824, 160)}
${pixelText(f.title, { x: 416, y: 34, scale: 5, fill: C.ink, shadow: C.orange, shadowOffset: 3, anchor: 'middle' })}
${mono(416, 96, f.quote, { size: 13, fill: C.muted, anchor: 'middle', extra: ' font-style="italic"' })}
${sparkles}
<g clip-path="url(#fc)">
  <rect x="4" y="${railY + 6}" width="824" height="30" fill="${C.cream}"/>
  <rect x="4" y="${railY}" width="824" height="3" fill="${C.ink}"/>${sleepers}
  <g class="loop"><g class="bob" style="animation-duration:.5s">${car(0, true)}${car(44)}${car(88)}</g></g>
</g>
<rect x="4" y="8" width="824" height="160" rx="16" fill="none" stroke="${C.ink}" stroke-width="3"/>`;

  return svgDoc({ w: W, h: H, title: `${f.title} ${f.quote}`, body, css, defs });
}
