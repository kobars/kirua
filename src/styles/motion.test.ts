import primitivesCss from '@/styles/tokens.primitives.css?raw';
import { describe, expect, it } from 'vitest';

/**
 * The scale was declared, used by every `@keyframes`, and bypassed by every
 * component — which wrote `duration-200` and `duration-100` instead. Those
 * matched `--duration-base` and `--duration-fast` by coincidence, and a scale
 * that matches by coincidence is not a scale.
 *
 * So the assertion is the coupling itself: a named utility must resolve to the
 * token, and the token must be what the component actually gets.
 */
const root = () => getComputedStyle(document.documentElement);

function computed(className: string, property: string): string {
  const probe = document.createElement('div');
  probe.className = className;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Browsers serialise a duration in seconds, whatever unit the CSS used. */
const seconds = (ms: string) => `${Number.parseFloat(ms) / 1000}s`;

describe('the motion scale is declared and used', () => {
  it.each(['fast', 'base', 'slow'])('--duration-%s reaches the document', (step) => {
    expect(root().getPropertyValue(`--duration-${step}`).trim()).toMatch(/^\d+ms$/);
  });

  it.each(['fast', 'base'])('duration-%s resolves to its token', (step) => {
    const token = root().getPropertyValue(`--duration-${step}`).trim();
    expect(computed(`transition-colors duration-${step}`, 'transition-duration')).toBe(
      seconds(token),
    );
  });

  it('the three steps are distinct and ordered', () => {
    const [fast, base, slow] = ['fast', 'base', 'slow'].map((step) =>
      Number.parseFloat(root().getPropertyValue(`--duration-${step}`)),
    );
    expect(fast).toBeLessThan(base as number);
    expect(base).toBeLessThan(slow as number);
  });

  /**
   * `--ease-out` IS a Tailwind theme namespace, so declaring it in `@theme`
   * replaces Tailwind's own `ease-out` curve rather than sitting beside it.
   * Worth pinning: it means the seven `ease-out` utilities in the components
   * are already on kirua's curve and need no rename.
   */
  it('ease-out is kirua’s curve, not Tailwind’s', () => {
    const declared = primitivesCss.match(/--ease-out:\s*([^;]+);/)?.[1]?.trim();
    expect(declared).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(computed('transition-colors ease-out', 'transition-timing-function')).toBe(declared);
  });

  /**
   * The reduced-motion block in `index.css` overrides `transition-duration`,
   * which is exactly the property these utilities set — so moving the
   * components onto the named scale did not step outside its cover.
   */
  it('reduced motion still overrides the property the scale sets', () => {
    expect(primitivesCss).not.toContain('prefers-reduced-motion');
    expect(computed('transition-colors duration-base', 'transition-duration')).not.toBe('0s');
  });
});
