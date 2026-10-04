/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * The tags this rule suggests for `role="group"` are `fieldset`, `hgroup`,
 * `details`, `optgroup` and `address`. A bar of buttons is none of them, and
 * `fieldset` in particular would oblige a `<legend>` and draw a form border
 * around a toolbar. `role="group"` with an `aria-label` is what the ARIA
 * practices guide specifies here.
 *
 * File-level, not next-line: oxlint 1.75 silently ignores an
 * `oxlint-disable-next-line` for a `jsx-a11y` rule. Verified by planting one
 * and watching the warning survive. */
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { buttonGroupVariants } from './ButtonGroup.variants';

export interface ButtonGroupProps
  extends ComponentProps<'div'>, VariantProps<typeof buttonGroupVariants> {}

/**
 * Several buttons acting as one control — a segmented bar, a split action, a
 * pager.
 *
 * `role="group"` is what tells a screen reader the buttons belong together, so
 * give it a name with `aria-label`. Without one the grouping is announced and
 * then left unexplained.
 *
 * A focused button must paint over its neighbours, which is why the group is
 * `isolate`: it creates a stacking context so `focus-visible`'s outline is not
 * clipped by the next button's background.
 *
 * @example
 * <ButtonGroup aria-label="Text alignment">
 *   <Button variant="secondary">Start</Button>
 *   <Button variant="secondary">Centre</Button>
 *   <Button variant="secondary">End</Button>
 * </ButtonGroup>
 */
export function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * A static label sharing the group's shape — "of 12" between two pagers, a
 * unit after a stepper. Not focusable, so it carries no role.
 *
 * It takes its height from the buttons beside it, so it matches a group of
 * `sm` buttons as well as `md`. A group holding nothing but this text is only
 * as tall as its padding. The text size is the consumer's, through `className`.
 */
export function ButtonGroupText({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        'inline-flex items-center self-stretch rounded-pill border-2 border-secondary-line',
        'bg-secondary px-4 font-text text-body-md font-medium text-on-secondary',
        className,
      )}
      {...props}
    />
  );
}

/** A hairline between two joined buttons, so the shared edge stays readable. */
export function ButtonGroupSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group-separator"
      role="presentation"
      className={cn('z-raised w-px shrink-0 self-stretch bg-secondary-line', className)}
      {...props}
    />
  );
}
