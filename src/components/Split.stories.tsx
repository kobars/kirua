import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LG, MD, SM, atLeast } from '@/test/viewport';
import { QuantityStepper } from './QuantityStepper';
import { Button } from './Button';
import { Split } from './Split';
import { Text } from './Text';

const LAYOUTS = [
  'halves',
  'wide-narrow',
  'fit-start',
  'fit-end',
  'aside-start',
  'aside-end',
] as const;
const FROMS = ['base', 'sm', 'md', 'lg'] as const;
const GAPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Split',
  component: Split,
  args: { layout: 'halves', asideWidth: 'md', from: 'md', gap: 6, align: 'stretch' },
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    asideWidth: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    from: { control: 'inline-radio', options: FROMS },
    gap: { control: 'select', options: GAPS },
    align: { control: 'inline-radio', options: ['stretch', 'start', 'center'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Two regions that sit side by side from a breakpoint and stack below it. Give it exactly two children, in reading order.',
      },
    },
  },
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

const Region = ({ children, testId }: { children: string; testId?: string }) => (
  <Text size="sm" className="rounded-sm bg-sunken px-3 py-6" data-testid={testId}>
    {children}
  </Text>
);

const sideBySide = (split: HTMLElement) => {
  const [first, second] = Array.from(split.children) as HTMLElement[];
  return (
    Math.round(first!.getBoundingClientRect().top) ===
    Math.round(second!.getBoundingClientRect().top)
  );
};

export const Playground: Story = {
  render: (args) => (
    <Split {...args}>
      <Region>Main content</Region>
      <Region>Companion</Region>
    </Split>
  ),
};

export const Layouts: Story = {
  render: () => (
    <div className="grid gap-6">
      {LAYOUTS.map((layout) => (
        <Split key={layout} layout={layout} from="base" gap={3} data-testid={layout}>
          <Region>
            {layout === 'aside-start' ? 'Aside' : layout === 'fit-start' ? 'Fit' : 'Main'}
          </Region>
          <Region>
            {layout === 'aside-end' ? 'Aside' : layout === 'fit-end' ? 'Fit' : 'Second'}
          </Region>
        </Split>
      ))}
    </div>
  ),
  /** The shapes, measured at every width because `from="base"` never stacks. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const widths = (layout: string) =>
      Array.from(canvas.getByTestId(layout).children).map((child) =>
        Math.round(child.getBoundingClientRect().width),
      );

    const [halfA, halfB] = widths('halves');
    await expect(halfA).toBe(halfB);

    const [wide, narrow] = widths('wide-narrow');
    await expect(Math.abs(wide! / narrow! - 1.5)).toBeLessThan(0.1);

    // A track sized by its content: the short label, against the rest of the row.
    const [fitStart, rest] = widths('fit-start');
    await expect(fitStart!).toBeLessThan(rest!);
    const [restEnd, fitEnd] = widths('fit-end');
    await expect(fitEnd!).toBeLessThan(restEnd!);

    // 16rem is `asideWidth="md"`, the default.
    await expect(widths('aside-start')[0]).toBe(256);
    await expect(widths('aside-end')[1]).toBe(256);
  },
};

export const AsideWidths: Story = {
  render: () => (
    <div className="grid gap-6">
      {(['sm', 'md', 'lg'] as const).map((asideWidth) => (
        <Split
          key={asideWidth}
          layout="aside-start"
          asideWidth={asideWidth}
          from="base"
          gap={3}
          data-testid={asideWidth}
        >
          <Region>{asideWidth}</Region>
          <Region>Content</Region>
        </Split>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aside = (step: string) =>
      Math.round(canvas.getByTestId(step).children[0]!.getBoundingClientRect().width);

    await expect(aside('sm')).toBe(192);
    await expect(aside('md')).toBe(256);
    await expect(aside('lg')).toBe(320);
  },
};

export const StacksBelowItsBreakpoint: Story = {
  render: () => (
    <div className="grid gap-6">
      {FROMS.map((from) => (
        <Split key={from} from={from} gap={3} data-testid={from}>
          <Region>{`from="${from}"`}</Region>
          <Region>Second</Region>
        </Split>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(sideBySide(canvas.getByTestId('base'))).toBe(true);
    await expect(sideBySide(canvas.getByTestId('sm'))).toBe(atLeast(SM));
    await expect(sideBySide(canvas.getByTestId('md'))).toBe(atLeast(MD));
    await expect(sideBySide(canvas.getByTestId('lg'))).toBe(atLeast(LG));
  },
};

export const FitStartForAStepperAndAButton: Story = {
  render: () => (
    <Split layout="fit-start" from="base" gap={3} align="center" data-testid="row">
      <QuantityStepper label="Quantity" value={1} />
      <Button>Add to cart</Button>
    </Split>
  ),
  /** The stepper keeps its own width and the button takes the rest of the row. */
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('row');
    const [stepper, button] = Array.from(row.children) as HTMLElement[];
    const rowWidth = row.getBoundingClientRect().width;

    await expect(button!.getBoundingClientRect().width).toBeGreaterThan(
      stepper!.getBoundingClientRect().width,
    );
    await expect(
      Math.round(
        stepper!.getBoundingClientRect().width + button!.getBoundingClientRect().width + 12,
      ),
    ).toBe(Math.round(rowWidth));
  },
};

export const Gaps: Story = {
  render: () => (
    <div className="grid gap-4">
      {GAPS.map((gap) => (
        <Split key={gap} gap={gap} from="base" data-testid={`gap-${gap}`}>
          <Region>{`gap={${gap}}`}</Region>
          <Region>second</Region>
        </Split>
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
      {(['stretch', 'start', 'center'] as const).map((align) => (
        <Split key={align} align={align} from="base" gap={3}>
          <Region>{align}</Region>
          <Text size="sm" className="rounded-sm bg-sunken px-3 py-12">
            A taller neighbour
          </Text>
        </Split>
      ))}
    </div>
  ),
};

export const ATableInARegionScrollsInside: Story = {
  render: () => (
    <div className="w-80" data-testid="frame">
      <Split layout="halves" from="base" gap={2} data-testid="split">
        <Text size="sm" className="truncate">
          A very long line that would widen a region whose track was not minmax(0, 1fr)
        </Text>
        <Region>Neighbour</Region>
      </Split>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame');
    await expect(canvas.getByTestId('split').scrollWidth).toBeLessThanOrEqual(
      frame.clientWidth,
    );
  },
};
