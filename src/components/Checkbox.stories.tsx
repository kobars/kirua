import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Three states, not two. `checked="indeterminate"` is the state a "select all" row is in when some but not all of its rows are ticked, and it is drawn as a dash because a tick that means "partly" is a lie.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="playground" />
      <Label htmlFor="playground">Email me about replies</Label>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(
        [
          ['unchecked', false, false],
          ['checked', true, false],
          ['indeterminate', 'indeterminate', false],
          ['disabled', false, true],
          ['disabled and checked', true, true],
        ] as const
      ).map(([label, checked, disabled]) => (
        <div className="flex items-center gap-2" key={label}>
          <Checkbox {...args} id={`state-${label}`} checked={checked} disabled={disabled} />
          <Label htmlFor={`state-${label}`}>{label}</Label>
        </div>
      ))}
    </div>
  ),
};

/** The indeterminate box reports `aria-checked="mixed"`. */
export const IndeterminateIsAnnouncedAsMixed: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="all" checked="indeterminate" />
        <Label htmlFor="all">All items</Label>
      </div>
      <div className="flex items-center gap-2 ps-6">
        <Checkbox {...args} id="one" checked />
        <Label htmlFor="one">First item</Label>
      </div>
      <div className="flex items-center gap-2 ps-6">
        <Checkbox {...args} id="two" checked={false} />
        <Label htmlFor="two">Second item</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('checkbox', { name: 'All items' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
    await expect(canvas.getByRole('checkbox', { name: 'First item' })).toBeChecked();
  },
};

/** The label is the click target too, which is the point of `htmlFor`. */
export const TheLabelTogglesIt: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">I have read the terms</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'I have read the terms' });

    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText('I have read the terms'));
    await expect(box).toBeChecked();
  },
};
