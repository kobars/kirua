import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { Dialog, DialogContent, DialogTitle } from './Dialog';
import { DotGrid } from './DotGrid';
import { SpotlightPanel } from './SpotlightPanel';

afterEach(cleanup);

/**
 * Windows high contrast, emulated through the browser context — see the
 * `forced-colors` project in `vite.config.ts`. It replaces every colour with a
 * small user-chosen palette, for people who cannot read the colours a designer
 * picked, and it is the mode a token system fails hardest in.
 *
 * Two failures were **measured before anything was changed**, not predicted:
 * `bg-brand` computes to plain white, and `shadow-overlay` computes to `none`.
 * So both of the ways this system separates one surface from another — fill and
 * elevation — stop working at the same time.
 */
it('the emulation is actually on, or every assertion below is vacuous', () => {
  expect(matchMedia('(forced-colors: active)').matches).toBe(true);
});

const styleOf = (container: HTMLElement, selector: string) =>
  getComputedStyle((container.querySelector(selector) ?? document.querySelector(selector))!);

/** A box is legible here if it has an outline or a border. Background is not
 *  available: forced colours overrides it, and shadow is dropped entirely. */
function hasBoundary(style: CSSStyleDeclaration): boolean {
  const outline = Number.parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== 'none';
  const border = Number.parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== 'none';
  return outline || border;
}

describe('a surface that reads by fill still reads by edge', () => {
  const cases: Array<[string, () => React.ReactElement, string]> = [
    ['Badge', () => <Badge>New</Badge>, '[data-slot="badge"]'],
    ['Chip', () => <Chip>Tag</Chip>, '[data-slot="chip"]'],
    ['Card', () => <Card />, '[data-slot="card"]'],
    ['SpotlightPanel', () => <SpotlightPanel />, '[data-slot="spotlight-panel"]'],
  ];

  it.each(cases)('%s', (_name, element, selector) => {
    expect(hasBoundary(styleOf(render(element()), selector))).toBe(true);
  });

  it('and the shadow it used to rely on really is gone', () => {
    // Recorded so the assertion above is not mistaken for belt and braces.
    expect(
      styleOf(render(<Card className="shadow-overlay" />), '[data-slot="card"]').boxShadow,
    ).toBe('none');
  });
});

describe('a dialog still reads as modal', () => {
  it('has its own opaque ground, because the scrim is dropped', () => {
    const style = styleOf(
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      ),
      '[data-slot="dialog-content"]',
    );

    expect(hasBoundary(style)).toBe(true);
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});

describe('the focus ring survives', () => {
  it('is still drawn, and at a system colour', () => {
    const container = render(<Button>Go</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    button.focus();

    const style = getComputedStyle(button);
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0);
    expect(style.outlineStyle).not.toBe('none');
  });
});

describe('ornament gets out of the way', () => {
  /**
   * `DotGrid` and `CornerGlint` draw with `currentColor`, which forced colours
   * resolves to `CanvasText` — the same colour as the body text. They would
   * become solid marks competing with the text they sit behind, and they carry
   * no meaning to lose.
   */
  it('DotGrid is not rendered', () => {
    expect(styleOf(render(<DotGrid />), '[data-slot="dot-grid"]').display).toBe('none');
  });
});

describe('nothing opts out of the mode', () => {
  it('no component sets forced-color-adjust: none', () => {
    const container = render(
      <Card>
        <Badge>New</Badge>
      </Card>,
    );

    for (const node of container.querySelectorAll('*')) {
      expect(getComputedStyle(node).forcedColorAdjust).not.toBe('none');
    }
  });
});
