import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, within } from 'storybook/test';
import { Progress } from './Progress';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Progress',
  component: Progress,
  args: { value: 63, max: 100 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  parameters: {
    docs: {
      description: {
        component:
          'Progress through a task. Supply a label and numeric value when the total is known; use null for an indeterminate wait.',
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

/**
 * Out of range, Radix announces the bar as indeterminate, so it must also
 * look indeterminate rather than draw a full, still bar.
 */
export const OutOfRangeIsIndeterminate: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      <Progress {...args} value={105} aria-label="Overshot" />
      <Progress {...args} value={40} max={0} aria-label="No total" />
    </div>
  ),
  // Radix reports both props with console.error; that is the point here.
  beforeEach: () => {
    const quiet = spyOn(console, 'error').mockImplementation(() => undefined);
    return () => quiet.mockRestore();
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = (name: string) =>
      canvas.getByLabelText(name).querySelector('[data-slot="progress-indicator"]')!;

    await expect(canvas.getByLabelText('Overshot')).not.toHaveAttribute('aria-valuenow');
    await expect(indicator('Overshot')).toHaveAttribute('data-state', 'indeterminate');
    await expect(getComputedStyle(indicator('Overshot')).animationName).not.toBe('none');

    // An unusable max is 100, as Radix reads it: 40 of 100, not NaN of 0.
    await expect(canvas.getByLabelText('No total')).toHaveAttribute('aria-valuenow', '40');
    await expect((indicator('No total') as HTMLElement).style.width).toBe('40%');
  },
};
