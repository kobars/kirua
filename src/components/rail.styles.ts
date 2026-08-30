/**
 * The rail: a marker, a connector between markers, and a block of content.
 *
 * `Timeline` and `Stepper` draw the same picture and mean different things, so
 * they share this drawing and nothing else. A `*.styles.ts` file rather than
 * `*.variants.ts`, for the reason `menu.styles.ts` carries the same suffix:
 * `variants.test.tsx` globs the `variants` suffix and would demand a story for
 * a `data-slot` nothing exports. There is no `Rail` component and there should
 * not be one — see the note in `Timeline.tsx` about why they are two.
 *
 * The connector is a flex child in the marker column rather than an absolutely
 * positioned line. Absolute positioning would need a hard offset to sit under
 * the middle of the marker, and a hard offset is a number that goes wrong the
 * first time a marker changes size — which is exactly what separates these two
 * components, whose markers are 10px and 24px.
 *
 * `group-last/rail:hidden` is what stops the last item trailing a line into
 * nothing. The named group is on the list item; an unnamed one would be caught
 * by any `group` a consumer put around the list.
 */
export const railList = 'grid gap-0 font-text';

export const railItem = 'group/rail grid grid-cols-[auto_minmax(0,1fr)] gap-x-3';

/** The marker column: the marker itself, then the line running down from it. */
export const railMarkerColumn = 'flex flex-col items-center';

export const railConnector = 'w-px flex-1 bg-line-subtle group-last/rail:hidden';

/** Content sits in the second column and pays the vertical rhythm. */
export const railContent = 'grid gap-0.5 pb-5 group-last/rail:pb-0';
