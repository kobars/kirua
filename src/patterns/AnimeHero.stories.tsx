import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LG, atLeast } from '@/test/viewport';
import { AnimeHero } from './AnimeHero';

const meta = {
  title: 'Patterns/Anime Hero',
  component: AnimeHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    surface: 'none',
    docs: {
      description: {
        component: [
          "The reference design's hero, rebuilt entirely from the design system.",
          '',
          'An expressive landing-page composition with oversized artwork, a brand panel and a call to action. Replace the copy and artwork with your own: the artwork shown is third-party and comes with no permission to reuse it.',
          '',
          '**Deliberate deviations from the Figma file:**',
          '1. The blue panel uses blue-600, not the measured blue-500. White body copy on blue-500 measures 3.65:1 and fails WCAG AA.',
          "2. Body line height is 1.44, not the reference's 1.11.",
          "3. The artwork replaces the reference's own AI-generated illustrations. The figures shown are **not licensed for commercial use** — see the licensing note in `src/patterns/characters.ts` before building on this pattern.",
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof AnimeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = { globals: { mode: 'light' } };

export const Dark: Story = { globals: { mode: 'dark' } };

export const SplitsIntoTwoColumnsAtLg: Story = {
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('div.grid.z-raised');
    await expect(grid).not.toBeNull();

    const tracks = getComputedStyle(grid as Element).gridTemplateColumns.split(/\s+/);
    await expect(tracks).toHaveLength(atLeast(LG) ? 2 : 1);
  },
};
