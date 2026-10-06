import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import * as icons from './icons';

const entries = Object.entries(icons).filter(([name]) => name.endsWith('Icon'));

const meta = {
  tags: ['autodocs'],
  title: 'Components/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Decorative inline SVG icons that take the colour of the text around them. When an icon stands without visible text, put the accessible name on the control that contains it.',
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
