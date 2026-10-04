import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { IconButton } from './IconButton';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './InputGroup';
import { Kbd } from './Kbd';
import { Label } from './Label';
import { CloseIcon, SearchIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/InputGroup',
  component: InputGroup,
  parameters: {
    docs: {
      story: { height: '320px' },
      description: {
        component:
          'An input with adjoining icons, text or actions inside one boundary. Use InputGroupInput inside the group so it shares the border and focus treatment.',
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

    // The same ring `Input` draws, on the box: a border colour alone is too
    // faint to be the only sign of focus.
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
    await expect(getComputedStyle(input).outlineStyle).toBe('none');
  },
};

export const SizeAndWidth: Story = {
  render: () => (
    <div className="grid gap-4">
      <InputGroup size="sm" data-testid="small">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search the shop" placeholder="Search" />
      </InputGroup>
      {(['xs', 'sm', 'md', 'lg'] as const).map((width) => (
        <InputGroup key={width} width={width} data-testid={`width-${width}`}>
          <InputGroupInput aria-label={`Width ${width}`} placeholder={`width="${width}"`} />
        </InputGroup>
      ))}
    </div>
  ),
  /** `sm` is Button's small height; the widths cap the group from `sm` up. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(Math.round(canvas.getByTestId('small').getBoundingClientRect().height)).toBe(
      36,
    );
    await expect(Math.round(canvas.getByTestId('width-md').getBoundingClientRect().width)).toBe(
      288,
    );
  },
};

export const AnEdgeButtonSitsEvenly: Story = {
  render: () => (
    <div className="w-72">
      <InputGroup data-testid="group">
        <InputGroupInput aria-label="Reply" placeholder="Write a reply" />
        <InputGroupAddon>
          <IconButton aria-label="Clear" size="sm" variant="ghost">
            <CloseIcon />
          </IconButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  /** The trailing button is pulled out by half the padding: 6px from the edge, not 12. */
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByTestId('group');
    const button = within(group).getByRole('button', { name: 'Clear' });
    const gap = group.getBoundingClientRect().right - button.getBoundingClientRect().right;
    // One pixel of border, then 6px.
    await expect(Math.round(gap)).toBe(7);
  },
};
