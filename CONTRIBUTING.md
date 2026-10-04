# Contributing to kirua

Start with the [README](README.md) and Storybook's **Design direction** guide.
kirua has one base style, with Clay shapes and five night palettes for dark
mode. Proposals for another style should show the same content in both an
expressive screen and an everyday workflow.

## Setup

```bash
pnpm install
pnpm exec playwright install chromium webkit
pnpm storybook
```

The test suite and the example-app checks run in real browsers, so the
Playwright browsers are needed before `pnpm check` or `pnpm check:examples`.

## Components

A new or changed component follows the conventions the rest of the system
already does:

1. Props extend `ComponentProps<'tag'>`; `ref` reaches the rendered root
   element; `className` is merged last through `cn()`; `{...props}` lands on
   the element that carries the `data-slot` attribute.
2. Colours come from the semantic token layer only — never a primitive such as
   `bg-blue-600`, never a raw hex. A new colour role is added to
   `src/styles/tokens.semantic.css` for every context and night, with its
   reasoning beside it.
3. Directional styles are logical (`ps-`, `me-`, `inset-s-`), never `left` or
   `right`.
4. Radix supplies behaviour; kirua files supply appearance. Do not hand-roll a
   primitive Radix already covers. Exit animations are `@keyframes`, not
   transitions.
5. Components hold no state and read no browser API during render, so they
   stay renderable on the server. No `"use client"` directives.
6. Variant definitions live in a sibling `*.variants.ts` file, so a component
   module exports components only.
7. Sub-components are flat named exports, never static properties.
8. A new custom scale name (text size, radius, font, shadow, animation,
   duration) is also listed in `src/lib/cn.ts`, or conflicting classes stop
   cancelling.
9. The exported component has JSDoc with an `@example`.

## Documentation

Write for someone seeing the component for the first time. Explain what it does,
when to use it and which behaviour the application supplies. Keep implementation
history out of descriptions and comments.

A component story file should provide:

1. A short `docs.description.component` and the `autodocs` tag.
2. A minimal first example with sensible defaults and accurate controls.
3. Examples of relevant variants, states and composition with other components.
4. A working interaction example when consumers must supply state or handlers.
5. A `play` assertion for meaningful behaviour, such as keyboard selection or validation.

Use clear display names such as “Keyboard navigation”. Keep existing export names
when renaming a label so story URLs remain stable. Explain static state specimens
as such. Use unique IDs within an example; docs previews use separate iframes so
portals and repeated IDs cannot interfere with adjacent stories.

Code examples should include their imports and necessary state. The interactive
examples in `src/patterns/examples/` supply both executable previews and raw source
for the docs, so their displayed handlers stay in sync with what runs. For multi-part
components, import every demonstrated part. Use kirua's own controls in examples.
Do not describe local aliases as published package imports.

MDX prose uses a neutral reading font. Components inside previews keep the base
style's fonts. Use HTML tables in MDX; this configuration does not enable GFM tables.

## Comments

Keep public API JSDoc, useful examples, accessibility requirements, measured-value
provenance, compiler/linter directives and explanations of non-obvious behaviour.
Remove comments that repeat nearby code, narrate past work or defend routine choices.
Put instructions for users in the visible docs instead of only above a story export.

## The example app

The example app in `examples/` is one hash-routed app with a hub and five
sections. It is written only with kirua's components and their props:

- No `className` and no `style` prop anywhere in `examples/**/*.tsx`.
- `examples/styles.css` holds only `@import` and `@source` lines.
- No raw HTML element where the system exports a component for it. A
  legitimate exception takes a `dogfood-allow: <reason>` comment on the line
  above.

When a screen needs something the system cannot express, add the component or
prop to the system — with its story and tests — rather than styling the screen.
Every exported component should be placed by at least one section; a component
that fits no section is better exempted with a reason than forced into one.

## Verification

```bash
pnpm check
pnpm check:storybook
pnpm build
```

To iterate on a story:

```bash
pnpm exec vitest --run --project storybook:lg src/components/Field.stories.tsx
```

Also check changed stories at `storybook:below-md` and `storybook:md`. The Storybook
check builds the docs and exercises real toolbar mode changes, navigation, isolated
previews and open portals. Review the built docs at narrow and wide widths. Test
the Mode, Surface and Night controls on a story and open an overlay to inspect
its portal.

Changes to the example app, or to any component it uses, also need:

```bash
pnpm check:examples
```

It builds the app and runs the dogfood, usage, `className`, responsive,
accessibility, performance and journey checks in order. Each also runs alone, for
example `pnpm check:a11y`.

Visual baselines in `src/components/__screenshots__` are committed. To approve an
intended visual change, delete the affected PNG, re-run
`pnpm exec vitest --run --project visual`, and commit the new PNG in the same
change.

Formatting checks include Storybook configuration, MDX and these public Markdown
guides. Automated accessibility results cover tested states; also review keyboard
navigation and composed-page semantics.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE) that covers this repository.
