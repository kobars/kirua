import { createElement } from 'react';
import { addons, types } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { ThemeTools } from './ThemeTools';
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
});

addons.register('kirua/theme-tools', () => {
  addons.add('kirua/theme-tools', {
    type: types.TOOL,
    title: 'Colour mode and night palette',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => createElement(ThemeTools),
  });
});
