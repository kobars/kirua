import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Badge } from '@/components';

/**
 * Colour and type had foundations pages. **Five other scales had none** —
 * spacing, radius, elevation, motion and breakpoints — and five foundation
 * cards each ended with a step that said "document it on the foundations page
 * beside type and colour". There was no such page for any of them.
 *
 * Every number below is **read out of the shipped tokens in the browser**, the
 * way the colour page recomputes its ratios. That is the property that matters:
 * a page cannot state a value the CSS no longer holds, so retuning a scale
 * updates its documentation rather than making it wrong.
 */
const meta = {
  title: 'Foundations/Scales',
  parameters: {
    layout: 'fullscreen',
    // Same reason as the colour page: these are token specimens, so the
    // automated contrast rule flags the swatch labels rather than the system.
    a11y: { test: 'off' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** What a token resolves to, and whether it reaches the browser at all. */
interface Resolved {
  /** The declared token stream. Empty when the token never shipped. */
  declared: string;
  /** The same value after the browser has done the arithmetic. */
  computed: string;
}

/**
 * **A token has to be measured through a real CSS property, not read.**
 *
 * `getComputedStyle(el).getPropertyValue('--radius-md')` returns the *declared*
 * token stream — literally `calc(1.375rem * 8 / 11)` — because an unregistered
 * custom property has no computed value beyond its text. The first draft of
 * this page printed exactly that in the column labelled "px". Assigning the
 * token to a property the browser must resolve is what turns it into a number.
 *
 * The empty `declared` case is not defensive padding either. **Tailwind emits an
 * `@theme` variable only where something references it**, so a step no component
 * uses — the 2xl radius, today — is declared in the source and absent from the
 * shipped stylesheet. A page that assumed every declared token exists would
 * print a blank cell and look broken; this one says so.
 *
 * **Do not spell that token's full name anywhere in this file.** Tailwind scans
 * source *text* and treats a `--custom-property` name as a reference wherever it
 * finds one — a JSDoc comment included. Writing it out emits the variable into
 * the application bundle, so a sentence describing an unused token makes it
 * used. Measured: deleting the mention takes the declaration from 1 occurrence
 * to 0 in `dist`.
 *
 * A story may do this; a component may not. Nothing in `src/components` reads
 * the DOM during render, because that is what keeps the system
 * server-renderable — but a documentation page is a client-only leaf, and this
 * coupling is what stops it stating a number the CSS no longer holds.
 */
function useScale(
  names: readonly string[],
  property: 'width' | 'transitionDuration' = 'width',
): Record<string, Resolved> {
  const key = names.join(',');
  const [values, setValues] = useState<Record<string, Resolved>>({});

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);

    const entries = key.split(',').map((name): [string, Resolved] => {
      const declared = root.getPropertyValue(name).trim();
      if (!declared) return [name, { declared: '', computed: '' }];

      const cssProperty = property === 'width' ? 'width' : 'transition-duration';
      probe.style.setProperty(cssProperty, `var(${name})`);
      const computed = getComputedStyle(probe)[property];
      probe.style.removeProperty(cssProperty);

      return [name, { declared, computed }];
    });

    probe.remove();
    setValues(Object.fromEntries(entries));
  }, [key, property]);

  return values;
}

/** Reads a token's declared text only — right for literals like a shadow or a curve. */
function useLiterals(names: readonly string[]): Record<string, string> {
  const key = names.join(',');
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setValues(
      Object.fromEntries(
        key.split(',').map((name) => [name, root.getPropertyValue(name).trim()]),
      ),
    );
  }, [key]);

  return values;
}

function Section({
  title,
  origin,
  children,
  lead,
}: {
  title: string;
  /** Measured from the reference file, or invented to fill a gap. */
  origin: 'measured' | 'invented' | 'mixed';
  lead: string;
  children: React.ReactNode;
}) {
  const label = {
    measured: '[FIGMA] measured',
    invented: 'invented',
    mixed: 'partly [FIGMA]',
  }[origin];

  return (
    <section className="flex flex-col gap-4 border-b border-line-subtle pb-10 last:border-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-text text-heading-lg font-semibold text-fg">{title}</h2>
          <Badge status={origin === 'invented' ? 'info' : 'success'} size="sm">
            {label}
          </Badge>
        </div>
        <p className="max-w-2xl font-text text-body-md text-fg-secondary">{lead}</p>
      </div>
      {children}
    </section>
  );
}

