# Kirua — a design system from one Figma screen

A proof of concept that takes a single anime landing-page hero published on Figma
Community and turns it into a working design system: a three-layer token
architecture, a component library built on Radix Primitives, and a rebuild of the
original screen made entirely from that library.

**Reference design:** _Figma Anime Website UI Design: Futuristic & Interactive
Hero Section_ (Figma Community).

## Deployed

Six production deployments on Vercel. Storybook is the system; the five
applications are the evidence that it works, and every one of them imports
kirua through the bare specifier `kirua` — never a relative path into `src`.

|                        | What it is                                                         | URL                                  |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| **Storybook**          | The system itself: every component, every foundation page          | <https://kirua-storybook.vercel.app> |
| **Aozora (marketing)** | A five-page product site — the only screens made of body copy      | <https://kirua-marketing.vercel.app> |
| **Claude web clone**   | A full-height chat shell where only the middle scrolls             | <https://kirua-claude.vercel.app>    |
| **Senja (e-commerce)** | Faceted catalogue, cart, and a checkout form that really validates | <https://kirua-shop.vercel.app>      |
| **SIMRS**              | A hospital record screen — dense, keyboard-driven, printable       | <https://kirua-simrs.vercel.app>     |
| **Ruang (social)**     | A phone-first feed, designed at 375px and widened                  | <https://kirua-social.vercel.app>    |

Each app was chosen because it forces a different part of the system into
existence. Where a screen could not be built, that was the app naming the next
component. The marketing site is the clearest case: the system was
reverse-engineered from a marketing hero and had no marketing screen, so its
whole spotlight family was shipped and placed nowhere until Aozora existed.

## Running it

```bash
pnpm install
pnpm storybook   # the design system — http://localhost:6006
pnpm dev         # the rebuilt hero page — http://localhost:5173
pnpm build       # type-check and build
pnpm test        # render every story in Chromium and assert no a11y violations
pnpm test:webkit # run the unit tests again in WebKit, the second declared engine
pnpm lint        # oxlint
pnpm check       # the whole gate: types, lint, format, every test, coverage

pnpm example:claude    # the five example apps, one Vite root each
pnpm example:marketing
pnpm example:shop
pnpm example:simrs
pnpm example:social
pnpm build:examples    # build all five
pnpm check:responsive  # build them, then measure every route at five widths
```

## What was measured, exactly

Read from the Figma file rather than sampled from a screenshot:

| Property                       | Measured value                             |
| ------------------------------ | ------------------------------------------ |
| Brand blue (hero panel fill)   | `#0A84FF`                                  |
| Hero panel corner radius       | `32px`                                     |
| Nav bar fill / radius / height | `#000000` / `22px` / `70px`                |
| Display face                   | Luckiest Guy, 65px / 67px line height      |
| Text face                      | Fredoka, 18px / 20px, white at 80% opacity |
| Call-to-action height          | `54px`                                     |

## The deliberate deviations

The brief was "keep the look, fix the flaws". Three things changed, all of them
recorded in the code at the point where they happen:

1. **Contrast.** White body copy on `#0A84FF` measures 3.65:1; the reference's
   80% white measures 2.85:1. WCAG AA requires 4.5:1. The system keeps `#0A84FF`
   as `blue-500` for display type, and points `--color-surface-brand` at
   `blue-600` (`#0973DC`, 4.67:1) for anything carrying body copy.
2. **Line height.** The reference sets 18px copy on a 20px line height — a ratio
   of 1.11. `text-body-lg` ships 1.44.
3. **Artwork.** The reference's own AI-generated illustrations are not copied.
   The hero uses Killua Zoldyck cut-outs instead — see Attribution below.

Every ratio quoted above is recomputed in the browser from the shipped tokens on
the **Foundations → Colour → Contrast Audit** page. Change a hex and the numbers
change with it.

## What it weighs

Measured from the application build on 2026-08-31, and re-measured on every
`pnpm build` — `tools/size-budget.mjs` runs as the last step and **exits
non-zero** when a budget is crossed. A warning in a build log is a budget nobody
has ever been stopped by.

| Asset      | Raw       | Gzip          | Budget (gzip) | Headroom    |
| ---------- | --------- | ------------- | ------------- | ----------- |
| JavaScript | 338.43 kB | **106.50 kB** | 115 kB        | 8.5 kB      |
| CSS        | 78.98 kB  | **13.51 kB**  | 14 kB         | **0.49 kB** |

**The CSS budget is nearly spent, and that is reported rather than raised.**
Components arrived in large pushes and each brought utilities with it. The next
few can still land; a large one cannot. Raising the number to make a build pass
would turn the budget into decoration — it has been re-baselined exactly once,
from 12 kB to 14 kB, in its own commit and with the reason beside it, and the
0.49 kB left is again meant to be spent deliberately rather than legislated
away.

That JavaScript figure includes React and ReactDOM, because it is the rebuilt
hero page rather than a library bundle. It catches "something heavy entered the
graph"; it cannot answer "what does one `Button` cost", which needs tree-shaken
library output that does not exist yet.

**In a React Server Component the JavaScript number is zero.** No file in
`src/components` carries a `"use client"` directive — asserted, not remembered,
by `src/components/server.node.test.tsx` — so the components render on the
server and ship none of themselves to the browser. What a consumer still pays is
the stylesheet: **13.51 kB gzip** for the whole system, tokens included.

## Browser support

Two things set the floors, and neither is a round number somebody liked.

**Tailwind CSS v4 sets three of them.** It compiles to `@property`, cascade
layers and `color-mix()`, and states its own requirement: Safari 16.4, Chrome
111, Firefox 128. Nothing here can go below that, whatever this system uses.

