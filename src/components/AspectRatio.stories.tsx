import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AspectRatio } from './AspectRatio';

const meta = {
  tags: ['autodocs'],
  title: 'Components/AspectRatio',
  component: AspectRatio,
  args: { ratio: 16 / 9 },
  argTypes: { ratio: { control: { type: 'number', step: 0.1 } } },
  parameters: {
    docs: {
      description: {
        component:
          'Reserve space for media before it loads. Set ratio to width divided by height, such as 16 / 9, and provide appropriate alternative text on the media itself.',
      },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args} className="rounded-md bg-brand">
        <div className="grid size-full place-content-center text-body-sm text-on-primary">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Ratios: Story = {
  render: (args) => (
    <div className="grid max-w-2xl grid-cols-3 gap-4">
      {(
        [
          ['1 : 1', 1],
          ['4 : 3', 4 / 3],
          ['16 : 9', 16 / 9],
        ] as const
      ).map(([label, ratio]) => (
        <AspectRatio {...args} key={label} ratio={ratio} className="rounded-md bg-sunken">
          <div className="grid size-full place-content-center text-body-sm text-fg-secondary">
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  ),
};

export const ReservesHeightBeforeContentLoads: Story = {
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args} ratio={2} data-testid="empty-box" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByTestId('empty-box');
    const { width, height } = box.getBoundingClientRect();

    await expect(height).toBeGreaterThan(0);
    await expect(Math.round(width / height)).toBe(2);
  },
};
