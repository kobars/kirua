import { describe, expect, it } from 'vitest';
import { resolveGlints } from './glint';

describe('resolveGlints', () => {
  it('treats "no glint" and "not set" the same', () => {
    expect(resolveGlints(false)).toEqual([]);
    expect(resolveGlints(undefined)).toEqual([]);
  });

  it('wraps a single corner', () => {
    expect(resolveGlints('top-start')).toEqual(['top-start']);
  });

  it('passes a list through in order', () => {
    expect(resolveGlints(['top-end', 'bottom-start'])).toEqual(['top-end', 'bottom-start']);
  });

  it('returns an empty list for an empty list, not a glint', () => {
    expect(resolveGlints([])).toEqual([]);
  });
});
