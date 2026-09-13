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

/** Persist an explicit mode, or follow system changes while no choice is stored.
 * The host document sets the initial class before React mounts. */
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
