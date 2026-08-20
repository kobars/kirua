import { describe, expect, it } from 'vitest';
import { resolveGlints } from './glint';

describe('resolveGlints', () => {
  it('treats "no glint" and "not set" the same', () => {
    expect(resolveGlints(false)).toEqual([]);
    expect(resolveGlints(undefined)).toEqual([]);
  });

  it('wraps a single corner', () => {
    expect(resolveGlints('tl')).toEqual(['tl']);
  });

  it('passes a list through in order', () => {
    expect(resolveGlints(['tr', 'bl'])).toEqual(['tr', 'bl']);
  });

  it('returns an empty list for an empty list, not a glint', () => {
    expect(resolveGlints([])).toEqual([]);
  });
});
