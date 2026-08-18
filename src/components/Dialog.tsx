import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';
import { CloseIcon } from './icons';

/**
 * Radix supplies the behaviour that is easy to get wrong and invisible when it
 * is: focus trapping, focus return to the trigger, inerting the rest of the
 * page, Escape to dismiss, scroll locking, and the `aria-labelledby` wiring.
 * This file adds appearance only.
 *
 * `DialogTitle` is required by Radix — without it the dialog has no accessible
 * name.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button>Enroll now</Button></DialogTrigger>
 *   <DialogContent>
 *     <DialogTitle>Join the class</DialogTitle>
 *     <DialogDescription>Two live sessions a week.</DialogDescription>
 *   </DialogContent>
 * </Dialog>
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * The panel itself. Everything visible is passed in as children, with one
 * exception: the close button, which the component supplies.
 *
 * That button needs an accessible name, and a name is user-visible text — so it
 * is a prop with an English default rather than a hardcoded string. kirua does
 * not own translation; it only has to stop being an obstacle to it.
 */
export function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  /** Accessible name of the built-in close button. */
  closeLabel?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-scrim backdrop-blur-sm',
          'data-open:animate-fade-in data-closed:animate-fade-out',
        )}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 -translate-1/2',
          'max-h-[calc(100vh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto',
          'rounded-xl bg-raised p-8 text-fg shadow-lg',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="absolute top-5 right-5">
              <CloseIcon size={18} />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-text text-heading-lg font-semibold text-fg', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('mt-2 font-text text-body-md text-fg-secondary', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('mt-8 flex flex-wrap justify-end gap-3', className)}
      {...props}
    />
  );
}
