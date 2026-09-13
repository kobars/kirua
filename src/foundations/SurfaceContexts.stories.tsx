import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Chip,
  IconButton,
  SearchIcon,
} from '@/components';
import { contrastRatio, formatRatio, grade, resolveColor, type Rgb } from '@/lib/contrast';

const meta = {
  title: 'Foundations/Surface contexts',
  parameters: {
    layout: 'fullscreen',
    surface: 'none',
    // Token specimens, as on the other foundations pages: the automated rule
    // flags the swatch captions rather than anything the system ships.
    a11y: { test: 'off' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CONTEXTS = [
  {
    name: 'page',
    className: 'bg-page',
    note: 'Default page surface in light mode.',
  },
  {
    name: 'ctx-brand',
    className: 'ctx-brand bg-brand',
    note: 'Brand panels use high-contrast text. Build hierarchy with size and weight instead of reducing text opacity.',
  },
  {
    name: 'ctx-inverse',
    className: 'ctx-inverse bg-page',
    note: 'An inverse panel, used by the dark Card and NavBar. Pair this context with bg-page to retain its dark fill in both modes.',
  },
  {
    name: 'dark',
    className: 'dark bg-page',
    note: 'Dark mode changes the document palette. The same components use the resulting colour roles.',
  },
] as const;

function Specimen() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Enroll</Button>
        <Button variant="secondary">Explore</Button>
        <Button variant="ghost">Later</Button>
        <IconButton aria-label="Search the gallery" variant="secondary">
          <SearchIcon />
        </IconButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge status="success">Published</Badge>
        <Badge status="danger">Failed</Badge>
        <Chip variant="brand">+1M Likes</Chip>
      </div>
      <Card padding="md" className="max-w-sm">
        <CardTitle>A card on this surface</CardTitle>
        <CardBody>Body copy, at the secondary weight this context assigns it.</CardBody>
      </Card>
    </div>
  );
}

export const TheFourSurfaces: Story = {
  render: () => (
    <div className="flex flex-col">
      {CONTEXTS.map((context) => (
        <section key={context.name} className={`flex flex-col gap-4 p-8 ${context.className}`}>
          <div className="flex flex-col gap-1">
            <code className="font-mono text-body-md font-semibold text-fg">
              .{context.name}
            </code>
            <p className="max-w-2xl font-text text-body-sm text-fg-secondary">{context.note}</p>
          </div>
          <Specimen />
          {context.name === 'ctx-brand' ? (
            <p className="max-w-2xl font-text text-caption text-fg-secondary">
              <strong>Context check:</strong> the brand <code>Chip</code> keeps its blue fill
              here, but its semantic border resolves to the context&apos;s translucent white
              line. The boundary stays visible without re-pointing{' '}
              <code>--color-surface-brand</code>, which would also recolour the panel that
              declares this context.
            </p>
          ) : null}
        </section>
      ))}
    </div>
  ),
};

/**
 * Reads a token *inside* a context and grades it. Resolving from
 * `document.documentElement` instead would return the `:root` value and report
 * the light palette four times — which is the mistake the field audit test
 * exists to make impossible.
 */
function useContextRatio(
  contextClass: string,
  foreground: string,
  background: string,
): { ratio: number; level: string } | null {
  const [result, setResult] = useState<{ ratio: number; level: string } | null>(null);

  useEffect(() => {
    const host = document.createElement('div');
    host.className = contextClass;
    document.body.appendChild(host);

    const read = (token: string, backdrop?: Rgb): Rgb => {
      const probe = document.createElement('div');
      host.appendChild(probe);
      probe.style.color = `var(${token})`;
      const value = getComputedStyle(probe).color;
      probe.remove();
      return resolveColor(value, backdrop);
    };

    const page = read('--color-surface-page');
    const back = read(background, page);
    const front = read(foreground, back);
    const ratio = contrastRatio(front, back);

    host.remove();
    setResult({ ratio, level: grade(ratio) });
  }, [contextClass, foreground, background]);

  return result;
}

const FIELD_PAIRS = [
  ['text', '--color-field-fg', '--color-field-bg', 'AA — a field is body text'],
  [
    'placeholder',
    '--color-field-placeholder',
    '--color-field-bg',
    'AA — a placeholder IS text',
  ],
  [
    'border',
    '--color-field-border',
    '--color-field-bg',
    '3:1 — a control boundary, WCAG 1.4.11',
  ],
  ['border, hover', '--color-field-border-hover', '--color-field-bg', '3:1'],
  ['border, invalid', '--color-field-border-invalid', '--color-field-bg', '3:1'],
  ['selected row', '--color-field-selected-fg', '--color-field-selected-bg', 'AA'],
] as const;

function FieldRow({
  contextClass,
  label,
  foreground,
  background,
  requirement,
}: {
  contextClass: string;
  label: string;
  foreground: string;
  background: string;
  requirement: string;
}) {
  const measured = useContextRatio(contextClass, foreground, background);

  return (
    <div className="flex flex-wrap items-center gap-4 py-1.5">
      <span className="w-32 shrink-0 font-text text-caption text-fg">{label}</span>
      <span
        className="flex h-9 w-40 shrink-0 items-center rounded-sm border px-3 font-text text-caption"
        style={{
          background: `var(${background})`,
          color: `var(${foreground})`,
          borderColor: `var(--color-field-border)`,
        }}
      >
        Sample
      </span>
      <code className="w-20 shrink-0 font-mono text-caption text-fg">
        {measured ? formatRatio(measured.ratio) : '…'}
      </code>
      <code className="w-20 shrink-0 font-mono text-caption text-fg-secondary">
        {measured?.level ?? ''}
      </code>
      <span className="font-text text-caption text-fg-secondary">{requirement}</span>
    </div>
  );
}

export const FieldTokens: Story = {
  render: () => (
    <div className="flex flex-col">
      {CONTEXTS.map((context) => (
        <section key={context.name} className={`flex flex-col gap-3 p-8 ${context.className}`}>
          <code className="font-mono text-body-md font-semibold text-fg">.{context.name}</code>
          <div className="flex flex-col">
            {FIELD_PAIRS.map(([label, foreground, background, requirement]) => (
              <FieldRow
                key={label}
                contextClass={context.className}
                label={label}
                foreground={foreground}
                background={background}
                requirement={requirement}
              />
            ))}
          </div>
          <p className="max-w-2xl font-text text-caption text-fg-secondary">
            Inactive controls are exempt from the text contrast requirement. Keep their labels
            understandable and distinguish the disabled state beyond colour where possible.
          </p>
        </section>
      ))}
    </div>
  ),
};
