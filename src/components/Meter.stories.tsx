import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Meter } from './Meter';
import { Text } from './Text';

const meta = {
  title: 'Components/Meter',
  component: Meter,
  args: { value: 86, min: 0, max: 120, label: 'Bed occupancy', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    thresholds: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A measurement, not a task. `Progress` carries `role="progressbar"`, which means how far along a task is — so using it for bed occupancy or a stock level tells a screen reader something untrue.',
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Meter {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      {(['sm', 'md'] as const).map((size) => (
        <div key={size} className="grid gap-1.5">
          <Text size="sm">{size}</Text>
          <Meter {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

/**
 * Normal is the brand fill and not green. Green means "succeeded" everywhere
 * else in this system, and a ward at 60% has not succeeded at anything.
 */
export const Thresholds: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      {[
        { value: 72, name: 'below the warning line' },
        { value: 106, name: 'past the warning line' },
        { value: 116, name: 'past the danger line' },
      ].map((row) => (
        <div key={row.name} className="grid gap-1.5">
          <Text size="sm">{row.name}</Text>
          <Meter
            {...args}
            value={row.value}
            thresholds={{ warning: 102, danger: 114 }}
            valueText={`${row.value} of 120 beds`}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * The two claims a bar cannot make on its own: what it is a measurement *of*,
 * and what its number means. `aria-valuetext` is why "86" is announced as
 * "86 of 120 beds" rather than as a figure with no unit.
 */
export const AnnouncedAsAMeasurement: Story = {
  args: { valueText: '86 of 120 beds' },
  render: (args) => (
    <div className="w-80">
      <Meter {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole('meter', { name: 'Bed occupancy' });

    await expect(meter).toHaveAttribute('aria-valuenow', '86');
    await expect(meter).toHaveAttribute('aria-valuemax', '120');
    await expect(meter).toHaveAttribute('aria-valuetext', '86 of 120 beds');
    await expect(meter).not.toHaveAttribute('role', 'progressbar');
  },
};

/**
 * The threshold decides the fill, and the fill is a real colour on the page.
 * Asserted because a threshold that silently never fires looks exactly like a
 * value that never crossed it.
 */
export const ThresholdChangesTheFill: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      <Meter {...args} value={72} thresholds={{ warning: 102, danger: 114 }} label="Normal" />
      <Meter {...args} value={106} thresholds={{ warning: 102, danger: 114 }} label="Warning" />
      <Meter {...args} value={116} thresholds={{ warning: 102, danger: 114 }} label="Danger" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fillOf = (name: string) =>
      getComputedStyle(
        canvas.getByRole('meter', { name }).querySelector('[data-slot="meter-fill"]')!,
      ).backgroundColor;

    await expect(canvas.getByRole('meter', { name: 'Warning' })).toHaveAttribute(
      'data-level',
      'warning',
    );
    await expect(fillOf('Normal')).not.toBe(fillOf('Warning'));
    await expect(fillOf('Warning')).not.toBe(fillOf('Danger'));
  },
};

/**
 * The width is the value, so a bar that stops reporting is a bar that lies
 * quietly. 86 of 120 is 71.67%.
 */
export const WidthIsTheValue: Story = {
  render: (args) => (
    <div className="w-80">
      <Meter {...args} data-testid="m" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvas.getByTestId('m');
    const fill = track.querySelector('[data-slot="meter-fill"]')!;

    await expect(
      fill.getBoundingClientRect().width / track.getBoundingClientRect().width,
    ).toBeCloseTo(86 / 120, 2);
  },
};
