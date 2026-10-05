import { Fragment, type ReactNode } from 'react';
import {
  Button,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLegend,
  FieldSet,
  Heading,
  Inline,
  Kbd,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Stack,
  Switch,
} from 'kirua';
import { shortcuts } from './data';
import type { ThemePreference } from '../shared/useTheme';

export interface SettingsDialogProps {
  /**
   * The control that opens it. Passing the trigger in rather than lifting
   * `open` into the page is what `DialogTrigger` is for: Radix then owns the
   * open state, restores focus to the trigger on close, and marks the trigger
   * `aria-expanded` — three things a boolean in the page does not do.
   */
  trigger: ReactNode;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

export function SettingsDialog({ trigger, theme, onThemeChange }: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <Stack gap={6}>
          <Stack gap={0}>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Nothing here is saved. It is a sample screen.</DialogDescription>
          </Stack>

          {/* Three states, not a switch: "system" is a real choice and a
              two-position control cannot say it. The same value backs the
              header menu — one owner, one key. */}
          <FieldSet>
            <FieldLegend>Appearance</FieldLegend>
            <RadioGroup
              value={theme}
              onValueChange={(value) => onThemeChange(value as ThemePreference)}
            >
              {(
                [
                  ['light', 'Light'],
                  ['dark', 'Dark'],
                  ['system', 'Follow the system'],
                ] as const
              ).map(([value, label]) => (
                <Field
                  key={value}
                  orientation="horizontal"
                  controlId={`theme-${value}`}
                  label={label}
                >
                  <RadioGroupItem value={value} />
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>

          <Inline justify="between" gap={4}>
            <Label htmlFor="sounds">Sound on reply</Label>
            <Switch id="sounds" />
          </Inline>

          <Select defaultValue="balanced">
            <Field controlId="model" label="Model" description="Longer answers cost more.">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </Field>
            <SelectContent aria-label="Model">
              <SelectItem value="fast">Fast</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="thorough">Thorough</SelectItem>
            </SelectContent>
          </Select>

          <Separator />

          <Stack gap={3}>
            <Heading as="h3" size="body-sm">
              Keyboard shortcuts
            </Heading>
            <DescriptionList>
              {shortcuts.map(({ keys, what }) => (
                <Fragment key={what}>
                  <DescriptionTerm>{what}</DescriptionTerm>
                  <DescriptionDetails>
                    <Inline as="span" gap={1} justify="end">
                      {keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </Inline>
                  </DescriptionDetails>
                </Fragment>
              ))}
            </DescriptionList>
          </Stack>
        </Stack>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
