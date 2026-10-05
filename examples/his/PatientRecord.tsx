import { Fragment, useState, type ReactNode } from 'react';
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  Chart,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Grid,
  Heading,
  Inline,
  LineChart,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  Meter,
  PrintIcon,
  Separator,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Visible,
  VisuallyHidden,
} from '@kobars/kirua';
import {
  age,
  celsius,
  eligibilityTone,
  encounters,
  flagLabel,
  flagTone,
  formatDate,
  formatDateTime,
  formatDob,
  formatShortDate,
  labResults,
  statusLabel,
  statusTone,
  vitals,
  type Patient,
} from './data';

const eligibilityLabel = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
} as const;

export interface PatientRecordProps {
  patient: Patient;
}

export function PatientRecord({ patient }: PatientRecordProps) {
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // The view menu drives the encounter table below. A menubar earns its place only
  // when its items do something, so these are real state and not decoration.
  const [order, setOrder] = useState('newest');
  const [showCancelled, setShowCancelled] = useState(true);

  const history = encounters
    .filter((e) => e.mrn === patient.mrn)
    .filter((e) => showCancelled || !(cancelled.includes(e.id) || e.status === 'canceled'))
    .sort((a, b) => (order === 'newest' ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at)));
  const measurements = vitals[patient.mrn] ?? [];
  const latest = measurements[0];
  const orders = labResults.filter((order) => order.mrn === patient.mrn);
  const target = encounters.find((e) => e.id === cancelling);
  const coverage = patient.coverage;
  // Registration is complete when the payer has confirmed coverage, or when
  // there is no payer to ask.
  const registration = coverage === undefined || coverage.eligibility === 'active' ? 100 : 60;

  const details: [string, ReactNode][] = [
    ['Date of birth', formatDob(patient.born)],
    ...(patient.preferred
      ? [['Preferred name', patient.preferred] as [string, ReactNode]]
      : []),
    ['Phone', patient.phone],
    ['Address', patient.address],
    ['Primary payer', patient.payer],
    ...(coverage
      ? ([
          ['Plan', coverage.plan],
          ['Member ID', coverage.memberId],
          ...(coverage.group ? [['Group no.', coverage.group] as [string, ReactNode]] : []),
          [
            'Eligibility',
            <Inline key="eligibility" as="span" wrap gap={2}>
              <Badge status={eligibilityTone[coverage.eligibility]}>
                {eligibilityLabel[coverage.eligibility]}
              </Badge>
              <Text inline size="sm">
                checked {formatDate(coverage.verified)}
              </Text>
            </Inline>,
          ],
        ] as [string, ReactNode][])
      : []),
  ];

  // Oldest first, so the line reads left to right the way a chart should.
  const pressure = [...measurements]
    .reverse()
    .map((vital) => ({ label: formatShortDate(vital.at), value: vital.systolic }));

  return (
    <Stack gap={5}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/his/patients">Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{patient.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Inline wrap align="start" justify="between" gap={4}>
        <Inline gap={3}>
          <Avatar size="lg">
            <AvatarFallback>
              {patient.name
                .split(' ')
                .map((part) => part.charAt(0))
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Heading as="h1" size="heading-md">
              {patient.name}
            </Heading>
            <Text size="sm" numeric>
              MRN {patient.mrn} · DOB {formatDob(patient.born)} ({age(patient.born)} y) ·{' '}
              {patient.sex === 'F' ? 'Female' : 'Male'}
            </Text>
          </div>
        </Inline>
        <Inline wrap gap={3}>
          <Visible from="sm">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onSelect={() => window.print()}>
                    Print the chart
                    <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>Export a C-CDA summary</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem disabled>Send to the state HIE — not connected</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Actions</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Schedule an appointment</MenubarItem>
                  <MenubarItem>Place a lab order</MenubarItem>
                  <MenubarItem>Prescribe a medication</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  {/* A group with a label, rather than a separator and a heading:
                    the label names the radio set for a screen reader too. */}
                  <MenubarGroup>
                    <MenubarLabel>Encounter order</MenubarLabel>
                    <MenubarRadioGroup value={order} onValueChange={setOrder}>
                      <MenubarRadioItem value="newest">Newest first</MenubarRadioItem>
                      <MenubarRadioItem value="oldest">Oldest first</MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarGroup>
                    <MenubarLabel>Show</MenubarLabel>
                    <MenubarCheckboxItem
                      checked={showCancelled}
                      onCheckedChange={setShowCancelled}
                    >
                      Canceled appointments
                    </MenubarCheckboxItem>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Visible>

          <Button
            variant="secondary"
            leadingIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Inline>
      </Inline>

      {patient.allergies.length > 0 && (
        <Alert status="danger">
          <AlertTitle>Allergies</AlertTitle>
          <AlertDescription>
            {patient.allergies.join(', ')}. Review before ordering or administering medications.
          </AlertDescription>
        </Alert>
      )}

      {coverage && coverage.eligibility !== 'active' && (
        <Alert status="warning">
          <AlertTitle>
            {coverage.eligibility === 'pending' ? 'Eligibility pending' : 'Coverage inactive'}
          </AlertTitle>
          <AlertDescription>
            {coverage.eligibility === 'pending'
              ? `${coverage.plan} has not confirmed coverage as of ${formatDate(coverage.verified)}.`
              : `${coverage.plan} returned no active coverage on ${formatDate(coverage.verified)}.`}{' '}
            Re-verify before the visit, or update the patient’s coverage.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="encounters">Encounters</TabsTrigger>
          <TabsTrigger value="vitals">Vital signs</TabsTrigger>
          <TabsTrigger value="lab">Laboratory</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Grid md={2} gap={4}>
            <Card padding="md" gap={3}>
              <Heading as="h2" size="body-md">
                Demographics and coverage
              </Heading>
              <Separator />
              <DescriptionList layout="aligned">
                {details.map(([term, value]) => (
                  <Fragment key={term}>
                    <DescriptionTerm>{term}</DescriptionTerm>
                    <DescriptionDetails>{value}</DescriptionDetails>
                  </Fragment>
                ))}
              </DescriptionList>
            </Card>

            <Card padding="md" gap={3}>
              <Heading as="h2" size="body-md">
                Chart completion
              </Heading>
              <Separator />
              <Stack gap={2}>
                <DescriptionList>
                  <DescriptionTerm>Clinical documentation</DescriptionTerm>
                  <DescriptionDetails numeric>82%</DescriptionDetails>
                </DescriptionList>
                <Meter
                  value={82}
                  label="Clinical documentation completion"
                  valueText="82 percent"
                />
              </Stack>
              <Stack gap={2}>
                <DescriptionList>
                  <DescriptionTerm>Registration and coverage</DescriptionTerm>
                  <DescriptionDetails numeric>{registration}%</DescriptionDetails>
                </DescriptionList>
                <Meter
                  value={registration}
                  label="Registration and coverage completion"
                  valueText={`${registration} percent`}
                />
              </Stack>
              {latest && (
                <Text size="sm" numeric>
                  Last vitals {formatDateTime(latest.at)} — BP {latest.systolic}/
                  {latest.diastolic} mmHg
                </Text>
              )}
            </Card>
          </Grid>
        </TabsContent>

        <TabsContent value="encounters">
          <Table>
            <TableCaption>Encounters for {patient.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date and time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Reason for visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((encounter) => {
                const status = cancelled.includes(encounter.id) ? 'canceled' : encounter.status;
                return (
                  <TableRow key={encounter.id}>
                    <TableCell numeric>{formatDateTime(encounter.at)}</TableCell>
                    <TableCell>
                      {encounter.type}
                      {encounter.acuity && ` · ESI ${encounter.acuity}`}
                    </TableCell>
                    <TableCell>{encounter.department}</TableCell>
                    <TableCell>{encounter.provider}</TableCell>
                    <TableCell>{encounter.reason}</TableCell>
                    <TableCell>
                      <Badge status={statusTone[status]}>{statusLabel[status]}</Badge>
                    </TableCell>
                    <TableCell>
                      {status === 'scheduled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancelling(encounter.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="vitals">
          {measurements.length === 0 ? (
            <Text size="sm">No vitals recorded yet.</Text>
          ) : (
            <Stack gap={6}>
              <Card padding="md">
                <Chart
                  label={`Systolic blood pressure for ${patient.name}, the last three readings`}
                >
                  <LineChart data={pressure} filled series={5} />
                </Chart>
              </Card>
              <Table>
                <TableCaption>Vital signs, newest first</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date and time</TableHead>
                    <TableHead>Blood pressure</TableHead>
                    <TableHead>Pulse</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>SpO₂</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measurements.map((vital) => (
                    <TableRow key={vital.at}>
                      <TableCell numeric>{formatDateTime(vital.at)}</TableCell>
                      <TableCell numeric>
                        {vital.systolic}/{vital.diastolic} mmHg
                      </TableCell>
                      <TableCell numeric>{vital.pulse} bpm</TableCell>
                      <TableCell numeric>
                        {vital.temperature.toFixed(1)} °F ({celsius(vital.temperature)} °C)
                      </TableCell>
                      <TableCell numeric>{vital.spo2}%</TableCell>
                      <TableCell numeric>{vital.weight.toFixed(1)} lb</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          )}
        </TabsContent>

        <TabsContent value="lab">
          {orders.length === 0 ? (
            <Text size="sm">No lab orders yet.</Text>
          ) : (
            <Stack gap={4}>
              {orders.map((order) => (
                <Card key={order.id} padding="md" gap={3}>
                  <Inline wrap justify="between" gap={2}>
                    <Heading as="h2" size="body-md">
                      {order.panel}
                    </Heading>
                    <Text inline size="sm" numeric>
                      {order.id} · {formatDateTime(order.at)} · {order.orderedBy}
                    </Text>
                  </Inline>
                  <Separator />
                  {order.rows.length === 0 ? (
                    <Text size="sm">Collected. Results are not final yet.</Text>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Component</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Reference interval</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.rows.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell>
                              <Text size="inherit" tone="primary">
                                {row.name}
                              </Text>
                              <Text size="caption" tone="muted" numeric>
                                LOINC {row.loinc}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Inline as="span" gap={2}>
                                <Text inline size="sm" tone="primary" numeric>
                                  {row.value} {row.unit}
                                </Text>
                                {row.flag !== 'normal' && (
                                  <Badge status={flagTone[row.flag]}>
                                    {flagLabel[row.flag]}
                                  </Badge>
                                )}
                              </Inline>
                            </TableCell>
                            <TableCell tone="secondary" numeric>
                              {row.reference}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              ))}
            </Stack>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            {target &&
              `${target.department} with ${target.provider}, ${formatDateTime(target.at)}. `}
            The slot is released and the patient has to be rescheduled. A cancellation cannot be
            undone from this screen.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep the appointment</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (cancelling) setCancelled((all) => [...all, cancelling]);
                  setCancelling(null);
                }}
              >
                Cancel the appointment
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
