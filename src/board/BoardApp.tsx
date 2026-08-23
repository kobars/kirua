import {
  Badge,
  type BadgeProps,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Chip,
} from '@/components';
import { parseDocument } from './okf';
import { type Column, columnOf, computeReady, parseBoard } from './schema';
import type { Source } from './sources';

export interface BoardAppProps {
  source: Source;
}

/** The column a task shows in, and the tone it reads as. `ready` is derived
 *  from the graph by `computeReady`, never stored on a card. */
const TONE: Record<Column, BadgeProps['status']> = {
  backlog: 'neutral',
  ready: 'info',
  doing: 'warning',
  blocked: 'danger',
  done: 'success',
  held: 'neutral',
};

/**
 * The skeleton: one page, every task in the bundle as a `Card`, the bundle's
 * own title above them. It exists to prove the wiring — markdown in, a real
 * component out — before the six columns arrive. Nothing here names a colour,
 * a spacing or a radius; every one comes from the component it is rendered by.
 *
 * @example <BoardApp source={sample} />
 */
export function BoardApp({ source }: BoardAppProps) {
  const board = parseBoard(source.files);
  const ready = computeReady(board.tasks);
  const index = source.files['/index.md'];
  const title =
    (index && parseDocument('/index.md', index).body.match(/^# (.+)$/m)?.[1]) ?? 'Board';

  return (
    <main data-slot="board-app" className="mx-auto flex max-w-5xl flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-wrap items-center gap-4">
        <h1 className="font-display text-display-md text-fg">{title}</h1>
        <Chip variant="outline" size="sm">
          {source.name === 'board' ? 'local board' : 'sample bundle'}
        </Chip>
      </header>

      {board.errors.length > 0 && (
        <Card variant="light" padding="md">
          <CardEyebrow>Could not read</CardEyebrow>
          <ul className="mt-1 font-text text-body-md text-fg-secondary">
            {board.errors.map((error) => (
              <li key={error.resource}>{error.message}</li>
            ))}
          </ul>
        </Card>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {board.tasks.map((task) => {
          const column = columnOf(task, ready);
          return (
            <li key={task.resource}>
              <Card padding="md" className="h-full">
                <CardEyebrow className="flex items-center gap-2">
                  <Badge status={TONE[column]} size="sm">
                    {column}
                  </Badge>
                  <span>{task.resource}</span>
                </CardEyebrow>
                <CardTitle as="h2" className="mt-2 text-heading-lg">
                  {task.title}
                </CardTitle>
                <CardBody className="mt-1">{task.description}</CardBody>
              </Card>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
