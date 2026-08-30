import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
  parameters: {
    docs: {
      description: {
        component:
          'One person as a circle. Radix holds the fallback back until the image has actually failed, so a slow image does not flash initials on every render.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>RK</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar {...args} key={size} size={size}>
          <AvatarFallback>{size.toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/**
 * The interesting state is the one a story usually cannot show: an image that
 * will never load. The fallback is what the reader actually sees, so it has to
 * be legible at every step of the size scale.
 */
export const FallbackWhenTheImageFails: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} data-testid="broken">
        <AvatarImage src="/does-not-exist.png" alt="" />
        <AvatarFallback>KS</AvatarFallback>
      </Avatar>
      <span className="text-body-sm text-fg-secondary">Kobar Sumarsono</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('KS')).toBeVisible();
    await expect(
      canvas.getByTestId('broken').querySelector('[data-slot="avatar-image"]'),
    ).toBeNull();
  },
};
