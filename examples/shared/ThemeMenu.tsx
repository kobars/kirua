import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  MonitorIcon,
  MoonIcon,
  NightSwatch,
  SunIcon,
  type NightPalette,
} from '@kobars/kirua';
import { NIGHT_PALETTES, useNightPalette } from './useNightPalette';
import { useTheme, type ThemePreference } from './useTheme';
import { DEFAULT, type ThemeMenuLabels } from './themeLabels';

/**
 * The theme control: one button at any width, and a menu of three choices,
 * then the night palette dark mode uses.
 *
 * A menu rather than a row of three toggles, because the header is the most
 * contested space on a phone: three more 44px controls there leave the shop's
 * cart button six pixels of clearance.
 *
 * The trigger shows the theme in force, not the choice made: under "System" it
 * is a sun or a moon depending on what the operating system currently says.
 */
export function ThemeMenu({ labels = DEFAULT }: { labels?: ThemeMenuLabels }) {
  const { preference, resolved, choose } = useTheme();
  const { palette, choose: choosePalette } = useNightPalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label={labels.trigger} variant="ghost">
          {resolved === 'dark' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) => choose(value as ThemePreference)}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon aria-hidden="true" />
            {labels.light}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon aria-hidden="true" />
            {labels.dark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon aria-hidden="true" />
            {labels.system}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Night palette</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={palette}
          onValueChange={(value) => choosePalette(value as NightPalette)}
        >
          {NIGHT_PALETTES.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
              <NightSwatch palette={option.id} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
