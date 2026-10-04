import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/** The dark mode palettes, chosen with `data-night-palette` on the root element. */
export type NightPalette = 'navy' | 'graphite' | 'onyx' | 'ink' | 'carbon';

export interface NightSwatchProps extends ComponentProps<'span'> {
  /** The night whose page and card the swatch shows. */
  palette: NightPalette;
}

/**
 * A night palette's page with its card on it, for a control that picks one.
 *
 * It shows the night's own colours whatever the page is doing — light, or dark
 * in another night — because `data-night-swatch` fills the night roles on the
 * swatch itself. Nothing else names those colours, so a swatch cannot drift
 * from the palette it stands for.
 *
 * Decorative: the night's name is the label beside it. At the end of a menu
 * row it pushes itself to the row's end.
 *
 * @example
 * <DropdownMenuRadioItem value="graphite">
 *   Graphite
 *   <NightSwatch palette="graphite" />
 * </DropdownMenuRadioItem>
 */
export function NightSwatch({ palette, className, ...props }: NightSwatchProps) {
  return (
    <span
      data-slot="night-swatch"
      data-night-swatch={palette}
      aria-hidden="true"
      className={cn(
        'ms-auto flex h-6 w-9 shrink-0 items-end justify-end rounded-xs border border-line p-1',
        'bg-(--color-night-page)',
        className,
      )}
      {...props}
    >
      <span
        data-slot="night-swatch-card"
        className="h-3.5 w-5 rounded-xs bg-(--color-night-raised)"
      />
    </span>
  );
}
