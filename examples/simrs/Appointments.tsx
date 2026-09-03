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
import { clinics, statusTone, visits } from './data';

const PER_PAGE = 8;

/**
 * Which page numbers a pager shows: always the first and the last, always the
 * three around the current one, and an ellipsis wherever that leaves a gap.
 * Forty-four visits over six pages is what makes the gap real.
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
  const [clinic, setClinic] = useState('all');
  const [page, setPage] = useState(1);

  const all = visits.filter((v) => clinic === 'all' || v.clinic === clinic);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div className="grid content-start gap-5">
      <Heading as="h1" size="heading-md">
        Visit schedule
      </Heading>

      {/* `minmax(0,1fr)` below `lg`, because a grid item keeps `min-width:
          auto` and the calendar below is `w-max` — without it the column takes
          the calendar's full width and drags the page sideways.

          The calendar itself cannot reflow: seven 40-pixel columns plus its own
          padding need 304 pixels, and a 320-wide phone leaves 288 after the
          page padding. A month grid has no narrower honest shape, so it scrolls
          inside its own card rather than making the document scroll. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[auto_1fr]">
        <Card className="h-max overflow-x-auto p-3">
          <Calendar
            locale="en-GB"
            month={month}
            onMonthChange={setMonth}
            selected={day}
            onSelect={setDay}
            today={new Date(2026, 2, 12)}
            className="bg-transparent p-0"
          />
          <Separator className="my-3" />
          <Text size="sm" className="px-1">
            {day === undefined
              ? 'Choose a date.'
              : new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(day)}
          </Text>
        </Card>

        <div className="grid content-start gap-4">
          <div className="grid gap-2">
            <span id="clinic-filter" className="text-body-sm font-medium text-fg">
              Clinic
            </span>
            <ToggleGroup
              type="single"
              value={clinic}
              onValueChange={(next) => {
                if (!next) return;
                setClinic(next);
                setPage(1);
              }}
              aria-labelledby="clinic-filter"
              className="flex-wrap"
            >
              <ToggleGroupItem value="all" size="sm" variant="outline">
                All
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
              {all.length} visits{clinic === 'all' ? '' : ` in ${clinic}`} · page {current} of{' '}
              {pages}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Reason</TableHead>
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

          {/* Forty-four rows in one table was a list nobody reaches the end of.
              The pager shows the first page, the last, and the three around the
              current one — the ellipsis is what stands in for the rest. */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#/schedule"
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
                      href="#/schedule"
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
                  href="#/schedule"
                  label="Next"
                  onClick={() => setPage(Math.min(pages, current + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
