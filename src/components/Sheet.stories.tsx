import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './Sheet';

const meta = {
  title: 'Components/Sheet',
  component: SheetContent,
  args: { side: 'end' },
  argTypes: { side: { control: 'inline-radio', options: ['start', 'end', 'bottom'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A Dialog anchored to an edge — same focus trap, same scrim, same primitive. `side` is logical: start and end follow the reading direction. There is deliberately no top; that is the phone notification shade.',
      },
    },
  },
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open the cart</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetTitle>Your cart</SheetTitle>
        <SheetDescription>Two items, ready to check out.</SheetDescription>
        <SheetFooter>
          <Button fullWidth>Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * All three sides at once. `modal={false}` is required: three modal dialogs on
 * one page fight over the focus trap and mark each other `aria-hidden`.
 *
 * This is also the story that renders every `side` value, which
 * `variants.test.tsx` requires.
 */
export const Sides: Story = {
  render: (args) => (
    <div className="min-h-96">
      {(['start', 'end', 'bottom'] as const).map((side) => (
        <Sheet key={side} open modal={false}>
          <SheetContent {...args} side={side} showCloseButton={false}>
            <SheetTitle>Anchored to the {side}</SheetTitle>
            <SheetDescription>
              start and end follow the reading direction; bottom is the phone pattern.
            </SheetDescription>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  /**
   * Each panel is pinned to the edge it names, and fills the axis it spans.
   *
   * `toBeVisible()` cannot see this: it reads `display`, `visibility` and
   * `opacity`, so a `fixed` panel whose inset never applied passes it while
   * sitting at its static position — which on a real page is below the fold and
   * on a short one looks almost right. Only the geometry says so.
   */
  play: async () => {
    const panels = document.querySelectorAll('[data-slot="sheet-content"]');
    await expect(panels).toHaveLength(3);
    const [startPanel, endPanel, bottomPanel] = panels;

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const near = (a: number, b: number) => Math.abs(a - b) <= 1;

    // `waitFor`, because each side panel begins its entry animation exactly one
    // panel-width outside the viewport.
    await waitFor(async () => {
      const s = startPanel!.getBoundingClientRect();
      await expect(near(s.left, 0), `start panel left ${s.left}`).toBe(true);
      await expect(near(s.top, 0), `start panel top ${s.top}`).toBe(true);
      await expect(near(s.height, vh), `start panel height ${s.height} of ${vh}`).toBe(true);

      const e = endPanel!.getBoundingClientRect();
      await expect(near(e.right, vw), `end panel right ${e.right} of ${vw}`).toBe(true);
      await expect(near(e.top, 0), `end panel top ${e.top}`).toBe(true);
      await expect(near(e.height, vh), `end panel height ${e.height} of ${vh}`).toBe(true);

      const b = bottomPanel!.getBoundingClientRect();
      await expect(near(b.bottom, vh), `bottom panel bottom ${b.bottom} of ${vh}`).toBe(true);
      await expect(near(b.width, vw), `bottom panel width ${b.width} of ${vw}`).toBe(true);
    });
  },
};

/**
 * The panel takes focus, and Escape gives it back to the trigger.
 *
 * `waitFor` on both ends, and the reason holds for every overlay here: a
 * portalled panel is marked `data-state="open"` one commit before its children
 * commit, and focus return after Escape is asynchronous too.
 */
export const ItTrapsAndReturnsFocus: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Conversations</Button>
      </SheetTrigger>
      <SheetContent {...args} side="start">
        <SheetTitle>Conversations</SheetTitle>
        <Button size="sm" className="mt-4">
          New chat
        </Button>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Conversations' });

    await userEvent.click(trigger);
    const panel = within(document.body).getByRole('dialog');
    await waitFor(async () => {
      await expect(panel).toBeVisible();
    });
    await expect(panel.contains(document.activeElement)).toBe(true);

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
  },
};
