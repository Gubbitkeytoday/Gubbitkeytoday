// Live numbers for the daily cards. Both sources are public and need no token.

async function get(url, accept) {
  const headers = { 'user-agent': 'profile-readme-builder', accept };
  if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com/')) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res;
}

/** Contribution calendar for the last year, parsed from GitHub's public calendar fragment. */
export async function contributions(user) {
  const html = await (await get(`https://github.com/users/${user}/contributions`, 'text/html')).text();
  const cells = new Map();
  const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)) {
    const id = attr(tag, 'id');
    if (id) cells.set(id, { date: attr(tag, 'data-date'), level: Number(attr(tag, 'data-level') ?? 0), count: 0 });
  }
  for (const m of html.matchAll(/<tool-tip[^>]*?for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const cell = cells.get(m[1]);
    const n = m[2].match(/^(\d[\d,]*) contribution/);
    if (cell && n) cell.count = Number(n[1].replace(/,/g, ''));
  }
  const days = [...cells.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) throw new Error('contribution calendar came back empty');
  return days;
}

/**
 * Fallback for when the calendar is empty because commits were made with an email
 * that isn't linked to the account: count commits in the user's own repos instead.
 */
export async function commitCalendar(user, days) {
  const since = `${days[0].date}T00:00:00Z`;
  const repos = await (await get(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`, 'application/vnd.github+json')).json();
  const counts = new Map();
  for (const repo of repos.filter((r) => !r.fork && r.pushed_at >= since)) {
    for (let page = 1; page <= 5; page++) {
      const res = await get(`https://api.github.com/repos/${repo.full_name}/commits?since=${since}&per_page=100&page=${page}`, 'application/vnd.github+json').catch(() => null);
      const commits = res ? await res.json() : [];
      if (!Array.isArray(commits)) break;
      for (const c of commits) {
        const date = bangkokDate(c.commit.author?.date ?? c.commit.committer?.date);
        counts.set(date, (counts.get(date) ?? 0) + 1);
      }
      if (commits.length < 100) break;
    }
  }
  const max = Math.max(1, ...counts.values());
  return days.map((d) => {
    const count = counts.get(d.date) ?? 0;
    return { ...d, count, level: count ? Math.min(4, Math.ceil((count / max) * 4)) : 0 };
  });
}

const bangkokDate = (iso) => new Date(new Date(iso).getTime() + 7 * 3600e3).toISOString().slice(0, 10);

export async function publicRepos(user) {
  const json = await (await get(`https://api.github.com/users/${user}`, 'application/vnd.github+json')).json();
  return json.public_repos;
}

/** Totals and streaks. A zero today doesn't break the current streak until the day is over. */
export function summarize(days, today) {
  const total = days.reduce((s, d) => s + d.count, 0);
  const year = today.slice(0, 4);
  const thisYear = days.filter((d) => d.date.startsWith(year)).reduce((s, d) => s + d.count, 0);

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  let current = 0;
  let i = days.length - 1;
  while (i >= 0 && days[i].date > today) i--;
  if (i >= 0 && days[i].date === today && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;

  return { total, thisYear, longest, current };
}

/** Offline stand-in so `build.mjs preview` still renders without network. */
export function emptyYear(today) {
  const end = new Date(`${today}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
  const days = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ date: d.toISOString().slice(0, 10), level: 0, count: 0 });
  }
  return days;
}
