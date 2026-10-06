import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Field,
  Heading,
  Inline,
  Label,
  NativeSelect,
  NativeSelectOption,
  Separator,
  Stack,
  Switch,
  Text,
} from '@kobars/kirua';

export interface ProfileProps {
  onNotice: (title: string, description: string) => void;
}

/** One row of the settings card: what the switch does, then the switch. */
function SettingSwitch({
  id,
  label,
  description,
  defaultChecked = false,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <Inline justify="between" gap={4}>
      <Stack gap={0}>
        <Label htmlFor={id}>{label}</Label>
        <Text size="sm">{description}</Text>
      </Stack>
      <Switch id={id} defaultChecked={defaultChecked} />
    </Inline>
  );
}

/** The account, the settings a phone app keeps, and the way out. */
export function Profile({ onNotice }: ProfileProps) {
  return (
    <Stack gap={6}>
      <Inline gap={4}>
        <Avatar size="xl">
          <AvatarFallback>RA</AvatarFallback>
        </Avatar>
        <Stack gap={0}>
          <Heading as="h1" size="heading-md">
            Rin Aoki
          </Heading>
          <Text size="sm">@rin · member since 2024</Text>
        </Stack>
      </Inline>

      <Card padding="md" gap={4}>
        <Heading as="h2" size="heading-sm">
          Settings
        </Heading>
        <SettingSwitch
          id="setting-payments"
          label="Payment alerts"
          description="A notification for every payment in or out."
          defaultChecked
        />
        <Separator />
        <SettingSwitch
          id="setting-face"
          label="Unlock with Face ID"
          description="Instead of your passcode, on this phone only."
          defaultChecked
        />
        <Separator />
        <SettingSwitch
          id="setting-round"
          label="Round up to savings"
          description="Card payments round up to the next dollar."
        />
        <Separator />
        <Field controlId="setting-currency" label="Show amounts in">
          <NativeSelect id="setting-currency" defaultValue="USD">
            <NativeSelectOption value="USD">US dollars</NativeSelectOption>
            <NativeSelectOption value="EUR">Euros</NativeSelectOption>
            <NativeSelectOption value="GBP">Pounds sterling</NativeSelectOption>
            <NativeSelectOption value="JPY">Japanese yen</NativeSelectOption>
          </NativeSelect>
        </Field>
      </Card>

      <Stack gap={3}>
        <Button
          variant="secondary"
          fullWidth
          onClick={() =>
            onNotice('Statement on its way', 'Your October statement is in your email.')
          }
        >
          Email my statement
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="danger" fullWidth>
              Sign out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Sign out of Pouch?</AlertDialogTitle>
            <AlertDialogDescription>
              You need your passcode to sign back in on this phone.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="secondary">Stay signed in</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="danger"
                  onClick={() =>
                    onNotice('Still signed in', 'This is a demo, so signing out does nothing.')
                  }
                >
                  Sign out
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Stack>
    </Stack>
  );
}
