import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { Label } from './Label';
import { Switch } from './Switch';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Label',
  component: Label,
  args: { htmlFor: 'display-name', children: 'Display name' },
  argTypes: {
    htmlFor: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A visible label tied to its control through `htmlFor`. Use `Field` when the control also needs a description or an error message.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label {...args} />
      <input
        id={args.htmlFor}
        className="h-11 rounded-md border border-field-line bg-field px-3 text-on-field"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Display name');
    const input = canvas.getByRole('textbox', { name: 'Display name' });

    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
};

/**
 * A label dims with the control directly before it, and only that one: an
 * unrelated disabled control earlier in the same row leaves it at full colour.
 * Inside a form Radix adds a hidden input after the control, which the rule
 * steps over.
 */
export const DimsOnlyWithItsOwnControl: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="dim-pinned" />
        <Label htmlFor="dim-pinned">Pinned</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="dim-archived" disabled />
        <Label htmlFor="dim-archived">Archived</Label>
        <Checkbox id="dim-starred" />
        <Label htmlFor="dim-starred">Starred</Label>
      </div>
      <form className="flex items-center gap-2" onSubmit={(event) => event.preventDefault()}>
        <Checkbox id="dim-locked" name="locked" disabled />
        <Label htmlFor="dim-locked">Locked</Label>
        <Switch id="dim-notify" name="notify" />
        <Label htmlFor="dim-notify">Notify me</Label>
      </form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const colour = (text: string) => getComputedStyle(canvas.getByText(text)).color;
    const full = colour('Pinned');

    await expect(colour('Archived')).not.toBe(full);
    await expect(colour('Starred')).toBe(full);

    await expect(canvasElement.querySelector('form input[aria-hidden]')).not.toBeNull();
    await expect(colour('Locked')).not.toBe(full);
    await expect(colour('Notify me')).toBe(full);
  },
};
