import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDownIcon } from './icons';

/**
 * Sections that open one at a time (`type="single"`) or several
 * (`type="multiple"`).
 *
 * Radix publishes the content's natural height as
 * `--radix-accordion-content-height`, which is what lets a panel animate open
 * to `auto` without a component measuring the DOM.
 *
 * `AccordionTrigger` renders its own `<h3>` so the page keeps a heading
 * outline. Pass `headingLevel` where `h3` is wrong.
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="size">
 *   <AccordionItem value="size">
 *     <AccordionTrigger>Size</AccordionTrigger>
 *     <AccordionContent>…</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b border-line-subtle', className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  headingLevel: Heading = 'h3',
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & {
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5';
}) {
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            'flex flex-1 items-center justify-between gap-3 py-4 text-start',
            'font-text text-body-md font-medium text-fg',
            'transition-colors duration-fast ease-out hover:text-fg-accent',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            '[--icon-size:var(--icon-md)]',
            // Rotation is symmetrical, so this needs no right-to-left mirror.
            '[&_svg]:transition-transform [&_svg]:duration-fast data-open:[&_svg]:rotate-180',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon className="shrink-0 text-fg-muted" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        'overflow-hidden font-text text-body-sm text-fg-secondary',
        'data-open:animate-accordion-down data-closed:animate-accordion-up',
      )}
      {...props}
    >
      <div className={cn('pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
