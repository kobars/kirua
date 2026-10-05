import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Slider } from './Slider';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'Choose one value or a range by moving thumbs. Pass one array entry per thumb and provide accessible names and units.',
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

    // The row is as tall as the circle, so the circle stays inside it.
    const root = canvasElement.querySelector('[data-slot="slider"]')!.getBoundingClientRect();
    const circle = thumb.getBoundingClientRect();
    await expect(circle.top).toBeGreaterThanOrEqual(root.top);
    await expect(circle.bottom).toBeLessThanOrEqual(root.bottom);
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-48 gap-12 px-4">
      <Slider
        {...args}
        orientation="vertical"
        defaultValue={[40]}
        step={5}
        aria-label="Volume"
      />
      <Slider
        {...args}
        orientation="vertical"
        defaultValue={[25, 75]}
        thumbLabels={['Minimum', 'Maximum']}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-orientation', 'vertical');
    thumb.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '45');
    const track = canvasElement.querySelector('[data-slot="slider-track"]')!;
    await expect(track.getBoundingClientRect().height).toBeGreaterThan(100);
    await expect(track.getBoundingClientRect().width).toBeLessThan(10);
  },
};

const rupiah = (value: number) => `Rp ${value.toLocaleString('en-GB')}`;

/**
 * The screen shows a formatted price, so the thumb announces the same text
 * rather than a bare number with no unit.
 */
export const AnnouncesWhatTheScreenShows: Story = {
  render: function Render() {
    const [price, setPrice] = useState([200000, 600000]);
    return (
      <div className="w-80">
        <Slider
          value={price}
          onValueChange={setPrice}
          max={800000}
          step={10000}
          thumbLabels={['Lowest price', 'Highest price']}
          getValueText={rupiah}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const low = within(canvasElement).getByRole('slider', { name: 'Lowest price' });
    await expect(low).toHaveAttribute('aria-valuetext', 'Rp 200,000');

    low.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(low).toHaveAttribute('aria-valuetext', 'Rp 210,000');
  },
};
