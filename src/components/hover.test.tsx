import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render } from '@/test/render';
import { Tabs, TabsList, TabsTrigger } from './Tabs';

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove('dark');
});

/**
 * `:hover` cannot be set from a script, and a story's `userEvent` only
 * dispatches events, so these use the provider's real pointer. A hover rule
 * that overrides a selected state is invisible to every other test.
 */
const settled = async (element: Element, property: 'color' | 'backgroundColor') => {
  // Read after the colour transition, not on the first frame of it.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return getComputedStyle(element)[property];
};

describe('a hovered selected tab keeps its label colour', () => {
  for (const theme of ['light', 'dark'] as const) {
    it(theme, async () => {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      const container = render(
        <Tabs defaultValue="a">
          <TabsList aria-label="Sections">
            <TabsTrigger value="a">Details</TabsTrigger>
            <TabsTrigger value="b">Reviews</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const active = container.querySelector('[data-slot="tabs-trigger"]') as HTMLElement;
      const resting = await settled(active, 'color');

      await userEvent.hover(active);
      expect(active.matches(':hover')).toBe(true);
      expect(await settled(active, 'color')).toBe(resting);
    });
  }
});
