#!/usr/bin/env node
/**
 * Generates the profile stat cards as static SVGs in assets/.
 *
 * Why this exists: the usual hosted stat-card services (github-readme-stats and
 * friends) sit behind shared Vercel projects that return 503 or 402 once their
 * quota is spent, so the images silently disappear from the profile. These SVGs
 * are committed to the repo and served by GitHub itself, so they always render.
 *
 * Usage: GITHUB_TOKEN=<token> node .github/scripts/generate-stats.mjs
 *
 * A classic PAT with `repo` + `read:user` includes private repositories and
 * private contribution counts. The workflow's default GITHUB_TOKEN sees public
 * data only, which is a valid, quieter card.
 */

const LOGIN = process.env.STATS_LOGIN || 'kimzam30';
const TOKEN = process.env.GITHUB_TOKEN;
const INCLUDE_PRIVATE = process.env.STATS_INCLUDE_PRIVATE !== 'false';
const TOP_N = 7;

if (!TOKEN) {
  console.error('GITHUB_TOKEN is required');
  process.exit(1);
}

const THEMES = {
  light: {
    surface: '#fcfcfb', border: '#e4e4e0', panel: '#f4f4f1',
    text: '#0b0b0b', secondary: '#52514e', muted: '#8a8984',
    empty: '#e9e9e6', other: '#b8b7b2',
    heat: ['#b7d3f6', '#86b6ef', '#3987e5', '#1c5cab'],
    bars: ['#1c5cab', '#256abf', '#2a78d6', '#3987e5', '#5598e7', '#6da7ec', '#86b6ef'],
  },
  dark: {
    surface: '#1a1a19', border: '#32322f', panel: '#232321',
    text: '#ffffff', secondary: '#c3c2b7', muted: '#8b8a82',
    empty: '#2b2b28', other: '#4d4d48',
    heat: ['#184f95', '#256abf', '#3987e5', '#86b6ef'],
    bars: ['#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#184f95'],
  },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function rest(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

async function fetchData() {
  const data = await gql(`
    query($login:String!){
      user(login:$login){
        contributionsCollection{
          restrictedContributionsCount
          totalCommitContributions
          contributionCalendar{
            totalContributions
            weeks{ contributionDays{ date contributionCount weekday } }
          }
        }
      }
    }`, { login: LOGIN });

  const cc = data.user.contributionsCollection;

  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await rest(`/user/repos?per_page=100&page=${page}&affiliation=owner`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  const mine = repos.filter(
    (r) => r.owner.login === LOGIN && !r.fork && (INCLUDE_PRIVATE || !r.private)
  );

  const bytes = {};
  for (const r of mine) {
    const langs = await rest(`/repos/${r.full_name}/languages`);
    for (const [lang, n] of Object.entries(langs)) bytes[lang] = (bytes[lang] || 0) + n;
  }

  return { cc, repoCount: mine.length, bytes };
}

/* ---------------------------------------------------------------- contributions */

function contributionCard(cc, theme) {
  const t = THEMES[theme];
  const weeks = cc.contributionCalendar.weeks;
  const total = cc.contributionCalendar.totalContributions;
  const restricted = cc.restrictedContributionsCount;

  const CELL = 12, GAP = 3, STEP = CELL + GAP;
  const PAD = 24, LEFT = PAD + 32, TOP = 92;
  const W = LEFT + weeks.length * STEP + PAD - GAP;
  const H = TOP + 7 * STEP - GAP + 62;

  const counts = weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount));
  const max = Math.max(...counts, 1);
  const level = (n) => (n === 0 ? -1 : n >= max * 0.6 ? 3 : n >= max * 0.3 ? 2 : n >= max * 0.1 ? 1 : 0);

  const days = [];
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    week.contributionDays.forEach((d) => {
      const x = LEFT + wi * STEP;
      const y = TOP + d.weekday * STEP;
      const lv = level(d.contributionCount);
      const fill = lv === -1 ? t.empty : t.heat[lv];
      const label = `${d.contributionCount} contribution${d.contributionCount === 1 ? '' : 's'} on ${d.date}`;
      days.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${fill}">` +
        `<title>${esc(label)}</title></rect>`
      );
    });
    const first = week.contributionDays[0];
    if (first) {
      const m = new Date(first.date + 'T00:00:00Z').getUTCMonth();
      if (m !== lastMonth && wi < weeks.length - 1) {
        lastMonth = m;
        const name = MONTHS[m];
        monthLabels.push(
          `<text x="${LEFT + wi * STEP}" y="${TOP - 10}" fill="${t.muted}" font-size="11" font-family="${FONT}">${name}</text>`
        );
      }
    }
  });

  const dayNames = [['Mon', 1], ['Wed', 3], ['Fri', 5]].map(
    ([n, i]) =>
      `<text x="${PAD}" y="${TOP + i * STEP + 10}" fill="${t.muted}" font-size="11" font-family="${FONT}">${n}</text>`
  );

  const legendY = TOP + 7 * STEP + 18;
  const legendX = LEFT;
  const swatches = [t.empty, ...t.heat].map(
    (c, i) => `<rect x="${legendX + 34 + i * (CELL + 4)}" y="${legendY}" width="${CELL}" height="${CELL}" rx="3" fill="${c}"/>`
  );

  const first = weeks[0].contributionDays[0].date;
  const last = weeks.at(-1).contributionDays.at(-1).date;
  const fmt = (d) => {
    const dt = new Date(d + 'T00:00:00Z');
    return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
  };

  const summary = restricted > 0
    ? `<tspan font-weight="600" fill="${t.text}">${total}</tspan> contributions, <tspan font-weight="600" fill="${t.text}">${restricted}</tspan> in private repositories`
    : `<tspan font-weight="600" fill="${t.text}">${total}</tspan> contributions`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Contribution activity: ${total} contributions from ${fmt(first)} to ${fmt(last)}">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.surface}" stroke="${t.border}"/>
  <text x="${PAD}" y="${PAD + 18}" fill="${t.text}" font-size="16" font-weight="600" font-family="${FONT}">Contribution activity</text>
  <text x="${W - PAD}" y="${PAD + 18}" text-anchor="end" fill="${t.muted}" font-size="12" font-family="${FONT}">${fmt(first)} to ${fmt(last)}</text>
  <text x="${PAD}" y="${PAD + 38}" fill="${t.secondary}" font-size="12" font-family="${FONT}">Commits, pull requests and reviews across every repository</text>
  ${monthLabels.join('\n  ')}
  ${dayNames.join('\n  ')}
  ${days.join('\n  ')}
  <text x="${legendX}" y="${legendY + 11}" fill="${t.muted}" font-size="11" font-family="${FONT}">Less</text>
  ${swatches.join('\n  ')}
  <text x="${legendX + 34 + 5 * (CELL + 4) + 4}" y="${legendY + 11}" fill="${t.muted}" font-size="11" font-family="${FONT}">More</text>
  <text x="${W - PAD}" y="${legendY + 11}" text-anchor="end" fill="${t.secondary}" font-size="12" font-family="${FONT}">${summary}</text>
