import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { CARD_EDGE_PX, CARD_RADIUS_PX, PANEL_RADIUS_PX } from '@/lib/radius';
import { Card } from './Card';
import { SpotlightPanel } from './SpotlightPanel';

afterEach(cleanup);

/**
 * The radius scale is derived from one `--radius` knob, which is the point of
 * it. The cost is that two components mirror part of that scale as JavaScript
 * numbers, because `CornerGlint` computes an SVG path and no component in this
 * system may read CSS during render — that is what keeps it server-renderable.
 *
 * So the mirror has to be checked. Turning the knob without updating these
 * constants leaves the corner ornament drawn for the old radius: it still
 * renders, it just no longer sits concentric with the corner, which is exactly
 * the failure nobody notices.
 */
describe('the JavaScript radius mirrors the CSS scale', () => {
  it.each(Object.entries(CARD_RADIUS_PX))(
    'Card radius="%s" computes to %spx',
    (key, expected) => {
      const container = render(<Card radius={key as keyof typeof CARD_RADIUS_PX} />);
      const card = container.querySelector('[data-slot="card"]') as HTMLElement;

      expect(Number.parseFloat(getComputedStyle(card).borderTopLeftRadius)).toBe(expected);
    },
  );

  it('the Clay edge the ornament sits inside is the one the card draws', () => {
    const container = render(<Card />);
    const card = container.querySelector('[data-slot="card"]') as HTMLElement;

    expect(Number.parseFloat(getComputedStyle(card).borderTopWidth)).toBe(CARD_EDGE_PX);
  });

  it('SpotlightPanel’s glint radius matches its own corner', () => {
    const container = render(<SpotlightPanel />);
    const panel = container.querySelector('[data-slot="spotlight-panel"]') as HTMLElement;

    expect(Number.parseFloat(getComputedStyle(panel).borderTopLeftRadius)).toBe(
      PANEL_RADIUS_PX,
    );
  });

  it('the two measured values are the ones the reference was drawn at', () => {
    // 22px cards and nav, 32px hero panel. If the knob is retuned these move,
    // and the foundations page stops being able to claim the measurement.
    expect(CARD_RADIUS_PX.lg).toBe(22);
    expect(PANEL_RADIUS_PX).toBe(32);
  });
});
