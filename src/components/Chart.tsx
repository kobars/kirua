import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * A data point. `label` is what a reader sees on the axis and in the
 * alternative table; `value` is the number.
 */
export interface ChartPoint {
  label: string;
  value: number;
}

/** Which of the five series colours to paint with. */
export type ChartSeries = 1 | 2 | 3 | 4 | 5;

/**
 * Written out rather than composed, because Tailwind finds classes by scanning
 * source text: `` `text-chart-${series}` `` generates no CSS at all and the
 * chart renders in the inherited colour, which looks exactly like a broken
 * token.
 */
const SERIES_COLOUR: Record<ChartSeries, string> = {
  1: 'text-chart-1',
  2: 'text-chart-2',
  3: 'text-chart-3',
  4: 'text-chart-4',
  5: 'text-chart-5',
};

export interface ChartProps extends Omit<ComponentProps<'figure'>, 'title'> {
  /**
   * What the picture shows, in a sentence. Required: an SVG with no name is
   * announced as nothing at all, and a chart is the one component where the
   * meaning is entirely in the picture.
   */
  label: string;
}

/**
 * The frame around a plot: a `<figure>` with an accessible name, and room for a
 * caption underneath.
 *
 * Charts here are plain SVG. There is no charting library in this repository
 * and that is a decision, not a gap — the common cases are a few dozen lines of
 * geometry, they server-render with no client JavaScript, and they read their
 * colours from the token layer like every other component. Reach for a library
 * when you need axes that pan, tooltips that follow a cursor, or tens of
 * thousands of points.
 *
 * **A picture is not a substitute for the numbers.** Put a `<Table>` in a
 * `ChartCaption`, or link to one. `label` names the chart; it cannot read it
 * out.
 *
 * @example
 * <Chart label="Revenue by month, 2026">
 *   <BarChart data={months} />
 *   <ChartLegend items={[{ label: 'Revenue', series: 1 }]} />
 * </Chart>
 */
export function Chart({ className, label, children, ...props }: ChartProps) {
  return (
    <figure
      data-slot="chart"
      aria-label={label}
      className={cn('flex w-full flex-col gap-3', className)}
      {...props}
    >
      {children}
    </figure>
  );
}

export function ChartCaption({ className, ...props }: ComponentProps<'figcaption'>) {
  return (
    <figcaption
      data-slot="chart-caption"
      className={cn('font-text text-body-sm text-fg-secondary', className)}
      {...props}
    />
  );
}

export interface ChartLegendProps extends ComponentProps<'ul'> {
  items: { label: string; series: ChartSeries }[];
}

/**
 * The key. A real list, so a screen reader can count the series, and the swatch
 * is `aria-hidden` because its colour is repeated in the text beside it.
 */
