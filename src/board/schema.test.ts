import { describe, expect, it } from 'vitest';
import { columnCounts, computeReady, parseBoard, TaskSchema } from './schema';
import { sample } from './sources';

const card = (frontmatter: string) => ({ '/tasks/a.md': `---\n${frontmatter}\n---\nbody\n` });

const VALID = `type: Task
title: A card
description: One line.
resource: /tasks/a.md
tags: [x]
state: backlog
epic: /epics/x.md
priority: 12`;

describe('parseBoard', () => {
  it('reads a valid card into a typed task, coercing what YAML left as text', () => {
    const board = parseBoard(card(`${VALID}\ndepends_on: /tasks/b.md`));
    expect(board.errors).toEqual([]);
    expect(board.tasks).toHaveLength(1);
    const task = board.tasks[0]!;
    expect(task.priority).toBe(12);
    expect(task.depends_on).toEqual(['/tasks/b.md']);
    expect(task.body).toBe('\nbody\n');
  });

  it('fails a bad state with an error a person can act on', () => {
    const board = parseBoard(card(VALID.replace('state: backlog', 'state: soon')));
    expect(board.tasks).toEqual([]);
    expect(board.errors).toEqual([
      {
        resource: '/tasks/a.md',
        message:
          '/tasks/a.md: state — state must be one of backlog, doing, blocked, done, held',
      },
    ]);
  });

  it('rejects a stored `ready`, and says why', () => {
    const { errors } = parseBoard(card(VALID.replace('state: backlog', 'state: ready')));
    expect(errors[0]?.message).toContain('`ready` is derived from the graph, never stored');
  });

  it('rejects a priority that is not a whole number', () => {
    const { errors } = parseBoard(card(VALID.replace('priority: 12', 'priority: high')));
    expect(errors[0]?.message).toBe('/tasks/a.md: priority — must be a whole number');
  });

  it('keeps a broken file as an error without losing the rest', () => {
    const board = parseBoard({ ...card(VALID), '/tasks/b.md': 'no frontmatter' });
    expect(board.tasks).toHaveLength(1);
    expect(board.errors).toEqual([
      { resource: '/tasks/b.md', message: 'no frontmatter block' },
    ]);
  });

  it('drops the template and keeps unknown types as others', () => {
    const board = parseBoard({
      '/tasks/_template.md': `---\n${VALID}\n---\n`,
      '/handover.md': '---\ntype: Handover\ntitle: H\n---\n',
    });
    expect(board.tasks).toEqual([]);
    expect(board.others.map((d) => d.resource)).toEqual(['/handover.md']);
  });

  it('reads an epic `carded: false` as a boolean', () => {
    const board = parseBoard({
      '/epics/e.md': '---\ntype: Epic\ntitle: E\nresource: /epics/e.md\ncarded: false\n---\n',
    });
    expect(board.epics[0]?.carded).toBe(false);
  });
});

describe('computeReady', () => {
  const task = (resource: string, state: string, depends_on: string[] = []) =>
    TaskSchema.parse({
      type: 'Task',
      title: 't',
      resource,
      state,
      epic: '/epics/e.md',
      priority: '1',
      depends_on,
    });

  it('is backlog with every dependency done', () => {
    const tasks = [
      task('/tasks/a.md', 'done'),
      task('/tasks/b.md', 'backlog', ['/tasks/a.md']),
    ].map((t) => ({ ...t, body: '' }));
    expect(computeReady(tasks)).toEqual(new Set(['/tasks/b.md']));
  });

  it('is not ready while a dependency is open, or does not resolve', () => {
    const tasks = [
      task('/tasks/a.md', 'doing'),
      task('/tasks/b.md', 'backlog', ['/tasks/a.md']),
      task('/tasks/c.md', 'backlog', ['/tasks/missing.md']),
    ].map((t) => ({ ...t, body: '' }));
    expect(computeReady(tasks)).toEqual(new Set());
  });
});

describe('the sample bundle', () => {
  const board = parseBoard(sample.files);

  it('parses every concept with no errors', () => {
    expect(board.errors).toEqual([]);
    expect(board.tasks).toHaveLength(7);
    expect(board.epics).toHaveLength(2);
    expect(board.decisions).toHaveLength(1);
  });

  it('counts the columns exactly as validate.mjs printed them for this bundle', () => {
    // `node board/tools/validate.mjs src/board/sample`, 2026-08-23:
    //   board: backlog 1 · ready 2 · doing 1 · blocked 1 · done 1 · held 1
    expect(columnCounts(board.tasks)).toEqual({
      backlog: 1,
      ready: 2,
      doing: 1,
      blocked: 1,
      done: 1,
      held: 1,
    });
  });
});
