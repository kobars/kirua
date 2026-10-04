import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { Heading, type HeadingProps } from './Heading';
import { pageHeaderVariants } from './PageHeader.variants';
import { Eyebrow, Text } from './Text';

export interface PageHeaderProps
  extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof pageHeaderVariants> {
  /** The page's name. Rendered as the heading, so it may hold a `Badge`. */
  title: ReactNode;
  /** One line under the title: a count, a date, what the page is for. */
  description?: ReactNode;
  /** A short label above the title: a category, a section of the site. */
  eyebrow?: ReactNode;
  /** The page's own controls — a primary action, a search field, a filter. */
  actions?: ReactNode;
  /** `h1` for a page's title; `h2` when the header names a region of a page. */
  level?: 'h1' | 'h2';
  /** The heading's size, from `Heading`'s scale. */
  size?: HeadingProps['size'];
}

/**
 * The top of a page: what it is, and what you can do on it.
 *
 * The title block and the actions wrap independently, so on a phone the
 * actions drop under the title instead of squeezing it. The spacing between
 * title and description is fixed here, so no page retypes that margin. On a
 * phone, actions that hold a search field take the whole row, so the field is
 * as wide as the page.
 *
 * @example
 * <PageHeader
 *   title="Laboratory"
 *   description={`${orders.length} test orders`}
 *   actions={<InputGroup width="md">…</InputGroup>}
 * />
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  level = 'h1',
  size = 'heading-md',
  align,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(pageHeaderVariants({ align }), className)}
      {...props}
    >
      <div className="grid min-w-0 gap-1">
        {eyebrow !== undefined && eyebrow !== null && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading as={level} size={size}>
          {title}
        </Heading>
        {description !== undefined && description !== null && (
          <Text size="sm">{description}</Text>
        )}
      </div>
      {actions !== undefined && actions !== null && (
        // A field among the actions is full width on a phone, as its own
        // `width` promises, so the block holding it spans the row there.
        <div className="flex flex-wrap items-center gap-2 max-sm:has-data-[slot=input-group]:w-full">
          {actions}
        </div>
      )}
    </div>
  );
}
