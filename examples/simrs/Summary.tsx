import {
  Badge,
  BarChart,
  CalendarIcon,
  Card,
  CardBody,
  CardTitle,
  Chart,
  ChartCaption,
  ChartLegend,
  Heading,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  LineChart,
  Meter,
  Sparkline,
  Stat,
  StatRow,
  StethoscopeIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'kirua';
import { clinicLoad, monthlyVisits, statusTone, visits, wards, patients } from './data';

const TODAY = '2026-03-12';

/**
 * The screen a duty manager opens first: how much work arrived, where it is,
 * and whether there is a bed for it.
 */
export function Summary() {
  const today = visits.filter((v) => v.at.startsWith(TODAY));
  const waiting = today.filter((v) => v.status === 'scheduled');
  const inRoom = today.filter((v) => v.status === 'in-progress');
  const beds = wards.reduce((n, w) => n + w.beds, 0);
  const used = wards.reduce((n, w) => n + w.used, 0);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6">
      <div>
        <Heading as="h1" size="heading-md">
          Today's summary
        </Heading>
        <Text size="sm" className="mt-1">
          Thursday, 12 March 2026
        </Text>
      </div>

      <StatRow variant="tile">
        <Stat
          variant="tile"
          icon={<CalendarIcon />}
          value={String(today.length)}
          label="Visits today"
        />
        <Stat
          variant="tile"
          icon={<StethoscopeIcon />}
          value={String(inRoom.length)}
          label="In consultation"
        />
        <Stat variant="tile" value={String(waiting.length)} label="Waiting" />
        <Stat variant="tile" value={`${used}/${beds}`} label="Beds in use" />
      </StatRow>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardBody>
            <CardTitle as="h2">Visits per month</CardTitle>
            <div className="mt-4">
              <Chart label="Completed visits per month, April 2025 to March 2026">
                <BarChart data={monthlyVisits} showValues={false} />
                <ChartCaption>March was the busiest month of the last twelve.</ChartCaption>
              </Chart>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">Twelve-month trend</CardTitle>
            <div className="mt-4">
              <Chart label="The monthly visit trend, drawn as a line">
                <LineChart data={monthlyVisits} filled series={2} />
                <ChartLegend items={[{ label: 'Completed visits', series: 2 }]} />
              </Chart>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <CardTitle as="h2">Clinic load</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead>Twelve months</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinicLoad.map((row) => (
                  <TableRow key={row.clinic}>
                    <TableCell>{row.clinic}</TableCell>
                    <TableCell className="tabular-nums">{row.today}</TableCell>
                    <TableCell>
                      <Sparkline data={monthlyVisits} series={row.series} aria-hidden="true" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardBody>
            <CardTitle as="h2">Ward occupancy</CardTitle>
            <ul className="mt-4 grid gap-4">
              {wards.map((ward) => (
                <li key={ward.name} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between text-body-sm">
                    <span className="font-medium text-fg">{ward.name}</span>
                    <span className="text-fg-secondary tabular-nums">
                      {ward.used} / {ward.beds}
                    </span>
                  </div>
                  {/* A measurement, not a task, and the one screen that
                      wanted thresholds: amber past 85% of the ward, red past
                      95%. Written in beds rather than percent, because a
                      threshold as a percentage means something different the
                      moment `min` stops being zero. */}
                  <Meter
                    value={ward.used}
                    max={ward.beds}
                    label={`Occupancy of ${ward.name} ward`}
                    valueText={`${ward.used} of ${ward.beds} beds`}
                    thresholds={{
                      warning: Math.round(ward.beds * 0.85),
                      danger: Math.round(ward.beds * 0.95),
                    }}
                  />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">Next in the queue</CardTitle>
            <ItemGroup className="mt-3">
              {waiting.slice(0, 5).map((visit, index) => {
                const patient = patients.find((p) => p.rm === visit.rm);
                return (
                  <div key={visit.id}>
                    {index > 0 && <ItemSeparator />}
                    <Item asChild interactive size="sm">
                      <a href={`#/patients/${visit.rm}`}>
                        <ItemMedia className="text-caption tabular-nums">
                          {visit.at.slice(11)}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{patient?.name ?? visit.rm}</ItemTitle>
                          <ItemDescription>
                            {visit.clinic} — {visit.reason}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Badge status={statusTone[visit.status]}>{visit.status}</Badge>
                        </ItemActions>
                      </a>
                    </Item>
                  </div>
                );
              })}
            </ItemGroup>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
