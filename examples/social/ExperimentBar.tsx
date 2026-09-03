/** TEMPORARY — the control for the experiment in `experiment.ts`. */
import { Badge, Button, ButtonGroup, Text } from 'kirua';
import { SURFACES, type CardSurface } from './experiment';

export interface ExperimentBarProps {
  value: CardSurface;
  onChange: (next: CardSurface) => void;
}

export function ExperimentBar({ value, onChange }: ExperimentBarProps) {
  const current = SURFACES.find((s) => s.id === value);

  return (
    <aside
      aria-label="Style experiment"
      className="grid gap-2 rounded-lg border border-dashed border-line bg-sunken p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge status="warning">experiment</Badge>
        <span className="text-body-sm text-fg-secondary">Post card surface</span>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <ButtonGroup aria-label="Post card surface">
          {SURFACES.map((surface) => (
            <Button
              key={surface.id}
              variant="secondary"
              size="sm"
              aria-pressed={value === surface.id}
              onClick={() => onChange(surface.id)}
              className={value === surface.id ? 'bg-selected text-on-selected' : undefined}
            >
              {surface.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <Text size="caption" tone="muted">
        {current?.note} — switch light and dark in the theme menu to see both.
      </Text>
    </aside>
  );
}
