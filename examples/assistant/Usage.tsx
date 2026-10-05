import {
  BarChart,
  Card,
  CardContent,
  CardTitle,
  Chart,
  ChartCaption,
  ChartLegend,
  Container,
  Heading,
  LineChart,
  Pane,
  PaneBody,
  Sparkline,
  Stat,
  StatRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kobars/kirua';
import { allConversations, usageByMonth, usageByTopic } from './data';

/**
 * Charts drawn as plain SVG and CSS. No charting library enters the bundle,
 * which is what keeps this page the same weight as the transcript beside it.
 */
export function Usage() {
  const turns = allConversations.reduce((n, c) => n + c.turns.length, 0);

  return (
    <Pane height="screen">
      <PaneBody>
        <Container width="3xl" pad="md">
          <Heading as="h1" size="heading-lg">
            Usage
          </Heading>

          <StatRow variant="tile">
            <Stat
              variant="tile"
              value={String(allConversations.length)}
              label="Conversations"
            />
            <Stat variant="tile" value={String(turns)} label="Turns" />
            <Stat variant="tile" value="95" label="This month" />
          </StatRow>

          <Card gap={4}>
            <CardTitle as="h2">Conversations per month</CardTitle>
            <CardContent>
              <Chart label="Conversations started per month, October to March">
                <BarChart data={usageByMonth} showValues />
                <ChartCaption>March is the busiest month in the sample.</ChartCaption>
              </Chart>
            </CardContent>
          </Card>

          <Card gap={4}>
            <CardTitle as="h2">The same six months as a line</CardTitle>
            <CardContent>
              <Chart label="Conversations per month drawn as a line">
                <LineChart data={usageByMonth} filled series={2} />
                <ChartLegend items={[{ label: 'Conversations', series: 2 }]} />
              </Chart>
            </CardContent>
          </Card>

          <Card gap={4}>
            <CardTitle as="h2">What they were about</CardTitle>
            <CardContent>
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
                      <TableCell numeric>{row.value}</TableCell>
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
            </CardContent>
          </Card>
        </Container>
      </PaneBody>
    </Pane>
  );
}
