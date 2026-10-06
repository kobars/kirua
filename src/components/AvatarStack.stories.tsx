import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AvatarStack } from './AvatarStack';
import { Chip } from './Chip';

const PEOPLE = [
  { name: 'Rin' },
  { name: 'Kai' },
  { name: 'Mio' },
  { name: 'Sora' },
  { name: 'Aki' },
];

const meta = {
  tags: ['autodocs'],
  title: 'Components/AvatarStack',
  component: AvatarStack,
  args: { items: PEOPLE, size: 'md', max: 3 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    max: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    items: { control: false },
    label: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Overlapping avatars for a small group. Supply one accessible label describing the group; individual images are decorative in this compact representation.',
      },
    },
  },
} satisfies Meta<typeof AvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      <AvatarStack {...args} size="sm" />
      <AvatarStack {...args} size="md" />
      <AvatarStack {...args} size="lg" max={4} />
    </div>
  ),
};

export const InAChip: Story = {
  render: (args) => <Chip leading={<AvatarStack {...args} size="sm" />}>1M+ likes</Chip>,
};

export const CustomLabel: Story = {
  args: { label: (n: number) => `${n} teammates` },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: '5 teammates' }),
    ).toBeInTheDocument();
  },
};
