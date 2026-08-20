import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './Button.variants';

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /**
   * Render the styles onto the child element instead of a `<button>`, so a link
   * keeps real link semantics rather than faking one with a click handler.
   *
   * Radix `Slot` merges onto exactly one child, so the icon props are ignored
   * here — compose icons inside the child.
   *
   * @example <Button asChild><a href="/signup">Start now</a></Button>
   */
  asChild?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/**
 * @example <Button variant="secondary" trailingIcon={<ArrowRightIcon />}>Enroll</Button>
 */
export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (asChild) {
    return (
      <Slot data-slot="button" className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button data-slot="button" className={classes} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
