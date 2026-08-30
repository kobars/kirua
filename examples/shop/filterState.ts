/**
 * The filter shape, in its own module because `react/only-export-components`
 * is on: a file that exports a component may export nothing else, or React Fast
 * Refresh cannot tell what changed and reloads the whole page instead.
 */
export interface FilterState {
  brands: string[];
  colours: string[];
  sizes: string[];
  condition: 'any' | 'new' | 'used';
  price: [number, number];
}

export const emptyFilters: FilterState = {
  brands: [],
  colours: [],
  sizes: [],
  condition: 'any',
  price: [0, 800000],
};
