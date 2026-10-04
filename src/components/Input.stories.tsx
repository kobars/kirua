import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { Field } from './Field';
import { Input } from './Input';
import { Label } from './Label';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Input',
  component: Input,
  args: {
    id: 'username',
    name: 'username',
    type: 'text',
    placeholder: 'kurapika',
    disabled: false,
    'aria-invalid': false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A styled native input for a single value. Pair it with Field or Label. Choose a suitable type, name and autocomplete value; validation belongs to the application.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label htmlFor={args.id ?? 'username'}>Username</Label>
      <Input {...args} id={args.id ?? 'username'} />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field
        controlId="invalid-email"
        label="Email address"
        error="Enter a valid email address."
      >
        <Input {...args} type="email" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Email address' });

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(input, 'not-an-email');
    await expect(input).toHaveValue('not-an-email');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Unavailable' },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label htmlFor={args.id ?? 'username'}>Username</Label>
      <Input {...args} id={args.id ?? 'username'} readOnly />
    </div>
  ),
};

/**
 * Beside a button in a narrow row, the input shrinks instead of pushing the row
 * past its container: an input's own minimum is about twenty characters wide.
 */
export const ShrinksInARow: Story = {
  render: () => (
    <div className="flex w-48 gap-2" data-testid="row">
      <Input aria-label="Voucher code" />
      <Button variant="secondary" className="shrink-0">
        Apply
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByTestId('row');
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
    await expect(canvas.getByRole('textbox').getBoundingClientRect().right).toBeLessThanOrEqual(
      row.getBoundingClientRect().right,
    );
  },
};
