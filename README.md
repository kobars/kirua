<div align="center">

# kirua

**A React design system with a three-layer token architecture, built on Radix Primitives.**

74 components · WCAG 2.1 AA · server-renderable · light, dark and high-contrast · LTR and RTL

[**Storybook**](https://kirua-storybook.vercel.app) · [Introduction](https://kirua-storybook.vercel.app/?path=/docs/introduction--docs) · [Dark mode](https://kirua-storybook.vercel.app/?path=/docs/foundations-dark-mode--docs) · [Example apps](#example-applications)

</div>

---

## What it is

kirua is a component library where **colour, spacing and elevation are decided by
the surface a component sits on, not by a prop it is passed.**

A surface declares its context with a class. Every semantic token inside that
subtree is re-pointed. So one component, with one set of props, renders correctly
on a white page, on a brand-blue panel, and on a near-black card:

```tsx
<Button variant="primary">Get started</Button>   // blue pill on a white page

<div className="ctx-brand bg-brand">
  <Button variant="primary">Get started</Button> // white pill — same props
</div>
```

There is no `inverted` prop, no theme provider, and no override. Dark mode works
the same way: one block of re-pointed variables, zero component changes.

## Status

kirua is **not yet published to npm.** It runs from source, and Storybook is the
documentation. The package is `private`, and the library build and package
manifest are still to come — see [Roadmap](#roadmap).

Read it, run it, and copy from it freely. Do not add it to `package.json` yet.

## Quick start

Requires Node `^20.19 || ^22.12 || >=24`, and pnpm 10.

```bash
git clone https://github.com/kobars/kirua.git
cd kirua
pnpm install
pnpm storybook          # the documentation — http://localhost:6006
```

### Using a component

```tsx
import { Card, CardTitle, CardBody, Button, Badge } from 'kirua';

export function ReleaseCard() {
  return (
    <Card padding="md">
      <Badge status="success">Shipped</Badge>
      <CardTitle as="h2">Version 2.1</CardTitle>
      <CardBody>Adds the field family and four form controls.</CardBody>
      <Button variant="primary">Read the notes</Button>
    </Card>
  );
}
```

Applications import the bare specifier `kirua`. Until the package is published,
that specifier is an alias — one entry in `tsconfig.app.json` and one in
`examples/vite.shared.ts` — so application code reaches into `src` through a
name rather than a relative path, and nothing has to move when the package
lands. Import `kirua/styles.css` for the stylesheet.

### Turning on dark mode

Add the `dark` class to `<html>`. That is the whole API.

```js
document.documentElement.classList.toggle('dark', true);
```

To avoid a flash of the wrong theme, set it from a blocking inline script in
`<head>`. The exact snippet, the reasoning, and the Next.js App Router version
are on the [Dark mode](https://kirua-storybook.vercel.app/?path=/docs/foundations-dark-mode--docs)
page.

## Principles

**Components read the semantic layer only.** Never a primitive, never a raw hex.
That indirection is what makes a theme a variable change rather than a component
change.

```
tokens.primitives.css   @theme          raw values          blue-500 = #0A84FF
        ↓
tokens.semantic.css     :root / .ctx-*  meaning             surface-brand = blue-600
        ↓
theme.css               @theme inline   utility aliases     bg-brand → surface-brand
        ↓
components                                                  <Card variant="brand">
```

`@theme inline` is load-bearing. It compiles utilities to literal
`var(--color-…)` references instead of frozen values, which is what lets a
runtime context switch propagate.

**Behaviour comes from Radix, appearance from here.** Focus trapping and restore,
typeahead, roving tabindex, collision-aware positioning and ARIA wiring are
Radix's. This repository supplies styling only, and does not hand-roll a
primitive Radix already covers.

**Every component is stateless and server-renderable.** No file in
`src/components` calls a hook or carries a `"use client"` directive, so a Card in
a React Server Component ships no JavaScript at all. This is asserted by a test,
not remembered.

The trade-off is stated plainly: `Combobox`, `Command` and `Carousel` are
**presentational shells**. They render the right elements with the right ARIA
wiring, and the consumer owns the open state, the filtering and the current index
from their own client component.

**Direction is logical, never physical.** Every directional value is `ps-`, `pe-`,
`ms-`, `me-`, `inset-s-`, `inset-e-`, and corners are named
`top-start | top-end | bottom-start | bottom-end`. A test renders each affected
component in both directions and fails if a physical utility appears.

## What is included

**Layout and text** — Container, Section, Heading, Text, Eyebrow, Link, List,
Code, DescriptionList, Item, Timeline, Stepper, Meter, Separator, AspectRatio.

**Actions and status** — Button, IconButton, ButtonGroup, Badge, Chip, Card,
Alert, Stat, AvatarStack, Kbd, Skeleton, Spinner, Progress, EmptyState,
QuantityStepper, CodeBlock.

**Forms** — Field, Label, Input, InputGroup, InputOTP, Textarea, Select,
Checkbox, RadioGroup, Switch, Slider, Toggle, ToggleGroup, Combobox, Calendar,
DatePicker. `Field` connects a native control to its visible label, description,
error and invalid state while staying server-renderable.

**Overlays** — Dialog, AlertDialog, Sheet, Popover, HoverCard, Tooltip,
DropdownMenu, ContextMenu, Menubar, Toast, Command.

**Navigation and data** — NavBar, Sidebar, NavigationMenu, Breadcrumb, Tabs,
Pagination, Accordion, Collapsible, Table, Chart, Carousel, ScrollArea,
Resizable, Avatar.

**Ornament** — SpotlightPanel, CornerGlint, DotGrid.

An icon set ships alongside them, documented under **Components → Icons**.

## Accessibility

Accessibility is enforced by the test run, not reviewed by hand.

| What                | How                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Every story         | axe, with violations set to **error** rather than warning                                |
| Every example route | axe on 36 routes, light and dark, at two widths                                          |
| Contrast            | recomputed in the browser from the shipped tokens, so the docs cannot drift from the CSS |
| Forced colours      | a dedicated test project running with Windows high contrast active                       |
| Reduced motion      | a dedicated test project with `prefers-reduced-motion` set                               |
| Target size         | WCAG 2.5.8, including its spacing exception                                              |

The system knowingly departs from its reference design on contrast, and the
reasons sit beside the tokens. White body copy on the reference's `#0A84FF`
measures 3.65:1, and at the reference's own 80% opacity it measures 2.85:1 —
both below the 4.5:1 that WCAG AA requires. `--color-surface-brand` therefore
points at `blue-600` (4.67:1). The identity blue survives as
`--color-surface-brand-vivid` for display-size type, where the 3:1 threshold
applies.

## Browser support

Declared once as `browserslist` in `package.json`, and asserted by
`src/styles/browsers.test.ts` — which also checks that Vite's `build.target`
agrees, because a matrix the build ignores reads like a guarantee and is not one.

| Engine        | Minimum  | Set by                                          |
| ------------- | -------- | ----------------------------------------------- |
| Chrome / Edge | **120**  | `:dir()` — Tailwind alone would allow 111       |
| Safari        | **16.4** | Tailwind v4; `:dir()` lands in the same release |
| Firefox       | **128**  | Tailwind v4                                     |

Tailwind CSS v4 compiles to `@property`, cascade layers and `color-mix()`, which
sets three of these floors. `:dir()` raises Chrome, because it is the only
selector that follows _inherited_ direction, and `CornerGlint` needs it to
re-invert inside a right-to-left document.

## What a consumer downloads

| Asset                                   | Raw      | Gzip         | Budget |
| --------------------------------------- | -------- | ------------ | ------ |
| CSS — the whole system, tokens included | 79.2 kB  | **13.5 kB**  | 14 kB  |
| JavaScript — demo page, React included  | 338.6 kB | **106.5 kB** | 115 kB |

Both are re-measured on every `pnpm build`, and the check exits non-zero when a
budget is crossed.

The JavaScript figure is the demo application rather than library output, so it
includes React and ReactDOM. **In a React Server Component the component
JavaScript is zero**, and what a consumer pays is the stylesheet.

## Development

```bash
pnpm storybook          # the design system — localhost:6006
pnpm dev                # the demo hero page — localhost:5173
pnpm test               # every story rendered in Chromium, with axe assertions
pnpm test:webkit        # the unit tests again in WebKit
pnpm check              # the whole gate: types, lint, format, tests, coverage
pnpm build              # build, then enforce the size budget
```

### Test projects

Seven Vitest projects, because each needs a browser configured a different way. A
file belongs to exactly one, chosen by its suffix.

| Project                      | Runs                 | Why it is separate                                  |
| ---------------------------- | -------------------- | --------------------------------------------------- |
| `storybook:{below-md,md,lg}` | every story export   | three widths; the viewport is a Storybook global    |
| `unit:{below-md,md,lg}`      | `*.test.tsx`         | a real browser — the cascade has to resolve         |
| `visual`                     | `*.visual.test.tsx`  | a baseline is a baseline _for_ a browser at a width |
| `node`                       | `*.node.test.tsx`    | the absence of a browser is the assertion           |
| `forced-colors`              | `*.forced.test.tsx`  | a browser context option, so no test can turn it on |
| `reduced-motion`             | `*.reduced.test.tsx` | same reason                                         |
| `webkit`                     | `*.test.tsx`         | the second engine                                   |

Adding a story adds a test: `@storybook/addon-vitest` turns every story export
into a test case, and a component with no story fails the run.

## Example applications

Five applications, each built only from kirua and deployed. They are the evidence
that the system works on real screens rather than on story pages, and each one
was chosen because it forces a different part of the system into existence.

|               | What it exercises                                                  |                                            |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| **Aozora**    | Marketing — the only screens made of body copy                     | [live](https://kirua-marketing.vercel.app) |
| **Senja**     | Commerce — faceted catalogue, cart, a checkout form that validates | [live](https://kirua-shop.vercel.app)      |
| **SIMRS**     | Hospital records — dense, keyboard-driven, printable               | [live](https://kirua-simrs.vercel.app)     |
| **Ruang**     | Social — phone-first, designed at 375px and widened                | [live](https://kirua-social.vercel.app)    |
| **Assistant** | Chat — a full-height shell where only the middle scrolls           | [live](https://kirua-claude.vercel.app)    |

Two automated checks keep them honest. One fails the build when an example writes
a raw element the system already exports a component for. The other fails when
the library exports a value no application uses, because existing is not usage —
a story renders one component on a blank page, and only an application puts it on
a real screen.

```bash
pnpm check:examples     # dogfooding, usage, responsive, axe and size, in order
```

## Roadmap

- A library build and package manifest, so kirua can be installed rather than cloned.
- A licence file. Until one exists, no usage rights are granted — see below.
- Per-component size measurement, which needs tree-shaken library output.
- Continuous integration running the checks that currently run locally.

## Known limitations

- `Combobox`, `Command` and `Carousel` need a consumer to drive their state.
- Visual baselines are Chromium-on-macOS. They are committed PNGs, so another
  operating system can produce rasterisation diffs that are not regressions.
- Server rendering is asserted without a Next.js build in the loop, so a
  framework-specific gap remains uncovered.
- The CSS budget has roughly half a kilobyte of headroom.

## Licence

**No licence is granted yet.** A licence file is on the roadmap; until it lands,
all rights are reserved and this repository is published for reading rather than
for reuse.

### Artwork

The demo hero uses fan-distributed renders of Killua Zoldyck, a character from
_Hunter × Hunter_ created by Yoshihiro Togashi and published by Shueisha, taken
from [NicePNG](https://www.nicepng.com/s/killua/). **They are not licensed for
commercial use of any kind.** Replace them before shipping anything built on the
hero pattern — the layout only needs a tall figure on a transparent background,
so it is one line per image in `src/patterns/characters.ts`.

### Reference design

The token values marked `[FIGMA]` in the CSS are measured from _Figma Anime
Website UI Design: Futuristic & Interactive Hero Section_, published on Figma
Community. The reference is a single desktop marketing frame with no components,
variables or styles; everything unmarked was designed to fill the gaps one screen
leaves.

## Built with

React 19 · TypeScript · Vite · Tailwind CSS v4 · Radix Primitives · CVA ·
Storybook 10
