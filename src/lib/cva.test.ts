import { describe, expect, it } from 'vitest';
import { cva } from './cva';

describe('cva', () => {
  const badge = cva('inline-flex', {
    variants: { size: { sm: 'h-5', md: 'h-6' }, tone: { quiet: '', loud: 'font-bold' } },
    defaultVariants: { size: 'md' },
  });

  it('still composes classes the way upstream does', () => {
    expect(badge({ size: 'sm' })).toBe('inline-flex h-5');
    expect(badge()).toBe('inline-flex h-6');
    expect(badge({ tone: 'loud' })).toBe('inline-flex h-6 font-bold');
  });

  it('exposes the variant map it was given', () => {
    expect(badge.variants).toEqual({
      size: { sm: 'h-5', md: 'h-6' },
      tone: { quiet: '', loud: 'font-bold' },
    });
  });

  it('exposes an empty map when there are no variants', () => {
    expect(cva('block').variants).toEqual({});
    expect(cva('block', {}).variants).toEqual({});
  });
});
