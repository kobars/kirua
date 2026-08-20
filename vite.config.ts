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
const browser = (width: number, forcedColors: 'none' | 'active' = 'none') => ({
  enabled: true as const,
  headless: true as const,
  provider: playwright({ contextOptions: { forcedColors } }),
  instances: [{ browser: 'chromium' as const, viewport: { width, height: 900 } }],
});

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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    projects: [
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
          browser: browser(breakpointPx('lg'), 'active'),
        },
      },
      ...WIDTHS.map(({ name, width }) => ({
        extends: true as const,
        test: {
          name: `unit:${name}`,
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.forced.test.{ts,tsx}'],
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
      include: ['src/lib/**'],
      // What the suite actually reaches today, not an aspiration. `src/lib` is
      // three small pure modules, so full cover is the honest number; the one
      // uncovered branch is a guard for a colour string no browser produces.
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 95 },
    },
  },
});
