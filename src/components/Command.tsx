/* oxlint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/prefer-tag-over-role, jsx-a11y/role-has-required-aria-props --
 * The ARIA 1.2 listbox pattern; see the header in `Combobox.tsx`. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Dialog, DialogContent } from './Dialog';
import { SearchIcon } from './icons';

/**
 * A filtered list of actions, driven by name rather than by mouse. Filtering,
 * the highlight and the shortcut that opens it are the consumer's.
 *
 * `aria-activedescendant` on the input must name the highlighted row: focus
 * stays in the input, so otherwise the arrows move a highlight nothing reports.
 *
 * @example
 * <Command open={open} onOpenChange={setOpen} label="Command palette">
 *   <CommandInput
 *     value={query}
 *     onChange={(e) => setQuery(e.target.value)}
 *     aria-controls="cmd-list"
 *     aria-activedescendant={`cmd-${active}`}
 *   />
 *   <CommandList id="cmd-list">
 *     <CommandGroup heading="Patients">
 *       <CommandItem id="cmd-0" isActive>Find a patient</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 */
export function Command({
  children,
  label = 'Command palette',
  className,
  ...props
}: ComponentProps<typeof Dialog> & { label?: string; className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent
        data-slot="command"
        aria-label={label}
        showCloseButton={false}
        className={cn('w-[min(36rem,calc(100vw-2rem))] overflow-hidden p-0', className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <div className="flex items-center gap-3 border-b border-line-subtle px-4 [--icon-size:var(--icon-md)]">
      <SearchIcon aria-hidden="true" className="shrink-0 text-fg-muted" />
      {/* `aria-controls` is the consumer's: only they know the list's id. */}
      <input
        data-slot="command-input"
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded="true"
        className={cn(
          'h-12 w-full bg-transparent font-text text-body-md text-fg outline-none',
          'placeholder:text-placeholder',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="command-list"
      role="listbox"
      className={cn('max-h-80 overflow-y-auto p-2', className)}
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  heading,
  children,
  ...props
}: ComponentProps<'li'> & { heading: string }) {
  return (
    // A group inside a listbox needs `role="group"` and a label, or each
    // heading reads as an option.
    <li data-slot="command-group" role="presentation" className={cn(className)} {...props}>
      <p
        className="px-3 pt-3 pb-1 font-text text-caption text-fg-muted uppercase"
        id={`group-${heading}`}
      >
        {heading}
      </p>
      <ul role="group" aria-labelledby={`group-${heading}`}>
        {children}
      </ul>
    </li>
  );
}

export interface CommandItemProps extends ComponentProps<'li'> {
  /** Where the arrow keys are. Not a selection — a palette selects nothing. */
  isActive?: boolean;
  /** The shortcut this row is equivalent to, if any. */
  shortcut?: React.ReactNode;
}

export function CommandItem({
  className,
  isActive,
  shortcut,
  children,
  ...props
}: CommandItemProps) {
  return (
    <li
      data-slot="command-item"
      role="option"
      aria-selected={isActive ?? false}
      className={cn(
        'flex cursor-default items-center justify-between gap-3 rounded-sm px-3 py-2',
        'font-text text-body-sm text-fg select-none',
        '[--icon-size:var(--icon-sm)]',
        isActive && 'bg-selected text-on-selected',
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{children}</span>
      {shortcut}
    </li>
  );
}

/**
 * The "no matches" message. Render it **instead of** `CommandList`: a
 * `role="listbox"` must contain options.
 *
 * @example
 * {matches.length > 0 ? <CommandList>…</CommandList> : <CommandEmpty>No matches.</CommandEmpty>}
 */
export function CommandEmpty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-empty"
      className={cn('px-3 py-8 text-center font-text text-body-sm text-fg-muted', className)}
      {...props}
    />
  );
}
