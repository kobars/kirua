import {
  Badge,
  type BadgeProps,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Chip,
} from '@/components';
import { parseBundle } from './okf';
import type { Source } from './sources';

export interface BoardAppProps {
  source: Source;
}

/** The stored states, and the tone each one reads as. `ready` is not here
 *  because it is never stored — the schema card derives it from the graph. */
const TONE: Record<string, BadgeProps['status']> = {
  backlog: 'neutral',
  doing: 'warning',
  blocked: 'danger',
  done: 'success',
  held: 'info',
};

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

/**
 * The skeleton: one page, every task in the bundle as a `Card`, the bundle's
 * own title above them. It exists to prove the wiring — markdown in, a real
 * component out — before the six columns arrive. Nothing here names a colour,
 * a spacing or a radius; every one comes from the component it is rendered by.
 *
 * @example <BoardApp source={sample} />
 */
export function BoardApp({ source }: BoardAppProps) {
  const documents = parseBundle(source.files);
  const index = documents.find((d) => d.resource === '/index.md');
  const title = index?.body.match(/^# (.+)$/m)?.[1] ?? 'Board';
  const tasks = documents.filter(
    (d) => d.data?.['type'] === 'Task' && !d.resource.endsWith('/_template.md'),
  );
  const broken = documents.filter((d) => d.error);

  return (
    <main data-slot="board-app" className="mx-auto flex max-w-5xl flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-wrap items-center gap-4">
        <h1 className="font-display text-display-md text-fg">{title}</h1>
        <Chip variant="outline" size="sm">
          {source.name === 'board' ? 'local board' : 'sample bundle'}
        </Chip>
      </header>

      {broken.length > 0 && (
        <Card variant="light" padding="md">
          <CardEyebrow>Could not read</CardEyebrow>
          <ul className="mt-1 font-text text-body-md text-fg-secondary">
            {broken.map((d) => (
              <li key={d.resource}>
                {d.resource}: {d.error}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => {
          const state = text(task.data?.['state']);
          return (
            <li key={task.resource}>
              <Card padding="md" className="h-full">
                <CardEyebrow className="flex items-center gap-2">
                  <Badge status={TONE[state] ?? 'neutral'} size="sm">
                    {state}
                  </Badge>
                  <span>{task.resource}</span>
                </CardEyebrow>
                <CardTitle as="h2" className="mt-2 text-heading-lg">
                  {text(task.data?.['title'])}
                </CardTitle>
                <CardBody className="mt-1">{text(task.data?.['description'])}</CardBody>
              </Card>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
