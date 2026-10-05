import type { Decorator, Preview } from '@storybook/react-vite';
import { configure } from 'storybook/test';
import { ThemedDocsContainer } from './ThemedDocsContainer';
import { StorySurface } from './StorySurface';
import { NIGHTS, colourMode, nightPalette } from './theme';
import { DocsPage } from './DocsPage';
import { KIRUA_VIEWPORTS } from './viewports';
import '../src/index.css';
import './docs.css';

// `waitFor` and `findBy*` return as soon as their check passes, so a longer
// limit only delays a real failure. The default second is shorter than an
// exit animation plus focus return on a hosted runner with no GPU.
configure({ asyncUtilTimeout: 5000 });

const withSurface: Decorator = (Story, context) => (
  <StorySurface
    mode={colourMode(context.globals)}
    night={nightPalette(context.globals)}
    surface={context.globals['surface']}
    bare={context.parameters.surface === 'none'}
    fixedMode={context.storyGlobals?.['mode'] !== undefined}
    fixedSurface={context.storyGlobals?.['surface'] !== undefined}
  >
    <Story />
  </StorySurface>
);

const preview: Preview = {
  decorators: [withSurface],
  initialGlobals: {
    mode: 'light',
    surface: 'page',
    nightPalette: NIGHTS[0],
  },
  globalTypes: {
    mode: {
      description: 'Colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    surface: {
      description: 'Surface context the component is rendered on',
      toolbar: {
        title: 'Surface',
        icon: 'paintbrush',
        items: [
          { value: 'page', title: 'Page (default)' },
          { value: 'brand', title: 'Brand (ctx-brand)' },
          { value: 'inverse', title: 'Inverse (ctx-inverse)' },
        ],
        dynamicTitle: true,
      },
    },
    // Applies in dark mode only; a light page has no night.
    nightPalette: {
      description: 'Night palette of dark mode',
      toolbar: {
        title: 'Night',
        icon: 'moon',
        items: NIGHTS.map((night, index) => {
          const name = night.charAt(0).toUpperCase() + night.slice(1);
          return { value: night, title: index === 0 ? `${name} night` : name };
        }),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting started',
          'Design direction',
          'Foundations',
          ['Colour', 'Typography', 'Scales', 'Surface contexts', 'Stacking', 'Dark mode'],
          'Components',
          'Patterns',
          'Examples',
        ],
      },
    },
    // The Vitest addon reads viewport globals from each test project.
    viewport: { options: KIRUA_VIEWPORTS },
    docs: {
      // Isolate IDs and portals when several stories share a docs page.
      page: DocsPage,
      container: ThemedDocsContainer,
      story: { inline: false, height: '240px' },
      source: { excludeDecorators: true },
      controls: { sort: 'requiredFirst' },
      toc: true,
    },
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
