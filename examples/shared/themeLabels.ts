/**
 * The words the theme menu shows, in the two languages the example apps use.
 *
 * A sibling file rather than two more exports from `ThemeMenu.tsx`, for the
 * reason `*.variants.ts` and `menu.styles.ts` exist in `src/components`: a
 * module that exports a component and something else breaks React Fast Refresh,
 * and `react/only-export-components` is on.
 */
export interface ThemeMenuLabels {
  trigger: string;
  light: string;
  dark: string;
  system: string;
}

/** Three of the four applications, and so the default. */
export const ID: ThemeMenuLabels = {
  trigger: 'Tema',
  light: 'Terang',
  dark: 'Gelap',
  system: 'Ikuti sistem',
};

/** The assistant app, the only one that passes anything. */
export const EN: ThemeMenuLabels = {
  trigger: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};
