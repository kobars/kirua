import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { utilityValue } from '@/test/utility';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'A choice that can be checked or unchecked. Use checked="indeterminate" for a parent selection when only some children are selected. Associate each control with a visible label.',
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

/**
 * The dash or the tick is chosen from the state Radix renders, so an
 * uncontrolled checkbox that starts indeterminate shows a dash too.
 */
export const UncontrolledIndeterminate: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="uncontrolled" defaultChecked="indeterminate" />
      <Label htmlFor="uncontrolled">Some rows selected</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Some rows selected' });
    const [tick, dash] = Array.from(box.querySelectorAll('svg'));

    await expect(dash?.checkVisibility()).toBe(true);
    await expect(tick?.checkVisibility()).toBe(false);

    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(box.querySelector('svg')?.checkVisibility()).toBe(true);
  },
};

/** A disabled box dims the label after it, and a checked box keeps its own
 *  edge when the field is invalid. */
export const DisabledAndInvalid: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="locked" disabled />
        <Label htmlFor="locked">Locked by your administrator</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="invalid-checked" defaultChecked aria-invalid />
        <Label htmlFor="invalid-checked">Checked, in a form with an error</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Locked by your administrator');
    await expect(getComputedStyle(label).color).toBe(
      utilityValue('text-on-field-disabled', 'color', label.parentElement!),
    );
    await expect(getComputedStyle(label).cursor).toBe('not-allowed');

    const box = canvas.getByRole('checkbox', { name: /Checked, in a form/ });
    await waitFor(() =>
      expect(getComputedStyle(box).borderTopColor).toBe(
        utilityValue('border-primary', 'borderTopColor', box.parentElement!),
      ),
    );
  },
};
