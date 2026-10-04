import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Avatar',
  component: Avatar,
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A profile image with a fallback for unavailable images. Use a meaningful image description, or an empty alt when an adjacent name already identifies the person.',
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

export const RingedOverACover: Story = {
  render: () => (
    <div className="grid h-32 w-64 items-end bg-brand-subtle p-3">
      <Avatar size="lg" ring data-testid="avatar">
        <AvatarFallback>RK</AvatarFallback>
      </Avatar>
    </div>
  ),
  /** A ring in the page colour separates the circle from the picture behind it. */
  play: async ({ canvasElement }) => {
    const avatar = within(canvasElement).getByTestId('avatar');
    await expect(getComputedStyle(avatar).boxShadow).not.toBe('none');
  },
};
