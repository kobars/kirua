import { useEffect, useRef } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Chip,
  Code,
  EmptyState,
  Field,
  Heading,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@/components';
import { parseDocument } from './okf';
import { columnOf, computeReady, parseBoard, type Task } from './schema';
import type { Source } from './sources';
import {
  ALL_EPICS,
  COLUMN_VIEW,
  epicTitles,
  filterTasks,
  useBoardView,
  waitingOn,
} from './view';

export interface BoardAppProps {
  source: Source;
}

/**
 * One card, on a brand surface.
 *
 * `Card variant="brand"` is `ctx-brand bg-brand text-fg`, and inside that
 * context two rules bind that do not bind elsewhere. `text-secondary` is
 * identical to `text-primary`, so hierarchy comes from size and weight rather
 * than opacity. `text-muted` is 3.16:1 and is reserved for dividers and
 * ornament, so nothing here is `tone="muted"` however quiet it should look.
 */
function TaskCard({ task, epic, waiting }: { task: Task; epic: string; waiting: string[] }) {
  return (
    <Card variant="brand" padding="sm" radius="lg" className="h-full">
      {/* `CardTitle` is `text-heading-lg` — 28px, sized for a card that owns a
          page rather than one of a hundred in a column. It has no size axis,
          so a dense board overrides it here. */}
      <CardTitle as="h3" className="text-heading-sm">
        {task.title}
      </CardTitle>
      <CardBody className="mt-2 text-body-sm">{task.description}</CardBody>
      <CardFooter className="mt-3 justify-between gap-2 pt-0">
        <Chip variant="outline" size="sm">
          {epic}
        </Chip>
        <Text inline size="caption" tone="secondary">
          p{task.priority}
        </Text>
      </CardFooter>
      {waiting.length > 0 && (
        /* The words carry the meaning, not a colour: the status ramp is not
           re-pointed on a brand surface, and red-900 there is 1.86:1. */
        <Text size="caption" tone="secondary" className="mt-2">
          waits on{' '}
          {waiting.map((name, index) => (
            <span key={name}>
              {index > 0 && ', '}
              <Code>{name}</Code>
            </span>
          ))}
        </Text>
      )}
    </Card>
  );
}

/**
 * The board, as six columns built from imported components rather than
 * transcribed ones. Nothing here writes a colour, a spacing or a radius: every
 * one arrives through `Card`, `Chip`, `Badge`, `ScrollArea` or a token utility,
 * which is what makes the drift `board/tools/visualize.mjs` suffered — five of
 * nine surfaces carrying numbers copied from nowhere — structurally impossible.
 *
 * `ready` is never read off a card. `computeReady` walks the dependency graph
 * and `parity.node.test.ts` holds that walk against `okf.mjs`, the validator
 * that decides the question.
 *
 * @example <BoardApp source={sample} />
 */
export function BoardApp({ source }: BoardAppProps) {
  const board = parseBoard(source.files);
  const ready = computeReady(board.tasks);
  const titles = epicTitles(board.epics);
  const index = source.files['/index.md'];
  const title =
    (index && parseDocument('/index.md', index).body.match(/^# (.+)$/m)?.[1]) ?? 'Board';

  const query = useBoardView((view) => view.query);
  const epic = useBoardView((view) => view.epic);
  const setQuery = useBoardView((view) => view.setQuery);
  const setEpic = useBoardView((view) => view.setEpic);
  const clear = useBoardView((view) => view.clear);

  const shown = filterTasks(board.tasks, titles, { query, epic });
  const filtered = query.trim() !== '' || epic !== ALL_EPICS;

  /**
   * Back to the first column whenever the filter changes.
   *
   * Found by using it: scrolled to `Done`, typing a filter whose only match is
   * in `Ready` left four columns of "none" on screen under a header reading
   * "1 of 130 cards". The filter looked broken when it had worked.
   *
   * `data-slot` is the selector because it is the published contract — see
   * `board/decisions/data-slot-is-public.md` — and `ScrollArea` exposes no ref
   * to its viewport. `scrollLeft = 0` is the inline start in both reading
   * directions on every browser this repo supports.
   */
  const columns = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = columns.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (viewport) viewport.scrollLeft = 0;
  }, [query, epic]);

  return (
    <main data-slot="board-app" className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Heading as="h1" size="display-md">
            {title}
          </Heading>
          <Chip variant="outline" size="sm">
            {source.name === 'board' ? 'local board' : 'sample bundle'}
          </Chip>
          <Text size="sm">
            {shown.length} of {board.tasks.length} cards
          </Text>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <Field controlId="board-query" label="Filter cards" className="max-w-64">
            <Input
              type="search"
              value={query}
              placeholder="Title, description, epic or slug"
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>

          <Field controlId="board-epic" label="Epic" className="max-w-64">
            <Select value={epic} onValueChange={setEpic}>
              <SelectTrigger id="board-epic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent aria-label="Epic">
                <SelectItem value={ALL_EPICS}>All epics</SelectItem>
                {board.epics.map((item) => (
                  <SelectItem key={item.resource} value={item.resource}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Only while something is showing: at zero results the way out is
              the `EmptyState`'s own action, and two controls with one name is
              a worse screen than one. */}
          {filtered && shown.length > 0 && (
            <Button variant="secondary" onClick={clear}>
              Clear filters
            </Button>
          )}
        </div>
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

      {shown.length === 0 ? (
        <EmptyState
          title="No card matches"
          description="Nothing in the bundle matches this filter."
          action={
            <Button variant="secondary" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      ) : (
        /* The row scrolls sideways rather than reflowing: a kanban that stacks
           at one width is a list, and the swap is where a responsive shell
           breaks. One layout at every width, and a column at 288px fits a
           320px viewport. */
        <ScrollArea ref={columns} orientation="horizontal">
          <div className="flex gap-4 pb-3">
            {COLUMN_VIEW.map((column) => {
              const mine = shown.filter((task) => columnOf(task, ready) === column.key);
              return (
                <section
                  key={column.key}
                  aria-labelledby={`board-column-${column.key}`}
                  className="flex w-72 shrink-0 flex-col gap-3 rounded-xl bg-sunken p-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Heading as="h2" id={`board-column-${column.key}`} size="heading-sm">
                        {column.name}
                      </Heading>
                      <Badge status={column.status} size="sm" className="ms-auto">
                        {mine.length}
                      </Badge>
                    </div>
                    {column.note && (
                      <Text size="caption" tone="muted">
                        {column.note}
                      </Text>
                    )}
                  </div>

                  {/* Capped and scrolled rather than run to full length: `done`
                      is 112 cards and would make the page metres tall. */}
                  <ScrollArea className="max-h-144">
                    {mine.length === 0 ? (
                      <Text size="sm" tone="muted">
                        none
                      </Text>
                    ) : (
                      <ul className="flex flex-col gap-2 pe-3">
                        {mine.map((task) => (
                          <li key={task.resource}>
                            <TaskCard
                              task={task}
                              epic={titles.get(task.epic) ?? '—'}
                              waiting={waitingOn(task, board.tasks)}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </section>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </main>
  );
}
