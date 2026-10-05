import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Components read the semantic layer only. A utility from a primitive ramp
 * renders, passes every type and lint rule, and silently opts out of contrast
 * measurement, surface contexts, `.dark` and every night palette — so the
 * source is read as text here.
 */

const COMPONENTS_DIR = path.join(import.meta.dirname);
const PRIMITIVES = readFileSync(
  path.join(COMPONENTS_DIR, '../styles/tokens.primitives.css'),
  'utf8',
);

/** Every colour ramp the primitive layer declares, plus Tailwind's own two. */
const ramps = [
  ...new Set([...PRIMITIVES.matchAll(/--color-([a-z]+)-\d+\s*:/g)].map((match) => match[1])),
  'white',
  'black',
];

const PREFIX =
  'bg|text|border(?:-[a-z]{1,2})?|ring(?:-offset)?|inset-ring|outline|fill|stroke|from|via|to|decoration|accent|caret|shadow|divide';
const UTILITY = new RegExp(
  `(?<![\\w-])(?:${PREFIX})-(?:${ramps.join('|')})(?:-\\d+)?(?:/\\d+)?(?![\\w-])`,
  'g',
);
const VARIABLE = new RegExp(`--color-(?:${ramps.join('|')})-\\d+`, 'g');

function findPrimitives(source: string): string[] {
  return [...source.matchAll(UTILITY), ...source.matchAll(VARIABLE)].map((match) => match[0]);
}

describe('colour in components', () => {
  it('reads the semantic layer, never a primitive ramp', () => {
    const offenders = readdirSync(COMPONENTS_DIR)
      .filter((name) => /\.tsx?$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name))
      .flatMap((name) =>
        findPrimitives(readFileSync(path.join(COMPONENTS_DIR, name), 'utf8')).map(
          (found) => `${name}: ${found}`,
        ),
      );
    expect(offenders).toEqual([]);
  });

  /** Tailwind scans this file's text too, so a planted class is spelled with
   *  `~` and assembled here; written out, it would ship in the hero's CSS. */
  const plant = (text: string) => text.replaceAll('~', '-');

  it('detects the defect it exists for', () => {
    expect(ramps).toEqual(expect.arrayContaining(['blue', 'neutral', 'amber', 'navy']));
    expect(findPrimitives(plant(`'rounded-pill bg~amber~500 text~white'`))).toEqual(
      ['bg~amber~500', 'text~white'].map(plant),
    );
    expect(findPrimitives(plant(`'hover:border~s~blue~300/50 ring~offset~neutral~0'`))).toEqual(
      ['border~s~blue~300/50', 'ring~offset~neutral~0'].map(plant),
    );
    expect(findPrimitives(plant(`'bg~(~~color~red~600)'`))).toEqual([plant('~~color~red~600')]);
    expect(findPrimitives(`'bg-brand text-fg ring-page bg-avatar-1 text-on-avatar-1'`)).toEqual(
      [],
    );
    // Prose that names a primitive is not a class.
    expect(findPrimitives(`/* white on blue-500 is only 3.64:1 */`)).toEqual([]);
  });
});
