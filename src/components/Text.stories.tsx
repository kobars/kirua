import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Eyebrow, Text } from './Text';

const SIZES = ['lg', 'md', 'sm', 'caption'] as const;
const TONES = ['primary', 'secondary', 'muted'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Text',
  component: Text,
  args: {
    size: 'md',
    tone: 'secondary',
    children:
      'Aozora gives you one place to design a gallery, show it at the size you drew it, and sell prints from the same page.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    tone: { control: 'inline-radio', options: TONES },
    inline: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Body copy with size and tone choices. Use a readable foreground for instructions and important details; reserve muted text for supplemental content.',
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid max-w-176 gap-3">
      {SIZES.map((size) => (
        <Text {...args} key={size} size={size}>
          {size} — {args.children}
        </Text>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="grid max-w-176 gap-3">
      {TONES.map((tone) => (
        <Text {...args} key={tone} tone={tone}>
          {tone} — {args.children}
        </Text>
      ))}
    </div>
  ),
};

export const InsideASentence: Story = {
  render: (args) => (
    <Text {...args} size="md" tone="primary" data-testid="line">
      Showing{' '}
      <Text {...args} inline size="md" tone="muted">
        12 of 48
      </Text>{' '}
      pieces.
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const line = canvas.getByTestId('line');

    await expect(line.tagName).toBe('P');
    await expect(line.querySelector('span[data-slot="text"]')).toBeInTheDocument();
    await expect(line).toHaveTextContent('Showing 12 of 48 pieces.');
  },
};

export const AnEyebrowAboveAHeading: Story = {
  render: () => (
    <div className="grid gap-2">
      <Eyebrow>Our story</Eyebrow>
      <Text size="lg" tone="primary">
        We built Aozora because a spreadsheet kept losing our commissions.
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const eyebrow = canvasElement.querySelector('[data-slot="eyebrow"]');

    await expect(eyebrow).toHaveClass('uppercase');
    await expect(eyebrow).toHaveClass('tracking-wider');
  },
};

export const WeightFiguresAndDanger: Story = {
  render: () => (
    <div className="grid gap-2">
      {(['normal', 'medium', 'semibold'] as const).map((weight) => (
        <Text key={weight} weight={weight} tone="primary" data-testid={`weight-${weight}`}>
          weight=&quot;{weight}&quot;
        </Text>
      ))}
      <Text numeric tone="primary" data-testid="numeric">
        1,204.50
      </Text>
      <Text size="sm" tone="danger" numeric>
        281 / 280 characters
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const weight = (name: string) =>
      Number(getComputedStyle(canvas.getByTestId(`weight-${name}`)).fontWeight);

    // The weights are the type scale's, so the order is asserted, not the numbers.
    await expect(weight('medium')).toBeGreaterThan(weight('normal'));
    await expect(weight('semibold')).toBeGreaterThan(weight('medium'));
    await expect(getComputedStyle(canvas.getByTestId('numeric')).fontVariantNumeric).toBe(
      'tabular-nums',
    );
  },
};

export const TruncateAndWrap: Story = {
  render: () => (
    <div className="grid w-64 gap-3">
      <Text truncate data-testid="truncate">
        A title much too long for the narrow column it has been given
      </Text>
      <Text wrap="anywhere" data-testid="anywhere">
        https://example.com/a/very/long/unbroken/address/that/would/widen/the/page
      </Text>
      <Text wrap="pretty">
        A paragraph that avoids leaving one short word alone on its last line.
      </Text>
      <Text wrap="balance" size="lg" tone="primary">
        Two lines of a lead, balanced.
      </Text>
    </div>
  ),
  /** Neither a long title nor an unbroken address may widen the column. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const truncated = canvas.getByTestId('truncate');
    const anywhere = canvas.getByTestId('anywhere');

    await expect(truncated.scrollWidth).toBeGreaterThan(truncated.clientWidth);
    await expect(getComputedStyle(truncated).textOverflow).toBe('ellipsis');
    await expect(anywhere.scrollWidth).toBeLessThanOrEqual(anywhere.clientWidth);
  },
};

export const AlignmentAndMeasure: Story = {
  render: () => (
    <div className="grid gap-3">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Text key={align} align={align}>
          align=&quot;{align}&quot;
        </Text>
      ))}
      <Text measure="prose" data-testid="prose">
        A paragraph capped at a readable line length, about sixty-five characters, however wide
        the page around it grows. Long lines are hard to track from one to the next.
      </Text>
      <Text measure="wide" size="lg" data-testid="wide">
        A lead paragraph spans a wider measure than body copy, and still stops well short of a
        wide screen’s edge.
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const measure = (id: string) =>
      parseFloat(getComputedStyle(canvas.getByTestId(id)).maxWidth);
    await expect(measure('prose')).toBeGreaterThan(0);
    await expect(measure('wide')).toBe(704);
  },
};

/**
 * `inherit` emits no size and no colour, so a figure inside a pressed toggle or
 * a highlighted option takes the control's own, state by state.
 */
export const InheritsFromItsControl: Story = {
  render: () => (
    <p className="text-heading-sm text-fg-accent" data-testid="host">
      Liked by{' '}
      <Text inline size="inherit" tone="inherit" numeric data-testid="count">
        1,204
      </Text>
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = getComputedStyle(canvas.getByTestId('host'));
    const count = getComputedStyle(canvas.getByTestId('count'));
    await expect(count.color).toBe(host.color);
    await expect(count.fontSize).toBe(host.fontSize);
    await expect(count.fontVariantNumeric).toBe('tabular-nums');
  },
};
