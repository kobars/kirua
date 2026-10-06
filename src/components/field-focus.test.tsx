import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render } from '@/test/render';
import { Input } from './Input';
import { InputGroup, InputGroupInput } from './InputGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Textarea } from './Textarea';

afterEach(cleanup);

/**
 * A focused field draws one ring, on its own border: a 2px outline pulled in by
 * the border's 1px, so it covers the border rather than sitting a gap outside
 * it. Recolouring the border as well drew the same signal twice, as two lines
 * with the page between them.
 */
const FIELDS: [string, (invalid: boolean) => ReactNode, string][] = [
  ['Input', (invalid) => <Input aria-label="Name" aria-invalid={invalid} />, 'input'],
  ['Textarea', (invalid) => <Textarea aria-label="Note" aria-invalid={invalid} />, 'textarea'],
  [
    'InputGroup',
    (invalid) => (
      <InputGroup>
        <InputGroupInput aria-label="Search" aria-invalid={invalid} />
      </InputGroup>
    ),
    'input-group',
  ],
  [
    'SelectTrigger',
    (invalid) => (
      <Select>
        <SelectTrigger aria-label="Size" aria-invalid={invalid}>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent aria-label="Sizes">
          <SelectItem value="s">Small</SelectItem>
        </SelectContent>
      </Select>
    ),
    'select-trigger',
  ],
];

/** Tab into the field, as a keyboard user does, so `:focus-visible` applies. */
async function focusField(container: HTMLElement, slot: string) {
  const ring = container.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
  const atRest = getComputedStyle(ring).borderTopColor;
  await userEvent.tab();
  return { ring, atRest };
}

describe.each(FIELDS)('a focused %s', (_name, field, slot) => {
  it('draws one 2px ring on its border and leaves the border colour alone', async () => {
    const container = render(field(false));
    const { ring, atRest } = await focusField(container, slot);

    await expect.poll(() => getComputedStyle(ring).outlineStyle).toBe('solid');
    const style = getComputedStyle(ring);
    expect(style.outlineWidth).toBe('2px');
    expect(style.outlineOffset).toBe('-1px');
    expect(style.borderTopColor).toBe(atRest);
  });

  it('rings an invalid field in the invalid colour', async () => {
    const container = render(field(true));
    const { ring, atRest } = await focusField(container, slot);

    await expect.poll(() => getComputedStyle(ring).outlineStyle).toBe('solid');
    // At rest an invalid field's border is already the invalid colour.
    expect(getComputedStyle(ring).outlineColor).toBe(atRest);
  });
});
