import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  CheckIcon,
  DatePicker,
  Field,
  Heading,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from 'kirua';
import { clinics, doctors, patients } from './data';

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
                <SelectContent aria-label="Poliklinik">
                  {clinics.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
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
