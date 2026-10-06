import {
  Badge,
  Card,
  CardIcon,
  CardTitle,
  Heading,
  Inline,
  Label,
  Meter,
  Separator,
  Slider,
  Stack,
  Switch,
  Text,
} from '@kobars/kirua';
import { formatMoney, type PaymentCard } from './data';

export interface CardSettings {
  frozen: boolean;
  limit: number;
}

export interface CardsProps {
  cards: PaymentCard[];
  settings: Record<string, CardSettings>;
  onChange: (id: string, next: CardSettings) => void;
}

const LIMIT_MAX = 3000;
const LIMIT_STEP = 50;

/**
 * The cards, each with the two controls people reach for in a hurry: freeze
 * it, and cap what it can spend. A frozen card stays on screen, marked, so it
 * can be thawed from the same place.
 */
export function Cards({ cards, settings, onChange }: CardsProps) {
  return (
    <Stack gap={6}>
      <Heading as="h1" size="heading-lg">
        Cards
      </Heading>

      {cards.map((card, index) => {
        const { frozen, limit } = settings[card.id] ?? { frozen: false, limit: card.limit };
        const switchId = `freeze-${card.id}`;
        return (
          <Stack as="section" key={card.id} gap={3} aria-labelledby={`card-${card.id}`}>
            <Card variant={index === 0 ? 'brand' : 'dark'} padding="md" gap={4}>
              <Inline justify="between" gap={3}>
                <CardTitle as="h2" size="heading-md" id={`card-${card.id}`}>
                  {card.name}
                </CardTitle>
                <CardIcon size="lg" aria-hidden="true" />
              </Inline>
              <Text size="lg" weight="semibold" numeric>
                •••• {card.last4}
              </Text>
              <Inline justify="between" gap={3}>
                <Text inline size="sm">
                  {card.kind} · expires {card.expires}
                </Text>
                {frozen && <Badge status="info">Frozen</Badge>}
              </Inline>
            </Card>

            <Card padding="md" gap={4}>
              <Inline justify="between" gap={4}>
                <Stack gap={0}>
                  <Label htmlFor={switchId}>Freeze card</Label>
                  <Text size="sm">
                    {frozen
                      ? 'Payments are refused until you thaw it.'
                      : 'Stops every payment at once.'}
                  </Text>
                </Stack>
                <Switch
                  id={switchId}
                  checked={frozen}
                  onCheckedChange={(checked) => onChange(card.id, { frozen: checked, limit })}
                />
              </Inline>
              <Separator />
              <Stack gap={2}>
                <Inline justify="between" gap={3}>
                  <Text inline size="sm" weight="medium" tone="primary">
                    Spent this month
                  </Text>
                  <Text inline size="sm" numeric>
                    {formatMoney(card.spent)} of {formatMoney(limit)}
                  </Text>
                </Inline>
                {/* Amber from 80% of the limit and red from 95%, so a card
                    about to be refused says so before it is. */}
                <Meter
                  label="Spent this month"
                  value={card.spent}
                  max={limit}
                  valueText={`${formatMoney(card.spent)} of ${formatMoney(limit)}`}
                  thresholds={{ warning: limit * 0.8, danger: limit * 0.95 }}
                />
              </Stack>
              <Stack gap={2}>
                <Inline justify="between" gap={3}>
                  <Text inline size="sm" weight="medium" tone="primary" id={`limit-${card.id}`}>
                    Monthly limit
                  </Text>
                  <Text inline size="sm" tone="primary" numeric>
                    {formatMoney(limit)}
                  </Text>
                </Inline>
                <Slider
                  value={[limit]}
                  min={LIMIT_STEP}
                  max={LIMIT_MAX}
                  step={LIMIT_STEP}
                  aria-labelledby={`limit-${card.id}`}
                  getValueText={formatMoney}
                  onValueChange={([next]) =>
                    onChange(card.id, { frozen, limit: next ?? limit })
                  }
                />
              </Stack>
            </Card>
          </Stack>
        );
      })}
    </Stack>
  );
}
