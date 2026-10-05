import primitivesCss from '@/styles/tokens.primitives.css?raw';

/**
 * The suite runs at three widths, named after the breakpoint tokens and derived
 * from them in `vite.config.ts`. A `play` function that asserts a layout switch
 * has to know which side of the switch it is on, and it must ask the same
 * question the CSS asks — the viewport width against the declared breakpoint —
 * rather than the instance name, which is a label and not a measurement.
 */
export const atLeast = (breakpointRem: number): boolean =>
  window.innerWidth >= breakpointRem * 16;

/**
 * Read out of the CSS that ships rather than restated, so a retuned breakpoint
 * moves the threshold a `play` function asserts against along with the widths
 * the suite runs at.
 */
function breakpointRem(name: string): number {
  const match = primitivesCss.match(new RegExp(`--breakpoint-${name}:\\s*([\\d.]+)rem`));
  if (!match?.[1])
    throw new Error(`--breakpoint-${name} is not declared in tokens.primitives.css`);
  return Number(match[1]);
}

/** `--breakpoint-md`, in rem. */
export const MD = breakpointRem('md');

/** `--breakpoint-lg`, in rem. */
export const LG = breakpointRem('lg');

/** `--breakpoint-sm`, in rem. */
export const SM = breakpointRem('sm');
