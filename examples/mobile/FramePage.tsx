import { useEffect, useRef, useState } from 'react';
import {
  AppBody,
  AppHeader,
  AppMain,
  AppShell,
  Container,
  DeviceFrame,
  List,
  ListItem,
  PageHeader,
  SparkleIcon,
  Split,
  Stack,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  Wordmark,
} from '@kobars/kirua';
import { AllExamplesLink } from '../shared/AllExamplesLink';
import { ThemeMenu } from '../shared/ThemeMenu';

const DEVICES = [
  { id: 'sm', label: 'Small', width: 320 },
  { id: 'md', label: 'Standard', width: 390 },
  { id: 'lg', label: 'Large', width: 430 },
] as const;

type Device = (typeof DEVICES)[number]['id'];

export interface FramePageProps {
  /** The screen to open in the frame, without the section's prefix. */
  route: string;
}

/**
 * Pouch on a wide screen: the app itself, at a phone's width, inside a
 * `DeviceFrame`. The page in the frame is a second copy of the app, so it has
 * its own history and keeps its place while the size changes.
 */
export function FramePage({ route }: FramePageProps) {
  const [device, setDevice] = useState<Device>('md');
  // Read once: the frame navigates on its own, and a new address here would
  // reload it and lose its place.
  const [src] = useState(() => `./#/mobile/${route}`);
  const frame = useRef<HTMLIFrameElement>(null);
  const shown = useRef(route);

  // A new address up here — typed, or followed from a link — moves the page
  // in the frame to the same screen, by its hash, so it does not reload.
  useEffect(() => {
    if (shown.current === route) return;
    shown.current = route;
    const inner = frame.current?.contentWindow;
    if (inner) inner.location.hash = `#/mobile/${route}`;
  }, [route]);
  const chosen = DEVICES.find((option) => option.id === device) ?? DEVICES[1];

  return (
    <AppShell>
      {/* Named, because the page in the frame brings its own header and main:
          two of each, unnamed, are two landmarks nobody can tell apart. */}
      <AppHeader width="6xl" actions={<ThemeMenu />} aria-label="Kirua examples">
        <AllExamplesLink />
        <Wordmark href="#/" icon={<SparkleIcon />}>
          Kirua
        </Wordmark>
      </AppHeader>
      <AppBody width="6xl">
        <AppMain data-route={`mobile/${route}`} aria-label="Phone preview">
          <Container width="6xl" pad="md">
            <Split layout="fit-end" from="lg" align="start" gap={10}>
              <Stack gap={6}>
                <PageHeader
                  eyebrow="Phone app"
                  title="Pouch, at the size of a phone"
                  description="Pouch is made only for phones. On a wide screen it runs inside this frame, which is a real page at a phone’s width, so every component in it behaves as it does on the phone. Open this address on a phone to use it full screen."
                />

                <Stack gap={2}>
                  <Text size="sm" weight="medium" tone="primary" id="device-label">
                    Phone size
                  </Text>
                  <ToggleGroup
                    type="single"
                    value={device}
                    onValueChange={(next) => {
                      if (next) setDevice(next as Device);
                    }}
                    aria-labelledby="device-label"
                    wrap
                  >
                    {DEVICES.map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        variant="outline"
                        size="sm"
                      >
                        {option.label} · {option.width}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Stack>

                <Stack gap={2}>
                  <Text size="sm" weight="medium" tone="primary">
                    Things to try
                  </Text>
                  <List>
                    <ListItem>Send money to a friend with the keypad.</ListItem>
                    <ListItem>
                      Send $500 or more: Pouch asks for a code first. The demo code is on the
                      screen.
                    </ListItem>
                    <ListItem>Schedule a payment for a later day.</ListItem>
                    <ListItem>Swipe the savings goals on Home, then add money to one.</ListItem>
                    <ListItem>Verify your identity in three steps, from Profile.</ListItem>
                    <ListItem>Freeze a card, then change its monthly limit.</ListItem>
                    <ListItem>
                      Switch the theme inside the phone. This page follows it.
                    </ListItem>
                  </List>
                </Stack>
              </Stack>

              <DeviceFrame
                ref={frame}
                src={src}
                device={device}
                title={`Pouch on a ${chosen.label.toLowerCase()} phone, ${chosen.width} pixels wide`}
              />
            </Split>
          </Container>
        </AppMain>
      </AppBody>
    </AppShell>
  );
}
