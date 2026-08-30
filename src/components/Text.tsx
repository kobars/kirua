import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { textVariants } from './Text.variants';

export interface TextProps extends ComponentProps<'p'>, VariantProps<typeof textVariants> {
  /**
   * Renders a `<span>` instead of a `<p>`, for text inside a sentence or a
   * table cell. Not `asChild`: there is no third element a paragraph might
   * legitimately become, and a boolean cannot be got wrong.
   */
  inline?: boolean;
}

/**
 * Body copy, and the one place the type scale's body steps are applied.
 *
 * Anything that is not a heading is this: a paragraph, a caption under a chart,
 * the second line of a table cell. `Heading` is the other half.
 *
 * `Text` is also the name of a DOM global, so forgetting the import does not
 * produce "Cannot find name" — TypeScript resolves the global instead and
 * reports that a `Text` node is not a valid JSX element type. Recognise that
 * message as a missing import; it cost a minute the first time.
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
 * The line above a heading: a category, a step number, a section name.
 *
 * Its own component rather than a third axis on `Text`, because it is a role
 * and not a size — every eyebrow in the system is caption-size capitals, and
 * offering `size` beside `uppercase` would let someone build a display-size
 * one. `CardEyebrow` is the same decision inside a card.
 *
 * `tracking-wider` is doing real work. Capitals lose the ascender and descender
 * shapes a reader matches whole words on, and the extra spacing is what gives
 * the word its outline back; the scale step exists for this case.
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
