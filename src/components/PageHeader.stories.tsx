import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import { Button } from './Button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup';
import { PlusIcon, SearchIcon } from './icons';
import { PageHeader } from './PageHeader';
import { SM, atLeast } from '@/test/viewport';

const meta = {
  tags: ['autodocs'],
  title: 'Components/PageHeader',
  component: PageHeader,
  args: {
    title: 'Patient list',
    description: '128 patients registered today',
    align: 'end',
    level: 'h1',
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['end', 'center'] },
    level: { control: 'inline-radio', options: ['h1', 'h2'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The top of a page: its title, an optional line under it, and the page’s own actions, which drop under the title on a narrow screen.',
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    actions: <Button leadingIcon={<PlusIcon />}>New visit</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1, name: 'Patient list' });
    const description = canvas.getByText('128 patients registered today');

    await expect(heading).toHaveAttribute('data-slot', 'heading');
    // The description follows the title with the header's own gap, not a margin.
    await expect(description.getBoundingClientRect().top).toBeGreaterThan(
      heading.getBoundingClientRect().bottom,
    );
  },
};

export const ActionsWrapUnderTheTitle: Story = {
  render: (args) => (
    <div className="w-80" data-testid="frame">
      <PageHeader
        {...args}
        title="Laboratory"
        description="42 test orders"
        actions={
          <InputGroup width="md">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput aria-label="Search tests" placeholder="Search a panel" />
          </InputGroup>
        }
      />
    </div>
  ),
  /** On a narrow column the search drops below the title instead of squeezing it. */
  play: async ({ canvasElement }) => {
    const frame = within(canvasElement).getByTestId('frame');
    const heading = within(frame).getByRole('heading', { name: 'Laboratory' });
    const search = frame.querySelector('[data-slot="input-group"]') as HTMLElement;

    await expect(search.getBoundingClientRect().top).toBeGreaterThan(
      heading.getBoundingClientRect().bottom,
    );
    await expect(frame.scrollWidth).toBe(frame.clientWidth);
    // Below `sm` the field spans the row, as `width` promises on a phone.
    if (!atLeast(SM)) {
      await expect(Math.round(search.getBoundingClientRect().width)).toBe(frame.clientWidth);
    }
  },
};

export const CentredWithABadgeInTheTitle: Story = {
  args: {
    align: 'center',
    description: undefined,
    title: (
      <>
        Notifications <Badge status="info">3 new</Badge>
      </>
    ),
    actions: (
      <Button size="sm" variant="secondary">
        Mark all read
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 1 });
    await expect(heading).toHaveTextContent('Notifications 3 new');
  },
};

export const ARegionOfAPage: Story = {
  args: {
    level: 'h2',
    size: 'heading-sm',
    eyebrow: 'Account',
    title: 'Delivery addresses',
    description: 'Where your orders can be sent',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Delivery addresses',
    );
    await expect(canvas.getByText('Account')).toHaveAttribute('data-slot', 'eyebrow');
  },
};
