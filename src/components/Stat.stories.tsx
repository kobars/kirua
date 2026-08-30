import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stat, StatRow } from './Stat';
import { BookmarkIcon, CalendarIcon, HeartIcon, SendIcon, StethoscopeIcon } from './icons';

const meta = {
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
 * What a dashboard opens with. The grid is the point: a wrapping flex row
 * leaves the last tile a different width from the rest, and a row of tiles
 * whose numbers do not line up has stopped being a comparison.
 */
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

/**
 * What makes a row of tiles a comparison: every tile is the same width and
 * every number starts at the same offset. That comes from the grid, not from
 * the face, which is why it is what gets asserted.
 *
 * The value also carries `tabular-nums`, so digits keep their column when a
 * number changes. That one is asserted as a property rather than by measuring
 * two rendered numbers: Fredoka arrives over the network, `document.fonts.ready`
 * resolves before a lazily-fetched face has even started loading, and the same
 * two spans measure 41px and 59px against the fallback and 69px against
 * Fredoka. A gate that depends on a network fetch is a gate that fails on a
 * slow morning and teaches everyone to re-run it.
 */
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
