# kirua

A personal React design system for expressive websites and everyday applications.
kirua starts with an anime-inspired base: vivid blue, rounded shapes, playful
headlines and optional corner ornaments. The same components also support quieter
social feeds, shops, forms and dashboards.

[Storybook](https://kirua-storybook.vercel.app) · [Getting started](https://kirua-storybook.vercel.app/?path=/docs/getting-started--docs) · [Design direction](https://kirua-storybook.vercel.app/?path=/docs/design-direction--docs)

## The direction

Inspired by shadcn/ui's composable approach, kirua owns its visual language and
builds on Radix Primitives. shadcn/ui is a reference, not a dependency.

The goal is a system with several **templates**, **styles** and **themes**:

| Term            | What it changes                                                     | Current state                                         |
| --------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| Template        | Page structure and content: a creator profile, shop or landing page | One hero pattern and five example applications        |
| Style           | Visual character: typography, shapes, density and ornament          | One base style; additional named styles are planned   |
| Theme           | A coordinated set of colour roles                                   | One blue palette with light and dark modes            |
| Surface context | Local contrast inside a brand or inverse panel                      | Available through semantic tokens and surface classes |

Light and dark are modes of the current palette. The example applications are
compositions of the base style, not separately packaged templates or themes.
See the Storybook **Design direction** guide for the extension plan and current
constraints.

## Run locally

This repository is a development workspace, **not an installable npm package**.
Use Node matching `package.json` (`^20.19.0 || ^22.12.0 || >=24.0.0`) and pnpm 10.

```bash
git clone https://github.com/kobars/kirua.git
cd kirua
pnpm install
pnpm storybook
```

Open http://localhost:6006. Start with **Getting started**, then explore
**Patterns → Everyday screens** and the component docs. Component pages include
examples, source and controls; the **Mode** and **Surface** toolbar controls are
available when opening an individual story.

## Compose a screen

Inside the example apps, `kirua` and `kirua/styles.css` are local Vite aliases.
They do not resolve in an unrelated project without equivalent setup.

```tsx
import { Badge, Button, Card, CardBody, CardTitle } from 'kirua';
import 'kirua/styles.css';

export function CollectionCard() {
  return (
    <Card padding="md">
      <Badge status="info">New collection</Badge>
      <CardTitle as="h2">Small worlds, big stories</CardTitle>
      <CardBody>Prints and accessories from independent artists.</CardBody>
      <Button asChild>
        <a href="/collections">Explore the collection</a>
      </Button>
    </Card>
  );
}
```

The host loads Fredoka and Luckiest Guy; system fonts are fallbacks. Setup,
font loading and state ownership are covered in **Getting started**.

Colour roles adapt to the containing surface:

```tsx
<Card variant="brand" padding="md">
  <CardTitle as="h2">Join the sketch club</CardTitle>
  <Button>Join club</Button>
</Card>
```

Add `dark` to `<html>` to select dark mode. The **Foundations → Dark mode** guide
covers initial paint and saved preferences.

## What's available

- Layout, typography, cards, buttons, icons and decorative elements.
- Form controls, validation presentation, menus and overlays.
- Navigation, tables, charts, loading states and empty states.
- Light/dark modes, local surface contexts and logical direction utilities.

Static components can render on the server. Interactive Radix components still
require client JavaScript; application state and event handlers belong in a
client component. Combobox and Command supply presentation parts; applications
must implement filtering, keyboard navigation and selection. Carousel supplies
native scrolling and snapping; custom controls belong to the application.

## Example applications

| App       | Use case                     | Run                      |
| --------- | ---------------------------- | ------------------------ |
| Aozora    | Anime-inspired marketing     | `pnpm example:marketing` |
| Dusk      | Catalogue, cart and checkout | `pnpm example:shop`      |
| Commons   | Social feeds and profiles    | `pnpm example:social`    |
| SIMRS     | Dense records and workflows  | `pnpm example:simrs`     |
| Assistant | Chat and workspace layout    | `pnpm example:claude`    |

These are demonstrations with local sample data, not production integrations.

## Development and verification

```bash
pnpm dev               # hero demo
pnpm check             # types, lint, formatting, tests and coverage
pnpm build             # demo build, utility check and size budgets
pnpm build-storybook   # static documentation
pnpm check:examples    # usage, responsive, accessibility and performance checks
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for documentation and example conventions.
The declared browser minimums are Chrome/Edge 120, Safari 16.4 and Firefox 128.

Automated checks cover component stories, token contrast, keyboard interactions,
forced colours and reduced motion. Some foundation specimens disable axe because
they display raw tokens. Automated checks do not establish full accessibility
conformance; composed screens also need keyboard and assistive-technology review.

Size budgets currently measure the demo and example applications. They are not
per-component package sizes. Visual baselines are Chromium on macOS, and the
server-rendering checks do not include a complete Next.js application build.

## Next steps

- Validate additional palettes across modes, surfaces and interaction states.
- Define a named style contract, including font loading and ornament geometry.
- Turn selected example screens into reusable, documented templates.
- Add a library build, package exports, licence and per-component size checks.
- Run the existing verification gates in continuous integration.

## Licence and reference assets

No licence file is present; this repository does not currently grant a reuse
licence. Publication and distribution are still being prepared.

The hero includes third-party character artwork. No commercial-use licence for
those assets is supplied with this repository. Use artwork you have permission
to distribute before publishing a derivative screen.

Values marked `[FIGMA]` in the CSS were measured from _Figma Anime Website UI
Design: Futuristic & Interactive Hero Section_. That frame informed the initial
base style; application components and additional states extend beyond it.
