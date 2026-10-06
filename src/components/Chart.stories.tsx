import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BarChart, Chart, ChartCaption, ChartLegend, LineChart, Sparkline } from './Chart';
import { Stat, StatRow } from './Stat';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Chart',
  component: Chart,
  args: { label: 'Clinic visits per month, first half of 2026' },
  argTypes: { label: { control: 'text' } },
  parameters: {
    docs: {
      story: { height: '440px' },
      description: {
        component:
          'Small SVG and CSS charts for summaries and comparisons. Provide accessible labels and context for the values. The application owns formatting and data; advanced pan/zoom and large datasets need a separate charting solution.',
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

const VISITS = [
  { label: 'Jan', value: 182 },
  { label: 'Feb', value: 214 },
  { label: 'Mar', value: 268 },
  { label: 'Apr', value: 241 },
  { label: 'May', value: 302 },
  { label: 'Jun', value: 355 },
];

export const Bars: Story = {
  render: () => (
    <Chart label="Clinic visits per month, first half of 2026" className="w-lg">
      <BarChart data={VISITS} showValues />
      <ChartLegend items={[{ label: 'Visits', series: 1 }]} />
    </Chart>
  ),
};

export const Line: Story = {
  render: () => (
    <Chart label="Clinic visits per month, first half of 2026" className="w-lg">
      <LineChart data={VISITS} filled />
      <ChartCaption>Six months to June. The dip in April was the Eid week.</ChartCaption>
    </Chart>
  ),
};

export const TheFiveSeries: Story = {
  render: () => (
    <Chart label="The five chart series" className="w-lg">
      <div className="flex flex-col gap-2">
        {([1, 2, 3, 4, 5] as const).map((series) => (
          <BarChart key={series} series={series} data={VISITS} max={400} className="h-10" />
        ))}
      </div>
      <ChartLegend
        items={[
          { label: 'One', series: 1 },
          { label: 'Two', series: 2 },
          { label: 'Three', series: 3 },
          { label: 'Four', series: 4 },
          { label: 'Five', series: 5 },
        ]}
      />
    </Chart>
  ),
};

export const InlineSparkline: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <StatRow>
        <Stat label="Visits this month" value="355" />
        <Stat label="Prescriptions" value="1,204" />
      </StatRow>
      <div className="flex items-center gap-6">
        <Sparkline data={VISITS} />
        <Sparkline data={VISITS} series={3} />
        <Sparkline data={VISITS} series={5} />
      </div>
    </div>
  ),
};

export const WithTheNumbersBeside: Story = {
  render: () => (
    <Chart label="Clinic visits per month, first half of 2026" className="w-lg">
      <BarChart data={VISITS} />
      <ChartCaption>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VISITS.map((point) => (
              <TableRow key={point.label}>
                <TableCell>{point.label}</TableCell>
                <TableCell>{point.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCaption>
    </Chart>
  ),
};

export const BarHeightsAreProportional: Story = {
  render: () => (
    <Chart label="Two values, one twice the other" className="w-64">
      <BarChart
        data={[
          { label: 'One', value: 50 },
          { label: 'Two', value: 100 },
        ]}
      />
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('[data-slot="bar-chart-bar"]');
    const heights = [...bars].map((bar) => bar.getBoundingClientRect().height);

    await expect(bars).toHaveLength(2);
    await expect(Math.abs((heights[1] ?? 0) / (heights[0] ?? 1) - 2)).toBeLessThan(0.05);
  },
};

/**
 * Fractions fill the plot rather than sitting under a ceiling of 1, a value
 * past a shared `max` stops at the top, and a repeated label is still its own
 * column.
 */
export const BarsStayInsideThePlot: Story = {
  render: () => (
    <div className="grid w-96 gap-6">
      <Chart label="Conversion rate by month">
        <BarChart
          data={[
            { label: 'Oct', value: 0.12 },
            { label: 'Nov', value: 0.34 },
            { label: 'Oct', value: 0.2 },
          ]}
        />
      </Chart>
      <Chart label="Visits against a shared scale of 100">
        <BarChart
          max={100}
          data={[
            { label: 'In range', value: 50 },
            { label: 'Over', value: 140 },
            { label: 'Below zero', value: -20 },
          ]}
        />
      </Chart>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [fractions, shared] = [...canvasElement.querySelectorAll('[data-slot="bar-chart"]')];
    const heights = (chart: Element | undefined) =>
      [...chart!.querySelectorAll('[data-slot="bar-chart-bar"]')].map(
        (bar) => bar.getBoundingClientRect().height,
      );
    const plot = (chart: Element | undefined) =>
      chart!
        .querySelector('[data-slot="bar-chart-bar"]')!
        .parentElement!.getBoundingClientRect().height;

    const [, tallest] = heights(fractions);
    await expect(heights(fractions)).toHaveLength(3);
    await expect(Math.abs((tallest ?? 0) - plot(fractions))).toBeLessThan(1);

    const [half, over, negative] = heights(shared);
    await expect(Math.abs((over ?? 0) - plot(shared))).toBeLessThan(1);
    await expect(Math.abs((half ?? 0) * 2 - plot(shared))).toBeLessThan(1);
    await expect(negative).toBeLessThan(plot(shared) * 0.02);
  },
};

export const ThePictureIsNamedOnce: Story = {
  render: () => (
    <Chart label="Clinic visits per month" className="w-96">
      <LineChart data={VISITS} />
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const figure = canvas.getByRole('figure', { name: 'Clinic visits per month' });
    const svg = canvasElement.querySelector('[data-slot="line-chart"]') as SVGElement;

    await expect(figure).toBeInTheDocument();
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};
