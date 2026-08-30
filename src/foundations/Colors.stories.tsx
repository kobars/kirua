import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
  contrastRatio,
  formatRatio,
  grade,
  resolveColor,
  type WcagLevel,
} from '@/lib/contrast';
import { Badge } from '@/components';

const meta = {
  title: 'Foundations/Colour',
  parameters: {
    layout: 'fullscreen',
    // These pages document colour rather than present interactive UI, so the
    // automated contrast rule would flag the swatch labels themselves.
    a11y: { test: 'off' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const BLUE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const NEUTRAL = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

function Swatch({ token, name }: { token: string; name: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-16 rounded-sm border border-line-subtle"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="font-text text-caption text-fg">{name}</div>
      <div className="font-mono text-caption text-fg-muted">{token}</div>
    </div>
  );
}

export const Ramps: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">Brand blue</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            Anchored on <strong>blue-500 = #0A84FF</strong>, the exact fill measured from the
            hero panel in the reference Figma file. The rest of the ramp is built at that
            colour&apos;s measured hue, 210 degrees.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-11">
          {BLUE.map((step) => (
            <Swatch key={step} token={`--color-blue-${step}`} name={`blue-${step}`} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">Neutrals</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            Pure white and pure black are kept exact, because the reference design uses both
            unmixed. The middle of the ramp carries a faint cool cast so greys sit beside the
            blue without looking muddy.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-7 lg:grid-cols-13">
          {NEUTRAL.map((step) => (
            <Swatch key={step} token={`--color-neutral-${step}`} name={`neutral-${step}`} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">Status hues</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            None of these exist in the reference design — it is one marketing screen, with
            nothing to succeed or fail. <strong>Info is violet, not blue,</strong> on purpose:
            brand blue is the page surface here, so a blue info state would disappear into it.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {['green', 'amber', 'red', 'violet'].flatMap((hue) =>
            [100, 500, 600, 900].map((step) => (
              <Swatch
                key={`${hue}-${step}`}
                token={`--color-${hue}-${step}`}
                name={`${hue}-${step}`}
              />
            )),
          )}
        </div>
      </section>
    </div>
  ),
};

interface Pair {
  label: string;
  fg: string;
  bg: string;
  note?: string;
}

const PAIRS: Pair[] = [
  {
    label: 'White body text on the REFERENCE blue (blue-500)',
    fg: '#FFFFFF',
    bg: 'var(--color-blue-500)',
    note: 'What the Figma file specifies. Large display type only.',
  },
  {
    label: 'Reference body text — 80% white on blue-500',
    fg: 'color-mix(in srgb, #FFFFFF 80%, transparent)',
    bg: 'var(--color-blue-500)',
    note: 'The exact value measured in Figma. Fails at every text size.',
  },
  {
    label: 'White body text on our brand surface (blue-600)',
    fg: '#FFFFFF',
    bg: 'var(--color-blue-600)',
    note: 'The fix. This is what --color-surface-brand points at.',
  },
  {
    label: 'REJECTED: tinted secondary — 88% white on blue-600',
    fg: 'color-mix(in srgb, #FFFFFF 88%, transparent)',
    bg: 'var(--color-blue-600)',
    note: 'Why --color-text-secondary is pure white on brand surfaces. White is only 4.67:1 here, so any transparency drops below 4.5:1. Hierarchy comes from size and weight instead.',
  },
  {
    label: 'Muted on brand — 72% white on blue-600 (non-text only)',
    fg: 'color-mix(in srgb, #FFFFFF 72%, transparent)',
    bg: 'var(--color-blue-600)',
    note: 'Fails for text, but clears the 3:1 that non-text graphics need. Used for the dot grid, never for copy.',
  },
  { label: 'White on black', fg: '#FFFFFF', bg: 'var(--color-neutral-1000)' },
  { label: 'Black on white', fg: '#000000', bg: 'var(--color-neutral-0)' },
  {
    label: 'Muted text on page',
    fg: 'var(--color-neutral-500)',
    bg: 'var(--color-neutral-0)',
  },
  {
    label: 'The accent edge on the page (non-text, needs 3:1)',
    fg: 'var(--color-border-accent)',
    bg: 'var(--color-surface-page)',
    note: 'The only edge in this system that is not grey. WCAG 1.4.11 puts a meaningful boundary at 3:1 — and an edge is drawn between two colours, so the row below is the other half. blue-400 passes neither and looks perfectly reasonable in a swatch.',
  },
  {
    label: 'The accent edge on its own fill (non-text, needs 3:1)',
    fg: 'var(--color-border-accent)',
    bg: 'var(--color-surface-brand-subtle)',
    note: 'Picking an edge against the page alone is the trap: it passes, and then vanishes on the inside of the box. src/styles/accent-edge.test.tsx asserts both halves in all four contexts.',
  },
];

const badgeFor: Record<WcagLevel, 'success' | 'info' | 'warning' | 'danger'> = {
  AAA: 'success',
  AA: 'success',
  'AA Large': 'warning',
  Fail: 'danger',
};

function ContrastTable() {
  const [rows, setRows] = useState<{ pair: Pair; ratio: number }[]>([]);

  useEffect(() => {
    setRows(
      PAIRS.map((pair) => {
        const bg = resolveColor(pair.bg);
        return { pair, ratio: contrastRatio(resolveColor(pair.fg, bg), bg) };
      }),
    );
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-184 border-collapse font-text text-body-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 text-left font-semibold text-fg">Sample</th>
            <th className="py-3 pr-4 text-left font-semibold text-fg">Pairing</th>
            <th className="py-3 pr-4 text-right font-semibold text-fg">Ratio</th>
            <th className="py-3 text-left font-semibold text-fg">Grade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ pair, ratio }) => (
            <tr key={pair.label} className="border-b border-line-subtle align-top">
              <td className="py-3 pr-4">
                <span
                  className="inline-flex h-11 items-center rounded-sm px-3 text-body-lg whitespace-nowrap"
                  style={{ backgroundColor: pair.bg, color: pair.fg }}
                >
                  Sample text
                </span>
              </td>
              <td className="py-3 pr-4 text-fg">
                {pair.label}
                {pair.note && (
                  <div className="mt-1 text-caption text-fg-muted">{pair.note}</div>
                )}
              </td>
              <td className="py-3 pr-4 text-right font-mono text-fg">{formatRatio(ratio)}</td>
              <td className="py-3">
                <Badge status={badgeFor[grade(ratio)]}>{grade(ratio)}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Every ratio on this page is measured in the browser from the tokens that ship,
 * using the WCAG 2.1 formula. Change a hex in tokens.primitives.css and these
 * numbers change with it.
 */
export const ContrastAudit: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-text text-heading-lg font-semibold text-fg">Contrast audit</h2>
        <p className="mt-1 max-w-3xl font-text text-body-md text-fg-secondary">
          These ratios are computed at render time from the shipped tokens, not written by hand.
          The first two rows are the reference design as drawn; the third is the single token
          change that fixes it. <strong>AA</strong> needs 4.5:1 for body text.{' '}
          <strong>AA Large</strong> needs 3:1, and applies only at 24px, or 18.66px bold.
        </p>
      </div>
      <ContrastTable />
    </div>
  ),
};
