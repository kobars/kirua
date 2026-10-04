/* oxlint-disable import/default, import/no-duplicates -- Vite ?raw imports load source text separately from the executable module. */
import { CityCombobox } from '../patterns/examples/CityCombobox';
import CityComboboxSource from '../patterns/examples/CityCombobox.tsx?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from './Combobox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './Dialog';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      story: { height: '400px' },
      description: {
        component:
          'A searchable choice built from an input and listbox. The application supplies filtering, open state, keyboard navigation and selection. Keep focus in the input and point aria-activedescendant at the highlighted option.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const cities = [
  ['bdg', 'Bandung'],
  ['jkt', 'Jakarta'],
  ['sby', 'Surabaya'],
  ['mks', 'Makassar'],
] as const;

export const Playground: Story = {
  name: 'Search and select',
  parameters: {
    docs: {
      source: {
        code: CityComboboxSource.replace("from '@/components'", "from 'kirua'"),
        language: 'tsx',
      },
      description: {
        story:
          'Type to filter cities. Use Arrow Up/Down and Enter to select, Escape to dismiss, or click an option. Focus stays on the input. The example owns all state and keyboard handlers.',
      },
    },
  },
  render: (args) => <CityCombobox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'City' });
    await userEvent.type(input, 'ja');
    await expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Jakarta');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    // The panel animates in from transparent, so it is read once it has.
    await waitFor(() =>
      expect(screen.getByText('No city matches. Try another name.')).toBeVisible(),
    );
    await expect(input).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByText('No city matches. Try another name.')).not.toBeInTheDocument(),
    );
    await userEvent.clear(input);
    await userEvent.type(input, 'ban');
    await userEvent.click(screen.getByRole('option', { name: 'Bandung' }));
    await expect(input).toHaveValue('Bandung');
    await expect(input).toHaveFocus();
  },
};

export const NoMatches: Story = {
  render: (args) => (
    <div className="h-52 w-full max-w-72">
      <Combobox {...args}>
        <ComboboxInput aria-expanded={false} aria-label="City" defaultValue="Zzz" />
        {/* INSTEAD OF the list, not inside it: a role="listbox" must contain
            options, and axe fails an empty one as aria-required-children. */}
        <ComboboxEmpty>No city matches.</ComboboxEmpty>
      </Combobox>
    </div>
  ),
};

