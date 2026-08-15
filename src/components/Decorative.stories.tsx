import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarStack } from './AvatarStack';
import { DotGrid } from './DotGrid';
import { Stat, StatRow } from './Stat';
import { BookmarkIcon, HeartIcon, SendIcon } from './icons';

/**
 * The small parts of the reference design's visual vocabulary. Individually
 * trivial; together they are most of what makes the style recognisable.
 */
const meta = {
  title: 'Components/Decorative parts',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [{ name: 'Rin' }, { name: 'Kai' }, { name: 'Mio' }, { name: 'Sora' }, { name: 'Aki' }];

export const DotGrids: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl font-text text-body-md text-fg-secondary">
        Ornamental only, so it is hidden from assistive technology. Colour comes from
        <code className="mx-1 font-mono text-body-sm">currentColor</code>, so a text utility on any
        ancestor controls it.
      </p>
      <div className="flex flex-wrap items-start gap-10">
        <DotGrid rows={5} cols={5} className="text-brand-vivid" />
        <DotGrid rows={7} cols={7} dotSize={3} spacing={8} className="text-fg-muted" />
        <DotGrid rows={3} cols={9} dotSize={5} spacing={12} className="text-fg" />
      </div>
    </div>
  ),
};

export const AvatarStacks: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl font-text text-body-md text-fg-secondary">
        The stack is announced as one label — &ldquo;5 people&rdquo; — rather than as five separate
        images. Announcing six cropped faces individually tells a screen reader user nothing useful.
      </p>
      <div className="flex flex-wrap items-center gap-8">
        <AvatarStack items={PEOPLE} size="sm" max={3} />
        <AvatarStack items={PEOPLE} size="md" max={3} />
        <AvatarStack items={PEOPLE} size="lg" max={4} />
      </div>
    </div>
  ),
};

export const Stats: Story = {
  render: () => (
    <StatRow>
      <Stat icon={<HeartIcon size={18} />} value="100k" label="Likes" />
      <Stat icon={<BookmarkIcon size={18} />} value="10k" label="Saves" />
      <Stat icon={<SendIcon size={18} />} value="20k" label="Shares" />
    </StatRow>
  ),
};
