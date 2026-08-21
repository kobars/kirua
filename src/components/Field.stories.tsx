import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Field } from './Field';

const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    controlId: 'email',
    label: 'Email address',
    description: 'We will only use this for receipts.',
    required: false,
    children: (
      <input
        type="email"
        className="h-11 rounded-md border border-field-line bg-field px-3 text-on-field"
      />
    ),
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
      description: {
        component:
          'Field owns the strings that are easiest to mistype when repeated by hand. It assigns one explicit control ID to the label, joins description and error IDs onto aria-describedby, and derives aria-invalid from the visible error. The ID stays explicit so this wrapper remains a Server Component.',
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: {
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
    await expect(description.id).toBe('email-description');
    await expect(error.id).toBe('email-error');
  },
};
