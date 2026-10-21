import { C, svgDoc, frame, tab, mono, chip } from '../lib/ui.mjs';
import { pixelText, measure } from '../lib/font.mjs';
import { sprite, ICONS } from '../lib/sprite.mjs';

const W = 840;
const H = 300;
const CYCLE = 2.5;

function card(q, x, y, w, h) {
  const sw = w - 16;
  const sh = 96;
  const scale = Math.min(9, Math.floor((sw - 18) / measure(q.screen, 1)));
  const badgeW = measure(q.badge, 2) + 34;
  let chips = '';
  let cx = x + 10;
  for (const c of q.chips) {
    const ch = chip(cx, y + 190, c, { size: 9 });
    chips += ch.svg;
    cx += ch.w + 5;
  }
  return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fff" stroke="${C.ink}" stroke-width="2.5"/>
<rect x="${x + 8}" y="${y + 8}" width="${sw}" height="${sh}" rx="6" fill="#140d17"/>
<g class="flicker">${pixelText(q.screen, { x: x + w / 2, y: y + 8 + (sh - 7 * scale) / 2 - 4, scale, fill: C.orange, shadow: '#7a2236', shadowOffset: Math.round(scale / 2), anchor: 'middle' })}</g>
<rect x="${x + 8}" y="${y + 8}" width="${sw}" height="${sh}" rx="6" fill="url(#scan)"/>
<rect x="${x + w - 58}" y="${y + 13}" width="44" height="18" rx="4" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>
${mono(x + w - 36, y + 26, q.year, { size: 11, weight: 700, anchor: 'middle' })}
<rect x="${x + 10}" y="${y + sh - 4}" width="${badgeW}" height="22" rx="5" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2"/>
${sprite(ICONS.trophy, { x: x + 16, y: y + sh + 1, scale: 2 })}
${pixelText(q.badge, { x: x + 34, y: y + sh + 3, scale: 2, fill: C.ink })}
${mono(x + 10, y + 136, q.name, { size: 13, weight: 700 })}
${q.desc.map((line, i) => mono(x + 10, y + 153 + i * 13, line, { size: 10, fill: C.muted })).join('')}
<text x="${x + 10}" y="${y + 182}" font-family="ui-monospace,monospace" font-size="10" font-weight="700" fill="${C.orange}">@ ${q.where}</text>
${chips}`;
}

export function quests({ profile }) {
  const items = profile.quests.items;
  const gap = 14;
  const w = Math.floor((788 - gap * (items.length - 1)) / items.length);
  const h = 216;
  const y = 58;
  const period = items.length * CYCLE;

  const cards = items.map((q, i) => {
    const x = 22 + i * (w + gap);
    const delay = i === 0 ? 0 : -(period - i * CYCLE);
    return `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="13" fill="none" stroke="${C.orange}" stroke-width="3" class="slot" style="animation-delay:${delay}s"/>${card(q, x, y, w, h)}`;
  }).join('');

  const css = `
  .slot{opacity:0;animation:slot ${period}s infinite}
  @keyframes slot{0%,${(100 / items.length - 0.01).toFixed(2)}%{opacity:1}${(100 / items.length).toFixed(2)}%,100%{opacity:0}}
  .flicker{animation:flicker 4s steps(1) infinite}
  @keyframes flicker{92%{opacity:.6}95%{opacity:1}97%{opacity:.75}}`;
  const defs = `<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#fff" opacity=".07"/></pattern>`;

  const body = `${frame(4, 22, 824, 270)}${tab(24, 4, 'QUEST LOG')}
${mono(806, 46, profile.quests.more, { size: 10, fill: C.muted, anchor: 'end' })}
${cards}`;
  return svgDoc({ w: W, h: H, title: `Quest log — ${items.map((q) => q.name).join(', ')}`, body, css, defs });
}
