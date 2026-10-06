#!/usr/bin/env node
/**
 * Runs axe-core against every route of every section of the example app, in
 * light mode and dark mode, and fails on a violation.
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
 * Dark mode is a set of night palettes, each re-pointing the page, the card
 * and the lines. Each section opens in its own night, and that run covers
 * every width like light mode; then every night is forced on every route at
 * desktop width, because a night changes colours and not the tree.
 *
 * ## States a route does not open in
 *
 * Each route is checked as it first renders. A tree that only exists after an
 * interaction — a rail collapsed to icons, a drawer opened — gets its own run
 * after the sweep, listed in `STATES`.
 *
 *     pnpm build:examples && node tools/a11y-check.mjs
 */
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { breakpointPx } from './breakpoints.mjs';
import { APP_SECTIONS, SECTIONS, eachRoute, open, serve } from './example-apps.mjs';

const require = createRequire(import.meta.url);
const AXE_SOURCE = await readFile(
  path.join(path.dirname(require.resolve('axe-core')), 'axe.min.js'),
  'utf8',
);

/**
 * The widths worth an axe run, and why three and not one.
 *
 * A responsive shell does not resize — it *swaps*. A rail becomes a drawer, a
 * `TabsList` becomes a `Select`, a row that `Visible from="sm"` hides on a
 * phone appears beside the others. Each side of a switch is a different
 * document, and a name that goes missing on one side is invisible to a run on
 * the other. `sm` sits between the phone and `md`, where the `sm` switches are
 * on and the `md` ones are still off.
 */
const WIDTHS = [
  { name: 'phone', width: 375, height: 812, touch: true },
  { name: 'sm', width: breakpointPx('sm'), height: 800, touch: true },
  { name: 'desktop', width: 1280, height: 900, touch: false },
];

/** The night palette names; the first is the default, which sets no attribute. */
const NIGHTS = JSON.parse(
  await readFile(path.join(import.meta.dirname, '../src/styles/nights.json'), 'utf8'),
);

/** The night each section opens in; the hub opens in the default. */
const OWN_NIGHT = new Map(APP_SECTIONS.map((section) => [section.id, section.night]));

/** Every key a night is stored under: the hub's, then one per section. */
const NIGHT_KEYS = [
  'kirua-night-palette',
  ...APP_SECTIONS.map((section) => `kirua-night-palette:${section.id}`),
];

const THEMES = [
  { name: 'light', scheme: 'light', widths: WIDTHS },
  { name: 'dark', scheme: 'dark', widths: WIDTHS },
  ...NIGHTS.slice(1).map((night) => ({
    name: `dark/${night}`,
    scheme: 'dark',
    night,
    widths: WIDTHS.filter((size) => size.name === 'desktop'),
  })),
];

/**
 * Trees a route only shows after an interaction. Each opens its route, acts,
 * waits for the state to settle, and is checked in light and dark mode.
 *
 * The collapsed rail is the one a `hidden` label breaks: its buttons keep only
 * an icon, so a label that leaves the accessibility tree instead of the screen
 * takes every name on the rail with it. The wait is on the rail's own state
 * and not on a button's name, so a nameless rail reaches axe rather than
 * timing out.
 */
const STATES = [
  {
    section: 'his',
    label: '#/his/ with the rail collapsed',
    hash: '#/his/',
    width: 'desktop',
    act: async (page) => {
      await page.getByRole('button', { name: 'Collapse menu' }).click();
      await page.locator('[data-slot="sidebar"][data-closed]').waitFor();
    },
  },
  {
    section: 'his',
    label: '#/his/ with the drawer open',
    hash: '#/his/',
    width: 'phone',
    act: async (page) => {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      // The drawer slides in; axe reads colours mid-animation otherwise.
      await page.waitForTimeout(500);
    },
  },
];

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

const contextFor = (size, scheme) =>
  browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    isMobile: size.touch,
    hasTouch: size.touch,
  });

/** Runs axe on the page as it stands and records what it reports. */
async function audit(page, { section, route, theme, width }) {
  await page.addScriptTag({ content: AXE_SOURCE });
  const result = await page.evaluate(
    (options) => window.axe.run(document, options),
    AXE_OPTIONS,
  );
  runs += 1;
  for (const violation of result.violations) {
    violations.push({
      section,
      route,
      theme,
      width,
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    });
  }
}

for (const { name: theme, scheme, night, widths } of THEMES) {
  for (const size of widths) {
    const context = await contextFor(size, scheme);
    // The host document's blocking script reads the stored night before paint.
    if (night)
      await context.addInitScript(
        ({ value, keys }) => {
          try {
            for (const key of keys) localStorage.setItem(key, value);
          } catch {
            // The blank page between sections has no storage.
          }
        },
        { value: night, keys: NIGHT_KEYS },
      );
    const page = await context.newPage();

    await eachRoute(async ({ section, label, url }) => {
      await open(page, url);
      const expected = night ?? OWN_NIGHT.get(section) ?? NIGHTS[0];
      const applied =
        (await page.evaluate(() => document.documentElement.dataset.nightPalette)) ?? NIGHTS[0];
      if (scheme === 'dark' && applied !== expected)
        throw new Error(`${section} ${label}: the ${expected} night was not applied`);
      await audit(page, { section, route: label, theme, width: size.name });
    });

    await context.close();
  }
}

const server = await serve();
try {
  const { port } = server.address();
  for (const state of STATES) {
    const size = WIDTHS.find((candidate) => candidate.name === state.width);
    for (const scheme of ['light', 'dark']) {
      const context = await contextFor(size, scheme);
      const page = await context.newPage();
      await open(page, `http://127.0.0.1:${port}/${state.hash}`);
      await page.waitForTimeout(250);
      await state.act(page);
      await audit(page, {
        section: state.section,
        route: state.label,
        theme: scheme,
        width: size.name,
      });
      await context.close();
    }
  }
} finally {
  server.close();
}

await browser.close();

const IMPACT_ORDER = ['critical', 'serious', 'moderate', 'minor'];

console.log(
  `\naxe-core on ${SECTIONS.length} sections, ${runs} route views ` +
    `(${THEMES.map((theme) => `${theme.name} x ${theme.widths.map((w) => w.name).join(' + ')}`).join(', ')}, ` +
    `${STATES.length} interaction states x light + dark):\n`,
);

if (violations.length === 0) {
  console.log(`a11y-check: ${runs} route views, 0 violations.`);
  process.exit(0);
}

// One line per distinct rule, because the same rule on eight routes is one
// defect to fix and eight lines of noise to read.
const byRule = new Map();
for (const v of violations) {
  const key = `${v.rule}|${v.section}`;
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
    section: g.section,
    rule: g.rule,
    impact: g.impact,
    views: g.routes.size,
    example: [...g.where][0]?.slice(0, 60),
  })),
);

console.error('\na11y-check: axe reported violations on a composed screen.\n');
for (const g of grouped) {
  console.error(`  ${g.impact.toUpperCase()} ${g.rule} — ${g.help}`);
  console.error(`    ${g.section}: ${[...g.routes].slice(0, 6).join(', ')}`);
  for (const where of [...g.where].slice(0, 4)) console.error(`      ${where}`);
  console.error('');
}
process.exit(1);
