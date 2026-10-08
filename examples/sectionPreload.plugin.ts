import type { Plugin, Rolldown } from 'vite';
import { SECTIONS } from './sections.ts';

/** The line in `index.html` the build fills in; as written, it names no file. */
const PLACEHOLDER = 'const sectionChunks = {};';

/**
 * For each section, the JavaScript files its lazily loaded chunk needs that
 * the entry does not already load, as paths relative to `index.html`.
 *
 * Throws when a section has no chunk of its own, so a renamed or moved
 * `App.tsx` fails the build instead of quietly losing its preload.
 */
export function sectionChunks(bundle: Rolldown.OutputBundle): Record<string, string[]> {
  const chunks = new Map(
    Object.values(bundle)
      .filter((output): output is Rolldown.OutputChunk => output.type === 'chunk')
      .map((chunk) => [chunk.fileName, chunk]),
  );
  const closure = (start: Rolldown.OutputChunk) => {
    const files = new Set<string>();
    const visit = (chunk: Rolldown.OutputChunk) => {
      if (files.has(chunk.fileName)) return;
      files.add(chunk.fileName);
      for (const name of chunk.imports) {
        const imported = chunks.get(name);
        if (imported) visit(imported);
      }
    };
    visit(start);
    return files;
  };
  const entry = [...chunks.values()].find((chunk) => chunk.isEntry);
  if (!entry) throw new Error('kirua-section-preload: the bundle has no entry chunk');
  const loaded = closure(entry);
  return Object.fromEntries(
    SECTIONS.map(({ id }) => {
      const chunk = [...chunks.values()].find((candidate) =>
        candidate.facadeModuleId?.endsWith(`/examples/${id}/App.tsx`),
      );
      if (!chunk) throw new Error(`kirua-section-preload: no chunk for ${id}/App.tsx`);
      return [id, [...closure(chunk)].filter((file) => !loaded.has(file))];
    }),
  );
}

/** `index.html` with each section's files written into its preload script. */
export function injectSectionChunks(html: string, map: Record<string, string[]>): string {
  return html.replace(PLACEHOLDER, `const sectionChunks = ${JSON.stringify(map)};`);
}

/**
 * Lets `index.html` start downloading the section the address names while the
 * entry is still downloading, rather than once the entry has run and asked
 * for it. Build only: in development there are no chunks to name.
 */
export function sectionPreload(): Plugin {
  return {
    name: 'kirua-section-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        return bundle ? injectSectionChunks(html, sectionChunks(bundle)) : html;
      },
    },
  };
}
