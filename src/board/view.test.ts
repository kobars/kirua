import { describe, expect, it } from 'vitest';
import { parseBoard } from './schema';
import { sample } from './sources';
import { ALL_EPICS, COLUMN_VIEW, epicTitles, filterTasks, slug, waitingOn } from './view';

/** Against the committed sample bundle rather than fixtures, which would let
 *  the rules and the bundle the view renders drift apart. */
const board = parseBoard(sample.files);
const titles = epicTitles(board.epics);
const view = (over: Partial<{ query: string; epic: string }> = {}) => ({
  query: '',
  epic: ALL_EPICS,
  ...over,
});

const titlesOf = (query: Partial<{ query: string; epic: string }>) =>
  filterTasks(board.tasks, titles, view(query))
    .map((task) => task.title)
    .sort();

describe('the sample bundle parses at all, so an empty board cannot pass', () => {
  it('has tasks and epics', () => {
    expect(board.errors).toEqual([]);
    expect(board.tasks.length).toBeGreaterThan(0);
    expect(board.epics.length).toBeGreaterThan(0);
  });
});

describe('filterTasks', () => {
  it('shows everything when neither filter is set', () => {
    expect(filterTasks(board.tasks, titles, view())).toHaveLength(board.tasks.length);
  });

  it('matches the title', () => {
    expect(titlesOf({ query: 'changelog' })).toEqual(['Add a changelog page']);
  });

  it('matches the slug, which no visible text repeats', () => {
    // The title is "Write the home page", so the hyphenated form matches only
    // if the slug is in the haystack.
    expect(titlesOf({ query: 'write-home' })).toEqual(['Write the home page']);
  });

  it('matches the epic title, which the card shows but does not repeat in prose', () => {
    const delivery = board.epics.find((epic) => epic.title === 'Delivery')!;
    expect(titlesOf({ query: 'delivery' })).toEqual(titlesOf({ epic: delivery.resource }));
  });

  it('ignores case and surrounding space', () => {
    expect(titlesOf({ query: '  CHANGELOG ' })).toEqual(['Add a changelog page']);
  });

  it('keeps the priority order it was given, so a column stays ordered', () => {
    // Reversed input, because the sample's own order would pass either way.
    const reversed = [...board.tasks].reverse();
    expect(filterTasks(reversed, titles, view()).map((task) => task.priority)).toEqual(
      reversed.map((task) => task.priority),
    );
    expect(filterTasks(board.tasks, titles, view()).map((task) => task.priority)).toEqual(
      [...board.tasks.map((task) => task.priority)].sort((a, b) => a - b),
    );
  });

  it('combines the two filters rather than widening', () => {
    const content = board.epics.find((epic) => epic.title === 'Content')!;
    expect(titlesOf({ epic: content.resource, query: 'domain' })).toEqual([]);
    expect(titlesOf({ query: 'domain' })).toEqual(['Point the custom domain at the site']);
  });
});

describe('waitingOn', () => {
  it('names only the dependencies that are not done', () => {
    for (const task of board.tasks) {
      const waiting = waitingOn(task, board.tasks);
      expect(waiting.length).toBeLessThanOrEqual(task.depends_on.length);
      for (const name of waiting) {
        const dependency = board.tasks.find((t) => slug(t.resource) === name);
        expect(dependency?.state).not.toBe('done');
      }
    }
  });

  it('counts an unresolvable dependency as not done, matching computeReady', () => {
    const orphan = { ...board.tasks[0]!, depends_on: ['/tasks/does-not-exist.md'] };
    expect(waitingOn(orphan, board.tasks)).toEqual(['does-not-exist']);
  });
});

describe('COLUMN_VIEW', () => {
  it('covers every column exactly once', () => {
    const keys = COLUMN_VIEW.map((column) => column.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect([...keys].sort()).toEqual(
      ['backlog', 'blocked', 'done', 'held', 'ready'].concat('doing').sort(),
    );
  });

  it('leads with ready, because the board is read for what to do next', () => {
    expect(COLUMN_VIEW[0]?.key).toBe('ready');
  });
});
