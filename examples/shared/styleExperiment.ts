/**
 * TEMPORARY: the switch for the style experiment in `src/styles/experiment.css`.
 *
 * Shared with the blocking script in each `index.html`, which applies the stored
 * choice before first paint. A `?style=clay`, `?style=hybrid` or `?style=hybrid-clay` link sets the
 * choice too, so one comparison can be sent as a URL.
 */
import { useCallback, useEffect, useState } from 'react';
import experimentCss from '../../src/styles/experiment.css?inline';

/* Added as a style element, not imported into each app's stylesheet, so the
 * experiment stays outside the CSS size budget. Its rules match nothing until
 * the root element carries the attribute, and this module loads before the
 * first render, so a stored choice never shows unstyled. */
const style = document.createElement('style');
style.dataset.styleExperiment = '';
style.textContent = experimentCss;
document.head.append(style);

export type StyleExperiment = 'off' | 'clay' | 'hybrid' | 'hybrid-clay';

const KEY = 'kirua-style-experiment';

export const STYLE_EXPERIMENTS: { id: StyleExperiment; label: string }[] = [
  { id: 'off', label: 'Kirua' },
  { id: 'clay', label: 'Pure Clay' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'hybrid-clay', label: 'Hybrid with Clay shapes' },
];

const isExperiment = (value: unknown): value is StyleExperiment =>
  STYLE_EXPERIMENTS.some((option) => option.id === value);

function initial(): StyleExperiment {
  const fromUrl = new URLSearchParams(location.search).get('style');
  if (isExperiment(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(KEY);
    return isExperiment(stored) ? stored : 'off';
  } catch {
    return 'off';
  }
}

export function useStyleExperiment() {
  const [experiment, setExperiment] = useState<StyleExperiment>(initial);

  useEffect(() => {
    const root = document.documentElement;
    if (experiment === 'off') delete root.dataset.styleExperiment;
    else root.dataset.styleExperiment = experiment;
    try {
      if (experiment === 'off') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, experiment);
    } catch {
      // A private window refuses storage. The choice just does not survive a reload.
    }
  }, [experiment]);

  const choose = useCallback((next: StyleExperiment) => {
    // A choice made in the menu replaces the one the link carried.
    const url = new URL(location.href);
    if (url.searchParams.has('style')) {
      url.searchParams.delete('style');
      history.replaceState(history.state, '', url);
    }
    setExperiment(next);
  }, []);

  return { experiment, choose };
}

/* The night palette of the `hybrid-clay` dark mode. Navy is the default and
 * carries no attribute; `?night=graphite` and the like set it from a link. */
export type NightPalette = 'navy' | 'graphite' | 'onyx' | 'ink' | 'carbon';

const NIGHT_KEY = 'kirua-night-palette';

/* The swatch beside each name reads the night's colours from `experiment.css`
 * through `data-night-swatch`, so they are written only there. */
export const NIGHT_PALETTES: { id: NightPalette; label: string }[] = [
  { id: 'navy', label: 'Navy night' },
  { id: 'graphite', label: 'Graphite' },
  { id: 'onyx', label: 'Onyx' },
  { id: 'ink', label: 'Ink' },
  { id: 'carbon', label: 'Carbon' },
];

const isNightPalette = (value: unknown): value is NightPalette =>
  NIGHT_PALETTES.some((option) => option.id === value);

function initialNight(): NightPalette {
  const fromUrl = new URLSearchParams(location.search).get('night');
  if (isNightPalette(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(NIGHT_KEY);
    return isNightPalette(stored) ? stored : 'navy';
  } catch {
    return 'navy';
  }
}

export function useNightPalette() {
  const [palette, setPalette] = useState<NightPalette>(initialNight);

  useEffect(() => {
    const root = document.documentElement;
    if (palette === 'navy') delete root.dataset.nightPalette;
    else root.dataset.nightPalette = palette;
    try {
      if (palette === 'navy') localStorage.removeItem(NIGHT_KEY);
      else localStorage.setItem(NIGHT_KEY, palette);
    } catch {
      // A private window refuses storage. The choice just does not survive a reload.
    }
  }, [palette]);

  const choose = useCallback((next: NightPalette) => {
    const url = new URL(location.href);
    if (url.searchParams.has('night')) {
      url.searchParams.delete('night');
      history.replaceState(history.state, '', url);
    }
    setPalette(next);
  }, []);

  return { palette, choose };
}
