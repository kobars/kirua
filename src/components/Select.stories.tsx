import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Field } from './Field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'A native select cannot be styled to match the field family — the option list is drawn by the operating system. The trigger is h-11, the same step as Input and Button, so a row of controls lines up.',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const clinics = [
  ['general', 'General practice'],
  ['dental', 'Dental'],
  ['paediatrics', 'Paediatrics'],
  ['ophthalmology', 'Ophthalmology'],
] as const;

export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="general">
        <SelectTrigger aria-label="Clinic">
          <SelectValue />
        </SelectTrigger>
        <SelectContent aria-label="Clinic">
          {clinics.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const InAField: Story = {
  render: (args) => (
    <div className="w-72">
      <Field controlId="clinic" label="Clinic" description="Where the visit is booked.">
        <Select {...args}>
          <SelectTrigger id="clinic">
            <SelectValue placeholder="Choose a clinic" />
          </SelectTrigger>
          <SelectContent aria-label="Clinic">
            <SelectGroup>
              <SelectLabel>General</SelectLabel>
              <SelectItem value="general">General practice</SelectItem>
              <SelectItem value="paediatrics">Paediatrics</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Specialist</SelectLabel>
              <SelectItem value="dental">Dental</SelectItem>
              <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
              <SelectItem value="cardiology" disabled>
                Cardiology — full today
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
};

/** Opens the menu, chooses with the keyboard, and checks the trigger updates. */
export const ChooseWithTheKeyboard: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="general">
        <SelectTrigger aria-label="Clinic">
          <SelectValue />
        </SelectTrigger>
        <SelectContent aria-label="Clinic">
          {clinics.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Clinic' });

    await expect(trigger).toHaveTextContent('General practice');

    trigger.focus();
    await userEvent.keyboard('{Enter}');

    // The listbox is marked open one commit before its items commit, so an
    // immediate assertion measures an empty box.
    const listbox = within(document.body).getByRole('listbox');
    await waitFor(async () => {
      await expect(listbox).toBeVisible();
    });

    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(async () => {
      await expect(trigger).toHaveTextContent('Dental');
    });

    // Wait for the closing panel to leave the DOM. Radix keeps it mounted for
    // its exit animation, and the axe run that follows sees an aria-hidden node
    // with focusable content inside it — `aria-hidden-focus`.
    await waitFor(async () => {
      await expect(document.querySelector('[data-slot="select-content"]')).toBeNull();
    });
  },
};
