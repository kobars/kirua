import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import {
  contrastRatio,
  formatRatio,
  relativeLuminance,
  resolveColor,
  type Rgb,
} from '@/lib/contrast';

afterEach(cleanup);

/**
 * Dark mode is five palettes, not one, and every one of them has to carry the
 * same pairs. A night is chosen by a person for comfort, so a pair that passes
 * on navy and fails on carbon is a defect that only some people ever see.
 *
 * The field family has its own audit in `field-contrast.test.tsx`; this file
 * measures what a field audit does not reach: copy on the page and the card,
 * the button labels, the chart marks and the order of the night's own steps.
 * Light mode is measured beside them, because the button fills are shared.
 */
const TEXT = 4.5;
const BOUNDARY = 3;

const NIGHTS = ['navy', 'graphite', 'onyx', 'ink', 'carbon'] as const;

const MODES = [
  ['light', '', undefined],
  ...NIGHTS.map((night) => [night, 'dark', night === 'navy' ? undefined : night] as const),
] as const;

function inMode(contextClass: string, night?: string) {
  const host = render(<div className={contextClass} data-night-palette={night} />)
    .firstElementChild as HTMLElement;

  const read = (token: string, backdrop?: Rgb): Rgb => {
    const probe = document.createElement('div');
    host.appendChild(probe);
    probe.style.color = `var(${token})`;
    const value = getComputedStyle(probe).color;
    probe.remove();
    return resolveColor(value, backdrop);
  };

  return { read, page: read('--color-surface-page') };
}

interface Pair {
  foreground: string;
  background: string;
  minimum: number;
}

const SURFACES = ['--color-surface-page', '--color-surface-raised', '--color-surface-sunken'];

const PAIRS: Pair[] = [
  ...['--color-text-primary', '--color-text-secondary', '--color-text-muted'].flatMap(
    (foreground) => SURFACES.map((background) => ({ foreground, background, minimum: TEXT })),
  ),
  ...['--color-surface-page', '--color-surface-raised'].map((background) => ({
    foreground: '--color-text-accent',
    background,
    minimum: TEXT,
  })),
  // Every part of the primary label, at rest and under hover.
  ...[
    '--color-action-primary-bg',
    '--color-action-primary-gradient-start',
    '--color-action-primary-gradient-end',
    '--color-action-primary-gradient-start-hover',
    '--color-action-primary-gradient-end-hover',
  ].map((background) => ({
    foreground: '--color-action-primary-fg',
    background,
    minimum: TEXT,
  })),
  {
    foreground: '--color-action-danger-fg',
    background: '--color-action-danger-bg',
    minimum: TEXT,
  },
  {
    foreground: '--color-action-secondary-raised-fg',
    background: '--color-action-secondary-raised-bg',
    minimum: TEXT,
  },
  {
    foreground: '--color-action-secondary-raised-fg',
    background: '--color-action-secondary-raised-bg-open',
    minimum: TEXT,
  },
  {
    foreground: '--color-text-primary',
    background: '--color-action-ghost-bg-hover',
    minimum: TEXT,
  },
  // The raised secondary button's edge is a control boundary.
  ...['--color-surface-page', '--color-surface-raised'].map((background) => ({
    foreground: '--color-action-secondary-raised-border',
    background,
    minimum: BOUNDARY,
  })),
  // A chart mark is a non-text graphic on the page or a card.
  ...[1, 2, 3, 4, 5].flatMap((series) =>
    ['--color-surface-page', '--color-surface-raised'].map((background) => ({
      foreground: `--color-chart-series-${series}`,
      background,
      minimum: BOUNDARY,
    })),
  ),
];

describe.each(MODES)('%s', (name, contextClass, night) => {
  it.each(PAIRS.map((pair) => [`${pair.foreground} on ${pair.background}`, pair] as const))(
    '%s',
    (_label, pair) => {
      const { read, page } = inMode(contextClass, night);
      const background = read(pair.background, page);
      const ratio = contrastRatio(read(pair.foreground, background), background);

      expect(
        ratio,
        `${pair.foreground} on ${pair.background} measures ${formatRatio(ratio)} on ${name}, under ${pair.minimum}:1`,
      ).toBeGreaterThanOrEqual(pair.minimum);
    },
  );
});

describe.each(NIGHTS)('the %s night', (night) => {
  const steps = () => {
    const { read } = inMode('dark', night === 'navy' ? undefined : night);
    return ['shade', 'sunken', 'page', 'raised', 'hover', 'line', 'line-strong'].map(
      (role) => [role, relativeLuminance(read(`--color-night-${role}`))] as const,
    );
  };

  /**
   * The order is what makes a night work at all: a shadow reads as shade only
   * if it is darker than the page, a card has to rise off the page, and a
   * line has to be lighter than the card it divides.
   */
  it('runs from its shade to its strong line without a step going backwards', () => {
    const measured = steps();
    for (let i = 1; i < measured.length; i++) {
      const [lower, darker] = measured[i - 1]!;
      const [upper, lighter] = measured[i]!;
      expect(lighter, `${upper} is not lighter than ${lower}`).toBeGreaterThan(darker);
    }
  });

  it('casts every Clay shadow darker than its page', () => {
    const { read, page } = inMode('dark', night === 'navy' ? undefined : night);
    for (const token of [
      '--color-shade-card',
      '--color-shade-press',
      '--color-shade-press-danger',
    ])
      expect(relativeLuminance(read(token, page)), token).toBeLessThan(relativeLuminance(page));
  });

  it('shows a selected fill against the page and the card', () => {
    const { read, page } = inMode('dark', night === 'navy' ? undefined : night);
    const selected = read('--color-field-selected-bg');
    for (const surface of [page, read('--color-surface-raised')])
      expect(contrastRatio(selected, surface)).toBeGreaterThan(1.05);
  });
});
