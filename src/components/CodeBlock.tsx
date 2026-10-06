import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ScrollArea } from './ScrollArea';

export interface CodeBlockProps extends ComponentProps<'div'> {
  /** Shown in the header, and used as the `language-*` class on the `<code>`. */
  language?: string;
  /** Usually a copy control. Wired by the consumer, from their own client file. */
  action?: ReactNode;
}

/**
 * A block of code in a page of prose.
 *
 * Highlighting is `CodeToken`s as children: the system colours code but does
 * not parse it, so a highlighter run by the consumer, ideally at build time,
 * decides the kinds. The `language-*` class stays on the `<code>` element too,
 * which is where a highlighter that runs in the page looks.
 *
 * The language label is `text-fg-secondary`, not muted: it is copy, and muted
 * copy falls under 4.5:1 on a brand panel's sunken well.
 *
 * `ScrollArea` makes its own viewport the focusable scroller, so nothing here
 * sets `tabIndex` or `role`. `action` is a slot because copying needs a click
 * handler, which belongs in the consumer's client file.
 *
 * @example
 * <CodeBlock language="bash" action={<IconButton aria-label="Copy"><CopyIcon /></IconButton>}>
 *   {`pnpm add @kobars/kirua`}
 * </CodeBlock>
 */
export function CodeBlock({ className, language, action, children, ...props }: CodeBlockProps) {
  return (
    <div
      data-slot="code-block"
      className={cn(
        'overflow-hidden rounded-md border border-line-subtle bg-sunken',
        className,
      )}
      {...props}
    >
      <div
        data-slot="code-block-header"
        className="flex items-center justify-between gap-2 border-b border-line-subtle px-3 py-1.5"
      >
        <span
          data-slot="code-block-language"
          className="font-text text-caption text-fg-secondary lowercase"
        >
          {language ?? 'text'}
        </span>
        {action}
      </div>
      <ScrollArea orientation="horizontal">
        <pre data-slot="code-block-pre" className="w-max min-w-full p-3">
          <code
            data-slot="code-block-code"
            className={cn('font-mono text-body-sm text-fg', language && `language-${language}`)}
          >
            {children}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}
