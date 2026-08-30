import { Fragment } from 'react';
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
  Field,
  Heading,
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
  Switch,
} from 'kirua';
import { shortcuts } from './data';
import type { ThemePreference } from '../shared/useTheme';

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  theme,
  onThemeChange,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Nothing here is saved. It is a sample screen.</DialogDescription>

        <div className="mt-6 grid gap-6">
          {/* Three states, not a switch: "system" is a real choice and a
              two-position control cannot say it. The same value backs the
              header menu — one owner, one key. */}
          <fieldset className="grid gap-3">
            <legend className="mb-1 text-body-sm font-medium text-fg">Appearance</legend>
            <RadioGroup
              value={theme}
              onValueChange={(value) => onThemeChange(value as ThemePreference)}
              aria-label="Appearance"
            >
              {(
                [
                  ['light', 'Light'],
                  ['dark', 'Dark'],
                  ['system', 'Follow the system'],
                ] as const
              ).map(([value, label]) => (
                <div key={value} className="flex items-center gap-2">
                  <RadioGroupItem value={value} id={`theme-${value}`} />
                  <Label htmlFor={`theme-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sounds">Sound on reply</Label>
            <Switch id="sounds" />
          </div>

          <Field controlId="model" label="Model" description="Longer answers cost more.">
            <Select defaultValue="balanced">
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent aria-label="Model">
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="thorough">Thorough</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Separator />

          <div className="grid gap-3">
            <Heading as="h3" size="body-sm">
              Keyboard shortcuts
            </Heading>
            <DescriptionList>
              {shortcuts.map(({ keys, what }) => (
                <Fragment key={what}>
                  <DescriptionTerm>{what}</DescriptionTerm>
                  <DescriptionDetails>
                    <span className="inline-flex items-center gap-1">
                      {keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </DescriptionDetails>
                </Fragment>
              ))}
            </DescriptionList>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
