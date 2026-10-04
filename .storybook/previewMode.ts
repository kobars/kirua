import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import type { DocsContextProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { colourMode, nightPalette, type Mode, type Night } from './theme';

export interface PreviewGlobals {
  mode: Mode;
  night: Night;
  surface: 'page' | 'brand' | 'inverse';
}

function normalize(globals: Record<string, unknown> = {}): PreviewGlobals {
  const surface = globals['surface'];
  return {
    mode: colourMode(globals),
    night: nightPalette(globals),
    surface: surface === 'brand' || surface === 'inverse' ? surface : 'page',
  };
}

const same = (a: PreviewGlobals | undefined, b: PreviewGlobals) =>
  a?.mode === b.mode && a.night === b.night && a.surface === b.surface;

const docsGlobals = new WeakMap<DocsContextProps['channel'], PreviewGlobals>();

export function useDocsGlobals(context: DocsContextProps) {
  const read = useCallback(() => {
    const story = context.componentStories()[0];
    const last =
      context.channel.last(GLOBALS_UPDATED)?.[0] ?? context.channel.last(SET_GLOBALS)?.[0];
    return normalize(
      story
        ? context.getStoryContext(story).userGlobals
        : (docsGlobals.get(context.channel) ??
            last?.userGlobals ??
            last?.globals ??
            context.projectAnnotations.initialGlobals),
    );
  }, [context]);
  const [globals, setGlobals] = useState(read);
  useEffect(() => {
    function update(
      this: { source?: string },
      payload: {
        globals?: Record<string, unknown>;
        userGlobals?: Record<string, unknown>;
      },
    ) {
      // Ignore initialization broadcasts from child preview frames.
      if (this.source) return;
      const next = normalize(payload.userGlobals ?? payload.globals);
      docsGlobals.set(context.channel, next);
      setGlobals((current) => (same(current, next) ? current : next));
    }
    context.channel.on(SET_GLOBALS, update);
    context.channel.on(GLOBALS_UPDATED, update);
    setGlobals(read());
    return () => {
      context.channel.off(SET_GLOBALS, update);
      context.channel.off(GLOBALS_UPDATED, update);
    };
  }, [context, read]);
  return globals;
}

// Keep iframe presentation in sync without rebroadcasting globals to the manager.
let embeddedGlobals: PreviewGlobals | undefined;
const embeddedListeners = new Set<() => void>();
function subscribe(listener: () => void) {
  embeddedListeners.add(listener);
  return () => embeddedListeners.delete(listener);
}
export function useEmbeddedGlobals() {
  return useSyncExternalStore(
    subscribe,
    () => embeddedGlobals,
    () => undefined,
  );
}

function receiveDocsGlobals(event: MessageEvent) {
  if (
    event.origin !== location.origin ||
    event.source !== window.parent ||
    event.source === window
  )
    return;
  if (event.data?.type !== 'kirua:docs-globals') return;
  const globals = normalize(event.data.globals);
  if (same(embeddedGlobals, globals)) return;
  embeddedGlobals = globals;
  embeddedListeners.forEach((listener) => listener());
}
window.addEventListener('message', receiveDocsGlobals);
if (import.meta.hot)
  import.meta.hot.dispose(() => window.removeEventListener('message', receiveDocsGlobals));

export function useDocumentMode(selectedMode: Mode, night: Night) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    const previousScheme = root.style.colorScheme;
    const previousNight = root.dataset['nightPalette'];
    root.classList.toggle('dark', selectedMode === 'dark');
    root.style.colorScheme = selectedMode;
    if (night === 'navy') delete root.dataset['nightPalette'];
    else root.dataset['nightPalette'] = night;
    return () => {
      root.classList.toggle('dark', wasDark);
      root.style.colorScheme = previousScheme;
      if (previousNight === undefined) delete root.dataset['nightPalette'];
      else root.dataset['nightPalette'] = previousNight;
    };
  }, [selectedMode, night]);
}
