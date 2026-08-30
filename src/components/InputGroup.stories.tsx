import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { IconButton } from './IconButton';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './InputGroup';
import { Kbd } from './Kbd';
import { Label } from './Label';
import { CloseIcon, SearchIcon } from './icons';

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
  parameters: {
    docs: {
      description: {
        component:
          'One box, one focus ring. The border and the state belong to the group, so `InputGroupInput` draws nothing — putting a plain `Input` in here gives you two borders, which is the look this component exists to remove.',
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search orders" aria-label="Search orders" />
        <InputGroupAddon>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithAUnit: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="weight">Weight</Label>
      <InputGroup>
        <InputGroupInput id="weight" inputMode="decimal" defaultValue="68" />
        <InputGroupAddon>
          <InputGroupText>kg</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithAClearButton: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput defaultValue="paracetamol" aria-label="Search medicines" />
        <InputGroupAddon>
          <IconButton aria-label="Clear search" size="sm" variant="ghost" className="-me-1.5">
            <CloseIcon />
          </IconButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enabled" aria-label="Enabled" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-invalid="true" defaultValue="not-an-email" aria-label="Invalid" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput disabled defaultValue="Locked" aria-label="Disabled" />
      </InputGroup>
    </div>
  ),
};

/**
 * The group reads its own descendants, so nothing is told twice. Focusing the
 * input has to change the *group's* border colour — that is the whole claim of
 * the component, and a `has-` selector that silently fails to compile would
 * still render a box that looks correct until it is focused.
 */
export const TheGroupTakesTheFocusRing: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector('[data-slot="input-group"]') as HTMLElement;
    const input = canvas.getByRole('textbox');

    const resting = getComputedStyle(group).borderTopColor;
    await userEvent.tab();
    await expect(input).toHaveFocus();

    // The border transitions, so the computed value is still the old colour on
    // the tick the focus lands. Reading it once is a test that passes or fails
    // on timing.
    await waitFor(async () => {
      await expect(getComputedStyle(group).borderTopColor).not.toBe(resting);
    });
    await expect(getComputedStyle(input).borderTopWidth).toBe('0px');
  },
};
