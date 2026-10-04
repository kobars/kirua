import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { IconButton } from './IconButton';
import { CloseIcon } from './icons';
import { sheetContentVariants } from './SheetContent.variants';

/**
 * A dialog anchored to an edge of the screen, built on the Dialog primitive so
 * focus trapping, Escape and scroll locking have one implementation.
 *
 * `side` is logical: `start` and `end` follow the reading direction. There is
 * no `top` — that is the phone's notification shade.
 *
 * @example
 * <Sheet>
 *   <SheetTrigger asChild><IconButton aria-label="Menu"><MenuIcon /></IconButton></SheetTrigger>
 *   <SheetContent side="start">
 *     <SheetTitle>Conversations</SheetTitle>
 *   </SheetContent>
 * </Sheet>
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps
  extends
    ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  showCloseButton?: boolean;
  /** Accessible name of the built-in close button. */
  closeLabel?: string;
  container?: ComponentProps<typeof DialogPrimitive.Portal>['container'];
}

export function SheetContent({
  className,
  children,
  side,
  gap,
  padding,
  scroll,
  showCloseButton = true,
  closeLabel = 'Close',
  container,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-scrim bg-scrim backdrop-blur-sm',
          'data-open:animate-fade-in data-closed:animate-fade-out',
        )}
      />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-close-button={showCloseButton ? '' : undefined}
        className={cn(
          'group/sheet',
          sheetContentVariants({ side, gap, padding, scroll }),
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="absolute inset-e-4 top-4">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * The sheet's name. Beside the built-in close button it keeps clear of it, so
 * a title that wraps on a phone runs onto a second line instead of under the
 * button.
 */
export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'font-text text-heading-md font-semibold text-fg',
        'group-data-close-button/sheet:pe-10',
        className,
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('mt-1 font-text text-body-sm text-fg-secondary', className)}
      {...props}
    />
  );
}

const footerOrientations = {
  horizontal: 'flex-wrap justify-end',
  vertical: 'flex-col items-stretch',
} as const;

export interface SheetFooterProps extends ComponentProps<'div'> {
  /**
   * `vertical` stacks full-width rows — a total above a checkout button —
   * which is what a narrow sheet on a phone has room for.
   */
  orientation?: keyof typeof footerOrientations;
}

/**
 * The sheet's last block, pushed to the bottom however short the content above.
 *
 * @example
 * <SheetFooter orientation="vertical">
 *   <DescriptionList>…</DescriptionList>
 *   <Button fullWidth>Check out</Button>
 * </SheetFooter>
 */
export function SheetFooter({
  className,
  orientation = 'horizontal',
  ...props
}: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex gap-3 pt-6', footerOrientations[orientation], className)}
      {...props}
    />
  );
}
