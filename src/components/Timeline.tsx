import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import {
  railConnector,
  railContent,
  railItem,
  railList,
  railMarkerColumn,
} from './rail.styles';

/**
 * What happened, and when. Read-only, chronological, timestamped.
 *
 * Deliberately not the same component as `Stepper` with a mode flag. They draw
 * the same rail and claim different things, and the claim is carried by the
 * markup rather than by the drawing: a timeline marks its moments with
 * `<time datetime>`, a stepper marks its position with `aria-current="step"`.
 * A flag would have made one of those two wrong on every render.
 *
 * It replaced a two-column `<Table>` on the shop's order page. A table invites
 * comparison across rows; delivery history is a sequence. The test is the shape
 * of the data, not the word "history" — `simrs/PatientRecord.tsx` keeps its
 * six-column visit table, where you genuinely do compare across.
 *
 * @example
 * <Timeline>
 *   <TimelineItem>
 *     <TimelineTime dateTime="2026-03-11T09:12">11 Mar 2026, 09:12</TimelineTime>
 *     <Text size="sm" tone="primary">Arrived at the Bandung warehouse</Text>
 *   </TimelineItem>
 * </Timeline>
 */
export function Timeline({ className, ...props }: ComponentProps<'ol'>) {
  return <ol data-slot="timeline" className={cn(railList, className)} {...props} />;
}

export interface TimelineItemProps extends ComponentProps<'li'> {
  /**
   * The moment this one is. The default dot is a moment that has passed, which
   * is what a history is made of; `pending` is the one that has not.
   */
  state?: 'past' | 'pending';
}

export function TimelineItem({
  className,
  state = 'past',
  children,
  ...props
}: TimelineItemProps) {
  return (
    // `data-slot` and the spread are both on the `<li>`, which is the root: a
    // ref, an id and a `data-*` all have to land on the same node. `children`
    // is therefore taken out of the spread and placed in the content column.
    <li data-slot="timeline-item" className={cn(railItem, className)} {...props}>
      <span className={railMarkerColumn} aria-hidden="true">
        <span
          className={cn(
            'mt-1.5 size-2.5 shrink-0 rounded-pill',
            state === 'past' ? 'bg-line-strong' : 'border border-line-strong bg-page',
          )}
        />
        <span className={railConnector} />
      </span>
      <div className={railContent}>{children}</div>
    </li>
  );
}

/**
 * The timestamp, as a real `<time>`. `dateTime` is required in the type: a
 * moment nothing can parse is a moment only a sighted reader of one locale can
 * order, and the whole claim of a timeline is that it is ordered.
 */
export interface TimelineTimeProps extends ComponentProps<'time'> {
  dateTime: string;
}

export function TimelineTime({ className, ...props }: TimelineTimeProps) {
  return (
    <time
      data-slot="timeline-time"
      className={cn('text-caption text-fg-muted tabular-nums', className)}
      {...props}
    />
  );
}
