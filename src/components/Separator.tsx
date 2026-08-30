import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>;

/**
 * A rule between two things. `decorative` defaults to `true`, which removes it
 * from the accessibility tree; pass `false` only where the rule marks a real
 * division of content.
 *
 * @example <Separator className="my-4" />
 * @example <Separator orientation="vertical" decorative={false} />
 */
export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-line-subtle',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}
