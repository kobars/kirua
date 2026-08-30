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
  MenubarContent,
  MenubarItem,
  MenubarMenu,
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

  const history = visits.filter((v) => v.rm === patient.rm);
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
            <BreadcrumbLink href="#/">Pasien</BreadcrumbLink>
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
              {patient.rm} · {age(patient.born)} tahun ·{' '}
              {patient.sex === 'P' ? 'Perempuan' : 'Laki-laki'}
            </Text>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Menubar className="hidden sm:flex">
            <MenubarMenu>
              <MenubarTrigger>Berkas</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => window.print()}>
                  Cetak rekam medis
                  <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>Ekspor PDF</MenubarItem>
                <MenubarSeparator />
                <MenubarItem disabled>Kirim ke BPJS — belum tersambung</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Tindakan</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Buat kunjungan baru</MenubarItem>
                <MenubarItem>Minta pemeriksaan lab</MenubarItem>
                <MenubarItem>Tulis resep</MenubarItem>
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
          <AlertTitle>Alergi tercatat</AlertTitle>
          <AlertDescription>
            {patient.allergies.join(', ')}. Periksa sebelum meresepkan.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="ringkasan">
        {/* Four tabs do not fit on a phone. They scroll rather than wrap: a
            wrapped tab list moves the panel down the page as the row grows. */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <TabsList>
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
            <TabsTrigger value="vital">Tanda vital</TabsTrigger>
            <TabsTrigger value="lab">Laboratorium</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ringkasan">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="grid gap-3 p-5">
              <Heading as="h2" size="body-md">
                Identitas
              </Heading>
              <Separator />
              <DescriptionList layout="aligned">
                {(
                  [
                    ['Tanggal lahir', patient.born],
                    ['Penjamin', patient.payer],
                    ['Telepon', patient.phone],
                    ['Alamat', patient.address],
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
                Kelengkapan berkas
              </Heading>
              <Separator />
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Rekam medis</span>
                  <span className="text-fg tabular-nums">82%</span>
                </p>
                <Meter
                  value={82}
                  label="Kelengkapan rekam medis"
                  valueText="82 dari 100 persen"
                />
              </div>
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Berkas penjamin</span>
                  <span className="text-fg tabular-nums">100%</span>
                </p>
                <Meter
                  value={100}
                  label="Kelengkapan berkas penjamin"
                  valueText="100 dari 100 persen"
                />
              </div>
              {latest && (
                <Text size="sm" className="mt-2 tabular-nums">
                  Terakhir diukur {latest.at} — {latest.systolic}/{latest.diastolic} mmHg
                </Text>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kunjungan">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Riwayat kunjungan {patient.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Poliklinik</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="relative">
                    <span className="sr-only">Tindakan</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((visit) => {
                  const status = cancelled.includes(visit.id) ? 'batal' : visit.status;
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
                        {status === 'terjadwal' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelling(visit.id)}
                          >
                            Batalkan
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
            <Text size="sm">Belum ada pengukuran.</Text>
          ) : (
            <div className="grid gap-6">
              <Card className="p-5">
                <Chart
                  label={`Tekanan darah sistolik ${patient.name}, tiga pengukuran terakhir`}
                >
                  <LineChart data={pressure} filled series={5} />
                </Chart>
              </Card>
              <Table>
                <TableCaption>Tanda vital, terbaru di atas</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tekanan darah</TableHead>
                    <TableHead>Nadi</TableHead>
                    <TableHead>Suhu</TableHead>
                    <TableHead>Berat</TableHead>
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
            <Text size="sm">Belum ada pemeriksaan laboratorium.</Text>
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
                    <Text size="sm">Hasil belum keluar.</Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pemeriksaan</TableHead>
                            <TableHead>Hasil</TableHead>
                            <TableHead>Rentang rujukan</TableHead>
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
          <AlertDialogTitle>Batalkan kunjungan {cancelling}?</AlertDialogTitle>
          <AlertDialogDescription>
            Slot ini akan dilepas dan pasien harus dijadwalkan ulang. Pembatalan tidak bisa
            ditarik kembali dari layar ini.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Biarkan terjadwal</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (cancelling) setCancelled((all) => [...all, cancelling]);
                  setCancelling(null);
                }}
              >
                Batalkan kunjungan
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
