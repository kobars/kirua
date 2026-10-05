import { Slot, Slottable } from '@radix-ui/react-slot';
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const sizes = {
  sm: 'text-body-sm [--icon-size:var(--icon-md)]',
  md: 'text-body-md [--icon-size:var(--icon-lg)]',
} as const;

export interface WordmarkProps extends ComponentProps<'a'> {
  /** The mark, drawn in the accent colour. Decorative: the name is the text. */
  icon: ReactNode;
  /**
   * A shorter name shown below `sm` in place of the full one, for a header row
   * that also has to fit a menu button and three controls on a 320px phone.
   */
  shortName?: string;
  /**
   * Below `sm`, show the mark alone. The name stays in the accessibility tree
   * — off the screen, not removed — so a linked wordmark keeps its name.
   */
  compact?: boolean;
  size?: keyof typeof sizes;
  /**
   * Render onto the child — a router's link component — instead of an `<a>`.
   * The mark and the name are placed inside it; the child's own text is the
   * name.
   */
  asChild?: boolean;
}

/**
 * An application's mark and name, as one lockup.
 *
 * With `href` it is a link — home, usually — that keeps the colour of the
 * text around it and underlines on hover, like `Link variant="block"`.
 * Without one it is plain text.
 *
 * Known limitation, the same shape as `asChild`'s: without `href` the ref
 * reaches a `<span>` at runtime while its type stays `HTMLAnchorElement`.
 *
 * @example <Wordmark href="#/" icon={<SparkleIcon />}>Kirua</Wordmark>
 * @example
 * <Wordmark asChild icon={<SparkleIcon />}>
 *   <NextLink href="/">Kirua</NextLink>
 * </Wordmark>
 * @example
 * <Wordmark href="#/" icon={<StethoscopeIcon />} shortName="Larkspur">
 *   Larkspur · Juniper Valley
 * </Wordmark>
 */
export function Wordmark({
  icon,
  shortName,
  compact = false,
  size = 'md',
  asChild = false,
  className,
  children,
  ...props
}: WordmarkProps) {
  const Comp: ElementType = asChild ? Slot : props.href === undefined ? 'span' : 'a';
  const name = (text: ReactNode) =>
    shortName === undefined ? (
      <span data-slot="wordmark-name" className={cn('truncate', compact && 'max-sm:sr-only')}>
        {text}
      </span>
    ) : (
      <>
        <span data-slot="wordmark-name" className="truncate max-sm:hidden">
          {text}
        </span>
        <span data-slot="wordmark-short-name" className="sm:hidden">
          {shortName}
        </span>
      </>
    );
  return (
    <Comp
      data-slot="wordmark"
      className={cn(
        'relative inline-flex min-w-0 items-center gap-2 rounded-xs font-text font-semibold text-fg',
        'underline-offset-4',
        Comp !== 'span' && 'hover:underline',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        sizes[size],
        className,
      )}
      {...props}
    >
      <span data-slot="wordmark-icon" aria-hidden="true" className="flex text-fg-accent">
        {icon}
      </span>
      {asChild ? <Slottable child={children}>{name}</Slottable> : name(children)}
    </Comp>
  );
}
