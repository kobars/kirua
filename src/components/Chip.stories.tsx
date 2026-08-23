import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AvatarStack } from './AvatarStack';
import { Chip } from './Chip';
import { SparkleIcon } from './icons';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { children: "+1M Like's", variant: 'dark', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['dark', 'light', 'brand', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    leading: { control: false },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [{ name: 'Rin' }, { name: 'Kai' }, { name: 'Mio' }, { name: 'Sora' }];

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip {...args} variant="dark">
        Dark
      </Chip>
      <Chip {...args} variant="light">
        Light
      </Chip>
      <Chip {...args} variant="brand">
        Brand
      </Chip>
      <Chip {...args} variant="outline">
        Outline
      </Chip>
    </div>
  ),
};

/** Heights match the button steps, so a chip and a button can share a row. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip {...args} size="sm" leading={<SparkleIcon />}>
        Small
      </Chip>
      <Chip {...args} size="md" leading={<SparkleIcon />}>
        Medium
      </Chip>
      <Chip {...args} size="lg" leading={<SparkleIcon />}>
        Large
      </Chip>
    </div>
  ),
};

/** The contextual border keeps the brand fill visible on the brand surface. */
export const BrandOnBrand: Story = {
  render: (args) => (
    <div className="ctx-brand bg-brand p-8">
      <Chip {...args} variant="brand">
        Brand on brand
      </Chip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByText('Brand on brand');
    const style = getComputedStyle(chip);

    await expect(style.borderTopStyle).toBe('solid');
    await expect(style.borderTopWidth).toBe('1px');
    await expect(style.borderTopColor).not.toBe(style.backgroundColor);
  },
};

/** The reference design's two floating badges, rebuilt from the component. */
export const AsInTheReference: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip leading={<AvatarStack items={PEOPLE} max={3} />}>+1M Like&apos;s</Chip>
      <Chip
        size="sm"
        leading={<span className="size-5 rounded-pill bg-amber-500" aria-hidden="true" />}
      >
        @Dsingr
      </Chip>
      <Chip variant="brand" leading={<SparkleIcon />}>
        New drop
      </Chip>
    </div>
  ),
};
