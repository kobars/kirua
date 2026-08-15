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

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-scrim backdrop-blur-sm',
          'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        )}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto',
          'rounded-xl bg-raised p-8 text-fg shadow-lg',
          'data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label="Close" size="sm" className="absolute right-5 top-5">
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
