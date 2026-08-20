/**
 * The suite runs at three widths, named after the breakpoint tokens and derived
 * from them in `vite.config.ts`. A `play` function that asserts a layout switch
 * has to know which side of the switch it is on, and it must ask the same
 * question the CSS asks — the viewport width against the declared breakpoint —
 * rather than the instance name, which is a label and not a measurement.
 */
export const atLeast = (breakpointRem: number): boolean =>
  window.innerWidth >= breakpointRem * 16;

/** `--breakpoint-md`. Asserted against the CSS in `src/styles/tokens.test.ts`. */
export const MD = 48;

/** `--breakpoint-lg`. */
export const LG = 64;
