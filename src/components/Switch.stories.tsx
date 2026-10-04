import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { utilityValue } from '@/test/utility';
import { Label } from './Label';
import { Switch } from './Switch';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'A labelled setting that takes effect immediately. Use Checkbox for a choice submitted as part of a form.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} id="notify" />
      <Label htmlFor="notify">Email me about replies</Label>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(
        [
          ['off', false, false],
          ['on', true, false],
          ['off and disabled', false, true],
          ['on and disabled', true, true],
        ] as const
      ).map(([label, checked, disabled]) => (
        <div className="flex items-center gap-3" key={label}>
          <Switch {...args} id={`sw-${label}`} checked={checked} disabled={disabled} />
          <Label htmlFor={`sw-${label}`}>{label}</Label>
        </div>
      ))}
    </div>
  ),
};

export const ItIsASwitchAndTheThumbTravels: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} id="travel" />
      <Label htmlFor="travel">Reduce motion</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Reduce motion' });
    const thumb = control.querySelector('[data-slot="switch-thumb"]')!;

    const before = thumb.getBoundingClientRect().x;
    await userEvent.click(control);
    await expect(control).toBeChecked();

    await waitFor(async () => {
      await expect(thumb.getBoundingClientRect().x).toBeGreaterThan(before);
    });
  },
};

/**
 * Disabled on and disabled off are told apart by the track as well as the
 * thumb's position, and the label after a disabled switch dims with it.
 */
export const DisabledOnAndOff: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Switch {...args} id="disabled-off" disabled checked={false} />
        <Label htmlFor="disabled-off">Off, locked</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch {...args} id="disabled-on" disabled checked />
        <Label htmlFor="disabled-on">On, locked</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const off = canvas.getByRole('switch', { name: 'Off, locked' });
    const on = canvas.getByRole('switch', { name: 'On, locked' });

    await waitFor(() =>
      expect(getComputedStyle(off).backgroundColor).not.toBe(
        getComputedStyle(on).backgroundColor,
      ),
    );
    const label = canvas.getByText('Off, locked');
    await expect(getComputedStyle(label).color).toBe(
      utilityValue('text-on-field-disabled', 'color', label.parentElement!),
    );

    // 2px between thumb and track at the end the thumb rests against.
    const track = on.getBoundingClientRect();
    const thumb = on.querySelector('[data-slot="switch-thumb"]')!.getBoundingClientRect();
    await expect(track.right - thumb.right).toBe(2);
    await expect(thumb.top - track.top).toBe(2);
  },
};
