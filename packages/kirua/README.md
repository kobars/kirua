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

The package's stylesheet carries the tokens and the Tailwind theme, and names
the package's own components as a Tailwind source, so every class they use is
generated. Remove the `body`, background, colour and font rules a framework
scaffold writes, such as the ones in create-next-app's `globals.css`. Those
rules are unlayered, so they override kirua's base layer.

The stylesheet acts on the whole app, not only on kirua's components:

- **It replaces part of Tailwind's default theme.** The radius scale, the
  shadow scale, letter spacing, the `ease-out` and `ease-in-out` curves, the
  monospace font, three font weights (light, medium and semibold) and the blue,
  neutral, green, amber, red and violet colour ramps take kirua's values. The
  app's own utilities of those names change with them: `rounded-lg` becomes
  22px instead of 8px, `font-medium` becomes 700 and `bg-red-500` becomes
  kirua's red.
- **`dark:` follows the `dark` class**, not the `prefers-color-scheme` media
  query.
- **`body` takes kirua's page colour, text colour and font**, every
  `:focus-visible` element gets an outline, and under
  `prefers-reduced-motion: reduce` every element's animations and transitions
  are cut to 0.01ms and smooth scrolling is turned off.
- Under `forced-colors: active`, unlayered rules outline kirua's surfaces.
  They select on kirua's `data-slot` attributes and leave the app's own
  elements alone.

Load the fonts in the document head. The stylesheet does not fetch them, and
system fonts are the fallback:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@400..800&display=swap"
/>
```

In Next.js, `next/font/google` also works. Call `Nunito({ subsets: ['latin'] })`
and `Luckiest_Guy({ weight: '400', subsets: ['latin'] })` in the root layout and
put their `className`s on `<html>`. Next emits the real family names, which are
the names the tokens use.

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

## License

MIT for the code in this package. The values marked `[FIGMA]` in its
stylesheets were measured from a Figma Community design whose rights remain with
its author; see `NOTICE`. The character artwork and the hero rebuild that the
[repository](https://github.com/kobars/kirua)'s own NOTICE excludes are not
part of this package.
