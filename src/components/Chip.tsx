import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const chip = cva(
  [
    'inline-flex items-center gap-2',
    'rounded-pill font-text font-medium whitespace-nowrap',
    'transition-colors duration-fast ease-out',
  ],
  {
    variants: {
      variant: {
        /* `bg-page` inside `ctx-inverse` stays pure black in dark mode too;
         * `bg-inverse` would flip to white. Same trick in Card and NavBar. */
        dark: 'ctx-inverse bg-page text-fg',
        light: 'border border-line-subtle bg-raised text-fg',
        /* bg-brand, not bg-brand-vivid: white chip text is 14px or smaller,
         * and white on blue-500 is only 3.64:1. */
        brand: 'bg-brand text-white',
        outline: 'border-2 border-line bg-transparent text-fg',
      },
      size: {
        sm: 'h-7 ps-2 pe-3 text-caption [--icon-size:var(--icon-sm)]',
        md: 'h-9 ps-2.5 pe-4 text-body-sm [--icon-size:var(--icon-sm)]',
        lg: 'h-11 ps-3 pe-5 text-body-md [--icon-size:var(--icon-md)]',
      },
    },
    defaultVariants: { variant: 'dark', size: 'md' },
  },
);

export interface ChipProps extends ComponentProps<'span'>, VariantProps<typeof chip> {
  /** Leading slot — an avatar stack, a dot, or a small icon. */
  leading?: ReactNode;
  children: ReactNode;
}

/**
 * A compact pill label. In the reference these float over the artwork carrying
 * social proof and attribution. The `dark` variant sets `ctx-inverse`, so
 * anything nested inside flips to its on-black colours automatically.
 *
 * @example <Chip leading={<AvatarStack items={people} />}>+1M Likes</Chip>
 */
export function Chip({ className, variant, size, leading, children, ...props }: ChipProps) {
  return (
    <span data-slot="chip" className={cn(chip({ variant, size }), className)} {...props}>
      {leading}
      {children}
    </span>
  );
}
