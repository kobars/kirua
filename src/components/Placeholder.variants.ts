import { cva } from '@/lib/cva';

/**
 * A tinted box standing in for media that does not exist: a product with no
 * photo, a thumbnail, the mark beside an assistant's reply.
 *
 * `fill` takes the box it is in — an `AspectRatio` — and the fixed steps match
 * `Avatar`'s circles, so a thumbnail and an avatar in the same list line up.
 * Each step sets `--icon-size` and a type size, so an icon or a single letter
 * inside is in proportion without a prop of its own. `fill` keeps a caption
 * inside it — a `Text` describing missing artwork — clear of the edges.
 *
 * `brand` uses the subtle brand surface and the accent text colour, which is
 * the pair measured for an icon on a tint.
 */
export const placeholderVariants = cva(
  'grid shrink-0 place-content-center overflow-hidden font-text',
  {
    variants: {
      tone: {
        sunken: 'bg-sunken text-fg-muted',
        brand: 'bg-brand-subtle text-fg-accent',
      },
      size: {
        fill: 'size-full px-6 font-display text-display-md [--icon-size:var(--icon-2xl)]',
        xs: 'size-6 text-caption [--icon-size:var(--icon-sm)]',
        sm: 'size-10 text-body-sm [--icon-size:var(--icon-md)]',
        md: 'size-12 text-body-md [--icon-size:var(--icon-lg)]',
        lg: 'size-16 text-heading-sm [--icon-size:var(--icon-xl)]',
      },
      shape: {
        rounded: 'rounded-md',
        circle: 'rounded-pill',
        square: 'rounded-none',
      },
    },
    defaultVariants: { tone: 'sunken', size: 'fill', shape: 'rounded' },
  },
);
