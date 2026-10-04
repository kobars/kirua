import { Fragment, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  CheckIcon,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Eyebrow,
  Field,
  Heading,
  Inline,
  Input,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Split,
  Stack,
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

  const nameError = submitted && name.trim() === '' ? 'Enter your name.' : undefined;
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

      <Split layout="wide-narrow" from="md" gap={4}>
        <Card padding="lg" gap={4}>
          <CardTitle as="h2" size="heading-md">
            Write to us
          </CardTitle>
          <Stack
            as="form"
            gap={4}
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
              // Focus goes to the first field to fix, which also reads out its
              // message, rather than staying on the button.
              const firstInvalid = [
                name.trim() === '' && 'contact-name',
                !validEmail && 'contact-email',
                message.trim().length < 10 && 'contact-message',
              ].find(Boolean);
              if (firstInvalid) document.getElementById(firstInvalid)?.focus();
              else setSent(true);
            }}
            noValidate
          >
            <Field controlId="contact-name" label="Your name" required error={nameError}>
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

            <Select value={topic} onValueChange={setTopic}>
              <Field controlId="contact-topic" label="What is this about?">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </Field>
              <SelectContent aria-label="What is this about?">
                {TOPICS.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            <Field
              orientation="horizontal"
              controlId="contact-subscribe"
              label={
                <Text inline size="sm" weight="normal">
                  Send me the monthly note about what changed. Roughly twelve emails a year.
                </Text>
              }
            >
              <Checkbox
                checked={subscribe}
                onCheckedChange={(next) => setSubscribe(next === true)}
              />
            </Field>

            {/* A row, so the button keeps its own width while the fields above
                take the column's. */}
            <Inline>
              <Button type="submit" variant="primary" size="md">
                Send message
              </Button>
            </Inline>
          </Stack>
        </Card>

        <Card padding="lg" gap={4}>
          <CardTitle as="h2" size="heading-md">
            The studio
          </CardTitle>
          <CardBody>
            We are in one room in Yogyakarta, and the address is real. Post reaches us slower
            than email does.
          </CardBody>
          <DescriptionList layout="stacked" gap="lg">
            {STUDIO.map((entry) => (
              <Fragment key={entry.term}>
                <DescriptionTerm>{entry.term}</DescriptionTerm>
                <DescriptionDetails>{entry.value}</DescriptionDetails>
              </Fragment>
            ))}
          </DescriptionList>
        </Card>
      </Split>

      <ToastViewport>
        {sent && (
          <Toast
            status="success"
            icon={<CheckIcon />}
            close={<ToastClose label="Dismiss" onClick={() => setSent(false)} />}
          >
            <ToastTitle>Demo message received</ToastTitle>
            <ToastDescription>
              Nothing was sent. In a connected application, replies would go to {email}.
            </ToastDescription>
          </Toast>
        )}
      </ToastViewport>
    </Container>
  );
}
