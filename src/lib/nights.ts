import type { NightPalette } from '@/components/NightSwatch';
import names from '@/styles/nights.json';

/**
 * The night palettes of dark mode, the default first. The default is plain
 * `.dark`; every other night is chosen with `data-night-palette` on the same
 * element, so a menu that offers the nights can be built from this list.
 *
 * @example
 * NIGHT_PALETTES.map((night) => <NightSwatch key={night} palette={night} />);
 */
export const NIGHT_PALETTES = names as readonly NightPalette[];
