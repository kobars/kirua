import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { injectSectionNights } from '../../examples/sectionNights.plugin';
import { SECTIONS } from '../../examples/sections';
import NIGHTS from './nights.json';

/**
 * The example app's `index.html` applies the stored night before first paint, and
 * the application decides it again once it runs. If the two rules differ, the
 * page paints one night and switches to the other a frame later. The rule both
 * must follow: a valid value in the link wins, else a valid value stored for
 * the section on screen, else that section's own night (navy on the hub, which
 * sets no attribute).
 *
 * The scripts run as the build ships them, with each section's night filled in.
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

/** Every inline script in the head, in document order, as the build ships it. */
const inlineScripts = (file: string) =>
  [
    ...injectSectionNights(readFileSync(file, 'utf8')).matchAll(
      /<script>([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => match[1] ?? '');

interface Boot {
  hash?: string;
  search: string;
  stored: Record<string, string>;
  storageThrows?: boolean;
}

/**
 * Runs the blocking scripts against a fake page and reads what they set. Each
 * runs on its own, as a browser runs separate script elements: one that throws
 * does not stop the next.
 */
function boot(scripts: string[], { hash = '', search, stored, storageThrows = false }: Boot) {
  const dataset: Record<string, string> = {};
  const storage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('SecurityError');
      return stored[key] ?? null;
    },
  };
  const page = {
    URLSearchParams,
    location: { hash, search },
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
function expected(fromUrl: string | null, stored: string | undefined, own = 'navy') {
  if (fromUrl !== null && NIGHTS.includes(fromUrl)) return fromUrl;
  if (stored !== undefined && NIGHTS.includes(stored)) return stored;
  return own;
}

const attribute = (night: string) => (night === 'navy' ? undefined : night);

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
      expect(night).toBe(attribute(expected(fromUrl, stored)));
    });

    // A section reads only its own key, and opens in its own night.
    it.each(
      SECTIONS.flatMap((section) =>
        URL_VALUES.flatMap((fromUrl) =>
          STORED_VALUES.map((stored) => [section.id, fromUrl, stored, section.night] as const),
        ),
      ),
    )('%s: link %s, stored %s', (id, fromUrl, stored, own) => {
      const night = boot(scripts, {
        hash: `#/${id}/some/route`,
        search: fromUrl === null ? '' : `?night=${fromUrl}`,
        stored: {
          'kirua-night-palette': 'graphite',
          ...(stored === undefined ? {} : { [`kirua-night-palette:${id}`]: stored }),
        },
      });
      expect(night).toBe(attribute(expected(fromUrl, stored, own)));
    });

    it('takes a valid link value when storage is refused', () => {
      expect(boot(scripts, { search: '?night=ink', stored: {}, storageThrows: true })).toBe(
        'ink',
      );
    });

    it("falls back to the section's own night when storage is refused", () => {
      for (const { id, night } of SECTIONS)
        expect(
          boot(scripts, { hash: `#/${id}/`, search: '', stored: {}, storageThrows: true }),
        ).toBe(attribute(night));
    });
  });
});
