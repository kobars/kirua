/**
 * The marker's classes, keyed by the step's status.
 *
 * Three states and not two, because "not done" is two different things to the
 * person reading. The current step is where their attention belongs; an
 * upcoming one is a promise about what comes next. Drawn the same way, a
 * two-step form shows the person no indication of which step they are on.
 *
 * A `*.styles.ts` file rather than a cva in `*.variants.ts`, and the reason is
 * mechanical: `variants.test.tsx` requires every cva in `Stepper.variants.ts`
 * to put its classes on `[data-slot="stepper"]`, and these land on the marker
 * inside each item.
 *
 * The states are visible here and announced elsewhere: `aria-current="step"`
 * and an `sr-only` word per item carry the same information to anyone not
 * looking at the marker, and neither of those is a class.
 */
const MARKER_BASE =
  'flex size-6 shrink-0 items-center justify-center rounded-pill text-caption font-semibold tabular-nums';

export const stepperMarker = {
  done: `${MARKER_BASE} bg-primary text-on-primary`,
  current: `${MARKER_BASE} border-2 border-primary bg-page text-fg`,
  upcoming: `${MARKER_BASE} border border-line bg-page text-fg-muted`,
} as const;

export type StepStatus = keyof typeof stepperMarker;
