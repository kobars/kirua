import { Fragment, useState } from 'react';
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
  Heading,
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
} from 'kirua';
import { age, flagTone, labResults, statusTone, vitals, visits, type Patient } from './data';

export interface PatientRecordProps {
  patient: Patient;
}

export function PatientRecord({ patient }: PatientRecordProps) {
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // The view menu drives the visit table below. A menubar earns its place only
  // when its items do something, so these are real state and not decoration.
  const [order, setOrder] = useState('newest');
  const [showCancelled, setShowCancelled] = useState(true);

  const history = visits
    .filter((v) => v.rm === patient.rm)
    .filter((v) => showCancelled || !(cancelled.includes(v.id) || v.status === 'cancelled'))
    .sort((a, b) => (order === 'newest' ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at)));
  const measurements = vitals[patient.rm] ?? [];
  const latest = measurements[0];
  const orders = labResults.filter((order) => order.rm === patient.rm);

  // Oldest first, so the line reads left to right the way a chart should.
  const pressure = [...measurements]
    .reverse()
    .map((vital) => ({ label: vital.at.slice(0, 10), value: vital.systolic }));

  return (
    /* `minmax(0, 1fr)` and not the default `auto`: a grid item keeps
       `min-width: auto`, so the widest child — the four-tab list — would
       otherwise stretch the whole column past the viewport. */
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{patient.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
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
            <Text size="sm" className="tabular-nums">
              {patient.rm} · {age(patient.born)} years ·{' '}
              {patient.sex === 'F' ? 'Female' : 'Male'}
            </Text>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Menubar className="hidden sm:flex">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => window.print()}>
                  Print the record
                  <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>Export as PDF</MenubarItem>
                <MenubarSeparator />
                <MenubarItem disabled>Send to BPJS — not connected</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Actions</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Book a new visit</MenubarItem>
                <MenubarItem>Order a lab test</MenubarItem>
                <MenubarItem>Write a prescription</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                {/* A group with a label, rather than a separator and a heading:
                    the label names the radio set for a screen reader too. */}
                <MenubarGroup>
                  <MenubarLabel>Visit order</MenubarLabel>
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
                    Cancelled visits
                  </MenubarCheckboxItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <Button
            variant="secondary"
            leadingIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Cetak
          </Button>
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <Alert status="danger">
          <AlertTitle>Recorded allergies</AlertTitle>
          <AlertDescription>
            {patient.allergies.join(', ')}. Check before prescribing.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="summary">
        {/* Four tabs do not fit on a phone. They scroll rather than wrap: a
            wrapped tab list moves the panel down the page as the row grows. */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="vitals">Vital signs</TabsTrigger>
            <TabsTrigger value="lab">Laboratory</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="grid gap-3 p-5">
              <Heading as="h2" size="body-md">
                Identity
              </Heading>
              <Separator />
              <DescriptionList layout="aligned">
                {(
                  [
                    ['Date of birth', patient.born],
                    ['Payer', patient.payer],
                    ['Phone', patient.phone],
                    ['Address', patient.address],
                  ] as const
                ).map(([term, value]) => (
                  <Fragment key={term}>
                    <DescriptionTerm>{term}</DescriptionTerm>
                    <DescriptionDetails>{value}</DescriptionDetails>
                  </Fragment>
                ))}
              </DescriptionList>
            </Card>

            <Card className="grid gap-3 p-5">
              <Heading as="h2" size="body-md">
                Record completeness
              </Heading>
              <Separator />
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Medical record</span>
                  <span className="text-fg tabular-nums">82%</span>
                </p>
                <Meter
                  value={82}
                  label="Medical record completeness"
                  valueText="82 out of 100 per cent"
                />
              </div>
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Payer paperwork</span>
                  <span className="text-fg tabular-nums">100%</span>
                </p>
                <Meter
                  value={100}
                  label="Payer paperwork completeness"
                  valueText="100 out of 100 per cent"
                />
              </div>
              {latest && (
                <Text size="sm" className="mt-2 tabular-nums">
                  Last measured {latest.at} — {latest.systolic}/{latest.diastolic} mmHg
                </Text>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visits">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Visit history for {patient.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="relative">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((visit) => {
                  const status = cancelled.includes(visit.id) ? 'cancelled' : visit.status;
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="tabular-nums">{visit.at}</TableCell>
                      <TableCell>{visit.clinic}</TableCell>
                      <TableCell>{visit.doctor}</TableCell>
                      <TableCell>{visit.reason}</TableCell>
                      <TableCell>
                        <Badge status={statusTone[status]}>{status}</Badge>
                      </TableCell>
                      <TableCell>
                        {status === 'scheduled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelling(visit.id)}
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
          </div>
        </TabsContent>

        <TabsContent value="vital">
          {measurements.length === 0 ? (
            <Text size="sm">No measurements yet.</Text>
          ) : (
            <div className="grid gap-6">
              <Card className="p-5">
                <Chart
                  label={`Systolic blood pressure for ${patient.name}, the last three measurements`}
                >
                  <LineChart data={pressure} filled series={5} />
                </Chart>
              </Card>
              <Table>
                <TableCaption>Tanda vital, terbaru di atas</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Blood pressure</TableHead>
                    <TableHead>Pulse</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measurements.map((vital) => (
                    <TableRow key={vital.at}>
                      <TableCell className="tabular-nums">{vital.at}</TableCell>
                      <TableCell className="tabular-nums">
                        {vital.systolic}/{vital.diastolic} mmHg
                      </TableCell>
                      <TableCell className="tabular-nums">{vital.pulse}/mnt</TableCell>
                      <TableCell className="tabular-nums">{vital.temperature} °C</TableCell>
                      <TableCell className="tabular-nums">{vital.weight} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lab">
          {orders.length === 0 ? (
            <Text size="sm">No laboratory tests yet.</Text>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="grid gap-3 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Heading as="h2" size="body-md">
                      {order.panel}
                    </Heading>
                    <span className="text-body-sm text-fg-secondary tabular-nums">
                      {order.id} · {order.at}
                    </span>
                  </div>
                  <Separator />
                  {order.rows.length === 0 ? (
                    <Text size="sm">Results are not back yet.</Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Reference range</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.rows.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>
                                <span className="flex items-center gap-2">
                                  <span className="tabular-nums">
                                    {row.value} {row.unit}
                                  </span>
                                  {row.flag !== 'normal' && (
                                    <Badge status={flagTone[row.flag]}>{row.flag}</Badge>
                                  )}
                                </span>
                              </TableCell>
                              <TableCell className="text-fg-secondary tabular-nums">
                                {row.reference}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Cancel visit {cancelling}?</AlertDialogTitle>
          <AlertDialogDescription>
            The slot is released and the patient has to be rebooked. A cancellation cannot be
            undone from this screen.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep it scheduled</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (cancelling) setCancelled((all) => [...all, cancelling]);
                  setCancelling(null);
                }}
              >
                Cancel the visit
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
