import { Link, List, ListItem } from 'kirua';

export interface ErrorLinksProps {
  /** Message by the id of the control it is about. */
  errors: Record<string, string>;
}

/**
 * The entries of an error summary, each one a link that moves focus to its
 * control. The click is handled rather than followed: these apps route on the
 * hash, so `#phone` would navigate away instead of jumping to the field.
 */
export function ErrorLinks({ errors }: ErrorLinksProps) {
  return (
    <List size="sm">
      {Object.entries(errors).map(([id, message]) => (
        <ListItem key={id}>
          {/* The alert's own colour, underlined: the accent blue is measured on
              the page, not on a tinted alert. */}
          <Link
            variant="inherit"
            href={`#${id}`}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(id)?.focus();
            }}
          >
            {message}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
