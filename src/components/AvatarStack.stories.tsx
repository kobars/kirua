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
          'Overlapping circular avatars, used as the leading slot of a `Chip` to carry social proof. The whole stack is announced as **one** label — "5 people" — rather than as five separate images, because announcing six cropped faces individually tells a screen reader user nothing useful. Faces without a `src` fall back to a deterministic colour swatch, so the same person keeps the same colour across renders.',
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

/** Where it is actually used: inside a `Chip`, over the artwork. */
export const InAChip: Story = {
  render: (args) => <Chip leading={<AvatarStack {...args} size="sm" />}>+1M Likes</Chip>,
};

/**
 * `label` receives the total count, so a consumer carries their own plural rule
 * — Polish needs three forms and English needs two, which is exactly why this is
 * a function and not a string.
 *
 * The play function looks the stack up by the translated name, so the story
 * fails if the prop stops reaching the accessibility tree.
 */
export const TranslatedLabel: Story = {
  args: { label: (n: number) => `${n} personnes` },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: '5 personnes' }),
    ).toBeInTheDocument();
  },
};
