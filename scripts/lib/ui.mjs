// Transit-signage look: white enamel signs, coloured line bands, an amber LED board.
export const C = {
  ink: '#1c1c1e',
  paper: '#ffffff',
  panel: '#f5f2ed',
  rule: '#e4dfd7',
  muted: '#6e6a66',
  brand: '#ff5c38',
  board: '#141414',
  boardEdge: '#2b2b2b',
  ledOff: '#262320',
  amber: '#ffb02e',
  green: '#3ddc84',
};

// One colour per line on the system map.
export const LINES = {
  A: { name: 'AI & MCP Line', th: 'สาย AI', color: '#7b3fa0' },
  T: { name: 'Transit Line', th: 'สายขนส่ง', color: '#2fa84f' },
  W: { name: 'Web & Play Line', th: 'สายเว็บและเกม', color: '#e2457f' },
  S: { name: 'Systems Line', th: 'สายระบบ', color: '#f07a12' },
};

export const SANS = "'Segoe UI','Helvetica Neue',Helvetica,Arial,'Leelawadee UI','Noto Sans Thai',Tahoma,sans-serif";
export const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BASE_CSS = `
  .pulse{animation:pulse 1.6s ease-in-out infinite}
  @keyframes pulse{50%{opacity:.25}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

/** Wrap a card body in a standalone, accessible SVG document. */
export function svgDoc({ w, h, title, body, defs = '', css = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${BASE_CSS}${css}</style>
<defs>${defs}</defs>
${body}
</svg>\n`;
}

/** SVG <text>. `font` defaults to the sans stack. */
export const text = (x, y, str, { size = 13, fill = C.ink, weight = 400, anchor = 'start', font = SANS, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${extra}>${esc(str)}</text>`;

export const mono = (x, y, str, opts = {}) => text(x, y, str, { font: MONO, ...opts });

/** Enamel sign: white panel with a soft drop shadow and hairline border. */
export function sign(x, y, w, h, { fill = C.paper, r = 14 } = {}) {
  return `<rect x="${x}" y="${y + 3}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity=".12"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.rule}" stroke-width="1.5"/>`;
}

/** Rough text width for the sans stack; good enough for layout. */
export const textWidth = (str, size, weight = 400) => [...str].length * size * (weight >= 600 ? 0.58 : 0.53);

/** Pill-shaped tag. Returns { svg, w }. */
export function pill(x, y, label, { fill = C.panel, color = C.ink, size = 10.5, stroke = 'none' } = {}) {
  const w = Math.round(textWidth(label, size, 600) + 16);
  const h = size + 9;
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}"/>
${text(x + w / 2, y + size + 2.5, label, { size, fill: color, weight: 600, anchor: 'middle' })}`,
  };
}

export function timeAgo(iso, now) {
  const days = Math.floor((now - new Date(iso)) / 864e5);
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}
