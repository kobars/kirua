import type { Decorator, Preview } from '@storybook/react-vite';
import { TooltipProvider } from '../src/components';
import '../src/index.css';

/**
 * Surface context and colour mode are the two things every story needs to be
 * viewed under, because the whole token architecture exists to make components
 * survive both. They are exposed as toolbar globals rather than as per-story
 * props so any story can be flipped without editing it.
 */
const withSurface: Decorator = (Story, context) => {
  const { mode, surface } = context.globals as { mode: string; surface: string };
  const surfaceClass =
    surface === 'brand' ? 'ctx-brand bg-brand' : surface === 'inverse' ? 'ctx-inverse bg-page' : 'bg-page';

  return (
    <div className={mode === 'dark' ? 'dark' : undefined}>
      <TooltipProvider delayDuration={200}>
        <div className={`${surfaceClass} min-h-40 rounded-xl p-8 text-fg`}>
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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Contrast is the entire reason this system deviates from its reference
      // design, so a11y violations should be loud, not advisory.
      test: 'error',
    },
  },
};

export default preview;
