import { act } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as kirua from './index';

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(async () => {
  if (root) {
    await act(async () => root?.unmount());
  }
  container?.remove();
  root = undefined;
  container = undefined;
  vi.restoreAllMocks();
});

/**
 * A public-entry-point composition with the two places most likely to drift:
 * form associations and Radix primitives that generate ids internally.
 */
function PublicComposition() {
  return (
    <kirua.SpotlightPanel>
      <kirua.SpotlightContent>
        <kirua.Field controlId="hydrate-email" label="Email">
          <kirua.Input type="email" />
        </kirua.Field>
        {/* Measures overflow in an effect: the server renders no scrollbar and
            the client must not claim one until after hydration. */}
        <kirua.ScrollArea className="h-20">
          <p>A region that fits its content.</p>
        </kirua.ScrollArea>
        <kirua.Tabs defaultValue="details">
          <kirua.TabsList>
            <kirua.TabsTrigger value="details">Details</kirua.TabsTrigger>
            <kirua.TabsTrigger value="schedule">Schedule</kirua.TabsTrigger>
          </kirua.TabsList>
          <kirua.TabsContent value="details">Two live sessions a week.</kirua.TabsContent>
          <kirua.TabsContent value="schedule">Tuesdays and Thursdays.</kirua.TabsContent>
        </kirua.Tabs>
        <kirua.Dialog>
          <kirua.DialogTrigger asChild>
            <kirua.Button>Open dialog</kirua.Button>
          </kirua.DialogTrigger>
          <kirua.DialogContent>
            <kirua.DialogTitle>Join the class</kirua.DialogTitle>
            <kirua.DialogDescription>Two live sessions a week.</kirua.DialogDescription>
          </kirua.DialogContent>
        </kirua.Dialog>
        <kirua.DropdownMenu>
          <kirua.DropdownMenuTrigger asChild>
            <kirua.Button>Open menu</kirua.Button>
          </kirua.DropdownMenuTrigger>
          <kirua.DropdownMenuContent>
            <kirua.DropdownMenuItem>Save</kirua.DropdownMenuItem>
          </kirua.DropdownMenuContent>
        </kirua.DropdownMenu>
        {/* Its tab stop moves in a focus handler, which must leave the server
            markup alone. Dates are pinned, so both renders agree. */}
        <kirua.Calendar
          month={new Date(2026, 2, 1)}
          today={new Date(2026, 2, 12)}
          selected={new Date(2026, 2, 17)}
        />
      </kirua.SpotlightContent>
    </kirua.SpotlightPanel>
  );
}

async function hydrate(recoverableErrors: unknown[] = []) {
  container = document.createElement('div');
  container.innerHTML = renderToString(<PublicComposition />);
  document.body.appendChild(container);
  const serverRoot = container.firstElementChild;

  await act(async () => {
    root = hydrateRoot(container as HTMLDivElement, <PublicComposition />, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    });
    await Promise.resolve();
  });
  return serverRoot;
}

describe('the public composition hydrates', () => {
  it('attaches to server markup without replacing it or reporting a mismatch', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const recoverableErrors: unknown[] = [];

    const serverRoot = await hydrate(recoverableErrors);
    if (!container) throw new Error('not hydrated');

    expect(serverRoot).not.toBeNull();
    expect(container.firstElementChild).toBe(serverRoot);
    expect(recoverableErrors).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it("moves the calendar's tab stop with focus once hydrated", async () => {
    await hydrate();
    const day = (date: string) =>
      container?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`) ?? null;

    expect(day('2026-03-17')?.tabIndex).toBe(0);
    await act(async () => day('2026-03-25')?.focus());

    expect(day('2026-03-25')?.tabIndex).toBe(0);
    expect(
      container?.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]'),
    ).toHaveLength(1);
  });
});
