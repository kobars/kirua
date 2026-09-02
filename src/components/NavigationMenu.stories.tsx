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

const meta = {
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
      description: {
        component:
          'A site header whose items open a panel of links. It renders a `<nav>` full of anchors, not a menu of commands — using `Menubar` for site navigation traps the arrow keys and is the most common way to make a header unusable.',
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
            <NavigationMenuContent>
              <div className="grid w-md grid-cols-2 gap-1">
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
            <NavigationMenuLink href="#/stores" className="px-4">
              Stores
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

/**
 * The panel holds links, not menu items. Asserted, because the two look
 * identical and behave differently for everybody who is not using a mouse: a
 * menu takes over the arrow keys, and a list of links must leave them alone.
 */
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

/**
 * The trigger says whether its panel is open, and the panel is measured into
 * the viewport rather than overflowing it. Both are invisible until they are
 * wrong: a viewport with no height clips every panel to nothing.
 */
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