export const TheAriaWiring: Story = {
  name: 'Highlight and selection',
  render: (args) => (
    <div className="h-80 w-full max-w-72">
      <Combobox {...args}>
        <ComboboxInput
          aria-expanded
          aria-controls="wiring-list"
          aria-activedescendant="wiring-sby"
          aria-label="City"
        />
        <ComboboxList id="wiring-list" aria-label="City">
          {cities.map(([id, name]) => (
            <ComboboxItem
              key={id}
              id={`wiring-${id}`}
              isActive={id === 'sby'}
              // The string form a consumer may write is honoured like the boolean.
              aria-selected={id === 'bdg' ? 'true' : false}
            >
              {name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'City' });

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-controls', 'wiring-list');
    // The highlight is announced through the input, because focus never leaves it.
    await expect(input).toHaveAttribute('aria-activedescendant', 'wiring-sby');

    // The highlight and the selection are different, and both are shown.
    await expect(screen.getByRole('option', { name: 'Bandung' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(screen.getByRole('option', { name: 'Surabaya' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await expect(screen.getAllByRole('option')).toHaveLength(4);

    const bandung = screen.getByRole('option', { name: 'Bandung' });
    await expect(bandung.querySelector('svg')).not.toBeNull();
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');

    // The list is portalled and placed against the input.
    const list = screen.getByRole('listbox');
    await expect(canvasElement.contains(list)).toBe(false);
    await waitFor(() =>
      expect(Math.round(list.getBoundingClientRect().width)).toBe(
        Math.round(input.getBoundingClientRect().width),
      ),
    );
  },
};

/**
 * Inside a dialog whose body scrolls, the list is portalled to the page, so
 * the dialog cannot clip it; near the bottom of the screen it flips above the
 * input. Focus stays in the input throughout, and Escape closes the list and
 * not the dialog.
 */
export const InsideAScrollingDialog: Story = {
  render: function Render() {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const matches = cities.filter(([, name]) =>
      name.toLowerCase().includes(query.toLowerCase()),
    );
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-64">
          <DialogTitle>Delivery</DialogTitle>
          <DialogDescription>Choose the city the parcel goes to.</DialogDescription>
          <Combobox open={open} onOpenChange={setOpen} className="mt-24">
            <ComboboxInput
              aria-label="City"
              value={query}
              aria-expanded={open && matches.length > 0}
              aria-controls={open && matches.length > 0 ? 'dialog-cities' : undefined}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
            />
            {open && matches.length > 0 && (
              <ComboboxList id="dialog-cities" aria-label="Cities">
                {matches.map(([id, name]) => (
                  <ComboboxItem key={id} id={`dialog-${id}`} aria-selected={false}>
                    {name}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            )}
          </Combobox>
        </DialogContent>
      </Dialog>
    );
  },
  play: async () => {
    const input = await screen.findByRole('combobox', { name: 'City' });
    input.focus();
    const list = await screen.findByRole('listbox', { name: 'Cities' });
    const dialog = screen.getByRole('dialog');

    await expect(list.closest('[role="dialog"]')).toBeNull();
    await expect(dialog.contains(list)).toBe(false);
    await expect(input).toHaveFocus();

    // Placed on whichever side has room, and never under the dialog's edge.
    await waitFor(() => {
      const box = list.getBoundingClientRect();
      const field = input.getBoundingClientRect();
      expect(box.height).toBeGreaterThan(0);
      expect(box.bottom <= field.top + 1 || box.top >= field.bottom - 1).toBe(true);
      expect(box.bottom).toBeLessThanOrEqual(window.innerHeight);
    });

    await userEvent.click(within(list).getByRole('option', { name: 'Jakarta' }));
    await expect(input).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(input).toHaveFocus();
    // The list was the top layer, so Escape closed it and left the dialog.
    await expect(dialog).toHaveAttribute('data-state', 'open');
  },
};

/** A dialog holding a combobox whose open state nobody wired: no `open`, no
 *  `onOpenChange`. Radix holds it; the consumer holds only the query. */
function UnwiredInDialog({ id }: { id: string }) {
  const [query, setQuery] = useState('');
  const matches = cities.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase()));
  const shown = query !== '' && matches.length > 0;
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Delivery</DialogTitle>
        <DialogDescription>Choose the city the parcel goes to.</DialogDescription>
        <Combobox className="mt-4">
          <ComboboxInput
            aria-label="City"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-expanded={shown}
            aria-controls={shown ? id : undefined}
          />
          {shown && (
            <ComboboxList id={id} aria-label="Cities">
              {matches.map(([key, name]) => (
                <ComboboxItem key={key} id={`${id}-${key}`} aria-selected={false}>
                  {name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          )}
        </Combobox>
      </DialogContent>
    </Dialog>
  );
}

/**
 * With no `open` and no `onOpenChange`, Escape still closes the list, and the
 * next Escape closes the dialog around it: the list never holds on to a key
 * it cannot act on.
 */
export const EscapeWithoutWiring: Story = {
  render: () => <UnwiredInDialog id="unwired-escape" />,
  play: async () => {
    const input = await screen.findByRole('combobox', { name: 'City' });
    const dialog = screen.getByRole('dialog');
    // Typed once the dialog has scaled in: the list takes the input's width,
    // and measuring an input mid-animation trips a ResizeObserver loop.
    await Promise.all(dialog.getAnimations().map((animation) => animation.finished));
    await userEvent.type(input, 'a');
    await screen.findByRole('listbox', { name: 'Cities' });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(dialog).toHaveAttribute('data-state', 'open');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

/** With nothing wired, a press outside the field and the list closes the list
 *  and leaves the dialog open. */
export const PressOutsideWithoutWiring: Story = {
  render: () => <UnwiredInDialog id="unwired-outside" />,
  play: async () => {
    const input = await screen.findByRole('combobox', { name: 'City' });
    const dialog = screen.getByRole('dialog');
    await Promise.all(dialog.getAnimations().map((animation) => animation.finished));
    await userEvent.type(input, 'a');
    await screen.findByRole('listbox', { name: 'Cities' });

    await userEvent.click(screen.getByText('Choose the city the parcel goes to.'));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(dialog).toHaveAttribute('data-state', 'open');

    // Closed, so the run's accessibility check sees no stale `aria-expanded`.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

/** A row under the pointer shows it, below the stronger highlight of the row
 *  the arrows are on. */
export const RowsAnswerThePointer: Story = {
  render: (args) => (
    <div className="h-80 w-full max-w-72">
      <Combobox {...args}>
        <ComboboxInput aria-expanded aria-controls="hover-list" aria-label="City" />
        <ComboboxList id="hover-list" aria-label="City">
          {cities.map(([id, name]) => (
            <ComboboxItem
              key={id}
              id={`hover-${id}`}
              isActive={id === 'jkt'}
              aria-selected={false}
            >
              {name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  ),
  play: async () => {
    const option = screen.getByRole('option', { name: 'Surabaya' });
    await expect(option.className).toContain('hover:bg-ghost-hover');
    await expect(screen.getByRole('option', { name: 'Jakarta' }).className).toContain(
      'bg-selected',
    );
  },
};
