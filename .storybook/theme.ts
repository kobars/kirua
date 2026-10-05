import { themes } from 'storybook/theming';
import type { NightPalette } from '../src/components/NightSwatch';
import NIGHT_NAMES from '../src/styles/nights.json';

export type Mode = 'light' | 'dark';

export function colourMode(globals: Record<string, unknown> = {}): Mode {
  return globals['mode'] === 'dark' ? 'dark' : 'light';
}

/** The night palettes of dark mode. The first is the default and sets no
 *  attribute. `nights.node.test.ts` holds the type and the list to the same
 *  names. */
export const NIGHTS = NIGHT_NAMES as readonly NightPalette[];
export type Night = NightPalette;
const DEFAULT_NIGHT = NIGHTS[0] ?? 'navy';

/** Reads the toolbar global, or `night` from globals already normalised and
 *  posted on to an embedded docs frame. */
export function nightPalette(globals: Record<string, unknown> = {}): Night {
  const night = globals['nightPalette'] ?? globals['night'];
  return NIGHTS.find((name) => name === night) ?? DEFAULT_NIGHT;
}

export const docsThemes = { light: themes.light, dark: themes.dark };
