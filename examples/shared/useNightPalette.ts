/**
 * The night palette of dark mode: `data-night-palette` on the root element,
 * which the design system's tokens read. Navy sets no attribute.
 *
 * Each section opens in its own night (`night` in `sections.ts`) and keeps the
 * visitor's choice for that section only; the hub opens in navy. The rule is
 * shared with the blocking script in `index.html`, which applies it before
 * first paint: a valid `?night=` value in the link wins, else the section's
 * stored choice, else its own night. A link can therefore carry one night to
 * someone else.
 *
 * Only names live here. A night's colours are written once, in the token
 * stylesheet, and `NightSwatch` shows them.
 */
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { NIGHT_PALETTES as NIGHTS, type NightPalette } from '@kobars/kirua';
import { SECTIONS, type Section } from '../sections';
import { sectionOf, useHashPath } from './useHashRoute';

const KEY = 'kirua-night-palette';

export const NIGHT_PALETTES: { id: NightPalette; label: string }[] = NIGHTS.map((id) => ({
  id,
  label: id[0]!.toUpperCase() + id.slice(1),
}));

const isNightPalette = (value: unknown): value is NightPalette =>
  NIGHT_PALETTES.some((option) => option.id === value);

const sectionFor = (path: string): Section | undefined =>
  SECTIONS.find((section) => section.id === sectionOf(path));

/** The storage key and the night a section, or the hub, opens in. */
function scope(section: Section | undefined): { key: string; fallback: NightPalette } {
  return section
    ? { key: `${KEY}:${section.id}`, fallback: section.night }
    : { key: KEY, fallback: 'navy' };
}

function read(section: Section | undefined): NightPalette {
  const fromUrl = new URLSearchParams(location.search).get('night');
  if (isNightPalette(fromUrl)) return fromUrl;
  const { key, fallback } = scope(section);
  try {
    const stored = localStorage.getItem(key);
    return isNightPalette(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

// A choice changes storage, which no browser event reports to the page that
// made it, so the hooks that read it are told directly. Another document of
// the app — another tab, or the page inside a `DeviceFrame` — does get a
// storage event, so a choice made in one shows in both.
const listeners = new Set<() => void>();
const onStorage = (event: StorageEvent) => {
  if (event.key === null || event.key.startsWith(KEY))
    listeners.forEach((listener) => listener());
};
function subscribe(onChange: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

/** The night of the section on screen, and a `choose` that stores one for it. */
export function useNightPalette() {
  const section = sectionFor(useHashPath());
  const palette = useSyncExternalStore(subscribe, () => read(section));

  // Only a choice made in the menu is stored. A night that arrived in a link
  // shows for this visit and leaves the visitor's own choices as they were.
  const choose = useCallback(
    (next: NightPalette) => {
      const { key, fallback } = scope(section);
      try {
        if (next === fallback) localStorage.removeItem(key);
        else localStorage.setItem(key, next);
      } catch {
        // A private window refuses storage. The choice just does not survive a reload.
      }
      // A choice made in the menu replaces the one the link carried.
      const url = new URL(location.href);
      if (url.searchParams.has('night')) {
        url.searchParams.delete('night');
        history.replaceState(history.state, '', url);
      }
      listeners.forEach((listener) => listener());
    },
    [section],
  );

  return { palette, choose };
}

/**
 * Puts the night of the section on screen on the root element. Called once,
 * by the app itself, so a section whose theme menu is not rendered still gets
 * its night.
 */
export function useApplyNightPalette() {
  const { palette } = useNightPalette();
  useEffect(() => {
    const root = document.documentElement;
    if (palette === 'navy') delete root.dataset.nightPalette;
    else root.dataset.nightPalette = palette;
  }, [palette]);
}
