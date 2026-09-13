import type { Decorator, Preview } from '@storybook/react-vite';
import { TooltipProvider } from '../src/components';
import { DocsPage } from './DocsPage';
import { KIRUA_VIEWPORTS } from './viewports';
import '../src/index.css';
import './docs.css';

const withSurface: Decorator = (Story, context) => {
  const { mode, surface } = context.globals as { mode: string; surface: string };
  const surfaceClass =
    surface === 'brand'
      ? 'ctx-brand bg-brand'
      : surface === 'inverse'
        ? 'ctx-inverse bg-page'
        : 'bg-page';

  if (context.parameters.surface === 'none') {
    return (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    );
  }

  return (
    <div className={mode === 'dark' ? 'dark' : undefined}>
      <TooltipProvider delayDuration={200}>
        <div className={`${surfaceClass} min-h-40 rounded-xl p-4 text-fg sm:p-8`}>
          <Story />
        </div>
      </TooltipProvider>
    </div>
  );
};

const preview: Preview = {
  decorators: [withSurface],
  globalTypes: {
    mode: {
      description: 'Colour mode',
      defaultValue: 'light',
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
      defaultValue: 'page',
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
