import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  CheckIcon,
  Container,
  Eyebrow,
  Field,
  Heading,
  Input,
  Label,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from 'kirua';
import { STUDIO, TOPICS } from './data';

/**
 * The one form on the site, and the only screen here that holds state.
 *
 * A marketing site is mostly read-only, which is exactly why it is worth having
 * one form: it puts the field family on a page that is not an application, and
 * a form that never validates is a form nothing tests.
 */
export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('plan');
  const [message, setMessage] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError =
    submitted && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      ? 'Enter an address we can reply to.'
      : undefined;
  const messageError =
    submitted && message.trim().length < 10 ? 'Tell us a little more than that.' : undefined;

  return (
    <Container pad="md">
      <Section>
        <Eyebrow>Contact</Eyebrow>
        <Heading as="h1" size="heading-lg">
          Tell us what you are trying to do
        </Heading>
        <Text size="lg">
          A person reads every message. If you are moving a studio across, say how many artists
          and we will answer with a plan rather than a price list.
        </Text>
      </Section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card padding="lg">
          <CardTitle as="h2" className="text-heading-md">
            Write to us
          </CardTitle>
          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
              if (validEmail && message.trim().length >= 10) setSent(true);
            }}
            noValidate
          >
            <Field controlId="contact-name" label="Your name" required>
              <Input
                value={name}
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
              />
            </Field>

            <Field controlId="contact-email" label="Email" required error={emailError}>
              <Input
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <div className="grid gap-1.5">
              <Label htmlFor="contact-topic">What is this about?</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger id="contact-topic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent aria-label="What is this about?">
                  {TOPICS.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Field
              controlId="contact-message"
              label="Message"
              description="Ten words is plenty to start."
              required
              error={messageError}
            >
              <Textarea
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>

            <div className="flex items-start gap-2">
              <Checkbox
                id="contact-subscribe"
                checked={subscribe}
                onCheckedChange={(next) => setSubscribe(next === true)}
              />
              <Label htmlFor="contact-subscribe" className="font-normal text-fg-secondary">
                Send me the monthly note about what changed. Roughly twelve emails a year.
              </Label>
            </div>

            <Button type="submit" variant="primary" size="md" className="justify-self-start">
              Send message
            </Button>
          </form>
        </Card>

        <Card padding="lg" className="gap-4">
          <CardTitle as="h2" className="text-heading-md">
            The studio
          </CardTitle>
          <CardBody>
            We are in one room in Yogyakarta, and the address is real. Post reaches us slower
            than email does.
          </CardBody>
          <dl className="grid gap-2 text-body-sm">
            {STUDIO.map((entry) => (
              <div key={entry.term} className="grid gap-0.5">
                <dt className="text-fg-muted">{entry.term}</dt>
                <dd className="text-fg">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <ToastViewport>
        {sent && (
          <Toast
            status="success"
            icon={<CheckIcon />}
            close={<ToastClose label="Dismiss" onClick={() => setSent(false)} />}
          >
            <ToastTitle>Message sent</ToastTitle>
            <ToastDescription>
              We will reply to {email} within one working day.
            </ToastDescription>
          </Toast>
        )}
      </ToastViewport>
    </Container>
  );
}
