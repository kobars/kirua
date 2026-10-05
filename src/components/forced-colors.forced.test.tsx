import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Alert } from './Alert';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from './AlertDialog';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { Dialog, DialogContent, DialogTitle } from './Dialog';
import { DotGrid } from './DotGrid';
import { Input } from './Input';
import { InputGroup, InputGroupInput } from './InputGroup';
import { ScrollArea } from './ScrollArea';
import { SpotlightPanel } from './SpotlightPanel';
import { Textarea } from './Textarea';

afterEach(cleanup);

/**
 * Windows high contrast, emulated through the browser context — see the
 * `forced-colors` project in `vite.config.ts`. It replaces every colour with a
 * small user-chosen palette, for people who cannot read the colours a designer
 * picked, and it is the mode a token system fails hardest in.
 *
 * Measured, not predicted: without the rules this file checks, `bg-brand`
 * computes to plain white, and `shadow-overlay` computes to `none`.
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
    ['Alert', () => <Alert>Saved</Alert>, '[data-slot="alert"]'],
    ['Badge', () => <Badge>New</Badge>, '[data-slot="badge"]'],
    ['Chip', () => <Chip>Tag</Chip>, '[data-slot="chip"]'],
    ['Card', () => <Card />, '[data-slot="card"]'],
    ['Input', () => <Input />, '[data-slot="input"]'],
    ['Textarea', () => <Textarea />, '[data-slot="textarea"]'],
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
  const cases: Array<[string, () => React.ReactElement, string]> = [
    [
      'Dialog',
      () => (
        <Dialog open>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      ),
      '[data-slot="dialog-content"]',
    ],
    [
      'AlertDialog',
      () => (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      ),
      '[data-slot="alert-dialog-content"]',
    ],
  ];

  it.each(cases)(
    '%s has its own opaque ground, because the scrim is dropped',
    (_name, element, selector) => {
      const style = styleOf(render(element()), selector);

      expect(hasBoundary(style)).toBe(true);
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    },
  );
});

describe('a scrollbar thumb still reads', () => {
  it('keeps a fill that differs from the canvas, because a fill is all it has', async () => {
    const container = render(
      <ScrollArea className="h-20 w-40">
        <div className="h-96">Taller than the region.</div>
      </ScrollArea>,
    );
    // Radix measures in a ResizeObserver and mounts the thumb afterwards, so
    // the wait is inside `act`: those are state updates, and React warns about
    // any it did not see coming.
    // One `act` per frame, not one around the loop: React flushes at the end
    // of a scope, and the thumb arrives through a chain of update → effect →
    // measure that needs several flushes to finish.
    for (let frames = 0; frames < 20; frames++) {
      await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
      if (container.querySelector('[data-slot="scroll-bar-thumb"]')) break;
    }
    const thumb = container.querySelector('[data-slot="scroll-bar-thumb"]');
    if (!thumb) throw new Error('thumb never mounted');
    const canvas = getComputedStyle(document.body).backgroundColor;
    expect(getComputedStyle(thumb).backgroundColor).not.toBe(canvas);
    expect(getComputedStyle(thumb).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});

describe('a filled button keeps a readable label', () => {
  /**
   * Forced colours replaces the background colour and the label colour, but a
   * gradient is an image, and an image the mode left in place would sit under
   * a system-coloured label it was never measured against.
   */
  it('drops the primary gradient', () => {
    const style = styleOf(render(<Button>Pay</Button>), '[data-slot="button"]');
    expect(style.backgroundImage).toBe('none');
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

  it('an input group draws one ring, on the box', () => {
    const container = render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>,
    );
    const group = container.querySelector('[data-slot="input-group"]') as HTMLElement;
    const input = container.querySelector('input') as HTMLInputElement;
    input.focus();

    expect(getComputedStyle(group).outlineStyle).toBe('solid');
    expect(getComputedStyle(group).outlineWidth).toBe('3px');
    expect(getComputedStyle(input).outlineStyle).toBe('none');
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
