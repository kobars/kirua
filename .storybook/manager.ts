import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { colourMode, docsThemes } from './theme';

addons.setConfig({ theme: docsThemes.light });
addons.register('kirua/colour-mode', (api) => {
  const update = (payload: {
    globals?: Record<string, unknown>;
    userGlobals?: Record<string, unknown>;
  }) => {
    addons.setConfig({ theme: docsThemes[colourMode(payload.userGlobals ?? payload.globals)] });
  };
  api.on(SET_GLOBALS, update);
  api.on(GLOBALS_UPDATED, update);

  // A night palette is dark mode's, so picking one from the toolbar on a light
  // page switches to dark rather than changing nothing visible. The request is
  // read, not the result, because a page loaded with a saved night sends none.
  // The toolbar sends nothing for the night already chosen, as any select.
  api.on(UPDATE_GLOBALS, ({ globals }: { globals?: Record<string, unknown> }) => {
    if (!globals || !('nightPalette' in globals) || 'mode' in globals) return;
    if (colourMode(api.getGlobals()) === 'light') api.updateGlobals({ mode: 'dark' });
  });
});
