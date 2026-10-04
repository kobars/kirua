'use client';

import { useEffect, useId, useState, type ComponentProps } from 'react';
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Field,
  Text,
} from '@/components';

const cities = [
  ['bdg', 'Bandung'],
  ['jkt', 'Jakarta'],
  ['sby', 'Surabaya'],
  ['mks', 'Makassar'],
] as const;

export function CityCombobox(args: ComponentProps<typeof Combobox>) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = cities.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase()));
  const highlighted = matches[active];
  const activeId = open && highlighted ? `${id}-${highlighted[0]}` : undefined;
  // The arrows can move the highlight past the bottom of a scrolled list.
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);
  function choose(name: string) {
    setQuery(name);
    setSelected(name);
    setOpen(false);
  }
  return (
    <div className="min-h-80 w-full max-w-sm">
      <Combobox
        {...args}
        open={open}
        onOpenChange={setOpen}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <Field controlId={id} label="City" description="Search for your delivery city.">
          <ComboboxInput
            value={query}
            aria-expanded={open && matches.length > 0}
            aria-controls={open && matches.length > 0 ? `${id}-list` : undefined}
            aria-activedescendant={activeId}
            onFocus={() => {
              setOpen(true);
              setActive(0);
            }}
            // A press on the field that is already focused reopens a list
            // closed with Escape.
            onClick={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected('');
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setOpen(true);
                setActive((current) =>
                  !open
                    ? event.key === 'ArrowDown'
                      ? 0
                      : Math.max(0, matches.length - 1)
                    : Math.max(
                        0,
                        Math.min(
                          matches.length - 1,
                          current + (event.key === 'ArrowDown' ? 1 : -1),
                        ),
                      ),
                );
              } else if (event.key === 'Enter' && open && highlighted) {
                event.preventDefault();
                choose(highlighted[1]);
              } else if (event.key === 'Escape') {
                setOpen(false);
              }
            }}
          />
        </Field>
        {open &&
          (matches.length ? (
            <ComboboxList id={`${id}-list`} aria-label="Cities">
              {matches.map(([key, name], index) => (
                <ComboboxItem
                  key={key}
                  id={`${id}-${key}`}
                  isActive={active === index}
                  aria-selected={selected === name}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(name)}
                >
                  {name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          ) : (
            <ComboboxEmpty>
              <output>No city matches. Try another name.</output>
            </ComboboxEmpty>
          ))}
      </Combobox>
      <output>
        <Text className="mt-4">
          {selected ? `Delivery city: ${selected}` : 'No city selected.'}
        </Text>
      </output>
    </div>
  );
}
