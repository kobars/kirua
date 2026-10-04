import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Price } from './Price';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Price',
  component: Price,
  args: { amount: 'Rp 120.000', was: 'Rp 150.000', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A price and the price it replaced. Formatting is the caller’s; both figures are tabular, and the struck one is announced as the previous price.',
      },
    },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  /** A strike-through is not announced, so the old price is read with its label. */
  play: async ({ canvasElement }) => {
    const price = within(canvasElement).getByText('Rp 120.000').closest('[data-slot="price"]')!;
    const struck = price.querySelector('s')!;

    await expect(price).toHaveTextContent('Rp 120.000Was Rp 150.000');
    await expect(getComputedStyle(struck).textDecorationLine).toBe('line-through');
    await expect(getComputedStyle(struck).fontVariantNumeric).toBe('tabular-nums');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <Price amount="Rp 120.000" was="Rp 150.000" />
      <Price size="lg" amount="Rp 1.200.000" was="Rp 1.500.000" />
      <Price amount="Rp 89.000" />
    </div>
  ),
};
