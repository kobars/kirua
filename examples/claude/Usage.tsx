import {
  BarChart,
  Card,
  CardBody,
  CardTitle,
  Chart,
  ChartCaption,
  ChartLegend,
  Heading,
  LineChart,
  ScrollArea,
  Sparkline,
  Stat,
  StatRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'kirua';
import { allConversations, usageByMonth, usageByTopic } from './data';

/**
 * Charts drawn as plain SVG and CSS. No charting library enters the bundle,
 * which is what keeps this page the same weight as the transcript beside it.
 */
export function Usage() {
  const turns = allConversations.reduce((n, c) => n + c.turns.length, 0);

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 md:px-8">
        <Heading as="h1" size="heading-lg">
          Usage
        </Heading>

        <StatRow>
          <Stat value={String(allConversations.length)} label="Conversations" />
          <Stat value={String(turns)} label="Turns" />
          <Stat value="95" label="This month" />
        </StatRow>

        <Card>
          <CardBody>
            <CardTitle as="h2">Conversations per month</CardTitle>
            <div className="mt-4">
              <Chart label="Conversations started per month, October to March">
                <BarChart data={usageByMonth} showValues />
                <ChartCaption>March is the busiest month in the sample.</ChartCaption>
              </Chart>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">The same six months as a line</CardTitle>
            <div className="mt-4">
              <Chart label="Conversations per month drawn as a line">
                <LineChart data={usageByMonth} filled series={2} />
                <ChartLegend items={[{ label: 'Conversations', series: 2 }]} />
              </Chart>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle as="h2">What they were about</CardTitle>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Conversations</TableHead>
                    <TableHead>Six months</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageByTopic.map((row, index) => (
                    <TableRow key={row.label}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell className="tabular-nums">{row.value}</TableCell>
                      <TableCell>
                        <Sparkline
                          data={usageByMonth}
                          series={((index % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                          aria-hidden="true"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </ScrollArea>
  );
}
