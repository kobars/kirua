/**
 * Where a bundle comes from, decided at build time and never by the app.
 *
 * `board/` is listed in `.git/info/exclude` and versioned only in a local
 * overlay, so it exists on one machine. The committed sample under
 * `./sample` exists everywhere. `main.tsx` globs the real board and passes it
 * to `choose`; Storybook and tests import `sample` directly, so they render
 * the same board on every machine. The reasoning is written beside the sample
 * in `src/board/sample/index.md`.
 */

export interface Source {
  name: 'board' | 'sample';
  /** Keyed by bundle-relative resource, `/tasks/field.md`. */
  files: Record<string, string>;
}

/** `import.meta.glob` keys are paths from the importing file; a bundle wants
 *  paths from its own root. `./sample/tasks/x.md` and `/board/tasks/x.md`
 *  both become `/tasks/x.md`. */
export function relativeTo(
  prefix: string,
  files: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, text] of Object.entries(files)) {
    out[path.startsWith(prefix) ? path.slice(prefix.length) : path] = text;
  }
  return out;
}

export const sample: Source = {
  name: 'sample',
  files: relativeTo(
    './sample',
    import.meta.glob<string>('./sample/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: true,
    }),
  ),
};

/** The real board when the glob found anything, the sample otherwise. */
export function choose(board: Record<string, string>): Source {
  return Object.keys(board).length > 0 ? { name: 'board', files: board } : sample;
}
