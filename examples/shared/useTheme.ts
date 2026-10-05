import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  /** The choice made: an explicit mode, or "follow the system". */
  preference: ThemePreference;
  /** The mode in force, with "system" resolved against the media query. */
  resolved: 'light' | 'dark';
}

/** Shared with the blocking script in `index.html`, which reads it before paint. */
const KEY = 'kirua-theme';

// One list, kept: `removeEventListener` only detaches from the list it was added to.
let media: MediaQueryList | undefined;
const query = () => (media ??= matchMedia('(prefers-color-scheme: dark)'));

function stored(): ThemePreference {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    // Refused storage (blocked cookies, a sandboxed frame) means no choice was kept.
    return 'system';
  }
}

const resolve = (preference: ThemePreference): ThemeState => ({
  preference,
  resolved:
    preference === 'dark' || (preference === 'system' && query().matches) ? 'dark' : 'light',
});

/**
 * One store for the whole document, so every control that shows or changes the
 * theme agrees: a header menu and a settings dialog on the same screen read and
 * write the same value, and an operating-system switch reaches both.
 */
let state: ThemeState | undefined;
const listeners = new Set<() => void>();

const current = () => (state ??= resolve(stored()));

function set(next: ThemeState) {
  state = next;
  document.documentElement.classList.toggle('dark', next.resolved === 'dark');
  for (const listener of listeners) listener();
}

const onSystemChange = () => {
  if (current().preference === 'system') set(resolve('system'));
};

function subscribe(listener: () => void) {
  if (listeners.size === 0) query().addEventListener('change', onSystemChange);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) query().removeEventListener('change', onSystemChange);
  };
}

function choose(preference: ThemePreference) {
  try {
    if (preference === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, preference);
  } catch {
    // The choice applies; it just does not survive a reload.
  }
  set(resolve(preference));
}

/**
 * Persist an explicit mode, or follow system changes while no choice is stored.
 * The host document sets the initial class before React mounts.
 */
export function useTheme() {
  const { preference, resolved } = useSyncExternalStore(subscribe, current);
  return { preference, resolved, choose };
}
