import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemedDocsContainer } from './ThemedDocsContainer';
import { StorySurface } from './StorySurface';
import { colourMode } from './theme';
import { DocsPage } from './DocsPage';
import { KIRUA_VIEWPORTS } from './viewports';
import '../src/index.css';
// TEMPORARY: see src/styles/experiment.css.
import '../src/styles/experiment.css';
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

const NIGHTS: unknown[] = ['graphite', 'onyx', 'ink', 'carbon'];

/** TEMPORARY: applies the style experiment in src/styles/experiment.css. */
const withStyleExperiment: Decorator = (Story, context) => {
  const style = context.globals['styleExperiment'];
  const root = document.documentElement;
  if (style === 'clay' || style === 'hybrid' || style === 'hybrid-clay')
    root.dataset.styleExperiment = style;
  else delete root.dataset.styleExperiment;
  const night = context.globals['nightPalette'];
  if (NIGHTS.includes(night)) root.dataset.nightPalette = night;
  else delete root.dataset.nightPalette;
  return <Story />;
};

const preview: Preview = {
  decorators: [withSurface, withStyleExperiment],
  initialGlobals: {
    mode: 'light',
    surface: 'page',
    styleExperiment: 'off',
    nightPalette: 'navy',
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
    // TEMPORARY: see src/styles/experiment.css.
    styleExperiment: {
      description:
        'Style experiment: pure Clay, the kirua and Clay hybrid, or the hybrid with Clay shapes',
      toolbar: {
        title: 'Style',
        icon: 'beaker',
        items: [
          { value: 'off', title: 'Kirua' },
          { value: 'clay', title: 'Pure Clay' },
          { value: 'hybrid', title: 'Hybrid' },
          { value: 'hybrid-clay', title: 'Hybrid with Clay shapes' },
        ],
        dynamicTitle: true,
      },
    },
    // TEMPORARY: the dark-mode palette of the hybrid with Clay shapes.
    nightPalette: {
      description: 'Night palette for the hybrid with Clay shapes in dark mode',
      toolbar: {
        title: 'Night',
        icon: 'moon',
        items: [
          { value: 'navy', title: 'Navy night' },
          { value: 'graphite', title: 'Graphite' },
          { value: 'onyx', title: 'Onyx' },
          { value: 'ink', title: 'Ink' },
          { value: 'carbon', title: 'Carbon' },
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
