'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/role-has-required-aria-props --
 * The trigger is a `<button role="combobox">`, as Radix's own `SelectTrigger`
 * is: a native `<select>` cannot open a calendar. `PopoverTrigger` adds
 * `aria-expanded` and `aria-controls` at runtime, which a static rule cannot
 * see; `DatePicker.stories.tsx` asserts them. */
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Calendar, type CalendarProps } from './Calendar';
import { CalendarIcon } from './icons';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface DatePickerProps extends Omit<ComponentProps<'button'>, 'onSelect' | 'value'> {
  /** The chosen date, or nothing yet. */
  value?: Date | undefined;
  onSelect?: ((date: Date) => void) | undefined;
  /** The month the calendar shows. Separate from the value: a reader may browse. */
  month: Date;
  onMonthChange?: ((month: Date) => void) | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  locale?: string | undefined;
  /** Shown on the trigger before anything is chosen. */
  placeholder?: ReactNode;
  /** Names the calendar panel, which is a dialog and must have one. */
  panelLabel?: string | undefined;
  disabledDates?: CalendarProps['disabledDates'];
  today?: Date | undefined;
}

/**
 * `Popover` + `Calendar` + a trigger showing the chosen date.
 *
 * `month` and `value` are separate props: a reader may page through March
 * without choosing a date in it.
 *
 * The panel opens with focus on the chosen date, else on today, so the arrow
 * keys work at once.
 *
 * **A client component**, as `Calendar` is: it passes the popover a focus
 * handler of its own, and a Server Component cannot pass a function. A Server
 * Component file may still import and place it; it renders on the client.
 *
 * @example
 * <DatePicker
 *   value={date}
 *   month={month}
 *   onMonthChange={setMonth}
 *   onSelect={(d) => { setDate(d); setOpen(false); }}
 *   open={open}
 *   onOpenChange={setOpen}
 *   panelLabel="Choose a visit date"
 * />
 */
export function DatePicker({
  className,
  value,
  onSelect,
  month,
  onMonthChange,
  open,
  onOpenChange,
  locale = 'en-US',
  placeholder = 'Choose a date',
  panelLabel = 'Choose a date',
  disabledDates,
  today,
  ...props
}: DatePickerProps) {
  const label =
    value === undefined
      ? placeholder
      : new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(value);

  // Radix types `open?: boolean` without `| undefined`, and passing
  // `open={undefined}` would make the popover controlled and permanently
  // closed. Spread conditionally so it stays uncontrolled when the pair is
  // left out.
  const popoverProps = {
    ...(open === undefined ? {} : { open }),
    ...(onOpenChange === undefined ? {} : { onOpenChange }),
  };

  return (
    <Popover {...popoverProps}>
      {/* `combobox`, not the button's own role: a combobox exposes its text as
          its value, so the chosen date is announced after the label, as a
          `SelectTrigger`'s value is. It also makes `aria-required` and
          `aria-invalid` valid here. */}
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          data-slot="date-picker"
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 rounded-md px-3',
            'border border-field-line bg-field font-text text-body-md shadow-resting',
            '[--icon-size:var(--icon-md)]',
            'transition-[border-color] duration-fast ease-out hover:border-field-line-hover',
            'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'aria-invalid:border-field-line-invalid',
            'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
            value === undefined ? 'text-placeholder' : 'text-on-field',
            className,
          )}
          {...props}
        >
          {label}
          <CalendarIcon aria-hidden="true" className="shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={panelLabel}
        className="w-auto p-0"
        // Open on the day the grid would take focus on (the chosen date, else
        // today), not on "Previous month", the first button in the panel.
        onOpenAutoFocus={(event) => {
          const day = (event.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>(
            '[data-slot="calendar-day"][tabindex="0"]',
          );
          if (!day) return;
          event.preventDefault();
          day.focus();
        }}
      >
        <Calendar
          month={month}
          onMonthChange={onMonthChange}
          selected={value}
          onSelect={onSelect}
          locale={locale}
          disabledDates={disabledDates}
          today={today}
        />
      </PopoverContent>
    </Popover>
  );
}
