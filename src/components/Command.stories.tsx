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
        placeholder="Cari perintah…"
        aria-label="Cari perintah"
        aria-controls="cmd-list"
        aria-activedescendant="cmd-patient"
      />
      <CommandList id="cmd-list" aria-label="Perintah">
        <CommandGroup heading="Pasien">
          <CommandItem id="cmd-patient" isActive shortcut={<Kbd>P</Kbd>}>
            <UserIcon aria-hidden="true" /> Cari pasien
          </CommandItem>
          <CommandItem id="cmd-new">
            <UserIcon aria-hidden="true" /> Daftarkan pasien baru
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Kunjungan">
          <CommandItem id="cmd-visit" shortcut={<Kbd>K</Kbd>}>
            <CalendarIcon aria-hidden="true" /> Buat kunjungan
          </CommandItem>
          <CommandItem id="cmd-clinic">
            <StethoscopeIcon aria-hidden="true" /> Ganti poliklinik
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const NoMatches: Story = {
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput defaultValue="zzz" aria-label="Cari perintah" aria-expanded={false} />
      {/* INSTEAD OF the list — see CommandEmpty's own note. */}
      <CommandEmpty>Tidak ada perintah yang cocok.</CommandEmpty>
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
        aria-label="Cari perintah"
        aria-controls="cmd-assert-list"
        aria-activedescendant="cmd-assert-visit"
      />
      <CommandList id="cmd-assert-list" aria-label="Perintah">
        <CommandGroup heading="Kunjungan">
          <CommandItem id="cmd-assert-visit" isActive>
            Buat kunjungan
          </CommandItem>
          <CommandItem id="cmd-assert-clinic">Ganti poliklinik</CommandItem>
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

    const input = body.getByRole('combobox', { name: 'Cari perintah' });
    await expect(input).toHaveAttribute('aria-activedescendant', 'cmd-assert-visit');
    await expect(document.activeElement).toBe(input);

    // A group inside a listbox is a labelled group, not an option.
    await expect(body.getByRole('group', { name: 'Kunjungan' })).toBeVisible();
    await expect(body.getAllByRole('option')).toHaveLength(2);
  },
};
