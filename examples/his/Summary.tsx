import { Fragment } from 'react';
import {
  Badge,
  BarChart,
  CalendarIcon,
  Card,
  CardTitle,
  Chart,
  ChartCaption,
  ChartLegend,
  Grid,
  Inline,
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
  PageHeader,
  Sparkline,
  Stack,
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
import {
  TODAY,
  departmentLoad,
  encounters,
  formatTime,
  monthlyEncounters,
  patients,
  statusLabel,
  statusTone,
  units,
} from './data';

/**
 * The screen a house supervisor opens first: how much work arrived, where it
 * is, and whether there is a bed for it.
 */
export function Summary() {
  const today = encounters.filter((e) => e.type === 'Outpatient' && e.at.startsWith(TODAY));
  const waiting = today.filter((e) => e.status === 'scheduled');
  const inRoom = today.filter((e) => e.status === 'in-progress');
  const beds = units.reduce((n, u) => n + u.beds, 0);
  const used = units.reduce((n, u) => n + u.used, 0);

  return (
    <Stack gap={6}>
      <PageHeader title="Today's summary" description="Thursday, March 12, 2026" />

      <StatRow variant="tile">
        <Stat
          variant="tile"
          icon={<CalendarIcon />}
          value={String(today.length)}
          label="Appointments today"
        />
        <Stat
          variant="tile"
          icon={<StethoscopeIcon />}
          value={String(inRoom.length)}
          label="With a provider"
        />
        <Stat variant="tile" value={String(waiting.length)} label="Yet to arrive" />
        <Stat variant="tile" value={`${used}/${beds}`} label="Inpatient census" />
      </StatRow>

      <Grid lg={2} gap={6}>
        <Card gap={4}>
          <CardTitle as="h2">Encounters per month</CardTitle>
          <Chart label="Completed encounters per month, April 2025 to March 2026">
            <BarChart data={monthlyEncounters} showValues={false} />
            <ChartCaption>March was the busiest month of the last twelve.</ChartCaption>
          </Chart>
        </Card>

        <Card gap={4}>
          <CardTitle as="h2">Twelve-month trend</CardTitle>
          <Chart label="The monthly encounter trend, drawn as a line">
            <LineChart data={monthlyEncounters} filled series={2} />
            <ChartLegend items={[{ label: 'Completed encounters', series: 2 }]} />
          </Chart>
        </Card>
      </Grid>

      <Card gap={4}>
        <CardTitle as="h2">Department volume</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Today</TableHead>
              <TableHead>Twelve months</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departmentLoad.map((row) => (
              <TableRow key={row.department}>
                <TableCell>{row.department}</TableCell>
                <TableCell numeric>{row.today}</TableCell>
                <TableCell>
                  <Sparkline data={monthlyEncounters} series={row.series} aria-hidden="true" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Grid lg={2} gap={6}>
        <Card gap={4}>
          <CardTitle as="h2">Unit census</CardTitle>
          <Stack as="ul" gap={4}>
            {units.map((unit) => (
              <Stack as="li" key={unit.name} gap={1.5}>
                <Inline align="baseline" justify="between">
                  <Text inline size="sm" weight="medium" tone="primary">
                    {unit.name}
                  </Text>
                  <Text inline size="sm" numeric>
                    {unit.used} / {unit.beds}
                  </Text>
                </Inline>
                {/* A measurement, not a task, and the one screen that
                      wanted thresholds: amber past 85% of the unit, red past
                      95%. Written in beds rather than percent, because a
                      threshold as a percentage means something different the
                      moment `min` stops being zero. */}
                <Meter
                  value={unit.used}
                  max={unit.beds}
                  label={`Census of ${unit.name}`}
                  valueText={`${unit.used} of ${unit.beds} beds`}
                  thresholds={{
                    warning: Math.round(unit.beds * 0.85),
                    danger: Math.round(unit.beds * 0.95),
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Card>

        <Card gap={3}>
          <CardTitle as="h2">Arriving next</CardTitle>
          <ItemGroup>
            {waiting.slice(0, 5).map((appointment, index) => {
              const patient = patients.find((p) => p.mrn === appointment.mrn);
              return (
                <Fragment key={appointment.id}>
                  {index > 0 && <ItemSeparator />}
                  <Item asChild interactive size="sm">
                    <a href={`#/his/patients/${appointment.mrn}`}>
                      <ItemMedia variant="figure">{formatTime(appointment.at)}</ItemMedia>
                      <ItemContent>
                        <ItemTitle>{patient?.name ?? appointment.mrn}</ItemTitle>
                        <ItemDescription>
                          {appointment.department} — {appointment.reason}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge status={statusTone[appointment.status]}>
                          {statusLabel[appointment.status]}
                        </Badge>
                      </ItemActions>
                    </a>
                  </Item>
                </Fragment>
              );
            })}
          </ItemGroup>
        </Card>
      </Grid>
    </Stack>
  );
}
