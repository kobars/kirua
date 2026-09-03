/**
 * The words the theme menu shows.
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

/** The wording four of the five applications use, and so the default. */
export const DEFAULT: ThemeMenuLabels = {
  trigger: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * The hospital application, which says "Appearance" because "theme" already
 * means a clinical template there. It is the reason the prop exists: the words
 * belong to the product, not to the control.
 */
export const APPEARANCE: ThemeMenuLabels = {
  trigger: 'Appearance',
  light: 'Light',
  dark: 'Dark',
  system: 'Match the device',
};
