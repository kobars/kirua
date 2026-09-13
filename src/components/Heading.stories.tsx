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
  tags: ['autodocs'],
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
          'A heading with independent document level and visual size. Choose as for the page outline and size for emphasis. Reserve display sizes for short promotional headlines.',
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

export const HiddenButStillNamed: Story = {
  args: { as: 'h2', className: 'sr-only', children: 'Aozora in numbers' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 2, name: 'Aozora in numbers' });

    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveClass('sr-only');
  },
};
