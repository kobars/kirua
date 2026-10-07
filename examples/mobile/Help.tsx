import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardTitle,
  Field,
  Heading,
  NativeSelect,
  NativeSelectOption,
  Stack,
  Text,
  Textarea,
} from '@kobars/kirua';

const QUESTIONS = [
  {
    question: 'How long does a payment take?',
    answer:
      'A payment to another Pouch account arrives at once. A card payment shows as pending until the shop collects it, usually within two days.',
  },
  {
    question: 'Can I cancel a payment?',
    answer:
      'A scheduled payment can be cancelled until the day it sends. A payment that has already sent cannot be called back, so ask the receiver to send it back.',
  },
  {
    question: 'Why do I need to type a code?',
    answer:
      'From $500 up, Pouch asks for a code sent to your phone. It shows that the person sending is you, even if someone else has your phone unlocked.',
  },
  {
    question: 'What happens when I freeze a card?',
    answer:
      'Nothing can be paid with it until you unfreeze it. Payments that were already pending still go through.',
  },
  {
    question: 'Is my money safe in a savings goal?',
    answer:
      'A goal is part of your Pouch balance, put aside. You can move it back to your balance at any time.',
  },
];

export interface HelpProps {
  onNotice: (title: string, description: string) => void;
}

/** Answers first, and a message to a person for whatever they do not cover. */
export function Help({ onNotice }: HelpProps) {
  const [topic, setTopic] = useState('payment');
  const [message, setMessage] = useState('');

  return (
    <Stack gap={6}>
      <Heading as="h1" size="heading-lg">
        Help
      </Heading>

      <Stack gap={3}>
        <Heading as="h2" size="heading-sm">
          Common questions
        </Heading>
        <Card padding="sm">
          <Accordion type="single" collapsible>
            {QUESTIONS.map((entry) => (
              <AccordionItem key={entry.question} value={entry.question}>
                <AccordionTrigger>{entry.question}</AccordionTrigger>
                <AccordionContent>{entry.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </Stack>

      <Card padding="md" gap={4}>
        <Stack gap={1}>
          <CardTitle as="h2" size="heading-sm">
            Still stuck?
          </CardTitle>
          <Text size="sm">
            A person reads every message and replies in the app within a day.
          </Text>
        </Stack>
        <Field controlId="help-topic" label="What is it about?">
          <NativeSelect
            id="help-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          >
            <NativeSelectOption value="payment">A payment</NativeSelectOption>
            <NativeSelectOption value="card">A card</NativeSelectOption>
            <NativeSelectOption value="account">My account</NativeSelectOption>
            <NativeSelectOption value="other">Something else</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field
          controlId="help-message"
          label="What happened?"
          description="Leave out card numbers and codes. We never ask for them."
        >
          <Textarea
            id="help-message"
            value={message}
            rows={4}
            onChange={(event) => setMessage(event.target.value)}
          />
        </Field>
        <Button
          variant="primary"
          fullWidth
          disabled={message.trim() === ''}
          onClick={() => {
            setMessage('');
            onNotice('Message sent', 'Pouch support will reply in the app within a day.');
          }}
        >
          Send to support
        </Button>
      </Card>
    </Stack>
  );
}
