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
  container,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  /** Accessible name of the built-in close button. */
  closeLabel?: string;
  /**
   * Where the overlay is rendered. An overlay is portalled to the end of
   * `<body>` so no ancestor's `overflow: hidden` can clip it. Pass a container
   * to send it somewhere else — into a shadow root, into a container query, or
   * into somebody else's modal.
   *
   * A prop and not a provider, on purpose: a React context needs a client
   * component, and this system ships no `"use client"` of its own. A consumer
   * who wants one container for their whole application writes their own
   * client-side wrapper around these three.
   */
  container?: ComponentProps<typeof DialogPrimitive.Portal>['container'];
}) {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
          'fixed inset-0 z-scrim bg-scrim backdrop-blur-sm',
          'data-open:animate-fade-in data-closed:animate-fade-out',
        )}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-close-button={showCloseButton ? '' : undefined}
        className={cn(
          'group/dialog',
          // `inset-0 m-auto` centres on both axes without naming a side, so the
          // panel is centred in a right-to-left document too. `left-1/2` with a
          // translate is not: it resolves to `right: 50%` and lands off-centre.
          'fixed inset-0 z-modal m-auto h-fit',
          'max-h-[calc(100vh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto',
          'rounded-xl bg-raised p-8 text-fg shadow-overlay',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="absolute inset-e-5 top-5">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * The dialog's name. Beside the built-in close button it keeps clear of it, so
 * a title that wraps on a phone runs onto a second line instead of under the
 * button.
 */
export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'font-text text-heading-lg font-semibold text-fg',
        'group-data-close-button/dialog:pe-8',
        className,
      )}
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
