/**
 * The example app: one Vite app rooted here, with each section in its own
 * directory and its own lazily loaded chunk.
 */
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { highlight } from './highlight.plugin.ts';
import { SECTIONS } from './sections.ts';

const ROOT = import.meta.dirname;
const REPO = path.resolve(ROOT, '..');

/** Kept in step with `vite.config.ts` by `src/styles/browsers.test.ts`. */
const BUILD_TARGET = ['chrome120', 'edge120', 'safari16.4', 'firefox128'];

/**
 * Gives the blocking script in `index.html` each section's night, so the page
 * paints in it before any module has loaded and `sections.ts` stays the one
 * place the nights are written.
 */
function sectionNights(): Plugin {
  const nights = JSON.stringify(Object.fromEntries(SECTIONS.map((s) => [s.id, s.night])));
  return {
    name: 'kirua-section-nights',
    transformIndexHtml: (html) => html.replace('__SECTION_NIGHTS__', nights),
  };
}

export default defineConfig({
  root: ROOT,
  // Relative, so the built app works under any path a host serves it from.
  base: './',
  // The repository's own `public/`: the favicon, and the character artwork the
  // marketing hero reuses, served from where it already is rather than copied.
  publicDir: path.join(REPO, 'public'),
  plugins: [react(), tailwindcss(), highlight(), sectionNights()],
  build: {
    target: BUILD_TARGET,
    outDir: 'dist',
    emptyOutDir: true,
    // `tools/perf-check.mjs` reads it to weigh what each section downloads.
    manifest: true,
    rolldownOptions: {
      // The barrel only re-exports. Declared free of side effects, it is looked
      // through rather than kept, so a component lands in the chunk of the
      // sections that use it; kept, it puts every component the barrel names
      // in the entry, because the entry imports the barrel too.
      treeshake: { moduleSideEffects: (id) => !id.endsWith('/src/components/index.ts') },
    },
  },
  resolve: {
    alias: [
      // Longest first: the stylesheet must not be swallowed by the package entry.
      { find: '@kobars/kirua/styles.css', replacement: path.join(ROOT, 'styles.css') },
      { find: '@kobars/kirua', replacement: path.join(REPO, 'src/components/index.ts') },
      // The components import each other through `@/`, as in the root config.
      { find: '@', replacement: path.join(REPO, 'src') },
    ],
  },
});
