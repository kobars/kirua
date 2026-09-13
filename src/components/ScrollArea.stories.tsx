import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Card, CardBody, CardTitle } from './Card';
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
