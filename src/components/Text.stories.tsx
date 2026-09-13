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
        We built the thing we kept failing to do by hand.
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const eyebrow = canvasElement.querySelector('[data-slot="eyebrow"]');

    await expect(eyebrow).toHaveClass('uppercase');
    await expect(eyebrow).toHaveClass('tracking-wider');
  },
};
