import { useEffect } from 'react';

/**
 * ⌘K on a Mac, Ctrl+K elsewhere: the key a command palette answers to. Takes
 * the palette's state setter, which React keeps stable across renders.
 */
export function useCommandShortcut(setOpen: (open: boolean) => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);
}
