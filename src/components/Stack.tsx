import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { stackVariants } from './Stack.variants';

/** The elements a column of blocks can honestly be. */
export type StackElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'form'
  | 'output'
  | 'ul'
  | 'ol'
  | 'li'
  | 'blockquote'
  | 'figure';

export type StackProps<T extends StackElement = 'div'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof stackVariants> & {
    /**
     * The element to render. The layout is the same for every one of them, so
     * pick the one that says what the block is: a `form`, a list, an `output`
     * that announces a loading state.
     */
    as?: T;
  };

/**
 * Blocks one under another, with one gap between them.
 *
 * The parent owns the spacing, never a child's margin: a `mt-3` on the third
 * paragraph is a rule only that paragraph knows, and it goes wrong the day the
 * order changes.
 *
 * Children shrink below their content width — the column is `minmax(0,1fr)` —
 * so a wide table inside scrolls in its own box rather than widening the page.
 *
 * @example
 * <Stack as="form" gap={4} align="start" onSubmit={save}>
 *   <Field controlId="name" label="Name"><Input /></Field>
 *   <Button type="submit">Save</Button>
 * </Stack>
 */
export function Stack<T extends StackElement = 'div'>({
  as,
  gap,
  align,
  className,
  ...props
}: StackProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'div') as 'div';
  return (
    <Comp
      data-slot="stack"
      className={cn(stackVariants({ gap, align }), className)}
      {...(props as ComponentProps<'div'>)}
    />
  );
}
