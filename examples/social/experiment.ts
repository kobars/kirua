/**
 * TEMPORARY — a style experiment, not part of the app.
 *
 * The question it exists to answer: should a post card be a neutral surface, a
 * brand-blue one, or something between, and does the answer hold in dark mode
 * as well as light?
 *
 * It is two files plus a handful of lines elsewhere, so removing it is:
 *
 *   1. delete this file, `ExperimentBar.tsx` and `cn.ts`
 *   2. drop the `surface` prop from `PostCard`
 *   3. drop the `<ExperimentBar>` and its state from `App`
 *
 * Nothing here is meant to survive the decision.
 */
export type CardSurface = 'neutral' | 'brand' | 'tint' | 'outline' | 'rail';

const KEY = 'kirua-social-card-surface';

export const SURFACES: { id: CardSurface; label: string; note: string }[] = [
  { id: 'neutral', label: 'Neutral', note: 'As it is now — a raised surface' },
  { id: 'brand', label: 'Full brand', note: 'The whole card blue, white text' },
  { id: 'tint', label: 'Tint', note: 'The palest blue ground, normal text' },
  {
    id: 'outline',
    label: 'Brand outline',
    note: 'A neutral card with a blue border all the way round',
  },
  {
    id: 'rail',
    label: 'Brand rail',
    note: 'A neutral card with a thick blue rail on the start edge only',
  },
];

export function readSurface(): CardSurface {
  try {
    const stored = localStorage.getItem(KEY);
    return SURFACES.some((s) => s.id === stored) ? (stored as CardSurface) : 'neutral';
  } catch {
    return 'neutral';
  }
}

export function writeSurface(surface: CardSurface) {
  try {
    localStorage.setItem(KEY, surface);
  } catch {
    // A private window refuses storage. The choice just does not survive a reload.
  }
}

/**
 * What each option does to a `Card`.
 *
 * `brand` uses the Card variant the design system already has, so it re-points
 * the whole subtree through `.ctx-brand` — the buttons and badges inside it
 * change with no prop of their own. The other three are class overrides,
 * because they are not surfaces the system has tokens for and this is an
 * experiment rather than a proposal.
 */
export const SURFACE_PROPS: Record<
  CardSurface,
  { variant?: 'light' | 'brand'; className?: string }
> = {
  neutral: { variant: 'light' },
  brand: { variant: 'brand' },
  tint: { variant: 'light', className: 'bg-brand-subtle' },
  outline: { variant: 'light', className: 'border-brand' },
  /**
   * `border-brand` colours every side, so the other three are pushed back to
   * the subtle line by name. Logical on the inline axis, so the rail stays on
   * the reading start in a right-to-left page.
   */
  rail: {
    variant: 'light',
    className:
      'border-s-4 border-brand border-t-line-subtle border-e-line-subtle border-b-line-subtle',
  },
};
