# Contributing to kirua

Start with the README and Storybook's Design direction guide. The workspace
currently develops one base style; proposals for more styles should show the
same content in both an expressive screen and an everyday workflow.

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
theme/surface controls on a story and open an overlay to inspect its portal. Changes to example applications also need
`pnpm check:examples`.

Formatting checks include Storybook configuration, MDX and these public Markdown
guides. Automated accessibility results cover tested states; also review keyboard
navigation and composed-page semantics.
