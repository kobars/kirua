import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DirectionProvider } from './DirectionProvider';
import { Slider } from './Slider';

const meta = {
  tags: ['autodocs'],
  title: 'Components/DirectionProvider',
  component: DirectionProvider,
  args: { dir: 'rtl' },
  argTypes: {
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Tells Radix's keyboard behaviour which way the page reads. Radix never reads the document's `dir`, so a right-to-left page needs this once, around the app.",
      },
    },
  },
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * In a right-to-left page the slider fills from the right, so the arrow that
 * points towards its end — ArrowLeft — must raise the value.
 */
export const ArrowKeysFollowTheReadingDirection: Story = {
  render: (args) => (
    <div dir="rtl" className="grid w-72 gap-8">
      <DirectionProvider {...args}>
        <Slider defaultValue={[50]} max={100} aria-label="With the provider" />
      </DirectionProvider>
      <Slider defaultValue={[50]} max={100} aria-label="Without the provider" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const withProvider = canvas.getByRole('slider', { name: 'With the provider' });
    const without = canvas.getByRole('slider', { name: 'Without the provider' });

    await userEvent.click(withProvider);
    await userEvent.keyboard('{ArrowLeft}');
    await expect(withProvider).toHaveAttribute('aria-valuenow', '51');

    // The defect the provider exists for: the same page, the same key, and
    // Radix assumes left-to-right.
    await userEvent.click(without);
    await userEvent.keyboard('{ArrowLeft}');
    await expect(without).toHaveAttribute('aria-valuenow', '49');
  },
};
