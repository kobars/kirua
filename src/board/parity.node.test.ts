import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { columnOf, computeReady, parseBoard } from './schema';

/**
 * The app's reading of a bundle against the validator's, on the real board.
 *
 * `board/tools/okf.mjs` is the authority and is local-only, so this test can
 * only run on a machine that has it; elsewhere it skips and says so. It lives
 * in the `node` project because it reads the filesystem and loads a script
 * by path, neither of which a browser project can do.
 *
 * Two things are compared, both derived: which tasks are `ready`, and which
 * column every task lands in. If these ever differ, the app is wrong.
 */
const ROOT = resolve(import.meta.dirname, '../..');
const TOOLS = join(ROOT, 'board/tools/okf.mjs');

interface OkfTask {
  resource: string;
  data: { state: string };
}
interface Okf {
  loadBundle(root: string): { tasks: OkfTask[] };
  computeReady(tasks: OkfTask[]): Set<string>;
}

function files(root: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'tools' || entry.startsWith('.')) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.md'))
        out['/' + relative(root, full).split('\\').join('/')] = readFileSync(full, 'utf8');
    }
  };
  walk(root);
  return out;
}

describe.skipIf(!existsSync(TOOLS))('the app reads a bundle the way okf.mjs does', () => {
  it.each([
    ['the real board', join(ROOT, 'board')],
    ['the sample', join(ROOT, 'src/board/sample')],
  ])('%s', async (_name, root) => {
    const okf = (await import(/* @vite-ignore */ pathToFileURL(TOOLS).href)) as Okf;
    const theirs = okf.loadBundle(root);
    const ours = parseBoard(files(root));

    expect(ours.errors).toEqual([]);
    expect(ours.tasks.map((t) => t.resource).sort()).toEqual(
      theirs.tasks.map((t) => t.resource).sort(),
    );

    const theirReady = okf.computeReady(theirs.tasks);
    const ourReady = computeReady(ours.tasks);
    expect([...ourReady].sort()).toEqual([...theirReady].sort());

    const theirColumns = Object.fromEntries(
      theirs.tasks.map((t) => [
        t.resource,
        t.data.state === 'backlog' && theirReady.has(t.resource) ? 'ready' : t.data.state,
      ]),
    );
    const ourColumns = Object.fromEntries(
      ours.tasks.map((t) => [t.resource, columnOf(t, ourReady)]),
    );
    expect(ourColumns).toEqual(theirColumns);
  });
});
