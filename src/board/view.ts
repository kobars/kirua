import { create } from 'zustand';
import type { Column, Epic, Task } from './schema';

/**
 * What the board is showing, and the rules that decide it. The rules take no
 * store, so they run without rendering.
 */

/** The epic filter's "no filter" value. Radix `Select` gives no meaning to the
 *  empty string, so the absence of a filter needs a name of its own. */
export const ALL_EPICS = 'all';

export interface BoardView {
  query: string;
  /** An epic's resource, or `ALL_EPICS`. */
  epic: string;
  setQuery: (query: string) => void;
  setEpic: (epic: string) => void;
  clear: () => void;
}

const EMPTY = { query: '', epic: ALL_EPICS };

export const useBoardView = create<BoardView>((set) => ({
  ...EMPTY,
  setQuery: (query) => set({ query }),
  setEpic: (epic) => set({ epic }),
  clear: () => set(EMPTY),
}));

/** `/tasks/board-app-columns.md` -> `board-app-columns`. */
export function slug(resource: string): string {
  return resource.split('/').pop()!.replace(/\.md$/, '');
}

/** Everything a card is searched by, including the slug, which no visible
 *  text repeats. Lower-cased once rather than per keystroke. */
export function haystack(task: Task, epicTitle: string): string {
  return [task.title, task.description, epicTitle, slug(task.resource)].join(' ').toLowerCase();
}

/** Epic resource -> its title, for the filter list and every card's footer. */
export function epicTitles(epics: readonly Epic[]): Map<string, string> {
  return new Map(epics.map((epic) => [epic.resource, epic.title]));
}

/** The dependencies of `task` that are not `done`. A dependency resolving to
 *  nothing counts as not done, matching `computeReady`. */
export function waitingOn(task: Task, tasks: readonly Task[]): string[] {
  return task.depends_on
    .filter((resource) => tasks.find((t) => t.resource === resource)?.state !== 'done')
    .map(slug);
}

/** The tasks both filters leave visible; text narrows the epic rather than
 *  reaching outside it. Input order is preserved. */
export function filterTasks(
  tasks: readonly Task[],
  titles: ReadonlyMap<string, string>,
  view: Pick<BoardView, 'query' | 'epic'>,
): Task[] {
  const query = view.query.trim().toLowerCase();
  return tasks.filter((task) => {
    if (view.epic !== ALL_EPICS && task.epic !== view.epic) return false;
    if (!query) return true;
    return haystack(task, titles.get(task.epic) ?? '').includes(query);
  });
}

/**
 * Reading order, which is not the declaration order of `COLUMNS` in
 * `schema.ts`: the call to action comes first. `status` is the `Badge` status
 * each count is shown with — `ready` would be the brand blue, but `Badge` has
 * no brand status, so `info` carries it.
 */
export const COLUMN_VIEW: readonly {
  key: Column;
  name: string;
  note: string;
  status: 'neutral' | 'info' | 'warning' | 'danger' | 'success';
}[] = [
  { key: 'ready', name: 'Ready', note: 'start here', status: 'info' },
  { key: 'doing', name: 'Doing', note: 'in progress', status: 'warning' },
  { key: 'blocked', name: 'Blocked', note: 'waiting on something outside', status: 'danger' },
  { key: 'backlog', name: 'Backlog', note: 'waiting on a dependency', status: 'neutral' },
  { key: 'held', name: 'Held', note: 'needs a human decision', status: 'info' },
  { key: 'done', name: 'Done', note: '', status: 'success' },
];
