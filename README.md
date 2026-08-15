# Kirua — a design system from one Figma screen

A proof of concept that takes a single anime landing-page hero published on Figma
Community and turns it into a working design system: a three-layer token
architecture, a component library built on Radix Primitives, and a rebuild of the
original screen made entirely from that library.

**Reference design:** *Figma Anime Website UI Design: Futuristic & Interactive
Hero Section* (Figma Community).

## Running it

```bash
pnpm install
pnpm storybook   # the design system — http://localhost:6006
pnpm dev         # the rebuilt hero page — http://localhost:5173
pnpm build       # type-check and build
pnpm test        # render every story in Chromium and assert no a11y violations
pnpm lint        # oxlint
```

## What was measured, exactly

Read from the Figma file rather than sampled from a screenshot:

| Property | Measured value |
| --- | --- |
| Brand blue (hero panel fill) | `#0A84FF` |
| Hero panel corner radius | `32px` |
| Nav bar fill / radius / height | `#000000` / `22px` / `70px` |
| Display face | Luckiest Guy, 65px / 67px line height |
| Text face | Fredoka, 18px / 20px, white at 80% opacity |
| Call-to-action height | `54px` |

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

**Presentational** — Button, IconButton, Chip, AvatarStack, Badge, Card,
NavBar, Stat / StatRow, DotGrid, CornerGlint, SpotlightPanel.

**Radix-backed** — Dialog, DropdownMenu, Tooltip, Tabs. Radix supplies focus
trapping, focus restore, typeahead, roving tabindex, collision-aware
positioning, and the correct ARIA wiring. This repo supplies appearance only.

**Pattern** — `AnimeHero`, the reference screen rebuilt from the system with no
hard-coded hex values.

## Known gaps

- No form controls (input, select, checkbox, radio, switch). Largest gap for
  real product use.
- No loading or empty states.
- Character artwork is not commercially licensed (see Attribution).
- No visual regression baseline. `pnpm test` covers behaviour and accessibility,
  not appearance.

## Attribution and licensing

The hero uses two Killua Zoldyck cut-outs in `public/characters/`, downloaded
from [NicePNG](https://www.nicepng.com/s/killua/). Both were post-processed
before being committed: source watermarks cleared, transparent border trimmed.

**Killua Zoldyck is a character from *Hunter × Hunter*, created by Yoshihiro
Togashi and published by Shueisha.** These renders are used here for a personal,
non-commercial portfolio piece only. They are **not** licensed for a commercial
product, a client deliverable, or anything sold.

Replacing them is a one-line change per image in `src/patterns/characters.ts` —
the layout only needs a tall figure on a transparent background.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 (CSS-first `@theme`) · Radix
Primitives · CVA · Storybook 10 with the a11y addon.
