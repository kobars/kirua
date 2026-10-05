import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import NIGHT_NAMES from '@/styles/nights.json';
import { NightSwatch, type NightPalette } from './NightSwatch';
import { Text } from './Text';

// `nights.node.test.ts` holds the type and the list to the same names.
const NIGHTS = NIGHT_NAMES as NightPalette[];

const meta = {
  tags: ['autodocs'],
  title: 'Components/NightSwatch',
  component: NightSwatch,
  args: { palette: 'navy' },
  argTypes: { palette: { control: 'inline-radio', options: NIGHTS } },
  parameters: {
    docs: {
      description: {
        component:
          'A night palette’s page and card, for a control that picks the dark mode palette. Decorative: put the night’s name beside it.',
      },
    },
  },
} satisfies Meta<typeof NightSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EveryNight: Story = {
  render: () => (
    <div className="grid w-48 gap-2">
      {NIGHTS.map((night) => (
        <div key={night} className="flex items-center gap-3">
          <Text inline size="sm" tone="primary">
            {night}
          </Text>
          <NightSwatch palette={night} data-testid={night} />
        </div>
      ))}
    </div>
  ),
  /**
   * Each night shows its own colours whatever theme the page is in: five
   * different pages, each darker than the page around the swatch in light
   * mode, and each with a card lighter than its page.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fill = (night: string) => getComputedStyle(canvas.getByTestId(night)).backgroundColor;
    const card = (night: string) =>
      getComputedStyle(canvas.getByTestId(night).firstElementChild!).backgroundColor;

    await expect(new Set(NIGHTS.map(fill)).size).toBe(NIGHTS.length);
    for (const night of NIGHTS) {
      await expect(card(night)).not.toBe(fill(night));
      await expect(canvas.getByTestId(night)).toHaveAttribute('aria-hidden', 'true');
    }
  },
};
