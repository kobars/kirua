import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: 'Loading' },
  parameters: {
    docs: {
      description: {
        component:
          'Follows `--icon-size`, so inside a Button it is already the size of the icon it replaces and the control does not change width while it works.',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InsideAControl: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" disabled>
        <Spinner {...args} label="Saving" /> Saving
      </Button>
      <Button size="md" disabled>
        <Spinner {...args} label="Saving" /> Saving
      </Button>
      <Button size="lg" disabled>
        <Spinner {...args} label="Saving" /> Saving
      </Button>
    </div>
  ),
};

/**
 * The size claim, measured rather than described: the spinner in the large
 * button is drawn larger than the one in the small button, because both read
 * `--icon-size` from the control around them.
 */
export const ItTakesTheSizeOfItsControl: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button size="sm" disabled data-testid="small">
        <Spinner {...args} /> Small
      </Button>
      <Button size="lg" disabled data-testid="large">
        <Spinner {...args} /> Large
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svgOf = (id: string) =>
      canvas.getByTestId(id).querySelector('[data-slot="spinner"] svg')!;

    const small = svgOf('small').getBoundingClientRect().width;
    const large = svgOf('large').getBoundingClientRect().width;

    await expect(small).toBeGreaterThan(0);
    await expect(large).toBeGreaterThan(small);
  },
};

export const TheLabelIsOverridable: Story = {
  render: (args) => <Spinner {...args} label="Menghitung ulang" />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Menghitung ulang',
    );
  },
};
