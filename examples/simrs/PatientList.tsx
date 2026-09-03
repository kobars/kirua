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
  const [payer, setPayer] = useState('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (payer !== 'all' && p.payer !== payer) return false;
      return q === '' || p.name.toLowerCase().includes(q) || p.rm.toLowerCase().includes(q);
    });
  }, [query, payer]);

  return (
    <div className="grid content-start gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Heading as="h1" size="heading-md">
          Patient list
        </Heading>
        <Button leadingIcon={<PlusIcon />} onClick={onNewVisit}>
          New visit
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="grid gap-1.5">
          <Label htmlFor="search">Search by name or record number</Label>
          <Input
            id="search"
            type="search"
            value={query}
            placeholder="Siti, or RM-0041…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="payer">Payer</Label>
          <Select value={payer} onValueChange={setPayer}>
            <SelectTrigger id="payer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent aria-label="Payer">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="BPJS">BPJS</SelectItem>
              <SelectItem value="Self-pay">Self-pay</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title={`No patient matches “${query}”`}
          description="Try a record number, or widen the payer filter."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setPayer('all');
              }}
            >
              Clear search
            </Button>
          }
        />
      ) : (
        <Table>
          <TableCaption>
            {rows.length} patients on file. Choose a row to open the record.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Record no.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Allergies</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((patient) => (
              <TableRow key={patient.rm}>
                <TableCell className="tabular-nums">{patient.rm}</TableCell>
                <TableCell>
                  <Link
                    variant="block"
                    href={`#/patients/${patient.rm}`}
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
