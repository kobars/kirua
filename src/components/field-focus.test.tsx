import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render } from '@/test/render';
import { Combobox, ComboboxInput } from './Combobox';
import { DatePicker } from './DatePicker';
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
  [
    'DatePicker',
    (invalid) => (
      <DatePicker month={new Date(2026, 9, 1)} aria-label="Visit date" aria-invalid={invalid} />
    ),
    'date-picker',
  ],
  [
    'Combobox',
    (invalid) => (
      <Combobox>
        <ComboboxInput aria-label="City" aria-expanded={false} aria-invalid={invalid} />
      </Combobox>
    ),
    'combobox-input',
  ],
];

/**
 * Focus the field as a keyboard user does, so `:focus-visible` applies, then
 * let its colour transitions finish: a border read mid-transition is neither
 * the old colour nor the new one, and passes any inequality.
 *
 * A key press first, then focus from the script. Tab alone is not enough:
 * WebKit's Tab skips buttons by default, as Safari does, so the two fields
 * that are buttons would never be reached.
 */
async function focusField(container: HTMLElement, slot: string) {
  const ring = container.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
  const target = ring.matches('input, textarea, button')
    ? ring
    : ring.querySelector<HTMLElement>('input, textarea, button')!;
  const invalidBorder = getComputedStyle(ring).borderTopColor;
  await userEvent.keyboard('{Shift}');
  target.focus();
  await expect.poll(() => getComputedStyle(ring).outlineStyle).toBe('solid');
  await Promise.all(ring.getAnimations().map((animation) => animation.finished));
  return { ring, invalidBorder };
}

describe.each(FIELDS)('a focused %s', (_name, field, slot) => {
  it('draws one 2px ring on its border and leaves the border colour alone', async () => {
    const container = render(field(false));
    const { ring } = await focusField(container, slot);

    const style = getComputedStyle(ring);
    expect(style.outlineWidth).toBe('2px');
    expect(style.outlineOffset).toBe('-1px');
    // Compared with the ring, not with the resting border: a pointer left over
    // the field gives it the hover colour, which is still not the ring's.
    expect(style.borderTopColor).not.toBe(style.outlineColor);
  });

  it('rings an invalid field in the invalid colour', async () => {
    const container = render(field(true));
    const { ring, invalidBorder } = await focusField(container, slot);

    // An invalid field's border is the invalid colour, hovered or not.
    expect(getComputedStyle(ring).outlineColor).toBe(invalidBorder);
  });
  it('rings in a colour the white field does not share, on a brand panel', async () => {
    const container = render(<div className="ctx-brand">{field(false)}</div>);
    const { ring } = await focusField(container, slot);

    // The system ring is white on a brand panel, and so is the field it covers.
    expect(getComputedStyle(ring).outlineColor).not.toBe(
      getComputedStyle(ring).backgroundColor,
    );
  });
});
