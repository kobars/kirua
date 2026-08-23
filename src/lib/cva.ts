import { cva as defineClassVariants, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export type { VariantProps };

type Schema = Record<string, Record<string, ClassValue>>;
/** Upstream's own config type, so the wrapper cannot drift from it. */
type Config<T> = Parameters<typeof defineClassVariants<T>>[1];

/**
 * `class-variance-authority`'s `cva`, with one addition: the returned function
 * carries its own `variants` map as a property. Upstream `cva` closes over the
 * map and exposes nothing, so no test can ask "which variants exist?" — and
 * `src/components/variants.test.tsx` exists to ask exactly that, so that a
 * variant no story renders fails the suite instead of shipping unseen.
 *
 * The name is load-bearing. `prettier-plugin-tailwindcss` sorts inside calls
 * listed in `tailwindFunctions`, and `eslint-plugin-better-tailwindcss`
 * matches its `cva` callee rules on the name `^cva$` — neither looks at the
 * import source. Keeping the name keeps every class inside the call linted
 * and sorted with no tool configuration.
 *
 * @example
 * const badge = cva('inline-flex', { variants: { size: { sm: 'h-5', md: 'h-6' } } });
 * badge({ size: 'sm' }); // 'inline-flex h-5'
 * badge.variants;        // { size: { sm: 'h-5', md: 'h-6' } }
 */
export function cva<T extends Schema>(base?: ClassValue, config?: Config<T>) {
  // `Config<T>` is conditional on `T` and TypeScript does not resolve it inside
  // the generic body, so the one property read here goes through a cast.
  const variants = (config as { variants?: T } | undefined)?.variants ?? ({} as T);
  return Object.assign(defineClassVariants<T>(base, config), { variants });
}
