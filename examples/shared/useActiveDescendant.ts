import { useEffect, useState, type KeyboardEvent } from 'react';

export interface ActiveDescendantOptions {
  /** How many rows the list shows now. */
  count: number;
  /** The DOM id of the row at an index, for `aria-activedescendant`. */
  idOf: (index: number) => string;
  /** Called with the highlighted row's index on Enter. */
  onPick: (index: number) => void;
  /** False while the list is closed: no row is active and keys pass through. */
  enabled?: boolean;
}

/**
 * The keyboard half of a list whose focus stays in a text field: ArrowDown and
 * ArrowUp move a highlight, Enter picks it, and the field names the highlighted
 * row through `aria-activedescendant`.
 *
 * Application state, so it lives here and not in kirua, whose components hold
 * none. The highlight is clamped to the rows that exist, so a shorter list
 * after a new query never points past its end, and the row is scrolled into
 * view, because the arrows can move it past the bottom of a list that scrolls.
 */
export function useActiveDescendant({
  count,
  idOf,
  onPick,
  enabled = true,
}: ActiveDescendantOptions) {
  const [index, setActive] = useState(0);
  const active = Math.max(0, Math.min(index, count - 1));
  const activeId = enabled && count > 0 ? idOf(active) : undefined;

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!enabled) return;
    if (event.key === 'ArrowDown') setActive(Math.max(0, Math.min(active + 1, count - 1)));
    else if (event.key === 'ArrowUp') setActive(Math.max(active - 1, 0));
    else if (event.key === 'Enter' && count > 0) onPick(active);
    else return;
    event.preventDefault();
  };

  return { active, activeId, setActive, onKeyDown };
}
