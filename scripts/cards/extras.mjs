import { C, svgDoc, frame, tab, mono } from '../lib/ui.mjs';
import { pixelText } from '../lib/font.mjs';
import { sprite, ICONS, spriteSize } from '../lib/sprite.mjs';

const W = 412;
const H = 218;

const CSS = `
  .tw{animation:twinkle 2.6s steps(2) infinite}
  @keyframes twinkle{50%{opacity:.25}}
  .hop{animation:hop 3s steps(1) infinite}
  @keyframes hop{0%,80%{transform:translateY(0)}85%{transform:translateY(-4px)}90%{transform:translateY(0)}}`;

const PLAY = ['KKKKKKK', 'KOOOOOK', 'KOWOOOK', 'KOWWOOK', 'KOWOOOK', 'KOOOOOK', 'KKKKKKK'];

export function sideQuests({ profile }) {
  const rows = profile.sideQuests.map((q, i) => {
    const y = 52 + i * 52;
    const icon = ICONS[q.icon];
    const s = spriteSize(icon, 3);
    return `
<rect x="22" y="${y}" width="44" height="44" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
<g class="hop" style="animation-delay:-${i}s">${sprite(icon, { x: 44 - s.w / 2, y: y + 22 - s.h / 2, scale: 3 })}</g>
${pixelText(q.title, { x: 80, y: y + 6, scale: 3, fill: C.ink })}
${mono(81, y + 41, q.sub, { size: 10, fill: C.muted })}`;
  }).join('');
  const body = `${frame(4, 22, 396, 186)}${tab(24, 4, 'SIDE QUESTS')}${rows}
${pixelText('✦', { x: 372, y: 120, scale: 2, fill: C.orange, cls: 'tw' })}`;
  return svgDoc({ w: W, h: H, title: `Side quests — ${profile.sideQuests.map((q) => q.title.toLowerCase()).join(', ')}`, body, css: CSS });
}

function badge(kind, x, y) {
  if (kind === 'trophy') return sprite(ICONS.trophy, { x, y, scale: 3 });
  if (kind === 'heart') return pixelText('♥', { x, y, scale: 3, fill: '#ff6f91' });
  if (kind === 'star') return pixelText('✦', { x, y, scale: 3, fill: C.yellow, shadow: C.ink, shadowOffset: 1 });
  return sprite(PLAY, { x, y, scale: 3 });
}

export function saveFile({ profile, repos }) {
  const boxes = profile.saveFile.map((s, i) => {
    const x = 20 + (i % 2) * 188;
    const y = 50 + Math.floor(i / 2) * 80;
    const value = s.live === 'repos' ? String(repos) : s.value;
    return `
<rect x="${x}" y="${y}" width="176" height="70" rx="9" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
${pixelText(value, { x: x + 12, y: y + 12, scale: 4, fill: C.orange, shadow: C.orangeSoft, shadowOffset: 2 })}
<g class="tw" style="animation-delay:-${i * 0.7}s">${badge(s.icon, x + 144, y + 10)}</g>
${mono(x + 12, y + 58, s.sub, { size: 10, fill: C.muted })}`;
  }).join('');
  const body = `${frame(4, 22, 396, 186)}${tab(24, 4, 'SAVE FILE')}${boxes}`;
  const summary = profile.saveFile.map((s) => `${s.live === 'repos' ? repos : s.value} ${s.sub}`).join(' · ');
  return svgDoc({ w: W, h: H, title: `Save file — ${summary}`, body, css: CSS });
}