export function ChartLegend({ className, items, ...props }: ChartLegendProps) {
  return (
    <ul
      data-slot="chart-legend"
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}
      {...props}
    >
      {items.map((item, index) => (
        <li
          data-slot="chart-legend-item"
          key={`${index}-${item.label}`}
          className="flex items-center gap-2 font-text text-caption text-fg-secondary"
        >
          <span
            data-slot="chart-legend-swatch"
            aria-hidden="true"
            className={cn('size-2.5 rounded-xs bg-current', SERIES_COLOUR[item.series])}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * The value a full-height mark stands for: `max` when it is usable, else the
 * largest value present. Falls back to 1 only when nothing is above zero, so
 * a series of fractions still fills the plot.
 */
function ceilingOf(data: ChartPoint[], max: number | undefined) {
  if (max !== undefined && max > 0) return max;
  const peak = Math.max(0, ...data.map((point) => point.value));
  return peak > 0 ? peak : 1;
}

/** A value's share of the plot height, clamped so no mark leaves the plot. */
function shareOf(value: number, ceiling: number) {
  const share = value / ceiling;
  return Number.isFinite(share) ? Math.min(Math.max(share, 0), 1) : 0;
}

export interface BarChartProps extends ComponentProps<'div'> {
  data: ChartPoint[];
  /**
   * The value the tallest bar represents. Defaults to the largest value
   * present, which makes two charts side by side incomparable — pass the same
   * `max` to both when that matters. A value above it is drawn at full
   * height, and one below zero as the empty stub.
   */
  max?: number;
  series?: ChartSeries;
  /** Show each bar's own value above it. Crowds below about eight bars. */
  showValues?: boolean;
}

/**
 * Bars, in CSS rather than SVG.
 *
 * A bar chart is a row of columns with percentage heights, and expressing it
 * that way means the labels are real text that wraps, selects and translates
 * instead of `<text>` nodes that do none of those.
 *
 * Each column is a grid, and the bar is positioned inside the one row that
 * takes the leftover space. That is not a stylistic choice: a percentage height
 * on a flex child resolves against a box flexbox is still free to shrink, so
 * the bars come out *nearly* proportional — measured at a 21% error on a 2:1
 * pair, which is enough to turn a chart into a lie and little enough that
 * nobody notices.
 */
export function BarChart({
  className,
  data,
  max,
  series = 1,
  showValues = false,
  ...props
}: BarChartProps) {
  const ceiling = ceilingOf(data, max);

  return (
    <div
      data-slot="bar-chart"
      className={cn('flex h-48 w-full items-stretch gap-2', className)}
      {...props}
    >
      {data.map((point, index) => (
        <div
          data-slot="bar-chart-column"
          key={`${index}-${point.label}`}
          className={cn(
            'grid min-w-0 flex-1 gap-1.5',
            showValues ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[1fr_auto]',
          )}
        >
          {showValues && (
            <span
              data-slot="bar-chart-value"
              className="text-center font-text text-caption text-fg-muted tabular-nums"
            >
              {point.value}
            </span>
          )}
          <div data-slot="bar-chart-track" className="relative min-h-0">
            <div
              data-slot="bar-chart-bar"
              className={cn(
                'absolute bottom-0 w-full rounded-xs bg-current',
                SERIES_COLOUR[series],
              )}
              style={{ height: `${Math.max(shareOf(point.value, ceiling) * 100, 1)}%` }}
            />
          </div>
          <span
            data-slot="bar-chart-label"
            className="truncate text-center font-text text-caption text-fg-muted"
          >
            {point.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface LineChartProps extends ComponentProps<'svg'> {
  data: ChartPoint[];
  /** The value at the top of the plot. Defaults to the largest value present. */
  max?: number;
  series?: ChartSeries;
  /** Fill the area under the line. Reads as a volume rather than a rate. */
  filled?: boolean;
}

const VIEW_W = 100;
const VIEW_H = 40;

/** `[{value: 3}, {value: 9}]` → `"0,31 100,4"` in the 100 × 40 view box. */
function toPoints(data: ChartPoint[], ceiling: number) {
  const step = data.length > 1 ? VIEW_W / (data.length - 1) : 0;
  return data
    .map((point, index) => {
      return `${index * step},${VIEW_H - shareOf(point.value, ceiling) * VIEW_H}`;
    })
    .join(' ');
}

/**
 * A line, in SVG.
 *
 * The view box is a fixed 100 × 40 and the SVG scales to its container, so the
 * geometry never has to be measured. `vectorEffect="non-scaling-stroke"` is
 * what keeps the line one pixel thick after that scaling — without it a wide
 * chart draws a thin line and a narrow one draws a fat one.
 *
 * The element is `aria-hidden`: the `Chart` around it already carries the
 * accessible name, and a nested `role="img"` would announce the same picture
 * twice.
 */
export function LineChart({
  className,
  data,
  max,
  series = 1,
  filled = false,
  ...props
}: LineChartProps) {
  const ceiling = ceilingOf(data, max);
  const points = toPoints(data, ceiling);

  return (
    <svg
      data-slot="line-chart"
      aria-hidden="true"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      className={cn('h-40 w-full overflow-visible', SERIES_COLOUR[series], className)}
      {...props}
    >
      {filled && (
        <polygon
          points={`0,${VIEW_H} ${points} ${VIEW_W},${VIEW_H}`}
          fill="currentColor"
          opacity="0.14"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export interface SparklineProps extends Omit<LineChartProps, 'filled'> {}

/** A line small enough to sit inside a sentence or a table cell. */
export function Sparkline({ className, ...props }: SparklineProps) {
  return <LineChart data-slot="sparkline" className={cn('h-8 w-24', className)} {...props} />;
}
