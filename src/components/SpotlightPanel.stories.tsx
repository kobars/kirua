import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CHARACTERS } from '@/patterns/characters';
import { MD, atLeast } from '@/test/viewport';
import { Button } from './Button';
import { DotGrid } from './DotGrid';
import { SpotlightContent, SpotlightMedia, SpotlightPanel } from './SpotlightPanel';
import { ArrowRightIcon } from './icons';

const meta = {
  title: 'Components/SpotlightPanel',
  component: SpotlightPanel,
  args: { tone: 'default', padding: 'xl', mediaWidth: '34%' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'vivid', 'inverse'] },
    padding: { control: 'inline-radio', options: ['md', 'lg', 'xl'] },
    mediaWidth: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The signature layout of the reference design: a rounded brand panel whose artwork deliberately breaks out past its own edges. The panel does not clip its children, and setting `mediaWidth` both sizes the artwork and reserves matching space on the text side, so a long headline can never run underneath it.',
      },
    },
  },
} satisfies Meta<typeof SpotlightPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="py-16">
      <SpotlightPanel {...args} className="min-h-[420px]">
        <SpotlightMedia side="end" overhang="both">
          <img
            src={CHARACTERS.yoyo.src}
            alt=""
            className="size-full object-contain object-bottom"
          />
        </SpotlightMedia>
        <SpotlightContent className="max-w-160 gap-6">
          <h2 className="font-display text-display-lg text-fg">
            Bring your anime worlds to life
          </h2>
          <p className="font-text text-body-lg text-fg-secondary">
            Whether you create chibi characters, digital comics, or lively cartoon animations,
            we give you the tools to design, display, and sell your work beautifully.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg">
              Start now
            </Button>
            <Button variant="secondary" size="lg" trailingIcon={<ArrowRightIcon />}>
              Enroll Now
            </Button>
          </div>
        </SpotlightContent>
        <DotGrid
          rows={4}
          cols={4}
          className="absolute inset-s-8 bottom-8 z-raised text-fg-muted"
        />
      </SpotlightPanel>
    </div>
  ),
};

/**
 * `tone` is the contrast decision, made explicit.
 *
 * `default` is blue-600 and is safe behind body copy at 4.67:1. `vivid` is
 * blue-500 — the exact colour measured in Figma — and is safe behind display
 * type only, at 3.65:1. Turn on the a11y addon to see the difference flagged.
 */
export const Tones: Story = {
  parameters: {
    // The `vivid` panel deliberately shows body copy on blue-500 so the failure
    // is visible and documented. The automated check would flag it, correctly —
    // which is exactly the point of the story, so it is turned off here only.
    a11y: { test: 'off' },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          ['default', 'blue-600 — body copy safe (4.67:1)'],
          ['vivid', 'blue-500 — display type only (3.65:1)'],
          ['inverse', 'pure black'],
        ] as const
      ).map(([tone, note]) => (
        <SpotlightPanel key={tone} tone={tone} padding="lg">
          <SpotlightContent className="gap-3">
            <span className="font-mono text-caption text-fg-secondary">
              tone=&quot;{tone}&quot; · {note}
            </span>
            <h3 className="font-display text-display-md text-fg">Display type is fine here</h3>
            <p className="max-w-xl font-text text-body-md text-fg-secondary">
              Body copy at 16px is the size that decides whether a surface passes AA.
            </p>
          </SpotlightContent>
        </SpotlightPanel>
      ))}
    </div>
  ),
};

/**
 * The artwork is decorative and there is no room for it beside the text on a
 * phone, so `SpotlightMedia` is `hidden md:flex`. That is a real switch, not a
 * reflow: below `md` the element is not laid out at all, which is also why it
 * cannot be relied on to carry meaning.
 */
export const HidesItsArtworkBelowMd: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="spotlight-media"]');
    await expect(media).not.toBeNull();

    const display = getComputedStyle(media as Element).display;
    await expect(display).toBe(atLeast(MD) ? 'flex' : 'none');
  },
};
