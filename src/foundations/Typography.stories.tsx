import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen', a11y: { test: 'off' } },
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

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">
            Display — Luckiest Guy
          </h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            A single-weight decorative face. It carries the brand and nothing else. It has no
            weight range, no true lowercase design, and it is unreadable below about 24px, so
            the system permits it at display sizes only.
          </p>
        </div>
        {DISPLAY.map((step) => (
          <div key={step.cls} className="flex flex-col gap-1 border-b border-line-subtle pb-5">
            <span className="font-mono text-caption text-fg-muted">
              {step.cls} · {step.px}
            </span>
            <span className={`font-display text-fg ${step.cls}`}>Bring your worlds</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-text text-heading-lg font-semibold text-fg">Text — Fredoka</h2>
          <p className="mt-1 max-w-2xl font-text text-body-md text-fg-secondary">
            The working face, and the one that does 95% of the job. Fredoka is a real text
            family with a 300&ndash;600 weight range, which is why the system can use it for
            headings, labels, and body copy without reaching for a second family.
          </p>
        </div>
        {TEXT.map((step) => (
          <div key={step.cls} className="flex flex-col gap-1 border-b border-line-subtle pb-5">
            <span className="font-mono text-caption text-fg-muted">
              {step.cls} · {step.px}
            </span>
            <span className={`font-text text-fg ${step.cls}`}>
              Whether you create chibi characters, digital comics, or lively cartoon animations.
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
          That is tight enough to work for one line and to crowd badly across three. The system
          ships 1.44 instead. Both are shown below at the same width.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-line-subtle p-5">
            <div className="mb-3 font-mono text-caption text-fg-muted">
              Reference: 18px / 20px (1.11)
            </div>
            <p className="font-text text-fg" style={{ fontSize: '18px', lineHeight: '20px' }}>
              Whether you create chibi characters, digital comics, or lively cartoon animations,
              we give you the tools to design, display, and sell your work beautifully.
            </p>
          </div>
          <div className="rounded-md border border-line-subtle p-5">
            <div className="mb-3 font-mono text-caption text-fg-muted">
              System: text-body-lg — 18px / 26px (1.44)
            </div>
            <p className="font-text text-body-lg text-fg">
              Whether you create chibi characters, digital comics, or lively cartoon animations,
              we give you the tools to design, display, and sell your work beautifully.
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
};
