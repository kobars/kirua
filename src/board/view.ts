import { create } from 'zustand';
import type { Column, Epic, Task } from './schema';

/**
 * What the board is showing, and the rules that decide it.
 *
 * The store is deliberately two values. `board/decisions/board-app-stack.md`
 * names Zustand and says why it is provisioned rather than needed yet: the
 * epic ends in keyboard navigation, multi-select and deep links, and each of
 * those is a value more than one component reads. Adding the third — the open
 * card — belongs to `board-app-detail`, not here.
 *
 * The matching rules live beside it and take no store, so they can be tested
 * without rendering. `haystack` is the same four fields `visualize.mjs`
 * searches, in the same order, because the two views must not disagree about
 * what a search finds.
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

/** `/tasks/board-app-columns.md` -> `board-app-columns`. The name a card is
 *  known by in conversation, and the last thing a search should miss. */
export function slug(resource: string): string {
  return resource.split('/').pop()!.replace(/\.md$/, '');
}

/** Everything a card is searched by, lower-cased once so the filter does not
 *  re-case it per keystroke. */
export function haystack(task: Task, epicTitle: string): string {
  return [task.title, task.description, epicTitle, slug(task.resource)].join(' ').toLowerCase();
}

/** Epic resource -> its title, for the filter list and every card's footer. */
export function epicTitles(epics: readonly Epic[]): Map<string, string> {
  return new Map(epics.map((epic) => [epic.resource, epic.title]));
}

/** The dependencies of `task` that are not `done` yet — the reason a card sits
 *  in the backlog, named. A dependency that resolves to nothing is *not* done,
 *  so it is listed; that matches `computeReady`, which refuses to call such a
 *  task ready. */
export function waitingOn(task: Task, tasks: readonly Task[]): string[] {
  return task.depends_on
    .filter((resource) => tasks.find((t) => t.resource === resource)?.state !== 'done')
    .map(slug);
}

/** The tasks the two filters leave visible. Both are conjunctive: text narrows
 *  the epic's cards rather than reaching outside it. */
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
 * The order the columns are read in, which is not the order they are declared
 * in. `COLUMNS` in `schema.ts` is the canonical list and starts at the stored
 * states; a person opening the board wants the call to action first, so this
 * matches `visualize.mjs`: ready, then what is moving, then what is stuck.
 *
 * `status` is the `Badge` status each column's count is shown with. Five of the
 * six map onto a status token by meaning. `ready` is the exception and is
 * recorded on the task card: the transcription paints it with the brand blue,
 * and `Badge` has no brand status, so `info` carries it here.
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
