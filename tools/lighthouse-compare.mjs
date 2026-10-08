/**
 * Lighthouse on two builds of the example app, a base and a head, served side
 * by side and measured in turn: the mobile lab score, FCP, LCP, TBT and CLS of
 * the hub and each section's first route.
 *
 *     node tools/lighthouse-compare.mjs <base-dist> <head-dist> [rounds]
 *
 * A lab score depends on the machine it runs on, so a fixed threshold passes
 * on a fast runner and fails on a slow one. Measuring both builds on the same
 * machine, alternating which goes first in each round, makes the difference
 * between them the result. Each figure is the median of `rounds` runs, three
 * by default.
 *
 * The pages' Google Fonts are fetched once and served by the same local server
 * as the app. Over the internet their timing varies from run to run, and a
 * font that lands before or after the largest paint moves a simulated LCP by
 * a few hundred milliseconds. Both builds load the same files either way, so
 * the difference stays meaningful, but the figures themselves are not the
 * score a deployed page gets.
 *
 * It reports and does not fail. A route whose median LCP is more than
 * `WARN_LCP_MS` slower than the base gets a warning annotation on CI. The
 * table goes to the console and, on GitHub Actions, to the job summary; the
 * reports go to `$KIRUA_REVIEW_OUTPUT/lighthouse-compare`.
 */
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SECTIONS, serve } from './example-apps.mjs';
import { lighthouse } from './lighthouse-run.mjs';

const WARN_LCP_MS = 200;

const [baseDist, headDist, roundsArg = '3'] = process.argv.slice(2);
if (!baseDist || !headDist) {
  console.error('usage: node tools/lighthouse-compare.mjs <base-dist> <head-dist> [rounds]');
  process.exit(2);
}
const rounds = Number(roundsArg);
const output = path.join(
  process.env.KIRUA_REVIEW_OUTPUT ?? '/tmp/kirua-review',
  'lighthouse-compare',
);
await mkdir(output, { recursive: true });

const GOOGLE_CSS = /https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/;
// Google answers with woff2 rules only for a browser it recognises.
const CHROME =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

async function fetched(url) {
  const response = await fetch(url, { headers: { 'user-agent': CHROME } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

/** `serve` options that answer a build's Google Fonts requests locally. */
async function localFonts(dist) {
  const html = await readFile(path.join(dist, 'index.html'), 'utf8');
  const href = html.match(GOOGLE_CSS)?.[0];
  if (!href) return {};
  const files = new Map();
  let css = (await fetched(href.replaceAll('&amp;', '&'))).toString();
  for (const [index, url] of [
    ...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"]+/g)),
  ].entries()) {
    const local = `/google-fonts/${index}.woff2`;
    files.set(local, { type: 'font/woff2', body: await fetched(url) });
    css = css.replaceAll(url, local);
  }
  files.set('/google-fonts/fonts.css', { type: 'text/css; charset=utf-8', body: css });
  return {
    files,
    rewrite: (file, body) =>
      file === '/index.html' ? body.toString().replace(href, '/google-fonts/fonts.css') : body,
  };
}

const serveBuild = async (dist) =>
  serve(path.resolve(dist), { compress: true, ...(await localFonts(path.resolve(dist))) });
const servers = { base: await serveBuild(baseDist), head: await serveBuild(headDist) };
const rows = [];
try {
  for (let round = 0; round < rounds; round++) {
    for (const { section, prefix } of SECTIONS) {
      for (const side of round % 2 ? ['head', 'base'] : ['base', 'head']) {
        const report = await lighthouse(
          `http://127.0.0.1:${servers[side].address().port}/#/${prefix}`,
          path.join(output, `${section}-${side}-${round}.json`),
          { categories: ['performance'] },
        );
        const value = (id) => report.audits[id].numericValue;
        rows.push({
          section,
          side,
          score: Math.round(report.categories.performance.score * 100),
          FCP: Math.round(value('first-contentful-paint')),
          LCP: Math.round(value('largest-contentful-paint')),
          TBT: Math.round(value('total-blocking-time')),
          CLS: value('cumulative-layout-shift'),
        });
      }
    }
  }
} finally {
  servers.base.close();
  servers.head.close();
}
await writeFile(path.join(output, 'rows.json'), JSON.stringify(rows, null, 2));

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const summary = SECTIONS.map(({ section }) => {
  const of = (side, key) =>
    median(
      rows.filter((row) => row.section === section && row.side === side).map((row) => row[key]),
    );
  const pair = (key) => ({ base: of('base', key), head: of('head', key) });
  return {
    section,
    score: pair('score'),
    FCP: pair('FCP'),
    LCP: pair('LCP'),
    TBT: pair('TBT'),
    CLS: pair('CLS'),
  };
});

const signed = (n) => (n > 0 ? `+${n}` : String(n));
console.table(
  summary.map(({ section, score, FCP, LCP, TBT, CLS }) => ({
    section,
    score: `${score.base} → ${score.head}`,
    'FCP ms': `${FCP.base} → ${FCP.head}`,
    'LCP ms': `${LCP.base} → ${LCP.head}`,
    'LCP Δ': signed(LCP.head - LCP.base),
    'TBT ms': `${TBT.base} → ${TBT.head}`,
    CLS: `${CLS.base.toFixed(3)} → ${CLS.head.toFixed(3)}`,
  })),
);

const slower = summary.filter(({ LCP }) => LCP.head - LCP.base > WARN_LCP_MS);
for (const { section, LCP } of slower) {
  const message = `${section}: median LCP ${LCP.base} → ${LCP.head} ms (${signed(LCP.head - LCP.base)} ms)`;
  console.log(
    process.env.GITHUB_ACTIONS
      ? `::warning title=Lighthouse LCP::${message}`
      : `slower: ${message}`,
  );
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    `### Lighthouse, mobile lab: base → head (median of ${rounds})`,
    '',
    '| Route | Score | FCP ms | LCP ms | LCP Δ | TBT ms | CLS |',
    '|---|---|---|---|---|---|---|',
    ...summary.map(
      ({ section, score, FCP, LCP, TBT, CLS }) =>
        `| ${section} | ${score.base} → ${score.head} | ${FCP.base} → ${FCP.head} | ` +
        `${LCP.base} → ${LCP.head} | ${signed(LCP.head - LCP.base)} | ${TBT.base} → ${TBT.head} | ` +
        `${CLS.base.toFixed(3)} → ${CLS.head.toFixed(3)} |`,
    ),
    '',
    slower.length > 0
      ? `${slower.length} route(s) more than ${WARN_LCP_MS} ms slower on LCP. Reported, not enforced.`
      : `No route is more than ${WARN_LCP_MS} ms slower on LCP.`,
    '',
  ];
  await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
}
console.log(
  `lighthouse-compare: ${SECTIONS.length} routes, ${rounds} rounds; ` +
    `${slower.length} more than ${WARN_LCP_MS} ms slower on LCP.`,
);
