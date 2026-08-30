import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  args: { orientation: 'horizontal', decorative: true },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A rule between two things. `decorative` decides whether assistive technology hears about it, and it defaults to true because most rules are drawn, not meant.',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <p className="text-body-md text-fg">Above the line.</p>
      <Separator {...args} className="my-4" />
      <p className="text-body-md text-fg">Below the line.</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-10 items-center gap-4 text-body-sm text-fg">
      <span>Draft</span>
      <Separator {...args} orientation="vertical" />
      <span>Edited 2h ago</span>
      <Separator {...args} orientation="vertical" />
      <span>3 comments</span>
    </div>
  ),
};

/**
 * The whole reason the prop exists. A decorative rule is absent from the
 * accessibility tree; a meaningful one is a `separator` a reader can find.
 */
export const DecorativeIsNotAnnounced: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Separator {...args} decorative data-testid="decorative" />
      <Separator {...args} decorative={false} className="mt-4" data-testid="meaningful" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId('decorative')).toHaveAttribute('role', 'none');
    await expect(canvas.getByTestId('meaningful')).toHaveAttribute('role', 'separator');
    await expect(canvas.getAllByRole('separator')).toHaveLength(1);
  },
};
