import primitivesCss from '@/styles/tokens.primitives.css?raw';
import { describe, expect, it } from 'vitest';

/**
 * Spacing, breakpoints and the stacking order are declared as tokens.
 * Declaring them is half the job: a declaration that does not reach the browser
 * is worse than none,
 * because it reads as ownership the CSS does not actually have. So every one is
 * read back out of the live cascade rather than trusted.
 */
const root = () => getComputedStyle(document.documentElement);

function utilityValue(className: string, property: string): string {
  const probe = document.createElement('div');
  probe.className = className;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Reads a declared token straight out of the CSS source, so the expected value
 *  and the shipped value cannot drift apart. */
function declared(name: string): string {
  const match = primitivesCss.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match?.[1]) throw new Error(`--${name} is not declared in tokens.primitives.css`);
  return match[1].trim();
}

describe('the spacing scale is declared, not inherited', () => {
  it('--spacing is declared and reaches the document', () => {
    expect(declared('spacing')).toBe('0.25rem');
    expect(root().getPropertyValue('--spacing').trim()).toBe('0.25rem');
  });

  it('a numeric utility resolves through it', () => {
    // p-4 compiles to calc(var(--spacing) * 4) = 1rem = 16px.
    expect(utilityValue('p-4', 'padding-top')).toBe('16px');
  });
});

/**
 * `--breakpoint-*` lives in `@theme`, and Tailwind emits a theme variable only
 * where something references it. Nothing references these at runtime — they
 * exist to build media queries — so they are NOT readable from `:root`, and a
 * test that asked for them would fail while the CSS was perfectly correct.
 *
 * What can be tested is the thing that matters: the compiled media query flips
 * at exactly the declared width. The expected number is parsed out of the CSS
 * source, and the suite runs at three widths — 767, 768 and 1024 — so `md` is
 * observed off, on, and on again.
 */
describe('the breakpoints are declared, and the CSS agrees with the declaration', () => {
  const rem = 16;
  const cases = [
    ['md', 'md:p-4'],
    ['lg', 'lg:p-4'],
  ] as const;

  it.each(cases)('%s flips exactly at its declared width', (name, className) => {
    const value = declared(`breakpoint-${name}`);
    expect(value).toMatch(/rem$/);

    const px = Number.parseFloat(value) * rem;
    const applies = utilityValue(className, 'padding-top') === '16px';

    expect(applies).toBe(window.innerWidth >= px);
  });

  it('declares all five, so a consumer sees the whole scale', () => {
    for (const name of ['sm', 'md', 'lg', 'xl', '2xl']) {
      expect(declared(`breakpoint-${name}`)).toMatch(/^\d+rem$/);
    }
  });
});

/**
 * One ordered list, bottom of the screen first. The order is the assertion —
 * a number may be retuned, but a tooltip below a popover is a bug, and so is a
 * scrim above the dialog it dims.
 */
const order = [
  'base',
  'raised',
  'ornament',
  'sticky',
  'scrim',
  'modal',
  'popover',
  'tooltip',
  'toast',
] as const;

describe('the stacking order', () => {
  const layer = (name: string) => Number(root().getPropertyValue(`--z-${name}`));

  it('every named layer reaches the document', () => {
    for (const name of order) expect(Number.isNaN(layer(name))).toBe(false);
  });

  it('is strictly increasing, in the order the tokens are written', () => {
    const values = order.map(layer);
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
  });

  it('puts a tooltip above a popover, because a tooltip can label a menu item', () => {
    expect(layer('tooltip')).toBeGreaterThan(layer('popover'));
  });

  it('puts the dialog above its own scrim', () => {
    expect(layer('modal')).toBeGreaterThan(layer('scrim'));
  });

  /**
   * `@utility` rules are tree-shaken like any other utility: a layer no source
   * file names generates no CSS. A layer such as `z-sticky` or `z-toast` is
   * absent from kirua's own build until a component or a consumer writes it. Only the layers in use can be asserted here — and
   * they are, against the token they are supposed to resolve to.
   */
  it.each(['raised', 'ornament', 'scrim', 'modal', 'popover', 'tooltip'])(
    'z-%s resolves to its token',
    (name) => {
      expect(utilityValue(`z-${name}`, 'z-index')).toBe(String(layer(name)));
    },
  );
});
