import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemedDocsContainer } from './ThemedDocsContainer';
import { StorySurface } from './StorySurface';
import { colourMode } from './theme';
import { DocsPage } from './DocsPage';
import { KIRUA_VIEWPORTS } from './viewports';
import '../src/index.css';
import './docs.css';

const withSurface: Decorator = (Story, context) => (
  <StorySurface
    mode={colourMode(context.globals)}
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
  initialGlobals: { mode: 'light', surface: 'page' },
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
