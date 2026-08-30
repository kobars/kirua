import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { CartIcon, SearchIcon } from './icons';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: { title: 'Nothing here yet' },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4'] },
    icon: { control: false },
    action: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The commonest unowned screen in any application. The `action` slot is the important one: an empty state that only says "nothing here" has told the reader what they already knew.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      icon={<SearchIcon size="2xl" />}
      title="No results for “kacamata”"
      description="Check the spelling, or search the whole catalogue instead of this category."
      action={<Button variant="secondary">Clear filters</Button>}
    />
  ),
};

export const WithoutAnAction: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      icon={<CartIcon size="2xl" />}
      title="Your cart is empty"
      description="Items you add will be kept here for seven days."
    />
  ),
};

/**
 * The heading level is a prop because no single answer fits both places an
 * empty state appears. A wrong level is invisible on screen.
 */
export const TheHeadingLevelIsChosen: Story = {
  render: (args) => (
    // h1 then h2, not h1 then h3: the axe run enforces `heading-order`.
    <div className="grid gap-8">
      <EmptyState {...args} headingLevel="h1" title="An empty page" />
      <EmptyState {...args} headingLevel="h2" title="An empty region inside a page" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('An empty page');
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'An empty region inside a page',
    );
  },
};
