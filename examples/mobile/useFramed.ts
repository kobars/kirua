import { useSyncExternalStore } from 'react';

/** The `md` breakpoint, where the design system's phone-only parts hide themselves. */
const WIDE = '(min-width: 48rem)';

let media: MediaQueryList | undefined;
const query = () => (media ??= matchMedia(WIDE));

function subscribe(onChange: () => void) {
  query().addEventListener('change', onChange);
  return () => query().removeEventListener('change', onChange);
}

/** This document is the page inside a `DeviceFrame`, not the page around it. */
export const insideFrame = () => window.self !== window.top;

/**
 * Whether Pouch should show its phone preview rather than itself: a window as
 * wide as a tablet, and not already the page inside the preview. A phone, and
 * the frame's own page, get the app.
 */
export function useShowsFrame() {
  const wide = useSyncExternalStore(subscribe, () => query().matches);
  return wide && !insideFrame();
}
