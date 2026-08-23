import { describe, expect, it } from 'vitest';
import { choose, relativeTo, sample } from './sources';

describe('choose', () => {
  it('falls back to the sample when the real board glob is empty', () => {
    expect(choose({}).name).toBe('sample');
    expect(choose({})).toBe(sample);
  });

  it('prefers the real board when it has any file', () => {
    const source = choose({ '/index.md': '---\nokf_version: "0.2"\n---\n' });
    expect(source.name).toBe('board');
    expect(Object.keys(source.files)).toEqual(['/index.md']);
  });
});

describe('relativeTo', () => {
  it('turns glob paths into bundle-relative resources', () => {
    expect(relativeTo('./sample', { './sample/tasks/a.md': 'x' })).toEqual({
      '/tasks/a.md': 'x',
    });
    expect(relativeTo('/board', { '/board/index.md': 'x' })).toEqual({ '/index.md': 'x' });
  });

  it('leaves a path alone when it does not carry the prefix', () => {
    expect(relativeTo('/board', { '/elsewhere/a.md': 'x' })).toEqual({
      '/elsewhere/a.md': 'x',
    });
  });
});
