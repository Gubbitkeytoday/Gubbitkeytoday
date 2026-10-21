// node scripts/build.mjs           → writes every card to dist/
// node scripts/build.mjs preview   → same, plus preview/index.html laid out like the GitHub README
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { profile } from './profile.mjs';
import { contributions, commitCalendar, publicRepos, summarize, emptyYear } from './lib/data.mjs';
import { header } from './cards/header.mjs';
import { links } from './cards/links.mjs';
import { status } from './cards/status.mjs';
import { quests } from './cards/quests.mjs';
import { sideQuests, saveFile } from './cards/extras.mjs';
import { rideLog } from './cards/ridelog.mjs';
import { footer } from './cards/footer.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);

// Bangkok time decides what "today" is, whatever timezone the runner uses.
const now = new Date(Date.now() + 7 * 3600e3);
const today = now.toISOString().slice(0, 10);

let days;
let repos;
try {
  [days, repos] = await Promise.all([contributions(profile.user), publicRepos(profile.user)]);
  if (!days.some((d) => d.count)) {
    console.warn('contribution calendar is empty, counting commits in owned repos instead');
    days = await commitCalendar(profile.user, days);
  }
} catch (err) {
  if (process.env.CI) throw err;
  console.warn(`offline? using placeholder numbers (${err.message})`);
  days = emptyYear(today);
  repos = 0;
}
const stats = summarize(days, today);
const ctx = { profile, date: now, today, days, stats, repos };

const cards = {
  'header.svg': header(ctx),
  'status.svg': status(ctx),
  'quests.svg': quests(ctx),
  'side-quests.svg': sideQuests(ctx),
  'save-file.svg': saveFile(ctx),
  'ride-log.svg': rideLog(ctx),
  'footer.svg': footer(ctx),
  ...Object.fromEntries(profile.links.map((l) => [`link-${l.id}.svg`, links(l)])),
};

await mkdir(dist, { recursive: true });
for (const [name, svg] of Object.entries(cards)) await writeFile(new URL(name, dist), svg);
console.log(`built ${Object.keys(cards).length} cards for ${today} · ${stats.total} contributions · ${repos} repos`);

if (process.argv.includes('preview')) {
  // Point the README at the local files and drop it in a GitHub-ish dark page.
  const readme = (await readFile(new URL('README.md', root), 'utf8'))
    .replace(/https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/output\//g, '../dist/')
    .replace(/<!--[\s\S]*?-->/g, '');
  const html = `<!doctype html><meta charset="utf-8"><title>profile preview</title>
<style>body{background:#0d1117;color:#e6edf3;font:14px system-ui;margin:0;padding:32px 16px}
main{max-width:860px;margin:auto;border:1px solid #30363d;border-radius:8px;padding:24px}
img{max-width:100%;vertical-align:top}a{color:#4493f8}</style>
<main>${readme}</main>`;
  await mkdir(new URL('preview/', root), { recursive: true });
  await writeFile(new URL('preview/index.html', root), html);
  console.log('preview → preview/index.html');
}
