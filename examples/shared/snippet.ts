import type { CodeTokenKind } from '@kobars/kirua';

/** What `highlight.plugin.ts` makes of `import snippet from './file.css?highlight'`. */
export interface Snippet {
  /** The file's text as written, for a copy control. */
  source: string;
  /** One entry per line; a part with no kind is plain text. */
  lines: { text: string; kind?: CodeTokenKind }[][];
}
