import { lazy, type ComponentType } from 'react';
import type { SectionId } from './sections';
import { sectionOf } from './shared/useHashRoute';

const LOADERS: Record<SectionId, () => Promise<{ App: ComponentType }>> = {
  shop: () => import('./shop/App'),
  his: () => import('./his/App'),
  social: () => import('./social/App'),
  mobile: () => import('./mobile/App'),
  assistant: () => import('./assistant/App'),
  marketing: () => import('./marketing/App'),
};

const page = (id: SectionId) =>
  lazy(() => LOADERS[id]().then((module) => ({ default: module.App })));

/**
 * Each section is its own chunk, so opening one downloads that section and
 * the shared code, not the other five.
 */
export const PAGES: Record<SectionId, ComponentType> = {
  shop: page('shop'),
  his: page('his'),
  social: page('social'),
  mobile: page('mobile'),
  assistant: page('assistant'),
  marketing: page('marketing'),
};

/**
 * The section the address opened on, once `loadInitialSection` has loaded it.
 * It is rendered directly for the rest of the visit, never through `PAGES`:
 * React treats the two as different components, so switching between them
 * would remount the section and lose its state.
 */
export const INITIAL: Partial<Record<SectionId, ComponentType>> = {};

/**
 * Loads the section the address opens on, to be called before the first
 * render. A section that suspends on its first render shows the Suspense
 * fallback, and React then holds the real screen back until 300 ms after the
 * fallback appeared, however soon the chunk arrives.
 *
 * Never rejects: a section that fails to load here is left to `PAGES`, which
 * imports it again and shows the section's error screen if that fails too. The
 * `catch` comes after the `then` on purpose. When the `vite:preloadError`
 * listener in `main.tsx` reloads the page, the import resolves to `undefined`
 * instead of rejecting, and reading `App` from it throws inside the `then`.
 */
export function loadInitialSection(path: string): Promise<void> {
  const id = sectionOf(path);
  // Own keys only: `#/constructor/` must not reach a method of Object.
  if (!Object.hasOwn(LOADERS, id)) return Promise.resolve();
  const section = id as SectionId;
  return LOADERS[section]()
    .then((module) => {
      INITIAL[section] = module.App;
    })
    .catch(() => {});
}
