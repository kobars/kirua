import { afterEach, describe, expect, it } from 'vitest';
import { contrastRatio, formatRatio, resolveColor, type Rgb } from '@/lib/contrast';
import { cleanup, render } from '@/test/render';

afterEach(cleanup);

/**
 * `--color-border-accent`, measured in the browser from the tokens that ship.
 *
 * It is the only edge in this system that is not grey, and it exists so a box
 * can say it belongs to the brand rather than to the page — a message a person
 * wrote, beside one a machine did. Without it a question, the model's
 * reasoning and a block of code would be three meanings wearing one
 * appearance.
 *
 * The reason this file exists rather than a comment beside the token: the four
 * values were chosen *by* their measured ratios, and a number nobody recomputes
 * drifts the first time somebody retunes the blue ramp. The near misses are the
 * argument — in light, `blue-500` clears the bar by 0.38 and `blue-400` fails
 * it at 2.70 while looking perfectly reasonable in a swatch.
 */

/**
 * **3:1, and against more than one thing.** WCAG 1.4.11 puts a non-text user
 * interface component at 3:1, and the boundary of a box that carries meaning is
 * one. The trap is treating that as a single comparison: an edge is drawn
 * between two colours, so it has to clear the bar against the surface behind it
 * *and* against the fill it encloses. A value picked against one of them alone
 * passes and still disappears on the other side.
 */
const BOUNDARY = 3;

/**
 * The surfaces a component can find itself on. `page` is bare `:root`; dark
 * mode is measured once per night palette, because each night re-points the
 * page, the card and the lines a field sits between.
 */
const CONTEXTS = [
  ['page', '', undefined],
  ['brand', 'ctx-brand', undefined],
  ['inverse', 'ctx-inverse', undefined],
  ['dark (navy)', 'dark', undefined],
  ['dark (graphite)', 'dark', 'graphite'],
  ['dark (onyx)', 'dark', 'onyx'],
  ['dark (ink)', 'dark', 'ink'],
  ['dark (carbon)', 'dark', 'carbon'],
] as const;

/**
 * Resolving inside the context is the whole point: `getComputedStyle` on a
 * probe outside it returns the `:root` value, so an audit written that way
 * measures the light palette four times and reports four passes.
 */
function inContext(contextClass: string, night?: string) {
  const host = render(<div className={contextClass} data-night-palette={night} />)
    .firstElementChild as HTMLElement;

  const read = (token: string, backdrop?: Rgb): Rgb => {
    const probe = document.createElement('div');
    host.appendChild(probe);
    probe.style.color = `var(${token})`;
    const value = getComputedStyle(probe).color;
    probe.remove();
    return resolveColor(value, backdrop);
  };

  return { read, page: read('--color-surface-page') };
}

describe.each(CONTEXTS)('on %s', (contextName, contextClass, night) => {
  it('the accent edge is visible against the page behind it', () => {
    const { read, page } = inContext(contextClass, night);
    const ratio = contrastRatio(read('--color-border-accent', page), page);

    expect(
      ratio,
      `the accent edge on ${contextName} measures ${formatRatio(ratio)} against the page, under ${BOUNDARY}:1`,
    ).toBeGreaterThanOrEqual(BOUNDARY);
  });
});

/**
 * The fill side, and why the brand context is not in this list.
 *
 * `.ctx-brand` never re-points `--color-surface-brand-subtle`, so inside a blue
 * panel that token is still the light `blue-50` — a pale box on a blue field,
 * which is not a pairing this system asks for. The accent edge there is white,
 * and its whole job is to be visible on the panel, which the test above already
 * asserts. Excluding it is the honest answer; asserting a pairing nothing draws
 * would be measuring an imaginary screen.
 */
const WITH_A_SUBTLE_FILL = CONTEXTS.filter(([name]) => name !== 'brand');

describe.each(WITH_A_SUBTLE_FILL)('on %s', (contextName, contextClass, night) => {
  it('the accent edge is visible against the fill it encloses', () => {
    const { read, page } = inContext(contextClass, night);
    const fill = read('--color-surface-brand-subtle', page);
    const ratio = contrastRatio(read('--color-border-accent', fill), fill);

    expect(
      ratio,
      `the accent edge on ${contextName} measures ${formatRatio(ratio)} against its own fill, under ${BOUNDARY}:1`,
    ).toBeGreaterThanOrEqual(BOUNDARY);
  });
});

/**
 * And that it is actually an *accent*. "Clears 3:1" is not "is not grey": the
 * neutral edges clear their own bars too, and a `--color-border-accent` that
 * quietly resolved to `--color-border-default` would pass every assertion above
 * while buying nothing. This is the one that fails if somebody flattens the
 * token back into the neutral family.
 *
 * **`border-strong` is exempt inside `.ctx-brand`, and that is not a hedge.**
 * On a blue panel the accent colour *is* white — `--color-text-accent` is white
 * there for the same reason — and white is also the strongest neutral edge
 * available. The two genuinely coincide, so asserting they differ would be
 * asserting that a blue panel has a colour it does not have. A failure there
 * would be the test being wrong, not the token.
 */
describe.each(CONTEXTS)('on %s', (contextName, contextClass, night) => {
  it('the accent edge differs from the neutral edges', () => {
    const { read, page } = inContext(contextClass, night);
    const accent = read('--color-border-accent', page);

    const neutrals = ['--color-border-subtle', '--color-border-default'];
    if (contextName !== 'brand') neutrals.push('--color-border-strong');

    for (const token of neutrals) {
      const neutral = read(token, page);
      expect(
        [accent.r, accent.g, accent.b],
        `--color-border-accent resolves to the same colour as ${token}`,
      ).not.toEqual([neutral.r, neutral.g, neutral.b]);
    }
  });
});
