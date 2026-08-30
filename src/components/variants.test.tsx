import { composeStories, setProjectAnnotations } from '@storybook/react-vite';
import { clsx, type ClassValue } from 'clsx';
import type { ComponentType } from 'react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as preview from '../../.storybook/preview';
import { cleanup, render } from '@/test/render';

/**
 * The coverage question for a component, answered. `vite.config.ts` enforces
 * line coverage on `src/lib` only, and extending it to `src/components` would
 * measure nothing useful: a `cva` map is one object literal that evaluates on
 * import, so every variant reads as "covered" whether or not anything ever
 * renders it. The risk worth a gate is a *variant no story shows* — invisible
 * to the axe run, the screenshots and the `play` functions, because all three
 * only see what a story puts on the page.
 *
 * So this file asks the stories directly. Every `*.variants.ts` module is
 * paired with its `*.stories.tsx`, every story is rendered once, and every
 * value of every variant axis must appear — as its full class list, on the
 * element carrying the component's `data-slot` — somewhere in that output.
 * `stories.test.ts` proves a story file exists; this proves it is complete.
 *
 * Two deliberate limits. A value whose classes are empty (`fullWidth: false`)
 * cannot be observed and is skipped, and `compoundVariants` are not checked —
 * no component declares any. Add the first one and extend this, not the
 * coverage thresholds.
 */
setProjectAnnotations([preview]);

type VariantModule = Record<string, unknown>;
type StoryModule = Parameters<typeof composeStories>[0];

const variantModules = import.meta.glob<VariantModule>('./*.variants.ts', { eager: true });
const storyModules = import.meta.glob<StoryModule>('./*.stories.tsx', { eager: true });

/** `SpotlightPanel.variants.ts` → `SpotlightPanel`. */
const baseOf = (path: string) => path.replace(/^\.\//, '').replace(/\.variants\.ts$/, '');

/** `SpotlightPanel` → `spotlight-panel`, the `data-slot` convention. */
const slotOf = (base: string) => base.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Where a variant module's stories live. Same basename, except when a
 * sub-component owns the variants: `SheetContent.variants.ts` is documented in
 * `Sheet.stories.tsx`. So try the full name, then drop one capitalised word at
 * a time.
 */
function storiesFor(base: string): string | null {
  const words = base.match(/[A-Z][a-z0-9]*/g) ?? [base];
  for (let end = words.length; end > 0; end -= 1) {
    const candidate = `./${words.slice(0, end).join('')}.stories.tsx`;
    if (candidate in storyModules) return candidate;
  }
  return null;
}

const hasVariants = (
  value: unknown,
): value is { variants: Record<string, Record<string, ClassValue>> } =>
  typeof value === 'function' && 'variants' in value;

const entries = Object.entries(variantModules).map(([path, module]) => {
  const base = baseOf(path);
  const axes = Object.values(module)
    .filter(hasVariants)
    .flatMap(({ variants }) =>
      Object.entries(variants).flatMap(([axis, values]) =>
        Object.entries(values)
          .map(([value, classes]) => ({
            axis,
            value,
            classes: clsx(classes).split(/\s+/).filter(Boolean),
          }))
          .filter(({ classes }) => classes.length > 0),
      ),
    );
  return {
    path,
    stories: storiesFor(base) ?? `./${base}.stories.tsx`,
    slot: slotOf(base),
    axes,
  };
});

describe('the glob finds the variant modules at all, so an empty run cannot pass', () => {
  it('finds more than one', () => {
    expect(entries.length).toBeGreaterThan(1);
  });
});

describe.each(entries)(
  '$path — every variant appears in $stories',
  ({ stories, slot, axes }) => {
    let rendered: Set<string>[] = [];

    beforeAll(() => {
      const module = storyModules[stories];
      if (!module) throw new Error(`${stories} does not exist`);
      for (const Story of Object.values(composeStories(module)) as ComponentType[]) {
        render(<Story />);
      }
      rendered = Array.from(document.querySelectorAll(`[data-slot="${slot}"]`)).map(
        (element) => new Set(element.classList),
      );
    });

    afterAll(cleanup);

    it(`renders at least one [data-slot="${slot}"]`, () => {
      expect(rendered.length).toBeGreaterThan(0);
    });

    it.each(axes)('$axis="$value"', ({ classes }) => {
      const shown = rendered.some((classList) => classes.every((c) => classList.has(c)));
      expect(shown, `no story renders ${slot} with ${classes.join(' ')}`).toBe(true);
    });
  },
);
