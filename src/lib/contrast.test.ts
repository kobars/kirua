import { describe, expect, it } from 'vitest';
import { contrastRatio, formatRatio, grade, relativeLuminance, resolveColor } from './contrast';

const white = { r: 255, g: 255, b: 255 };
const black = { r: 0, g: 0, b: 0 };

describe('relativeLuminance', () => {
  it('is 1 for white and 0 for black', () => {
    expect(relativeLuminance(white)).toBeCloseTo(1, 5);
    expect(relativeLuminance(black)).toBeCloseTo(0, 5);
  });

  it('weights green far above blue, as WCAG defines it', () => {
    const green = relativeLuminance({ r: 0, g: 255, b: 0 });
    const blue = relativeLuminance({ r: 0, g: 0, b: 255 });
    expect(green).toBeCloseTo(0.7152, 4);
    expect(blue).toBeCloseTo(0.0722, 4);
  });
});

describe('contrastRatio', () => {
  it('is 21:1 for black on white, in either order', () => {
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
  });

  it('is 1:1 for a colour against itself', () => {
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
  });

  /**
   * The two numbers the whole token architecture turns on. `blue-500` is the
   * measured brand colour and fails AA for body text against white; `blue-600`
   * is what `--color-surface-brand` points at instead. If either moves, the
   * reasoning written beside the tokens stops being true.
   */
  it('reproduces the brand-blue figures the tokens are argued from', () => {
    expect(contrastRatio(white, { r: 0x0a, g: 0x84, b: 0xff })).toBeCloseTo(3.65, 2);
    expect(contrastRatio(white, { r: 0x09, g: 0x73, b: 0xdc })).toBeCloseTo(4.67, 2);
  });
});

describe('grade', () => {
  it('grades on the WCAG boundaries, inclusive', () => {
    expect(grade(7)).toBe('AAA');
    expect(grade(4.5)).toBe('AA');
    expect(grade(3)).toBe('AA Large');
    expect(grade(2.99)).toBe('Fail');
  });
});

describe('formatRatio', () => {
  it('always shows two decimals', () => {
    expect(formatRatio(21)).toBe('21.00:1');
    expect(formatRatio(4.6666)).toBe('4.67:1');
  });
});

describe('resolveColor', () => {
  it('reads a hex value', () => {
    expect(resolveColor('#0a84ff')).toEqual({ r: 10, g: 132, b: 255 });
  });

  it('composites alpha over the backdrop, because WCAG grades the rendered colour', () => {
    expect(resolveColor('rgb(0 0 0 / 0.5)')).toEqual({ r: 127.5, g: 127.5, b: 127.5 });
    expect(resolveColor('rgb(255 255 255 / 0.5)', black)).toEqual({
      r: 127.5,
      g: 127.5,
      b: 127.5,
    });
  });

  /**
   * `color-mix()` serialises as `color(srgb 0.04 0.52 1)` — channels on 0-1, not
   * 0-255. Reading those as 0-255 gives a near-black colour and a badly wrong
   * ratio, which is why `parseComputedColor` detects the form instead of
   * assuming it. Half the docs page runs through this path.
   */
  it('reads the color() form on its own 0-1 scale', () => {
    const mixed = resolveColor('color-mix(in srgb, #ffffff 50%, #000000)');
    // Half of 255. Read as if the channels were already 0-255, this would be
    // 0.5 — a near-black colour, and a ratio out by a factor of twenty.
    expect(mixed.r).toBeCloseTo(127.5, 1);
    expect(mixed.r).toBe(mixed.g);
    expect(mixed.g).toBe(mixed.b);
  });

  it('resolves a token that ships, not just a literal', () => {
    document.documentElement.classList.remove('dark');
    const brand = resolveColor('var(--color-surface-brand)');
    expect(contrastRatio(white, brand)).toBeGreaterThanOrEqual(4.5);
  });
});
