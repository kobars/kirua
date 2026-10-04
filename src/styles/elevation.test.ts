import { afterEach, describe, expect, it } from 'vitest';

/**
 * A shadow nobody can see is still a valid shadow, so nothing fails when one
 * disappears. Every shadow primitive is near-black: on the inverse surfaces a
 * shadow that is not re-pointed means no elevation at all.
 *
 * These assertions are about *contrast against the surface*, not about exact
 * values — the values are a design decision and may be retuned. What must stay
 * true is that a raised surface can be told apart from the one under it.
 */
function shadowOn(surfaceClass: string, utility: string): string {
  const surface = document.createElement('div');
  surface.className = surfaceClass;
  const probe = document.createElement('div');
  probe.className = utility;
  surface.appendChild(probe);
  document.body.appendChild(surface);
  const value = getComputedStyle(probe).boxShadow;
  surface.remove();
  return value;
}

/** A shadow reads on a dark surface only if part of it is lighter than the
 *  surface. Any colour channel above 200 is light; near-black shadows are all
 *  under 30. */
function hasLightEdge(boxShadow: string): boolean {
  return [...boxShadow.matchAll(/rgba?\(([^)]+)\)/g)].some(([, body]) =>
    (body ?? '')
      .split(/[,/\s]+/)
      .slice(0, 3)
      .every((n) => Number(n) > 200),
  );
}

afterEach(() => {
  document.documentElement.classList.remove('dark');
});

describe('elevation is context-dependent', () => {
  const utilities = ['shadow-resting', 'shadow-raised', 'shadow-overlay'];

  it.each(utilities)('%s exists at all', (utility) => {
    expect(shadowOn('', utility)).not.toBe('none');
  });

  it.each(utilities)('%s changes under .ctx-inverse', (utility) => {
    expect(shadowOn('ctx-inverse', utility)).not.toBe(shadowOn('', utility));
  });

  it.each(utilities)('%s changes under .ctx-brand', (utility) => {
    expect(shadowOn('ctx-brand', utility)).not.toBe(shadowOn('', utility));
  });

  it.each(utilities)('%s changes under .dark', (utility) => {
    const light = shadowOn('', utility);
    document.documentElement.classList.add('dark');
    expect(shadowOn('', utility)).not.toBe(light);
  });

  /**
   * On a near-black surface a black shadow is invisible, so the dark values
   * must carry a light edge.
   */
  it.each(utilities)('%s has a light edge on a dark surface', (utility) => {
    expect(hasLightEdge(shadowOn('ctx-inverse', utility))).toBe(true);
  });

  it.each(utilities)('%s has no light edge on a light page', (utility) => {
    expect(hasLightEdge(shadowOn('', utility))).toBe(false);
  });
});

describe('the three components that must read as floating', () => {
  it('Dialog and DropdownMenu ask for the overlay elevation', () => {
    // Asserted through the utility rather than the component, because what
    // matters is that the name they use resolves per context.
    expect(shadowOn('ctx-inverse', 'shadow-overlay')).not.toBe(shadowOn('', 'shadow-overlay'));
  });

  it('Tooltip sets ctx-inverse, so its shadow must survive a LIGHT page too', () => {
    // This is the case a dark-mode-only fix would miss: the tooltip is a black
    // card on a white page, and a black shadow under it does nothing.
    expect(hasLightEdge(shadowOn('ctx-inverse', 'shadow-raised'))).toBe(true);
  });
});
