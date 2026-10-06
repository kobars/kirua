#!/usr/bin/env node
/**
 * Weighs the example app and fails when a part of it crosses its declared
 * size.
 *
 * `tools/size-budget.mjs` does this for `dist` — the rebuilt hero page. That is
 * one screen importing a handful of components, so it answers "did something
 * heavy enter the graph" for a page nobody ships. The example app is the
 * closest thing here to a real consumer: five sections and most of the
 * component set between them.
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
 * **Stylesheet coverage is reported.** Tailwind scans source *text*, and the
 * app's stylesheet names `src/components`, so it ships every utility any
 * component mentions whether or not that component is ever imported. The number
 * this prints is how much of the sheet each section's screens actually use.
 * Ranges are unioned across every route of the section, so a rule used on one
 * screen counts as used.
 *
 *     pnpm build:examples && node tools/perf-check.mjs
 */
import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { DIST, SECTIONS, open, serve } from './example-apps.mjs';

/**
 * Measured from the build, so each budget is a record of reality plus headroom
 * rather than an aspiration.
 *
 * ```
 * entry       110.54 kB js
 * total       244.98 kB js
 * css          18.79 kB
 *
 *             section   first visit
 * shop         54.48      165.03
 * his          56.55      167.09
 * social       45.43      155.97
 * assistant    44.19      154.74
 * marketing    35.10      145.64
 * ```
 *
 * **The JavaScript is weighed in three parts**, because the app is one entry
 * and five lazily loaded sections:
 *
 * - `entry` is what every visitor downloads before any section: React, the
 *   theme menu, the hub and the components they share.
 * - `section` is what opening one section adds: its own chunk and every
 *   shared chunk it imports that the entry does not already hold. One limit
 *   for all five rather than five, because a per-section limit would invite
 *   raising one quietly.
 * - `total` is every script the build emits. It catches growth that moves
 *   between the other two — a component the entry stops sharing lands in each
 *   section that uses it.
 *
 * A first visit to a section downloads `entry + section`. It is reported, not
 * enforced: the two limits it is made of already bound it.
 *
 * **The CSS is one stylesheet shared by every section**, limited to 19.3 kB.
 * Its headroom is under 3%, because the one sheet carries the classes of all
 * five sections; the limit is kept tight so that growth here stays visible.
 *
 * Elsewhere the headroom is roughly a tenth, for the reason `size-budget.mjs`
 * gives: a budget with room for a whole extra dependency does not fail until
 * after the mistake has shipped.
 *
 * **Raising one of these is a normal thing to do and should be a visible thing
 * to do.** Edit the number here, in the same commit as the change that needed
 * it, and say why in the message.
 */
const BUDGETS_KB = {
  entry: 120,
  section: 62,
  total: 257,
  css: 19.3,
};

const kb = (bytes) => Math.round((bytes / 1000) * 100) / 100;

const failures = [];

let manifest;
try {
  manifest = JSON.parse(readFileSync(path.join(DIST, '.vite', 'manifest.json'), 'utf8'));
} catch {
  console.error(
    `perf-check: no build manifest found in ${DIST}. Run \`pnpm build:examples\` first.`,
  );
  process.exit(1);
}

const gzipOf = new Map();
const weigh = (file) => {
  if (!gzipOf.has(file))
    gzipOf.set(file, gzipSync(readFileSync(path.join(DIST, file))).byteLength);
  return gzipOf.get(file);
};

/** A chunk's file and the files of every chunk it imports statically, transitively. */
function closure(key, seen = new Set()) {
  const chunk = manifest[key];
  if (chunk === undefined || seen.has(chunk.file)) return seen;
  seen.add(chunk.file);
  for (const imported of chunk.imports ?? []) closure(imported, seen);
  return seen;
}

const sum = (files) => [...files].reduce((total, file) => total + weigh(file), 0);

const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
const entryFiles = closure(entryKey);
const entry = sum(entryFiles);

const assets = readdirSync(path.join(DIST, 'assets'));
const scripts = assets.filter((file) => file.endsWith('.js')).map((file) => `assets/${file}`);
const sheets = assets.filter((file) => file.endsWith('.css')).map((file) => `assets/${file}`);

// An empty match is a failure, not a pass. A changed asset layout would
// otherwise report every budget as satisfied, which is the most dangerous way
// for a size check to break.
if (entryKey === undefined) failures.push('no entry chunk in the build manifest');
if (sheets.length === 0) failures.push('no .css asset was emitted');

const check = (name, bytes, limit) => {
  if (kb(bytes) > limit)
    failures.push(`${name}: ${kb(bytes)} kB gzip is over the ${limit} kB budget`);
};

const sizes = [];
for (const { section, prefix } of SECTIONS) {
  if (prefix === '') continue;
  const key = `${section}/App.tsx`;
  if (manifest[key] === undefined) {
    failures.push(`${section}: no chunk named ${key} in the build manifest`);
    continue;
  }
  const own = [...closure(key)].filter((file) => !entryFiles.has(file));
  const bytes = sum(own);
  check(`${section} section js`, bytes, BUDGETS_KB.section);
  sizes.push({
    section,
    'section js gzip': kb(bytes),
    'first visit js gzip': kb(entry + bytes),
  });
}

const total = sum(scripts);
const css = sum(sheets);
check('entry js', entry, BUDGETS_KB.entry);
check('total js', total, BUDGETS_KB.total);
check('css', css, BUDGETS_KB.css);

console.log('\nWhat the example app weighs, gzip kB:\n');
console.table([
  { part: 'entry js', gzip: kb(entry), budget: BUDGETS_KB.entry },
  { part: 'total js', gzip: kb(total), budget: BUDGETS_KB.total },
  { part: 'css', gzip: kb(css), budget: BUDGETS_KB.css },
]);
console.log(`\nWhat each section adds (budget ${BUDGETS_KB.section} kB):\n`);
console.table(sizes);

// ---------------------------------------------------------------------------
// Reported, not enforced.
// ---------------------------------------------------------------------------

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const runtime = [];
const server = await serve();
const { port } = server.address();

for (const { section, prefix, routes } of SECTIONS) {
  const page = await context.newPage();

  await page.coverage.startCSSCoverage({ resetOnNavigation: false });

  let nodes = 0;
  let paint = 0;

  for (const route of routes) {
    await open(page, `http://127.0.0.1:${port}/#/${prefix}${route}`);
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
    section,
    routes: routes.length,
    'max DOM nodes': nodes,
    'slowest FCP ms': Math.round(paint),
    'css used kB': kb(usedBytes),
    'css shipped kB': kb(totalBytes),
    'css used %': totalBytes === 0 ? 0 : Math.round((usedBytes / totalBytes) * 100),
  });

  await page.close();
}

server.close();
await browser.close();

console.log('\nReported, not enforced — every route of each section, widest viewport:\n');
console.table(runtime);

if (failures.length > 0) {
  console.error('\nperf-check: the example app is over its size budget.\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `\nperf-check: the entry, ${sizes.length} sections, the total and the stylesheet are inside their budgets.`,
);
