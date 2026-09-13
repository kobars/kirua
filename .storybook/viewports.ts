import primitivesCss from '../src/styles/tokens.primitives.css?raw';

const REM = 16;

function breakpointPx(name: string): number {
  const match = primitivesCss.match(new RegExp(`--breakpoint-${name}:\\s*([\\d.]+)rem`));
  if (!match?.[1])
    throw new Error(`--breakpoint-${name} is not declared in tokens.primitives.css`);
  return Number(match[1]) * REM;
}

const md = breakpointPx('md');

/**
 * The widths the story suite runs at, **derived from the breakpoint tokens**
 * rather than restated as numbers. A viewport written as a magic number stops
 * straddling the breakpoint the moment the token moves, and the suite stays
 * green while the assertion quietly stops meaning anything.
 *
 * Three, not five: just below `md`, exactly at `md`, and the desktop width the
 * reference was drawn for. Each one multiplies the whole suite, and these are
 * the three sides of the only two reflows the system has.
 */
export const KIRUA_VIEWPORTS = {
  belowMd: {
    name: `Below md (${md - 1}px)`,
    styles: { width: `${md - 1}px`, height: '900px' },
  },
  md: { name: `md (${md}px)`, styles: { width: `${md}px`, height: '900px' } },
  lg: {
    name: `lg (${breakpointPx('lg')}px)`,
    styles: { width: `${breakpointPx('lg')}px`, height: '900px' },
  },
} as const;

export const VIEWPORT_KEYS = Object.keys(KIRUA_VIEWPORTS) as Array<
  keyof typeof KIRUA_VIEWPORTS
>;
