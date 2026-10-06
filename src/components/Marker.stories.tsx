import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CalendarIcon, UserIcon } from './icons';
import { Marker, MarkerContent, MarkerIcon } from './Marker';
import { Stack } from './Stack';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Marker',
  component: Marker,
  args: { variant: 'divider' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'divider', 'border'] },
    as: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A quiet line inside a conversation or a feed — a day break, someone joining. It is text, not `role="separator"`: a separator’s children are presentational, so its words would be lost. Render it as a heading where a reader should be able to jump between days.',
      },
    },
  },
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <Marker {...args}>
        <MarkerContent>Today</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack gap={6} className="w-96">
      <Marker variant="plain" data-testid="plain">
        <MarkerIcon>
          <UserIcon />
        </MarkerIcon>
        <MarkerContent>Rin joined the conversation</MarkerContent>
      </Marker>
      <Marker variant="divider" data-testid="divider">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="border" data-testid="border">
        <MarkerIcon>
          <CalendarIcon />
        </MarkerIcon>
        <MarkerContent>Earlier messages</MarkerContent>
      </Marker>
    </Stack>
  ),
  /**
   * The words are what a screen reader hears, so nothing here may claim to be
   * a separator, and the icon must stay out of the reading. A `divider`
   * draws a rule on each side and keeps its text in the middle.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('separator')).toBeNull();
    await expect(canvas.getByText('Today')).toBeVisible();
    for (const icon of canvasElement.querySelectorAll('[data-slot="marker-icon"]')) {
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    }

    const divider = canvas.getByTestId('divider');
    const rule = (side: '::before' | '::after') => getComputedStyle(divider, side);
    await expect(rule('::before').borderTopWidth).toBe('1px');
    await expect(rule('::after').borderTopWidth).toBe('1px');
    const outer = divider.getBoundingClientRect();
    const text = canvas.getByText('Today').getBoundingClientRect();
    const offCentre = Math.abs((text.left + text.right) / 2 - (outer.left + outer.right) / 2);
    await expect(offCentre).toBeLessThan(1);
    // Each rule takes real room, not a zero-width stub.
    await expect(text.left - outer.left).toBeGreaterThan(outer.width / 4);
  },
};

export const LongTextAtANarrowWidth: Story = {
  render: () => (
    <div className="w-48" data-testid="frame">
      <Marker variant="divider">
        <MarkerContent>Messages before you joined are not shown</MarkerContent>
      </Marker>
    </div>
  ),
  /** The text wraps inside the frame, and a stub of rule survives on each side. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame').getBoundingClientRect();
    const text = canvas.getByText(/before you joined/).getBoundingClientRect();
    await expect(text.left - frame.left).toBeGreaterThanOrEqual(16);
    await expect(frame.right - text.right).toBeGreaterThanOrEqual(16);
    await expect(text.height).toBeGreaterThan(20);
  },
};

export const AsAHeading: Story = {
  render: () => (
    <div className="w-96">
      <Marker as="h2" variant="divider">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
    </div>
  ),
  /** A day a reader can jump to, by the heading's own name. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Yesterday' })).toBeVisible();
  },
};
