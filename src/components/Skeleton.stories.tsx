import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A placeholder in the shape of the content it replaces. It is aria-hidden: the container announces the wait once, rather than every shape announcing it.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Skeleton {...args} className="h-4 w-40" />,
};

export const APostThatHasNotArrived: Story = {
  render: (args) => (
    <output
      aria-busy="true"
      aria-label="Loading post"
      className="block max-w-sm rounded-lg border border-line-subtle p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton {...args} className="size-10 rounded-pill" />
        <div className="grid gap-2">
          <Skeleton {...args} className="h-3 w-28" />
          <Skeleton {...args} className="h-3 w-16" />
        </div>
      </div>
      <Skeleton {...args} className="mt-4 h-40 w-full rounded-md" />
      <Skeleton {...args} className="mt-3 h-3 w-full" />
      <Skeleton {...args} className="mt-2 h-3 w-3/4" />
    </output>
  ),
};

/**
 * Six shapes, one announcement. The failure this prevents is a feed that reads
 * "loading" once per placeholder.
 */
export const TheShapesAreSilent: Story = {
  render: (args) => (
    <output aria-busy="true" aria-label="Loading" data-testid="region" className="grid gap-2">
      <Skeleton {...args} className="h-3 w-40" />
      <Skeleton {...args} className="h-3 w-24" />
    </output>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByTestId('region');
    const shapes = region.querySelectorAll('[data-slot="skeleton"]');

    await expect(shapes).toHaveLength(2);
    for (const shape of shapes) await expect(shape).toHaveAttribute('aria-hidden', 'true');
    await expect(region).toHaveAttribute('aria-busy', 'true');
  },
};
