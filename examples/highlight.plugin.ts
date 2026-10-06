/**
 * `import snippet from './file.css?highlight'` — a code snippet, highlighted
 * while the app is built.
 *
 * The module is `{ source, lines }`: the text as written, for a copy control,
 * and each line as a list of `{ text, kind? }` parts for `CodeToken`. Shiki
 * runs here, in Node, with its CSS-variables theme, so its answer is a token
 * type rather than a colour and kirua's own tokens do the colouring. None of
 * Shiki reaches the browser.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  createCssVariablesTheme,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki';
import type { Plugin } from 'vite';

const QUERY = '?highlight';
/** Ends in `.js` so Vite's CSS and JSON plugins do not claim a `.css` or `.json` snippet. */
const PREFIX = '\0highlight:';
const SUFFIX = '.js';

const LANGUAGES: Partial<Record<string, BundledLanguage>> = {
  '.css': 'css',
  '.sh': 'bash',
  '.json': 'json',
  '.tsx': 'tsx',
};

/** Shiki's variable names, each to the `CodeToken` kind that colours it. */
const KINDS: Record<string, string> = {
  'token-keyword': 'keyword',
  'token-string': 'string',
  'token-string-expression': 'string',
  'token-link': 'string',
  'token-constant': 'constant',
  'token-function': 'function',
  'token-parameter': 'parameter',
  'token-comment': 'comment',
  'token-punctuation': 'punctuation',
};

const theme = createCssVariablesTheme({ name: 'kirua', variablePrefix: '--shiki-' });

interface Part {
  text: string;
  kind?: string;
}

export function highlight(): Plugin {
  let highlighter: Promise<Highlighter> | undefined;

  return {
    name: 'kirua:highlight',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith(QUERY)) return null;
      const resolved = await this.resolve(source.slice(0, -QUERY.length), importer, {
        skipSelf: true,
      });
      return resolved && PREFIX + resolved.id + SUFFIX;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const file = id.slice(PREFIX.length, -SUFFIX.length);
      const lang = LANGUAGES[path.extname(file)];
      if (!lang) this.error(`No highlighting language for ${file}.`);

      this.addWatchFile(file);
      // A trailing newline is the file's, not the snippet's.
      const source = (await readFile(file, 'utf8')).replace(/\n$/, '');

      highlighter ??= createHighlighter({
        themes: [theme],
        langs: Object.values(LANGUAGES).filter((lang) => lang !== undefined),
      });
      const tokens = (await highlighter).codeToTokensBase(source, { lang, theme });

      const lines = tokens.map((line) => {
        const parts: Part[] = [];
        for (const token of line) {
          const variable = token.color?.match(/^var\(--shiki-(.+)\)$/)?.[1] ?? '';
          // Whitespace is plain whatever Shiki called it, so it merges with its neighbours.
          const kind = token.content.trim() ? KINDS[variable] : undefined;
          const last = parts.at(-1);
          if (last && last.kind === kind) last.text += token.content;
          else parts.push(kind ? { text: token.content, kind } : { text: token.content });
        }
        return parts;
      });

      return `export default ${JSON.stringify({ source, lines })};`;
    },
  };
}
