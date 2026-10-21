import { C, svgDoc, text, sign, esc, SANS } from '../lib/ui.mjs';

const W = 840;
const H = 246;
const HEAT = ['#ebe6df', '#ffd5c7', '#ffa184', '#ff6f4a', '#d9401f'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const LANG = { TypeScript: '#3178c6', JavaScript: '#e8c930', Python: '#3572a5', Rust: '#dea584', HTML: '#e34c26', Astro: '#ff5a03', CSS: '#663399' };

export function ridership({ profile, days, stats, repos, today }) {
  const rp = profile.ridership;
  const year = today.slice(0, 4);

  const figures = [
    [String(stats.thisYear), `commits in ${year}`],
    [`${stats.longest}`, 'day longest streak'],
    [String(repos.length), 'public projects'],
  ].map(([n, label], i) => {
    const y = 104 + i * 44;
    return `${text(26, y, n, { size: 30, weight: 800, fill: C.brand })}${text(26 + [...n].reduce((w, ch) => w + (ch === '1' ? 12 : 18.5), 0) + 10, y - 2, label, { size: 12.5, fill: C.muted })}`;
  }).join('');

  const pitch = 10;
  const x0 = 272;
  const y0 = 82;
  const startDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  let dots = '';
  let labels = '';
  let lastLabelCol = -9;
  days.forEach((d, i) => {
    const idx = i + startDow;
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const cx = x0 + col * pitch + pitch / 2;
    const cy = y0 + row * pitch + pitch / 2;
    dots += `<circle cx="${cx}" cy="${cy}" r="${d.date === today ? 4.6 : 3.8}" fill="${HEAT[d.level] ?? HEAT[0]}"${d.date === today ? ` stroke="${C.ink}" stroke-width="1.5" class="pulse"` : ''}/>`;
    if (Number(d.date.slice(8, 10)) === 1 && col - lastLabelCol >= 3) {
      labels += text(x0 + col * pitch, y0 - 7, MONTHS[Number(d.date.slice(5, 7)) - 1], { size: 9.5, fill: C.muted });
      lastLabelCol = col;
    }
  });

  const counts = {};
  for (const r of repos) if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalLang = langs.reduce((s, [, n]) => s + n, 0) || 1;
  const barW = 530;
  let bx = x0;
  let bar = '';
  let legend = '';
  langs.forEach(([name, n], i) => {
    const w = (n / totalLang) * barW;
    bar += `<rect x="${bx}" y="168" width="${w}" height="12" fill="${LANG[name] ?? '#a8a29e'}"/>`;
    bx += w;
    const lx = x0 + (i % 3) * 178;
    const ly = 202 + Math.floor(i / 3) * 18;
    legend += `<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${LANG[name] ?? '#a8a29e'}"/><text x="${lx + 15}" y="${ly}" font-family="${SANS}" font-size="11.5" font-weight="600" fill="${C.ink}">${esc(name)}<tspan dx="6" font-weight="400" fill="${C.muted}">${n} repo${n === 1 ? '' : 's'}</tspan></text>`;
  });

  const body = `${sign(4, 4, W - 8, H - 12)}
<path d="M4 18a14 14 0 0 1 14-14h${W - 36}a14 14 0 0 1 14 14v38h-${W - 8}z" fill="${C.ink}"/>
${text(26, 39, rp.title, { size: 18, weight: 800, fill: '#fff', extra: ' letter-spacing="2"' })}
${text(150, 39, rp.th, { size: 13, fill: '#cfcac3' })}
${text(W - 26, 38, `@${profile.user} · last 12 months`, { size: 11.5, fill: '#cfcac3', anchor: 'end' })}
${figures}
<line x1="250" y1="76" x2="250" y2="214" stroke="${C.rule}" stroke-width="1.5"/>
${labels}${dots}
<clipPath id="bar"><rect x="${x0}" y="168" width="${barW}" height="12" rx="6"/></clipPath>
<g clip-path="url(#bar)">${bar}</g>
${legend}`;

  return svgDoc({
    w: W, h: H, body,
    title: `Ridership — ${stats.thisYear} commits in ${year}, longest streak ${stats.longest} days, ${repos.length} public projects. Languages: ${langs.map(([n, c]) => `${n} ${c}`).join(', ')}`,
  });
}
