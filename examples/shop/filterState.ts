/**
 * The filter shape, in its own module because `react/only-export-components`
 * is on: a file that exports a component may export nothing else, or React Fast
 * Refresh cannot tell what changed and reloads the whole page instead.
 */
import { products } from './data';

export interface FilterState {
  brands: string[];
  colours: string[];
  sizes: string[];
  condition: 'any' | 'new' | 'used';
  price: [number, number];
}

/** The price slider's step, in rupiah. */
export const PRICE_STEP = 10000;

/**
 * The top of the price range: the dearest product, rounded up to a step, so
 * the default range holds the whole catalogue and a new product never falls
 * outside every position of the slider.
 */
export const PRICE_MAX =
  Math.ceil(Math.max(...products.map((product) => product.price)) / PRICE_STEP) * PRICE_STEP;

export const emptyFilters: FilterState = {
  brands: [],
  colours: [],
  sizes: [],
  condition: 'any',
  price: [0, PRICE_MAX],
};

/** True while no filter narrows the catalogue. */
export const isEmptyFilters = (filters: FilterState) =>
  filters.brands.length === 0 &&
  filters.colours.length === 0 &&
  filters.sizes.length === 0 &&
  filters.condition === 'any' &&
  filters.price[0] === 0 &&
  filters.price[1] === PRICE_MAX;
