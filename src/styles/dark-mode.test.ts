import indexHtml from '../../index.html?raw';
import semanticCss from '@/styles/tokens.semantic.css?raw';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  document.documentElement.classList.remove('dark');
});

const pageColour = () => {
  const probe = document.createElement('div');
  probe.className = 'bg-page';
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return value;
};

describe('dark mode is a class on the document, and nothing else', () => {
  it('re-points the page surface', () => {
    const light = pageColour();
    document.documentElement.classList.add('dark');
    expect(pageColour()).not.toBe(light);
  });

  /**
   * There is deliberately no bare `@media (prefers-color-scheme: dark)` block.
   * A consumer offering a three-way light/dark/system control could then never
   * render light on a machine set to dark, because a media query cannot be
   * turned off from inside the page. The preference is read by the head
   * snippet instead — one decision, in the one place that runs before paint.
   */
  /**
   * The browser draws scrollbars, autofill and the native date and time
   * pickers itself, and reads only `color-scheme` to pick their palette.
   */
  it('tells the browser which scheme its own widgets should use', () => {
    const root = document.documentElement;
    expect(getComputedStyle(root).colorScheme).toBe('light');

    const inverse = document.createElement('div');
    inverse.className = 'ctx-inverse';
    document.body.appendChild(inverse);
    expect(getComputedStyle(inverse).colorScheme).toBe('dark');
    inverse.remove();

    root.classList.add('dark');
    expect(getComputedStyle(root).colorScheme).toBe('dark');
  });

  it('does not re-point tokens from a media query', () => {
    const withoutComments = semanticCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(withoutComments).not.toContain('prefers-color-scheme');
  });
});

/**
 * The flash of the wrong theme happens before React exists, so no component can
 * fix it. What fixes it is a blocking inline script in the document head — and
 * "blocking" is the whole property, so it is asserted rather than trusted.
 */
describe('the host document decides the theme before first paint', () => {
  const head = indexHtml.slice(0, indexHtml.indexOf('</head>'));
  const script = head.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

  it('has an inline script in the head', () => {
    expect(script).not.toBe('');
  });

  it('is blocking — no defer, no async, no src', () => {
    expect(head).toMatch(/<script>\s*\(\(\)/);
    expect(head).not.toMatch(/<script[^>]*(defer|async|src=)/);
  });

  it('reads the stored choice first and the system preference second', () => {
    expect(script).toContain('localStorage');
    expect(script).toContain('prefers-color-scheme');
    // A stored 'light' must win over a system set to dark, or the three-way
    // control this design exists for does not work.
    expect(script).toContain("'light'");
  });

  it('sets the class on the documentElement, which is the documented API', () => {
    expect(script).toContain('documentElement');
    expect(script).toContain("'dark'");
  });
});
