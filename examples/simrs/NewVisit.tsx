import { Fragment, useState } from 'react';
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
  Label,
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const found: Record<string, string> = {};

    if (String(form.get('rm') ?? '').trim() === '')
      found['rm'] = 'Pilih pasien terlebih dahulu.';
    if (clinic === '') found['clinic'] = 'Poliklinik wajib dipilih.';
    if (date === undefined) found['date'] = 'Tanggal kunjungan wajib diisi.';
    if (String(form.get('reason') ?? '').trim().length < 5)
      found['reason'] = 'Tulis keluhan minimal lima huruf.';
    if (form.get('consent') !== 'on') found['consent'] = 'Persetujuan pasien wajib dicentang.';

    setErrors(found);
    setSaved(Object.keys(found).length === 0);
  };

  return (
    <div className="grid content-start gap-5">
      <Heading as="h1" size="heading-md">
        Kunjungan baru
      </Heading>

      {saved && (
        <output className="block">
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Kunjungan tersimpan</AlertTitle>
            <AlertDescription>
              Layar contoh — tidak ada data yang benar-benar disimpan.
            </AlertDescription>
          </Alert>
        </output>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert status="danger" role="alert">
          <AlertTitle>{Object.keys(errors).length} isian perlu diperbaiki</AlertTitle>
          <AlertDescription>Pesan lengkap ada di bawah setiap isian.</AlertDescription>
        </Alert>
      )}

      <Card className="p-5">
        <form noValidate onSubmit={submit} className="grid gap-5">
          <Field controlId="rm" label="Pasien" required error={errors['rm']}>
            <Select name="rm">
              <SelectTrigger id="rm">
                <SelectValue placeholder="Pilih pasien" />
              </SelectTrigger>
              <SelectContent aria-label="Pasien">
                {patients.map((patient) => (
                  <SelectItem key={patient.rm} value={patient.rm}>
                    {patient.name} — {patient.rm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field controlId="clinic" label="Poliklinik" required error={errors['clinic']}>
              <Select value={clinic} onValueChange={setClinic}>
                <SelectTrigger id="clinic">
                  <SelectValue placeholder="Pilih poliklinik" />
                </SelectTrigger>
                {/* Grouped by the department that runs the clinic, which is how
                    the hospital lists them. `SelectLabel` names each group for a
                    screen reader as well as on the screen. */}
                <SelectContent aria-label="Poliklinik">
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
            </Field>

            <Field
              controlId="doctor"
              label="Dokter"
              description={clinic === '' ? 'Pilih poliklinik dahulu.' : undefined}
            >
              <Select disabled={clinic === ''} name="doctor">
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Pilih dokter" />
                </SelectTrigger>
                <SelectContent aria-label="Dokter">
                  {(doctors[clinic] ?? []).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field controlId="date" label="Tanggal kunjungan" required error={errors['date']}>
              <DatePicker
                id="date"
                locale="id-ID"
                placeholder="Pilih tanggal"
                panelLabel="Pilih tanggal kunjungan"
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

            <Field controlId="time" label="Jam">
              <Input id="time" name="time" type="time" defaultValue="08:00" />
            </Field>
          </div>

          {/* A combobox rather than a select: the real list is thousands of
              codes long and a doctor knows the first letters. Focus never
              leaves the input, so `aria-activedescendant` is what announces the
              highlighted row. */}
          <Field
            controlId="diagnosis"
            label="Diagnosis (ICD-10)"
            description="Ketik kode atau namanya."
          >
            <Combobox>
              <ComboboxInput
                id="diagnosis"
                name="diagnosis"
                value={query}
                placeholder="J06, hipertensi…"
                aria-expanded={listOpen}
                aria-controls="diagnosis-list"
                aria-activedescendant={
                  listOpen && matches[active] ? `diagnosis-${matches[active].code}` : undefined
                }
                onFocus={() => setListOpen(true)}
                onBlur={() => setListOpen(false)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setListOpen(true);
                  setActive(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown')
                    setActive((n) => Math.min(matches.length - 1, n + 1));
                  else if (event.key === 'ArrowUp') setActive((n) => Math.max(0, n - 1));
                  else if (event.key === 'Enter' && matches[active]) {
                    event.preventDefault();
                    setDiagnosis(matches[active].code);
                    setQuery(`${matches[active].code} — ${matches[active].label}`);
                    setListOpen(false);
                  } else if (event.key === 'Escape') setListOpen(false);
                  else return;
                  if (event.key.startsWith('Arrow')) event.preventDefault();
                }}
              />
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
                  <ComboboxEmpty>Tidak ada kode yang cocok.</ComboboxEmpty>
                ))}
            </Combobox>
          </Field>

          <Field controlId="reason" label="Keluhan" required error={errors['reason']}>
            <Textarea
              id="reason"
              name="reason"
              rows={3}
              placeholder="Batuk dua minggu, tanpa demam…"
            />
          </Field>

          <Separator />

          <div className="grid gap-1.5">
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                name="consent"
                aria-invalid={errors['consent'] !== undefined}
              />
              <Label htmlFor="consent">Pasien menyetujui pemeriksaan</Label>
            </div>
            {errors['consent'] && (
              <p className="text-body-sm text-invalid">{errors['consent']}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="reset" variant="secondary">
              Bersihkan
            </Button>
            <Button type="submit">Simpan kunjungan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
