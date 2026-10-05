import { useState } from 'react';
import {
  Badge,
  Calendar,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  IconButton,
  MoreIcon,
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
  VisuallyHidden,
} from '@kobars/kirua';
import {
  departments,
  encounters,
  formatDate,
  formatTime,
  patients,
  statusLabel,
  statusTone,
  type Encounter,
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

export interface AppointmentsProps {
  onOpen: (mrn: string) => void;
}

export function Appointments({ onOpen }: AppointmentsProps) {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 2, 12));
  const [department, setDepartment] = useState('all');
  const [page, setPage] = useState(1);
  // Check-ins and cancellations made on this screen, by encounter id.
  const [changed, setChanged] = useState<Record<string, Encounter['status']>>({});
  const statusOf = (e: Encounter) => changed[e.id] ?? e.status;
  const setStatus = (id: string, status: Encounter['status']) =>
    setChanged((all) => ({ ...all, [id]: status }));

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
                <TableHead sticky="start">Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Reason for visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead sticky="end">
                  <VisuallyHidden>Actions</VisuallyHidden>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((appointment) => {
                const name = patients.find((p) => p.mrn === appointment.mrn)?.name ?? '—';
                const status = statusOf(appointment);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell sticky="start" nowrap>
                      {name}
                    </TableCell>
                    <TableCell numeric nowrap>
                      {formatDate(appointment.at)}
                    </TableCell>
                    <TableCell numeric nowrap>
                      {formatTime(appointment.at)}
                    </TableCell>
                    <TableCell numeric>{appointment.mrn}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>{appointment.provider}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Badge status={statusTone[status]}>{statusLabel[status]}</Badge>
                    </TableCell>
                    <TableCell sticky="end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            aria-label={`Actions for ${name}, ${formatTime(appointment.at)}`}
                            size="sm"
                            variant="ghost"
                          >
                            <MoreIcon />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{name}</DropdownMenuLabel>
                          <DropdownMenuItem
                            disabled={status !== 'scheduled'}
                            onSelect={() => setStatus(appointment.id, 'in-progress')}
                          >
                            Check in
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onOpen(appointment.mrn)}>
                            Open the chart
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="danger"
                            disabled={status !== 'scheduled'}
                            onSelect={() => setStatus(appointment.id, 'canceled')}
                          >
                            Cancel the appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
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
