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
  SunIcon,
} from 'kirua';
import {
  NIGHT_PALETTES,
  STYLE_EXPERIMENTS,
  useNightPalette,
  useStyleExperiment,
  type NightPalette,
  type StyleExperiment,
} from './styleExperiment';
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
  const { experiment, choose: chooseExperiment } = useStyleExperiment();
  const { palette, choose: choosePalette } = useNightPalette();

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
      <DropdownMenuContent align="end" className="min-w-48">
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

        {/* TEMPORARY: see `styleExperiment.ts`. */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Style experiment</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={experiment}
          onValueChange={(value) => chooseExperiment(value as StyleExperiment)}
        >
          {STYLE_EXPERIMENTS.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {experiment === 'hybrid-clay' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Night palette</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={palette}
              onValueChange={(value) => choosePalette(value as NightPalette)}
            >
              {NIGHT_PALETTES.map((option) => (
                <DropdownMenuRadioItem key={option.id} value={option.id}>
                  {option.label}
                  <span
                    aria-hidden="true"
                    className="ms-auto flex h-6 w-9 shrink-0 items-end justify-end rounded-xs border border-line p-1"
                    style={{ backgroundColor: option.page }}
                  >
                    <span
                      className="h-3.5 w-5 rounded-xs"
                      style={{ backgroundColor: option.card }}
                    />
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
