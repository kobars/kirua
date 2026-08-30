import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge needs to know about the custom scale names added in
 * tokens.primitives.css, otherwise it cannot tell that `rounded-pill` and
 * `rounded-xl` conflict, or that `text-display-xl` (a size) conflicts with
 * `text-body-md` rather than with `text-fg` (a colour).
 *
 * `theme` extends a scale tailwind-merge already models (so `shadow-brand` is
 * read as a shadow, not as a shadow *colour*); `classGroups` is for the rest.
 *
 * `z` is in `classGroups` because Tailwind has no `--z-*` theme namespace
 * — the named layers are `@utility` rules in theme.css, so tailwind-merge has
 * no way to learn them from the CSS.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      animate: [
        'fade-in',
        'fade-out',
        'pop-in',
        'pop-out',
        'slide-down',
        'slide-in-side',
        'slide-out-side',
        'slide-in-bottom',
        'slide-out-bottom',
        'accordion-down',
        'accordion-up',
        'pulse-soft',
        'spin-steady',
      ],
      shadow: ['brand', 'resting', 'raised', 'overlay'],
    },
    classGroups: {
      'font-size': [
        {
          text: [
            'display-2xl',
            'display-xl',
            'display-lg',
            'display-md',
            'heading-lg',
            'heading-md',
            'heading-sm',
            'body-lg',
            'body-md',
            'body-sm',
            'caption',
          ],
        },
      ],
      rounded: [{ rounded: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill'] }],
      'font-family': [{ font: ['display', 'text', 'mono'] }],
      duration: [{ duration: ['fast', 'base', 'slow'] }],
      z: [
        {
          z: [
            'base',
            'raised',
            'ornament',
            'sticky',
            'scrim',
            'modal',
            'popover',
            'tooltip',
            'toast',
          ],
        },
      ],
    },
  },
});

/**
 * Merge class names, with later Tailwind utilities correctly overriding earlier
 * conflicting ones.
 *
 * @example cn('rounded-xl px-4', isPill && 'rounded-pill') // -> 'px-4 rounded-pill'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
