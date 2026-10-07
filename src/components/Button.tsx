import { Slot, Slottable } from '@radix-ui/react-slot';
import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './Button.variants';
import { Spinner } from './Spinner';

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /**
   * Render the styles onto the child element instead of a `<button>`, so a link
   * keeps real link semantics rather than faking one with a click handler.
   *
   * `leadingIcon` and `trailingIcon` are placed inside the child, around its
   * own content, through Radix `Slottable`.
   *
   * @example <Button asChild><a href="/signup">Start now</a></Button>
   * @example <Button asChild trailingIcon={<ArrowRightIcon />}><a href="/signup">Start now</a></Button>
   */
  asChild?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /**
   * The action is under way. The button stays focusable, which `disabled`
   * does not allow: a disabled button leaves the tab order, and the focus that
   * was on it falls to `<body>`.
   *
   * While loading it is `aria-disabled` and `aria-busy`, drops `onClick`,
   * renders as `type="button"` so Enter cannot resubmit its form, and shows a
   * spinner in place of `leadingIcon`, which keeps its width. With `asChild`
   * there is no `type` to change; the spinner still replaces `leadingIcon`.
   */
  loading?: boolean;
  /** What the spinner announces while `loading`. */
  loadingLabel?: string;
}

/**
 * `data-variant` and `data-size` mirror the props on the root. Like
 * `data-slot`, they are public: select on them, never on a utility class.
 *
 * `aria-disabled="true"` takes the disabled look and blocks the pointer, but
 * unlike `disabled` it leaves the button focusable, so Enter and Space still
 * fire a consumer's `onClick`. Guard the handler, or use `loading`, which
 * drops it.
 *
 * @example <Button variant="secondary" trailingIcon={<ArrowRightIcon />}>Join the class</Button>
 * @example <Button type="submit" loading={saving}>Save</Button>
 */
export function Button({
  className,
  variant,
  size,
  fullWidth,
  justify,
  asChild = false,
  leadingIcon,
  trailingIcon,
  loading = false,
  loadingLabel = 'Loading',
  children,
  type,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth, justify }), className);
  const shared = {
    'data-slot': 'button',
    'data-variant': variant ?? 'primary',
    'data-size': size ?? 'md',
    className: classes,
    ...(loading && { 'aria-disabled': true, 'aria-busy': true }),
  } as const;

  const leading = loading ? <Spinner label={loadingLabel} /> : leadingIcon;

  if (asChild) {
    return (
      <Slot {...shared} onClick={loading ? undefined : onClick} {...{ type, ...props }}>
        {leading}
        <Slottable>{children}</Slottable>
        {trailingIcon}
      </Slot>
    );
  }

  return (
    <button
      {...shared}
      type={loading ? 'button' : type}
      onClick={loading ? undefined : onClick}
      {...props}
    >
      {leading}
      {children}
      {trailingIcon}
    </button>
  );
}
