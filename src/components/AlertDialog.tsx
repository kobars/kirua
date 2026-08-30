import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * A dialog that will not go away until the reader answers it.
 *
 * The difference from `Dialog` is not decoration. This one has no close button,
 * ignores a click on the scrim, moves initial focus to the **cancel** control
 * rather than the confirm, and is announced as `role="alertdialog"` so a screen
 * reader reads the description immediately instead of waiting to be asked.
 * Every one of those is what you want in front of a destructive action and
 * wrong everywhere else — so use `Dialog` for a form and this for "delete this
 * patient record".
 *
 * Escape still closes it. Trapping a reader in a dialog is never the answer,
 * and Escape is the same as choosing cancel.
 *
 * `AlertDialogAction` and `AlertDialogCancel` render plain buttons. Wrap them
 * in `Button` with `asChild` to give them the system's look.
 *
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger asChild><Button variant="danger">Delete</Button></AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogTitle>Delete this visit?</AlertDialogTitle>
 *     <AlertDialogDescription>The notes cannot be recovered.</AlertDialogDescription>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel asChild><Button variant="secondary">Keep</Button></AlertDialogCancel>
 *       <AlertDialogAction asChild><Button variant="danger">Delete</Button></AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export function AlertDialogContent({
  className,
  container,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content> & {
  /** See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof AlertDialogPrimitive.Portal>['container'];
}) {
  return (
    <AlertDialogPrimitive.Portal container={container}>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'fixed inset-0 z-scrim bg-scrim backdrop-blur-sm',
          'data-open:animate-fade-in data-closed:animate-fade-out',
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          // See `DialogContent`: `inset-0 m-auto` centres without naming a side.
          'fixed inset-0 z-modal m-auto h-fit',
          'max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto',
          'rounded-xl bg-raised p-8 text-fg shadow-overlay',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('font-text text-heading-md font-semibold text-fg', className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('mt-2 font-text text-body-md text-fg-secondary', className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('mt-8 flex flex-wrap justify-end gap-3', className)}
      {...props}
    />
  );
}
