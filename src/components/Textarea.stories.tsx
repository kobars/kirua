import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field } from './Field';
import { Label } from './Label';
import { Textarea } from './Textarea';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    id: 'biography',
    name: 'biography',
    placeholder: 'Tell us what you make.',
    rows: 4,
    disabled: false,
    'aria-invalid': false,
  },
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 12 } },
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native multi-line text field with vertical resizing. Pair it with Field or Label and provide a suitable name and initial rows.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label htmlFor={args.id ?? 'biography'}>Biography</Label>
      <Textarea {...args} id={args.id ?? 'biography'} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', { name: 'Biography' });

    await expect(getComputedStyle(textarea).resize).toBe('vertical');
    await userEvent.type(textarea, 'I draw character studies.');
    await expect(textarea).toHaveValue('I draw character studies.');
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field controlId="invalid-biography" label="Biography" error="Write at least 20 words.">
        <Textarea {...args} />
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: 'This biography is locked.' },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label htmlFor={args.id ?? 'biography'}>Biography</Label>
      <Textarea {...args} id={args.id ?? 'biography'} readOnly />
    </div>
  ),
};

export const BareAndGrowing: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      <Textarea
        variant="bare"
        aria-label="What is on your mind"
        placeholder="What is on your mind?"
        data-testid="bare"
      />
      <Textarea grow aria-label="Message" placeholder="Ask anything" data-testid="grow" />
    </div>
  ),
  /** `bare` keeps a focus outline; `grow` starts at one line and grows with the text. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bare = canvas.getByTestId('bare');
    const grow = canvas.getByTestId('grow');

    await expect(getComputedStyle(bare).borderTopWidth).toBe('0px');
    // A text field matches `:focus-visible` however it was focused.
    await userEvent.click(bare);
    await expect(getComputedStyle(bare).outlineStyle).toBe('solid');

    const before = grow.getBoundingClientRect().height;
    await userEvent.type(grow, 'One{Enter}Two{Enter}Three{Enter}Four');
    await expect(grow.getBoundingClientRect().height).toBeGreaterThan(before);
  },
};
