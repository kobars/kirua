import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render } from '@/test/render';
import { Button } from './Button';
import { Table, TableBody, TableCell, TableCaption, TableRow } from './Table';
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
  // Let a transition the last change started begin, then wait for it to end.
  // A fixed delay read a colour part-way through on a busy machine.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await Promise.all(element.getAnimations().map((animation) => animation.finished));
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

describe('a pinned table cell takes the fill of its row', () => {
  // Dark, because there the page, raised and sunken fills all differ, so a
  // pinned cell left on the surface's fill shows as a block on a hovered row.
  for (const state of ['hovered', 'selected'] as const) {
    it(state, async () => {
      document.documentElement.classList.add('dark');
      const container = render(
        <Table surface="raised">
          <TableCaption>Visits</TableCaption>
          <TableBody>
            <TableRow data-selected={state === 'selected' ? '' : undefined}>
              <TableCell>Maria Gonzalez</TableCell>
              <TableCell sticky="end">Open</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row = container.querySelector('[data-slot="table-row"]') as HTMLElement;
      const pinned = row.lastElementChild as HTMLElement;
      const resting = await settled(pinned, 'backgroundColor');

      if (state === 'hovered') {
        await userEvent.hover(row);
        expect(row.matches(':hover')).toBe(true);
      }
      const fill = await settled(row, 'backgroundColor');
      expect(fill).not.toBe('rgba(0, 0, 0, 0)');
      expect(await settled(pinned, 'backgroundColor')).toBe(fill);
      if (state === 'hovered') expect(fill).not.toBe(resting);
    });
  }
});

describe('a hovered button still presses down', () => {
  // A mouse press is a hover too, so a hover rule that outranks the press
  // holds the button up for every click with a mouse. Space sets `:active`
  // on a focused button, which stands in for holding the mouse button.
  it('sinks below its resting position while pressed', async () => {
    const container = render(<Button>Save</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;

    await userEvent.hover(button);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(getComputedStyle(button).translate).toBe('0px -2px');

    button.focus();
    await userEvent.keyboard('{Space>}');
    expect(button.matches(':active')).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(getComputedStyle(button).translate).toBe('0px 2px');
    await userEvent.keyboard('{/Space}');
  });
});
