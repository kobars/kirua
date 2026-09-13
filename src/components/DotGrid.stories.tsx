import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DotGrid } from './DotGrid';

const meta = {
  tags: ['autodocs'],
  title: 'Components/DotGrid',
  component: DotGrid,
  args: { rows: 5, cols: 5, dotSize: 4, spacing: 10 },
  argTypes: {
    rows: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    cols: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    dotSize: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    spacing: { control: { type: 'range', min: 2, max: 32, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Decorative dots for an expressive background. Colour follows currentColor. Keep the grid away from dense text and controls; it is hidden from assistive technology.',
      },
    },
  },
} satisfies Meta<typeof DotGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-10">
      <DotGrid {...args} className="text-brand-vivid" />
      <DotGrid {...args} rows={7} cols={7} dotSize={3} spacing={8} className="text-fg-muted" />
      <DotGrid {...args} rows={3} cols={9} dotSize={5} spacing={12} className="text-fg" />
    </div>
  ),
};

export const HiddenFromAssistiveTechnology: Story = {
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="dot-grid"]');
    await expect(grid).toHaveAttribute('aria-hidden', 'true');
  },
};
