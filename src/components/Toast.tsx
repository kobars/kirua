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
    <section
      data-slot="toast-viewport"
      aria-label={label}
      className={cn(
        'pointer-events-none fixed inset-e-0 bottom-0 z-toast',
        'flex w-full max-w-100 flex-col gap-3 p-4',
        className,
      )}
      {...props}
    />
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
 * One message. `role` follows the status: `alert` interrupts a screen reader,
 * `status` waits for a pause, so only `danger` interrupts.
 *
 * Dismissal is the consumer's. Do not auto-dismiss a `danger` toast that is the
 * only copy of the error.
 */
export function Toast({ className, status, icon, close, children, ...props }: ToastProps) {
  return (
    <div
      data-slot="toast"
      role={status === 'danger' ? 'alert' : 'status'}
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
