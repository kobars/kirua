import { Component, type ReactNode } from 'react';
import { AppMain, Button, Container, EmptyState } from 'kirua';

export interface SectionErrorBoundaryProps {
  /** The product the section pretends to be. */
  name: string;
  children: ReactNode;
}

/**
 * Catches a section that throws — most often its chunk failing to download,
 * after a redeploy renamed it or on a dropped connection — so the visitor gets
 * a way to retry instead of an empty document. Keyed on the section where it
 * is placed, so leaving for another section starts clean.
 *
 * A class, because only a class component can be an error boundary.
 */
export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    const { name } = this.props;
    return (
      <AppMain data-section-error="">
        <Container pad="lg">
          <EmptyState
            headingLevel="h1"
            title={`${name} did not load`}
            description="The connection may have dropped, or the site was updated after this page opened. Reloading fetches the current version."
            action={
              <>
                <Button onClick={() => window.location.reload()}>Reload</Button>
                <Button asChild variant="secondary">
                  <a href="#/">All examples</a>
                </Button>
              </>
            }
          />
        </Container>
      </AppMain>
    );
  }
}
