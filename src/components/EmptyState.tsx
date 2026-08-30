import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** `title` is the visible heading here, so the native attribute — which
 * renders a browser tooltip — is removed from the surface rather than shadowed.
 * For a real tooltip, use `Tooltip`. */
export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Decorative. The title and description carry the meaning. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** One or two controls — usually the way out of the empty state. */
  action?: ReactNode;
  /** Depends where the empty state sits: `h1` for a whole page, `h2` inside one. */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4';
}

/**
 * Zero results is a screen, not a blank area. Give it an `action` — a way out
 * is the part that makes it useful.
 *
 * @example
 * <EmptyState
 *   icon={<SearchIcon size="2xl" />}
 *   title="No results for “kacamata”"
 *   description="Check the spelling, or search the whole catalogue."
 *   action={<Button variant="secondary">Clear filters</Button>}
 * />
 */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  headingLevel: Heading = 'h2',
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon !== undefined && icon !== null && (
        <span data-slot="empty-state-icon" aria-hidden="true" className="flex text-fg-muted">
          {icon}
        </span>
      )}
      <Heading
        data-slot="empty-state-title"
        className="font-text text-heading-sm font-semibold text-balance text-fg"
      >
        {title}
      </Heading>
      {description !== undefined && description !== null && (
        <p
          data-slot="empty-state-description"
          className="max-w-prose font-text text-body-sm text-pretty text-fg-secondary"
        >
          {description}
        </p>
      )}
      {action !== undefined && action !== null && (
        <div
          data-slot="empty-state-action"
          className="mt-2 flex flex-wrap justify-center gap-3"
        >
          {action}
        </div>
      )}
    </div>
  );
}
