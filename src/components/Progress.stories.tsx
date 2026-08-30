import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 63, max: 100 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  parameters: {
    docs: {
      description: {
        component:
          'Pass a number and the bar reports aria-valuenow. Pass null and it reports nothing, which is the honest answer when the total is unknown. A bar has no accessible name of its own — give it one.',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Progress {...args} aria-label="Upload progress" />
    </div>
  ),
};

export const DeterminateAndNot: Story = {
  render: (args) => (
    <div className="grid w-80 gap-6">
      <div className="grid gap-2">
        <span className="text-body-sm text-fg-secondary">Uploading — 63%</span>
        <Progress {...args} value={63} aria-label="Upload progress" />
      </div>
      <div className="grid gap-2">
        <span className="text-body-sm text-fg-secondary">Searching…</span>
        <Progress {...args} value={null} aria-label="Searching" />
      </div>
    </div>
  ),
};

/**
 * The ARIA difference, which is the whole reason both states exist. A bar with
 * no known total must not claim a value — a screen reader would read it as
 * progress that is not being made.
 */
export const IndeterminateReportsNoValue: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      <Progress {...args} value={40} aria-label="Determinate" />
      <Progress {...args} value={null} aria-label="Indeterminate" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Determinate')).toHaveAttribute('aria-valuenow', '40');
    await expect(canvas.getByLabelText('Indeterminate')).not.toHaveAttribute('aria-valuenow');
  },
};
