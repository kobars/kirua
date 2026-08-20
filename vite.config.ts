/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: [path.join(dirname, 'src/test/setup.ts')],
          // Also a real browser. `contrast.ts` reads computed styles from the
          // shipped CSS, and a component's surface context only resolves where
          // the cascade does — jsdom would answer both questions wrongly.
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
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
      // uncovered branch is the `?? [0, 0, 0]` guard for a colour string no
      // browser produces. Raise it when a test raises it.
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 95 },
    },
  },
});
