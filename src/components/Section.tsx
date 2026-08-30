import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { sectionVariants } from './Section.variants';

export interface SectionProps
  extends ComponentProps<'section'>, VariantProps<typeof sectionVariants> {}

/**
 * One block of a page, as a real `<section>`.
 *
 * A `<section>` becomes a `region` landmark only when it has an accessible
 * name, so an unnamed one is semantically free — but a named one is announced,
 * which is why the heading usually goes inside rather than above.
 *
 * Use it where a block *is* a section of the page. A row of controls is not,
 * and wrapping one adds an element that says something untrue.
 *
 * @example
 * <Section aria-labelledby="plans">
 *   <Heading as="h2" id="plans" size="heading-md">What actually differs</Heading>
 *   <Card>…</Card>
 * </Section>
 */
export function Section({ className, gap, ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionVariants({ gap }), className)}
      {...props}
    />
  );
}
