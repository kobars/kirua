import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import * as icons from './icons';

const entries = Object.entries(icons).filter(([name]) => name.endsWith('Icon'));

const meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Inline SVG, no icon dependency. Every icon matches the reference's outline style — a 24x24 box, 1.75px strokes, round caps and joins — and takes its colour from `currentColor`, so a text utility on any ancestor recolours it.\n\nAll of them are `aria-hidden`. An icon is decoration beside a label, and the one place an icon stands alone is `IconButton`, which requires an `aria-label` of its own.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {entries.map(([name, Glyph]) => (
        <div key={name} className="flex flex-col items-center gap-2 rounded-md p-4 text-fg">
          <Glyph size="2xl" />
          <span className="font-text text-caption text-fg-secondary">{name}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Inside a `Button`, `IconButton`, `Badge`, `Chip`, `Stat` or a menu item, leave
 * `size` unset — each of those sets `--icon-size`, so the icon follows the
 * control. These names are for an icon standing on its own.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-brand-vivid">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <span key={size} className="flex flex-col items-center gap-2">
          <icons.SparkleIcon size={size} />
          <span className="font-text text-caption text-fg-secondary">{size}</span>
        </span>
      ))}
    </div>
  ),
};

/** Not a style choice — an icon that reaches the accessibility tree is read out
 *  beside the label it decorates, twice saying the same thing. */
export const NoneReachTheAccessibilityTree: Story = {
  render: () => (
    <div className="text-fg">
      {entries.map(([name, Glyph]) => (
        <Glyph key={name} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg');
    await expect(svgs.length).toBe(entries.length);
    for (const svg of svgs) await expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};
