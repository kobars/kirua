/* oxlint-disable jsx-a11y/control-has-associated-label --
 * Every day button has `aria-label={dayFormat.format(date)}`. The rule cannot
 * follow a computed value; the stories assert the real names. */
import type { ComponentProps, FocusEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';
import { ChevronEndIcon, ChevronStartIcon } from './icons';

export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  /** Any date inside the month being shown. */
  month: Date;
  /**
   * Optional props spell `| undefined` explicitly. Under
   * `exactOptionalPropertyTypes` an absent prop and a present-but-undefined
   * prop are different types, and `DatePicker` forwards the second kind.
   */
  onMonthChange?: ((month: Date) => void) | undefined;
  selected?: Date | undefined;
  onSelect?: ((date: Date) => void) | undefined;
  /** Dates the user may not choose. Compared by calendar day, not by instant. */
  disabledDates?: Date[] | undefined;
  /**
   * A BCP 47 tag. Month names, weekday names and the first day of the week all
   * come from it — Sunday in `en-US`, Monday in `id-ID` and `en-GB`.
   */
  locale?: string | undefined;
  /** Injectable so tests and screenshots are not time-dependent. */
  today?: Date | undefined;
  previousLabel?: string | undefined;
  nextLabel?: string | undefined;
}

/** Midnight local time, so two dates compare by day rather than by instant. */
const day = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date, b: Date) => day(a).getTime() === day(b).getTime();
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
/** The same day number in another month, clamped to that month's last day. */
const addMonths = (date: Date, months: number) => {
  const last = new Date(date.getFullYear(), date.getMonth() + months + 1, 0).getDate();
  return new Date(date.getFullYear(), date.getMonth() + months, Math.min(date.getDate(), last));
};
/** From local parts: `toISOString()` would shift the day across UTC. */
const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** `getWeekInfo` is newer than the ES2023 lib this project compiles against. */
type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => { firstDay: number } };

/**
 * `getWeekInfo` returns 1 for Monday through 7 for Sunday; `Date.getDay`
 * returns 0 for Sunday, so the modulo converts between them. The catch covers
 * engines in the support matrix that do not have `getWeekInfo` yet.
 */
function firstWeekday(tag: string): number {
  try {
    const info = (new Intl.Locale(tag) as LocaleWithWeekInfo).getWeekInfo?.();
    return (info?.firstDay ?? 1) % 7;
  } catch {
    return 1;
  }
}

/**
 * A month of days, as a table of buttons. Controlled: `month` and `selected`
 * are the consumer's.
 *
 * The grid is one tab stop. It starts on the selected day, else today, else
 * the first day that can be chosen, and then follows focus, so Tab away and
 * Shift+Tab back returns to the day last focused. Following focus rewrites
 * `tabindex` in the focus handler, which runs only in the browser, so the
 * server markup and hydration are unchanged.
 *
 * The arrow keys move a day or a week (mirrored in a right-to-left page), Home
 * and End go to the ends of the week, Page Up and Page Down a month, and with
 * Shift a year. A move out of the month calls `onMonthChange` and focuses the
 * day once the consumer has rendered it. Every day carries
 * `data-date="YYYY-MM-DD"`.
 *
 * A disabled date stays focusable and reads as unavailable, so moving through
 * the grid never skips a day without saying why.
 *
 * **A `Date` here is a local calendar day, and `toISOString()` will misreport
 * it.** It converts to UTC, so `new Date(2026, 2, 17)` in UTC+7 serialises as
 * `2026-03-16`. Format with `Intl`, or build the string from local parts:
 *
 * ```ts
 * const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` +
 *             `-${String(d.getDate()).padStart(2, '0')}`;
 * ```
 *
 * @example
 * <Calendar month={month} onMonthChange={setMonth} selected={date} onSelect={setDate} />
 */
