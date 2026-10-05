import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import NIGHTS from './nights.json';

/**
 * The example app's `index.html` applies the stored night before first paint, and
 * the application decides it again once it runs. If the two rules differ, the
 * page paints one night and switches to the other a frame later. The rule both
 * must follow: a valid value in the link wins, else a valid stored value, else
 * navy, which sets no attribute.
 */

const EXAMPLES = path.join(import.meta.dirname, '../../examples');

const files = (name: string) =>
  readdirSync(EXAMPLES, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name === name)
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter(
      (file) =>
        !file.split(path.sep).some((part) => part === 'dist' || part === 'node_modules'),
    );

/** Every example host document. */
const hosts = files('index.html');

/** Every inline script in the head, in document order. */
const inlineScripts = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (match) => match[1] ?? '',
  );

interface Boot {
  search: string;
  stored: Record<string, string>;
  storageThrows?: boolean;
}

/**
 * Runs the blocking scripts against a fake page and reads what they set. Each
 * runs on its own, as a browser runs separate script elements: one that throws
 * does not stop the next.
 */
function boot(scripts: string[], { search, stored, storageThrows = false }: Boot) {
  const dataset: Record<string, string> = {};
  const storage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('SecurityError');
      return stored[key] ?? null;
    },
  };
  const page = {
    URLSearchParams,
    location: { search },
    localStorage: storage,
    matchMedia: () => ({ matches: false }),
    document: { documentElement: { dataset, classList: { toggle: () => {} } } },
  };
  for (const script of scripts) {
    try {
      runInNewContext(script, page);
    } catch {
      // The browser reports it and moves on to the next script element.
    }
  }
  return dataset['nightPalette'];
}

/** The hook's rule, written out independently of either implementation. */
function expected(fromUrl: string | null, stored: string | undefined) {
  if (fromUrl !== null && NIGHTS.includes(fromUrl)) return fromUrl;
  if (stored !== undefined && NIGHTS.includes(stored)) return stored;
  return 'navy';
}

const URL_VALUES = [null, 'onyx', 'navy', 'slate'];
const STORED_VALUES = [undefined, 'carbon', 'bogus'];

describe('the blocking script follows the night palette hook', () => {
  it('finds at least one example host document', () => {
    expect(hosts.length).toBeGreaterThan(0);
  });

  // The hook reads the system's own list; an inline script cannot import, so
  // each host document's copy is held to it here.
  it.each(hosts.map((file) => [path.relative(EXAMPLES, file), file]))(
    '%s lists the same nights as the system',
    (_, file) => {
      const listed = readFileSync(file, 'utf8').match(/const nights = (\[[^\]]*\])/)?.[1];
      expect(listed && JSON.parse(listed.replaceAll("'", '"'))).toEqual(NIGHTS);
    },
  );

  describe.each(hosts.map((file) => [path.relative(EXAMPLES, file), file]))('%s', (_, file) => {
    const scripts = inlineScripts(file);

    it.each(
      URL_VALUES.flatMap((fromUrl) =>
        STORED_VALUES.map((stored) => [fromUrl, stored] as const),
      ),
    )('link %s, stored %s', (fromUrl, stored) => {
      const night = boot(scripts, {
        search: fromUrl === null ? '' : `?night=${fromUrl}`,
        stored: stored === undefined ? {} : { 'kirua-night-palette': stored },
      });
      const want = expected(fromUrl, stored);
      expect(night).toBe(want === 'navy' ? undefined : want);
    });

    it('takes a valid link value when storage is refused', () => {
      expect(boot(scripts, { search: '?night=ink', stored: {}, storageThrows: true })).toBe(
        'ink',
      );
    });
  });
});
