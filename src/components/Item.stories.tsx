/* oxlint-disable jsx-a11y/control-has-associated-label --
 * The anchor's text arrives through `ItemTitle`, a component the rule cannot
 * follow, so it reports a link it can see no words in. The name is real and the
 * `play` function below reads it back with `getByRole('link', { name: … })`,
 * which is the assertion that would fail if it ever stopped being real.
 *
 * File-level, not next-line: oxlint 1.75 silently ignores an
 * `oxlint-disable-next-line` for a `jsx-a11y` rule. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarFallback } from './Avatar';
import { Badge } from './Badge';
import { IconButton } from './IconButton';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './Item';
import { MoreIcon, PillIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Item',
  component: Item,
  args: { variant: 'plain', size: 'md', interactive: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'outline', 'muted'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    interactive: { control: 'boolean' },
    asChild: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A flexible content row with optional leading and trailing parts. Choose the surrounding semantics for its use, such as a list of settings or search results.',
      },
    },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Item {...args} className="w-96">
      <ItemMedia>
        <PillIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Amoxicillin 500 mg</ItemTitle>
        <ItemDescription>Three times a day, after food</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge>12 left</Badge>
      </ItemActions>
    </Item>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-3">
      <Item {...args} variant="plain">
        <ItemContent>
          <ItemTitle>Plain</ItemTitle>
        </ItemContent>
      </Item>
      <Item {...args} variant="outline">
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
        </ItemContent>
      </Item>
      <Item {...args} variant="muted">
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-3">
      <Item {...args} size="sm" variant="outline">
        <ItemContent>
          <ItemTitle>Small</ItemTitle>
        </ItemContent>
      </Item>
      <Item {...args} size="md" variant="outline">
        <ItemContent>
          <ItemTitle>Medium</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
};

export const InAGroup: Story = {
  render: (args) => (
    <ItemGroup variant="outlined" className="w-96">
      <Item {...args} interactive>
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sari Rahayu</ItemTitle>
          <ItemDescription>Last seen 14 March</ItemDescription>
        </ItemContent>
        <ItemActions>
          <IconButton aria-label="More about Sari Rahayu" size="sm" variant="ghost">
            <MoreIcon />
          </IconButton>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item {...args} interactive>
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>BW</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Bagus Wicaksono</ItemTitle>
          <ItemDescription>Last seen 2 April</ItemDescription>
        </ItemContent>
        <ItemActions>
          <IconButton aria-label="More about Bagus Wicaksono" size="sm" variant="ghost">
            <MoreIcon />
          </IconButton>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
  /**
   * `overflow-hidden` is the part of the variant that would fail silently. A
   * row's hover fill is a rectangle, so without clipping it paints over the
   * corner it is meant to sit inside — visible only while a pointer is over the
   * first or last row, which is exactly when nobody is looking at the corner.
   */
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="item-group"]') as HTMLElement;
    await expect(getComputedStyle(group).overflow).toBe('hidden');
  },
};

export const AnUnreadRowInAGroup: Story = {
  render: (args) => (
    <ItemGroup variant="outlined" className="w-96">
      <Item {...args} interactive variant="accent" data-testid="unread">
        <ItemContent>
          <ItemTitle>Sari Rahayu replied to your post</ItemTitle>
          <ItemDescription>2 minutes ago</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item {...args} interactive>
        <ItemContent>
          <ItemTitle>Bagus Wicaksono followed you</ItemTitle>
          <ItemDescription>1 hour ago</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
  /**
   * A filled row inside an outlined group is a band from edge to edge. With
   * the row's own corners it showed notches of the page at both ends, which
   * looks like a separate pill floating in the list.
   */
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('unread');
    await expect(getComputedStyle(row).borderTopLeftRadius).toBe('0px');
    await expect(getComputedStyle(row).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

export const ASelectedRowInAFlushList: Story = {
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-card border border-line-subtle">
      <ItemGroup variant="flush">
        <Item {...args} interactive size="sm" aria-current="true" data-testid="selected">
          <ItemContent>
            <ItemTitle>Maya Kusuma</ItemTitle>
            <ItemDescription>That is the bit I meant.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item {...args} interactive size="sm">
          <ItemContent>
            <ItemTitle>Sari Melati</ItemTitle>
            <ItemDescription>Thursday works.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  ),
  /**
   * A conversation list in a pane: the open row is filled from edge to edge,
   * so it must not carry corners of its own.
   */
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('selected');
    await expect(getComputedStyle(row).borderBottomRightRadius).toBe('0px');
    await expect(getComputedStyle(row).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

export const AsChildMakesTheWholeRowALink: Story = {
  render: (args) => (
    <Item {...args} asChild interactive variant="outline" className="w-96">
      <a href="#/invoices/812">
        <ItemContent>
          <ItemTitle>Invoice 812</ItemTitle>
          <ItemDescription>Due 12 March</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /Invoice 812/ });

    await expect(link).toHaveAttribute('data-slot', 'item');
    await expect(link.tagName).toBe('A');
  },
};

export const ALongTitleTruncates: Story = {
  render: (args) => (
    <Item {...args} variant="outline" className="w-72">
      <ItemContent>
        <ItemTitle data-testid="title">
          Referral to internal medicine for further investigation
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Badge>New</Badge>
      </ItemActions>
    </Item>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByTestId('title');
    const row = canvasElement.querySelector('[data-slot="item"]') as HTMLElement;

    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    await expect(row.scrollWidth).toBe(row.clientWidth);
  },
};

export const UnreadCurrentAndFlush: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Item variant="accent" data-testid="unread">
        <ItemContent>
          <ItemTitle>Rin replied to your post</ItemTitle>
          <ItemDescription>Unread</ItemDescription>
        </ItemContent>
      </Item>
      <Item interactive aria-current="true" data-testid="current">
        <ItemContent>
          <ItemTitle>The open thread</ItemTitle>
        </ItemContent>
      </Item>
      <Item inset="none" data-testid="flush">
        <ItemContent>
          <ItemTitle>Lines up with the heading above</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
  /** The open row's fill follows `aria-current`, so the fill and the announcement agree. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const current = canvas.getByTestId('current');
    const plain = getComputedStyle(canvas.getByTestId('flush')).backgroundColor;

    await expect(getComputedStyle(current).backgroundColor).not.toBe(plain);
    await expect(getComputedStyle(canvas.getByTestId('unread')).backgroundColor).not.toBe(
      plain,
    );
    await expect(getComputedStyle(canvas.getByTestId('flush')).paddingInlineStart).toBe('0px');
  },
};

export const MediaAtTheTopAndAFigure: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Item align="start" data-testid="top">
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Daypack, 22 litres</ItemTitle>
          <ItemDescription>Rp 240,000</ItemDescription>
          <ItemDescription>Two in the cart</ItemDescription>
          <ItemDescription>Ships tomorrow</ItemDescription>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia variant="figure" data-testid="figure">
          09:30
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Siti Rahma</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
  /** The thumbnail sits level with the name, and the time is small and tabular. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByTestId('top');
    const media = row.querySelector('[data-slot="item-media"]')!;
    const title = row.querySelector('[data-slot="item-title"]')!;
    await expect(
      Math.abs(media.getBoundingClientRect().top - title.getBoundingClientRect().top),
    ).toBeLessThan(4);

    const figure = getComputedStyle(canvas.getByTestId('figure'));
    await expect(figure.fontVariantNumeric).toBe('tabular-nums');
    await expect(parseFloat(figure.fontSize)).toBeLessThan(
      parseFloat(getComputedStyle(row.querySelector('[data-slot="item-title"]')!).fontSize),
    );
  },
};
