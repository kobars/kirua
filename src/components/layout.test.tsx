import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Card } from './Card';
import { Carousel, CarouselItem } from './Carousel';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ContextMenu';
import { DotGrid } from './DotGrid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { Grid } from './Grid';
import { Inline } from './Inline';
import { CheckIcon, StarIcon } from './icons';
import { List, ListItem } from './List';
import { MessageBubble } from './MessageBubble';
import { Sidebar, SidebarFooter, SidebarHeader } from './Sidebar';
import { Spinner } from './Spinner';
import { Split } from './Split';
import { SpotlightContent, SpotlightMedia, SpotlightPanel } from './SpotlightPanel';
import { Stack } from './Stack';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { Visible } from './Visible';
import { VisuallyHidden } from './VisuallyHidden';

afterEach(cleanup);

// The prop contract for these components — ref, className and attributes on
// the data-slot root — is asserted with every other component's in
// `contract.test.tsx`.

describe('`as` changes the element and nothing else', () => {
  it('Stack renders the element it is given, and the ref is that element', () => {
    const ref = createRef<HTMLFormElement>();
    render(<Stack as="form" ref={ref} noValidate aria-label="Profile" />);
    expect(ref.current?.tagName).toBe('FORM');
    expect(ref.current?.noValidate).toBe(true);
    expect(ref.current).toHaveAttribute('data-slot', 'stack');
  });

  it('Inline, Grid and MessageBubble render a list and its items', () => {
    const container = render(
      <>
        <Inline as="ul">
          <li>One</li>
        </Inline>
        <Grid as="ol">
          <li>Two</li>
        </Grid>
        <Stack as="ul">
          <MessageBubble as="li">Three</MessageBubble>
        </Stack>
      </>,
    );
    expect(container.querySelector('ul[data-slot="inline"]')).not.toBeNull();
    expect(container.querySelector('ol[data-slot="grid"]')).not.toBeNull();
    expect(container.querySelector('li[data-slot="message-bubble"]')).not.toBeNull();
  });
});

describe('Visible renders no element of its own', () => {
  it('puts its classes on an element child, which keeps its own data-slot', () => {
    const container = render(
      <Visible below="md" print={false}>
        <span data-slot="badge">3</span>
      </Visible>,
    );
    const child = container.firstElementChild!;
    expect(child).toHaveAttribute('data-slot', 'badge');
    expect(child).toHaveClass('md:hidden', 'print:hidden');
  });

  it('wraps a bare string in a span, the one case that carries its own slot', () => {
    const container = render(<Visible from="sm">Show</Visible>);
    const span = container.firstElementChild!;
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveAttribute('data-slot', 'visible');
    expect(span).toHaveClass('max-sm:hidden');
  });
});

