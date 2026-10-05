import { Button, EmptyState, SearchIcon } from 'kirua';

export interface NotFoundProps {
  /** The product the section pretends to be, for the way back. */
  name: string;
  /** The section's home, as a hash. */
  home: string;
}

/**
 * The screen for an address a section has no screen for — an old link, a
 * renamed record — rather than the section's home page passing for it.
 *
 * `data-not-found` is what the route checks look for: a route in their table
 * that lands here is a stale route, and they fail on it.
 */
export function NotFound({ name, home }: NotFoundProps) {
  return (
    <EmptyState
      data-not-found=""
      headingLevel="h1"
      icon={<SearchIcon size="2xl" />}
      title="Page not found"
      description={`Nothing in ${name} lives at this address. It may have moved, or the link may be out of date.`}
      action={
        <Button asChild variant="secondary">
          <a href={home}>Back to {name}</a>
        </Button>
      }
    />
  );
}
