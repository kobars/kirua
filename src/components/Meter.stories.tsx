import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Meter } from './Meter';
import { Text } from './Text';

const meta = {
  tags: ['autodocs'],
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
          'A measurement within a known range, such as storage or stock. Provide a label and meaningful value text. Use Progress for task completion.',
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

export const AShortBarKeepsItsLength: Story = {
  render: (args) => (
    <table>
      <tbody>
        <tr>
          <td data-testid="cell">
            <Text size="sm">12</Text>
            <Meter {...args} size="sm" value={12} />
          </td>
        </tr>
      </tbody>
    </table>
  ),
  /** An auto-width cell would shrink the bar to the number; `sm` holds 8rem. */
  play: async ({ canvasElement }) => {
    const meter = canvasElement.querySelector<HTMLElement>('[data-slot="meter"]')!;
    await expect(Math.round(meter.getBoundingClientRect().width)).toBe(128);
  },
};
