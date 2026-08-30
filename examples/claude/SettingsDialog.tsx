import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Field,
  Kbd,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from 'kirua';
import { shortcuts } from './data';

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  dark,
  onDarkChange,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Nothing here is saved. It is a sample screen.</DialogDescription>

        <div className="mt-6 grid gap-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="dark-mode">Dark mode</Label>
            <Switch id="dark-mode" checked={dark} onCheckedChange={onDarkChange} />
          </div>

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
            <h3 className="text-body-sm font-semibold text-fg">Keyboard shortcuts</h3>
            <dl className="grid gap-2">
              {shortcuts.map(({ keys, what }) => (
                <div key={what} className="flex items-center justify-between gap-4">
                  <dt className="text-body-sm text-fg-secondary">{what}</dt>
                  <dd className="flex items-center gap-1">
                    {keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
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
