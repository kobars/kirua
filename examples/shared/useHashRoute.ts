import { useCallback, useEffect, useState } from 'react';

/**
 * The whole router. `location.hash` needs no dependency and no server
 * configuration, which matters because each app is deployed as a static build
 * under a relative base.
 */
export function useHashRoute(fallback: string) {
  const read = useCallback(
    () => window.location.hash.replace(/^#\/?/, '') || fallback,
    [fallback],
  );
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [read]);

  const navigate = useCallback((next: string) => {
    window.location.hash = `/${next}`;
  }, []);

  return [route, navigate] as const;
}
