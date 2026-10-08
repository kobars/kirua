# @kobars/kirua

A React design system with a playful, cut-out look: bold outlines, hard offset
shadows, rounded "Clay" corners, a vivid blue brand and a comic display face.
Built with React 19, Tailwind CSS v4 and Radix Primitives.

[Storybook](https://kirua-storybook.vercel.app) ·
[Repository](https://github.com/kobars/kirua)

## Install

```bash
pnpm add @kobars/kirua
```

`react` and `react-dom` 19 and `tailwindcss` 4.3 or later are peer
dependencies. The components are styled by Tailwind at build time, so the app
needs Tailwind with its Vite plugin or its PostCSS plugin
(`@tailwindcss/vite`, `@tailwindcss/postcss`). Next.js scaffolds the PostCSS
plugin, which needs no change. In a Vite app:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

Tailwind's [framework guides](https://tailwindcss.com/docs/installation/framework-guides)
cover other hosts.

## Styles

Make these two lines the app stylesheet's only rules:

```css
@import 'tailwindcss';
@import '@kobars/kirua/styles.css';
```

Import them from a CSS file, as above, and not from JavaScript: Tailwind
generates the components' classes only into a stylesheet that imports
`tailwindcss`, and the package is marked free of side effects, so a bundler
may drop a stylesheet imported from JavaScript.

The package's stylesheet carries the tokens and the Tailwind theme, and lists
every class the package's components use, so each one is generated. Remove
the `body`, background, colour and font rules a framework scaffold writes,
such as the ones in create-next-app's `globals.css`. Those rules are
unlayered, so they override kirua's base layer.

### Only the styles of the components you use

`styles.css` generates the classes of every component, whichever ones you
import. To generate only some, import `theme.css` and one file per component
module instead:

```css
@import 'tailwindcss';
@import '@kobars/kirua/theme.css';
@import '@kobars/kirua/sources/Button.css';
@import '@kobars/kirua/sources/Card.css';
```

A module file is named after the component its parts start with: `Card.css`
covers `CardTitle` and `CardFooter`, and `icons.css` covers every icon. Each
file also covers the components that module renders itself, such as the close
`IconButton` inside `Dialog`. A component whose file is missing still renders,
without most of its styles, so add the line when you add the import.
`theme.css` plus every module file generates exactly what `styles.css` does.

The stylesheet acts on the whole app, not only on kirua's components:

- **It replaces part of Tailwind's default theme.** The radius scale, the
  shadow scale, letter spacing, the `ease-out` and `ease-in-out` curves, the
  monospace font, three font weights (light, medium and semibold) and the blue,
  neutral, green, amber, red and violet colour ramps take kirua's values. The
  app's own utilities of those names change with them: `rounded-lg` becomes
  22px instead of 8px, `font-medium` becomes 700 and `bg-red-500` becomes
  kirua's red.
- **It shares the spacing scale and the breakpoints with the app.** kirua
  declares Tailwind's default `--spacing` and `--breakpoint-*` values without
  changing them, and its components are sized and laid out against them.
  Retuning either in your own `@theme` resizes or reflows kirua's components
  as well, while their few fixed measurements stay as they are.
- **`dark:` follows the `dark` class**, not the `prefers-color-scheme` media
  query.
- **`body` takes kirua's page colour, text colour and font**, every
  `:focus-visible` element gets an outline, and under
  `prefers-reduced-motion: reduce` every element's animations and transitions
  are cut to 0.01ms and smooth scrolling is turned off.
- Under `forced-colors: active`, unlayered rules outline kirua's surfaces.
  They select on kirua's `data-slot` attributes and leave the app's own
  elements alone.

The fonts, Nunito and Luckiest Guy, ship with the package. Import them after
the stylesheet, from CSS like the stylesheet itself, and your bundler copies
the font files into your build:

```css
@import 'tailwindcss';
@import '@kobars/kirua/styles.css';
@import '@kobars/kirua/fonts.css';
```

The files load from your own origin, and a page downloads only the scripts it
shows: one file per family for Latin text. Without `fonts.css`, system fonts
are the fallback.

In Next.js, `next/font/google` works in place of `fonts.css`. Call
`Nunito({ subsets: ['latin'] })` and
`Luckiest_Guy({ weight: '400', subsets: ['latin'] })` in the root layout and
put their `className`s on `<html>`. Next emits the real family names, which
are the names the tokens use.

## Usage

```tsx
import { Badge, Button, Card, CardBody, CardTitle } from '@kobars/kirua';

export function CollectionCard() {
  return (
    <Card padding="md">
      <Badge status="info" className="self-start">
        New collection
      </Badge>
      <CardTitle as="h2">Small worlds, big stories</CardTitle>
      <CardBody>Prints and accessories from independent artists.</CardBody>
      <Button asChild>
        <a href="/collections">Explore the collection</a>
      </Button>
    </Card>
  );
}
```

`Card` is a flex column, so a direct child stretches to its width. `self-start`
keeps the badge at its own size.

The components render in a Server Component and carry no `"use client"`
directive, with three exceptions: `Calendar`, `DatePicker` and the `Combobox`
parts are client components, because they create event handlers of their own.
A Server Component file can still import and place them; they render on the
client. Attach event handlers from a client component of your own.

- **Tooltips** need one `TooltipProvider` around the app, for example in the
  root layout.
- **Icons** are exported from the same entry: `SearchIcon`, `ChevronDownIcon`,
  `CloseIcon` and the rest. They take the colour of the surrounding text, and
  inside a `Button`, `IconButton`, `Badge`, `Chip` or menu item they take the
  control's size. A `ChevronDownIcon` inside a `Button` or an
  `IconButton` turns over while the button has `aria-expanded="true"`.

Every component, variant and token is documented in
[Storybook](https://kirua-storybook.vercel.app).

### Dark mode

Add the `dark` class to `<html>`. Dark mode never follows the operating
system's setting on its own; to follow it, set the class from
`prefers-color-scheme` in your own script.

Dark mode has five night palettes. `navy` is the default and needs no
attribute. For another, set `data-night-palette` to `graphite`, `onyx`, `ink` or
`carbon` on the same element as the `dark` class:

```html
<html class="dark" data-night-palette="graphite"></html>
```

### Next.js

Turbopack, the default builder in Next.js 16, needs no configuration. With
`next build --webpack`, a page that imports from `@kobars/kirua` in a Server
Component and also renders a client component ships every client component the
package entry reaches, used or not. Name the package in `next.config` to avoid
it:

```ts
const nextConfig = {
  experimental: { optimizePackageImports: ['@kobars/kirua'] },
};
```

## Size

Measured on 7 October 2026 on a fresh npm install of this release: each
family of exports bundled alone from the package entry, tree-shaken, minified
and gzipped, the way an app's production build ships it, with React and
ReactDOM left out because your app already ships them. A fresh install takes
the newest release each dependency range allows, so a later Radix or
`tailwind-merge` release moves the "with its dependencies" column; the other
two columns are this package alone.

| Import                                        | kirua only | With its dependencies | Its styles |
| --------------------------------------------- | ---------- | --------------------- | ---------- |
| `Button`                                      | 1.94 kB    | 12.05 kB              | 7.78 kB    |
| `Card` and its five parts                     | 2.04 kB    | 10.93 kB              | 7.03 kB    |
| `Dialog` and its six parts, with Radix Dialog | 2.06 kB    | 23.76 kB              | 7.96 kB    |
| `Select`, the largest with its dependencies   | 2.02 kB    | 39.76 kB              | 7.64 kB    |
| `Button`, `Card` and `Dialog` together        | 4.07 kB    | 26.15 kB              | 9.78 kB    |
| Every export                                  | 29.88 kB   | 113.78 kB             | 18.41 kB   |

About 9.21 kB of each "with its dependencies" figure is `clsx` and
`tailwind-merge`, which every component uses to merge your `className`. Your
app pays it once, so `Button`, `Card` and `Dialog` together cost 26.15 kB, not
the 46.74 kB their rows add up to. Radix packages are shared the same way:
`Dialog`, `Sheet` and `AlertDialog` together cost 24.71 kB, 0.95 kB more than
`Dialog` alone. If your app already uses `tailwind-merge` 3.6 or later, most
of that share is already paid, provided one copy is installed: check with
`npm ls tailwind-merge`.

"Its styles" is `theme.css` plus that row's module files, Tailwind's base
layer included. With `styles.css` the stylesheet is 18.41 kB whatever you
import.

Bundlephobia's headline figure is the "Every export" row: it bundles the
whole package with every dependency and leaves out only peer dependencies. A
library that lists its behaviour layer as peer dependencies shows a smaller
figure there without shipping less. Its exports analysis gives each export's
cost instead. Other bundlers differ: esbuild measured these rows 1 to 11%
larger, the most on "Every export".

## License

MIT for the code in this package. The values marked `[FIGMA]` in its
stylesheets were measured from a Figma Community design whose rights remain with
its author; see `NOTICE`. The character artwork and the hero rebuild that the
[repository](https://github.com/kobars/kirua)'s own NOTICE excludes are not
part of this package.