export function Calendar({
  className,
  month,
  onMonthChange,
  selected,
  onSelect,
  disabledDates = [],
  locale = 'en-US',
  today = new Date(),
  previousLabel = 'Previous month',
  nextLabel = 'Next month',
  ...props
}: CalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const titleFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const dayFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });

  const start = firstWeekday(locale);
  // 1970-01-04 was a Sunday, so the offset walks the names from this locale's
  // first day.
  const weekdays = Array.from(
    { length: 7 },
    (_, i) => new Date(1970, 0, 4 + ((start + i) % 7)),
  );

  const firstOfMonth = new Date(year, monthIndex, 1);
  const lead = (firstOfMonth.getDay() - start + 7) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
  const isDisabled = (date: Date) => disabledDates.some((d) => sameDay(d, date));
  const days = cells.filter((date): date is Date => date !== null);
  const inMonth = (date: Date | undefined) =>
    date !== undefined && date.getFullYear() === year && date.getMonth() === monthIndex;
  const focusTarget =
    [selected, today].find(inMonth) ?? days.find((date) => !isDisabled(date)) ?? days[0];

  // React writes `tabIndex` only when its own value for a day changes, so the
  // stop set here survives re-renders. A `selected` changed from outside while
  // focus is elsewhere can leave a second stop until a day is next focused.
  const onFocus = (event: FocusEvent<HTMLButtonElement>) => {
    const focused = event.currentTarget;
    for (const other of focused
      .closest('table')
      ?.querySelectorAll<HTMLElement>('[data-slot="calendar-day"]') ?? []) {
      other.tabIndex = other === focused ? 0 : -1;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const grid = event.currentTarget.closest('table');
    const from = event.currentTarget.dataset['date'];
    if (grid === null || from === undefined) return;
    const [y = 0, m = 1, d = 1] = from.split('-').map(Number);
    const current = new Date(y, m - 1, d);
    const step = getComputedStyle(grid).direction === 'rtl' ? -1 : 1;
    const column = (current.getDay() - start + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(current, -step),
      ArrowRight: () => addDays(current, step),
      ArrowUp: () => addDays(current, -7),
      ArrowDown: () => addDays(current, 7),
      Home: () => addDays(current, -column),
      End: () => addDays(current, 6 - column),
      PageUp: () => addMonths(current, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(current, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();

    const target = move();
    const focus = () =>
      grid.querySelector<HTMLElement>(`[data-date="${isoDay(target)}"]`)?.focus();
    if (inMonth(target)) {
      focus();
      return;
    }
    // The month is the consumer's, so the target day exists only after the
    // re-render this asks for.
    onMonthChange?.(new Date(target.getFullYear(), target.getMonth(), 1));
    requestAnimationFrame(focus);
  };

  return (
    <div
      data-slot="calendar"
      className={cn('w-max rounded-lg bg-raised p-3 font-text text-fg', className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <IconButton
          type="button"
          aria-label={previousLabel}
          size="sm"
          variant="ghost"
          onClick={() => onMonthChange?.(new Date(year, monthIndex - 1, 1))}
        >
          <ChevronStartIcon className="rtl:-scale-x-100" />
        </IconButton>
        {/* aria-live, so moving between months is announced. */}
        <span
          data-slot="calendar-title"
          aria-live="polite"
          className="text-body-md font-semibold"
        >
          {titleFormat.format(firstOfMonth)}
        </span>
        <IconButton
          type="button"
          aria-label={nextLabel}
          size="sm"
          variant="ghost"
          onClick={() => onMonthChange?.(new Date(year, monthIndex + 1, 1))}
        >
          <ChevronEndIcon className="rtl:-scale-x-100" />
        </IconButton>
      </div>

      <table data-slot="calendar-grid" className="border-collapse">
        <caption className="sr-only">{titleFormat.format(firstOfMonth)}</caption>
        <thead>
          <tr>
            {weekdays.map((date) => (
              <th
                key={date.getDay()}
                scope="col"
                className="size-10 text-caption font-medium text-fg-muted"
              >
                {/* The short name is shown; the long one is read out. */}
                <span aria-hidden="true">{weekdayShort.format(date)}</span>
                <span className="sr-only">{weekdayLong.format(date)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)?.toISOString() ?? String(week.length)}>
              {week.map((date, index) =>
                date === null ? (
                  <td key={`pad-${index}`} className="size-10" />
                ) : (
                  <td key={date.toISOString()} className="p-0">
                    <button
                      type="button"
                      data-slot="calendar-day"
                      data-date={isoDay(date)}
                      tabIndex={
                        focusTarget !== undefined && sameDay(focusTarget, date) ? 0 : -1
                      }
                      aria-label={dayFormat.format(date)}
                      aria-pressed={selected !== undefined && sameDay(selected, date)}
                      aria-current={sameDay(today, date) ? 'date' : undefined}
                      aria-disabled={isDisabled(date) || undefined}
                      onClick={isDisabled(date) ? undefined : () => onSelect?.(date)}
                      onFocus={onFocus}
                      onKeyDown={onKeyDown}
                      className={cn(
                        'size-10 touch-manipulation rounded-md text-body-sm tabular-nums',
                        'transition-[color,background-color,border-color] duration-fast ease-out',
                        'hover:bg-ghost-hover',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        'aria-disabled:pointer-events-none aria-disabled:text-on-disabled',
                        // Today is a ring, the selection a fill: a date can be both.
                        sameDay(today, date) && 'ring-1 ring-line-strong ring-inset',
                        selected !== undefined &&
                          sameDay(selected, date) &&
                          'bg-primary font-semibold text-on-primary hover:bg-primary-hover',
                      )}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
