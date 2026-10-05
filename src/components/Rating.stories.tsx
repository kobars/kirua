import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Rating',
  component: Rating,
  args: { value: 4.6, children: '(128)' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } } },
  parameters: {
    docs: {
      description: {
        component:
          'An average rating: a decorative star, the value to one decimal, and a quieter trailing count. The scale is spoken, never drawn.',
      },
    },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  /** "4.6" alone has no scale; read aloud it is "4.6 out of 5". */
  play: async ({ canvasElement }) => {
    const rating = canvasElement.querySelector('[data-slot="rating"]')!;
    await expect(rating).toHaveTextContent('4.6 out of 5(128)');
    await expect(rating.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(within(canvasElement).getByText('(128)')).toBeVisible();
  },
};

export const OnAProductPage: Story = {
  args: { value: 4.2, children: '· 86 reviews' },
};

/**
 * The caller formats the value, as it does for `Price`: a page whose decimal
 * is a comma passes its own `Intl.NumberFormat` output here.
 */
export const FormattedByTheCaller: Story = {
  args: {
    value: 4.567,
    display: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(4.567),
    children: '(128)',
  },
  play: async ({ canvasElement }) => {
    const rating = canvasElement.querySelector('[data-slot="rating"]')!;
    await expect(rating).toHaveTextContent('4.57 out of 5(128)');
  },
};

export const NoReviewsYet: Story = {
  args: { value: Number.NaN, children: '(0)' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="rating"]')).not.toHaveTextContent(
      'NaN',
    );
  },
};
