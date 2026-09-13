/* oxlint-disable import/default, import/no-duplicates -- Vite ?raw imports load source text separately from the executable module. */
import { CityCombobox } from '../patterns/examples/CityCombobox';
import CityComboboxSource from '../patterns/examples/CityCombobox.tsx?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from './Combobox';

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
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Jakarta');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    await expect(canvas.getByText('No city matches. Try another name.')).toBeVisible();
    await expect(input).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Escape}');
    await expect(
      canvas.queryByText('No city matches. Try another name.'),
    ).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'ban');
    await userEvent.click(canvas.getByRole('option', { name: 'Bandung' }));
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
              aria-selected={id === 'bdg'}
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
    await expect(canvas.getByRole('option', { name: 'Bandung' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('option', { name: 'Surabaya' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await expect(canvas.getAllByRole('option')).toHaveLength(4);
  },
};
