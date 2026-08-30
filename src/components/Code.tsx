import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * A word of code inside a sentence.
 *
 * `CodeBlock` is the other half and cannot do this: it always draws a bordered
 * container, a language header and a `ScrollArea` around a `<pre>`, which is
 * right for a block and impossible for a word. Until this existed, a sentence
 * naming `--color-surface-brand` had nothing to reach for.
 *
 * `Kbd` is the adjacent case and deliberately looks different. A key cap says
 * *press this*; a token name says *this is code*. Drawing them the same way
 * would make one of those two claims wrong.
 *
 * Three decisions worth stating:
 *
 * **The size is `0.9em`, not a scale step.** A monospace face sets larger than
 * a proportional one at the same nominal size, so code in a sentence has to
 * come down about a tenth to sit on the same line — and it has to do that
 * relative to whatever size the sentence is. Every step in the type scale is
 * absolute, so this is the one place an arbitrary value is the correct answer
 * rather than a shortcut.
 *
 * **It does not scroll and does not truncate.** A long name wraps at the
 * character like any other long word; `wrap-break-word` is what stops it pushing
 * its paragraph sideways, which is the failure mode a table has already taught
 * this repository twice.
 *
 * **The surface is `bg-sunken`.** It is re-pointed in all four contexts, so a
 * token name lands legibly on a brand panel — which is exactly where token
 * names tend to land in this system's own documentation.
 *
 * @example <Text>The panel reads <Code>--color-surface-brand</Code>.</Text>
 */
export function Code({ className, ...props }: ComponentProps<'code'>) {
  return (
    <code
      data-slot="code"
      className={cn(
        'rounded-xs bg-sunken px-1 py-0.5 font-mono text-[0.9em] wrap-break-word text-fg',
        className,
      )}
      {...props}
    />
  );
}