describe('VisuallyHidden with asChild', () => {
  it('hides the child itself and leaves its data-slot alone', () => {
    const container = render(
      <VisuallyHidden asChild>
        <output data-slot="status">Copied</output>
      </VisuallyHidden>,
    );
    const output = container.querySelector('output')!;
    expect(output).toHaveAttribute('data-slot', 'status');
    expect(output).toHaveClass('sr-only');
    expect(output.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  });
});

describe('new props on existing components', () => {
  it('an icon takes a tone and still merges a consumer class', () => {
    const container = render(<StarIcon tone="warning" className="consumer-class" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('text-warning-solid', 'consumer-class');
  });

  it('an icon with no tone and no class renders no class attribute', () => {
    const container = render(<StarIcon />);
    expect(container.querySelector('svg')!.hasAttribute('class')).toBe(false);
  });

  it('Spinner follows its size step instead of the surrounding control', () => {
    const container = render(<Spinner size="sm" />);
    const svg = container.querySelector('svg')!;
    expect(Math.round(svg.getBoundingClientRect().width)).toBe(16);
  });

  it('a menu item can be marked as destructive, in both menus', () => {
    render(
      <>
        <DropdownMenu open>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent width="md" aria-label="Post">
            <DropdownMenuItem variant="danger">Delete post</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ContextMenu>
          <ContextMenuTrigger>Area</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem variant="danger">Remove</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </>,
    );
    const danger = document.querySelector(
      '[data-slot="dropdown-menu-item"][data-variant="danger"]',
    );
    const plain = document.querySelector(
      '[data-slot="dropdown-menu-item"][data-variant="default"]',
    );
    const content = document.querySelector('[data-slot="dropdown-menu-content"]')!;

    expect(danger).toHaveClass('text-danger-fg');
    expect(plain).not.toHaveClass('text-danger-fg');
    expect(Math.round(content.getBoundingClientRect().width)).toBe(224);
  });

  it('a carousel reserves focus-ring room, and an item takes a size step', () => {
    const container = render(
      <Carousel label="Photos" inset>
        <CarouselItem size="md">One</CarouselItem>
      </Carousel>,
    );
    const track = container.querySelector('[data-slot="carousel"]')!;
    const item = container.querySelector('[data-slot="carousel-item"]')!;
    expect(getComputedStyle(track).paddingTop).toBe('4px');
    expect(item.getBoundingClientRect().width).toBeLessThanOrEqual(320);
  });

  it('a list item with an icon keeps the icon decorative and on the first line', () => {
    const container = render(
      <List variant="plain">
        <ListItem icon={<CheckIcon />}>
          Unlimited galleries, and a long line that wraps
        </ListItem>
      </List>,
    );
    const item = container.querySelector('[data-slot="list-item"]')!;
    const mark = item.firstElementChild!;
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(getComputedStyle(item).display).toBe('flex');
  });

  it('DotGrid pins into a corner of its positioned ancestor', () => {
    const container = render(
      <Card padding="none" className="h-40">
        <DotGrid placement="bottom-start" tone="muted" />
      </Card>,
    );
    const grid = container.querySelector('[data-slot="dot-grid"]')!;
    const card = container.querySelector('[data-slot="card"]')!;
    expect(getComputedStyle(grid).position).toBe('absolute');
    // Measured from the padding box, which is what an absolute child is placed in.
    const border = parseFloat(getComputedStyle(card).borderBottomWidth);
    const bottom = card.getBoundingClientRect().bottom - border;
    expect(Math.round(bottom - grid.getBoundingClientRect().bottom)).toBe(32);
  });

  it('SpotlightMedia bleeds past its side and fits its image; the copy takes a gap and a measure', () => {
    const container = render(
      <SpotlightPanel>
        <SpotlightMedia side="end" bleed fit>
          <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
        </SpotlightMedia>
        <SpotlightContent gap={6} measure>
          <p>Copy</p>
        </SpotlightContent>
      </SpotlightPanel>,
    );
    const media = container.querySelector('[data-slot="spotlight-media"]')!;
    const content = container.querySelector('[data-slot="spotlight-content"]')!;
    expect(media).toHaveClass('inset-e-[-6%]');
    expect(media).not.toHaveClass('inset-e-0');
    expect(getComputedStyle(container.querySelector('img')!).objectFit).toBe('contain');
    expect(getComputedStyle(content).rowGap).toBe('24px');
    expect(getComputedStyle(content).maxWidth).toBe('704px');
  });

  it('SidebarHeader has a small step and SidebarFooter can drop its divider', () => {
    const container = render(
      <Sidebar>
        <SidebarHeader size="sm">Unit</SidebarHeader>
        <SidebarFooter divider={false}>Footer</SidebarFooter>
      </Sidebar>,
    );
    const header = container.querySelector('[data-slot="sidebar-header"]')!;
    const footer = container.querySelector('[data-slot="sidebar-footer"]')!;
    expect(Math.round(header.getBoundingClientRect().height)).toBe(48);
    expect(getComputedStyle(footer).borderTopWidth).toBe('0px');
  });

  it('table cells are positioned, so a hidden label inside cannot escape the scroller', () => {
    const container = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Rin</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(getComputedStyle(container.querySelector('th')!).position).toBe('relative');
    expect(getComputedStyle(container.querySelector('td')!).position).toBe('relative');
  });
});

describe('the layout layer follows the reading direction', () => {
  it('a message from self sits at the end in both directions', () => {
    const edges = (['ltr', 'rtl'] as const).map((dir) => {
      const container = render(
        <div dir={dir} className="w-96">
          <MessageBubble from="self">Hi</MessageBubble>
        </div>,
      );
      const frame = container.firstElementChild!.getBoundingClientRect();
      const bubble = container
        .querySelector('[data-slot="message-bubble"]')!
        .getBoundingClientRect();
      return {
        left: Math.round(bubble.left - frame.left),
        right: Math.round(frame.right - bubble.right),
      };
    });
    expect(edges[0]!.right).toBe(0);
    expect(edges[1]!.left).toBe(0);
  });

  it('an aside-start split puts the aside on the start side in both directions', () => {
    const starts = (['ltr', 'rtl'] as const).map((dir) => {
      const container = render(
        <div dir={dir} className="w-160">
          <Split layout="aside-start" from="base">
            <div data-testid={`aside-${dir}`}>Aside</div>
            <div>Main</div>
          </Split>
        </div>,
      );
      const frame = container.firstElementChild!.getBoundingClientRect();
      const aside = container
        .querySelector(`[data-testid="aside-${dir}"]`)!
        .getBoundingClientRect();
      return dir === 'ltr'
        ? Math.round(aside.left - frame.left)
        : Math.round(frame.right - aside.right);
    });
    expect(starts).toEqual([0, 0]);
  });
});
