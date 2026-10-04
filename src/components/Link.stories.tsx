import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Link } from './Link';
import { Text } from './Text';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Link',
  component: Link,
  args: { variant: 'inline', href: '#', children: 'the publishing guide' },
  argTypes: { variant: { control: 'inline-radio', options: ['inline', 'block'] } },
  parameters: {
    docs: {
      description: {
        component:
          'An inline navigation link with a focus treatment. Use a meaningful destination and link text. For a prominent navigation action, Button supports asChild.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InsideASentence: Story = {
  render: (args) => (
    <Text tone="primary">
      Read <Link {...args} variant="inline" /> before you upload anything.
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'the publishing guide' });

    await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
  },
};

export const TheWholeThingYouClick: Story = {
  args: { variant: 'block', children: 'Round Glasses' },
  render: (args) => (
    <div className="text-heading-md font-semibold text-fg">
      <Link {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Round Glasses' });
    const parent = link.parentElement!;

    await expect(getComputedStyle(link).textDecorationLine).toBe('none');
    await expect(getComputedStyle(link).color).toBe(getComputedStyle(parent).color);
  },
};

export const OnEverySurface: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {[
        ['page', 'bg-page'],
        ['raised', 'bg-raised'],
        ['inverse', 'ctx-inverse bg-page'],
        ['brand', 'ctx-brand bg-brand'],
      ].map(([name, surface]) => (
        <div key={name} className={`${surface} rounded-lg p-4 text-body-md text-fg`}>
          <span className="text-fg-secondary">{name}: </span>
          <Link {...args} variant="inline">
            an inline link
          </Link>
          {' · '}
          <Link {...args} variant="block">
            a block link
          </Link>
        </div>
      ))}
    </div>
  ),
};

export const InheritingTheSurroundingColour: Story = {
  render: () => (
    <Text tone="primary">
      Fix the{' '}
      <Link variant="inherit" href="#phone">
        phone number
      </Link>{' '}
      before you continue.
    </Text>
  ),
  /** Underlined, in the colour of the text it sits in rather than the accent. */
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'phone number' });
    const text = link.parentElement!;
    await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    await expect(getComputedStyle(link).color).toBe(getComputedStyle(text).color);
  },
};
