/**
 * Matched to the code that already exists rather than imposed on it — single
 * quotes, semicolons, trailing commas, 96 columns. Reformatting a whole
 * codebase to a tool's defaults buries real history under whitespace.
 *
 * `prettier-plugin-tailwindcss` sorts class names into Tailwind's canonical
 * order. It only ever reorders; it never rewrites a class. Rewriting is
 * oxlint's job — see `better-tailwindcss/enforce-canonical-classes` in
 * `.oxlintrc.json`. The two do not overlap.
 */

/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 96,
  plugins: ['prettier-plugin-tailwindcss'],

  // The plugin reads the theme from here to know the canonical order. Without
  // it, custom scale names like `text-display-xl` sort as unknown classes.
  tailwindStylesheet: './src/index.css',

  // `cn()` and `cva()` take class strings as arguments, so their contents need
  // sorting too. Without this, only literal className attributes are sorted.
  tailwindFunctions: ['cn', 'cva'],
};
