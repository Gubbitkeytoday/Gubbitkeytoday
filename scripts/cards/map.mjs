import { C, LINES, svgDoc, text, sign } from '../lib/ui.mjs';

const W = 840;
const H = 372;
const TRACK_X0 = 206;
const TRACK_X1 = 816;
const slotX = (slot) => 236 + slot * 108;
const lineY = (i) => 104 + i * 70;

function badge(key, y) {
  const line = LINES[key];
  return `<rect x="20" y="${y - 19}" width="166" height="38" rx="19" fill="${line.color}"/>
<circle cx="39" cy="${y}" r="13" fill="#fff"/>${text(39, y + 5, key, { size: 14, weight: 800, fill: line.color, anchor: 'middle' })}
${text(60, y - 2, line.name, { size: 12, weight: 700, fill: '#fff' })}
${text(60, y + 12, line.th, { size: 10.5, fill: '#fff', extra: ' opacity=".9"' })}`;
}

export function map({ profile }) {
  const keys = Object.keys(LINES);
  const y = Object.fromEntries(keys.map((k, i) => [k, lineY(i)]));
  const onLine = (k) => profile.stations.filter((s) => s.line === k || s.also === k);

  let tracks = '';
  let trains = '';
  let shuttleCss = '';
  keys.forEach((k, i) => {
    const color = LINES[k].color;
    const xs = onLine(k).map((s) => slotX(s.slot));
    const a = Math.min(...xs);
    const b = Math.max(...xs);
    tracks += `${badge(k, y[k])}
<line x1="${TRACK_X0}" y1="${y[k]}" x2="${TRACK_X1}" y2="${y[k]}" stroke="${color}" stroke-width="9" stroke-linecap="round" opacity=".25"/>
<line x1="${a}" y1="${y[k]}" x2="${b}" y2="${y[k]}" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
    const dur = 6 + i * 1.3;
    shuttleCss += `@keyframes sh${k}{to{transform:translateX(${b - a}px)}}`;
    trains += `<g class="shuttle" style="animation-name:sh${k};animation-duration:${dur}s;animation-delay:-${i * 1.7}s">
  <rect x="${a - 13}" y="${y[k] - 7}" width="26" height="14" rx="7" fill="#fff" stroke="${color}" stroke-width="2.5"/>
  <circle cx="${a - 5}" cy="${y[k]}" r="2" fill="${color}"/><circle cx="${a + 1}" cy="${y[k]}" r="2" fill="${color}"/><circle cx="${a + 7}" cy="${y[k]}" r="2" fill="${color}"/>
</g>`;
  });

  let stations = '';
  let interchanges = 0;
  for (const s of profile.stations) {
    const x = slotX(s.slot);
    const color = LINES[s.line].color;
    if (s.also) {
      interchanges++;
      const y1 = Math.min(y[s.line], y[s.also]);
      const y2 = Math.max(y[s.line], y[s.also]);
      stations += `<rect x="${x - 12}" y="${y1 - 12}" width="24" height="${y2 - y1 + 24}" rx="12" fill="#fff" stroke="${C.ink}" stroke-width="3"/>
<circle cx="${x}" cy="${y1}" r="4" fill="${C.ink}"/><circle cx="${x}" cy="${y2}" r="4" fill="${C.ink}"/>
${text(x + 20, (y1 + y2) / 2 + 4, s.name, { size: 12.5, weight: 700 })}
${text(x, y2 + 27, s.code, { size: 10, weight: 700, fill: color, anchor: 'middle' })}`;
    } else {
      stations += `<circle cx="${x}" cy="${y[s.line]}" r="8" fill="#fff" stroke="${color}" stroke-width="4"/>
${text(x, y[s.line] - 17, s.name, { size: 12.5, weight: 700, anchor: 'middle' })}
${text(x, y[s.line] + 25, s.code, { size: 10, weight: 700, fill: color, anchor: 'middle' })}`;
    }
  }

  const css = `
  .shuttle{animation:shuttle 6s ease-in-out infinite alternate}
  ${shuttleCss}`;

  const body = `${sign(4, 4, W - 8, H - 12)}
<path d="M4 18a14 14 0 0 1 14-14h${W - 36}a14 14 0 0 1 14 14v38h-${W - 8}z" fill="${C.ink}"/>
${text(26, 39, 'SYSTEM MAP', { size: 18, weight: 800, fill: '#fff', extra: ' letter-spacing="2"' })}
${text(190, 39, 'แผนผังเส้นทาง', { size: 13, fill: '#cfcac3' })}
${text(W - 26, 38, `${profile.stations.length} stations · ${keys.length} lines · ${interchanges} interchanges`, { size: 11.5, fill: '#cfcac3', anchor: 'end' })}
${tracks}${trains}${stations}`;

  return svgDoc({
    w: W, h: H, css, body,
    title: `System map — ${keys.map((k) => `${LINES[k].name}: ${onLine(k).map((s) => s.name).join(', ')}`).join('; ')}`,
  });
}
