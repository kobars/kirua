/* oxlint-disable import/default -- Vite ?raw imports load source text, not a module. */
import primitivesCss from './tokens.primitives.css?raw';
import semanticCss from './tokens.semantic.css?raw';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import NIGHTS from './nights.json';

afterEach(cleanup);

/**
 * The night palettes are tokens, and the guarantees below are what keeps them
 * tokens: each night is written once, in the primitives, nothing else spells
 * its colours, the attribute on `.dark` really re-points the page, and a
 * swatch can show a night while the page around it is light.
 */

/** Every TypeScript source a colour could be copied into, application code included. */
const SOURCES = import.meta.glob<string>(
  ['/src/**/*.{ts,tsx}', '/examples/**/*.{ts,tsx}', '!/examples/**/dist/**'],
  { query: '?raw', import: 'default', eager: true },
);

/** `--color-<night>-<step>: #hex` for every night, in the order written. */
function ramp(night: string): Map<string, string> {
  return new Map(
    [
      ...primitivesCss.matchAll(new RegExp(`--color-${night}-(\\d+):\\s*(#[0-9a-f]{6});`, 'g')),
    ].map(([, step, hex]) => [step as string, hex as string]),
  );
}

describe('each night is written once', () => {
  it.each(NIGHTS)('%s is a ramp of seven steps in the primitives', (night) => {
    expect([...ramp(night).keys()]).toEqual(['1000', '975', '950', '900', '850', '800', '750']);
  });

  it('no night colour is spelt anywhere else', () => {
    const uses = new Map<string, number>();
    for (const night of NIGHTS)
      for (const hex of ramp(night).values()) uses.set(hex, (uses.get(hex) ?? 0) + 1);

    const css = (primitivesCss + semanticCss).toLowerCase();
    for (const [hex, ramps] of uses) {
      // Pure black is three nights' shade and the neutral ramp's last step.
      if (hex === '#000000') continue;
      expect(css.split(hex).length - 1, hex).toBe(ramps);
      for (const [file, source] of Object.entries(SOURCES))
        expect(source.toLowerCase().includes(hex), `${hex} is copied into ${file}`).toBe(false);
    }
  });
});

describe('the attribute chooses the night', () => {
  /** Resolves a token on an element, as the page would paint it. */
  const colourOf = (element: Element, token: string) => {
    const probe = document.createElement('div');
    element.appendChild(probe);
    probe.style.color = `var(${token})`;
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };

  const hexToRgb = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
    return `rgb(${r}, ${g}, ${b})`;
  };

  it.each(NIGHTS)('%s re-points the page and the card', (night) => {
    const host = render(
      <div className="dark" data-night-palette={night === NIGHTS[0] ? undefined : night} />,
    ).firstElementChild as HTMLElement;

    expect(colourOf(host, '--color-surface-page')).toBe(hexToRgb(ramp(night).get('950')!));
    expect(colourOf(host, '--color-surface-raised')).toBe(hexToRgb(ramp(night).get('900')!));
  });

  it('does nothing in light mode', () => {
    const plain = render(<div />).firstElementChild as HTMLElement;
    const graphite = render(<div data-night-palette="graphite" />)
      .firstElementChild as HTMLElement;
    expect(colourOf(graphite, '--color-surface-page')).toBe(
      colourOf(plain, '--color-surface-page'),
    );
  });

  it.each(NIGHTS)('a %s swatch shows its night on a light page', (night) => {
    const swatch = render(<span data-night-swatch={night} />).firstElementChild as HTMLElement;
    expect(colourOf(swatch, '--color-night-page')).toBe(hexToRgb(ramp(night).get('950')!));
    expect(colourOf(swatch, '--color-night-raised')).toBe(hexToRgb(ramp(night).get('900')!));
  });
});
