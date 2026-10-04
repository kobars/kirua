import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LG, MD, SM, atLeast } from '@/test/viewport';
import { Card, CardBody, CardTitle } from './Card';
import { Grid } from './Grid';
import { Text } from './Text';

const COUNTS = [1, 2, 3, 4] as const;
const GAPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Grid',
  component: Grid,
  args: { columns: 1, sm: 2, lg: 3, gap: 4, align: 'stretch' },
  argTypes: {
    columns: { control: 'inline-radio', options: COUNTS },
    sm: { control: 'inline-radio', options: COUNTS },
    md: { control: 'inline-radio', options: COUNTS },
    lg: { control: 'inline-radio', options: COUNTS },
    gap: { control: 'select', options: GAPS },
    align: { control: 'inline-radio', options: ['stretch', 'start'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Equal columns whose count changes at a breakpoint, mobile first. Every column may shrink below its content.',
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const Cell = ({ children }: { children: string }) => (
  <Text size="sm" className="rounded-sm bg-sunken px-3 py-6 text-center">
    {children}
  </Text>
);

/** How many distinct column positions the children occupy. */
const columnCount = (grid: HTMLElement) =>
  new Set(
    Array.from(grid.children).map((child) => Math.round(child.getBoundingClientRect().left)),
  ).size;

export const Playground: Story = {
  render: (args) => (
    <Grid {...args}>
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((label) => (
        <Cell key={label}>{label}</Cell>
      ))}
    </Grid>
  ),
};

export const ColumnsCollapseAtBreakpoints: Story = {
  render: () => (
    <Grid as="ul" columns={1} sm={2} md={3} lg={4} gap={3} data-testid="grid">
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].map((label) => (
        <li key={label}>
          <Cell>{label}</Cell>
        </li>
      ))}
    </Grid>
  ),
  /**
   * Asked the way the CSS asks it: the viewport width against the declared
   * breakpoints, so the same story is correct at each of the suite's widths.
   */
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByTestId('grid');
    const expected = atLeast(LG) ? 4 : atLeast(MD) ? 3 : atLeast(SM) ? 2 : 1;

    await expect(grid.tagName).toBe('UL');
    await expect(columnCount(grid)).toBe(expected);
  },
};

export const EveryCount: Story = {
  render: () => (
    <div className="grid gap-6">
      {COUNTS.map((count) => (
        <Grid key={`base-${count}`} columns={count} gap={2}>
          {COUNTS.map((n) => (
            <Cell key={n}>{`columns={${count}}`}</Cell>
          ))}
        </Grid>
      ))}
      {COUNTS.map((count) => (
        <Grid key={`sm-${count}`} sm={count} gap={2}>
          {COUNTS.map((n) => (
            <Cell key={n}>{`sm={${count}}`}</Cell>
          ))}
        </Grid>
      ))}
      {COUNTS.map((count) => (
        <Grid key={`md-${count}`} md={count} gap={2}>
          {COUNTS.map((n) => (
            <Cell key={n}>{`md={${count}}`}</Cell>
          ))}
        </Grid>
      ))}
      {COUNTS.map((count) => (
        <Grid key={`lg-${count}`} lg={count} gap={2}>
          {COUNTS.map((n) => (
            <Cell key={n}>{`lg={${count}}`}</Cell>
          ))}
        </Grid>
      ))}
    </div>
  ),
};

export const Gaps: Story = {
  render: () => (
    <div className="grid gap-6">
      {GAPS.map((gap) => (
        <Grid key={gap} columns={2} gap={gap} data-testid={`gap-${gap}`}>
          <Cell>{`gap={${gap}}`}</Cell>
          <Cell>second</Cell>
        </Grid>
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

export const CardsKeepTheirHeight: Story = {
  render: () => (
    <div className="grid gap-6">
      {(['stretch', 'start'] as const).map((align) => (
        <Grid key={align} columns={2} align={align} data-testid={align}>
          <Card>
            <CardTitle as="h2" size="heading-sm">
              Short
            </CardTitle>
          </Card>
          <Card>
            <CardTitle as="h2" size="heading-sm">
              Tall
            </CardTitle>
            <CardBody>
              A card with more to say than its neighbour, which is the case align exists for.
            </CardBody>
          </Card>
        </Grid>
      ))}
    </div>
  ),
  /** `stretch` evens a row out; `start` lets each card keep its own height. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heights = (align: string) =>
      Array.from(canvas.getByTestId(align).children).map((card) =>
        Math.round(card.getBoundingClientRect().height),
      );
    const [shortStretched, tallStretched] = heights('stretch');
    const [shortStart, tallStart] = heights('start');

    await expect(shortStretched).toBe(tallStretched);
    await expect(shortStart).toBeLessThan(tallStart!);
  },
};

export const AWideChildDoesNotWidenItsColumn: Story = {
  render: () => (
    <div className="w-80" data-testid="frame">
      <Grid columns={2} gap={2} data-testid="grid">
        <Text size="sm" className="truncate">
          A single very long unbroken line of text that would push a 1fr column wide
        </Text>
        <Cell>Neighbour</Cell>
      </Grid>
    </div>
  ),
  /** Both columns stay equal: `grid-cols-2` is `minmax(0, 1fr)`, not `1fr`. */
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByTestId('grid');
    const [wide, narrow] = Array.from(grid.children) as HTMLElement[];

    await expect(Math.round(wide!.getBoundingClientRect().width)).toBe(
      Math.round(narrow!.getBoundingClientRect().width),
    );
  },
};
