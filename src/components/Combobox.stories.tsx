import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from './Combobox';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          'kirua supplies the parts and the ARIA; the consumer supplies the filtering, because a query and a highlight are application state. The one rule that matters is aria-activedescendant on the INPUT — focus never leaves it, so without that a screen reader announces nothing as the arrows move.',
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
  render: (args) => (
    <div className="h-80 w-72">
      <Combobox {...args}>
        <ComboboxInput
          aria-expanded
          aria-controls="city-list"
          aria-activedescendant="city-jkt"
          aria-label="City"
          defaultValue="Ja"
        />
        <ComboboxList id="city-list" aria-label="City">
          {cities.map(([id, name]) => (
            <ComboboxItem
              key={id}
              id={`city-${id}`}
              isActive={id === 'jkt'}
              aria-selected={id === 'jkt'}
            >
              {name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  ),
};

export const NoMatches: Story = {
  render: (args) => (
    <div className="h-52 w-72">
      <Combobox {...args}>
        <ComboboxInput aria-expanded={false} aria-label="City" defaultValue="Zzz" />
        {/* INSTEAD OF the list, not inside it: a role="listbox" must contain
            options, and axe fails an empty one as aria-required-children. */}
        <ComboboxEmpty>No city matches.</ComboboxEmpty>
      </Combobox>
    </div>
  ),
};

/** The whole ARIA contract, asserted in one place. */
export const TheAriaWiring: Story = {
  render: (args) => (
    <div className="h-80 w-72">
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
