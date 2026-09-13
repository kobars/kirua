import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CheckIcon } from './icons';
import { List, ListItem } from './List';

const meta = {
  tags: ['autodocs'],
  title: 'Components/List',
  component: List,
  args: { variant: 'bullet', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bullet', 'number', 'plain'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A styled list of related prose items. Choose ordered lists when sequence matters and unordered lists when it does not.',
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-96">
      <List {...args}>
        <ListItem>The artwork is the interface.</ListItem>
        <ListItem>A price is a sentence, not a table.</ListItem>
        <ListItem>Leaving is as easy as arriving.</ListItem>
      </List>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid max-w-96 gap-6">
      {(['bullet', 'number', 'plain'] as const).map((variant) => (
        <List {...args} key={variant} variant={variant}>
          <ListItem>The {variant} list, first item.</ListItem>
          <ListItem>Second item, so the spacing is visible.</ListItem>
        </List>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid max-w-96 gap-6">
      {(['sm', 'md'] as const).map((size) => (
        <List {...args} key={size} size={size}>
          <ListItem>Body {size}.</ListItem>
          <ListItem>A second line at the same size.</ListItem>
        </List>
      ))}
    </div>
  ),
};

export const TwoLevelsDeep: Story = {
  render: (args) => (
    <div className="max-w-96">
      <List {...args} variant="number" data-testid="outer">
        <ListItem>
          Make a gallery.
          <List variant="number">
            <ListItem>Give it a name.</ListItem>
            <ListItem>Give it a handle.</ListItem>
          </List>
        </ListItem>
        <ListItem>
          Add your pieces.
          <List>
            <ListItem>Full resolution is kept.</ListItem>
            <ListItem>Smaller sizes are derived.</ListItem>
          </List>
        </ListItem>
      </List>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const outer = canvas.getByTestId('outer');
    const [innerOrdered, innerBulleted] = [...outer.querySelectorAll('[data-slot="list"]')];

    await expect(outer.tagName).toBe('OL');
    await expect(getComputedStyle(outer).listStyleType).toBe('decimal');
    await expect(getComputedStyle(innerOrdered!).listStyleType).toBe('lower-alpha');
    await expect(getComputedStyle(innerBulleted!).listStyleType).toBe('circle');
  },
};

export const PlainIsStillAList: Story = {
  render: (args) => (
    <div className="max-w-96">
      <List {...args} variant="plain">
        {['Unlimited galleries', 'Your own domain', 'Commission requests'].map((line) => (
          <ListItem key={line} className="flex items-start gap-2">
            <CheckIcon size="sm" aria-hidden="true" className="mt-0.5 shrink-0" />
            {line}
          </ListItem>
        ))}
      </List>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('list')).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(getComputedStyle(canvas.getByRole('list')).listStyleType).toBe('none');
  },
};

export const PlainSurvivesNesting: Story = {
  render: (args) => (
    <div className="max-w-96">
      <List {...args} variant="bullet">
        <ListItem>
          Included in Studio:
          <List variant="plain" data-testid="inner">
            <ListItem>Unlimited galleries</ListItem>
            <ListItem>Your own domain</ListItem>
          </List>
        </ListItem>
      </List>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(getComputedStyle(canvas.getByTestId('inner')).listStyleType).toBe('none');
  },
};
