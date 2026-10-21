import { C } from './ui.mjs';

// Pixel art as character maps: one char per pixel, '.' is transparent.
const BASE = { K: C.ink, E: C.ink, S: C.ink, W: '#ffffff', P: '#f7a8b8', p: '#d9677d', H: '#f4d58d', B: '#ff8fa3', Y: C.yellow, O: C.orange, G: '#b9a7b3', T: '#ff9a76', C: '#7ee0d6', L: '#06c755' };

export const COW = [
  '.....HH......HH.....',
  '....KHHKKKKKKHHK....',
  '...KWWWWSSSWWWWWK...',
  '.KKKWWWWSWWWWWWWKKK.',
  'KPPKWWWWWWWWWWWWKPPK',
  '.KKKWEEWWWWWWEEWKKK.',
  '...KWEEWWWWWWEEWK...',
  '...KBBWWWWWWWWBBK...',
  '...KWPPPPPPPPPPWK...',
  '...KPPpPPPPPPpPPK...',
  '...KPPPPPPPPPPPPK...',
  '....KPPPPPPPPPPK....',
  '.....KKKKYYKKKK.....',
  '........KYYK........',
  '........KKKK........',
];

export const ICONS = {
  web: [
    'KKKKKKKKKKK',
    'KOOOOOOOOOK',
    'KKKKKKKKKKK',
    'KWWWWWWWWWK',
    'KWKKKWWWWWK',
    'KWWWWWWWWWK',
    'KWKKKKKWWWK',
    'KWWWWWWWWWK',
    'KKKKKKKKKKK',
  ],
  line: [
    '..KKKKKKK..',
    '.KLLLLLLLK.',
    'KLLLLLLLLLK',
    'KLWLLWLLWLK',
    'KLLLLLLLLLK',
    '.KLLLLLLLK.',
    '..KKKLKKK..',
    '....KLK....',
    '.....K.....',
  ],
  mail: [
    'KKKKKKKKKKK',
    'KKWWWWWWWKK',
    'KWKWWWWWKWK',
    'KWWKWWWKWWK',
    'KWWWKKKWWWK',
    'KWWWWWWWWWK',
    'KWWWWWWWWWK',
    'KKKKKKKKKKK',
  ],
  cat: [
    '.K.......K.',
    '.KK.....KK.',
    '.KKKKKKKKK.',
    'KKKKKKKKKKK',
    'KKWKKKKKWKK',
    'KKKKKKKKKKK',
    'KKKKKWKKKKK',
    '.KKKKKKKKK.',
    '..KK...KK..',
    '..K.....K..',
  ],
  tv: [
    '..K......K..',
    '...K....K...',
    '....K..K....',
    'KKKKKKKKKKKK',
    'KPPPPPPPPKOK',
    'KPWPPPPPPKKK',
    'KPPPPPPPPKOK',
    'KPPPPPPPPKKK',
    'KKKKKKKKKKKK',
    '.KK......KK.',
  ],
  cube: [
    '.....KK.....',
    '...KKYYKK...',
    '.KKYYYYYYKK.',
    'KYYYYYYYYYYK',
    'KKKYYYYYYKKK',
    'KOOKKYYKKTTK',
    'KOOOOKKTTTTK',
    'KOOOOOKTTTTK',
    'KOOOOOKTTTTK',
    '.KKOOOKTTKK.',
    '...KKOKKK...',
    '.....KK.....',
  ],
  sneaker: [
    '......KKK.....',
    '.....KWWWK....',
    '....KWOWWK....',
    '..KKWOWWWWKK..',
    '.KWWWWWWWWWWK.',
    'KWWOOOOOWWWWWK',
    'KKKKKKKKKKKKKK',
    '.KGGGGGGGGGGK.',
  ],
  pin: [
    '.KKKKK.',
    'KOOOOOK',
    'KOOWOOK',
    'KOOOOOK',
    '.KOOOK.',
    '..KOK..',
    '...K...',
  ],
  trophy: [
    'K.KKK.K',
    'KKYYYKK',
    '.KYYYK.',
    '..KYK..',
    '...K...',
    '..KKK..',
  ],
};

/** Render a char map at (x, y). `classes` maps a palette key to a CSS class (e.g. eyes → blink). */
export function sprite(map, { x = 0, y = 0, scale = 1, palette = {}, classes = {} } = {}) {
  const pal = { ...BASE, ...palette };
  const paths = {};
  map.forEach((row, ry) => {
    let run = 0;
    let key = null;
    const flush = (end) => {
      if (!key || key === '.') return;
      const px = x + (end - run) * scale;
      (paths[key] ??= []).push(`M${px} ${y + ry * scale}h${run * scale}v${scale}h${-run * scale}z`);
    };
    for (let rx = 0; rx <= row.length; rx++) {
      const ch = row[rx];
      if (ch === key) { run++; continue; }
      flush(rx);
      key = ch;
      run = 1;
    }
  });
  return Object.entries(paths)
    .map(([k, d]) => `<path d="${d.join('')}" fill="${pal[k] ?? C.ink}"${classes[k] ? ` class="${classes[k]}"` : ''}/>`)
    .join('');
}

export const spriteSize = (map, scale = 1) => ({ w: map[0].length * scale, h: map.length * scale });
