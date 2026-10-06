import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { contrastRatio, formatRatio, resolveColor, type Rgb } from '@/lib/contrast';

afterEach(cleanup);

/**
 * Every field pair, in every surface context, measured in the browser from the
 * tokens that ship.
 *
 * A token family invented per component is how a token system stops being one
 * — and a token family invented *without* measuring is how one ships an input
 * nobody can read.
 *
 * The specific failure to look for: **`red-900` on a black surface is
 * 2.42:1.** The status ramp is always painted as a `bg`/`fg` pair, so `red-900`
 * on `red-100` is legible on any surface — but a field's validation *message*
 * sits on the surface with no paired background, and needs one half of that
 * pair alone.
 */

/**
 * Three thresholds, and using one number for all of them is the usual mistake.
 *
 * WCAG 1.4.3 puts normal text at 4.5:1 — and a **placeholder is text**, with no
 * exception written for it. WCAG 1.4.11 puts a non-text UI component at 3:1,
 * which is what the *boundary* of a control is. And 1.4.3 explicitly exempts an
 * inactive component, which is deliberate rather than an oversight: a disabled
 * control has to look unavailable.
 */
const TEXT = 4.5;
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
 * Resolving inside the context is the whole point. `getComputedStyle` on a
 * probe outside it returns the `:root` value, so an audit written that way
 * measures the light palette four times and reports four passes.
 *
 * Alpha has to composite over something real, too: several of these tokens are
 * `color-mix(… transparent)`, and WCAG contrast is defined on the final
 * rendered colour. The backdrop is the context's own page surface.
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

  const page = read('--color-surface-page');
  return { read, page };
}

interface Pair {
  name: string;
  foreground: string;
  background: string;
  /** Which surface the foreground is painted on, when it is not the field. */
  on?: 'page';
  minimum: number;
}

/**
 * `border` is compared against the **field**, not the page: the boundary WCAG
 * 1.4.11 cares about is the one between the control and its own fill. The
 * validation message is the one token compared against the page, because that
 * is where it is drawn.
 */
const PAIRS: Pair[] = [
  {
    name: 'text on the field',
    foreground: '--color-field-fg',
    background: '--color-field-bg',
    minimum: TEXT,
  },
  {
    name: 'placeholder on the field',
    foreground: '--color-field-placeholder',
    background: '--color-field-bg',
    minimum: TEXT,
  },
  {
    name: 'the resting border against the field',
    foreground: '--color-field-border',
    background: '--color-field-bg',
    minimum: BOUNDARY,
  },
  {
    name: 'the hover border against the field',
    foreground: '--color-field-border-hover',
    background: '--color-field-bg',
    minimum: BOUNDARY,
  },
  {
    name: 'the invalid border against the field',
    foreground: '--color-field-border-invalid',
    background: '--color-field-bg',
    minimum: BOUNDARY,
  },
  {
    name: 'the focus ring against the field it covers',
    foreground: '--color-field-focus-ring',
    background: '--color-field-bg',
    minimum: BOUNDARY,
  },
  {
    name: 'the focus ring against the surface beside it',
    foreground: '--color-field-focus-ring',
    background: '--color-surface-page',
    on: 'page',
    minimum: BOUNDARY,
  },
  {
    name: 'the validation message on the surface',
    foreground: '--color-field-fg-invalid',
    background: '--color-surface-page',
    on: 'page',
    minimum: TEXT,
  },
  {
    name: 'text on a selected row',
    foreground: '--color-field-selected-fg',
    background: '--color-field-selected-bg',
    minimum: TEXT,
  },
];

describe.each(CONTEXTS)('on %s', (contextName, contextClass, night) => {
  it.each(PAIRS.map((pair) => [pair.name, pair] as const))('%s', (_label, pair) => {
    const { read, page } = inContext(contextClass, night);

    // Composite a translucent token over the surface it is really drawn on.
    const background = read(pair.background, page);
    const foreground = read(pair.foreground, pair.on === 'page' ? page : background);
    const ratio = contrastRatio(foreground, background);

    expect(
      ratio,
      `${pair.name} on ${contextName} measures ${formatRatio(ratio)}, under ${pair.minimum}:1`,
    ).toBeGreaterThanOrEqual(pair.minimum);
  });
});

describe('the exemption is recorded rather than assumed', () => {
  /**
   * Disabled pairs are **not** asserted against a threshold — WCAG 1.4.3
   * exempts an inactive component, and a disabled field that met 4.5:1 would
   * look enabled. What is asserted is that the tokens exist and resolve, so an
   * exemption cannot quietly become a missing variable.
   */
  it.each(CONTEXTS)('%s declares the disabled trio', (_name, contextClass, night) => {
    const { read, page } = inContext(contextClass, night);

    for (const token of [
      '--color-field-bg-disabled',
      '--color-field-fg-disabled',
      '--color-field-border-disabled',
    ]) {
      const { r, g, b } = read(token, page);
      expect([r, g, b].every(Number.isFinite), `${token} did not resolve`).toBe(true);
    }
  });

  /**
   * And that disabled really does read as *less* prominent than resting. This
   * is the assertion the exemption above would otherwise let slip: "exempt from
   * a minimum" is not "free to be anything".
   */
  it.each(CONTEXTS)(
    '%s makes disabled text quieter than enabled text',
    (_name, contextClass, night) => {
      const { read, page } = inContext(contextClass, night);
      const field = read('--color-field-bg', page);

      const enabled = contrastRatio(read('--color-field-fg', field), field);
      const disabled = contrastRatio(read('--color-field-fg-disabled', field), field);

      expect(disabled).toBeLessThan(enabled);
    },
  );
});
