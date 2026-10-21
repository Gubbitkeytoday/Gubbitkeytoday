import { C, svgDoc, frame, tab, mono } from '../lib/ui.mjs';
import { pixelText, measure } from '../lib/font.mjs';
import { sprite, COW, ICONS } from '../lib/sprite.mjs';

const W = 840;
const H = 262;
const LABEL_X = 214;
const VALUE_X = 390;
const CYCLE = 2; // seconds each inventory item stays highlighted

function tile(item, x, y, s = 34) {
  const cx = x + s / 2;
  const cy = y + s / 2;
  let g = item.round
    ? `<circle cx="${cx}" cy="${cy}" r="${s / 2}" fill="${item.bg}" stroke="${C.ink}" stroke-width="2" shape-rendering="geometricPrecision"/>`
    : `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="6" fill="${item.bg}" stroke="${C.ink}" stroke-width="2"/>`;
  if (item.text) {
    const scale = item.text.length > 1 ? 2 : 3;
    g += pixelText(item.text, { x: cx, y: cy - 3.5 * scale, scale, fill: item.fg, anchor: 'middle' });
  }
  if (item.atom) {
    g += [0, 60, 120].map((a) => `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="4.5" fill="none" stroke="${item.fg}" stroke-width="1.6" transform="rotate(${a} ${cx} ${cy})" shape-rendering="geometricPrecision"/>`).join('');
    g += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="${item.fg}"/>`;
  }
  if (item.tri) {
    g += `<path d="M${x + 7} ${y + 27}L${x + 12} ${y + 7}L${x + 27} ${y + 22}Z M${x + 9.5} ${y + 17}L${x + 19.5} ${y + 14.5}L${x + 17} ${y + 24.5}" fill="none" stroke="${item.fg}" stroke-width="1.8" stroke-linejoin="round" shape-rendering="geometricPrecision"/>`;
  }
  return g;
}

export function status({ profile, stats, today }) {
  const st = profile.status;
  const inv = st.inventory;
  const period = inv.length * CYCLE;
  const pct = Math.min(100, Math.round((stats.thisYear / st.xpGoal) * 100));
  const year = today.slice(0, 4);

  const rowsY = [54, 90, 126];
  const rows = st.rows.map(([label, value], i) => `
${pixelText(label, { x: LABEL_X, y: rowsY[i], scale: 3, fill: C.muted })}
${mono(VALUE_X, rowsY[i] + 17, value, { size: 15, weight: 600 })}
<line x1="${LABEL_X}" y1="${rowsY[i] + 29}" x2="806" y2="${rowsY[i] + 29}" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 5"/>`).join('');

  const lvY = 162;
  const lvText = `LV.${st.level}`;
  const barX = VALUE_X + measure(lvText, 4) + 22;
  const barW = 806 - barX;
  const level = `
${pixelText('LEVEL', { x: LABEL_X, y: lvY, scale: 3, fill: C.muted })}
${pixelText(lvText, { x: VALUE_X, y: lvY - 3, scale: 4, fill: C.orange, shadow: C.orangeSoft, shadowOffset: 2 })}
<rect x="${barX}" y="${lvY - 2}" width="${barW}" height="16" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
<rect x="${barX + 3}" y="${lvY + 1}" width="${Math.max(6, (barW - 6) * pct / 100)}" height="10" rx="5" fill="${C.orange}" class="xp"/>
${mono(barX, lvY + 30, `${stats.thisYear} contributions in ${year} · goal ${st.xpGoal}`, { size: 10, fill: C.muted })}
${mono(806, lvY + 30, `${pct}%`, { size: 10, fill: C.orange, weight: 700, anchor: 'end' })}`;

  const invY = 200;
  const tiles = inv.map((item, i) => {
    const x = VALUE_X + i * 44;
    const delay = i === 0 ? 0 : -(period - i * CYCLE);
    return `<g class="slot" style="animation-delay:${delay}s"><rect x="${x - 4}" y="${invY - 4}" width="42" height="42" rx="9" fill="none" stroke="${C.orange}" stroke-width="3"/></g>${tile(item, x, invY)}`;
  }).join('');
  const bubbleX = VALUE_X + inv.length * 44 + 16;
  const bubble = `
<path d="M${bubbleX} ${invY + 17}l-9 0" stroke="${C.ink}" stroke-width="2"/>
<rect x="${bubbleX}" y="${invY + 2}" width="${806 - bubbleX}" height="30" rx="15" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
${inv.map((item, i) => `<g class="slot" style="animation-delay:${i === 0 ? 0 : -(period - i * CYCLE)}s">${mono((bubbleX + 806) / 2, invY + 22, item.label, { size: 13, weight: 700, anchor: 'middle' })}</g>`).join('')}`;

  const avatar = `
<defs><linearGradient id="av" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3d3"/><stop offset="1" stop-color="${C.lilac}"/></linearGradient></defs>
<rect x="26" y="46" width="164" height="190" rx="14" fill="url(#av)" stroke="${C.ink}" stroke-width="3"/>
<g class="bob">${sprite(COW, { x: 58, y: 66, scale: 5, classes: { E: 'blink' } })}</g>
${pixelText('✦', { x: 166, y: 56, scale: 2, fill: C.yellow, cls: 'tw' })}
${pixelText(st.name, { x: 108, y: 158, scale: 3, fill: C.ink, anchor: 'middle' })}
<line x1="44" y1="190" x2="172" y2="190" stroke="${C.ink}" stroke-width="2" stroke-dasharray="4 4" opacity=".35"/>
${sprite(ICONS.pin, { x: 108 - (measure(st.home, 2) + 26) / 2, y: 202, scale: 2 })}
${pixelText(st.home, { x: 108 - (measure(st.home, 2) + 26) / 2 + 26, y: 204, scale: 2, fill: C.ink })}`;

  const css = `
  .slot{opacity:0;animation:slot ${period}s infinite}
  @keyframes slot{0%,${(100 / inv.length - 0.01).toFixed(2)}%{opacity:1}${(100 / inv.length).toFixed(2)}%,100%{opacity:0}}
  .xp{transform-box:fill-box;transform-origin:left;animation:grow 1.8s steps(14) both}
  @keyframes grow{from{transform:scaleX(0)}}
  .tw{animation:twinkle 2.4s steps(2) infinite}
  @keyframes twinkle{50%{opacity:.2}}`;

  const body = `${frame(4, 22, 824, 226)}${tab(24, 4, 'STATUS')}${avatar}${rows}${level}
${pixelText('INVENTORY', { x: LABEL_X, y: invY + 7, scale: 3, fill: C.muted })}
${tiles}${bubble}`;

  const summary = `Status — ${st.rows.map(([k, v]) => `${k.toLowerCase()}: ${v}`).join(' · ')} · level ${st.level} · inventory: ${inv.map((i) => i.label).join(', ')}`;
  return svgDoc({ w: W, h: H, title: summary, body, css });
}
