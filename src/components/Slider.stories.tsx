import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'One thumb per value: `[20]` is a single value, `[20, 80]` is a range. The number of thumbs is the length of the array rather than a separate prop, so both cases are one component.',
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Slider {...args} defaultValue={[40]} max={100} aria-label="Volume" />
    </div>
  ),
};

export const SingleAndRange: Story = {
  render: (args) => (
    <div className="grid w-80 gap-8">
      <div className="grid gap-3">
        <span className="text-body-sm text-fg-secondary">One value</span>
        <Slider {...args} defaultValue={[40]} max={100} aria-label="Volume" />
      </div>
      <div className="grid gap-3">
        <span className="text-body-sm text-fg-secondary">A price range</span>
        <Slider
          {...args}
          defaultValue={[40, 160]}
          max={200}
          step={5}
          thumbLabels={['Minimum price', 'Maximum price']}
        />
      </div>
      <div className="grid gap-3">
        <span className="text-body-sm text-fg-secondary">Disabled</span>
        <Slider {...args} defaultValue={[60]} max={100} disabled aria-label="Unavailable" />
      </div>
    </div>
  ),
};

/**
 * A range renders two thumbs, driven by the array rather than a prop, and each
 * is operable by keyboard. They are found by their own names: `role="slider"`
 * is on the thumb, so a name on the root would name nothing.
 */
export const TwoThumbsAndBothTakeTheKeyboard: Story = {
  render: (args) => (
    <div className="w-80">
      <Slider
        {...args}
        defaultValue={[40, 160]}
        max={200}
        step={5}
        thumbLabels={['Minimum price', 'Maximum price']}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const thumbs = within(canvasElement).getAllByRole('slider');
    await expect(thumbs).toHaveLength(2);

    thumbs[0]!.focus();
    await expect(thumbs[0]).toHaveAttribute('aria-valuenow', '40');

    await userEvent.keyboard('{ArrowRight}');
    await expect(thumbs[0]).toHaveAttribute('aria-valuenow', '45');

    await userEvent.keyboard('{Home}');
    await expect(thumbs[0]).toHaveAttribute('aria-valuenow', '0');
  },
};

/**
 * The thumb is drawn at 20px and has to be grabbable at 44. Measured from the
 * pseudo-element's box rather than asserted as a class name.
 */
export const TheTouchTargetIsBiggerThanTheCircle: Story = {
  render: (args) => (
    <div className="w-80">
      <Slider {...args} defaultValue={[50]} max={100} aria-label="Volume" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider');
    const drawn = thumb.getBoundingClientRect().width;
    const inset = getComputedStyle(thumb, '::before').insetInlineStart;

    // -12px each side on a 20px circle is a 44px target.
    await expect(drawn).toBe(20);
    await expect(inset).toBe('-12px');
  },
};
