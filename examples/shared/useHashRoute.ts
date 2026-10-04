import { useCallback, useEffect, useState } from 'react';

/**
 * The whole router. `location.hash` needs no dependency and no server
 * configuration, which matters because the app is deployed as a static build
 * under a relative base.
 *
 * The first segment names the section — `#/shop/orders` is the shop's
 * `orders` route — so the five sections share one document without sharing a
 * route table.
 */
const readPath = () => window.location.hash.replace(/^#\/?/, '');

/** The whole path after `#/`, section included, kept current across hash changes. */
export function useHashPath() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
}

/** The section a path belongs to: its first segment. */
export const sectionOf = (path: string) => path.split('/')[0] ?? '';

/**
 * One section's route, without its prefix, and a `navigate` that keeps the
 * prefix. A section reads and writes only its own routes.
 */
export function useHashRoute(section: string, fallback: string) {
  const path = useHashPath();
  const [head, ...rest] = path.split('/');
  const route = (head === section ? rest.join('/') : '') || fallback;

  const navigate = useCallback(
    (next: string) => {
      window.location.hash = `/${section}/${next}`;
    },
    [section],
  );

  return [route, navigate] as const;
}
