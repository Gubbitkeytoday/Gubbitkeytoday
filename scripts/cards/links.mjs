import { C, svgDoc, mono } from '../lib/ui.mjs';
import { pixelText } from '../lib/font.mjs';
import { sprite, ICONS, spriteSize } from '../lib/sprite.mjs';

const W = 214;
const H = 64;

export function links(link) {
  const icon = ICONS[link.icon];
  const size = spriteSize(icon, 3);
  const body = `
<rect x="7" y="7" width="${W - 10}" height="${H - 10}" rx="12" fill="${C.ink}"/>
<rect x="3" y="3" width="${W - 10}" height="${H - 10}" rx="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="3" shape-rendering="geometricPrecision"/>
<rect x="11" y="10" width="42" height="40" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
<g class="bob" style="animation-duration:2.4s">${sprite(icon, { x: 32 - size.w / 2, y: 30 - size.h / 2, scale: 3 })}</g>
${pixelText(link.label, { x: 63, y: 15, scale: 2, fill: C.orange, shadow: C.orangeSoft, shadowOffset: 1 })}
${mono(63, 44, link.sub, { size: Math.min(11, +(136 / (link.sub.length * 0.61)).toFixed(1)), weight: 700 })}`;
  return svgDoc({ w: W, h: H, title: `${link.label} — ${link.sub}`, body });
}
