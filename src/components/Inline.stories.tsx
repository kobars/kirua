import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import { Button } from './Button';
import { Heading } from './Heading';
import { Inline } from './Inline';
import { Text } from './Text';

const GAPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12] as const;
const ALIGNS = ['center', 'start', 'end', 'baseline', 'stretch'] as const;
const JUSTIFIES = ['start', 'center', 'end', 'between', 'around'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Inline',
  component: Inline,
  args: { gap: 2, align: 'center', justify: 'start', wrap: false },
  argTypes: {
    gap: { control: 'select', options: GAPS },
    align: { control: 'inline-radio', options: ALIGNS },
    justify: { control: 'inline-radio', options: JUSTIFIES },
    wrap: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Things side by side with one gap between them. Set wrap on any row that may meet a narrow screen; justify="between" replaces a spacer element.',
      },
    },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Inline {...args}>
      <Badge status="info">New</Badge>
      <Text inline size="sm">
        Three items in a row
      </Text>
      <Button size="sm">Act</Button>
    </Inline>
  ),
};

export const Gaps: Story = {
  render: () => (
    <div className="grid gap-4">
      {GAPS.map((gap) => (
        <Inline key={gap} gap={gap} data-testid={`gap-${gap}`}>
          <Badge>{`gap={${gap}}`}</Badge>
          <Badge>second</Badge>
        </Inline>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const gap of GAPS) {
      await expect(getComputedStyle(canvas.getByTestId(`gap-${gap}`)).columnGap).toBe(
        `${gap * 4}px`,
      );
    }
  },
};

export const Alignment: Story = {
  render: () => (
    <div className="grid gap-4">
      {ALIGNS.map((align) => (
        <Inline key={align} align={align} gap={3} className="h-16 bg-sunken">
          <Heading as="h2" size="heading-md">
            {align}
          </Heading>
          <Text inline size="sm">
            beside a heading
          </Text>
        </Inline>
      ))}
    </div>
  ),
};

export const Justification: Story = {
  render: () => (
    <div className="grid gap-4">
      {JUSTIFIES.map((justify) => (
        <Inline key={justify} justify={justify} className="bg-sunken" data-testid={justify}>
          <Badge>{justify}</Badge>
          <Badge>end</Badge>
        </Inline>
      ))}
    </div>
  ),
  /** `between` puts the two groups at the two ends: no spacer element needed. */
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('between');
    const [first, last] = Array.from(row.children) as HTMLElement[];
    const box = row.getBoundingClientRect();

    await expect(Math.round(first!.getBoundingClientRect().left)).toBe(Math.round(box.left));
    await expect(Math.round(last!.getBoundingClientRect().right)).toBe(Math.round(box.right));
  },
};

export const WrapsOnANarrowScreen: Story = {
  render: () => (
    <div className="grid w-64 gap-6">
      {[true, false].map((wrap) => (
        <div key={String(wrap)} className="overflow-hidden">
          <Inline wrap={wrap} gap={2} data-testid={wrap ? 'wraps' : 'nowrap'}>
            {['Pending', 'Paid', 'Shipped', 'Delivered', 'Returned'].map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
          </Inline>
        </div>
      ))}
    </div>
  ),
  /**
   * A row that wraps runs onto a second line and stays inside its box; a row
   * that cannot wrap keeps one line and pushes past it — the overflow a 320px
   * phone finds.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tops = (row: HTMLElement) =>
      new Set(
        Array.from(row.children).map((child) => Math.round(child.getBoundingClientRect().top)),
      );
    const wraps = canvas.getByTestId('wraps');
    const nowrap = canvas.getByTestId('nowrap');

    await expect(tops(wraps).size).toBeGreaterThan(1);
    await expect(wraps.scrollWidth).toBeLessThanOrEqual(wraps.clientWidth);
    await expect(tops(nowrap).size).toBe(1);
    await expect(nowrap.scrollWidth).toBeGreaterThan(nowrap.clientWidth);
  },
};
