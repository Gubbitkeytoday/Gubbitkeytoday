import { C, svgDoc, rng } from '../lib/ui.mjs';
import { pixelText, measure } from '../lib/font.mjs';
import { sprite, COW } from '../lib/sprite.mjs';

const W = 840;
const H = 300;

// Thai seasons: cool Nov-Feb, hot Mar-May, rainy Jun-Oct. Redrawn daily so the sky follows.
export function season(date) {
  const m = date.getUTCMonth() + 1;
  if (m >= 11 || m <= 2) return 'cool';
  if (m <= 5) return 'hot';
  return 'rainy';
}

const SKY = {
  cool: ['#3b2f6b', '#8f5fa8', '#f59e8b'],
  hot: ['#6b3fa0', '#e0698a', '#ffc078'],
  rainy: ['#3f4470', '#7d6f9e', '#d79f9a'],
};

function pixelCircle(cx, cy, radius, step, fill) {
  let d = '';
  for (let y = -radius; y < radius; y += step) {
    const half = Math.floor(Math.sqrt(radius * radius - (y + step / 2) ** 2) / step) * step;
    d += `M${cx - half} ${cy + y}h${half * 2}v${step}h${-half * 2}z`;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

function cloud(x, y, s, fill) {
  return `<path d="M${x + 3 * s} ${y}h${6 * s}v${s}h${2 * s}v${s}h${s}v${2 * s}h${-14 * s}v${-s}h${s}v${-s}h${3 * s}z" fill="${fill}"/>`;
}

function skyline(r) {
  const far = [];
  const near = [];
  const lights = [];
  let x = 10;
  while (x < W) {
    const w = 26 + Math.floor(r() * 30);
    const h = 40 + Math.floor(r() * 70);
    far.push(`M${x} ${232 - h}h${w}v${h}h${-w}z`);
    x += w + 4;
  }
  x = -6;
  let i = 0;
  while (x < W) {
    i++;
    if (i === 5) {
      // a stepped temple prang between the towers
      const base = 232;
      let d = '';
      [[0, 40, 10], [6, 28, 18], [10, 20, 26], [14, 12, 36], [17, 6, 46], [19, 2, 58]].forEach(([dx, w, top]) => {
        d += `M${x + dx} ${base - top}h${w}v${top}h${-w}z`;
      });
      near.push(d);
      x += 46;
      continue;
    }
    const w = 30 + Math.floor(r() * 34);
    const h = 30 + Math.floor(r() * (i === 9 ? 120 : 64));
    near.push(`M${x} ${232 - h}h${w}v${h}h${-w}z`);
    for (let wy = 232 - h + 8; wy < 222; wy += 12) {
      for (let wx = x + 6; wx < x + w - 6; wx += 10) {
        if (r() < 0.32) lights.push({ x: wx, y: wy, d: (r() * 6).toFixed(1) });
      }
    }
    x += w + 6;
  }
  return { far: far.join(''), near: near.join(''), lights };
}

function trainCar(x, { front = false, cow = false } = {}) {
  const w = 128;
  let s = `<rect x="${x}" y="0" width="${w}" height="44" rx="${front ? 0 : 6}" fill="#f7f1ea" stroke="${C.ink}" stroke-width="3"/>`;
  if (front) s += `<path d="M${x + w - 2} 2h14v8h8v32h-22z" fill="#f7f1ea" stroke="${C.ink}" stroke-width="3"/><rect x="${x + w + 12}" y="12" width="8" height="10" fill="#9fd8f0" stroke="${C.ink}" stroke-width="2"/>`;
  s += `<rect x="${x + 2}" y="28" width="${w - 4}" height="7" fill="${C.orange}"/>`;
  s += `<rect x="${x + 2}" y="35" width="${w - 4}" height="3" fill="#2a9d8f"/>`;
  const windows = cow ? [10, 82] : [10, 46, 82];
  for (const wx of windows) s += `<rect x="${x + wx}" y="7" width="28" height="16" rx="2" fill="#ffe8a3" stroke="${C.ink}" stroke-width="2"/>`;
  if (cow) {
    s += `<rect x="${x + 40}" y="4" width="40" height="22" rx="2" fill="#9fd8f0" stroke="${C.ink}" stroke-width="2"/>`;
    s += `<g class="bob" style="animation-duration:.8s">${sprite(COW, { x: x + 40, y: -14, scale: 2, classes: { E: 'blink' } })}</g>`;
  }
  for (const wx of [14, w - 30]) s += `<rect x="${x + wx}" y="42" width="16" height="8" rx="3" fill="${C.ink}"/>`;
  return s;
}

export function header({ profile, date }) {
  const r = rng(42);
  const se = season(date);
  const [top, mid, bot] = SKY[se];
  const city = skyline(r);

  const stars = Array.from({ length: 26 }, () => ({ x: Math.floor(r() * 820) + 10, y: Math.floor(r() * 110) + 14, d: (r() * 4).toFixed(1) }))
    .filter((s) => !(s.x < 480 && s.y < 175));
  const rain = se === 'rainy'
    ? Array.from({ length: 46 }, () => `<rect x="${Math.floor(r() * 860)}" y="${-20 - Math.floor(r() * 240)}" width="2" height="12" fill="#cfd8ff" opacity=".55" class="drop" style="animation-delay:-${(r() * 1.2).toFixed(2)}s"/>`).join('')
    : '';

  const titleScale = 10;
  const title = pixelText(profile.title, { x: 44, y: 34, scale: titleScale, fill: C.paper, shadow: C.ink, shadowOffset: 6 });
  const tagScale = 3;
  const tagW = measure(profile.tagline, tagScale);
  const label = `${se.toUpperCase()} SEASON`;

  const css = `
  .tw{animation:twinkle 3s steps(2) infinite}
  @keyframes twinkle{50%{opacity:.15}}
  .lit{animation:lit 6s steps(1) infinite}
  @keyframes lit{70%{opacity:.25}}
  .drift{animation:drift 60s linear infinite}
  .drift2{animation:drift 90s linear infinite}
  @keyframes drift{from{transform:translateX(-160px)}to{transform:translateX(900px)}}
  .train{animation:ride 13s linear infinite}
  @keyframes ride{from{transform:translateX(-470px)}to{transform:translateX(880px)}}
  .rattle{animation:bob .35s steps(2) infinite}
  .drop{animation:rain 1.2s linear infinite}
  @keyframes rain{to{transform:translate(-40px,320px)}}
  .wave{animation:wave 2.4s steps(4) infinite}
  @keyframes wave{to{transform:translateX(-48px)}}
  .cursor{animation:cur 1s steps(1) infinite}
  @keyframes cur{50%{opacity:0}}`;

  const defs = `
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
  <linearGradient id="river" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c5a9a"/><stop offset="1" stop-color="#2e2a5a"/></linearGradient>
  <clipPath id="clip"><rect x="4" y="4" width="${W - 16}" height="${H - 16}" rx="18"/></clipPath>
  <clipPath id="type"><rect x="40" y="128" width="0" height="34"><animate attributeName="width" dur="7s" repeatCount="indefinite" calcMode="discrete" keyTimes="${typeTimes(profile.tagline.length)}" values="${typeValues(profile.tagline, tagScale)}"/></rect></clipPath>`;

  const pillars = Array.from({ length: 13 }, (_, i) => `<rect x="${i * 70 + 12}" y="236" width="12" height="26" fill="#3a2a4c"/>`).join('');
  const waves = Array.from({ length: 22 }, (_, i) => `<rect x="${i * 48}" y="${270 + (i % 3) * 7}" width="18" height="3" fill="${i % 2 ? C.peach : '#9b8fd0'}" opacity=".8"/>`).join('');

  const body = `
<rect x="11" y="11" width="${W - 16}" height="${H - 16}" rx="18" fill="${C.orange}" stroke="${C.ink}" stroke-width="3"/>
<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars.map((s) => `<rect x="${s.x}" y="${s.y}" width="3" height="3" fill="#fff" class="tw" style="animation-delay:-${s.d}s"/>`).join('')}
  ${pixelCircle(690, 200, 54, 6, se === 'rainy' ? '#ffb58f' : C.yellow)}
  <g class="drift" opacity=".9">${cloud(80, 60, 6, '#fde2f0')}${cloud(520, 30, 5, '#fde2f0')}</g>
  <g class="drift2" style="animation-delay:-40s" opacity=".7">${cloud(300, 100, 4, '#f6d0ea')}</g>
  <path d="${city.far}" fill="#7a5a9c" opacity=".55"/>
  <path d="${city.near}" fill="#3d2a52"/>
  ${city.lights.map((l) => `<rect x="${l.x}" y="${l.y}" width="4" height="5" fill="#ffd27a" class="lit" style="animation-delay:-${l.d}s"/>`).join('')}
  <rect x="0" y="258" width="${W}" height="${H - 258}" fill="url(#river)"/>
  <g class="wave">${waves}</g>
  ${pillars}
  <rect x="0" y="228" width="${W}" height="10" fill="#4a3660" stroke="${C.ink}" stroke-width="2"/>
  <g class="train"><g transform="translate(0 178)"><g class="rattle">${trainCar(0)}${trainCar(136)}${trainCar(272, { front: true, cow: true })}</g></g></g>
  ${rain}
</g>
<rect x="4" y="4" width="${W - 16}" height="${H - 16}" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>
${title}
<g clip-path="url(#type)">${pixelText(profile.tagline, { x: 46, y: 134, scale: tagScale, fill: C.paper, shadow: C.ink, shadowOffset: 2 })}</g>
<rect x="${46 + tagW + 8}" y="132" width="10" height="23" fill="${C.orange}" stroke="${C.ink}" stroke-width="2" class="cursor"><animate attributeName="x" dur="7s" repeatCount="indefinite" calcMode="discrete" keyTimes="${typeTimes(profile.tagline.length)}" values="${cursorValues(profile.tagline, tagScale)}"/></rect>
${pixelText(label, { x: W - 40, y: 26, scale: 2, fill: C.paper, shadow: C.ink, shadowOffset: 1, anchor: 'end' })}`;

  return svgDoc({ w: W, h: H, title: `${profile.title} — a pixel cow rides a sky train past the Bangkok skyline at dusk`, body, defs, css });
}

// Typewriter: reveal one glyph at a time, hold, then a short blank pause before the loop.
function typeValues(text, scale) {
  const widths = [0];
  for (let i = 1; i <= text.length; i++) widths.push(Math.ceil(measure(text.slice(0, i), scale)) + 10);
  return [...widths, 0].join(';');
}
function cursorValues(text, scale) {
  const xs = [46];
  for (let i = 1; i <= text.length; i++) xs.push(Math.ceil(46 + measure(text.slice(0, i), scale) + 8));
  return [...xs, 46].join(';');
}
function typeTimes(n) {
  const typing = 0.55;
  const steps = Array.from({ length: n + 1 }, (_, i) => +(i * typing / n).toFixed(4));
  return [...steps, 0.9].join(';');
}
