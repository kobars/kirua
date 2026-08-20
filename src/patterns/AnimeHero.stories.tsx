import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LG, atLeast } from '@/test/viewport';
import { AnimeHero } from './AnimeHero';

const meta = {
  title: 'Patterns/Anime Hero',
  component: AnimeHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          "The reference design's hero, rebuilt entirely from the design system.",
          '',
          'This exists as proof rather than as decoration. Every colour comes from a semantic token, every shape from the radius scale, and every control from the component layer — there is not one hard-coded hex value in the file. If the system could not reproduce its own source design, the system would be wrong.',
          '',
          '**Deliberate deviations from the Figma file:**',
          '1. The blue panel uses blue-600, not the measured blue-500. White body copy on blue-500 measures 3.65:1 and fails WCAG AA.',
          "2. Body line height is 1.44, not the reference's 1.11.",
          "3. The artwork is Killua Zoldyck rather than the reference's own AI-generated illustrations. Killua is Yoshihiro Togashi's character, published by Shueisha — these fan-distributed cut-outs are fine for a personal portfolio piece and are not licensed for commercial use.",
        ].join('\n'),
      },
    },
  },
  // The decorator's padding and surface wrapper would fight a full-page layout.
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof AnimeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

/**
 * The same page under `.dark`. Not one component changed — the dark mode block
 * in tokens.semantic.css re-points the tokens and everything follows.
 */
export const Dark: Story = {
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

/**
 * The hero's own reflow: one column of stacked content below `lg`, two columns
 * at `lg` and above. Asserted from the computed `grid-template-columns`, which
 * resolves to a pixel list — so the assertion is on the *count* of tracks, the
 * thing that actually changes.
 */
export const SplitsIntoTwoColumnsAtLg: Story = {
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('div.grid.z-raised');
    await expect(grid).not.toBeNull();

    const tracks = getComputedStyle(grid as Element).gridTemplateColumns.split(/\s+/);
    await expect(tracks).toHaveLength(atLeast(LG) ? 2 : 1);
  },
};
