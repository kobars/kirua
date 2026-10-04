import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Badge } from './Badge';
import { Card, CardBody, CardTitle } from './Card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from './Item';
import { ScrollArea } from './ScrollArea';

const meta = {
  tags: ['autodocs'],
  title: 'Components/ScrollArea',
  component: ScrollArea,
  args: { orientation: 'vertical' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A scrollable region with styled scrollbars. Constrain its dimensions and ensure keyboard users can reach overflowing content.',
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Card key={i} padding="sm" className="shrink-0">
      <CardTitle className="text-heading-md">Card {i + 1}</CardTitle>
      <CardBody>One of {count}.</CardBody>
    </Card>
  ));

const bar = (root: HTMLElement, orientation: string) =>
  root.querySelector<HTMLElement>(
    `[data-slot="scroll-bar"][data-orientation="${orientation}"]`,
  );

export const Vertical: Story = {
  render: (args) => (
    <ScrollArea {...args} className="size-80 rounded-lg border border-line">
      <div className="flex flex-col gap-3 p-3">{cards(12)}</div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    // The bar mounts first and its thumb only once Radix has measured the
    // content, so both are awaited — reading the thumb too early is a null.
    await waitFor(() => expect(bar(canvasElement, 'vertical')).not.toBeNull());
    const thumb = await waitFor(() => {
      const node = canvasElement.querySelector('[data-slot="scroll-bar-thumb"]');
      expect(node).not.toBeNull();
      return node!;
    });
    // Themed: the thumb has a fill, and it came from the token, not a raw colour.
    await expect(getComputedStyle(thumb).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(bar(canvasElement, 'horizontal')).toBeNull();
  },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ScrollArea {...args} className="w-80 rounded-lg border border-line">
      <div className="flex w-max gap-3 p-3">{cards(8)}</div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bar(canvasElement, 'horizontal')).not.toBeNull());
    await expect(bar(canvasElement, 'vertical')).toBeNull();
  },
};

export const Both: Story = {
  args: { orientation: 'both' },
  render: (args) => (
    <ScrollArea {...args} className="size-80 rounded-lg border border-line">
      <div className="grid w-max grid-cols-3 gap-3 p-3">{cards(18)}</div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bar(canvasElement, 'vertical')).not.toBeNull());
    await expect(bar(canvasElement, 'horizontal')).not.toBeNull();
  },
};

export const NoOverflow: Story = {
  args: { orientation: 'both' },
  render: (args) => (
    <ScrollArea {...args} className="size-80 rounded-lg border border-line">
      <div className="flex flex-col gap-3 p-3">{cards(2)}</div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    // Radix measures after mount, so give it a frame before claiming absence.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await expect(canvasElement.querySelector('[data-slot="scroll-bar"]')).toBeNull();
  },
};

/**
 * A row that truncates inside a vertical region. Radix's content box is a
 * table, which grows to its widest line; the title must cut with an ellipsis
 * and the badge at the row's end must stay inside the region.
 */
export const TruncatesInside: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-40 w-72 rounded-lg border border-line">
      {['Maya', 'Eko', 'Rin'].map((name) => (
        <Item key={name} size="sm" data-testid="row">
          <ItemContent>
            <ItemTitle>{name} wrote a message much longer than the region is wide</ItemTitle>
            <ItemDescription>
              A preview line that is also far too long to fit here
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge status="info">3</Badge>
          </ItemActions>
        </Item>
      ))}
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area"]')!;
    const title = canvasElement.querySelector<HTMLElement>('[data-slot="item-title"]')!;
    const badge = canvasElement.querySelector<HTMLElement>('[data-slot="badge"]')!;
    // Cut, not clipped: the title is narrower than its own text.
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    const inside = region.getBoundingClientRect();
    const end = badge.getBoundingClientRect();
    await expect(end.left).toBeGreaterThanOrEqual(inside.left);
    await expect(end.right).toBeLessThanOrEqual(inside.right);
  },
};
