/**
 * The night palette of dark mode: `data-night-palette` on the root element,
 * which the design system's tokens read. Navy is the default and sets no
 * attribute.
 *
 * Shared with the blocking script in `index.html`, which applies the
 * stored choice before first paint by the same rule: a valid `?night=` value in
 * the link wins, else a valid stored one, else navy. A link can therefore carry
 * one night to someone else.
 *
 * Only names live here. A night's colours are written once, in the token
 * stylesheet, and `NightSwatch` shows them.
 */
import { useCallback, useEffect, useState } from 'react';
import type { NightPalette } from 'kirua';

const KEY = 'kirua-night-palette';

export const NIGHT_PALETTES: { id: NightPalette; label: string }[] = [
  { id: 'navy', label: 'Navy' },
  { id: 'graphite', label: 'Graphite' },
  { id: 'onyx', label: 'Onyx' },
  { id: 'ink', label: 'Ink' },
  { id: 'carbon', label: 'Carbon' },
];

const isNightPalette = (value: unknown): value is NightPalette =>
  NIGHT_PALETTES.some((option) => option.id === value);

function initial(): NightPalette {
  const fromUrl = new URLSearchParams(location.search).get('night');
  if (isNightPalette(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(KEY);
    return isNightPalette(stored) ? stored : 'navy';
  } catch {
    return 'navy';
  }
}

export function useNightPalette() {
  const [palette, setPalette] = useState<NightPalette>(initial);

  useEffect(() => {
    const root = document.documentElement;
    if (palette === 'navy') delete root.dataset.nightPalette;
    else root.dataset.nightPalette = palette;
    try {
      if (palette === 'navy') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, palette);
    } catch {
      // A private window refuses storage. The choice just does not survive a reload.
    }
  }, [palette]);

  const choose = useCallback((next: NightPalette) => {
    // A choice made in the menu replaces the one the link carried.
    const url = new URL(location.href);
    if (url.searchParams.has('night')) {
      url.searchParams.delete('night');
      history.replaceState(history.state, '', url);
    }
    setPalette(next);
  }, []);

  return { palette, choose };
}
