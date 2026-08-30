import type { ReactElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Chip } from './Chip';
import { CornerGlint } from './CornerGlint';
import { Dialog, DialogContent, DialogTitle } from './Dialog';
import { SpotlightContent, SpotlightMedia } from './SpotlightPanel';
import { Switch } from './Switch';

afterEach(cleanup);

/**
 * A physical utility names a side of the screen. A logical one names a side of
 * the *reading direction*: `ps-3` is padding at the start, which is the left in
 * English and the right in Arabic.
 *
 * The rule is only worth adopting if it is checked, because a single `pl-`
 * slips in without anyone noticing until a right-to-left page is opened, and
 * nobody opens one by accident. So each component is rendered in both
 * directions and the two are compared.
 *
 * `getComputedStyle` returns a **live** object, which cost a debugging round
 * here: read both directions lazily and the first snapshot silently reports the
 * second direction's values. Everything below is copied out immediately.
 */
function readIn(dir: 'ltr' | 'rtl', element: ReactElement, selector: string) {
  const container = render(<div dir={dir}>{element}</div>);
  // A portalled overlay lands at the end of <body>, outside the wrapper.
  const node = container.querySelector(selector) ?? document.querySelector(selector);
  const style = getComputedStyle(node as Element);

  return {
    paddingLeft: style.paddingLeft,
    paddingRight: style.paddingRight,
    left: style.left,
    right: style.right,
    marginLeft: style.marginLeft,
    marginRight: style.marginRight,
    transform: style.transform,
  };
}

const bothWays = (element: ReactElement, selector: string) =>
  [readIn('ltr', element, selector), readIn('rtl', element, selector)] as const;

describe('padding follows the reading direction', () => {
  it('Chip pads its leading slot at the start, whichever side that is', () => {
    const [ltr, rtl] = bothWays(<Chip leading={<span />}>Tag</Chip>, '[data-slot="chip"]');

    expect(ltr.paddingLeft).not.toBe(ltr.paddingRight);
    expect(ltr.paddingLeft).toBe(rtl.paddingRight);
    expect(ltr.paddingRight).toBe(rtl.paddingLeft);
  });

  it('SpotlightContent reserves its artwork gutter on the correct side', () => {
    const [ltr, rtl] = bothWays(<SpotlightContent />, '[data-slot="spotlight-content"]');

    expect(ltr.paddingLeft).toBe(rtl.paddingRight);
    expect(ltr.paddingRight).toBe(rtl.paddingLeft);
  });
});

describe('a transform that has to be mirrored, is', () => {
  /**
   * `transform` has no logical form, so an unmirrored thumb slides out of the
   * track in a right-to-left document. The sign lives in `styles/kirua.css`
   * keyed on `data-slot`; read here as a matrix, so deleting the rule fails
   * rather than renaming a class.
   */
  it('Switch moves its thumb towards the end, whichever side that is', () => {
    const checked = <Switch checked aria-label="On" />;
    const [ltr, rtl] = bothWays(checked, '[data-slot="switch-thumb"]');

    // matrix(a, b, c, d, tx, ty) — the fifth value is the horizontal travel.
    const travel = (transform: string) => Number(transform.split(', ')[4]);

    expect(travel(ltr.transform)).toBeGreaterThan(0);
    expect(travel(rtl.transform)).toBe(-travel(ltr.transform));
  });

  it('Switch leaves the thumb at the start when it is off', () => {
    const [ltr] = bothWays(
      <Switch checked={false} aria-label="Off" />,
      '[data-slot="switch-thumb"]',
    );

    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(ltr.transform);
  });
});

describe('insets follow the reading direction', () => {
  it('SpotlightMedia side="end" is the right in English and the left in Arabic', () => {
    const [ltr, rtl] = bothWays(<SpotlightMedia side="end" />, '[data-slot="spotlight-media"]');

    expect(ltr.right).toBe('0px');
    expect(rtl.left).toBe('0px');
  });

  it('CornerGlint top-end tucks into the opposite corner', () => {
    const [ltr, rtl] = bothWays(<CornerGlint corner="top-end" />, '[data-slot="corner-glint"]');

    expect(ltr.right).toBe('8px');
    expect(rtl.left).toBe('8px');
  });

  /**
   * `transform` is physical, so the blade's horizontal flip has to invert again
   * in a right-to-left document or the taper points the wrong way. That is the
   * one thing logical properties cannot do on their own, and the reason the
   * mirror lives in `index.css` keyed on `data-corner` rather than in the
   * component's inline style.
   */
  it('CornerGlint mirrors back, so the blade still tapers along the edge', () => {
    const [ltr, rtl] = bothWays(<CornerGlint corner="top-end" />, '[data-slot="corner-glint"]');

    // matrix(a, b, c, d, tx, ty) — `a` is the horizontal scale.
    expect(ltr.transform).toContain('matrix(-1');
    expect(rtl.transform).toContain('matrix(1');
  });
});

describe('a centred dialog is centred in both directions', () => {
  /**
   * `left-1/2` plus a translate is not direction-agnostic: in a right-to-left
   * document it resolves to `right: 50%` and the panel lands off-centre. The
   * replacement is `inset-0 m-auto`, which names no side at all.
   *
   * Asserted geometrically. `margin: auto` reports its *used* value in computed
   * style — a pixel number, not the word `auto` — so reading the declaration
   * back proves nothing.
   */
  it.each(['ltr', 'rtl'] as const)('centred in %s', (dir) => {
    render(
      <div dir={dir}>
        <Dialog open>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      </div>,
    );

    const panel = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;
    const box = panel.getBoundingClientRect();
    const offCentre = Math.abs((box.left + box.right) / 2 - window.innerWidth / 2);

    expect(offCentre).toBeLessThan(1);
  });
});
