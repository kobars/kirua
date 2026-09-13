import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stat, StatRow } from './Stat';
import { BookmarkIcon, CalendarIcon, HeartIcon, SendIcon, StethoscopeIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Stat',
  component: Stat,
  args: { value: '100k', label: 'Likes', variant: 'inline' },
  argTypes: {
    icon: { control: false },
    variant: { control: 'inline-radio', options: ['inline', 'tile'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A formatted value with a label and optional decorative icon. Use the tile variant for summaries and StatRow to compare related values.',
      },
    },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { icon: <HeartIcon /> },
};

export const Row: Story = {
  render: () => (
    <StatRow>
      <Stat icon={<HeartIcon />} value="100k" label="Likes" />
      <Stat icon={<BookmarkIcon />} value="10k" label="Saves" />
      <Stat icon={<SendIcon />} value="20k" label="Shares" />
    </StatRow>
  ),
};

export const Tiles: Story = {
  render: () => (
    <StatRow variant="tile">
      <Stat variant="tile" icon={<CalendarIcon />} value="128" label="Visits today" />
      <Stat variant="tile" icon={<StethoscopeIcon />} value="34" label="In consultation" />
      <Stat variant="tile" value="9" label="Waiting" />
      <Stat variant="tile" value="86/120" label="Beds occupied" />
    </StatRow>
  ),
};

export const TilesLineUpAcrossARow: Story = {
  render: () => (
    <StatRow variant="tile" data-testid="row">
      <Stat variant="tile" value="111" label="Ones" />
      <Stat variant="tile" value="888" label="Eights" />
    </StatRow>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = canvas.getAllByText(/^(111|888)$/);
    const tiles = canvasElement.querySelectorAll('[data-slot="stat"]');

    await expect(getComputedStyle(first!).fontVariantNumeric).toContain('tabular-nums');
    await expect(getComputedStyle(canvas.getByText('Ones')).fontVariantNumeric).not.toContain(
      'tabular-nums',
    );

    const [a, b] = [...tiles].map((tile) => tile.getBoundingClientRect());
    await expect(a!.width).toBeCloseTo(b!.width, 1);
    await expect(first!.getBoundingClientRect().left - a!.left).toBeCloseTo(
      second!.getBoundingClientRect().left - b!.left,
      1,
    );
  },
};

export const IconIsNotAnnounced: Story = {
  args: { icon: <HeartIcon /> },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('img')).toHaveLength(0);
    await expect(canvasElement.textContent).toContain('100k Likes');
  },
};
