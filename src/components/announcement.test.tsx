import { act } from 'react';
import { commands, userEvent } from 'vitest/browser';
import { afterEach, describe, expect, it } from 'vitest';
import { DatePicker, Field } from '@/components';
import { cleanup, render } from '@/test/render';

/**
 * What a control announces, read through Playwright's ARIA snapshot in the
 * engine the project runs: Chromium in the unit projects, WebKit in `webkit`.
 * Testing Library's name computation is a JavaScript model of the spec; this
 * is the reading Playwright takes from the page itself.
 */

afterEach(cleanup);

describe('the DatePicker trigger', () => {
  const MARCH_2026 = new Date(2026, 2, 1);

  it('announces its label as the name and the date as the value', async () => {
    render(
      <>
        <Field controlId="announce-empty" label="Visit date">
          <DatePicker month={MARCH_2026} locale="en-GB" />
        </Field>
        <Field controlId="announce-chosen" label="Follow-up date" required>
          <DatePicker month={MARCH_2026} locale="en-GB" value={new Date(2026, 2, 17)} />
        </Field>
      </>,
    );

    expect(await commands.ariaSnapshot('#announce-empty')).toBe(
      '- combobox "Visit date": Choose a date',
    );
    expect(await commands.ariaSnapshot('#announce-chosen')).toBe(
      '- combobox "Follow-up date": 17 March 2026',
    );
  });

  it('announces that it is expanded while the calendar is open', async () => {
    render(
      <Field controlId="announce-open" label="Visit date">
        <DatePicker month={MARCH_2026} locale="en-GB" value={new Date(2026, 2, 17)} />
      </Field>,
    );
    const trigger = document.getElementById('announce-open') as HTMLElement;

    // Radix opens the calendar in state updates of its own, which React wants
    // inside `act` once the suite has declared an act environment.
    await act(() => userEvent.click(trigger));
    expect(await commands.ariaSnapshot('#announce-open')).toBe(
      '- combobox "Visit date" [expanded]: 17 March 2026',
    );
    await act(() => userEvent.keyboard('{Escape}'));
  });
});
