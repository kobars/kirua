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
