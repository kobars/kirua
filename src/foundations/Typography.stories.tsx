import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* Class strings are written out in full. Tailwind scans source text literally,
 * so an interpolated `text-${name}` would never be generated. */
const DISPLAY = [
  { cls: 'text-display-2xl', px: '72 / 72' },
  { cls: 'text-display-xl', px: '65 / 67  [measured from Figma]' },
  { cls: 'text-display-lg', px: '48 / 50' },
  { cls: 'text-display-md', px: '36 / 38' },
];

const TEXT = [
  { cls: 'text-heading-lg', px: '28 / 34' },
  { cls: 'text-heading-md', px: '22 / 28' },
  { cls: 'text-heading-sm', px: '18 / 24' },
  { cls: 'text-body-lg', px: '18 / 26  [Figma had 18 / 20]' },
  { cls: 'text-body-md', px: '16 / 24' },
  { cls: 'text-body-sm', px: '14 / 20' },
  { cls: 'text-caption', px: '12 / 16' },
];

const WEIGHTS = [
  { cls: 'font-light', weight: '400', role: 'reserved for large, quiet type' },
  { cls: 'font-regular', weight: '500', role: 'body copy' },
  { cls: 'font-medium', weight: '700', role: 'labels and buttons' },
  { cls: 'font-semibold', weight: '800', role: 'titles' },
];

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">
            Display — Luckiest Guy
          </h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            A single-weight decorative face that carries the brand. It has no weight range and
            no true lowercase, and it becomes hard to read below about 24px, so the system uses
            it at display sizes only.
          </p>
        </div>
        {DISPLAY.map((step) => (
          <div key={step.cls} className="flex flex-col gap-1 border-b border-line-subtle pb-5">
            <span className="font-mono text-caption text-fg-muted">
              {step.cls} · {step.px}
            </span>
            <span className={`font-display text-fg ${step.cls}`}>Show your art</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">Text — Nunito</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            The working face, used for nearly everything. Nunito is a rounded text family with a
            full weight range, so the system can use it for headings, labels and body copy
            without a second family.
          </p>
        </div>
        {TEXT.map((step) => (
          <div key={step.cls} className="flex flex-col gap-1 border-b border-line-subtle pb-5">
            <span className="font-mono text-caption text-fg-muted">
              {step.cls} · {step.px}
            </span>
            <span className={`font-text text-fg ${step.cls}`}>
              Chibi characters, digital comics and cartoon animations, all in one portfolio.
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">The weight ramp</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            Nunito looks lighter than its number suggests, and a step of 100 between two levels
            is too small to see in it. So the ramp skips: body copy at 500, labels and buttons
            at 700, titles at 800. The utilities keep their roles — a label is still{' '}
            <code className="font-mono">font-medium</code> — and the tokens carry the numbers.
          </p>
        </div>
        {WEIGHTS.map((step) => (
          <div key={step.cls} className="flex flex-col gap-1 border-b border-line-subtle pb-5">
            <span className="font-mono text-caption text-fg-muted">
              {step.cls} · {step.weight} · {step.role}
            </span>
            <span className={`font-text text-heading-sm text-fg ${step.cls}`}>
              Chibi characters, digital comics and cartoon animations, all in one portfolio.
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-text text-heading-lg font-semibold text-fg">
          Why body line height changed
        </h2>
        <p className="max-w-2xl font-text text-body-md text-fg-secondary">
          The reference file sets body copy at 18px with a 20px line height — a ratio of 1.11.
          That works for a single line and crowds badly across three, so the system ships 1.44
          instead. Both are shown below at the same width.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-line-subtle p-5">
            <div className="mb-3 font-mono text-caption text-fg-muted">
              Reference: 18px / 20px (1.11)
            </div>
            <p className="font-text text-fg" style={{ fontSize: '18px', lineHeight: '20px' }}>
              Chibi characters, digital comics, cartoon animations: give your work a portfolio
              that shows it at its best, and sell prints from the same page.
            </p>
          </div>
          <div className="rounded-md border border-line-subtle p-5">
            <div className="mb-3 font-mono text-caption text-fg-muted">
              System: text-body-lg — 18px / 26px (1.44)
            </div>
            <p className="font-text text-body-lg text-fg">
              Chibi characters, digital comics, cartoon animations: give your work a portfolio
              that shows it at its best, and sell prints from the same page.
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
};
