/**
 * ONE CONFIG FACTORY FOR THE FOUR EXAMPLE APPLICATIONS.
 *
 * Each app is a Vite *root*, not a package. There is no pnpm workspace here
 * and that is a decision, not an omission: a package depending on `kirua`
 * needs `kirua` to be a package — with `exports` and a build — and producing
 * one is the whole Distribution epic, which is deliberately unstarted. Node
 * resolution walks upward, so a root under `examples/` finds the single
 * `node_modules` at the top of the repository with no install-graph change at
 * all. See `board/decisions/example-apps-in-one-repo.md`.
 *
 * THE ALIAS IS THE POINT. An app imports the bare specifier `kirua`, exactly
 * as an outside consumer would, and never a path into `src`. That turns "the
 * app imports only the design system" from a claim into a grep:
 *
 *     grep -rn "from '@/" examples/        # must print nothing
 *     grep -rn "src/lib\|src/patterns" examples/
 *
 * An app written against `@/` could reach into `src/lib` and still look
 * correct. This one cannot. The day kirua becomes a published package the two
 * alias entries are deleted and not one line of application code moves.
 */
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

const REPO = path.resolve(import.meta.dirname, '..');

/** Kept in step with `vite.config.ts` by `src/styles/browsers.test.ts`. */
const BUILD_TARGET = ['chrome120', 'edge120', 'safari16.4', 'firefox128'];

export function exampleConfig(slug: string): UserConfig {
  return {
    root: path.join(REPO, 'examples', slug),
    // Relative, so the built app works under any path a host serves it from.
    base: './',
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
