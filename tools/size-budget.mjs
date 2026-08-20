#!/usr/bin/env node
/**
 * Fails the build when the application bundle crosses a declared size.
 *
 * Nothing in this repository measured its own weight before this file existed.
 * There was no size check, no budget, and no record of what importing kirua
 * costs — only two prose claims about it, both true and neither watched.
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
 * figure needs tree-shaken library output, which does not exist yet; see
 * `board/tasks/library-build.md`. Measuring the wrong thing precisely would be
 * worse than measuring this thing and saying so.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIST = path.join(import.meta.dirname, '..', 'dist', 'assets');

/**
 * Measured on 2026-08-20, immediately before these numbers were chosen, so the
 * budget is a record of reality plus headroom rather than an aspiration:
 *
 * ```
 * javascript   329.58 kB raw   104.16 kB gzip
 * css           48.73 kB raw     8.90 kB gzip
 * ```
 *
 * The CSS figure was 8.52 kB when this file was written and moved to 8.90 kB
 * in the same session, when the field token family added twelve variables in
 * four contexts. Re-recorded here rather than left to show as permanent drift:
 * `measured` is a baseline for comparison, so a baseline nobody updates turns
 * the drift column into a constant.
 *
 * Vite's own build log prints 105.30 and 8.55 for the same two files. The
 * difference is the compression level each side happens to use, and it is
 * recorded here so nobody spends an afternoon on a 1 kB discrepancy: what
 * matters is that one measurement is compared against itself over time.
 *
 * The headroom is deliberately narrow — roughly a tenth. A budget with room for
 * a whole extra dependency does not fail until after the mistake has shipped,
 * and the point of a failing gate is to be reached by the change that caused it
 * rather than by the change three commits later.
 *
 * **Raising one of these is a normal thing to do and should be a visible thing
 * to do.** Edit the number here, in the same commit as the change that needed
 * it, and say why in the message.
 */
const BUDGETS = {
  javascript: { extension: '.js', measured: 104.16, gzipLimitKb: 115 },
  css: { extension: '.css', measured: 8.9, gzipLimitKb: 12 },
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
