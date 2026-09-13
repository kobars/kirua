/** Shared Vite configuration for example apps using local kirua aliases. */
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

const REPO = path.resolve(import.meta.dirname, '..');

/** Kept in step with `vite.config.ts` by `src/styles/browsers.test.ts`. */
const BUILD_TARGET = ['chrome120', 'edge120', 'safari16.4', 'firefox128'];

export interface ExampleOptions {
  /**
   * Where to copy static files from, if the app serves any. Only `marketing`
   * passes it: its hero reuses the character artwork in the repository's own
   * `public/`, and Vite resolves an unset `publicDir` against the app root,
   * which holds nothing to copy.
   */
  publicDir?: string;
}

export function exampleConfig(slug: string, options: ExampleOptions = {}): UserConfig {
  return {
    root: path.join(REPO, 'examples', slug),
    // Relative, so the built app works under any path a host serves it from.
    base: './',
    publicDir: options.publicDir ?? false,
    plugins: [react(), tailwindcss()],
    build: { target: BUILD_TARGET, outDir: 'dist', emptyOutDir: true },
    resolve: {
      alias: [
        // Longest first: `kirua/styles.css` must not be swallowed by `kirua`.
        {
          find: 'kirua/styles.css',
          replacement: path.join(REPO, 'examples', slug, 'styles.css'),
        },
        { find: 'kirua', replacement: path.join(REPO, 'src/components/index.ts') },
      ],
    },
  };
}
