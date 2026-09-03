import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './Command';
import { Kbd } from './Kbd';
import { CalendarIcon, StethoscopeIcon, UserIcon } from './icons';

const meta = {
  title: 'Components/Command',
  component: Command,
  parameters: {
    docs: {
      description: {
        component:
          "A filtered list of actions inside kirua's own Dialog, rather than cmdk — the only thing a library would add here is the filtering, which is one Array.filter over data the consumer already holds.",
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput
        placeholder="Search commands…"
        aria-label="Search commands"
        aria-controls="cmd-list"
        aria-activedescendant="cmd-patient"
      />
      <CommandList id="cmd-list" aria-label="Perintah">
        <CommandGroup heading="Patients">
          <CommandItem id="cmd-patient" isActive shortcut={<Kbd>P</Kbd>}>
            <UserIcon aria-hidden="true" /> Find a patient
          </CommandItem>
          <CommandItem id="cmd-new">
            <UserIcon aria-hidden="true" /> Register a new patient
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Visits">
          <CommandItem id="cmd-visit" shortcut={<Kbd>K</Kbd>}>
            <CalendarIcon aria-hidden="true" /> Book a visit
          </CommandItem>
          <CommandItem id="cmd-clinic">
            <StethoscopeIcon aria-hidden="true" /> Change clinic
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const NoMatches: Story = {
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput defaultValue="zzz" aria-label="Search commands" aria-expanded={false} />
      {/* INSTEAD OF the list — see CommandEmpty's own note. */}
      <CommandEmpty>No command matches.</CommandEmpty>
    </Command>
  ),
};

/**
 * The palette is a named modal dialog, the input is the combobox, and the
 * highlight reaches a screen reader through `aria-activedescendant` — focus
 * never leaves the input.
 */
export const ItIsADialogAndTheInputOwnsTheHighlight: Story = {
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput
        aria-label="Search commands"
        aria-controls="cmd-assert-list"
        aria-activedescendant="cmd-assert-visit"
      />
      <CommandList id="cmd-assert-list" aria-label="Perintah">
        <CommandGroup heading="Visits">
          <CommandItem id="cmd-assert-visit" isActive>
            Book a visit
          </CommandItem>
          <CommandItem id="cmd-assert-clinic">Change clinic</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async () => {
    const body = within(document.body);

    const dialog = body.getByRole('dialog', { name: 'Command palette' });
    await waitFor(async () => {
      await expect(dialog).toBeVisible();
    });

    const input = body.getByRole('combobox', { name: 'Search commands' });
    await expect(input).toHaveAttribute('aria-activedescendant', 'cmd-assert-visit');
    await expect(document.activeElement).toBe(input);

    // A group inside a listbox is a labelled group, not an option.
    await expect(body.getByRole('group', { name: 'Visits' })).toBeVisible();
    await expect(body.getAllByRole('option')).toHaveLength(2);
  },
};
