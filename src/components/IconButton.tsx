import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const iconButton = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-pill',
    'transition-[background-color,color,transform] duration-200 ease-out',
    'active:scale-95',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-disabled disabled:text-on-disabled',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'border-2 border-secondary-line bg-secondary text-on-secondary hover:bg-secondary-hover',
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover',
      },
      size: {
        sm: 'size-9',
        md: 'size-11',
        /** 54px — the reference design's circular search control. */
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- [FIGMA] 54px, must not track --spacing
        lg: 'size-[3.375rem]',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButton> {
  /**
   * Required, not optional polish: an icon-only control has no text for a screen
   * reader to announce, so without this it is unusable without sight. Typed as
   * required so the build fails rather than the user.
   */
  'aria-label': string;
  asChild?: boolean;
  children: ReactNode;
}

/**
 * Use only where the icon's meaning is unambiguous (search, close, menu).
 * Otherwise use `Button` with a visible label.
 *
 * @example <IconButton aria-label="Search" variant="primary"><SearchIcon /></IconButton>
 */
export function IconButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="icon-button"
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
