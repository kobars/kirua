import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  Heading,
  Input,
  Label,
  Link,
  PlusIcon,
  SearchIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'kirua';
import { age, patients } from './data';

export interface PatientListProps {
  onOpen: (rm: string) => void;
  onNewVisit: () => void;
}

export function PatientList({ onOpen, onNewVisit }: PatientListProps) {
  const [query, setQuery] = useState('');
  const [payer, setPayer] = useState('semua');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (payer !== 'semua' && p.payer !== payer) return false;
      return q === '' || p.name.toLowerCase().includes(q) || p.rm.toLowerCase().includes(q);
    });
  }, [query, payer]);

  return (
    <div className="grid content-start gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Heading as="h1" size="heading-md">
          Daftar pasien
        </Heading>
        <Button leadingIcon={<PlusIcon />} onClick={onNewVisit}>
          Kunjungan baru
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="grid gap-1.5">
          <Label htmlFor="cari">Cari nama atau nomor rekam medis</Label>
          <Input
            id="cari"
            type="search"
            value={query}
            placeholder="Siti, atau RM-0041…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="penjamin">Penjamin</Label>
          <Select value={payer} onValueChange={setPayer}>
            <SelectTrigger id="penjamin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent aria-label="Penjamin">
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="BPJS">BPJS</SelectItem>
              <SelectItem value="Umum">Umum</SelectItem>
              <SelectItem value="Asuransi">Asuransi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title={`Tidak ada pasien untuk “${query}”`}
          description="Coba nomor rekam medis, atau longgarkan penjamin."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setPayer('semua');
              }}
            >
              Hapus pencarian
            </Button>
          }
        />
      ) : (
        <Table>
          <TableCaption>
            {rows.length} pasien terdaftar. Pilih satu baris untuk membuka rekam medis.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No. RM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Usia</TableHead>
              <TableHead>JK</TableHead>
              <TableHead>Penjamin</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alergi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((patient) => (
              <TableRow key={patient.rm}>
                <TableCell className="tabular-nums">{patient.rm}</TableCell>
                <TableCell>
                  <Link
                    variant="block"
                    href={`#/pasien/${patient.rm}`}
                    onClick={() => onOpen(patient.rm)}
                    className="font-medium text-fg"
                  >
                    {patient.name}
                  </Link>
                </TableCell>
                <TableCell className="tabular-nums">{age(patient.born)}</TableCell>
                <TableCell>{patient.sex}</TableCell>
                <TableCell>
                  <Badge status={patient.payer === 'BPJS' ? 'info' : 'neutral'}>
                    {patient.payer}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">{patient.phone}</TableCell>
                <TableCell>
                  {patient.allergies.length === 0 ? (
                    <span className="text-fg-muted">—</span>
                  ) : (
                    <span className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} status="danger">
                          {allergy}
                        </Badge>
                      ))}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
