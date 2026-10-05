import { useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
} from '@kobars/kirua';
import { useActiveDescendant } from '../shared/useActiveDescendant';
import { allConversations as conversations } from './data';

export interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (id: string) => void;
}

/** kirua supplies the parts and the ARIA; the filtering lives here. */
export function SearchPalette({ open, onOpenChange, onPick }: SearchPaletteProps) {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === ''
      ? conversations
      : conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [query]);

  const { active, activeId, setActive, onKeyDown } = useActiveDescendant({
    count: matches.length,
    idOf: (index) => `result-${matches[index]?.id}`,
    onPick: (index) => choose(index),
  });

  const choose = (index: number) => {
    const match = matches[index];
    if (!match) return;
    onPick(match.id);
    onOpenChange(false);
    setQuery('');
    setActive(0);
  };

  return (
    <Command open={open} onOpenChange={onOpenChange} label="Search conversations">
      <CommandInput
        value={query}
        placeholder="Search conversations…"
        aria-label="Search conversations"
        aria-controls="search-results"
        aria-activedescendant={activeId}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
      />

      {matches.length > 0 ? (
        <CommandList id="search-results" aria-label="Results">
          <CommandGroup heading="Conversations">
            {matches.map((c, index) => (
              <CommandItem
                key={c.id}
                id={`result-${c.id}`}
                isActive={index === active}
                shortcut={index === active ? <Kbd>⏎</Kbd> : undefined}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {c.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      ) : (
        <CommandEmpty>No conversation matches “{query}”.</CommandEmpty>
      )}
    </Command>
  );
}
