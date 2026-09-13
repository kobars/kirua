/* oxlint-disable import/default, import/no-duplicates -- Vite ?raw imports load source text separately from the executable module. */
import { CommunityCommands } from '../patterns/examples/CommunityCommands';
import CommunityCommandsSource from '../patterns/examples/CommunityCommands.tsx?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
  tags: ['autodocs'],
  title: 'Components/Command',
  component: Command,
  parameters: {
    docs: {
      story: { height: '480px' },
      description: {
        component:
          'A searchable action palette inside a dialog. The application supplies a trigger, filtering, keyboard navigation and action execution. The interactive example shows that wiring; the other previews illustrate fixed states.',
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: CommunityCommandsSource.replace("from '@/components'", "from 'kirua'"),
        language: 'tsx',
      },
    },
  },
  name: 'Search and run an action',
  render: (args) => <CommunityCommands {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open commands' });
    await userEvent.click(trigger);
    const input = await body.findByRole('combobox', { name: 'Search commands' });
    await userEvent.type(input, 'saved');
    await expect(body.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Selected: View saved artwork.',
    );
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await userEvent.type(await body.findByRole('combobox', { name: 'Search commands' }), 'zzz');
    await expect(body.getByText('No actions match your search.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
  },
};

export const GroupedActions: Story = {
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput
        placeholder="Search commands…"
        aria-label="Search commands"
        aria-controls="cmd-list"
        aria-activedescendant="cmd-patient"
      />
      <CommandList id="cmd-list" aria-label="Commands">
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

export const ItIsADialogAndTheInputOwnsTheHighlight: Story = {
  name: 'Dialog focus and active option',
  render: (args) => (
    <Command {...args} open label="Command palette">
      <CommandInput
        aria-label="Search commands"
        aria-controls="cmd-assert-list"
        aria-activedescendant="cmd-assert-visit"
      />
      <CommandList id="cmd-assert-list" aria-label="Commands">
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
