import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { GridIcon, MenuIcon } from './icons';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

/**
 * `args` is declared and never spread. Radix types `ToggleGroup` as a
 * discriminated union on `type`, and spreading a union of prop objects cannot
 * type-check under `exactOptionalPropertyTypes` — so each story writes its
 * props at the call site, where the union is narrowed.
 */
const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  args: { type: 'single' },
  parameters: {
    docs: {
      description: {
        component:
          'A single tab stop with arrow-key movement inside it. `type="single"` is a view switcher — exactly one is true. `type="multiple"` is a filter — any number are.',
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
      <ToggleGroupItem value="grid" variant="outline" aria-label="Grid">
        <GridIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" variant="outline" aria-label="List">
        <MenuIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SingleAndMultiple: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <span className="text-body-sm text-fg-secondary">Single — a view switcher</span>
        <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
          <ToggleGroupItem value="grid" variant="outline" aria-label="Grid">
            <GridIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" variant="outline" aria-label="List">
            <MenuIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid gap-2">
        <span className="text-body-sm text-fg-secondary">Multiple — a filter</span>
        <ToggleGroup type="multiple" defaultValue={['new']} aria-label="Condition">
          <ToggleGroupItem value="new" size="sm">
            New
          </ToggleGroupItem>
          <ToggleGroupItem value="used" size="sm">
            Used
          </ToggleGroupItem>
          <ToggleGroupItem value="refurbished" size="sm">
            Refurbished
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

/**
 * One tab stop, with the arrows moving inside it. Asserted by pressing Tab, not
 * by reading `tabindex`: the container is the stop, so every item reads `-1`
 * at rest.
 */
export const ArrowKeysMoveInsideOneTabStop: Story = {
  render: () => (
    <div className="grid gap-4">
      <button type="button" data-testid="before" className="justify-self-start text-fg">
        Before the group
      </button>
      <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
        <ToggleGroupItem value="grid" variant="outline" aria-label="Grid">
          <GridIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" variant="outline" aria-label="List">
          <MenuIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <button type="button" data-testid="after" className="justify-self-start text-fg">
        After the group
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = canvas.getAllByRole('radio');
    const [grid, list] = items;

    canvas.getByTestId('before').focus();

    // One Tab in, one Tab out: a single stop, not two.
    await userEvent.tab();
    await expect(items).toContain(document.activeElement);
    await userEvent.tab();
    await expect(canvas.getByTestId('after')).toHaveFocus();

    grid!.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(list).toHaveFocus();
  },
};
