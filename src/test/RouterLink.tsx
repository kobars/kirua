import type { ComponentProps } from 'react';

/**
 * Stands in for a client router's link component, such as `next/link`: it
 * renders the anchor itself and handles the click, so the page never loads.
 * `data-router-link` is how a story tells this anchor from one a kirua
 * component would have rendered.
 */
export function RouterLink({ children, href, onClick, ...props }: ComponentProps<'a'>) {
  return (
    <a
      data-router-link=""
      href={href}
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
