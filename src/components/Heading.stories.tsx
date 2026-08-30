import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Heading } from './Heading';

const SIZES = [
  'display-xl',
  'display-lg',
  'display-md',
  'heading-lg',
  'heading-md',
  'heading-sm',
  'body-md',
  'body-sm',
] as const;

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: { as: 'h2', size: 'heading-md', children: 'Bring your anime worlds to life' },
  argTypes: {
    as: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    size: { control: 'select', options: SIZES },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Level and size are separate props. The level is required, because a heading whose level is decided by the size that looked right is how three composed screens ended up skipping one.',
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {SIZES.map((size) => (
        <Heading {...args} key={size} size={size}>
          {size}
        </Heading>
      ))}
    </div>
  ),
};

/**
 * The whole reason the component exists. Both of these are `h2` in the
 * document outline and neither of them is the same size, which is a thing a
 * hand-written tag cannot express without someone remembering to.
 */
export const LevelIsNotSize: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Heading {...args} as="h2" size="heading-lg">
        A section that opens loudly
      </Heading>
      <Heading {...args} as="h2" size="body-md">
        A section at the same level, set quietly
      </Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole('heading', { level: 2 });

    await expect(headings).toHaveLength(2);
    await expect(headings[0]).toHaveClass('text-heading-lg');
    await expect(headings[1]).toHaveClass('text-body-md');
  },
};

/**
 * A hidden heading stays in the accessibility tree. `hidden` would take it out
 * of both, which is the mistake `SidebarLabel` already made once — see the
 * `sr-only` note in `CLAUDE.md`.
 */
export const HiddenButStillNamed: Story = {
  args: { as: 'h2', className: 'sr-only', children: 'Aozora in numbers' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 2, name: 'Aozora in numbers' });

    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveClass('sr-only');
  },
};
