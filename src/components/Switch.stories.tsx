import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
