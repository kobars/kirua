import { Branch as DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { IconButton } from './IconButton';
import { CloseIcon } from './icons';
import { toastVariants } from './Toast.variants';

export interface ToastViewportProps extends ComponentProps<'section'> {
  /** Names the region. Overridable, because it is user-visible text. */
  label?: string;
}

/**
 * The fixed region every toast appears in, and the live region itself — the
 * toasts inside it are not. A live region must exist in the document *before*
 * a message is inserted, or the insertion is often not announced. Render this
 * once, empty, in the application shell.
 *
 * A toast often reports on something done in a dialog that is still open, so
 * the viewport stays usable beside a modal one. `aria-live` keeps it exposed
 * while the modal hides the rest of the page from assistive technology, and
 * it is a branch of Radix's dismissable layer, so a click on a toast is not a
 * click outside the dialog and does not close it. Keyboard focus stays trapped
 * in the dialog until it closes, so a toast must never be the only way to
 * finish a task started there.
 *
 * @example
 * // In the application shell, once:
 * <ToastViewport>
 *   {toasts.map((t) => (
 *     <Toast
 *       key={t.id}
 *       status={t.status}
 *       close={<ToastClose onClick={() => dismiss(t.id)} />}
 *     >
 *       <ToastTitle>{t.title}</ToastTitle>
 *     </Toast>
 *   ))}
 * </ToastViewport>
 */
export function ToastViewport({
  className,
  label = 'Notifications',
  ...props
}: ToastViewportProps) {
  return (
    <DismissableLayerBranch asChild>
      <section
        data-slot="toast-viewport"
        aria-label={label}
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed inset-e-0 bottom-0 z-toast',
          'flex w-full max-w-100 flex-col gap-3 p-4',
          className,
        )}
        {...props}
      />
    </DismissableLayerBranch>
  );
}

export interface ToastProps extends ComponentProps<'div'>, VariantProps<typeof toastVariants> {
  /** Decorative leading icon. The title and description carry the meaning. */
  icon?: ReactNode;
  /**
   * The dismiss control, usually a `ToastClose`. A prop rather than a child,
   * because it has to sit beside the text column and not inside it.
   *
   * Anything rendered directly in `ToastViewport` is unclickable: the viewport
   * is `pointer-events-none` so it cannot swallow clicks meant for the page.
   * This slot is inside the toast, which restores them.
   */
  close?: ReactNode;
}

/**
 * One message. Only `danger` takes a role of its own, `alert`, which
 * interrupts a screen reader. The others are read by the viewport's polite
 * live region when they arrive; a `status` role here would be a second live
 * region inside the first, inserted already filled, which is the insertion
 * that often goes unannounced.
 *
 * Dismissal is the consumer's. Do not auto-dismiss a `danger` toast that is the
 * only copy of the error.
 */
export function Toast({ className, status, icon, close, children, ...props }: ToastProps) {
  return (
    <div
      data-slot="toast"
      role={status === 'danger' ? 'alert' : undefined}
      className={cn(toastVariants({ status }), className)}
      {...props}
    >
      {icon !== undefined && icon !== null && (
        <span
          data-slot="toast-icon"
          aria-hidden="true"
          className="mt-0.5 flex shrink-0 [--icon-size:var(--icon-md)]"
        >
          {icon}
        </span>
      )}
      <div data-slot="toast-content" className="min-w-0 flex-1">
        {children}
      </div>
      {close}
    </div>
  );
}

export function ToastTitle({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="toast-title"
      className={cn('text-body-md font-semibold text-current', className)}
      {...props}
    />
  );
}

export function ToastDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="toast-description"
      className={cn('mt-1 text-body-sm text-current', className)}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  label = 'Dismiss',
  ...props
}: Omit<ComponentProps<'button'>, 'aria-label'> & {
  /**
   * Accessible name of the dismiss control. `aria-label` is omitted from the
   * base props so a spread cannot widen the required name back to optional.
   */
  label?: string;
}) {
  return (
    <IconButton
      type="button"
      data-slot="toast-close"
      aria-label={label}
      size="sm"
      variant="ghost"
      className={cn('-me-1 -mt-1 shrink-0', className)}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
}
