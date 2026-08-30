#!/usr/bin/env node
/**
 * Weighs each of the four example applications and fails when one crosses its
 * declared size.
 *
 * `tools/size-budget.mjs` does this for `dist` — the rebuilt hero page. That is
 * one screen importing a handful of components, so it answers "did something
 * heavy enter the graph" for a page nobody ships. The example apps are the
 * closest thing here to a real consumer: four applications, thirty-one screens,
 * and most of the component set between them.
 *
 * ## What is enforced, and what is only reported
 *
 * **Bytes are enforced.** A build produces the same bytes twice, so a byte
 * budget fails for a reason and never at random.
 *
 * **Timing is reported and never enforced.** The same page on the same machine
 * varies by tens of milliseconds between runs, so a timing gate fails on a busy
 * laptop and teaches everyone to re-run it until it passes — which is worse
 * than no gate, because it also trains people to re-run the real failures.
 *
 * **Stylesheet coverage is reported.** Tailwind scans source *text*, and every
 * app's stylesheet names `src/components`, so each one ships every utility any
 * component mentions whether or not that component is ever imported. The number
 * this prints is how much of the sheet the app's own screens actually use, and
 * it is the evidence for whether a per-app `@source` list would be worth its
 * complexity. Ranges are unioned across every route of the app, so a rule used
 * on one screen counts as used.
 *
 *     pnpm build:examples && node tools/perf-check.mjs
 */
import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { APPS, distOf, serve } from './example-apps.mjs';

/**
 * Measured on 2026-08-31, so each budget is a record of reality plus headroom
 * rather than an aspiration.
 *
 * ```
 * claude   130.69 kB js   12.52 kB css
 * shop     135.87 kB js   12.81 kB css
 * simrs    136.20 kB js   12.71 kB css
 * social   131.30 kB js   12.77 kB css
 * ```
 *
 * One pair of limits for all four rather than four pairs, because the four
 * numbers are within 6 kB of each other and a per-app limit would invite
 * raising one quietly. The headroom is roughly a tenth, for the reason
 * `size-budget.mjs` gives: a budget with room for a whole extra dependency does
 * not fail until after the mistake has shipped.
 *
 * **Raising one of these is a normal thing to do and should be a visible thing
 * to do.** Edit the number here, in the same commit as the change that needed
 * it, and say why in the message.
 *
 * The CSS figures are near-identical across four very different applications,
 * and that is the finding rather than a coincidence — see the coverage note
 * above.
 */
const BUDGETS = {
  javascript: { extension: '.js', gzipLimitKb: 150 },
  css: { extension: '.css', gzipLimitKb: 14 },
};

const kb = (bytes) => Math.round((bytes / 1000) * 100) / 100;

const failures = [];
const sizes = [];

for (const { slug } of APPS) {
  const assets = path.join(distOf(slug), 'assets');
  let files;
  try {
    files = readdirSync(assets);
  } catch {
    console.error(
      `perf-check: no build found at ${assets}. Run \`pnpm build:examples\` first.`,
    );
    process.exit(1);
  }

  const row = { app: slug };
  for (const [name, budget] of Object.entries(BUDGETS)) {
    const matching = files.filter((file) => file.endsWith(budget.extension));

    // An empty match is a failure, not a pass. A changed asset layout would
    // otherwise report every budget as satisfied, which is the most dangerous
    // way for a size check to break.
    if (matching.length === 0) {
      failures.push(`${slug} ${name}: no ${budget.extension} asset was emitted`);
      continue;
    }

    let raw = 0;
    let gzip = 0;
    for (const file of matching) {
      const contents = readFileSync(path.join(assets, file));
      raw += contents.byteLength;
      gzip += gzipSync(contents).byteLength;
    }

    row[`${name} raw`] = kb(raw);
    row[`${name} gzip`] = kb(gzip);
    if (kb(gzip) > budget.gzipLimitKb) {
      failures.push(
        `${slug} ${name}: ${kb(gzip)} kB gzip is over the ${budget.gzipLimitKb} kB budget`,
      );
    }
  }
  sizes.push(row);
}

console.log('\nWhat each example application weighs:\n');
console.table(sizes);

// ---------------------------------------------------------------------------
// Reported, not enforced.
// ---------------------------------------------------------------------------

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const runtime = [];

for (const { slug, routes } of APPS) {
  const server = await serve(distOf(slug));
  const { port } = server.address();
  const page = await context.newPage();

  await page.coverage.startCSSCoverage();

  let nodes = 0;
  let paint = 0;

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${port}/#/${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    const measured = await page.evaluate(() => ({
      nodes: document.getElementsByTagName('*').length,
      // First Contentful Paint: when the browser put the first text or image on
      // the screen. The one timing here that is about what a person sees rather
      // than what the machine did.
      paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0,
    }));
    nodes = Math.max(nodes, measured.nodes);
    paint = Math.max(paint, measured.paint);
  }

  // Union the used ranges per stylesheet, so a rule any route reaches counts
  // once. Without the union a rule used on six screens would be counted six
  // times and coverage would read above 100%.
  const used = new Map();
  const total = new Map();
  for (const entry of await page.coverage.stopCSSCoverage()) {
    if (!entry.url.endsWith('.css')) continue;
    total.set(entry.url, entry.text.length);
    const ranges = used.get(entry.url) ?? [];
    ranges.push(...entry.ranges);
    used.set(entry.url, ranges);
  }

  let usedBytes = 0;
  let totalBytes = 0;
  for (const [url, ranges] of used) {
    totalBytes += total.get(url) ?? 0;
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    let end = -1;
    for (const range of sorted) {
      if (range.start > end) {
        usedBytes += range.end - range.start;
        end = range.end;
      } else if (range.end > end) {
        usedBytes += range.end - end;
        end = range.end;
      }
    }
  }

  runtime.push({
    app: slug,
    routes: routes.length,
    'max DOM nodes': nodes,
    'slowest FCP ms': Math.round(paint),
    'css used kB': kb(usedBytes),
    'css shipped kB': kb(totalBytes),
    'css used %': totalBytes === 0 ? 0 : Math.round((usedBytes / totalBytes) * 100),
  });

  await page.close();
  server.close();
}

await browser.close();

console.log('\nReported, not enforced — every route of each app, widest viewport:\n');
console.table(runtime);

if (failures.length > 0) {
  console.error('\nperf-check: an example application is over its size budget.\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\nperf-check: ${APPS.length} apps, every one inside its size budget.`);
