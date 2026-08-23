/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

const dirname = import.meta.dirname;
const REM = 16;

/**
 * The widths the suite runs at, **parsed out of the CSS that ships**. A width
 * restated as a number here is a second source of truth: it silently stops
 * straddling the breakpoint the moment the token moves, and the suite stays
 * green while the assertion stops meaning anything. Proved by retuning
 * `--breakpoint-md` and watching a hard-coded 767/768 pair still pass.
 *
 * Three widths, not five. Each one multiplies the whole suite, and these are
 * the three sides of the only two reflows the system has: just below `md`,
 * exactly at `md`, and the desktop width the reference was drawn for.
 *
 * `.storybook/viewports.ts` derives the same three from the same file, for the
 * story side. Two readers, one source.
 */
function breakpointPx(name: string): number {
  const css = readFileSync(path.join(dirname, 'src/styles/tokens.primitives.css'), 'utf8');
  const match = css.match(new RegExp(`--breakpoint-${name}:\\s*([\\d.]+)rem`));
  if (!match?.[1])
    throw new Error(`--breakpoint-${name} is not declared in tokens.primitives.css`);
  return Number(match[1]) * REM;
}

const md = breakpointPx('md');
const WIDTHS = [
  { key: 'belowMd', name: 'below-md', width: md - 1 },
  { key: 'md', name: 'md', width: md },
  { key: 'lg', name: 'lg', width: breakpointPx('lg') },
] as const;

/**
 * One instance, deliberately unnamed: Vitest names the nested project after the
 * instance when one is given, which then collides with the project's own name.
 * The width lives in the project name instead.
 */
const browser = (
  width: number,
  contextOptions: {
    forcedColors?: 'none' | 'active';
    reducedMotion?: 'no-preference' | 'reduce';
  } = {},
) => ({
  enabled: true as const,
  headless: true as const,
  // A failing test would otherwise drop a PNG into `src/**/__screenshots__`,
  // which is now a *tracked* directory holding the visual baselines. A picture
  // of a headless assertion is worth little and would arrive looking like an
  // approved baseline, which is worth less than nothing.
  screenshotFailures: false,
  provider: playwright({ contextOptions }),
  instances: [{ browser: 'chromium' as const, viewport: { width, height: 900 } }],
});

/**
 * Every file a *dedicated* project owns, so the general projects do not also
 * pick it up. The general `include` glob matches both suffixes too, and a
 * file that runs in two projects at once is not twice as tested — for a
 * screenshot it is actively wrong, because both projects write the same
 * baseline path and the second overwrites the first.
 */
const OTHER_PROJECTS_OWN = [
  'src/**/*.forced.test.{ts,tsx}',
  'src/**/*.visual.test.{ts,tsx}',
  'src/**/*.node.test.{ts,tsx}',
  'src/**/*.reduced.test.{ts,tsx}',
] as const;

/**
 * One project per width, not one project with three instances.
 * `@storybook/addon-vitest` resets the viewport before every story to its own
 * 1200x900 default unless a Storybook *global* says otherwise, so an instance
 * `viewport` never survives — verified by reading `window.innerWidth` inside a
 * `play` function and getting 1200 at all three. `initialGlobals` is per
 * project, which is what forces the shape below.
 */
const storyProjects = WIDTHS.map(({ key, name, width }) => ({
  extends: true as const,
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      initialGlobals: { viewport: { value: key } },
    }),
  ],
  test: {
    name: `storybook:${name}`,
    browser: browser(width),
  },
}));

/**
 * Kept in step with the `browserslist` key in `package.json` by
 * `src/styles/browsers.test.ts`. Vite does not read `browserslist` — it reads
 * `build.target` — so without that test the declared matrix and the compiled
 * output would be free to disagree, which is worse than having neither.
 */
const BUILD_TARGET = ['chrome120', 'edge120', 'safari16.4', 'firefox128'];

/**
 * The second engine. WebKit differs most from Chromium, and the declared matrix
 * says Safari 16.4 — so a suite that only ever ran Chromium was asserting
 * support it had never seen.
 *
 * One width, and the unit tests only. What an engine changes is how a computed
 * style resolves — a logical property, an `@utility`, a `color-mix()` — and
 * that is exactly what those tests read. Tripling the story suite would buy
 * pictures nobody compares.
 *
 * **Behind an environment variable, and not by choice.** `@vitest/coverage-v8`
 * refuses to initialise if *any* configured project uses a non-Chromium
 * browser, and it validates the config rather than the projects actually being
 * run — so `--project='!webkit'` does not help. `pnpm check` therefore runs the
 * coverage pass first and the WebKit pass second, as two commands.
 *
 * `forced-colors` stays Chromium-only regardless: WebKit has no equivalent mode
 * at all, which is itself worth knowing.
 */