**`:dir()` raises Chrome from 111 to 120.** It is the only selector that follows
_inherited_ direction, and the `CornerGlint` mirror needs it to re-invert inside
a right-to-left document. Chrome shipped it in 120; Safari shipped it in 16.4,
which is already the Tailwind floor, so Safari does not move.

| Engine        | Floor    | Set by                                         |
| ------------- | -------- | ---------------------------------------------- |
| Chrome / Edge | **120**  | `:dir()` — Tailwind alone would allow 111      |
| Safari        | **16.4** | Tailwind 4. `:dir()` lands in the same release |
| Firefox       | **128**  | Tailwind 4                                     |

Declared once, as `browserslist` in `package.json`. Vite does not read that key —
it reads `build.target` — so `src/styles/browsers.test.ts` asserts the two agree
and that each feature the floor was set by is really in use. A matrix the build
ignores is worse than no matrix, because it reads like a guarantee.

**Two engines are actually run.** The suite is Chromium by default;
`pnpm test:webkit` runs the unit tests again in WebKit, which is the engine that
differs most from Chromium. Story and visual runs stay Chromium-only — a
screenshot is a baseline _for_ an engine, and a second set would double the
pictures without doubling what they tell you.

## Token architecture

```
src/styles/tokens.primitives.css   @theme         blue-500 is #0A84FF
        ↓
src/styles/tokens.semantic.css     :root / .ctx-* surface-brand is blue-600
        ↓
src/styles/theme.css               @theme inline  bg-brand → surface-brand
        ↓
src/components/*                                  <SpotlightPanel> uses bg-brand
```

Components read the semantic layer only — never a primitive, never a raw hex.
That indirection is what makes dark mode one block of re-pointed variables with
zero component edits.

### Surface contexts

A surface declares its context by class (`.ctx-brand`, `.ctx-inverse`) and
re-points the semantic tokens for everything inside it. So `<Button
variant="primary">` renders as a blue pill on a white page and as a white pill on
the blue hero panel — same component, same props, no override.

`@theme inline` is required for this: it compiles utilities to literal
`var(--color-…)` references rather than frozen values, so a runtime context
switch propagates.

## What is here

Seventy-four components. The grouping is by what supplies the behaviour, because
that is what decides how much of each one this repository is responsible for.

**Text and layout** — Heading, Text, Eyebrow, Link, List, Code, Container,
Section, DescriptionList, Timeline, Stepper, Meter, Item. The typographic ones
arrived last, and late: for most of this system's life every application wrote
its own `<h2 className="text-heading-md">`, which is a component nobody had
written down.

**Presentational** — Button, IconButton, ButtonGroup, Badge, Chip, Card, Alert,
Stat / StatRow, AvatarStack, Kbd, Separator, Skeleton, Spinner, Progress,
EmptyState, Table, Chart, Breadcrumb, Pagination, QuantityStepper, CodeBlock,
NavBar, Sidebar, DotGrid, CornerGlint, SpotlightPanel.

**Radix-backed** — Dialog, AlertDialog, DropdownMenu, ContextMenu, Menubar,
NavigationMenu, Tooltip, Popover, HoverCard, Sheet, Tabs, Accordion,
Collapsible, Select, Slider, Switch, Checkbox, RadioGroup, Toggle, ToggleGroup,
Toast, Avatar, AspectRatio, ScrollArea, Resizable, Carousel, Combobox, Command.
Radix supplies focus trapping, focus restore, typeahead, roving tabindex,
collision-aware positioning, and the correct ARIA wiring. This repo supplies
appearance only.

**Forms** — Field, Label, Input, InputGroup, InputOTP, Textarea, Calendar,
DatePicker. Field connects
a native control to its visible label, description, error, required state, and
invalid state while remaining server-renderable.

**Pattern** — `AnimeHero`, the reference screen rebuilt from the system with no
hard-coded hex values.

### Every component is stateless, on purpose

No file in `src/components` calls a hook or carries a `"use client"` directive.
A component that holds state cannot render on a server, and the moment one does,
a consumer's whole page stops being a Server Component.

That has a cost, and it is written down rather than glossed. `Combobox`,
`Command` and `Carousel` are **presentational shells**: they render the right
elements with the right ARIA wiring, and the consumer owns the open state, the
filtering and the current index from their own `"use client"` file. A component
that filtered its own list would be smaller to use and impossible to
server-render.

## Known gaps

- `Combobox`, `Command` and `Carousel` need a consumer to drive them (above).
- The CSS size budget has 0.49 kB of gzip headroom left.
- Character artwork is not commercially licensed (see Attribution).
- Visual baselines are Chromium-on-macOS only. They are committed PNGs, so a
  contributor on Linux will see diffs that are rasterisation, not regression.
- Server rendering is asserted without a Next.js build in the loop, so a
  framework-specific gap remains uncovered.

## Attribution and licensing

The hero uses two Killua Zoldyck cut-outs in `public/characters/`, downloaded
from [NicePNG](https://www.nicepng.com/s/killua/). Both were post-processed
before being committed: source watermarks cleared, transparent border trimmed.

**Killua Zoldyck is a character from _Hunter × Hunter_, created by Yoshihiro
Togashi and published by Shueisha.** These renders are used here for a personal,
non-commercial portfolio piece only. They are **not** licensed for a commercial
product, a client deliverable, or anything sold.

Replacing them is a one-line change per image in `src/patterns/characters.ts` —
the layout only needs a tall figure on a transparent background.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 (CSS-first `@theme`) · Radix
Primitives · CVA · Storybook 10 with the a11y addon.
