import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * TEMPORARY, with `src/styles/experiment.css`.
 *
 * Each example's `index.html` applies the stored style and night before first
 * paint, and `examples/shared/styleExperiment.ts` decides them again once the
 * app runs. If the two rules differ, the page paints one choice and switches to
 * the other a frame later. The rule both must follow: a valid value in the link
 * wins, else a valid stored value, else the default.
 */

const EXAMPLES = path.join(import.meta.dirname, '../../examples');
const apps = readdirSync(EXAMPLES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'shared')
  .map((entry) => entry.name)
  .filter((name) => {
    try {
      readFileSync(path.join(EXAMPLES, name, 'index.html'));
      return true;
    } catch {
      return false;
    }
  });

/** Every inline script in the head, in document order. */
const inlineScripts = (app: string) => {
  const html = readFileSync(path.join(EXAMPLES, app, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (match) => match[1] ?? '',
  );
  if (scripts.length === 0) throw new Error(`${app}/index.html has no inline script`);
  return scripts;
};

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
  return { style: dataset['styleExperiment'], night: dataset['nightPalette'] };
}

const STYLES = ['off', 'clay', 'hybrid', 'hybrid-clay'];
const NIGHTS = ['navy', 'graphite', 'onyx', 'ink', 'carbon'];

/** The hook's rule, written out independently of either implementation. */
function expected(fromUrl: string | null, stored: string | undefined, ids: string[]) {
  if (fromUrl !== null && ids.includes(fromUrl)) return fromUrl;
  if (stored !== undefined && ids.includes(stored)) return stored;
  return ids[0];
}

const URL_VALUES = [null, 'clay', 'off', 'slate'];
const STORED_VALUES = [undefined, 'hybrid-clay', 'bogus'];
const NIGHT_URL_VALUES = [null, 'onyx', 'navy', 'slate'];
const NIGHT_STORED_VALUES = [undefined, 'carbon', 'bogus'];

describe('the blocking script follows the hook', () => {
  it('finds all five examples', () => {
    expect(apps).toHaveLength(5);
  });

  it('is the same script in every example', () => {
    const scripts = new Set(apps.map((app) => inlineScripts(app).join('\n')));
    expect(scripts.size).toBe(1);
  });

  describe.each(apps)('%s', (app) => {
    const script = inlineScripts(app);

    it.each(
      URL_VALUES.flatMap((fromUrl) =>
        STORED_VALUES.map((stored) => [fromUrl, stored] as const),
      ),
    )('style: link %s, stored %s', (fromUrl, stored) => {
      const search = fromUrl === null ? '' : `?style=${fromUrl}`;
      const { style } = boot(script, {
        search,
        stored: stored === undefined ? {} : { 'kirua-style-experiment': stored },
      });
      const want = expected(fromUrl, stored, STYLES);
      expect(style).toBe(want === 'off' ? undefined : want);
    });

    it.each(
      NIGHT_URL_VALUES.flatMap((fromUrl) =>
        NIGHT_STORED_VALUES.map((stored) => [fromUrl, stored] as const),
      ),
    )('night: link %s, stored %s', (fromUrl, stored) => {
      const search = fromUrl === null ? '' : `?night=${fromUrl}`;
      const { night } = boot(script, {
        search,
        stored: stored === undefined ? {} : { 'kirua-night-palette': stored },
      });
      const want = expected(fromUrl, stored, NIGHTS);
      expect(night).toBe(want === 'navy' ? undefined : want);
    });

    it('takes a valid link value when storage is refused', () => {
      const result = boot(script, {
        search: '?style=hybrid-clay&night=ink',
        stored: {},
        storageThrows: true,
      });
      expect(result).toEqual({ style: 'hybrid-clay', night: 'ink' });
    });
  });
});
