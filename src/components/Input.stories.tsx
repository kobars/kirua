import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field } from './Field';
import { Input } from './Input';
import { Label } from './Label';

const meta = {
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
          'A native input that consumes the field semantic family in every state. Its 44px default height matches Button’s medium size, and Field can supply all accessible relationships without Input becoming stateful.',
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
