import {
  Alert,
  AlertDescription,
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
  Progress,
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
  PrintIcon,
} from 'kirua';
import { age, statusTone, vitals, visits, type Patient } from './data';

export interface PatientRecordProps {
  patient: Patient;
}

export function PatientRecord({ patient }: PatientRecordProps) {
  const history = visits.filter((v) => v.rm === patient.rm);
  const measurements = vitals[patient.rm] ?? [];
  const latest = measurements[0];

  return (
    <div className="grid content-start gap-5">
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
            <h1 className="text-heading-md font-semibold text-fg">{patient.name}</h1>
            <p className="text-body-sm text-fg-secondary tabular-nums">
              {patient.rm} · {age(patient.born)} tahun ·{' '}
              {patient.sex === 'P' ? 'Perempuan' : 'Laki-laki'}
            </p>
          </div>
        </div>
        <Button variant="secondary" leadingIcon={<PrintIcon />} onClick={() => window.print()}>
          Cetak
        </Button>
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
        <TabsList>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
          <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
          <TabsTrigger value="vital">Tanda vital</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="grid gap-3 p-5">
              <h2 className="text-body-md font-semibold text-fg">Identitas</h2>
              <Separator />
              <dl className="grid gap-2 text-body-sm">
                {(
                  [
                    ['Tanggal lahir', patient.born],
                    ['Penjamin', patient.payer],
                    ['Telepon', patient.phone],
                    ['Alamat', patient.address],
                  ] as const
                ).map(([term, value]) => (
                  <div key={term} className="grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-fg-secondary">{term}</dt>
                    <dd className="text-pretty text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="grid gap-3 p-5">
              <h2 className="text-body-md font-semibold text-fg">Kelengkapan berkas</h2>
              <Separator />
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Rekam medis</span>
                  <span className="text-fg tabular-nums">82%</span>
                </p>
                <Progress value={82} aria-label="Kelengkapan rekam medis" />
              </div>
              <div className="grid gap-2">
                <p className="flex justify-between text-body-sm">
                  <span className="text-fg-secondary">Berkas penjamin</span>
                  <span className="text-fg tabular-nums">100%</span>
                </p>
                <Progress value={100} aria-label="Kelengkapan berkas penjamin" />
              </div>
              {latest && (
                <p className="mt-2 text-body-sm text-fg-secondary tabular-nums">
                  Terakhir diukur {latest.at} — {latest.systolic}/{latest.diastolic} mmHg
                </p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kunjungan">
          <Table>
            <TableCaption>Riwayat kunjungan {patient.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Poliklinik</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="tabular-nums">{visit.at}</TableCell>
                  <TableCell>{visit.clinic}</TableCell>
                  <TableCell>{visit.doctor}</TableCell>
                  <TableCell>{visit.reason}</TableCell>
                  <TableCell>
                    <Badge status={statusTone[visit.status]}>{visit.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="vital">
          {measurements.length === 0 ? (
            <p className="text-body-sm text-fg-secondary">Belum ada pengukuran.</p>
          ) : (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
