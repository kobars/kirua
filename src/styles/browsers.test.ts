import packageJson from '../../package.json';
import viteConfigSource from '../../vite.config.ts?raw';
import exampleConfigSource from '../../examples/vite.config.ts?raw';
import kiruaCss from '@/styles/kirua.css?raw';
import { describe, expect, it } from 'vitest';

/**
 * `styles/kirua.css`, not `index.css`: the layers live there, so that the
 * example app can import them without the hero page's entry point, and every
 * feature this file looks for is one import further down.
 */

/**
 * One declared matrix, read by two things that cannot ask each other.
 *
 * `browserslist` in `package.json` is the statement of support. Vite does not
 * read it — it reads `build.target` — so the two would be free to disagree, and
 * a matrix the build ignores is worse than no matrix at all, because it reads
 * like a guarantee.
 */
const declared = packageJson.browserslist;

/**
 * Read out of the source text, not imported. Importing `vite.config.ts` into a
 * browser test drags in its Node dependencies — `fsevents` fails to parse as
 * UTF-8 and the whole run dies on it.
 */
const targetOf = (source: string) => {
  const block = source.match(/const BUILD_TARGET = \[([^\]]+)\]/)?.[1] ?? '';
  return [...block.matchAll(/'([^']+)'/g)].map(([, value]) => value as string);
};
const target = targetOf(viteConfigSource);

describe('the declared matrix and the build target agree', () => {
  it('names the same four engines', () => {
    expect(declared).toHaveLength(4);
    expect(target).toHaveLength(4);
  });

  it.each([
    ['chrome', '120'],
    ['edge', '120'],
    ['safari', '16.4'],
    ['firefox', '128'],
  ])('%s >= %s in both', (engine, version) => {
    expect(declared).toContain(`${engine} >= ${version}`);
    expect(target).toContain(`${engine}${version}`);
  });

  it('the example app builds for the same target', () => {
    expect(targetOf(exampleConfigSource)).toEqual(target);
  });
});

/**
 * The floors are not arbitrary. Each one is the newest feature the system
 * actually uses, so a floor that drops has to be a deliberate decision about a
 * feature rather than a number somebody rounded down.
 */
describe('the features the floors were set by are really in use', () => {
  it(':dir() — the reason Chrome is 120 and not 111', () => {
    // The CornerGlint mirror has to re-invert in a right-to-left document, and
    // `:dir()` is the only selector that follows inherited direction.
    expect(kiruaCss).toContain(':dir(rtl)');
  });

  it('forced-colors — Chromium and Firefox only, no WebKit equivalent', () => {
    expect(kiruaCss).toContain('forced-colors: active');
  });

  it('@custom-variant and @utility — Tailwind 4, which sets the same floor', () => {
    expect(kiruaCss).toContain('@custom-variant');
  });
});
