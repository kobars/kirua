import { Button, ChevronStartIcon, Visible } from '@kobars/kirua';

/**
 * The way back to the hub, first in every section's header. From `md` up it
 * says so in words; below that the arrow is all the header has room for, and
 * `aria-label` keeps the same name for a screen reader.
 */
export function AllExamplesLink() {
  return (
    <Button asChild variant="ghost" size="sm" aria-label="All examples">
      <a href="#/">
        <ChevronStartIcon />
        <Visible from="md">All examples</Visible>
      </a>
    </Button>
  );
}
