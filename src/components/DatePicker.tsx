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
      <PopoverTrigger asChild>
        <button
          type="button"
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
      <PopoverContent aria-label={panelLabel} className="w-auto p-0">
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
