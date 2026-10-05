/**
 * The breakpoint tokens, read out of the CSS that ships, for the tools that
 * size a browser. A width restated as a number in a tool is a second source of
 * truth: it stops sitting beside the breakpoint it was chosen for the moment
 * the token moves, and the sweep stays green while it measures the wrong side.
 *
 * `vite.config.ts` and `.storybook/viewports.ts` read the same declarations
 * for the test suite and the story viewports.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REM = 16;

const PRIMITIVES = readFileSync(
  path.join(import.meta.dirname, '../src/styles/tokens.primitives.css'),
  'utf8',
);

/** `--breakpoint-<name>` in CSS pixels. */
export function breakpointPx(name) {
  const match = PRIMITIVES.match(new RegExp(`--breakpoint-${name}:\\s*([\\d.]+)rem`));
  if (!match?.[1])
    throw new Error(`--breakpoint-${name} is not declared in tokens.primitives.css`);
  return Number(match[1]) * REM;
}
