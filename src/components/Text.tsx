import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { textVariants } from './Text.variants';

export interface TextProps extends ComponentProps<'p'>, VariantProps<typeof textVariants> {
  /** Render a span for inline text instead of a paragraph. */
  inline?: boolean;
}

/**
 * Body copy with independent size and tone.
 *
 * @example <Text size="lg">Aozora gives you one place to design a gallery.</Text>
 *
 * @example
 * // Inside a sentence, quieter than the words around it.
 * <Text inline size="sm" tone="muted">12 items</Text>
 */
export function Text({ inline = false, size, tone, className, ...props }: TextProps) {
  const Comp = inline ? 'span' : 'p';
  return (
    <Comp data-slot="text" className={cn(textVariants({ size, tone }), className)} {...props} />
  );
}

/**
 * A short caption above a heading, such as a category or section name.
 *
 * @example <Eyebrow>Our story</Eyebrow>
 */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        'font-text text-caption font-medium tracking-wider text-fg-muted uppercase',
        className,
      )}
      {...props}
    />
  );
}
