import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AspectRatio } from './AspectRatio';
import { CartIcon, SparkleIcon } from './icons';
import { Inline } from './Inline';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './Item';
import { Placeholder } from './Placeholder';
import { Text } from './Text';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Placeholder',
  component: Placeholder,
  args: { tone: 'sunken', size: 'md', shape: 'rounded' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['sunken', 'brand'] },
    size: { control: 'inline-radio', options: ['fill', ...SIZES] },
    shape: { control: 'inline-radio', options: ['rounded', 'circle', 'square'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A tinted box where a picture would be: a product with no photo, a thumbnail, the mark beside a reply. Decorative unless given a role and a label.',
      },
    },
  },
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Placeholder {...args}>
      <CartIcon />
    </Placeholder>
  ),
};

export const FillsAnAspectRatio: Story = {
  render: () => (
    <div className="w-48">
      <AspectRatio ratio={1} radius="md" data-testid="box">
        <Placeholder data-testid="placeholder">R</Placeholder>
      </AspectRatio>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByTestId('box').getBoundingClientRect();
    const placeholder = canvas.getByTestId('placeholder');

    await expect(Math.round(placeholder.getBoundingClientRect().width)).toBe(
      Math.round(box.width),
    );
    await expect(Math.round(placeholder.getBoundingClientRect().height)).toBe(
      Math.round(box.height),
    );
    // Decorative: the product's name is the title beside it.
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true');
  },
};

export const ACaptionInsideIt: Story = {
  render: () => (
    <div className="w-72">
      <AspectRatio ratio={16 / 9} radius="md">
        <Placeholder data-testid="placeholder">
          <Text size="sm" tone="muted" align="center" data-testid="caption">
            Nine studies of a hand, arranged in a grid
          </Text>
        </Placeholder>
      </AspectRatio>
    </div>
  ),
  /**
   * A caption in the body face keeps its own case and tracking, not the
   * display face's capitals, and sits clear of the box's edges.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const caption = getComputedStyle(canvas.getByTestId('caption'));
    await expect(caption.textTransform).toBe('none');
    await expect(caption.letterSpacing).toBe('normal');
    await expect(getComputedStyle(canvas.getByTestId('placeholder')).paddingInlineStart).toBe(
      '24px',
    );
  },
};

export const SizesTonesAndShapes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['sunken', 'brand'] as const).map((tone) => (
        <Inline key={tone} gap={3}>
          {SIZES.map((size) => (
            <Placeholder key={size} tone={tone} size={size} data-testid={`${tone}-${size}`}>
              <SparkleIcon />
            </Placeholder>
          ))}
          <Placeholder tone={tone} size="md" shape="circle">
            <SparkleIcon />
          </Placeholder>
          <Placeholder tone={tone} size="md" shape="square">
            <SparkleIcon />
          </Placeholder>
        </Inline>
      ))}
    </div>
  ),
  /** The fixed steps match `Avatar`'s circles, so a thumbnail and an avatar line up. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const side = (size: string) =>
      Math.round(canvas.getByTestId(`sunken-${size}`).getBoundingClientRect().width);

    await expect(side('xs')).toBe(24);
    await expect(side('sm')).toBe(40);
    await expect(side('md')).toBe(48);
    await expect(side('lg')).toBe(64);
  },
};

export const AThumbnailInARow: Story = {
  render: () => (
    <Item variant="outline">
      <ItemMedia>
        <Placeholder size="md">
          <CartIcon />
        </Placeholder>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Round glasses</ItemTitle>
        <ItemDescription>Qty 1 · Rp 240.000</ItemDescription>
      </ItemContent>
    </Item>
  ),
};
