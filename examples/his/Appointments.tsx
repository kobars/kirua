import { useState } from 'react';
import {
  Badge,
  Calendar,
  Card,
  Heading,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Separator,
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
  ToggleGroup,
  ToggleGroupItem,
} from 'kirua';
import {
  departments,
  encounters,
  formatDate,
  formatTime,
  patients,
  statusLabel,
  statusTone,
} from './data';

const PER_PAGE = 8;

/**
 * Which page numbers a pager shows: always the first and the last, always the
 * three around the current one, and an ellipsis wherever that leaves a gap.
 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const shown = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return shown.flatMap((n, index) =>
    index > 0 && n - shown[index - 1]! > 1 ? ['gap' as const, n] : [n],
  );
}

export function Appointments() {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 2, 12));
  const [department, setDepartment] = useState('all');
  const [page, setPage] = useState(1);

  // Appointments only: an emergency visit or an inpatient stay is not booked.
  const all = encounters.filter(
    (e) => e.type === 'Outpatient' && (department === 'all' || e.department === department),
  );
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <Stack gap={5}>
      <Heading as="h1" size="heading-md">
        Appointments
      </Heading>

      {/* The calendar cannot reflow: seven 40-pixel columns plus its own
          padding need 304 pixels, and a 320-wide phone leaves 288 after the
          page padding. A month grid has no narrower honest shape, so it scrolls
          inside its own card rather than making the document scroll. */}
      <Split layout="fit-start" from="lg" gap={5} align="start">
        <Card padding="sm">
          <Calendar
            locale="en-US"
            month={month}
            onMonthChange={setMonth}
            selected={day}
            onSelect={setDay}
            today={new Date(2026, 2, 12)}
            variant="plain"
          />
          <Separator />
          <Text size="sm">
            {day === undefined
              ? 'Choose a date.'
              : new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)}
          </Text>
        </Card>

        <Stack gap={4}>
          <Stack gap={2}>
            <Text inline id="department-filter" size="sm" weight="medium" tone="primary">
              Department
            </Text>
            <ToggleGroup
              type="single"
              value={department}
              onValueChange={(next) => {
                if (!next) return;
                setDepartment(next);
                setPage(1);
              }}
              aria-labelledby="department-filter"
              wrap
            >
              <ToggleGroupItem value="all" size="sm" variant="outline">
                All
              </ToggleGroupItem>
              {departments.map((name) => (
                <ToggleGroupItem key={name} value={name} size="sm" variant="outline">
                  {name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Stack>

          <Table>
            <TableCaption>
              {all.length} appointments{department === 'all' ? '' : ` in ${department}`} · page{' '}
              {current} of {pages}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Reason for visit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell numeric>{formatDate(appointment.at)}</TableCell>
                  <TableCell numeric>{formatTime(appointment.at)}</TableCell>
                  <TableCell>
                    {patients.find((p) => p.mrn === appointment.mrn)?.name ?? '—'}
                  </TableCell>
                  <TableCell numeric>{appointment.mrn}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Badge status={statusTone[appointment.status]}>
                      {statusLabel[appointment.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* A clinic day in one table is a list nobody reaches the end of. The
              pager shows the first page, the last, and the three around the
              current one — the ellipsis is what stands in for the rest. */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#/his/schedule"
                  label="Previous"
                  onClick={() => setPage(Math.max(1, current - 1))}
                />
              </PaginationItem>
              {pageWindow(current, pages).map((entry, index) =>
                entry === 'gap' ? (
                  <PaginationItem key={`gap-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={entry}>
                    <PaginationLink
                      href="#/his/schedule"
                      isCurrent={entry === current}
                      onClick={() => setPage(entry)}
                    >
                      {entry}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#/his/schedule"
                  label="Next"
                  onClick={() => setPage(Math.min(pages, current + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Stack>
      </Split>
    </Stack>
  );
}
