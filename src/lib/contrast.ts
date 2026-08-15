/**
 * WCAG 2.1 contrast maths, so the docs can COMPUTE their accessibility claims
 * from the tokens that ship rather than restate hand-written numbers that rot.
 *
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Browsers serialise computed colours in two shapes, on different scales:
 *   `rgb(10 132 255 / 0.8)`      -> channels are 0-255
 *   `color(srgb 0.04 0.52 1 / 0.8)` -> channels are 0-1
 *
 * `color-mix()` in particular normalises to the `color()` form in current
 * browsers. Reading those 0-1 numbers as if they were 0-255 yields a near-black
 * colour and a badly wrong ratio, so the form has to be detected, not assumed.
 */
function parseComputedColor(computed: string): Rgb & { a: number } {
  const colorFn = computed.match(/^color\(\s*[a-z0-9-]+\s+(.*)\)\s*$/i);
  const body = colorFn ? colorFn[1] : computed;
  const scale = colorFn ? 255 : 1;

  const parts = body.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const [r = 0, g = 0, b = 0, a = 1] = parts;

  return { r: r * scale, g: g * scale, b: b * scale, a };
}

/**
 * Resolves anything `getComputedStyle` understands — hex, `rgb()`, `color-mix()`,
 * a `var()` reference. Alpha is composited over `backdrop`, because WCAG
 * contrast is defined on the final rendered colour, not a translucent one.
 */
export function resolveColor(value: string, backdrop: Rgb = { r: 255, g: 255, b: 255 }): Rgb {
  const probe = document.createElement('div');
  probe.style.color = value;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const { r, g, b, a } = parseComputedColor(computed);

  return {
    r: r * a + backdrop.r * (1 - a),
    g: g * a + backdrop.g * (1 - a),
    b: b * a + backdrop.b * (1 - a),
  };
}

function linearise(channel: number) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgb) {
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

export function contrastRatio(a: Rgb, b: Rgb) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/**
 * Graded for normal-size text. "Large" means 24px, or 18.66px bold — the
 * allowance the reference's display headline relies on and its 18px body copy
 * does not get.
 */
export function grade(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function formatRatio(ratio: number) {
  return `${ratio.toFixed(2)}:1`;
}
