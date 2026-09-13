import { themes } from 'storybook/theming';

export type Mode = 'light' | 'dark';

export function colourMode(globals: Record<string, unknown> = {}): Mode {
  return globals['mode'] === 'dark' ? 'dark' : 'light';
}

export const docsThemes = { light: themes.light, dark: themes.dark };
