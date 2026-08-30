#!/usr/bin/env node
/**
 * Runs axe-core against every route of every example application, in light mode
 * and dark mode, and fails on a violation.
 *
 * ## Why this exists beside the Storybook run
 *
 * `.storybook/preview.tsx` sets `a11y: { test: 'error' }`, so every story is
 * already an axe run that fails the build. A story is **one component on an
 * empty page**. Three whole classes of defect cannot appear there:
 *
 *   1. **Duplicated landmarks and ids.** Two `<main>` elements, or two fields
 *      that both chose `id="search"`, need a second component on the page.
 *   2. **Heading order.** A story's heading is the first on its page, so it can
 *      never be an `h3` following an `h1`.
 *   3. **Contrast against a real ancestor.** A component inherits the surface it
 *      is dropped onto. On an empty story canvas that surface is always `page`.
 *
 * Those are exactly the defects a composed screen has and a story cannot. A
 * green story run is therefore not evidence that any screen passes.
 *
 * ## Both themes, because a token is re-pointed and not re-checked
 *
 * `.dark` re-points the semantic variables in one block. Contrast is the only
 * axe rule whose answer depends on a computed colour, so it is the only rule
 * that can pass in one mode and fail in the other. Running light only would
 * check half of the shipped design.
 *
 *     pnpm build:examples && node tools/a11y-check.mjs
 */
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { APPS, eachRoute } from './example-apps.mjs';

const require = createRequire(import.meta.url);
const AXE_SOURCE = await readFile(
  path.join(path.dirname(require.resolve('axe-core')), 'axe.min.js'),
  'utf8',
);

/**
 * The widths worth an axe run, and why two and not one.
 *
 * A responsive shell does not resize — it *swaps*. `Sidebar` collapses to a rail
 * of icons, a `TabsList` becomes a `Select`, a row of buttons folds into a
 * menu. The narrow tree and the wide tree are different documents, so a name
 * that goes missing on the rail is invisible to a desktop-only run. That
 * failure is not hypothetical here: the rail losing every accessible name is
 * already recorded in `CLAUDE.md` under the `sr-only` rule.
 */
const WIDTHS = [
  { name: 'phone', width: 375, height: 812 },
  { name: 'desktop', width: 1280, height: 900 },
];

const THEMES = ['light', 'dark'];

/**
 * `color-contrast` needs real painted pixels, and axe skips it when it cannot
 * get them. Everything else runs headless without complaint.
 */
const AXE_OPTIONS = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
};

const browser = await chromium.launch();
const violations = [];
let runs = 0;

for (const theme of THEMES) {
  for (const size of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      colorScheme: theme,
      isMobile: size.name === 'phone',
      hasTouch: size.name === 'phone',
    });
    const page = await context.newPage();

    await eachRoute(async ({ slug, label, url }) => {
      await page.goto(url, { waitUntil: 'load' });
      // A hash change does not reload the document, so React needs a frame to
      // render the new route before axe walks the tree.
      await page.waitForTimeout(250);
      await page.addScriptTag({ content: AXE_SOURCE });

      const result = await page.evaluate(
        (options) => window.axe.run(document, options),
        AXE_OPTIONS,
      );
      runs += 1;

      for (const violation of result.violations) {
        violations.push({
          app: slug,
          route: label,
          theme,
          width: size.name,
          rule: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.map((node) => node.target.join(' ')),
        });
      }
    });

    await context.close();
  }
}

await browser.close();

const IMPACT_ORDER = ['critical', 'serious', 'moderate', 'minor'];

console.log(
  `\naxe-core on ${APPS.length} apps, ${runs} route views ` +
    `(${THEMES.join(' + ')} x ${WIDTHS.map((w) => w.name).join(' + ')}):\n`,
);

if (violations.length === 0) {
  console.log(`a11y-check: ${runs} route views, 0 violations.`);
  process.exit(0);
}

// One line per distinct rule, because the same rule on eight routes is one
// defect to fix and eight lines of noise to read.
const byRule = new Map();
for (const v of violations) {
  const key = `${v.rule}|${v.app}`;
  const entry = byRule.get(key) ?? { ...v, routes: new Set(), where: new Set() };
  entry.routes.add(`${v.route} (${v.theme}/${v.width})`);
  for (const node of v.nodes) entry.where.add(node);
  byRule.set(key, entry);
}

const grouped = [...byRule.values()].sort(
  (a, b) => IMPACT_ORDER.indexOf(a.impact) - IMPACT_ORDER.indexOf(b.impact),
);

console.table(
  grouped.map((g) => ({
    app: g.app,
    rule: g.rule,
    impact: g.impact,
    views: g.routes.size,
    example: [...g.where][0]?.slice(0, 60),
  })),
);

console.error('\na11y-check: axe reported violations on a composed screen.\n');
for (const g of grouped) {
  console.error(`  ${g.impact.toUpperCase()} ${g.rule} — ${g.help}`);
  console.error(`    ${g.app}: ${[...g.routes].slice(0, 6).join(', ')}`);
  for (const where of [...g.where].slice(0, 4)) console.error(`      ${where}`);
  console.error('');
}
process.exit(1);
