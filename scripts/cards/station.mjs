import { C, LINES, svgDoc, text, sign, pill, timeAgo } from '../lib/ui.mjs';

const W = 412;
const H = 172;

/** One station sign per project. The README wraps each in a link to its demo or repo. */
export function station(s, { repos, date }) {
  const line = LINES[s.line];
  const repo = repos.find((r) => r.name === s.repo);
  const updated = repo ? `updated ${timeAgo(repo.pushed_at, date)}` : '';

  const codeBadges = `<circle cx="30" cy="26" r="15" fill="#fff"/>${text(30, 31, s.code, { size: 12.5, weight: 800, fill: line.color, anchor: 'middle' })}` +
    (s.also ? `<circle cx="54" cy="26" r="11" fill="${LINES[s.also].color}" stroke="#fff" stroke-width="2.5"/>${text(54, 30, s.also, { size: 10, weight: 800, fill: '#fff', anchor: 'middle' })}` : '');
  const nameX = s.also ? 74 : 54;

  const status = s.live
    ? `<rect x="${W - 112}" y="13" width="96" height="24" rx="12" fill="#fff"/><circle cx="${W - 98}" cy="25" r="4.5" fill="#22c55e" class="pulse"/>${text(W - 89, 29.5, 'LIVE DEMO', { size: 10.5, weight: 800, fill: C.ink, extra: ' letter-spacing=".8"' })}`
    : `<rect x="${W - 92}" y="13" width="76" height="24" rx="12" fill="none" stroke="#fff" stroke-width="1.8"/>${text(W - 54, 29.5, 'SOURCE', { size: 10.5, weight: 800, fill: '#fff', anchor: 'middle', extra: ' letter-spacing=".8"' })}`;

  let chips = '';
  let cx = 20;
  for (const tag of s.stack) {
    const p = pill(cx, 132, tag, { fill: C.panel });
    chips += p.svg;
    cx += p.w + 6;
  }

  const css = `.nudge{animation:nudge 1.8s ease-in-out infinite}@keyframes nudge{50%{transform:translateX(4px)}}`;
  const body = `${sign(4, 4, W - 8, H - 12)}
<path d="M4 18a14 14 0 0 1 14-14h${W - 36}a14 14 0 0 1 14 14v34h-${W - 8}z" fill="${line.color}"/>
${codeBadges}
${text(nameX, 24, line.name, { size: 11.5, weight: 700, fill: '#fff' })}
${text(nameX, 39, line.th, { size: 10, fill: '#fff', extra: ' opacity=".9"' })}
${status}
${text(20, 84, s.name, { size: 21, weight: 800 })}
${text(W - 20, 82, updated, { size: 10, fill: C.muted, anchor: 'end' })}
${s.desc.map((l, i) => text(20, 104 + i * 16, l, { size: 12.5, fill: C.muted })).join('')}
${chips}
<g class="nudge"><circle cx="${W - 34}" cy="141" r="13" fill="${line.color}"/><path d="M${W - 40} 141h11m-4.5-5 5 5-5 5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  return svgDoc({ w: W, h: H, title: `${s.code} ${s.name} — ${s.desc.join(' ')} (${s.stack.join(', ')})`, body, css });
}
