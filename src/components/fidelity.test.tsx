import { afterEach, describe, expect, it } from 'vitest';
import { MD, atLeast } from '@/test/viewport';
import { cleanup, render } from '@/test/render';
import { Card } from './Card';

afterEach(cleanup);

/**
 * Card padding, against what was measured in the reference file.
 *
 * Fidelity is this repository's premise, and `[FIGMA]` marks a measured value
 * so it does not drift. Radius has its own check in
 * `src/components/radius.test.tsx`; this is the padding half.
 *
 * **The comparison has to be made at the reference's width.** The reference is
 * a single desktop screen. `padding="lg"` at that width is `p-8`, 32px, against
 * a measured 31. Comparing the *mobile* step with that desktop measurement
 * makes kirua look 25-35% tighter than the reference, which it is not.
 */

const paddingOf = (padding: 'sm' | 'md' | 'lg') =>
  Number.parseFloat(
    getComputedStyle(
      render(<Card padding={padding} />).querySelector('[data-slot="card"]') as HTMLElement,
    ).paddingTop,
  );

describe('the padding the reference actually measures', () => {
  /**
   * From `35:188`, the reference's black card — the only card in the file with
   * auto layout, and therefore the only one that declares padding at all. The
   * white card `35:19` is a plain rectangle, so its 26-left / 30-top inset is
   * positional and cannot be read as a padding system.
   */
  const MEASURED_PADDING_PX = 31;

  it(`padding="lg" is within a pixel of the measured ${MEASURED_PADDING_PX}`, () => {
    // Only at the width the reference was drawn for. Below `md` there is
    // nothing to be faithful to — the file contains no narrow layout.
    if (!atLeast(MD)) return;

    expect(Math.abs(paddingOf('lg') - MEASURED_PADDING_PX)).toBeLessThanOrEqual(1);
  });

  /**
   * And the value it landed on is on the 4px grid, which is the reason it stays
   * a scale step rather than becoming an arbitrary `p-[1.9375rem]`. If this ever
   * fails while the assertion above passes, someone has honoured the pixel and
   * left the scale — a trade this system decided against, in `Card`'s own
   * comment.
   */
  it('and it is a step on the spacing scale, not an arbitrary value', () => {
    if (!atLeast(MD)) return;

    expect(paddingOf('lg')).toBe(32);
    expect(paddingOf('lg') % 4).toBe(0);
  });
});

describe('the steps below the measured one were chosen', () => {
  /**
   * Recorded as a scale rather than as fidelity, because there is no reference
   * value for them. Asserting the *shape* — ascending, all on the grid — is
   * what a chosen scale can honestly promise; asserting the exact numbers would
   * only restate the variant definition back to itself.
   */
  it('ascends, and every step sits on the 4px grid', () => {
    const steps = (['sm', 'md', 'lg'] as const).map(paddingOf);

    expect(steps[0]).toBeLessThan(steps[1] as number);
    expect(steps[1]).toBeLessThanOrEqual(steps[2] as number);
    for (const step of steps) expect(step % 4).toBe(0);
  });
});
