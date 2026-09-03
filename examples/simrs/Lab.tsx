import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  ChevronDownIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  Heading,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  SearchIcon,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'kirua';
import { flagTone, labResults, patients } from './data';

/**
 * Laboratory orders, newest first. Each order opens on its own — a
 * `Collapsible` and not an `Accordion`, because reading two panels side by side
 * is the normal thing to want here and an accordion would shut the first one.
 */
export function Lab() {
  const [query, setQuery] = useState('');

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return labResults.filter((order) => {
      const patient = patients.find((p) => p.rm === order.rm);
      return (
        q === '' ||
        order.panel.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        (patient?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading as="h1" size="heading-md">
            Laboratory
          </Heading>
          <Text size="sm" className="mt-1">
            {orders.length} test orders
          </Text>
        </div>
        <div className="w-full sm:w-72">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              aria-label="Search tests"
              placeholder="Search a panel, patient or number"
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="No test matches"
          description="Try a patient name, a panel name, or a LAB number."
          action={
            <Button variant="secondary" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3">
          {orders.map((order) => {
            const patient = patients.find((p) => p.rm === order.rm);
            const abnormal = order.rows.filter((row) => row.flag !== 'normal').length;

            return (
              <li key={order.id}>
                <Card>
                  <CardBody>
                    <Collapsible defaultOpen={abnormal > 0}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Item size="sm" className="w-auto flex-1 px-0">
                          <ItemContent>
                            <ItemTitle>
                              {order.panel} — {patient?.name ?? order.rm}
                            </ItemTitle>
                            <ItemDescription>
                              {order.id} · {order.at}
                            </ItemDescription>
                          </ItemContent>
                        </Item>

                        <div className="flex items-center gap-2">
                          {order.status === 'pending' ? (
                            <span className="flex items-center gap-2 text-body-sm text-fg-secondary">
                              <Spinner
                                aria-hidden="true"
                                className="[--icon-size:var(--icon-sm)]"
                              />
                              Awaiting results
                            </span>
                          ) : abnormal > 0 ? (
                            <Badge status="warning">{abnormal} di luar rentang</Badge>
                          ) : (
                            <Badge status="success">All normal</Badge>
                          )}

                          {order.status === 'done' && (
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
                        </div>
                      </div>

                      <CollapsibleContent className="pt-4">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Test</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead>Reference range</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.rows.map((row) => (
                                <TableRow key={row.name}>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>
                                    <span className="flex items-center gap-2">
                                      <span className="tabular-nums">
                                        {row.value} {row.unit}
                                      </span>
                                      {row.flag !== 'normal' && (
                                        <Badge status={flagTone[row.flag]}>{row.flag}</Badge>
                                      )}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-fg-secondary tabular-nums">
                                    {row.reference}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
