import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CHARACTERS } from '@/patterns/characters';
import { MD, atLeast } from '@/test/viewport';
import { Button } from './Button';
import { DotGrid } from './DotGrid';
import { SpotlightContent, SpotlightMedia, SpotlightPanel } from './SpotlightPanel';
import { ArrowRightIcon } from './icons';

const meta = {
  tags: ['autodocs'],
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
      story: { height: '680px' },
      description: {
        component:
          'An expressive hero panel with space reserved for overhanging artwork. Set mediaWidth to balance text and illustration. Use a quiet Card for dense application content.',
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
            Show your art. Sell your prints.
          </h2>
          <p className="font-text text-body-lg text-fg-secondary">
            Chibi characters, digital comics, cartoon animations: give your work a portfolio
            that shows it at its best, and sell prints from the same page.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg">
              Open your shop
            </Button>
            <Button variant="secondary" size="lg" trailingIcon={<ArrowRightIcon />}>
              Browse the gallery
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

export const Tones: Story = {
  parameters: {
    // The `vivid` panel deliberately shows body copy on blue-500 so the failure
    // is visible and documented. The contrast rule would flag it, correctly —
    // which is exactly the point of the story, so that one rule is turned off
    // here only.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
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

export const Paddings: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['md', 'lg', 'xl'] as const).map((padding) => (
        <SpotlightPanel key={padding} padding={padding}>
          <SpotlightContent className="gap-2">
            <span className="font-mono text-caption text-fg-secondary">
              padding=&quot;{padding}&quot;
            </span>
            <h3 className="font-display text-display-md text-fg">Same panel, less air</h3>
          </SpotlightContent>
        </SpotlightPanel>
      ))}
    </div>
  ),
};

export const HidesItsArtworkBelowMd: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="spotlight-media"]');
    await expect(media).not.toBeNull();

    const display = getComputedStyle(media as Element).display;
    await expect(display).toBe(atLeast(MD) ? 'flex' : 'none');
  },
};

/** The gutter follows the artwork: against the start edge, the copy moves off it. */
export const MediaOnTheStartSide: Story = {
  render: (args) => (
    <div className="py-16">
      <SpotlightPanel {...args} className="min-h-[420px]">
        <SpotlightMedia side="start" overhang="both" fit>
          <img src={CHARACTERS.yoyo.src} alt="" />
        </SpotlightMedia>
        <SpotlightContent gap={6}>
          <h2 className="font-display text-display-lg text-fg">
            Show your art and sell your prints, however long the headline runs
          </h2>
        </SpotlightContent>
      </SpotlightPanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="spotlight-media"]')!;
    const heading = canvasElement.querySelector('h2')!;
    await expect(media).toHaveAttribute('data-side', 'start');
    if (!atLeast(MD)) return;

    // The headline begins where the artwork ends, not underneath it.
    const artwork = media.getBoundingClientRect();
    await expect(heading.getBoundingClientRect().left).toBeGreaterThanOrEqual(artwork.right);
  },
};

export const TheMeasureCapsTheCopyNotTheGutter: Story = {
  args: { padding: 'lg', mediaWidth: '30%' },
  render: (args) => (
    <div className="py-16">
      <SpotlightPanel {...args} minHeight="md">
        <SpotlightMedia side="end" overhang="both" width="42%" fit>
          <img src={CHARACTERS.yoyo.src} alt="" />
        </SpotlightMedia>
        <SpotlightContent measure gap={6}>
          <h2 className="font-display text-display-lg text-fg">
            Show your art. Sell your prints.
          </h2>
        </SpotlightContent>
      </SpotlightPanel>
    </div>
  ),
  /**
   * `measure` is a reading length for the copy. Capping the whole box instead
   * would take the artwork's gutter out of it: a 44rem cap less a 30% gutter
   * leaves a display headline one word per line beside an empty panel.
   */
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('[data-slot="spotlight-panel"]') as HTMLElement;
    const content = canvasElement.querySelector(
      '[data-slot="spotlight-content"]',
    ) as HTMLElement;
    const style = getComputedStyle(content);
    const panelStyle = getComputedStyle(panel);
    const gutter = Number.parseFloat(style.paddingInlineEnd);
    const room =
      panel.clientWidth -
      Number.parseFloat(panelStyle.paddingInlineStart) -
      Number.parseFloat(panelStyle.paddingInlineEnd) -
      gutter;
    const copy = content.clientWidth - gutter;
    const measure = 44 * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

    await expect(Math.abs(copy - Math.min(measure, room))).toBeLessThan(1);
  },
};

export const MinimumHeights: Story = {
  render: () => (
    <div className="grid gap-6">
      {(['sm', 'md'] as const).map((minHeight) => (
        <SpotlightPanel
          key={minHeight}
          minHeight={minHeight}
          padding="md"
          data-testid={minHeight}
        >
          <SpotlightContent gap={4} measure>
            <h2 className="font-display text-display-md">minHeight=&quot;{minHeight}&quot;</h2>
          </SpotlightContent>
        </SpotlightPanel>
      ))}
    </div>
  ),
  /** A floor from `md`, where the artwork rejoins the layout; the copy sets it below. */
  play: async ({ canvasElement }) => {
    const height = (step: string) =>
      canvasElement.querySelector(`[data-testid="${step}"]`)!.getBoundingClientRect().height;
    if (atLeast(MD)) {
      await expect(Math.round(height('sm'))).toBeGreaterThanOrEqual(384);
      await expect(Math.round(height('md'))).toBeGreaterThanOrEqual(480);
    } else {
      await expect(height('md')).toBeLessThan(480);
    }
  },
};
