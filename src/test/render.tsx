import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const mounted = new Set<{ root: Root; container: HTMLElement }>();

/**
 * Mounts `ui` into a fresh container attached to the real document, and returns
 * that container. Real DOM, not a simulated one — the browser is the whole
 * point of running the suite under Playwright, and a component whose styles
 * depend on `.ctx-brand` or `.dark` cannot be judged anywhere else.
 *
 * Deliberately hand-rolled rather than a testing-library dependency: mount,
 * read, unmount is all this repo needs, and the queries a library would add
 * duplicate what `container.querySelector` already does.
 */
export function render(ui: ReactNode): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  mounted.add({ root, container });
  return container;
}

/** Call from `afterEach`. Unmounting matters: a left-behind portal is found by
 *  the next test's `document.querySelector` and the failure looks unrelated. */
export function cleanup(): void {
  for (const { root, container } of mounted) {
    act(() => {
      root.unmount();
    });
    container.remove();
  }
  mounted.clear();
}
