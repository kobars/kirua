import animationsCss from '@/styles/animations.css?raw';
import primitivesCss from '@/styles/tokens.primitives.css?raw';
import { describe, expect, it } from 'vitest';
import { cn } from './cn';

/**
 * Reads the token names out of the CSS that ships, so this file cannot fall
 * behind `tokens.primitives.css`. The rule in `CLAUDE.md` — add a scale name
 * there and you must list it in `cn.ts` too — is otherwise guarded by memory,
 * and the defect it prevents is silent: two conflicting classes both survive,
 * the CSS stays valid, and source order picks a winner.
 */
function tokenNames(css: string, namespace: string): string[] {
  const found = new Set<string>();
  for (const [, name] of css.matchAll(new RegExp(`--${namespace}-([a-z0-9-]+)\\s*:`, 'g'))) {
    // `--text-body-md--line-height` is a modifier on `--text-body-md`, not a
    // scale name of its own.
    if (name !== undefined && !name.includes('--')) found.add(name);
  }
  return [...found];
}

const css = primitivesCss + animationsCss;

/** namespace -> the utility prefix Tailwind generates from it. */
const scales = {
  radius: 'rounded',
  text: 'text',
  shadow: 'shadow',
  animate: 'animate',
  duration: 'duration',
} as const;

describe('cn() cancels every custom scale declared in CSS', () => {
  for (const [namespace, prefix] of Object.entries(scales)) {
    const names = tokenNames(css, namespace);

    it(`--${namespace}-* has at least two names to compare`, () => {
      expect(names.length).toBeGreaterThan(1);
    });

    it.each(names.slice(1).map((name, i) => [names[i] as string, name]))(
      `${prefix}-%s is cancelled by ${prefix}-%s`,
      (earlier, later) => {
        expect(cn(`${prefix}-${earlier}`, `${prefix}-${later}`)).toBe(`${prefix}-${later}`);
      },
    );
  }

  // `--font-*` carries two scales in one namespace: families and weights. Only
  // the families become `font-<name>` utilities.
  it('font-display is cancelled by font-text', () => {
    expect(cn('font-display', 'font-text')).toBe('font-text');
  });
});

describe('cn() keeps classes that only look like they conflict', () => {
  /**
   * The trap that cost a session: Tailwind has two `shadow-` utilities.
   * `shadow-lg` sets the whole box-shadow, `shadow-blue-500` sets only its
   * colour, and they must not cancel each other. `shadow-brand` is a complete
   * shadow, so it belongs in the first group — which only `extend.theme.shadow`
   * achieves. A `classGroups` entry leaves the ambiguity in place.
   */
  it('shadow-brand is a shadow, not a shadow colour', () => {
    expect(cn('shadow-lg', 'shadow-brand')).toBe('shadow-brand');
    expect(cn('shadow-brand', 'shadow-lg')).toBe('shadow-lg');
  });

  it('a font size does not cancel a text colour', () => {
    expect(cn('text-display-xl', 'text-fg')).toBe('text-display-xl text-fg');
  });

  it('a custom radius cancels a built-in one', () => {
    expect(cn('rounded-xl', 'rounded-pill')).toBe('rounded-pill');
  });

  it('an unrelated utility survives', () => {
    expect(cn('rounded-xl px-4', 'rounded-pill')).toBe('px-4 rounded-pill');
  });
});

describe('cn() takes what clsx takes', () => {
  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('flattens arrays and objects', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });
});
