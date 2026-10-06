import { createElement, useMemo } from 'react';
import { useGlobals } from 'storybook/manager-api';
import { Select } from 'storybook/internal/components';
import { NIGHTS, colourMode, nightPalette } from './theme';

// `createElement` rather than JSX: the manager bundle compiles JSX to the
// classic `React.createElement` and has no `React` in scope.

const MODE_OPTIONS = [
  { value: 'light', title: 'Light' },
  { value: 'dark', title: 'Dark' },
];

const NIGHT_OPTIONS = NIGHTS.map((night, index) => {
  const name = night.charAt(0).toUpperCase() + night.slice(1);
  return { value: night, title: index === 0 ? `${name} night` : name };
});

const icon = (d: string) =>
  createElement(
    'svg',
    { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'currentColor', 'aria-hidden': true },
    createElement('path', { d, fillRule: 'evenodd' }),
  );
const CIRCLE = icon(
  'M7 1a6 6 0 1 1 0 12A6 6 0 0 1 7 1Zm0 1.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z',
);
const MOON = icon(
  'M8.4 1.1a.5.5 0 0 0-.6.6 4.6 4.6 0 0 1-6.1 6.1.5.5 0 0 0-.6.6A6 6 0 1 0 8.4 1.1Z',
);

/**
 * Colour mode, then the night palette of dark mode, in that order: the night
 * menu belongs to dark mode, so it follows the mode menu and is not shown
 * while the page is light, where every choice in it would change nothing.
 * Both are the manager's own because a built-in toolbar menu can neither hide
 * itself nor sit after one an addon adds.
 */
export function ThemeTools() {
  const [globals, updateGlobals, storyGlobals] = useGlobals();
  const mode = colourMode(globals);
  const night = nightPalette(globals);
  const modeSelected = useMemo(() => [mode], [mode]);
  const nightSelected = useMemo(() => [night], [night]);
  return createElement(
    'div',
    { style: { display: 'flex', gap: 6, alignItems: 'center' } },
    createElement(
      Select,
      {
        ariaLabel: 'Colour mode',
        tooltip: 'Colour mode',
        icon: CIRCLE,
        options: MODE_OPTIONS,
        defaultOptions: modeSelected,
        disabled: 'mode' in storyGlobals,
        onSelect: (value) => updateGlobals({ mode: value }),
      },
      'Mode',
    ),
    mode === 'dark' &&
      createElement(
        Select,
        {
          ariaLabel: 'Night palette of dark mode',
          tooltip: 'Night palette of dark mode',
          icon: MOON,
          options: NIGHT_OPTIONS,
          defaultOptions: nightSelected,
          disabled: 'nightPalette' in storyGlobals,
          onSelect: (value) => updateGlobals({ nightPalette: value }),
        },
        'Night',
      ),
  );
}
