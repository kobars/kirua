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
 * No syntax highlighting: that needs a large dependency this system does not
 * ship. The `language-*` class is on the `<code>` element, which is where every
 * highlighter looks, so one can be added on top.
 *
 * `ScrollArea` makes its own viewport the focusable scroller, so nothing here
 * sets `tabIndex` or `role`. `action` is a slot because copying needs a click
 * handler, which belongs in the consumer's client file.
 *
 * @example
 * <CodeBlock language="bash" action={<IconButton aria-label="Copy"><CopyIcon /></IconButton>}>
 *   {`pnpm add kirua`}
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
          className="font-text text-caption text-fg-muted lowercase"
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
