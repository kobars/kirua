import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * One section that opens and shuts.
 *
 * `Accordion` is the many-section case and forces its children into a list
 * that shares one open value. A single disclosure — "show 3 more filters", an
 * optional block on a form — is not a list, and wrapping one item in an
 * accordion is what produces a lone `<h3>` in the outline that means nothing.
 *
 * The panel animates to its natural height because Radix publishes that height
 * as `--radix-collapsible-content-height`; the same keyframes the accordion
 * uses read it, so no component measures the DOM.
 *
 * @example
 * <Collapsible>
 *   <CollapsibleTrigger asChild><Button variant="ghost">More filters</Button></CollapsibleTrigger>
 *   <CollapsibleContent>…</CollapsibleContent>
 * </Collapsible>
 */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

export function CollapsibleContent({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className="overflow-hidden data-open:animate-collapsible-down data-closed:animate-collapsible-up"
      {...props}
    >
      <div className={cn('font-text text-body-sm text-fg-secondary', className)}>
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  );
}
