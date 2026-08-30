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
          'The row that lists, menus and settings panels are made of. It carries no ARIA role: the same shape is a paragraph in one place and a list item in another, and only the caller knows which.',
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
    <ItemGroup className="w-96 rounded-lg border border-line-subtle bg-raised">
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
};

/**
 * `asChild` is what makes a whole row a link. Asserted, because the tempting
 * alternative — an anchor wrapping the row — nests the action buttons inside
 * the link, and a button inside a link is not clickable.
 */
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

/**
 * A long title truncates rather than widening the row. That only works because
 * `ItemContent` is `min-w-0`; a flex child defaults to `min-width: auto` and
 * refuses to shrink below its content.
 */
export const ALongTitleTruncates: Story = {
  render: (args) => (
    <Item {...args} variant="outline" className="w-72">
      <ItemContent>
        <ItemTitle data-testid="title">
          Rujukan poliklinik penyakit dalam untuk pemeriksaan lanjutan
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
