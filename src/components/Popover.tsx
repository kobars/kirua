import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { NamedPanel } from './aria';

/**
 * A floating panel that may contain controls. Use this rather than `Tooltip`
 * the moment the panel holds a button, a link or a field: a tooltip is a label
 * and closes when focus moves, so its contents cannot be reached.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild><Button variant="ghost">Filters</Button></PopoverTrigger>
 *   <PopoverContent aria-label="Filters">
 *     <Field controlId="q" label="Search"><Input id="q" /></Field>
 *   </PopoverContent>
 * </Popover>
 */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

/**
 * The panel is a `role="dialog"`, which must have an accessible name.
 * `NamedPanel` requires one in the type, so the build fails rather than axe.
 */
export type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Content> &
  NamedPanel & {
    /**
     * Where the overlay is rendered. Should be an ancestor of the trigger, or
     * `document.body`.
     */
    container?: ComponentProps<typeof PopoverPrimitive.Portal>['container'];
  };

export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 8,
  container,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-popover w-72 rounded-lg border border-line-subtle bg-raised p-4',
          'font-text text-body-md text-fg shadow-overlay',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
