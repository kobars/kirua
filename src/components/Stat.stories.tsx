import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stat, StatRow } from './Stat';
import { BookmarkIcon, HeartIcon, SendIcon } from './icons';

const meta = {
  title: 'Components/Stat',
  component: Stat,
  args: { value: '100k', label: 'Likes' },
  argTypes: { icon: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'One icon-and-number pair from the reference design\'s engagement row. The icon is decorative; the accessible name comes from the visible text, so a screen reader announces "100k Likes" rather than "heart image, 100k". Values arrive already formatted — this component does not decide that 100000 reads as "100k".',
      },
    },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { icon: <HeartIcon /> },
};

/** `StatRow` is the only layout this needs: wrap, with a wider gap across. */
export const Row: Story = {
  render: () => (
    <StatRow>
      <Stat icon={<HeartIcon />} value="100k" label="Likes" />
      <Stat icon={<BookmarkIcon />} value="10k" label="Saves" />
      <Stat icon={<SendIcon />} value="20k" label="Shares" />
    </StatRow>
  ),
};

/**
 * The icon must not reach the accessibility tree. If it did, the row would be
 * announced as "heart image, 100k Likes" three times over.
 */
export const IconIsNotAnnounced: Story = {
  args: { icon: <HeartIcon /> },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('img')).toHaveLength(0);
    await expect(canvasElement.textContent).toContain('100k Likes');
  },
};
