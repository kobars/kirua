import indexCss from '@/index.css?raw';
import primitivesCss from '@/styles/tokens.primitives.css?raw';
import { describe, expect, it } from 'vitest';

/**
 * The font request lives in the host document, not in `src/index.css`. Inside
 * the stylesheet it costs three sequential round trips before text is drawn in
 * the intended face — download index.css, parse it, discover a stylesheet on
 * another origin, fetch that, only then learn the font file URLs — and it makes
 * every consumer of kirua inherit a runtime dependency on Google's CDN.
 *
 * Nothing about that is visible from inside a component, so it is asserted
 * here rather than remembered.
 */
/** Comments talk *about* `@import`, which is otherwise indistinguishable from
 *  using one. */
const withoutComments = indexCss.replace(/\/\*[\s\S]*?\*\//g, '');

describe('the stylesheet fetches nothing from another origin', () => {
  it('has no remote @import', () => {
    expect(withoutComments).not.toMatch(/@import\s+url\(\s*['"]?https?:/);
  });

  it('imports only Tailwind and its own token files', () => {
    const imports = [...withoutComments.matchAll(/@import\s+([^;]+);/g)].map(([, spec]) =>
      (spec ?? '').trim(),
    );

    expect(imports.length).toBeGreaterThan(0);
    for (const spec of imports)
      expect(spec).toMatch(/^'(tailwindcss|\.\/styles\/[\w.]+\.css)'$/);
  });
});

/**
 * kirua's main stylesheet names its typefaces and does not load them; the
 * font files come only through the separate `fonts.css` or the host. So a
 * host that loads neither must still get a working page. That is what the
 * fallback stacks are for, and it is the only thing keeping the decision safe.
 */
describe('both font stacks end in something every device has', () => {
  it.each(['display', 'text'])('--font-%s falls back to a system family', (name) => {
    const declared = primitivesCss.match(new RegExp(`--font-${name}:\\s*([^;]+);`))?.[1];

    expect(declared).toBeDefined();
    expect(declared).toMatch(/(system-ui|sans-serif)/);
  });

  it('the loaded face is the first choice, not the only one', () => {
    const display = primitivesCss.match(/--font-display:\s*([^;]+);/)?.[1] ?? '';
    expect(display.split(',').length).toBeGreaterThan(2);
  });
});
