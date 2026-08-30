import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

/** Shared with the blocking script in `index.html`, which reads it before paint. */
const KEY = 'kirua-theme';

const query = () => matchMedia('(prefers-color-scheme: dark)');

function stored(): ThemePreference {
  const value = localStorage.getItem(KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

function apply(preference: ThemePreference) {
  const dark = preference === 'dark' || (preference === 'system' && query().matches);
  document.documentElement.classList.toggle('dark', dark);
}

/**
 * The theme choice, and the one class that expresses it.
 *
 * `.dark` on the root element is the whole mechanism: kirua re-points its
 * semantic tokens under that class, so no component takes a `dark:` variant and
 * nothing here touches a colour.
 *
 * Three states, not two. "System" is the default and is stored as the *absence*
 * of a key, so a reader who never chooses follows their operating system, and
 * keeps following it when they change it later.
 *
 * The first paint is not this hook's job — `index.html` runs a blocking script
 * that reads the same key, so the page never flashes the wrong theme before
 * React mounts.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(stored);

  useEffect(() => {
    apply(preference);
    if (preference === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return;
    const media = query();
    const onChange = () => apply('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const choose = useCallback((next: ThemePreference) => setPreference(next), []);
  return { preference, choose };
}
