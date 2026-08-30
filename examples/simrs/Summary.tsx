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
  Progress,
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
  const waiting = today.filter((v) => v.status === 'terjadwal');
  const inRoom = today.filter((v) => v.status === 'diperiksa');
  const beds = wards.reduce((n, w) => n + w.beds, 0);
  const used = wards.reduce((n, w) => n + w.used, 0);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6">
      <div>
        <Heading as="h1" size="heading-md">
          Ringkasan hari ini
        </Heading>
        <Text size="sm" className="mt-1">
          Kamis, 12 Maret 2026
        </Text>
      </div>

      <StatRow variant="tile">
        <Stat
          variant="tile"
          icon={<CalendarIcon />}
          value={String(today.length)}
          label="Kunjungan hari ini"
        />
        <Stat
          variant="tile"
          icon={<StethoscopeIcon />}
          value={String(inRoom.length)}
          label="Sedang diperiksa"
        />
        <Stat variant="tile" value={String(waiting.length)} label="Menunggu" />
        <Stat variant="tile" value={`${used}/${beds}`} label="Tempat tidur terpakai" />
      </StatRow>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardBody>
            <CardTitle as="h2">Kunjungan per bulan</CardTitle>
            <div className="mt-4">
              <Chart label="Kunjungan selesai per bulan, April 2025 sampai Maret 2026">
                <BarChart data={monthlyVisits} showValues={false} />
                <ChartCaption>
                  Maret adalah bulan tersibuk dalam dua belas bulan terakhir.
                </ChartCaption>
              </Chart>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">Tren dua belas bulan</CardTitle>
            <div className="mt-4">
              <Chart label="Tren kunjungan bulanan sebagai garis">
                <LineChart data={monthlyVisits} filled series={2} />
                <ChartLegend items={[{ label: 'Kunjungan selesai', series: 2 }]} />
              </Chart>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <CardTitle as="h2">Beban poliklinik</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poliklinik</TableHead>
                  <TableHead>Hari ini</TableHead>
                  <TableHead>Dua belas bulan</TableHead>
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
            <CardTitle as="h2">Hunian ruang rawat</CardTitle>
            <ul className="mt-4 grid gap-4">
              {wards.map((ward) => (
                <li key={ward.name} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between text-body-sm">
                    <span className="font-medium text-fg">{ward.name}</span>
                    <span className="text-fg-secondary tabular-nums">
                      {ward.used} / {ward.beds}
                    </span>
                  </div>
                  <Progress
                    value={Math.round((ward.used / ward.beds) * 100)}
                    aria-label={`Hunian ruang ${ward.name}`}
                  />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">Antrean berikutnya</CardTitle>
            <ItemGroup className="mt-3">
              {waiting.slice(0, 5).map((visit, index) => {
                const patient = patients.find((p) => p.rm === visit.rm);
                return (
                  <div key={visit.id}>
                    {index > 0 && <ItemSeparator />}
                    <Item asChild interactive size="sm">
                      <a href={`#/pasien/${visit.rm}`}>
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
