import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MD, atLeast } from '@/test/viewport';
import { IconButton } from './IconButton';
import { NavBar } from './NavBar';
import { GridIcon, SearchIcon } from './icons';

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    'aria-label': 'Main',
    items: [
      { label: 'Home', href: '#home', current: true },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'About', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
  argTypes: { actions: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'Measured from Figma: 70px tall, 22px corner radius, pure black fill. It sets `ctx-inverse`, so any Button or IconButton passed through `actions` picks up its on-black colours with no override. It renders a real `nav` wrapping a list, because "list of 4 navigation links" is exactly what a screen reader should announce.',
      },
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <IconButton aria-label="Search the gallery" variant="primary">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="Open menu" variant="ghost">
          <GridIcon />
        </IconButton>
      </>
    ),
  },
};

/**
 * The pill has one reflow and it is easy to lose: below `md` the links are
 * left-aligned and scroll horizontally, at `md` and above they centre. The
 * suite runs at three widths, so this story asserts both sides of the switch
 * rather than whichever one the runner happened to open at.
 */
export const CentresItsLinksAtMd: Story = {
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="nav-bar"] ul');
    await expect(list).not.toBeNull();

    const justify = getComputedStyle(list as Element).justifyContent;
    await expect(justify).toBe(atLeast(MD) ? 'center' : 'flex-start');
  },
};

/**
 * **The current item is announced as current, not merely shaded.**
 *
 * `current` drives two separate things, and only one of them is visible.
 * `bg-ghost-hover` and `font-medium` say "you are here" to someone looking at
 * the pill; `aria-current="page"` is the only thing that says it to a screen
 * reader. Losing the attribute while keeping the styling is invisible in every
 * other check here — the render is identical, axe reports nothing, and the
 * screenshot matches its baseline exactly.
 *
 * The link is found by its accessible name, which is the lookup assistive
 * technology makes, rather than by a class or a `data-slot`.
 */
export const MarksTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    // Exactly one. Two would be a contradiction rather than extra emphasis, and
    // `aria-current` absent is the correct state for the rest — not `false`,
    // which some assistive technology still announces.
    for (const label of ['Portfolio', 'About', 'Contact Us']) {
      await expect(canvas.getByRole('link', { name: label })).not.toHaveAttribute(
        'aria-current',
      );
    }
  },
};
