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
  Heading,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from 'kirua';
import { ErrorLinks } from '../shared/ErrorLinks';
import { clinicGroups, diagnoses, doctors, patients } from './data';

/**
 * The form that exercises real validation, a `Select`, a `DatePicker` and an
 * error summary. Nothing is submitted anywhere — the point is the wiring.
 */
export function NewVisit() {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [clinic, setClinic] = useState('');
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [consent, setConsent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [saved, setSaved] = useState(false);

  // Validated on submit, then live: once the form has been sent back, each
  // message clears the moment its field is valid and the count follows.
  const validate = () => {
    const found: Record<string, string> = {};
    if (patient === '') found['rm'] = 'Choose a patient first.';
    if (clinic === '') found['clinic'] = 'A clinic is required.';
    if (date === undefined) found['date'] = 'A visit date is required.';
    if (reason.trim().length < 5)
      found['reason'] = 'Describe the reason in at least five characters.';
    if (!consent) found['consent'] = 'Patient consent must be ticked.';
    return found;
  };
  const errors = attempts > 0 ? validate() : {};

  // Focus moves on a submit, not on every change to the messages.
  const result = useRef<HTMLElement>(null);
  useEffect(() => {
    result.current?.focus();
  }, [attempts, saved]);

  // The combobox's own state. kirua supplies the parts and the ARIA; the query,
  // the filtered rows and the highlighted one are application state, which is
  // why this is here and not inside the component.
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [active, setActive] = useState(0);

  const matches = diagnoses.filter((entry) =>
    `${entry.code} ${entry.label}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const activeId =
    listOpen && matches[active] ? `diagnosis-${matches[active].code}` : undefined;
  // The arrows can move the highlight past the bottom of a scrolled list.
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempts((n) => n + 1);
    setSaved(Object.keys(validate()).length === 0);
  };

  return (
    <div className="grid content-start gap-5">
      <Heading as="h1" size="heading-md">
        New visit
      </Heading>

      {saved && (
        <output
          ref={(node) => {
            result.current = node;
          }}
          tabIndex={-1}
          className="block"
        >
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Visit saved</AlertTitle>
            <AlertDescription>An example screen — nothing is really stored.</AlertDescription>
          </Alert>
        </output>
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
          <AlertTitle>{Object.keys(errors).length} fields need attention</AlertTitle>
          <AlertDescription>
            <ErrorLinks errors={errors} />
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-5">
        <form
          noValidate
          onSubmit={submit}
          onReset={() => {
            setPatient('');
            setClinic('');
            setDoctor('');
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
            setSaved(false);
          }}
          className="grid gap-5"
        >
          <Select name="rm" value={patient} onValueChange={setPatient}>
            <Field controlId="rm" label="Patient" required error={errors['rm']}>
              <SelectTrigger id="rm">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
            </Field>
            <SelectContent aria-label="Patient">
              {patients.map((patient) => (
                <SelectItem key={patient.rm} value={patient.rm}>
                  {patient.name} — {patient.rm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-5 md:grid-cols-2">
            <Select
              value={clinic}
              onValueChange={(next) => {
                setClinic(next);
                setDoctor('');
              }}
            >
              <Field controlId="clinic" label="Clinic" required error={errors['clinic']}>
                <SelectTrigger id="clinic">
                  <SelectValue placeholder="Choose a clinic" />
                </SelectTrigger>
              </Field>
              {/* Grouped by the department that runs the clinic, which is how
                    the hospital lists them. `SelectLabel` names each group for a
                    screen reader as well as on the screen. */}
              <SelectContent aria-label="Clinic">
                {clinicGroups.map((group, index) => (
                  <Fragment key={group.label}>
                    {index > 0 && <SelectSeparator />}
                    <SelectGroup>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.clinics.map((name) => (
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
              disabled={clinic === ''}
              name="doctor"
              value={doctor}
              onValueChange={setDoctor}
            >
              <Field
                controlId="doctor"
                label="Doctor"
                description={clinic === '' ? 'Choose a clinic first.' : undefined}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
              </Field>
              <SelectContent aria-label="Doctor">
                {(doctors[clinic] ?? []).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field controlId="date" label="Visit date" required error={errors['date']}>
              <DatePicker
                id="date"
                locale="en-GB"
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
          </div>

          {/* A combobox rather than a select: the real list is thousands of
              codes long and a doctor knows the first letters. Focus never
              leaves the input, so `aria-activedescendant` is what announces the
              highlighted row. */}
          <Combobox open={listOpen} onOpenChange={setListOpen}>
            <Field
              controlId="diagnosis"
              label="Diagnosis (ICD-10)"
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
                  if (event.key === 'ArrowDown') {
                    // A closed list opens on its first row; an open one steps.
                    setActive((n) =>
                      listOpen ? Math.max(0, Math.min(matches.length - 1, n + 1)) : 0,
                    );
                    setListOpen(true);
                  } else if (event.key === 'ArrowUp') setActive((n) => Math.max(0, n - 1));
                  else if (event.key === 'Enter' && listOpen && matches[active]) {
                    event.preventDefault();
                    setDiagnosis(matches[active].code);
                    setQuery(`${matches[active].code} — ${matches[active].label}`);
                    setListOpen(false);
                  } else if (event.key === 'Escape') setListOpen(false);
                  else return;
                  if (event.key.startsWith('Arrow')) event.preventDefault();
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
                        setDiagnosis(entry.code);
                        setQuery(`${entry.code} — ${entry.label}`);
                        setListOpen(false);
                      }}
                    >
                      <span>
                        <span className="font-medium tabular-nums">{entry.code}</span>{' '}
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

          <Field
            controlId="reason"
            label="Reason for the visit"
            required
            error={errors['reason']}
          >
            <Textarea
              id="reason"
              name="reason"
              rows={3}
              placeholder="A cough for two weeks, no fever…"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </Field>

          <Separator />

          <Field
            orientation="horizontal"
            controlId="consent"
            label="The patient consents to the examination"
            error={errors['consent']}
          >
            <Checkbox
              name="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
          </Field>

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="reset" variant="secondary">
              Clear
            </Button>
            <Button type="submit">Save the visit</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
