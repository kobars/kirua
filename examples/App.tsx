import { Suspense, useEffect } from 'react';
import { AppMain, Container, Spinner } from '@kobars/kirua';
import { Hub } from './Hub';
import { HUB_TITLE, SECTIONS } from './sections';
import { INITIAL, PAGES } from './sectionPages';
import { SectionErrorBoundary } from './shared/SectionErrorBoundary';
import { useApplyNightPalette } from './shared/useNightPalette';
import { sectionOf, useHashPath } from './shared/useHashRoute';

/** The path the previous screen was shown for; undefined until the first one. */
let shownPath: string | undefined;

/**
 * The rest of what a full page load would have done, on every change of path:
 * the document title names the new screen and focus moves to its heading, so a
 * screen reader announces the page that replaced the link that was just
 * activated rather than falling silent on `<body>`.
 *
 * Rendered after the screen and inside the same `Suspense`, so its effect runs
 * only once the screen is in the document. Every screen marks its `main` with
 * `data-route`; the title uses that screen's `h1`, except at a section's home,
 * which the section's own title already names.
 */
function RouteChange({ path, title, home }: { path: string; title: string; home: boolean }) {
  useEffect(() => {
    const screen = document.querySelector<HTMLElement>('[data-route]');
    const heading = screen?.querySelector<HTMLElement>('h1');
    const name = heading?.textContent?.trim();
    document.title = home || !name ? title : `${name} · ${title}`;

    if (shownPath === path) return;
    const first = shownPath === undefined;
    shownPath = path;
    // A first load leaves focus where the browser puts it.
    if (first) return;
    const target = heading ?? screen;
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }, [path, title, home]);

  return null;
}

/** The hub at `#/`, or the section the first segment of the hash names. */
export function App() {
  const path = useHashPath();
  useApplyNightPalette();
  const id = sectionOf(path);
  const section = SECTIONS.find((candidate) => candidate.id === id);

  // Every screen opens at its top, not at the offset the screen before it was
  // left at. Here rather than after the screen renders, so the scroll also
  // stops a wheel scroll still under way while a section downloads.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (section === undefined)
    return (
      <>
        <Hub />
        <RouteChange path={path} title={HUB_TITLE} home />
      </>
    );

  const Page = INITIAL[section.id] ?? PAGES[section.id];
  return (
    <SectionErrorBoundary key={section.id} name={section.name}>
      <Suspense
        fallback={
          <AppMain>
            <Container pad="lg">
              <Spinner label={`Loading ${section.name}`} data-section-loading="" />
            </Container>
          </AppMain>
        }
      >
        <Page />
        <RouteChange
          path={path}
          title={section.title}
          home={path.slice(section.id.length + 1) === ''}
        />
      </Suspense>
    </SectionErrorBoundary>
  );
}
