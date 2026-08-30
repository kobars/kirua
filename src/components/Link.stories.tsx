import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Link } from './Link';
import { Text } from './Text';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { variant: 'inline', href: '#', children: 'the publishing guide' },
  argTypes: { variant: { control: 'inline-radio', options: ['inline', 'block'] } },
  parameters: {
    docs: {
      description: {
        component:
          'The ordinary link. The focus ring is in the base and cannot be opted out of — a ring retyped at every call site is a ring somebody eventually leaves off.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * An inline link is underlined at rest, not on hover. Asserted, because
 * "underline on hover" is the version this system had written twice and is the
 * one that fails WCAG 1.4.1 inside a sentence.
 */
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

/**
 * A block link takes no colour of its own, so a card title stays a card title
 * instead of turning into a search result.
 */
export const TheWholeThingYouClick: Story = {
  args: { variant: 'block', children: 'Kacamata bulat' },
  render: (args) => (
    <div className="text-heading-md font-semibold text-fg">
      <Link {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Kacamata bulat' });
    const parent = link.parentElement!;

    await expect(getComputedStyle(link).textDecorationLine).toBe('none');
    await expect(getComputedStyle(link).color).toBe(getComputedStyle(parent).color);
  },
};

/**
 * Both variants on all four surfaces. An inline link reads through `text-accent`,
 * which every context re-points; a block link inherits, so it cannot go wrong.
 */
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
