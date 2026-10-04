import { themes } from 'storybook/theming';

export type Mode = 'light' | 'dark';

export function colourMode(globals: Record<string, unknown> = {}): Mode {
  return globals['mode'] === 'dark' ? 'dark' : 'light';
}

/** The night palettes of dark mode. Navy is the default and sets no attribute. */
export const NIGHTS = ['navy', 'graphite', 'onyx', 'ink', 'carbon'] as const;
export type Night = (typeof NIGHTS)[number];

/** Reads the toolbar global, or `night` from globals already normalised and
 *  posted on to an embedded docs frame. */
export function nightPalette(globals: Record<string, unknown> = {}): Night {
  const night = globals['nightPalette'] ?? globals['night'];
  return NIGHTS.find((name) => name === night) ?? 'navy';
}

export const docsThemes = { light: themes.light, dark: themes.dark };
