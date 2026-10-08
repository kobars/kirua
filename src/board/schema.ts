import { z } from 'zod';
import { type Document, parseBundle } from './okf';

/**
 * The board's schema, in Zod, so the app gets parsing and types from one
 * definition. It parses; it does not enforce. The board's own validator
 * decides whether a bundle is valid, runs in a pre-commit hook with zero
 * dependencies, and stays the authority — if the two disagree about what a
 * valid card is, this file is wrong.
 *
 * Every frontmatter value arrives as a string, because `okf.ts` reads the
 * same YAML subset the board's reader does and neither guesses at types. The
 * coercions below are where a string becomes a number or a boolean, and
 * nowhere else.
 */

export const STORED_STATES = ['backlog', 'doing', 'blocked', 'done', 'held'] as const;
export type StoredState = (typeof STORED_STATES)[number];
/** The columns the board shows. `ready` is derived, never stored. */
export const COLUMNS = ['backlog', 'ready', 'doing', 'blocked', 'done', 'held'] as const;
export type Column = (typeof COLUMNS)[number];

const integer = z.string().regex(/^\d+$/, 'must be a whole number').transform(Number);
const yesNo = z.enum(['true', 'false']).transform((v) => v === 'true');
const resource = z
  .string()
  .regex(/^\/.+\.md$/, 'must be a bundle-relative path like /tasks/x.md');
/** `depends_on` may be absent, one path, or a list of paths. */
const resources = z
  .union([resource, z.array(resource), z.null()])
  .optional()
  .transform((v) => (v == null ? [] : Array.isArray(v) ? v : [v]));

const concept = z.object({
  type: z.string().min(1, 'OKF requires a non-empty `type`'),
  title: z.string().min(1),
  description: z.string().default(''),
  resource,
  tags: z.array(z.string()).default([]),
});

export const TaskSchema = concept.extend({
  type: z.literal('Task'),
  state: z.enum(STORED_STATES, {
    error: (issue) =>
      issue.input === 'ready'
        ? '`ready` is derived from the graph, never stored'
        : `state must be one of ${STORED_STATES.join(', ')}`,
  }),
  epic: resource,
  priority: integer,
  depends_on: resources,
});

export const EpicSchema = concept.extend({
  type: z.literal('Epic'),
  carded: yesNo.default(true),
});

export const DecisionSchema = concept.extend({ type: z.literal('Decision') });

export type Task = z.infer<typeof TaskSchema> & { body: string };
export type Epic = z.infer<typeof EpicSchema> & { body: string };
export type Decision = z.infer<typeof DecisionSchema> & { body: string };

export interface BoardError {
  resource: string;
  message: string;
}

export interface Board {
  tasks: Task[];
  epics: Epic[];
  decisions: Decision[];
  /** Every document that is neither reserved nor one of the three above. */
  others: Document[];
  errors: BoardError[];
}

/** One line a person can act on: the file, the field, what was wrong. */
function readable(resource: string, error: z.ZodError): string {
  return error.issues
    .map((issue) => `${resource}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    .join('\n');
}

const SCHEMAS = { Task: TaskSchema, Epic: EpicSchema, Decision: DecisionSchema } as const;

/** Reads a bundle into typed concepts. Never throws: a broken card becomes an
 *  entry in `errors`, so the rest of the board still renders. */
export function parseBoard(files: Record<string, string>): Board {
  const board: Board = { tasks: [], epics: [], decisions: [], others: [], errors: [] };

  for (const doc of parseBundle(files)) {
    if (doc.reserved) continue;
    if (doc.error || !doc.data) {
      board.errors.push({ resource: doc.resource, message: doc.error ?? 'no frontmatter' });
      continue;
    }
    // The template is a task-shaped document with placeholder values; the
    // original reader drops it by name and so does this one.
    if (doc.resource.endsWith('/_template.md')) continue;

    const type = doc.data['type'];
    const schema =
      typeof type === 'string' && type in SCHEMAS
        ? SCHEMAS[type as keyof typeof SCHEMAS]
        : null;
    if (!schema) {
      board.others.push(doc);
      continue;
    }
    const result = schema.safeParse(doc.data);
    if (!result.success) {
      board.errors.push({
        resource: doc.resource,
        message: readable(doc.resource, result.error),
      });
      continue;
    }
    const parsed = { ...result.data, body: doc.body };
    if (parsed.type === 'Task') board.tasks.push(parsed as Task);
    else if (parsed.type === 'Epic') board.epics.push(parsed as Epic);
    else board.decisions.push(parsed as Decision);
  }

  board.tasks.sort((a, b) => a.priority - b.priority || a.resource.localeCompare(b.resource));
  return board;
}

/** `ready` = stored `backlog` and every dependency is `done`. The same rule as
 *  the board reader's own `computeReady`, including its quiet half: a
 *  dependency that does not resolve is not `done`, so the task is not ready. */
export function computeReady(tasks: readonly Task[]): Set<string> {
  const state = new Map(tasks.map((t) => [t.resource, t.state]));
  return new Set(
    tasks
      .filter((t) => t.state === 'backlog')
      .filter((t) => t.depends_on.every((d) => state.get(d) === 'done'))
      .map((t) => t.resource),
  );
}

/** The column a task is shown in. */
export function columnOf(task: Task, ready: ReadonlySet<string>): Column {
  return task.state === 'backlog' && ready.has(task.resource) ? 'ready' : task.state;
}

/** Column counts, in the validator's own format: `backlog 1 · ready 2 · …`. */
export function columnCounts(tasks: readonly Task[]): Record<Column, number> {
  const ready = computeReady(tasks);
  const counts = Object.fromEntries(COLUMNS.map((c) => [c, 0])) as Record<Column, number>;
  for (const task of tasks) counts[columnOf(task, ready)] += 1;
  return counts;
}
