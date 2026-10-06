import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { CloseIcon, GridIcon, HeartIcon, MoreIcon, SearchIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    'aria-label': 'Search the gallery',
    variant: 'ghost',
    size: 'md',
    children: <SearchIcon />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
    asChild: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An action shown as an icon alone. `aria-label` is required, because it is the only name the action has. A tooltip can add a hint, but the button must be named without it.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <IconButton {...args}>
      <SearchIcon />
    </IconButton>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} variant="primary" aria-label="Search the gallery">
        <SearchIcon />
      </IconButton>
      <IconButton {...args} variant="secondary" aria-label="Like this artwork">
        <HeartIcon />
      </IconButton>
      <IconButton {...args} variant="ghost" aria-label="Open menu">
        <GridIcon />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} size="sm" aria-label="Close">
        <CloseIcon />
      </IconButton>
      <IconButton {...args} size="md" aria-label="Close">
        <CloseIcon />
      </IconButton>
      <IconButton {...args} size="lg" aria-label="Close">
        <CloseIcon />
      </IconButton>
    </div>
  ),
};

/** The compiled rule behind a utility class, found by its escaped selector. */
function ruleFor(className: string): CSSStyleRule | undefined {
  const escaped = `.${CSS.escape(className)}`;
  const walk = (rules: CSSRuleList): CSSStyleRule | undefined => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText.startsWith(escaped)) return rule;
      if ('cssRules' in rule) {
        const found = walk((rule as CSSGroupingRule).cssRules);
        if (found) return found;
      }
    }
    return undefined;
  };
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // A cross-origin font stylesheet refuses to be read.
      continue;
    }
    const found = walk(rules);
    if (found) return found;
  }
  return undefined;
}

/**
 * A menu trigger. Radix opens the menu on pointerdown and measures the trigger
 * then, so the press scale is withheld from any popup trigger, and the trigger
 * keeps its hover fill while its menu is open.
 */
export const OpensAMenu: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} aria-label="Search">
        <SearchIcon />
      </IconButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton {...args} aria-label="More actions">
            <MoreIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const plain = canvas.getByRole('button', { name: 'Search' });
    const trigger = canvas.getByRole('button', { name: 'More actions' });

    // `:active` cannot be forced from a script, so the compiled selector is
    // tested without it: it must match a plain button and not a trigger.
    const press = ruleFor('not-aria-[haspopup]:active:scale-95');
    await expect(press?.selectorText).toMatch(/:not\(\[aria-haspopup\]\):active$/);
    const resting = (press?.selectorText ?? '').replace(/:active$/, '');
    await expect(plain.matches(resting)).toBe(true);
    await expect(trigger.matches(resting)).toBe(false);
    await expect(getComputedStyle(trigger).transitionProperty).toContain('scale');

    const closed = getComputedStyle(trigger).backgroundColor;
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The fill transitions, so it is read once the transition has run.
    await waitFor(() => expect(getComputedStyle(trigger).backgroundColor).not.toBe(closed));
    await userEvent.keyboard('{Escape}');
  },
};
