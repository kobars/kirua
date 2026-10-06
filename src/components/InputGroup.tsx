import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { inputGroupVariants } from './InputGroup.variants';

export interface InputGroupProps
  extends ComponentProps<'div'>, VariantProps<typeof inputGroupVariants> {}

/**
 * A text field with something attached to its edge — a search icon, a currency
 * symbol, a unit, a clear button.
 *
 * The border, the background and the focus state belong to the **group**, not
 * to the input: one box, one ring. `InputGroupInput` is therefore a borderless
 * input, and `Input` must not be used inside a group — two borders is exactly
 * the look this component exists to avoid.
 *
 * The group's state is read from its own descendants with `has-*`, so nothing
 * has to be told twice: disable the input and the whole box dims, set
 * `aria-invalid` on the input and the whole box turns invalid, focus the
 * input and the box draws the focus ring.
 *
 * @example
 * <InputGroup>
 *   <InputGroupAddon><SearchIcon /></InputGroupAddon>
 *   <InputGroupInput placeholder="Search orders" />
 *   <InputGroupAddon><Kbd>/</Kbd></InputGroupAddon>
 * </InputGroup>
 */
export function InputGroup({ className, size, width, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'group/input-group flex h-11 w-full items-center gap-2 rounded-md border border-field-line bg-field px-3',
        'shadow-resting transition-[border-color] duration-fast ease-out',
        'hover:border-field-line-hover',
        // The ring `Input` draws, moved to the box. Scoped to the input's own
        // slot, so a button inside an addon does not light up the whole group.
        'has-[[data-slot=input-group-input]:focus-visible]:outline-2',
        'has-[[data-slot=input-group-input]:focus-visible]:-outline-offset-1',
        'has-[[data-slot=input-group-input]:focus-visible]:outline-ring',
        'has-[input[aria-invalid=true]:focus-visible]:outline-field-line-invalid',
        'has-[input[aria-invalid=true]]:border-field-line-invalid',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-field-line-disabled',
        'has-[input:disabled]:bg-field-disabled',
        inputGroupVariants({ size, width }),
        className,
      )}
      {...props}
    />
  );
}

/**
 * The input itself. It draws nothing: no border, no background, no outline —
 * the group draws all three, and a second outline here would sit inside the
 * first.
 */
export function InputGroupInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        'size-full min-w-0 flex-1 bg-transparent font-text text-body-md text-on-field',
        'outline-none placeholder:text-placeholder',
        'disabled:cursor-not-allowed disabled:text-on-field-disabled',
        className,
      )}
      {...props}
    />
  );
}

/**
 * One edge of the group. Put it before or after `InputGroupInput` in the DOM;
 * there is no side prop, because the DOM order already says which side it is
 * on and that order is what mirrors in a right-to-left page.
 *
 * An `IconButton` at the very edge — a clear or send button — is pulled
 * outwards by half the group's padding, so its hover fill sits evenly inside
 * the box instead of 12px from one side and 6px from the other.
 */
export function InputGroupAddon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-fg-muted [--icon-size:var(--icon-sm)]',
        '[&:last-child>[data-slot=icon-button]:last-child]:-me-1.5',
        '[&:first-child>[data-slot=icon-button]:first-child]:-ms-1.5',
        'group-has-[input:disabled]/input-group:text-on-field-disabled',
        className,
      )}
      {...props}
    />
  );
}

/** Static wording inside an addon — a currency, a unit, a domain suffix. */
export function InputGroupText({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="input-group-text"
      className={cn('font-text text-body-sm whitespace-nowrap text-fg-muted', className)}
      {...props}
    />
  );
}
