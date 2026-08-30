import { useState } from 'react';
import {
  Badge,
  Calendar,
  Card,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from 'kirua';
import { clinics, statusTone, visits } from './data';

export function Appointments() {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 2, 12));
  const [clinic, setClinic] = useState('semua');

  const rows = visits.filter((v) => clinic === 'semua' || v.clinic === clinic);

  return (
    <div className="grid content-start gap-5">
      <h1 className="text-heading-md font-semibold text-fg">Jadwal kunjungan</h1>

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <Card className="h-max p-3">
          <Calendar
            locale="id-ID"
            month={month}
            onMonthChange={setMonth}
            selected={day}
            onSelect={setDay}
            today={new Date(2026, 2, 12)}
            className="bg-transparent p-0"
          />
          <Separator className="my-3" />
          <p className="px-1 text-body-sm text-fg-secondary">
            {day === undefined
              ? 'Pilih tanggal.'
              : new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(day)}
          </p>
        </Card>

        <div className="grid content-start gap-4">
          <div className="grid gap-2">
            <span id="clinic-filter" className="text-body-sm font-medium text-fg">
              Poliklinik
            </span>
            <ToggleGroup
              type="single"
              value={clinic}
              onValueChange={(next) => next && setClinic(next)}
              aria-labelledby="clinic-filter"
              className="flex-wrap"
            >
              <ToggleGroupItem value="semua" size="sm" variant="outline">
                Semua
              </ToggleGroupItem>
              {clinics.map((name) => (
                <ToggleGroupItem key={name} value={name} size="sm" variant="outline">
                  {name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Table>
            <TableCaption>
              {rows.length} kunjungan{clinic === 'semua' ? '' : ` di ${clinic}`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Jam</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Poliklinik</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="tabular-nums">{visit.at.slice(11)}</TableCell>
                  <TableCell className="tabular-nums">{visit.rm}</TableCell>
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
        </div>
      </div>
    </div>
  );
}
