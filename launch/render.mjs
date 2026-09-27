/**
 * Render the ecosystem posters and the README banner to assets/posters/.
 *
 *   PLAYWRIGHT=/path/to/node_modules/@playwright/test/index.mjs node launch/render.mjs
 *
 * This repo has no package.json, so Playwright is borrowed from any checkout
 * that has it (PLAYWRIGHT), falling back to a global `playwright`. Before each
 * screenshot the page is checked against the house rules: no gradient in any
 * computed style and no em dash anywhere in the text. Either one fails the run.
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright');
const HERE = fileURLToPath(new URL('./', import.meta.url));
const OUT = fileURLToPath(new URL('../assets/posters/', import.meta.url));

const POSTERS = {
  nhako: { w: 1080, h: 1350 },
  omni: { w: 1080, h: 1350 },
  homelab: { w: 1080, h: 1350 },
  banner: { w: 1280, h: 560 },
};
const TYPES = { '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  const file = normalize(join(HERE, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!file.startsWith(HERE)) return res.writeHead(403).end();
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/posters.html`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
let failed = false;
for (const [id, { w, h }] of Object.entries(POSTERS)) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(`${base}?p=${id}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const problems = await page.evaluate((sel) => {
    const root = document.getElementById(sel);
    const out = [];
    for (const el of [root, ...root.querySelectorAll('*')]) {
      for (const pseudo of [null, '::before', '::after']) {
        const cs = getComputedStyle(el, pseudo);
        for (const prop of ['background-image', 'border-image-source', 'mask-image', 'box-shadow', 'color']) {
          if (/gradient/i.test(cs.getPropertyValue(prop))) out.push(`gradient in ${prop} on <${el.tagName.toLowerCase()} class="${el.className}">`);
        }
      }
    }
    if (/\u2014/.test(root.innerText)) out.push('em dash in text');
    for (const img of root.querySelectorAll('img')) if (!img.naturalWidth) out.push(`image failed: ${img.getAttribute('src')}`);
    const bad = [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family);
    if (bad.length) out.push(`fonts failed: ${bad.join(', ')}`);
    return out;
  }, id);

  if (problems.length) {
    failed = true;
    console.error(`${id}: ${problems.join('; ')}`);
  } else {
    await page.screenshot({ path: join(OUT, `${id}.png`) });
    console.log(`${id}: ${w * 2}x${h * 2} -> assets/posters/${id}.png`);
  }
  await page.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
