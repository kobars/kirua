import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  CheckIcon,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  DatePicker,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Stack,
  Text,
  Textarea,
} from '@kobars/kirua';
import { ErrorLinks } from '../shared/ErrorLinks';
import { useActiveDescendant } from '../shared/useActiveDescendant';
import {
  departmentGroups,
  diagnoses,
  formatDate,
  languageGroups,
  patients,
  providers,
} from './data';

/**
 * Registers a visit, with real validation, a `Select`, a `DatePicker` and an
 * error summary. Nothing is submitted anywhere.
 */
export function NewVisit() {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [department, setDepartment] = useState('');
  const [patient, setPatient] = useState('');
  const [provider, setProvider] = useState('');
  const [reason, setReason] = useState('');
  const [consent, setConsent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  // Validated on submit, then live: once the form has been sent back, each
  // message clears the moment its field is valid and the count follows.
  const validate = () => {
    const found: Record<string, string> = {};
    if (patient === '') found['patient'] = 'A patient is required.';
    if (department === '') found['department'] = 'A department is required.';
    if (date === undefined) found['date'] = 'A visit date is required.';
    if (reason.trim().length < 5)
      found['reason'] = 'Describe the reason for the visit in at least five characters.';
    if (!consent) found['consent'] = 'Confirm that the consent to treat is signed.';
    return found;
  };
  const errors = attempts > 0 ? validate() : {};
  // Registration reads the payer back once a patient is chosen, so a lapsed
  // plan is noticed before the visit rather than at billing.
  const coverage = patients.find((p) => p.mrn === patient)?.coverage;
  const coverageNote =
    patient === ''
      ? undefined
      : coverage === undefined
        ? 'Self-pay — no coverage on file.'
        : `${coverage.plan} · eligibility ${coverage.eligibility}, checked ${formatDate(coverage.verified)}.`;

  // Focus moves on a submit, not on every change to the messages.
  const result = useRef<HTMLElement>(null);
  useEffect(() => {
    result.current?.focus();
  }, [attempts]);

  // The combobox's own state. kirua supplies the parts and the ARIA; the query,
  // the filtered rows and the highlighted one are application state, which is
  // why this is here and not inside the component.
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);

  const matches = diagnoses.filter((entry) =>
    `${entry.code} ${entry.label}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const pick = (index: number) => {
    const entry = matches[index];
    if (!entry) return;
    setDiagnosis(entry.code);
    setQuery(`${entry.code} — ${entry.label}`);
    setListOpen(false);
  };
  const { active, activeId, setActive, onKeyDown } = useActiveDescendant({
    count: matches.length,
    idOf: (index) => `diagnosis-${matches[index]?.code}`,
    onPick: pick,
    enabled: listOpen,
  });

  // The confirmation describes the form as it was sent. Any change after that
  // withdraws it, so it can never stand beside messages about the new values.
  const answers = JSON.stringify([
    patient,
    department,
    provider,
    date?.getTime(),
    diagnosis,
    reason,
    consent,
  ]);
  const saved = savedAs === answers;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempts((n) => n + 1);
    setSavedAs(Object.keys(validate()).length === 0 ? answers : null);
  };

  return (
    <Stack gap={5}>
      <Heading as="h1" size="heading-md">
        New visit
      </Heading>

      {saved && (
        <Stack
          as="output"
          gap={0}
          ref={(node: HTMLOutputElement | null) => {
            result.current = node;
          }}
          tabIndex={-1}
        >
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Visit scheduled</AlertTitle>
            <AlertDescription>This is a demo, so nothing has been saved.</AlertDescription>
          </Alert>
        </Stack>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert
          ref={(node) => {
            result.current = node;
          }}
          tabIndex={-1}
          status="danger"
          role="alert"
        >
          <AlertTitle>
            {Object.keys(errors).length}{' '}
            {Object.keys(errors).length === 1 ? 'field needs' : 'fields need'} attention
          </AlertTitle>
          <AlertDescription>
            <ErrorLinks errors={errors} />
          </AlertDescription>
        </Alert>
      )}

      <Card padding="md">
        <Stack
          as="form"
          gap={5}
          noValidate
          onSubmit={submit}
          onReset={() => {
            setPatient('');
            setDepartment('');
            setProvider('');
            setDate(undefined);
            setMonth(new Date(2026, 2, 1));
            setDateOpen(false);
            setQuery('');
            setDiagnosis(null);
            setListOpen(false);
            setActive(0);
            setReason('');
            setConsent(false);
            setAttempts(0);
            setSavedAs(null);
          }}
        >
          <Select name="patient" value={patient} onValueChange={setPatient}>
            <Field
              controlId="patient"
              label="Patient"
              required
              description={coverageNote}
              error={errors['patient']}
            >
              <SelectTrigger id="patient">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
            </Field>
            <SelectContent aria-label="Patient">
              {patients.map((patient) => (
                <SelectItem key={patient.mrn} value={patient.mrn}>
                  {patient.name} — MRN {patient.mrn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Grid md={2} gap={5}>
            <Select
              value={department}
              onValueChange={(next) => {
                setDepartment(next);
                setProvider('');
              }}
            >
              <Field
                controlId="department"
                label="Department"
                required
                error={errors['department']}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
              </Field>
              {/* Grouped the way the hospital lists its departments.
                    `SelectLabel` names each group for a screen reader as well
                    as on the screen. */}
              <SelectContent aria-label="Department">
                {departmentGroups.map((group, index) => (
                  <Fragment key={group.label}>
                    {index > 0 && <SelectSeparator />}
                    <SelectGroup>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.departments.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </Fragment>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={department === ''}
              name="provider"
              value={provider}
              onValueChange={setProvider}
            >
              <Field
                controlId="provider"
                label="Provider"
                description={department === '' ? 'Choose a department first.' : undefined}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
              </Field>
              <SelectContent aria-label="Provider">
                {(providers[department] ?? []).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Grid>

          <Grid md={2} gap={5}>
            <Field controlId="date" label="Visit date" required error={errors['date']}>
              <DatePicker
                id="date"
                locale="en-US"
                placeholder="Choose a date"
                panelLabel="Choose the visit date"
                month={month}
                onMonthChange={setMonth}
                value={date}
                open={dateOpen}
                onOpenChange={setDateOpen}
                today={new Date(2026, 2, 12)}
                onSelect={(picked) => {
                  setDate(picked);
                  setDateOpen(false);
                }}
              />
            </Field>

            <Field controlId="time" label="Time">
              <Input id="time" name="time" type="time" defaultValue="08:00" />
            </Field>
          </Grid>

          {/* The browser's own select: a long plain-text list a user types
              into, a wheel on the phone at the front desk, and a value the
              form's reset restores with no state of its own. */}
          <Field
            controlId="language"
            label="Preferred language"
            description="An interpreter is booked for any language other than English."
          >
            <NativeSelect
              id="language"
              name="language"
              width="sm"
              defaultValue="English"
              // Uncontrolled, so the form's own reset restores it, but a change
              // still withdraws the confirmation, as every other field's does.
              onChange={() => setSavedAs(null)}
            >
              {languageGroups.map((group) => (
                <NativeSelectOptGroup key={group.label} label={group.label}>
                  {group.languages.map((language) => (
                    <NativeSelectOption key={language}>{language}</NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
          </Field>

          {/* A combobox rather than a select: the real list is tens of
              thousands of codes long and a clinician knows the first letters.
              Focus never leaves the input, so `aria-activedescendant` is what
              announces the highlighted row. */}
          <Combobox open={listOpen} onOpenChange={setListOpen}>
            <Field
              controlId="diagnosis"
              label="Diagnosis (ICD-10-CM)"
              description="Type the code or the name."
            >
              <ComboboxInput
                id="diagnosis"
                name="diagnosis"
                value={query}
                placeholder="J06, hypertension…"
                aria-expanded={listOpen && matches.length > 0}
                aria-controls={listOpen && matches.length > 0 ? 'diagnosis-list' : undefined}
                aria-activedescendant={activeId}
                onFocus={() => setListOpen(true)}
                // A press on the field that is already focused reopens a list
                // closed with Escape.
                onClick={() => setListOpen(true)}
                onBlur={() => setListOpen(false)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setDiagnosis(null);
                  setListOpen(true);
                  setActive(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setListOpen(false);
                  else if (!listOpen && event.key === 'ArrowDown') {
                    // A closed list opens on its first row; an open one steps.
                    event.preventDefault();
                    setActive(0);
                    setListOpen(true);
                  } else onKeyDown(event);
                }}
              />
            </Field>
            {listOpen &&
              (matches.length > 0 ? (
                <ComboboxList id="diagnosis-list" aria-label="Diagnosis">
                  {matches.map((entry, index) => (
                    <ComboboxItem
                      key={entry.code}
                      id={`diagnosis-${entry.code}`}
                      isActive={index === active}
                      aria-selected={entry.code === diagnosis}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        pick(index);
                      }}
                    >
                      <span>
                        <Text inline size="inherit" tone="inherit" weight="medium" numeric>
                          {entry.code}
                        </Text>{' '}
                        {entry.label}
                      </span>
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              ) : (
                // Beside the list, never inside it: a `role="listbox"` must
                // contain options, which axe enforces.
                <ComboboxEmpty>No code matches.</ComboboxEmpty>
              ))}
          </Combobox>

          <Field controlId="reason" label="Reason for visit" required error={errors['reason']}>
            <Textarea
              id="reason"
              name="reason"
              rows={3}
              placeholder="Cough for 2 weeks, no fever…"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </Field>

          <Separator />

          <Field
            orientation="horizontal"
            controlId="consent"
            label="Consent to treat is signed"
            error={errors['consent']}
          >
            <Checkbox
              name="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
          </Field>

          <Inline wrap justify="end" gap={3}>
            <Button type="reset" variant="secondary">
              Clear
            </Button>
            <Button type="submit">Schedule the visit</Button>
          </Inline>
        </Stack>
      </Card>
    </Stack>
  );
}
