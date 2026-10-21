import { pixelText, measure } from './font.mjs';

// Bangkok-at-dusk palette shared by every card.
export const C = {
  ink: '#2b1d2e',
  paper: '#fff8f0',
  cream: '#fff1e2',
  orange: '#ff5c38',
  orangeSoft: '#ffd9cc',
  peach: '#ffb38a',
  yellow: '#ffcc4d',
  muted: '#8a6f7d',
  dash: '#ecd3c4',
  plum: '#5b3a8c',
  lilac: '#c9b6e4',
  teal: '#2ec4b6',
};

export const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BASE_CSS = `
  .blink{transform-box:fill-box;transform-origin:center;animation:blink 5s infinite}
  @keyframes blink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
  .bob{animation:bob 1.6s steps(2) infinite}
  @keyframes bob{50%{transform:translateY(-3px)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

/** Wrap a card body in a standalone, accessible SVG document. */
export function svgDoc({ w, h, title, body, defs = '', css = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" shape-rendering="crispEdges">
<title>${esc(title)}</title>
<style>${BASE_CSS}${css}</style>
<defs>${defs}</defs>
${body}
</svg>\n`;
}

/** Card frame: cream body, ink outline, hard orange shadow offset to the bottom right. */
export function frame(x, y, w, h, { fill = C.paper, shadow = C.orange, r = 16, stroke = 3 } = {}) {
  return `<rect x="${x + 7}" y="${y + 7}" width="${w}" height="${h}" rx="${r}" fill="${shadow}" stroke="${C.ink}" stroke-width="${stroke}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.ink}" stroke-width="${stroke}" shape-rendering="geometricPrecision"/>`;
}

/** Section tab that sits on the top edge of a frame. */
export function tab(x, y, label, { fill = C.orange, scale = 3 } = {}) {
  const w = measure(label, scale) + 28;
  const h = 7 * scale + 18;
  return `<rect x="${x + 4}" y="${y + 4}" width="${w}" height="${h}" rx="8" fill="${C.ink}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>
${pixelText(label, { x: x + 14, y: y + 9, scale, fill: '#fff', shadow: C.ink, shadowOffset: scale > 2 ? 2 : 1 })}`;
}

/** Small rounded tag such as a tech chip. Returns { svg, w }. */
export function chip(x, y, label, { fill = C.cream, color = C.ink, size = 11 } = {}) {
  const w = Math.round(label.length * size * 0.62 + 16);
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${size + 9}" rx="${(size + 9) / 2}" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"/>
<text x="${x + w / 2}" y="${y + size + 2}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="700" fill="${color}">${esc(label)}</text>`,
  };
}

export const mono = (x, y, str, { size = 13, fill = C.ink, weight = 400, anchor = 'start', extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${extra}>${esc(str)}</text>`;

/** Deterministic PRNG so the skyline doesn't reshuffle on every daily build. */
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
