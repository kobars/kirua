import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { paneVariants } from './Pane.variants';
import { ScrollArea, type ScrollAreaProps } from './ScrollArea';

export interface PaneProps extends ComponentProps<'div'>, VariantProps<typeof paneVariants> {}

/**
 * A column that fits a height and scrolls in the middle: a conversation, a
 * thread, a list beside a detail view.
 *
 * Only `PaneBody` scrolls. The header and the footer stay where they are, so
 * the reply box is always on the screen however long the thread is.
 *
 * @example
 * <Card padding="none" clip>
 *   <Pane height="md">
 *     <PaneHeader><Avatar size="sm" /><Text inline weight="medium" tone="primary">Rin</Text></PaneHeader>
 *     <PaneBody padding="sm">
 *       <Stack as="ul" gap={2}>…</Stack>
 *     </PaneBody>
 *     <PaneFooter><InputGroup>…</InputGroup></PaneFooter>
 *   </Pane>
 * </Card>
 */
export function Pane({ height, className, ...props }: PaneProps) {
  return (
    <div data-slot="pane" className={cn(paneVariants({ height }), className)} {...props} />
  );
}

/** The fixed top row, divided from the body by a line. */
export function PaneHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="pane-header"
      className={cn(
        'flex shrink-0 items-center gap-3 border-b border-line-subtle px-3 py-2 md:px-4',
        className,
      )}
      {...props}
    />
  );
}

const bodyPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
} as const;

export interface PaneBodyProps extends ScrollAreaProps {
  /** Space between the scrolling edge and the content. */
  padding?: keyof typeof bodyPadding;
}

/**
 * The part that scrolls. A `ScrollArea`, so its scrollbar is drawn on every
 * platform and its viewport is reachable by keyboard; it takes every height
 * the header and footer leave.
 */
export function PaneBody({ padding = 'none', className, children, ...props }: PaneBodyProps) {
  return (
    <ScrollArea data-slot="pane-body" className={cn('min-h-0 flex-1', className)} {...props}>
      {padding === 'none' ? children : <div className={bodyPadding[padding]}>{children}</div>}
    </ScrollArea>
  );
}

/** The fixed bottom row: a composer, a reply box, a row of actions. */
export function PaneFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="pane-footer"
      className={cn('shrink-0 border-t border-line-subtle p-3', className)}
      {...props}
    />
  );
}
