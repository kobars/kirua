import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Field } from './Field';
import { Input } from './Input';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Field',
  component: Field,
  args: {
    controlId: 'email',
    label: 'Email address',
    description: 'We will only use this for receipts.',
    required: false,
    children: <Input type="email" name="email" autoComplete="email" />,
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    children: { control: false },
  },
  parameters: {
    docs: {
      story: { height: '300px' },
      description: {
        component:
          'Connect one form control to a visible label, description and error. Supply a unique controlId. The application validates input and passes error; Field then exposes the invalid state and supporting text.',
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: {
    controlId: 'invalid-email',
    required: true,
    error: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('textbox', { name: 'Email address' });
    const description = canvas.getByText('We will only use this for receipts.');
    const error = canvas.getByText('Enter a valid email address.');

    await expect(control).toBeRequired();
    await expect(control).toHaveAttribute('aria-invalid', 'true');
    await expect(control).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`);
    await expect(description.id).toBe('invalid-email-description');
    await expect(error.id).toBe('invalid-email-error');
  },
};
