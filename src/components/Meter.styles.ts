/**
 * The fill's colour, by which side of its thresholds the value falls on.
 *
 * **There is no green.** The status family has three tones and this uses two of
 * them, because green already means *succeeded* everywhere else in the system
 * and a bed-occupancy bar at 60% has not succeeded at anything — it is simply
 * normal. Normal is the brand fill, which makes no claim.
 *
 * The chart series tokens are not used here for the reason they exist: they are
 * identity, not meaning. A meter's colour is a claim about the value.
 *
 * A `*.styles.ts` record rather than a cva, because these classes land on the
 * fill inside the track and `variants.test.tsx` checks a `*.variants.ts`
 * module against the root's own `data-slot`.
 */
export const meterFill = {
  normal: 'bg-primary',
  warning: 'bg-warning-solid',
  danger: 'bg-danger-solid',
} as const;

export type MeterLevel = keyof typeof meterFill;
