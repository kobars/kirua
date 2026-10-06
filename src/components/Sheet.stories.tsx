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
  tags: ['autodocs'],
  title: 'Components/Sheet',
  component: SheetContent,
  args: { side: 'end' },
  argTypes: { side: { control: 'inline-radio', options: ['start', 'end', 'bottom'] } },
  parameters: {
    docs: {
      story: { height: '560px' },
      description: {
        component:
          'A modal panel anchored to the start, end or bottom edge. Supply a title and a trigger. Start and end follow the reading direction.',
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
          <Button fullWidth>Check out</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

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

export const GapPaddingAndScroll: Story = {
  render: () => (
    <div className="min-h-96">
      <Sheet open modal={false}>
        <SheetContent side="start" gap={4} scroll showCloseButton={false} data-testid="scrolls">
          <SheetTitle>Sections</SheetTitle>
          {Array.from({ length: 40 }, (_, index) => (
            <Button key={index} variant="ghost" justify="between">
              Destination {index + 1}
            </Button>
          ))}
        </SheetContent>
      </Sheet>
      <Sheet open modal={false}>
        <SheetContent
          side="end"
          gap={6}
          padding="none"
          showCloseButton={false}
          data-testid="flush"
        >
          <SheetTitle>Edge to edge</SheetTitle>
          <SheetDescription>Content that draws its own edges.</SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  ),
  /** A sheet taller than the screen scrolls inside itself instead of running off it. */
  play: async () => {
    const scrolls = document.querySelector('[data-testid="scrolls"]') as HTMLElement;
    const flush = document.querySelector('[data-testid="flush"]') as HTMLElement;

    await expect(getComputedStyle(scrolls).overflowY).toBe('auto');
    await expect(scrolls.scrollHeight).toBeGreaterThan(scrolls.clientHeight);
    await expect(getComputedStyle(scrolls).rowGap).toBe('16px');
    await expect(getComputedStyle(flush).rowGap).toBe('24px');
    await expect(getComputedStyle(flush).paddingTop).toBe('0px');
  },
};

export const AFooterOfRowsAndATitleClearOfClose: Story = {
  render: () => (
    <div className="min-h-96">
      <Sheet open modal={false}>
        <SheetContent side="start" data-testid="sheet">
          <SheetTitle data-testid="title">A title long enough to wrap on a phone</SheetTitle>
          <SheetFooter orientation="vertical" data-testid="footer">
            <Button variant="secondary">View the cart</Button>
            <Button>Check out</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
  /**
   * The footer's rows span the sheet, and the title stops short of the close
   * button rather than running under it.
   */
  play: async () => {
    const sheet = document.querySelector<HTMLElement>('[data-testid="sheet"]')!;
    const title = document.querySelector<HTMLElement>('[data-testid="title"]')!;
    const footer = document.querySelector<HTMLElement>('[data-testid="footer"]')!;
    const close = within(sheet).getByRole('button', { name: 'Close' });

    const [first, second] = Array.from(footer.children) as HTMLElement[];
    await expect(first!.getBoundingClientRect().width).toBe(footer.clientWidth);
    await expect(second!.getBoundingClientRect().top).toBeGreaterThan(
      first!.getBoundingClientRect().bottom - 1,
    );

    // The text box, not the element: the title's end padding holds the button.
    const range = document.createRange();
    range.selectNodeContents(title);
    const text = range.getBoundingClientRect();
    const button = close.getBoundingClientRect();
    const overlaps =
      text.right > button.left &&
      text.left < button.right &&
      text.bottom > button.top &&
      text.top < button.bottom;
    await expect(overlaps).toBe(false);
  },
};
