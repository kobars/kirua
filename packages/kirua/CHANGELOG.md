# Changelog

## 0.1.0

The first published version.

- Every component, icon and helper exported from the barrel, as ES modules with
  one file per source module and TypeScript declarations.
- `@kobars/kirua/styles.css`: the token layers, light and dark modes with five
  night palettes, the Tailwind theme and animations, as Tailwind v4 source CSS
  that names the package's components as a Tailwind source.
- Peer dependencies: `react` and `react-dom` 19, and `tailwindcss` 4.3 or later.
  The components use utilities that older Tailwind versions do not generate.
