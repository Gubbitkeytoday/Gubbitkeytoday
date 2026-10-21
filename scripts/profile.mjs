// Everything the cards say lives here. Edit, then run `node scripts/build.mjs preview`.
// Pixel-font fields (title, screen, tab labels) only support A-Z, a-z, 0-9 and simple punctuation.

export const profile = {
  user: 'Gubbitkeytoday',
  title: 'm0oMoo',
  tagline: 'full-stack & real-time',

  links: [
    { id: 'web', label: 'PORTFOLIO', sub: 'gubbitkeytoday.github.io', icon: 'web', href: 'https://gubbitkeytoday.github.io/Profile/' },
    { id: 'line', label: 'LINE', sub: 'chat with me', icon: 'line', href: 'https://line.me/ti/p/UzaC-aQ75C' },
    { id: 'mail', label: 'EMAIL', sub: 'pushilkun@gmail.com', icon: 'mail', href: 'mailto:pushilkun@gmail.com' },
    { id: 'github', label: 'MAIN ACCT', sub: '@GitBababoo', icon: 'cat', href: 'https://github.com/GitBababoo' },
  ],

  status: {
    name: 'm0oMoo',
    home: 'BANGKOK',
    rows: [
      ['CLASS', 'full-stack ✦ systems architect'],
      ['BASE', 'Bangkok & Hua Hin, Thailand'],
      ['FOCUS', 'rust/wasm · real-time · MCP'],
    ],
    // LV = shipped production builds. XP = contributions this calendar year toward the goal.
    level: 18,
    xpGoal: 1000,
    inventory: [
      { id: 'rust', label: 'rust', bg: '#1f1a1a', fg: '#f4a261', text: 'RS' },
      { id: 'ts', label: 'typescript', bg: '#3178c6', fg: '#ffffff', text: 'TS' },
      { id: 'react', label: 'react', bg: '#20232a', fg: '#61dafb', atom: true },
      { id: 'next', label: 'next.js', bg: '#000000', fg: '#ffffff', text: 'N', round: true },
      { id: 'py', label: 'python', bg: '#3776ab', fg: '#ffd43b', text: 'PY' },
      { id: 'three', label: 'three.js', bg: '#ffffff', fg: '#000000', tri: true },
    ],
  },

  quests: {
    more: '+ more on gubbitkeytoday.github.io/Profile',
    href: 'https://gubbitkeytoday.github.io/Profile/',
    items: [
      { screen: 'RAIL', year: '2026', badge: 'LIVE', name: 'Metro Mini 3D', desc: ['bangkok rail in 3d,', '193 stations, gtfs'], where: 'metro.itstom.me', chips: ['TS', 'Rust', 'Three.js'] },
      { screen: 'BKK', year: '2026', badge: 'MCP SERVER', name: 'BKK Transit', desc: ['transit routing +', 'mcp for ai agents'], where: 'bkk-transit', chips: ['Python', 'FastAPI'] },
      { screen: 'DISK', year: '2026', badge: 'SHIPPED', name: 'DiskWhy', desc: ['why is my disk full?', 'windows analyzer'], where: 'diskwhy', chips: ['Rust', 'Tauri'] },
      { screen: 'WILD', year: '2026', badge: 'PLAYABLE', name: 'WildClimb', desc: ['mouse to dragon,', '203 species'], where: 'github.io/wildclimb', chips: ['JS', 'Game'] },
    ],
  },

  sideQuests: [
    { icon: 'tv', title: 'ANIME NIGHTS', sub: 'rating every episode' },
    { icon: 'cube', title: '3D CRAFTING', sub: 'three.js gifts & scenes' },
    { icon: 'sneaker', title: 'SNEAKER RADAR', sub: 'watching snkrs drops' },
  ],

  // `live: 'repos'` is filled in from the GitHub API at build time.
  saveFile: [
    { value: '100', sub: 'lighthouse perf', icon: 'trophy' },
    { value: '0', sub: 'axe-core violations', icon: 'heart' },
    { value: '18', sub: 'shipped builds', icon: 'star' },
    { live: 'repos', sub: 'public repos & counting', icon: 'play' },
  ],

  footer: {
    title: 'thanks for riding by ~',
    quote: '"measure first, ship zero bloat."',
  },
};
