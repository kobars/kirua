import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';
import {
  railConnector,
  railContent,
  railItem,
  railList,
  railMarkerColumn,
} from './rail.styles';
import { stepperMarker, type StepStatus } from './Stepper.styles';

/**
 * Where you are in a process.
 *
 * It shares its rail with `Timeline` and nothing else — see the note there
 * about why a mode flag on one component would have been wrong.
 *
 * `aria-label` is required in the type. A stepper is an `<ol>` in the middle of
 * a form, and "list of 2 items" is not what it is; naming it is the difference
 * between a landmark a screen-reader user can orient by and one more list.
 *
 * @example
 * <Stepper aria-label="Sign in">
 *   <StepperItem status="done" index={1}>Phone number</StepperItem>
 *   <StepperItem status="current" index={2}>Confirmation code</StepperItem>
 * </Stepper>
 */
export interface StepperProps extends ComponentProps<'ol'> {
  'aria-label': string;
}

export function Stepper({ className, ...props }: StepperProps) {
  return <ol data-slot="stepper" className={cn(railList, className)} {...props} />;
}

export interface StepperItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  status?: StepStatus;
  /** 1-based, and shown in the marker until the step is done. */
  index: number;
  children: ReactNode;
  /**
   * Overridden only to translate. A screen reader reads the marker's number as
   * a bare digit otherwise, and "2" beside a step name says nothing about
   * whether it has been passed.
   */
  labels?: { done: string; current: string; upcoming: string };
}

const DEFAULT_LABELS = { done: 'Done', current: 'Current step', upcoming: 'Not started' };

export function StepperItem({
  className,
  status,
  index,
  children,
  labels = DEFAULT_LABELS,
  ...props
}: StepperItemProps) {
  const state = status ?? 'upcoming';
  return (
    <li
      data-slot="stepper-item"
      // The one piece of state that is not a class. A stepper that only draws
      // its position tells a sighted reader where they are and nobody else.
      aria-current={state === 'current' ? 'step' : undefined}
      className={cn(railItem, className)}
      {...props}
    >
      <span data-slot="stepper-item-rail" className={railMarkerColumn}>
        <span data-slot="stepper-item-marker" className={stepperMarker[state]}>
          {state === 'done' ? (
            <CheckIcon size="xs" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">{index}</span>
          )}
        </span>
        <span data-slot="stepper-item-connector" className={railConnector} aria-hidden="true" />
      </span>
      <div data-slot="stepper-item-content" className={cn(railContent, 'pt-0.5')}>
        <span
          data-slot="stepper-item-label"
          className={cn(
            'text-body-sm',
            state === 'upcoming' ? 'text-fg-muted' : 'font-medium text-fg',
          )}
        >
          {children}
        </span>
        <span data-slot="stepper-item-status" className="sr-only">
          {labels[state]}
        </span>
      </div>
    </li>
  );
}
