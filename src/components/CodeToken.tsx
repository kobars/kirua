import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { codeTokenVariants } from './CodeToken.variants';

export type CodeTokenKind = NonNullable<VariantProps<typeof codeTokenVariants>['kind']>;

export interface CodeTokenProps extends ComponentProps<'span'> {
  /** What the token is. The colour follows from it, and from the surface. */
  kind: CodeTokenKind;
}

/**
 * One highlighted token inside a `CodeBlock`.
 *
 * The system colours code but does not parse it. A parser for even four
 * languages outweighs every component here, and it does the same work on every
 * visit for text that never changes. So the parse belongs to whoever owns the
 * text, ideally at build time, and this component is only where its answer
 * lands: a highlighter's token types map to `kind`, and text with no kind is
 * written as a plain string between the tokens.
 *
 * The colours are a token family of their own, measured at 4.5:1 on the
 * sunken well in light mode, every night, and on a dark card. On a brand panel
 * they all resolve to white: nothing else reaches the threshold there.
 *
 * @example
 * <CodeBlock language="css">
 *   <CodeToken kind="punctuation">.</CodeToken>
 *   <CodeToken kind="function">card</CodeToken> {'{'}
 *   <CodeToken kind="parameter">padding</CodeToken>: <CodeToken kind="constant">1rem</CodeToken>; {'}'}
 * </CodeBlock>
 */
export function CodeToken({ className, kind, ...props }: CodeTokenProps) {
  return (
    <span
      data-slot="code-token"
      className={cn(codeTokenVariants({ kind }), className)}
      {...props}
    />
  );
}
