/* oxlint-disable import/default, import/no-duplicates -- Vite ?raw imports load source text separately from the executable module. */
import { CheckoutDetailsExample } from './examples/CheckoutDetailsExample';
import CheckoutDetailsExampleSource from './examples/CheckoutDetailsExample.tsx?raw';
import { CreatorClubExample } from './examples/CreatorClubExample';
import CreatorClubExampleSource from './examples/CreatorClubExample.tsx?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

const meta = {
  title: 'Patterns/Everyday screens',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Two compositions of the same base style: an expressive creator card and a quieter checkout form. These examples use local state only. Switch Mode and Surface on an individual story to compare their appearance.',
      },
      story: { height: '650px' },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatorClub: Story = {
  name: 'Creator club',
  parameters: {
    docs: {
      source: {
        code: CreatorClubExampleSource.replace("from '@/components'", "from '@kobars/kirua'"),
        language: 'tsx',
      },
      description: {
        story:
          'Use a display headline and a few corner accents for a promotional moment. The join action updates local state and announces confirmation.',
      },
    },
  },
  render: () => <CreatorClubExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Join the club' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('You joined the club. Welcome!');
    await userEvent.click(canvas.getByRole('button', { name: 'Leave club' }));
    await expect(canvas.getByRole('button', { name: 'Join the club' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};

export const CheckoutDetails: Story = {
  name: 'Checkout with validation',
  parameters: {
    docs: {
      source: {
        code: CheckoutDetailsExampleSource.replace(
          "from '@/components'",
          "from '@kobars/kirua'",
        ),
        language: 'tsx',
      },
      description: {
        story:
          'Keep transactional details on a neutral card with a text heading. Submit an empty form to see field errors, then enter a name and email to reach a local confirmation. No payment or network request occurs.',
      },
    },
  },
  render: () => <CheckoutDetailsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save contact details' }));
    const name = canvas.getByRole('textbox', { name: 'Full name' });
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    await expect(name).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(name, 'Mika Tan');
    await userEvent.type(email, 'mika@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Save contact details' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Contact details saved');
    await expect(email).not.toHaveAttribute('aria-invalid');
  },
};
