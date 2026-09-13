'use client';

import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Text,
} from '@/components';

export function CommunityCommands(args: ComponentProps<typeof Command>) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [result, setResult] = useState('No action selected.');
  const actions = ['Browse collections', 'Create a post', 'View saved artwork'];
  const matches = actions.filter((action) =>
    action.toLowerCase().includes(query.toLowerCase()),
  );
  function run(action: string) {
    setResult(`Selected: ${action}. Connect this action to your application.`);
    setOpen(false);
  }
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Button
        ref={triggerRef}
        onClick={() => {
          setQuery('');
          setActive(0);
          setOpen(true);
        }}
      >
        Open commands
      </Button>
      <output>
        <Text>{result}</Text>
      </output>
      <Command {...args} open={open} onOpenChange={setOpen} label="Community commands">
        <CommandInput
          aria-label="Search commands"
          placeholder="Search community actions…"
          value={query}
          aria-autocomplete="list"
          aria-expanded={matches.length > 0}
          aria-controls={matches.length ? `${id}-list` : undefined}
          aria-activedescendant={matches[active] ? `${id}-${active}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((current) =>
                Math.max(
                  0,
                  Math.min(matches.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)),
                ),
              );
            } else if (event.key === 'Enter' && matches[active]) {
              event.preventDefault();
              run(matches[active]);
            }
          }}
        />
        {matches.length ? (
          <CommandList id={`${id}-list`} aria-label="Community actions">
            {matches.map((action, index) => (
              <CommandItem
                key={action}
                id={`${id}-${index}`}
                isActive={active === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => run(action)}
              >
                {action}
              </CommandItem>
            ))}
          </CommandList>
        ) : (
          <CommandEmpty>
            <output>No actions match your search.</output>
          </CommandEmpty>
        )}
      </Command>
    </div>
  );
}
