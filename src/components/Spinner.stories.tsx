import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { Spinner } from './Spinner';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: 'Loading' },
  parameters: {
    docs: {
      description: {
        component:
          'A compact loading indicator sized to the surrounding icon scale. Supply loading text through the containing control or status region.',
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
  render: (args) => <Spinner {...args} label="Recalculating totals" />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Recalculating totals',
    );
  },
};
