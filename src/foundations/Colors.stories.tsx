import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
  contrastRatio,
  formatRatio,
  grade,
  resolveColor,
  type Rgb,
  type WcagLevel,
} from '@/lib/contrast';
import { Badge, Button, Card, CardBody, CardTitle, Table } from '@/components';

const meta = {
  title: 'Foundations/Colour',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const BLUE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 925, 950];
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
        <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-12">
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
    <Table className="min-w-184">
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
              {pair.note && <div className="mt-1 text-caption text-fg-muted">{pair.note}</div>}
            </td>
            <td className="py-3 pr-4 text-right font-mono text-fg">{formatRatio(ratio)}</td>
            <td className="py-3">
              <Badge status={badgeFor[grade(ratio)]}>{grade(ratio)}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export const ContrastAudit: Story = {
  parameters: {
    // The audit shows the failing pairs on purpose, as specimens beside their
    // ratios, so the contrast rule flags the specimens rather than anything
    // the system ships. Every other rule still runs.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
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

const NIGHTS = [
  {
    id: 'navy',
    note: 'The default night, and the one plain .dark gives. No attribute needed.',
  },
  { id: 'graphite', note: 'A nearly neutral cool grey over a pure black shade.' },
  { id: 'onyx', note: 'Pure neutral grey, darker than graphite.' },
  { id: 'ink', note: 'Navy’s hue at half its chroma, so not a second blue.' },
  { id: 'carbon', note: 'The darkest page, with a larger step up to the card.' },
] as const;

const NIGHT_ROLES = ['shade', 'sunken', 'page', 'raised', 'hover', 'line', 'line-strong'];

/** The pairs closest to their threshold on some night, measured inside it. */
const NIGHT_PAIRS = [
  ['Body copy on the card', '--color-text-secondary', '--color-surface-raised', 4.5],
  ['Muted copy on the page', '--color-text-muted', '--color-surface-page', 4.5],
  ['Accent text on the card', '--color-text-accent', '--color-surface-raised', 4.5],
  ['Field border on the field', '--color-field-border', '--color-field-bg', 3],
  ['Second chart series on the card', '--color-chart-series-2', '--color-surface-raised', 3],
  ['Selected row text', '--color-field-selected-fg', '--color-field-selected-bg', 4.5],
] as const;

/** Reads each pair inside `.dark` with the night's attribute, as the page paints it. */
function useNightRatios(night: string) {
  const [ratios, setRatios] = useState<number[]>([]);

  useEffect(() => {
    const host = document.createElement('div');
    host.className = 'dark';
    if (night !== 'navy') host.dataset['nightPalette'] = night;
    document.body.appendChild(host);
    const read = (token: string, backdrop?: Rgb) => {
      const probe = document.createElement('div');
      host.appendChild(probe);
      probe.style.color = `var(${token})`;
      const value = getComputedStyle(probe).color;
      probe.remove();
      return resolveColor(value, backdrop);
    };
    const page = read('--color-surface-page');
    setRatios(
      NIGHT_PAIRS.map(([, foreground, background]) => {
        const back = read(background, page);
        return contrastRatio(read(foreground, back), back);
      }),
    );
    host.remove();
  }, [night]);

  return ratios;
}

function Night({ id, note }: (typeof NIGHTS)[number]) {
  const ratios = useNightRatios(id);

  return (
    <section
      className="dark flex flex-col gap-5 rounded-xl bg-page p-6 text-fg"
      data-night-palette={id === 'navy' ? undefined : id}
    >
      <div>
        <h3 className="font-text text-heading-md font-semibold text-fg">{id}</h3>
        <p className="mt-1 max-w-2xl font-text text-body-sm text-fg-secondary">{note}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-7">
        {NIGHT_ROLES.map((role) => (
          <Swatch key={role} token={`--color-night-${role}`} name={role} />
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <Card className="w-72">
          <CardTitle as="h4" className="text-heading-sm">
            A card on this night
          </CardTitle>
          <CardBody>Its shadow is the night’s shade, darker than the page.</CardBody>
        </Card>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Enroll</Button>
          <Button variant="secondary">Explore</Button>
        </div>
      </div>
      <table className="w-full max-w-2xl border-collapse font-text text-body-sm">
        <tbody>
          {NIGHT_PAIRS.map(([label, , , minimum], index) => {
            const ratio = ratios[index];
            return (
              <tr key={label} className="border-b border-line-subtle">
                <td className="py-2 pe-4 text-fg">{label}</td>
                <td className="py-2 pe-4 font-mono text-fg">
                  {ratio === undefined ? '…' : formatRatio(ratio)}
                </td>
                <td className="py-2 text-fg-secondary">
                  {ratio === undefined
                    ? ''
                    : ratio >= minimum
                      ? `passes ${minimum}:1`
                      : `under ${minimum}:1`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export const NightPalettes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-text text-heading-lg font-semibold text-fg">Night palettes</h2>
        <p className="mt-1 max-w-3xl font-text text-body-md text-fg-secondary">
          Dark mode is five palettes. A shadow reads as shade only when it is darker than the
          page, so each night lifts its page off black and keeps a darker shade below it. Each
          fills the same seven roles, and every text, field and chart pair passes on every
          night. Choose one with <code className="font-mono">data-night-palette</code> on the
          element that carries <code className="font-mono">.dark</code>; navy needs no
          attribute. The ratios below are measured inside each night as this page renders.
        </p>
      </div>
      {NIGHTS.map((night) => (
        <Night key={night.id} {...night} />
      ))}
    </div>
  ),
};
