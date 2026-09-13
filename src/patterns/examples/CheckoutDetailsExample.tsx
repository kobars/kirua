'use client';

import { useId, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Field,
  Input,
} from '@/components';

export function CheckoutDetailsExample() {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Card padding="md" className="max-w-lg">
      <Badge status="neutral">Checkout · contact details</Badge>
      <CardTitle as="h2">Where should we send your receipt?</CardTitle>
      <CardBody>Art print bundle · $24.00. This demo does not place an order.</CardBody>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (name.trim() && validEmail) setConfirmed(true);
          else
            event.currentTarget
              .querySelector<HTMLInputElement>(
                !name.trim() ? '[name="name"]' : '[name="email"]',
              )
              ?.focus();
        }}
      >
        <Field
          controlId={`${id}-name`}
          label="Full name"
          required
          error={submitted && !name.trim() ? 'Enter your name.' : undefined}
        >
          <Input
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setConfirmed(false);
            }}
          />
        </Field>
        <Field
          controlId={`${id}-email`}
          label="Email address"
          required
          description="Your receipt goes here."
          error={submitted && !validEmail ? 'Enter a valid email address.' : undefined}
        >
          <Input
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setConfirmed(false);
            }}
          />
        </Field>
        <Button type="submit">Save contact details</Button>
        <output className="block">
          {confirmed && (
            <Alert status="success">
              <AlertTitle>Contact details saved</AlertTitle>
              <AlertDescription>
                You can continue to delivery. No order has been placed.
              </AlertDescription>
            </Alert>
          )}
        </output>
      </form>
    </Card>
  );
}
