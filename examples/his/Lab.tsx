import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  ChevronDownIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  Inline,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  PageHeader,
  SearchIcon,
  Spinner,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@kobars/kirua';
import { flagLabel, flagTone, formatDateTime, labResults, patients } from './data';

/**
 * Laboratory orders, each under its accession number. Each order opens on its own — a
 * `Collapsible` and not an `Accordion`, because reading two panels side by side
 * is the normal thing to want here and an accordion would shut the first one.
 */
export function Lab() {
  const [query, setQuery] = useState('');

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return labResults.filter((order) => {
      const patient = patients.find((p) => p.mrn === order.mrn);
      return (
        q === '' ||
        order.panel.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.mrn.includes(q) ||
        (patient?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query]);

  return (
    <Stack gap={5}>
      <PageHeader
        title="Laboratory"
        description={`${orders.length} orders`}
        actions={
          <InputGroup width="md">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              aria-label="Search lab orders"
              placeholder="Search a test, patient, MRN or accession"
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="No order matches"
          description="Try a patient name, a test name, or an accession number."
          action={
            <Button variant="secondary" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <Stack as="ul" gap={3}>
          {orders.map((order) => {
            const patient = patients.find((p) => p.mrn === order.mrn);
            const abnormal = order.rows.filter((row) => row.flag !== 'normal').length;

            return (
              <li key={order.id}>
                <Card>
                  <Collapsible defaultOpen={abnormal > 0} gap={4}>
                    <Inline wrap justify="between" gap={3}>
                      <Stack gap={0.5}>
                        <Text size="sm" weight="medium" tone="primary">
                          {order.panel} — {patient?.name ?? order.mrn}
                        </Text>
                        <Text size="sm">
                          {order.id} · {formatDateTime(order.at)} · {order.orderedBy}
                        </Text>
                      </Stack>

                      <Inline gap={2}>
                        {order.status === 'pending' ? (
                          <Inline as="span" gap={2}>
                            <Spinner aria-hidden="true" size="sm" />
                            <Text inline size="sm">
                              In process
                            </Text>
                          </Inline>
                        ) : abnormal > 0 ? (
                          <Badge status="warning">{abnormal} abnormal</Badge>
                        ) : (
                          <Badge status="success">Within range</Badge>
                        )}

                        {order.status === 'resulted' && (
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              trailingIcon={<ChevronDownIcon />}
                            >
                              Results
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </Inline>
                    </Inline>

                    <CollapsibleContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Component</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Reference interval</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.rows.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell>
                                <Text size="inherit" tone="primary">
                                  {row.name}
                                </Text>
                                <Text size="caption" tone="muted" numeric>
                                  LOINC {row.loinc}
                                </Text>
                              </TableCell>
                              <TableCell>
                                <Inline as="span" gap={2}>
                                  <Text inline size="sm" tone="primary" numeric>
                                    {row.value} {row.unit}
                                  </Text>
                                  {row.flag !== 'normal' && (
                                    <Badge status={flagTone[row.flag]}>
                                      {flagLabel[row.flag]}
                                    </Badge>
                                  )}
                                </Inline>
                              </TableCell>
                              <TableCell tone="secondary" numeric>
                                {row.reference}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </li>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
