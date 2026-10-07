import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  CheckIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Field,
  FieldLegend,
  FieldSet,
  Heading,
  ImageIcon,
  Input,
  NativeSelect,
  NativeSelectOption,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Stepper,
  StepperItem,
  Text,
} from '@kobars/kirua';

const STEPS = ['Your details', 'Document', 'Check and send'] as const;

const DOCUMENTS = [
  ['passport', 'Passport'],
  ['licence', 'Driving licence'],
  ['id-card', 'National identity card'],
] as const;

type Document = (typeof DOCUMENTS)[number][0];

export interface VerifyProps {
  onDone: () => void;
}

/**
 * Verifying identity in three steps, one screen each, with the stepper on top
 * saying where the user is. A phone has room for one question at a time, so
 * each step asks one thing and the last one shows everything back.
 */
export function Verify({ onDone }: VerifyProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Rin Aoki');
  const [born, setBorn] = useState('');
  const [country, setCountry] = useState('Japan');
  const [document, setDocument] = useState<Document>('passport');
  const [photo, setPhoto] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const documentName = DOCUMENTS.find(([value]) => value === document)?.[1] ?? '';
  const detailsDone = name.trim() !== '' && born !== '';

  return (
    <Stack gap={6}>
      <Stack gap={4}>
        <Heading as="h1" size="heading-md">
          Verify your identity
        </Heading>
        <Stepper aria-label="Verify your identity">
          {STEPS.map((label, index) => (
            <StepperItem
              key={label}
              index={index + 1}
              status={index < step ? 'done' : index === step ? 'current' : 'upcoming'}
            >
              {label}
            </StepperItem>
          ))}
        </Stepper>
      </Stack>

      {step === 0 && (
        <Card padding="md" gap={4}>
          <Heading as="h2" size="heading-sm">
            Your details
          </Heading>
          <Field controlId="verify-name" label="Full legal name">
            <Input
              id="verify-name"
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field
            controlId="verify-born"
            label="Date of birth"
            description="As it is written on your document."
          >
            <Input
              id="verify-born"
              type="date"
              value={born}
              max="2008-10-07"
              autoComplete="bday"
              onChange={(event) => setBorn(event.target.value)}
            />
          </Field>
          <Field controlId="verify-country" label="Country you live in">
            <NativeSelect
              id="verify-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            >
              <NativeSelectOption value="Japan">Japan</NativeSelectOption>
              <NativeSelectOption value="Indonesia">Indonesia</NativeSelectOption>
              <NativeSelectOption value="Portugal">Portugal</NativeSelectOption>
              <NativeSelectOption value="United States">United States</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Button
            variant="primary"
            fullWidth
            disabled={!detailsDone}
            onClick={() => setStep(1)}
          >
            Continue
          </Button>
        </Card>
      )}

      {step === 1 && (
        <Card padding="md" gap={4}>
          <FieldSet>
            <FieldLegend>Which document do you have?</FieldLegend>
            <RadioGroup
              value={document}
              onValueChange={(value) => {
                setDocument(value as Document);
                setPhoto(false);
              }}
            >
              {DOCUMENTS.map(([value, label]) => (
                <Field
                  key={value}
                  orientation="horizontal"
                  controlId={`verify-document-${value}`}
                  label={label}
                >
                  <RadioGroupItem value={value} />
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
          {/* The button stays where it is, so focus is not lost when the
              photo arrives; the result is announced from the region above it. */}
          <Stack as="output">
            {photo && (
              <Alert status="success" icon={<CheckIcon />}>
                <AlertTitle>Photo received</AlertTitle>
                <AlertDescription>
                  Your {documentName.toLowerCase()} is clear enough to read.
                </AlertDescription>
              </Alert>
            )}
          </Stack>
          <Button
            variant="secondary"
            fullWidth
            leadingIcon={<ImageIcon />}
            onClick={() => setPhoto(true)}
          >
            {photo ? 'Take it again' : 'Take a photo of it'}
          </Button>
          <Text size="sm">This is a demo: no camera opens and no photo is kept.</Text>
          <Stack gap={2}>
            <Button variant="primary" fullWidth disabled={!photo} onClick={() => setStep(2)}>
              Continue
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setStep(0)}>
              Back
            </Button>
          </Stack>
        </Card>
      )}

      {step === 2 && (
        <Card padding="md" gap={4}>
          <Heading as="h2" size="heading-sm">
            Check and send
          </Heading>
          <DescriptionList layout="split">
            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>{name.trim()}</DescriptionDetails>
            <DescriptionTerm>Born</DescriptionTerm>
            <DescriptionDetails>
              {new Date(`${born}T12:00`).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </DescriptionDetails>
            <DescriptionTerm>Lives in</DescriptionTerm>
            <DescriptionDetails>{country}</DescriptionDetails>
            <DescriptionTerm>Document</DescriptionTerm>
            <DescriptionDetails>{documentName}</DescriptionDetails>
          </DescriptionList>
          <Field
            orientation="horizontal"
            controlId="verify-confirm"
            label="These details are mine and correct"
          >
            <Checkbox
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
          </Field>
          <Stack gap={2}>
            <Button variant="primary" fullWidth disabled={!confirmed} onClick={onDone}>
              Send for checking
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setStep(1)}>
              Back
            </Button>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
