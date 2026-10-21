import { C, LINES, svgDoc, text, mono, timeAgo, SANS } from '../lib/ui.mjs';
import { ledPath, measure } from '../lib/font.mjs';

const W = 840;
const H = 292;
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function status(iso, now) {
  const days = (now - new Date(iso)) / 864e5;
  if (days < 3) return { label: 'BOARDING', fill: C.green, blink: true };
  if (days < 30) return { label: 'ON TIME', fill: C.amber };
  return { label: 'DEPARTED', fill: '#8a847c' };
}

const lineDot = (x, y, key) => {
  const line = LINES[key];
  return `<circle cx="${x}" cy="${y}" r="9" fill="${line ? line.color : '#3a3a3a'}"/>${text(x, y + 4, line ? key : '–', { size: 10.5, weight: 700, fill: '#fff', anchor: 'middle' })}`;
};

export function board({ profile, repos, date }) {
  const b = profile.board;
  const lineOf = Object.fromEntries(profile.stations.map((s) => [s.repo, s.line]));
  const dateLabel = `${DAYS[date.getUTCDay()]} ${String(date.getUTCDate()).padStart(2, '0')} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

  const namePitch = 10;
  const tickPitch = 4;
  const tickW = Math.ceil(measure(b.ticker, tickPitch));

  const lines = Object.entries(LINES).map(([key], i) => lineDot(612 + i * 26, 118, key)).join('');

  const rows = repos.slice(0, 3).map((r, i) => {
    const y = 226 + i * 22;
    const st = status(r.pushed_at, date);
    return `${lineDot(46, y - 4, lineOf[r.name])}
${mono(70, y, r.name, { size: 13, weight: 700, fill: C.amber })}
${mono(430, y, timeAgo(r.pushed_at, date), { size: 12, fill: '#d9cbb3' })}
<g${st.blink ? ' class="blink"' : ''}>${mono(794, y, st.label, { size: 12, weight: 700, fill: st.fill, anchor: 'end' })}</g>`;
  }).join('');

  const css = `
  .tick{animation:tick ${(tickW / 55).toFixed(1)}s linear infinite}
  @keyframes tick{to{transform:translateX(-${tickW}px)}}
  .blink{animation:blink 1s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  .colon{animation:blink 2s steps(1) infinite}`;

  const defs = `
  <pattern id="led" width="${namePitch}" height="${namePitch}" patternUnits="userSpaceOnUse"><circle cx="${namePitch / 2}" cy="${namePitch / 2}" r="${namePitch * 0.38}" fill="${C.ledOff}"/></pattern>
  <pattern id="led2" width="${tickPitch}" height="${tickPitch}" patternUnits="userSpaceOnUse"><circle cx="${tickPitch / 2}" cy="${tickPitch / 2}" r="${tickPitch * 0.38}" fill="${C.ledOff}"/></pattern>
  <filter id="glow" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="tickClip"><rect x="24" y="150" width="792" height="34" rx="4"/></clipPath>`;

  const bolts = [[16, 16], [W - 16, 16], [16, H - 16], [W - 16, H - 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#3d3d3d"/>`).join('');

  const body = `
<rect x="2" y="4" width="${W - 4}" height="${H - 6}" rx="18" fill="#000" opacity=".25"/>
<rect x="2" y="2" width="${W - 4}" height="${H - 6}" rx="18" fill="${C.board}" stroke="${C.boardEdge}" stroke-width="3"/>
${bolts}
${text(28, 36, `${b.platform} · ชานชาลา 1`, { size: 12, weight: 700, fill: C.amber, extra: ' letter-spacing="1.5"' })}
${mono(W - 28, 36, dateLabel, { size: 12, weight: 700, fill: C.amber, anchor: 'end', extra: ' letter-spacing="1"' })}
<rect x="24" y="48" width="792" height="94" rx="6" fill="#0b0b0b"/>
<rect x="24" y="48" width="792" height="94" rx="6" fill="url(#led)"/>
<path d="${ledPath(b.name, 40, 60, namePitch)}" fill="${C.amber}" filter="url(#glow)"/>
${text(612 - 9, 84, 'SERVING LINES', { size: 10, weight: 700, fill: '#b8a98f', extra: ' letter-spacing="1.5"' })}
${lines}
<rect x="24" y="150" width="792" height="34" rx="4" fill="#0b0b0b"/>
<rect x="24" y="150" width="792" height="34" rx="4" fill="url(#led2)"/>
<g clip-path="url(#tickClip)"><g class="tick" filter="url(#glow)"><path d="${ledPath(b.ticker, 30, 153, tickPitch)}${ledPath(b.ticker, 30 + tickW, 153, tickPitch)}" fill="${C.amber}"/></g></g>
<line x1="28" y1="196" x2="812" y2="196" stroke="#2c2c2c" stroke-width="1.5"/>
<g font-family="${SANS}">${['LINE', 'DESTINATION · ปลายทาง', 'LAST PUSH', 'STATUS'].map((h, i) => text([32, 70, 430, 794][i], 210, h, { size: 9.5, weight: 700, fill: '#8a7f6e', anchor: i === 3 ? 'end' : 'start', extra: ' letter-spacing="1.2"' })).join('')}</g>
${rows}`;

  const latest = repos.slice(0, 3).map((r) => r.name).join(', ');
  return svgDoc({ w: W, h: H, title: `${b.name} — departure board. Latest pushes: ${latest}`, body, css, defs });
}
