import { describe, expect, it } from 'vitest';
import { parseBundle, parseDocument, parseYaml } from './okf';
import { sample } from './sources';

/**
 * The reader must agree with the board's own reader, which is local-only and
 * cannot be imported here. So each case below is a shape the real bundle
 * uses, with the value the original reader produces for it.
 */
describe('parseYaml', () => {
  it('reads scalars, and strips one layer of quotes', () => {
    expect(parseYaml('type: Task\ntitle: "A title: with colon"\nokf_version: "0.2"')).toEqual({
      type: 'Task',
      title: 'A title: with colon',
      okf_version: '0.2',
    });
  });

  it('reads inline and block lists', () => {
    expect(
      parseYaml('tags: [a, b]\nempty: []\ndepends_on:\n  - /tasks/x.md\n  - /tasks/y.md'),
    ).toEqual({
      tags: ['a', 'b'],
      empty: [],
      depends_on: ['/tasks/x.md', '/tasks/y.md'],
    });
  });

  it('reads one level of nested map', () => {
    expect(
      parseYaml('generated:\n  by: lantern-cli/1.0\n  at: 2026-08-23T00:00:00+07:00'),
    ).toEqual({
      generated: { by: 'lantern-cli/1.0', at: '2026-08-23T00:00:00+07:00' },
    });
  });

  it('treats an empty value as null and skips comments', () => {
    expect(parseYaml('# a comment\nstate:\n')).toEqual({ state: null });
  });

  it('throws with a line number on a shape it does not know', () => {
    expect(() => parseYaml('type: Task\n  orphan')).toThrow('line 2');
    expect(() => parseYaml('not yaml at all')).toThrow('line 1');
  });
});

describe('parseDocument', () => {
  it('splits frontmatter from body', () => {
    const doc = parseDocument('/tasks/a.md', '---\ntype: Task\n---\nBody here\n');
    expect(doc.data).toEqual({ type: 'Task' });
    expect(doc.body).toBe('\nBody here\n');
    expect(doc.error).toBeUndefined();
  });

  it('marks reserved files and leaves them unparsed', () => {
    const doc = parseDocument('/log.md', '# Log\n');
    expect(doc.reserved).toBe(true);
    expect(doc.data).toBeNull();
  });

  it('reports a broken file instead of throwing', () => {
    expect(parseDocument('/tasks/a.md', 'no frontmatter').error).toBe('no frontmatter block');
    expect(parseDocument('/tasks/a.md', '---\ntype: Task\n').error).toBe(
      'unterminated frontmatter',
    );
    expect(parseDocument('/tasks/a.md', '---\n  orphan\n---\n').error).toContain('line 1');
  });
});

describe('the sample bundle', () => {
  const documents = parseBundle(sample.files);

  it('is found at all, so an empty glob cannot pass', () => {
    expect(documents.length).toBeGreaterThan(5);
  });

  it('reads without a single error', () => {
    expect(documents.filter((d) => d.error).map((d) => d.error)).toEqual([]);
  });

  it('keys every document by a bundle-relative resource', () => {
    for (const d of documents) expect(d.resource).toMatch(/^\/[a-z]/);
    expect(documents.map((d) => d.resource)).toContain('/index.md');
  });

  it('carries a card in every stored state, so every column has something to show', () => {
    const states = new Set(documents.map((d) => d.data?.['state']).filter(Boolean));
    expect([...states].sort()).toEqual(['backlog', 'blocked', 'doing', 'done', 'held']);
  });
});
