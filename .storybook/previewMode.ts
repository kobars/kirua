import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import type { DocsContextProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { colourMode, type Mode } from './theme';

export interface PreviewGlobals {
  mode: Mode;
  surface: 'page' | 'brand' | 'inverse';
}

function normalize(globals: Record<string, unknown> = {}): PreviewGlobals {
  const surface = globals['surface'];
  return {
    mode: colourMode(globals),
    surface: surface === 'brand' || surface === 'inverse' ? surface : 'page',
  };
}

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
      setGlobals((current) =>
        current.mode === next.mode && current.surface === next.surface ? current : next,
      );
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
  if (globals.mode === embeddedGlobals?.mode && globals.surface === embeddedGlobals?.surface)
    return;
  embeddedGlobals = globals;
  embeddedListeners.forEach((listener) => listener());
}
window.addEventListener('message', receiveDocsGlobals);
if (import.meta.hot)
  import.meta.hot.dispose(() => window.removeEventListener('message', receiveDocsGlobals));

export function useDocumentMode(selectedMode: Mode) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    const previousScheme = root.style.colorScheme;
    root.classList.toggle('dark', selectedMode === 'dark');
    root.style.colorScheme = selectedMode;
    return () => {
      root.classList.toggle('dark', wasDark);
      root.style.colorScheme = previousScheme;
    };
  }, [selectedMode]);
}
