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
  ['poli-umum', 'Poli Umum'],
  ['poli-gigi', 'Poli Gigi'],
  ['poli-anak', 'Poli Anak'],
  ['poli-mata', 'Poli Mata'],
] as const;

export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="poli-umum">
        <SelectTrigger aria-label="Poliklinik">
          <SelectValue />
        </SelectTrigger>
        <SelectContent aria-label="Poliklinik">
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
      <Field controlId="clinic" label="Poliklinik" description="Where the visit is booked.">
        <Select {...args}>
          <SelectTrigger id="clinic">
            <SelectValue placeholder="Choose a clinic" />
          </SelectTrigger>
          <SelectContent aria-label="Poliklinik">
            <SelectGroup>
              <SelectLabel>Umum</SelectLabel>
              <SelectItem value="poli-umum">Poli Umum</SelectItem>
              <SelectItem value="poli-anak">Poli Anak</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Spesialis</SelectLabel>
              <SelectItem value="poli-gigi">Poli Gigi</SelectItem>
              <SelectItem value="poli-mata">Poli Mata</SelectItem>
              <SelectItem value="poli-jantung" disabled>
                Poli Jantung — full today
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
      <Select {...args} defaultValue="poli-umum">
        <SelectTrigger aria-label="Poliklinik">
          <SelectValue />
        </SelectTrigger>
        <SelectContent aria-label="Poliklinik">
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
    const trigger = canvas.getByRole('combobox', { name: 'Poliklinik' });

    await expect(trigger).toHaveTextContent('Poli Umum');

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
      await expect(trigger).toHaveTextContent('Poli Gigi');
    });

    // Wait for the closing panel to leave the DOM. Radix keeps it mounted for
    // its exit animation, and the axe run that follows sees an aria-hidden node
    // with focusable content inside it — `aria-hidden-focus`.
    await waitFor(async () => {
      await expect(document.querySelector('[data-slot="select-content"]')).toBeNull();
    });
  },
};
