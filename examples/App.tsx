import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { AppMain, Container, Spinner } from 'kirua';
import { Hub } from './Hub';
import { HUB_TITLE, SECTIONS, type SectionId } from './sections';
import { sectionOf, useHashPath } from './shared/useHashRoute';

/**
 * Each section is its own chunk, so opening one downloads that section and
 * the shared code, not the other four.
 */
const PAGES: Record<SectionId, ComponentType> = {
  shop: lazy(() => import('./shop/App').then((module) => ({ default: module.App }))),
  his: lazy(() => import('./his/App').then((module) => ({ default: module.App }))),
  social: lazy(() => import('./social/App').then((module) => ({ default: module.App }))),
  assistant: lazy(() => import('./assistant/App').then((module) => ({ default: module.App }))),
  marketing: lazy(() => import('./marketing/App').then((module) => ({ default: module.App }))),
};

/** The hub at `#/`, or the section the first segment of the hash names. */
export function App() {
  const path = useHashPath();
  const section = SECTIONS.find((candidate) => candidate.id === sectionOf(path));

  useEffect(() => {
    document.title = section?.title ?? HUB_TITLE;
    // A section is a different application: it opens at its top, not at the
    // scroll position the page before it was left at.
    window.scrollTo(0, 0);
  }, [section]);

  if (section === undefined) return <Hub />;

  const Page = PAGES[section.id];
  return (
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
    </Suspense>
  );
}