</svg>`;
}

/* -------------------------------------------------------------------- languages */

function languageCard(bytes, repoCount, theme) {
  const t = THEMES[theme];
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const restBytes = sorted.slice(TOP_N).reduce((a, [, n]) => a + n, 0);
  const rows = top.map(([name, n], i) => ({ name, pct: (100 * n) / total, fill: t.bars[i] }));
  if (restBytes > 0) {
    rows.push({ name: `Other (${sorted.length - TOP_N})`, pct: (100 * restBytes) / total, fill: t.other });
  }

  const PAD = 24, ROW = 30, LABEL_W = 112, TOP_Y = 84, PCT_W = 46;
  const W = 880;
  const BAR_X = PAD + LABEL_W;
  const BAR_W = W - BAR_X - PAD - PCT_W;
  const H = TOP_Y + rows.length * ROW + 14;
  const maxPct = rows[0].pct;

  const bars = rows.map((r, i) => {
    const y = TOP_Y + i * ROW;
    const w = Math.max(3, (r.pct / maxPct) * BAR_W);
    const shown = r.pct >= 1 ? r.pct.toFixed(1) : r.pct.toFixed(2);
    return `<g>
    <text x="${PAD}" y="${y + 12}" fill="${t.text}" font-size="12.5" font-family="${FONT}">${esc(r.name)}</text>
    <rect x="${BAR_X}" y="${y + 1}" width="${BAR_W}" height="14" rx="4" fill="${t.panel}"/>
    <rect x="${BAR_X}" y="${y + 1}" width="${w.toFixed(1)}" height="14" rx="4" fill="${r.fill}"><title>${esc(r.name)}: ${shown} percent</title></rect>
    <text x="${W - PAD}" y="${y + 12}" text-anchor="end" fill="${t.secondary}" font-size="12" font-family="${FONT}">${shown}%</text>
  </g>`;
  });

  const mb = (total / 1048576).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Language distribution across ${repoCount} repositories">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.surface}" stroke="${t.border}"/>
  <text x="${PAD}" y="${PAD + 18}" fill="${t.text}" font-size="16" font-weight="600" font-family="${FONT}">Language distribution</text>
  <text x="${W - PAD}" y="${PAD + 18}" text-anchor="end" fill="${t.muted}" font-size="12" font-family="${FONT}">${repoCount} repositories, ${mb} MB of source</text>
  <text x="${PAD}" y="${PAD + 38}" fill="${t.secondary}" font-size="12" font-family="${FONT}">Share of bytes written, ranked</text>
  <line x1="${PAD}" y1="${TOP_Y - 16}" x2="${W - PAD}" y2="${TOP_Y - 16}" stroke="${t.border}"/>
  ${bars.join('\n  ')}
</svg>`;
}

/* ------------------------------------------------------------------------- main */

const { writeFile } = await import('node:fs/promises');
const { cc, repoCount, bytes } = await fetchData();

for (const theme of ['light', 'dark']) {
  await writeFile(`assets/contributions-${theme}.svg`, contributionCard(cc, theme));
  await writeFile(`assets/languages-${theme}.svg`, languageCard(bytes, repoCount, theme));
}

console.log(
  `generated 4 SVGs: ${cc.contributionCalendar.totalContributions} contributions, ` +
  `${repoCount} repos, ${Object.keys(bytes).length} languages`
);
