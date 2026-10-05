import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import NIGHTS from './nights.json';

/**
 * `nights.json` is the one list of night palette names that the tests, the
 * Storybook toolbar and the example sweeps iterate. A night added to the CSS
 * and not to the list would ship with no contrast run and no axe run, so the
 * list is held to the selectors that define the palettes. The first name is
 * the default: plain `.dark` with no attribute.
 */
const read = (file: string) => readFileSync(path.join(import.meta.dirname, file), 'utf8');

const semanticCss = read('tokens.semantic.css');

const selected = (pattern: RegExp) =>
  [...semanticCss.matchAll(pattern)].map((match) => match[1]);

describe('the night palette list', () => {
  it('names every swatch the CSS defines, in the order written', () => {
    expect(NIGHTS).toEqual(selected(/\[data-night-swatch='([a-z]+)'\]/g));
  });

  it('names the default first, and every other night by its attribute', () => {
    expect(NIGHTS.slice(1)).toEqual(selected(/\.dark\[data-night-palette='([a-z]+)'\]/g));
    expect(semanticCss).toMatch(
      new RegExp(`\\.dark,\\s*\\[data-night-swatch='${NIGHTS[0]}'\\]`),
    );
  });

  it('is the set the NightSwatch type accepts', () => {
    const type = read('../components/NightSwatch.tsx').match(
      /export type NightPalette = ([^;]+);/,
    )?.[1];
    expect(type?.split('|').map((member) => member.trim().replace(/^'|'$/g, ''))).toEqual(
      NIGHTS,
    );
  });
});
