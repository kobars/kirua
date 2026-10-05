#!/usr/bin/env node
/**
 * Fails the build when the application bundle crosses a declared size.
 *
 * **It fails rather than warns, and that is the entire point.** Vite has
 * `build.chunkSizeWarningLimit`, which prints a yellow line and exits 0. A
 * warning in a build log is a budget nobody has ever been stopped by. This runs
 * as the last step of `pnpm build` and exits non-zero.
 *
 * **Gzip is what is enforced; raw is reported beside it.** A person downloads
 * the compressed bytes, so that is the number a budget should be about. Raw is
 * printed because it is what a parser has to walk, and the two move
 * differently — a change that adds repetitive markup barely moves gzip while
 * moving raw a lot.
 *
 * ## The honest limit
 *
 * This measures the **application** build — the rebuilt hero page — which
 * includes React and ReactDOM. It therefore catches "something heavy entered
 * the graph" and cannot answer "what does one Button cost". A per-component
 * figure would measure the package output in `packages/kirua/dist` instead.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIST = path.join(import.meta.dirname, '..', 'dist', 'assets');

/**
 * `measured` is the current gzip baseline, and each limit is that baseline plus
 * roughly a tenth. A budget with room for a whole extra dependency does not
 * fail until after the mistake has shipped, and the point of a failing gate is
 * to be reached by the change that caused it rather than by the change three
 * commits later.
 *
 * The JavaScript stays small because Vite drops what no module reaches: the
 * hero imports a handful of components, and charts are plain SVG, so no
 * charting library enters the graph.
 *
 * The CSS is larger than this page needs. Tailwind scans source *text*, so
 * every utility named anywhere in `src` — components the hero never renders,
 * story-only classes, the board app — ships in this one stylesheet. A second
 * CSS entry with its own `@source` list is the fix when that is worth doing.
 *
 * Vite's own build log prints slightly different gzip figures for the same
 * files, because each side uses its own compression level. What matters is
 * that one measurement is compared against itself over time.
 *
 * **Raising one of these is a normal thing to do and should be a visible thing
 * to do.** Edit the number here, in the same commit as the change that needed
 * it, and say why in the message.
 */
const BUDGETS = {
  javascript: { extension: '.js', measured: 105.66, gzipLimitKb: 115 },
  css: { extension: '.css', measured: 18.02, gzipLimitKb: 19.8 },
};

const kb = (bytes) => bytes / 1000;
const round = (value) => Math.round(value * 100) / 100;

let files;
try {
  files = readdirSync(DIST);
} catch {
  console.error(`size-budget: no build found at ${DIST}. Run \`vite build\` first.`);
  process.exit(1);
}

const failures = [];
const rows = [];

for (const [name, budget] of Object.entries(BUDGETS)) {
  const matching = files.filter((file) => file.endsWith(budget.extension));

  // An empty match is a failure, not a pass. A renamed output directory or a
  // changed asset layout would otherwise report every budget as satisfied,
  // which is the most dangerous way for a size check to break.
  if (matching.length === 0) {
    failures.push(
      `${name}: no ${budget.extension} asset was emitted — the check found nothing`,
    );
    continue;
  }

  let raw = 0;
  let gzip = 0;
  for (const file of matching) {
    const contents = readFileSync(path.join(DIST, file));
    raw += contents.byteLength;
    gzip += gzipSync(contents).byteLength;
  }

  const over = kb(gzip) > budget.gzipLimitKb;
  rows.push({
    asset: name,
    raw: `${round(kb(raw))} kB`,
    gzip: `${round(kb(gzip))} kB`,
    budget: `${budget.gzipLimitKb} kB`,
    drift: `${round(kb(gzip) - budget.measured) >= 0 ? '+' : ''}${round(kb(gzip) - budget.measured)} kB`,
    status: over ? 'OVER' : 'ok',
  });

  if (over) {
    failures.push(
      `${name}: ${round(kb(gzip))} kB gzip exceeds the ${budget.gzipLimitKb} kB budget`,
    );
  }
}

console.table(rows);

if (failures.length > 0) {
  console.error('\nsize-budget: the bundle is over budget.\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    '\nEither find what grew, or raise the number in tools/size-budget.mjs in the\n' +
      'same commit and say why. Do not raise it in a separate tidy-up.\n',
  );
  process.exit(1);
}

console.log('size-budget: within budget.');
