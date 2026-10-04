import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Tailwind v4 compiles `outline-none` to `--tw-outline-style: none` as well as
 * `outline-style: none`, and `focus-visible:outline-2` draws with
 * `outline-style: var(--tw-outline-style)`. Written in one class list, the
 * first cancels the second: the element looks focusable in the source and draws
 * nothing on screen. No type, lint rule or story render notices, so the source
 * is read as text here.
 */

const COMPONENTS_DIR = path.join(import.meta.dirname);

/** A plain, `focus:` or `focus-visible:` reset. Other variants, such as a
 *  `data-highlighted` item that marks focus with a fill, are not affected. */
const RESET = /(?:^|[\s'"`])(?:focus:|focus-visible:)?outline-none(?=[\s'"`]|$)/;
const RING = /focus-visible:outline-(?:\d|solid|dashed|double)/;

/** Every `cn(` and `cva(` call, with its argument list balanced by parentheses. */
function classCalls(source: string): string[] {
  const calls: string[] = [];
  const opener = /\b(?:cn|cva)\(/g;
  for (let match = opener.exec(source); match; match = opener.exec(source)) {
    let depth = 1;
    let end = opener.lastIndex;
    while (end < source.length && depth > 0) {
      if (source[end] === '(') depth += 1;
      if (source[end] === ')') depth -= 1;
      end += 1;
    }
    calls.push(source.slice(opener.lastIndex, end - 1));
  }
  return calls;
}

function findCancelledRings(source: string): string[] {
  return classCalls(source).filter((args) => RESET.test(args) && RING.test(args));
}

describe('focus rings', () => {
  it('no class list resets the outline it then draws on focus-visible', () => {
    const offenders = readdirSync(COMPONENTS_DIR)
      .filter((name) => /\.tsx?$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name))
      .filter(
        (name) =>
          findCancelledRings(readFileSync(path.join(COMPONENTS_DIR, name), 'utf8')).length > 0,
      );
    expect(offenders).toEqual([]);
  });

  it('detects the defect it exists for', () => {
    const planted = `cn('font-text outline-none', 'focus-visible:outline-2 focus-visible:outline-ring')`;
    expect(findCancelledRings(planted)).toHaveLength(1);
    expect(findCancelledRings(`cn('outline-none data-highlighted:bg-selected')`)).toEqual([]);
    expect(
      findCancelledRings(`cn('data-highlighted:outline-none', 'focus-visible:outline-2')`),
    ).toEqual([]);
  });
});
