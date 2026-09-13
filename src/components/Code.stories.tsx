import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Code } from './Code';
import { Text } from './Text';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Code',
  component: Code,
  args: { children: '--color-surface-brand' },
  parameters: {
    docs: {
      description: {
        component:
          'A short code fragment within a sentence. Use CodeBlock for multi-line examples.',
      },
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Text tone="primary">
      The panel reads <Code {...args} /> in every surface context.
    </Text>
  ),
};

export const ItSitsOnTheLineItIsIn: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <Text key={size} size={size} tone="primary" data-testid={`line-${size}`}>
          Body {size} with <Code {...args}>--radius-lg</Code> inside it.
        </Text>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ratio = (size: string) => {
      const line = canvas.getByTestId(`line-${size}`);
      const code = line.querySelector('[data-slot="code"]')!;
      return (
        parseFloat(getComputedStyle(code).fontSize) /
        parseFloat(getComputedStyle(line).fontSize)
      );
    };

    await expect(ratio('lg')).toBeCloseTo(0.9, 2);
    await expect(ratio('sm')).toBeCloseTo(0.9, 2);
  },
};

export const ALongNameWrapsRatherThanOverflows: Story = {
  render: (args) => (
    <div className="w-48" data-testid="column">
      <Text tone="primary">
        Points at <Code {...args}>--color-action-secondary-border-hover</Code> today.
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const column = canvas.getByTestId('column');

    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
  },
};

export const OnEverySurface: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {[
        ['page', 'bg-page'],
        ['raised', 'bg-raised'],
        ['inverse', 'ctx-inverse bg-page'],
        ['brand', 'ctx-brand bg-brand'],
      ].map(([name, surface]) => (
        <div key={name} className={`${surface} rounded-lg p-4`}>
          <Text tone="primary">
            {name}: the panel reads <Code {...args} />.
          </Text>
        </div>
      ))}
    </div>
  ),
};
