import { C, svgDoc, frame, tab, mono } from '../lib/ui.mjs';
import { pixelText } from '../lib/font.mjs';
import { sprite, COW } from '../lib/sprite.mjs';

const W = 840;
const H = 276;
const LEVELS = ['#f3e3d9', '#ffc9b5', '#ff9f7d', '#ff6f4a', '#c9361f'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function statBox(x, y, w, label, value) {
  return `<rect x="${x}" y="${y}" width="${w}" height="30" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
${pixelText(label, { x: x + 12, y: y + 8, scale: 2, fill: C.ink })}
${mono(x + w - 12, y + 20, value, { size: 12, weight: 700, fill: C.orange, anchor: 'end' })}`;
}

export function rideLog({ profile, days, stats, today }) {
  const cell = 10;
  const step = 13;
  const x0 = 96;
  const y0 = 110;
  const startDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((days.length + startDow) / 7);

  const cols = Array.from({ length: weeks }, () => []);
  const monthLabels = [];
  let lastMonth = -1;
  let lastLabelCol = -9;
  days.forEach((d, i) => {
    const idx = i + startDow;
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = x0 + col * step;
    const y = y0 + row * step;
    const isToday = d.date === today;
    cols[col].push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${LEVELS[d.level] ?? LEVELS[0]}"${isToday ? ` stroke="${C.orange}" stroke-width="2"` : ''}><title>${d.count} on ${d.date}</title></rect>`);
    const m = Number(d.date.slice(5, 7)) - 1;
    if (m !== lastMonth && row <= 1 && col < weeks - 1) {
      // Skip the tail of a month that started before the window; it would crowd the next label.
      if (Number(d.date.slice(8, 10)) <= 8 && col - lastLabelCol >= 3) {
        monthLabels.push(mono(x, y0 - 10, MONTHS[m], { size: 10, fill: C.muted }));
        lastLabelCol = col;
      }
      lastMonth = m;
    }
  });
  const grid = cols.map((c, i) => `<g class="pop" style="animation-delay:${(i * 0.025).toFixed(3)}s">${c.join('')}</g>`).join('');

  const trackY = 80;
  const sleepers = Array.from({ length: 49 }, (_, i) => `<rect x="${30 + i * 16}" y="${trackY - 2}" width="4" height="9" fill="#cdb4a6"/>`).join('');
  const posts = [160, 320, 470].map((x) => `<rect x="${x}" y="${trackY - 22}" width="3" height="20" fill="${C.ink}"/><rect x="${x - 8}" y="${trackY - 30}" width="19" height="10" rx="2" fill="${C.teal}" stroke="${C.ink}" stroke-width="1.5"/>`).join('');
  const train = `<g class="ride"><g class="bob" style="animation-duration:.5s">
    ${sprite(COW, { x: 6, y: trackY - 30, scale: 1, classes: { E: 'blink' } })}
    <rect x="0" y="${trackY - 17}" width="32" height="14" rx="3" fill="#f7f1ea" stroke="${C.ink}" stroke-width="2"/>
    <rect x="1" y="${trackY - 9}" width="30" height="3" fill="${C.orange}"/>
  </g></g>`;

  const days3 = [[1, 'mon'], [3, 'wed'], [5, 'fri']].map(([r, l]) => mono(52, y0 + r * step + 9, l, { size: 9, fill: C.muted })).join('');
  const legendX = 806 - 5 * 14 - 34;
  const legend = `${mono(legendX - 8, 219, 'less', { size: 9, fill: C.muted, anchor: 'end' })}
${LEVELS.map((c, i) => `<rect x="${legendX + i * 14}" y="210" width="10" height="10" rx="2" fill="${c}"/>`).join('')}
${mono(legendX + 5 * 14 + 2, 219, 'more', { size: 9, fill: C.muted })}
<rect x="52" y="210" width="10" height="10" rx="2" fill="${LEVELS[0]}" stroke="${C.orange}" stroke-width="2"/>${mono(68, 219, 'today', { size: 9, fill: C.muted })}`;

  const bw = 252;
  const boxes = [
    statBox(28, 230, bw, 'TOTAL', String(stats.total)),
    statBox(28 + bw + 13, 230, bw, 'LONGEST', `${stats.longest} day${stats.longest === 1 ? '' : 's'}`),
    statBox(28 + 2 * (bw + 13), 230, bw, 'CURRENT', `${stats.current} day${stats.current === 1 ? '' : 's'}`),
  ].join('');

  const css = `
  .ride{animation:ride 22s linear infinite}
  @keyframes ride{from{transform:translateX(24px)}to{transform:translateX(780px)}}
  .pop{animation:pop .4s steps(2) both}
  @keyframes pop{from{opacity:0}}`;

  const body = `${frame(4, 22, 824, 246)}${tab(24, 4, 'RIDE LOG')}
${mono(806, 46, `@${profile.user} · contributions, last 12 months`, { size: 10, fill: C.muted, anchor: 'end' })}
<rect x="28" y="${trackY + 4}" width="782" height="3" fill="${C.ink}"/>${sleepers}${posts}${train}
${monthLabels.join('')}${days3}${grid}${legend}${boxes}`;

  return svgDoc({ w: W, h: H, title: `Ride log — ${stats.total} contributions in the last year, longest streak ${stats.longest} days, current streak ${stats.current} days`, body, css });
}