function Row({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-1.5">
      <code className="w-56 shrink-0 font-mono text-caption text-fg">{name}</code>
      <code className="w-28 shrink-0 font-mono text-caption text-fg-muted">{value || '—'}</code>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-10 bg-page p-8 text-fg">{children}</div>
);

/* ---------------------------------------------------------------- spacing */

const SPACING_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

export const Spacing: Story = {
  render: function Render() {
    const { '--spacing': unit } = useScale(['--spacing']);
    const base = Number.parseFloat(unit?.computed ?? '0') || 0;

    return (
      <Page>
        <Section
          title="Spacing"
          origin="invented"
          lead={`One declared unit — --spacing is ${unit?.declared ?? ''} (${unit?.computed ?? ''}) — and every numeric utility is a multiple of it. Tailwind would default to the same 4px, but leaving it undeclared means a consumer retuning their own scale silently moves every gap in this system. SpotlightContent reads var(--spacing) inside a calc(), so the value has to be ours.`}
        >
          <div className="flex flex-col gap-1">
            {SPACING_STEPS.map((step) => (
              <Row key={step} name={`p-${step} / gap-${step}`} value={`${base * step}px`}>
                <div
                  className="h-3 rounded-xs bg-brand"
                  style={{ width: `${base * step}px` }}
                />
              </Row>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

/* ----------------------------------------------------------------- radius */

const RADIUS_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill'] as const;

const RADIUS_NOTE: Partial<Record<(typeof RADIUS_STEPS)[number], string>> = {
  lg: '[FIGMA] — the nav pill and the reference’s white card',
  xl: '[FIGMA] — the hero panel',
};

export const Radius: Story = {
  render: function Render() {
    const tokens = useScale(['--radius', ...RADIUS_STEPS.map((step) => `--radius-${step}`)]);

    return (
      <Page>
        <Section
          title="Radius"
          origin="mixed"
          lead={`ONE KNOB. --radius is ${tokens['--radius']?.declared ?? ''} (${tokens['--radius']?.computed ?? ''}), measured from the reference, and every other step is a ratio of it — so "how round is this system" is a single number. The ratios are chosen to land on whole pixels: change the knob and the whole scale moves together instead of drifting apart.`}
        >
          <div className="flex flex-col gap-1">
            {RADIUS_STEPS.map((step) => {
              const token = tokens[`--radius-${step}`];
              const shipped = Boolean(token?.declared);
              return (
                <Row key={step} name={`rounded-${step}`} value={token?.computed ?? ''}>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-24 bg-brand"
                      style={{ borderRadius: `var(--radius-${step})` }}
                    />
                    <span className="font-text text-caption text-fg-muted">
                      {shipped
                        ? (RADIUS_NOTE[step] ?? 'derived from the knob')
                        : 'not in this stylesheet — Tailwind emits an @theme variable only where something references it'}
                    </span>
                  </div>
                </Row>
              );
            })}
          </div>
          <p className="max-w-2xl font-text text-body-sm text-fg-muted">
            <strong>
              The <code className="font-mono">2xl</code> step is declared and no component uses
              it.
            </strong>{' '}
            Tailwind emits an <code className="font-mono">@theme</code> variable only where
            something references it, so a step nothing uses looks identical to a working one
            until you go looking — the same trap the motion scale was in.
          </p>
          <p className="max-w-2xl font-text text-body-sm text-fg-muted">
            <strong>And writing that sentence used to break it.</strong> An earlier draft
            spelled the utility out in full, inside a <code className="font-mono">code</code>{' '}
            tag. Tailwind finds classes by scanning source <em>text</em> and does not care that
            this one sits in a paragraph explaining that nothing uses it — so the class was
            generated, the variable was pulled into the application bundle, and the claim
            falsified itself. The step is named without its prefix above for that reason.
          </p>
          <p className="max-w-2xl font-text text-body-sm text-fg-muted">
            The reference file contradicts itself here and{' '}
            <strong>22 is the deliberate answer</strong>: its white card and nav pill are both
            22, its black card is 24. Two nodes against one — and because every step is a ratio
            of one knob, adopting 24 would push <code className="font-mono">--radius-md</code>{' '}
            off 16px and <code className="font-mono">--radius-xl</code> off the panel’s measured
            32px.
          </p>
        </Section>
      </Page>
    );
  },
};

/* -------------------------------------------------------------- elevation */

const ELEVATIONS = ['resting', 'raised', 'overlay'] as const;

export const Elevation: Story = {
  render: function Render() {
    const tokens = useLiterals(ELEVATIONS.map((name) => `--elevation-${name}`));

    return (
      <Page>
        <Section
          title="Elevation"
          origin="invented"
          lead="The one visual layer that is CONTEXT-DEPENDENT rather than absolute. A near-black shadow is invisible on a near-black surface, so a dark Card, a Dialog and a Tooltip would all cast nothing exactly where they most need to read as floating. Each context therefore re-points these to a ring of light plus a deeper shadow, instead of a shadow alone."
        >
          {[
            ['on a page', 'bg-page'],
            ['on ctx-inverse', 'ctx-inverse bg-page'],
            ['on ctx-brand', 'ctx-brand bg-brand'],
          ].map(([label, contextClass]) => (
            <div key={label} className="flex flex-col gap-3">
              <h3 className="font-text text-body-sm font-medium text-fg-muted">{label}</h3>
              <div className={`flex flex-wrap gap-8 rounded-md p-8 ${contextClass}`}>
                {ELEVATIONS.map((name) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div
                      className="h-20 w-32 rounded-md bg-raised"
                      style={{ boxShadow: `var(--elevation-${name})` }}
                    />
                    <code className="font-mono text-caption text-fg-secondary">{name}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1 pt-2">
            {ELEVATIONS.map((name) => (
              <Row key={name} name={`--elevation-${name}`} value="">
                <code className="font-mono text-caption break-all text-fg-muted">
                  {tokens[`--elevation-${name}`]}
                </code>
              </Row>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

/* ----------------------------------------------------------------- motion */

const DURATIONS = ['fast', 'base', 'slow'] as const;
const ANIMATIONS = [
  ['fade-in', 'animate-fade-in'],
  ['fade-out', 'animate-fade-out'],
  ['pop-in', 'animate-pop-in'],
  ['pop-out', 'animate-pop-out'],
  ['slide-down', 'animate-slide-down'],
] as const;

export const Motion: Story = {
  render: function Render() {
    const durations = useScale(
      DURATIONS.map((step) => `--duration-${step}`),
      'transitionDuration',
    );
    const curves = useLiterals(['--ease-out', '--ease-in-out']);

    return (
      <Page>
        <Section
          title="Motion"
          origin="invented"
          lead="Three durations and two curves. --ease-out IS a Tailwind theme namespace, so declaring it replaces Tailwind's own ease-out rather than sitting beside it — every ease-out utility in the components is already on this curve."
        >
          <div className="flex flex-col gap-1">
            {DURATIONS.map((step) => (
              <Row
                key={step}
                name={`duration-${step}`}
                value={durations[`--duration-${step}`]?.computed ?? ''}
              />
            ))}
            <Row name="ease-out" value={curves['--ease-out'] ?? ''} />
            <Row name="ease-in-out" value={curves['--ease-in-out'] ?? ''} />
          </div>

          <h3 className="pt-2 font-text text-body-sm font-medium text-fg-muted">
            The named animations. Exits are real @keyframes, never transitions — Radix keeps a
            closing node mounted only for the duration of a NAMED animation.
          </h3>
          <div className="flex flex-wrap gap-6">
            {ANIMATIONS.map(([name, className]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className={`h-16 w-24 rounded-md bg-brand ${className}`} />
                <code className="font-mono text-caption text-fg-secondary">{name}</code>
              </div>
            ))}
          </div>
          <p className="max-w-2xl font-text text-body-sm text-fg-muted">
            Under <code className="font-mono">prefers-reduced-motion: reduce</code> every one of
            these collapses to 0.01ms and <strong>keeps its name</strong>. Setting{' '}
            <code className="font-mono">animation: none</code> instead would satisfy “no motion”
            and strand every closing overlay in the DOM.
          </p>
        </Section>
      </Page>
    );
  },
};

/* ------------------------------------------------------------ breakpoints */

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export const Breakpoints: Story = {
  render: function Render() {
    const tokens = useScale(BREAKPOINTS.map((name) => `--breakpoint-${name}`));

    return (
      <Page>
        <Section
          title="Breakpoints"
          origin="invented"
          lead="Tailwind's own five, declared explicitly rather than inherited. Declaring them is what lets the test harness and the Storybook viewports both READ them: vite.config.ts parses this file for the widths the suite runs at, so a retuned breakpoint moves the tests with it instead of leaving them asserting either side of a line that moved."
        >
          <div className="flex flex-col gap-1">
            {BREAKPOINTS.map((name) => {
              return (
                <Row
                  key={name}
                  name={`${name}:`}
                  value={tokens[`--breakpoint-${name}`]?.computed ?? ''}
                >
                  {name === 'md' ? (
                    <span className="font-text text-caption text-fg-muted">
                      the only reflow the system has — where the artwork rejoins the layout
                    </span>
                  ) : null}
                </Row>
              );
            })}
          </div>
        </Section>
      </Page>
    );
  },
};

/* ------------------------------------------------------------ icon sizing */

const ICONS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export const IconSizes: Story = {
  render: function Render() {
    const tokens = useScale(ICONS.map((name) => `--icon-${name}`));

    return (
      <Page>
        <Section
          title="Icon sizes"
          origin="invented"
          lead="Not a Tailwind namespace, so no utility is generated from it. A component sets [--icon-size:var(--icon-md)] and every icon inside follows — which is why an icon inside a Button matches the Button's size without the caller passing anything."
        >
          <div className="flex flex-col gap-1">
            {ICONS.map((name) => {
              return (
                <Row
                  key={name}
                  name={`--icon-${name}`}
                  value={tokens[`--icon-${name}`]?.computed ?? ''}
                >
                  <div
                    className="rounded-xs bg-fg"
                    style={{ width: `var(--icon-${name})`, height: `var(--icon-${name})` }}
                  />
                </Row>
              );
            })}
          </div>
        </Section>
      </Page>
    );
  },
};

/* --------------------------------------------------------- stacking order */

const LAYERS = [
  'base',
  'raised',
  'ornament',
  'sticky',
  'scrim',
  'modal',
  'popover',
  'tooltip',
  'toast',
] as const;

export const StackingOrder: Story = {
  render: function Render() {
    const tokens = useLiterals(LAYERS.map((name) => `--z-${name}`));

    return (
      <Page>
        <Section
          title="Stacking order"
          origin="invented"
          lead="Nine named layers. These are SEMANTIC tokens rather than primitives, because with z-index the name is the meaning: 50 means nothing, modal means something. A component names its layer and never writes a number — grep -rn 'z-[0-9]' src/ must stay empty."
        >
          <div className="flex flex-col gap-1">
            {LAYERS.map((name) => (
              <Row key={name} name={`z-${name}`} value={tokens[`--z-${name}`] ?? ''}>
                {name === 'tooltip' ? (
                  <span className="font-text text-caption text-fg-muted">
                    above popover, because a tooltip can label a menu item
                  </span>
                ) : name === 'ornament' ? (
                  <span className="font-text text-caption text-fg-muted">
                    above raised, because a CornerGlint must stay over artwork that overhangs
                    the panel edge
                  </span>
                ) : null}
              </Row>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};
