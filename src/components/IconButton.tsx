import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { iconButtonVariants } from './IconButton.variants';

export interface IconButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof iconButtonVariants> {
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
 * `data-variant` and `data-size` mirror the props, as on `Button`, and
 * `aria-disabled="true"` takes the disabled look while staying focusable.
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
      data-variant={variant ?? 'ghost'}
      data-size={size ?? 'md'}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
