import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './NavigationMenu';
import { MD, atLeast } from '@/test/viewport';

const meta = {
  tags: ['autodocs'],
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    a11y: {
      // Radix renders a pair of `<span aria-hidden tabindex="0">` focus proxies
      // beside an open panel. They are how Tab moves from the trigger into the
      // panel and back out, and axe reports them as `aria-hidden-focus` — an
      // element cannot be both hidden and focusable.
      //
      // It is a real finding about a real node, and the node is the vendor's.
      // Nothing in this file can remove it without removing the keyboard path
      // it exists to provide, so the one rule is turned off here rather than
      // the whole run. Re-check it when Radix ships a fix.
      config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] },
    },
    docs: {
      story: { height: '400px' },
      description: {
        component:
          'Site navigation with panels of links. Use clear link destinations and labels. Menubar and DropdownMenu are intended for commands.',
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex h-72 justify-center pt-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
            <NavigationMenuContent width="md">
              <div className="grid grid-cols-2 gap-1">
                <NavigationMenuLink href="#/bags">
                  <span className="font-medium">Bags</span>
                  <span className="text-caption text-fg-muted">Totes, slings, backpacks</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#/shoes">
                  <span className="font-medium">Shoes</span>
                  <span className="text-caption text-fg-muted">Canvas and leather</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#/outerwear">
                  <span className="font-medium">Outerwear</span>
                  <span className="text-caption text-fg-muted">Denim and shells</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#/accessories">
                  <span className="font-medium">Accessories</span>
                  <span className="text-caption text-fg-muted">Caps, belts, glasses</span>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Stories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex w-72 flex-col gap-1">
                <NavigationMenuLink href="#/makers">Meet the makers</NavigationMenuLink>
                <NavigationMenuLink href="#/repairs">Repairs and care</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink variant="top" href="#/stores">
              Stores
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A link in the row is the triggers' height, not a panel tile's.
    await expect(
      canvas.getByRole('link', { name: 'Stores' }).getBoundingClientRect().height,
    ).toBe(canvas.getByRole('button', { name: 'Catalogue' }).getBoundingClientRect().height);
    canvas.getByRole('button', { name: 'Catalogue' }).focus();

    // A trigger and a plain link each draw the ring when reached from the
    // keyboard.
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'Stories' });
    await expect(trigger).toHaveFocus();
    await expect(getComputedStyle(trigger).outlineStyle).toBe('solid');

    await userEvent.tab();
    const link = canvas.getByRole('link', { name: 'Stores' });
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).outlineStyle).toBe('solid');
    await expect(getComputedStyle(link).outlineWidth).toBe('2px');
  },
};

export const ThePanelHoldsLinks: Story = {
  render: () => (
    <div className="flex h-72 justify-center pt-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex w-72 flex-col gap-1">
                <NavigationMenuLink href="#/bags">Bags</NavigationMenuLink>
                <NavigationMenuLink href="#/shoes">Shoes</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Catalogue' }));

    await waitFor(async () => {
      await expect(screen.getByRole('link', { name: 'Bags' })).toBeVisible();
    });
    await expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await expect(screen.getByRole('link', { name: 'Bags' })).toHaveAttribute('href', '#/bags');
  },
};

export const TheViewportTakesThePanelsHeight: Story = {
  render: () => (
    <div className="flex h-72 justify-center pt-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Stories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex w-72 flex-col gap-1">
                <NavigationMenuLink href="#/makers">Meet the makers</NavigationMenuLink>
                <NavigationMenuLink href="#/repairs">Repairs and care</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Stories' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const viewport = canvasElement.querySelector(
      '[data-slot="navigation-menu-viewport"]',
    ) as HTMLElement;

    await waitFor(async () => {
      await expect(viewport.getBoundingClientRect().height).toBeGreaterThan(40);
    });
  },
};

export const APanelOfAFixedWidth: Story = {
  render: () => (
    <div className="flex h-72 justify-center pt-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
            <NavigationMenuContent width="md">
              <div className="grid grid-cols-2 gap-1">
                <NavigationMenuLink href="#/bags">Bags</NavigationMenuLink>
                <NavigationMenuLink href="#/shoes">Shoes</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
  /** 28rem from `md` up, whatever the menu's own width was before Radix measured it. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Catalogue' }));
    // Measured once the panel has finished scaling in, not mid-animation.
    const expected = atLeast(MD) ? 448 : null;
    await waitFor(() => {
      const content = canvasElement.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-content"]',
      );
      expect(content).not.toBeNull();
      const width = Math.round(content!.getBoundingClientRect().width);
      expect(expected === null || width === expected).toBe(true);
    });
  },
};