const webkitProjects = process.env['KIRUA_WEBKIT']
  ? [
      {
        extends: true as const,
        test: {
          name: 'webkit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [...OTHER_PROJECTS_OWN],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          browser: {
            enabled: true as const,
            headless: true as const,
            screenshotFailures: false,
            provider: playwright({}),
            instances: [
              {
                browser: 'webkit' as const,
                viewport: { width: breakpointPx('lg'), height: 900 },
              },
            ],
          },
        },
      },
    ]
  : [];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The hydration test renders server markup inside a browser project, and
  // the variants test composes stories inside one. Keep these in the first
  // dependency-optimizer pass: discovering one after a browser starts reloads
  // the test mid-run, which can leave React with two dispatchers and reports
  // the interrupted files as "0 tests".
  optimizeDeps: { include: ['react-dom/server', '@storybook/react-vite', 'storybook/test'] },
  build: { target: BUILD_TARGET },
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    projects: [
      ...webkitProjects,
      ...storyProjects,
      /**
       * Windows high contrast, emulated. Forced colours replace every colour on
       * the page with a small user-chosen palette and **drop `box-shadow`
       * entirely**, so a token system is the thing it overrides hardest — and
       * none of that is visible in a normal render.
       *
       * Its own project because it is a browser *context* option, not something
       * a test can turn on. One file, so the cost is one extra browser.
       */
      {
        extends: true as const,
        test: {
          name: 'forced-colors',
          include: ['src/**/*.forced.test.{ts,tsx}'],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          browser: browser(breakpointPx('lg'), { forcedColors: 'active' }),
        },
      },
      /**
       * Reduced motion, emulated the same way and for the same reason.
       *
       * `prefers-reduced-motion` exists for people whose vestibular disorders
       * are triggered by movement, and the base layer answers it by flattening
       * every animation and transition to `0.01ms !important`. Like forced
       * colours it is a browser *context* option, so no test can turn it on
       * from inside the page — which is why it is a project and not a story.
       *
       * `!important` in a low layer beats `!important` in a high one, so the
       * rule sitting in `@layer base` is the strongest thing in the cascade.
       * That is the opposite of the forced-colors rules, which had to leave
       * `base` entirely — the difference is worth not re-deriving.
       */
      {
        extends: true as const,
        test: {
          name: 'reduced-motion',
          include: ['src/**/*.reduced.test.{ts,tsx}'],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          browser: browser(breakpointPx('lg'), { reducedMotion: 'reduce' }),
        },
      },
      /**
       * Appearance, compared against a committed picture.
       *
       * **One project, one width, one engine — and that is the whole point.**
       * A baseline is a baseline *for* a browser at a size. Left in the general
       * `unit:*` set this file ran at three widths against a single filename,
       * so the three runs overwrote each other and three of eleven comparisons
       * failed. Measured, not predicted.
       *
       * `lg` is the width the reference file was drawn at, so a diff here is a
       * diff against the design rather than against a reflow.
       *
       * The comparator lives here rather than at each call site. Anti-aliasing
       * moves by a pixel or two between runs and between machines, so zero
       * tolerance produces a suite that fails for reasons nobody can act on —
       * which is how a visual gate gets switched off. 1% of pixels is far below
       * a one-step padding change and far above rasterisation noise.
       */
      {
        extends: true as const,
        test: {
          name: 'visual',
          include: ['src/**/*.visual.test.{ts,tsx}'],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          browser: {
            ...browser(breakpointPx('lg')),
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch' as const,
                comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
              },
            },
          },
        },
      },
      /**
       * The only project here with **no browser at all**, and that absence is
       * the assertion.
       *
       * A React Server Component renders on a server, where `window` and
       * `document` do not exist. Every other project in this file runs in a
       * real browser precisely so the cascade resolves — which means not one of
       * them could ever notice a component reaching for a browser API during
       * render. Under `environment: 'node'` such a component throws.
       */
      {
        extends: true as const,
        test: {
          name: 'node',
          environment: 'node' as const,
          include: ['src/**/*.node.test.{ts,tsx}'],
        },
      },
      ...WIDTHS.map(({ name, width }) => ({
        extends: true as const,
        test: {
          name: `unit:${name}`,
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [...OTHER_PROJECTS_OWN],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          // Also a real browser. `contrast.ts` reads computed styles from the
          // shipped CSS, and a component's surface context only resolves where
          // the cascade does — jsdom would answer both questions wrongly, and
          // answer them confidently.
          browser: browser(width),
        },
      })),
    ],
    coverage: {
      provider: 'v8',
      // The tuple form is load-bearing: `skipFull` is a reporter option, and
      // set at the top level it is ignored. Left at its default the text table
      // omits every fully-covered file, so a green report reads as a report
      // with files missing from it.
      reporter: [['text', { skipFull: false }], 'html'],
      // `src/lib` only, and that is a choice. A component here is a `cva` map
      // and a spread: one object literal that evaluates on import, so line
      // coverage would report every variant as covered whether or not a story
      // ever renders it. The measure that matters for a component is variant
      // completeness, and `src/components/variants.test.tsx` enforces it by
      // rendering every story and failing on any variant none of them shows.
      include: ['src/lib/**'],
      // What the suite actually reaches today, not an aspiration. `src/lib` is
      // three small pure modules, so full cover is the honest number; the one
      // uncovered branch is a guard for a colour string no browser produces.
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 95 },
    },
  },
});
