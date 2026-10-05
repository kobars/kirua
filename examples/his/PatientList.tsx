import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  IconButton,
  Inline,
  Input,
  Link,
  MoreIcon,
  PageHeader,
  PlusIcon,
  SearchIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Split,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  VisuallyHidden,
} from '@kobars/kirua';
import { age, formatDob, patients, payerTone } from './data';

export interface PatientListProps {
  onOpen: (mrn: string) => void;
  onNewVisit: () => void;
}

export function PatientList({ onOpen, onNewVisit }: PatientListProps) {
  const [query, setQuery] = useState('');
  const [payer, setPayer] = useState('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (payer !== 'all' && p.payer !== payer) return false;
      return q === '' || p.name.toLowerCase().includes(q) || p.mrn.includes(q);
    });
  }, [query, payer]);

  return (
    <Stack gap={5}>
      <PageHeader
        title="Patient list"
        actions={
          <Button leadingIcon={<PlusIcon />} onClick={onNewVisit}>
            New visit
          </Button>
        }
      />

      <Split layout="aside-end" asideWidth="sm" from="sm" gap={3}>
        <Field controlId="search" label="Search by name or MRN">
          <Input
            type="search"
            value={query}
            placeholder="Gonzalez, or 204188…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>
        <Select value={payer} onValueChange={setPayer}>
          <Field controlId="payer" label="Payer">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </Field>
          <SelectContent aria-label="Payer">
            <SelectItem value="all">All payers</SelectItem>
            <SelectItem value="Medicare">Medicare</SelectItem>
            <SelectItem value="Medicaid">Medicaid</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Self-pay">Self-pay</SelectItem>
          </SelectContent>
        </Select>
      </Split>

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title={`No patient matches “${query}”`}
          description="Try an MRN, or widen the payer filter."
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
            {rows.length} patients on file. Choose a name to open the chart.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead sticky="start">Name</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>DOB (age)</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Allergies</TableHead>
              <TableHead sticky="end">
                <VisuallyHidden>Actions</VisuallyHidden>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((patient) => (
              <TableRow key={patient.mrn}>
                <TableCell sticky="start">
                  <Link
                    variant="block"
                    href={`#/his/patients/${patient.mrn}`}
                    onClick={() => onOpen(patient.mrn)}
                  >
                    <Text inline size="sm" weight="medium" tone="primary">
                      {patient.name}
                    </Text>
                  </Link>
                </TableCell>
                <TableCell numeric>{patient.mrn}</TableCell>
                <TableCell numeric>
                  {formatDob(patient.born)} ({age(patient.born)})
                </TableCell>
                <TableCell>{patient.sex}</TableCell>
                <TableCell>
                  <Badge status={payerTone[patient.payer]}>{patient.payer}</Badge>
                </TableCell>
                <TableCell numeric>{patient.phone}</TableCell>
                <TableCell>
                  {patient.allergies.length === 0 ? (
                    <Text inline size="sm" tone="muted">
                      None known
                    </Text>
                  ) : (
                    <Inline as="span" wrap gap={1}>
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} status="danger">
                          {allergy}
                        </Badge>
                      ))}
                    </Inline>
                  )}
                </TableCell>
                <TableCell sticky="end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton
                        aria-label={`Actions for ${patient.name}`}
                        size="sm"
                        variant="ghost"
                      >
                        <MoreIcon />
                      </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>MRN {patient.mrn}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => onOpen(patient.mrn)}>
                        Open the chart
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={onNewVisit}>
                        Schedule a visit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}
