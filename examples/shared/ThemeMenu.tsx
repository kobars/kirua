import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  IconButton,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from 'kirua';
import { useTheme, type ThemePreference } from './useTheme';
import { DEFAULT, type ThemeMenuLabels } from './themeLabels';

/**
 * The theme control: one button at any width, and a menu of three choices.
 *
 * A menu rather than a row of three toggles, because the header is the most
 * contested space on a phone — three 44px controls there is what pushed the
 * shop's cart button to six pixels of clearance.
 *
 * The trigger shows the theme in force, not the choice made: under "System" it
 * is a sun or a moon depending on what the operating system currently says.
 */
export function ThemeMenu({ labels = DEFAULT }: { labels?: ThemeMenuLabels }) {
  const { preference, choose } = useTheme();

  const resolved =
    preference === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : preference;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label={labels.trigger} variant="ghost">
          {resolved === 'dark' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
