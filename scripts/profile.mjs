// Everything the cards say lives here. Edit, then run `node scripts/build.mjs preview`
// (that also rewrites README.md, so commit both).
// LED text (board name + ticker) only supports A-Z, a-z, 0-9 and simple punctuation.

export const profile = {
  user: 'Gubbitkeytoday',
  repoBranch: 'output',

  board: {
    name: 'm0oMoo',
    platform: 'PLATFORM 01',
    ticker: 'FULL-STACK ENGINEER ✦ SYSTEMS ARCHITECT ✦ RUST/WASM ✦ REAL-TIME ✦ MCP ✦ BANGKOK < > HUA HIN ✦ OPEN FOR CO-OP ✦ ',
  },

  tickets: [
    { id: 'web', from: 'PORTFOLIO', to: 'gubbitkeytoday.github.io', icon: 'globe', color: '#ff5c38', href: 'https://gubbitkeytoday.github.io/Profile/' },
    { id: 'line', from: 'LINE', to: 'chat with me', icon: 'chat', color: '#06c755', href: 'https://line.me/ti/p/UzaC-aQ75C' },
    { id: 'mail', from: 'EMAIL', to: 'pushilkun@gmail.com', icon: 'mail', color: '#7b3fa0', href: 'mailto:pushilkun@gmail.com' },
    { id: 'github', from: 'MAIN ACCOUNT', to: '@GitBababoo', icon: 'code', color: '#1c1c1e', href: 'https://github.com/GitBababoo' },
  ],

  // `slot` is the column on the system map (0-5); stations sharing a slot on
  // neighbouring lines become interchanges. `also` adds the station to another line.
  stations: [
    { code: 'A1', line: 'A', slot: 0, repo: 'prism64', name: 'PRISM64', desc: ['64-shade personality engine:', 'HEXACO × MBTI + Gemini MCP'], stack: ['JavaScript', 'MCP', 'Canvas'] },
    { code: 'A2', line: 'A', slot: 1, repo: 'khuiai-fullstack', name: 'Khui AI', desc: ['Thai AI character chat with', 'SSE streaming & fallbacks'], stack: ['Next.js', 'Prisma', 'SSE'] },
    { code: 'T1', line: 'T', slot: 1, also: 'W', repo: 'tha-metro-mini-3d', name: 'Metro Mini 3D', live: 'https://metro.itstom.me', desc: ['Bangkok rail in 3D: 10 lines,', '193 stations from real GTFS'], stack: ['TypeScript', 'Three.js', 'Rust/Wasm'] },
    { code: 'T2', line: 'T', slot: 3, also: 'A', repo: 'bkk-transit', name: 'BKK Transit', desc: ['GTFS routing + live map, with', 'MCP tools for AI trip planning'], stack: ['Python', 'FastAPI', 'MCP'] },
    { code: 'W1', line: 'W', slot: 0, repo: 'arom-specialty-coffee', name: 'ARÓM Coffee', live: 'https://gubbitkeytoday.github.io/arom-specialty-coffee/', desc: ['bilingual roastery site,', '0 axe-core violations'], stack: ['HTML', 'CSS', 'a11y'] },
    { code: 'W2', line: 'W', slot: 2, repo: 'ruedu-flower-atelier', name: 'RUEDU Atelier', desc: ['flower shop with a bouquet', 'builder & ambient audio'], stack: ['HTML', 'Web Audio'] },
    { code: 'W3', line: 'W', slot: 3, repo: 'kansou', name: 'Kansou 感想', live: 'https://gubbitkeytoday.github.io/kansou/', desc: ['anime & movie watchlist with', 'ratings and a mood picker'], stack: ['TypeScript', 'PWA'] },
    { code: 'W4', line: 'W', slot: 4, repo: 'wildclimb', name: 'WildClimb', live: 'https://gubbitkeytoday.github.io/wildclimb/', desc: ['mouse-to-dragon browser game,', '203 species, 12 languages'], stack: ['JavaScript', 'Canvas', 'Game'] },
    { code: 'W5', line: 'W', slot: 5, repo: 'hbd-3d-craft', name: 'HBD 3D Craft', live: 'https://happy-birthday-ployy.vercel.app', desc: ['3D birthday card creator with', 'cinematic rendering'], stack: ['Three.js', 'WebGL'] },
    { code: 'S1', line: 'S', slot: 1, repo: 'diskwhy', name: 'DiskWhy', desc: ['why is my disk full? analyzer', '+ MCP so Claude can clean up'], stack: ['Rust', 'Tauri', 'MCP'] },
    { code: 'S2', line: 'S', slot: 3, repo: 'discord-rich-presence-pro', name: 'Discord RPC Pro', desc: ['YouTube & VS Code presence', 'via Windows media controls'], stack: ['Python', 'WinRT'] },
    { code: 'S3', line: 'S', slot: 5, repo: 'aerocontrol', name: 'AeroControl', live: 'https://aerocontrol.vercel.app', desc: ['low-latency remote desktop', 'over WebRTC + NVENC'], stack: ['Next.js', 'WebRTC'] },
  ],

  ridership: {
    title: 'RIDERSHIP',
    th: 'สถิติการเดินทาง',
  },

  endOfLine: {
    title: 'End of the line — thanks for riding',
    th: 'สถานีปลายทาง · ขอบคุณที่แวะมา',
    quote: 'please mind the gap ✦ measure first, ship zero bloat',
  },
};
