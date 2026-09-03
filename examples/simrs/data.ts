/**
 * Sample records for a *Sistem Informasi Manajemen Rumah Sakit* — a hospital
 * information system. Invented people, invented numbers, fixed dates.
 */

export interface Patient {
  rm: string;
  name: string;
  born: string;
  sex: 'M' | 'F';
  payer: 'BPJS' | 'Self-pay' | 'Insurance';
  phone: string;
  address: string;
  allergies: string[];
}

export interface Visit {
  id: string;
  rm: string;
  at: string;
  clinic: string;
  doctor: string;
  reason: string;
  status: 'scheduled' | 'in-progress' | 'done' | 'cancelled';
}

export interface Vital {
  at: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  temperature: number;
  weight: number;
}

export const patients: Patient[] = [
  {
    rm: 'RM-004128',
    name: 'Siti Rahayu',
    born: '1988-04-11',
    sex: 'F',
    payer: 'BPJS',
    phone: '081234567890',
    address: '112 Cihampelas Street, Bandung',
    allergies: ['Penicillin'],
  },
  {
    rm: 'RM-004129',
    name: 'Budi Santoso',
    born: '1975-11-02',
    sex: 'M',
    payer: 'Self-pay',
    phone: '081298765432',
    address: '8 Braga Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004130',
    name: 'Ayu Lestari',
    born: '2016-07-23',
    sex: 'F',
    payer: 'BPJS',
    phone: '082112223344',
    address: '45 Dago Street, Bandung',
    allergies: ['Amoxicillin', 'Dust'],
  },
  {
    rm: 'RM-004131',
    name: 'Joko Priyono',
    born: '1962-01-30',
    sex: 'M',
    payer: 'Insurance',
    phone: '081377889900',
    address: '21 Riau Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004132',
    name: 'Dewi Anggraini',
    born: '1994-09-17',
    sex: 'F',
    payer: 'BPJS',
    phone: '085711223344',
    address: '300 Setiabudi Street, Bandung',
    allergies: ['Sulfa'],
  },
  {
    rm: 'RM-004133',
    name: 'Hendra Wijaya',
    born: '1980-03-05',
    sex: 'M',
    payer: 'Self-pay',
    phone: '087822334455',
    address: '77 Pasteur Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004134',
    name: 'Rina Marlina',
    born: '2001-12-12',
    sex: 'F',
    payer: 'BPJS',
    phone: '089655667788',
    address: '9 Sukajadi Street, Bandung',
    allergies: ['Latex'],
  },
  {
    rm: 'RM-004135',
    name: 'Agus Salim',
    born: '1957-06-28',
    sex: 'M',
    payer: 'BPJS',
    phone: '081499887766',
    address: '3 Merdeka Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004136',
    name: 'Fitri Handayani',
    born: '1991-02-19',
    sex: 'F',
    payer: 'BPJS',
    phone: '081533445566',
    address: '18 Cikutra Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004137',
    name: 'Yusuf Maulana',
    born: '1968-08-09',
    sex: 'M',
    payer: 'Insurance',
    phone: '081644556677',
    address: '210 Ahmad Yani Street, Bandung',
    allergies: ['Aspirin'],
  },
  {
    rm: 'RM-004138',
    name: 'Nadia Puspa',
    born: '2019-05-14',
    sex: 'F',
    payer: 'BPJS',
    phone: '081755667788',
    address: '5 Kiaracondong Street, Bandung',
    allergies: ['Egg'],
  },
  {
    rm: 'RM-004139',
    name: 'Rahmat Hidayat',
    born: '1983-10-27',
    sex: 'M',
    payer: 'Self-pay',
    phone: '081866778899',
    address: '91 Buah Batu Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004140',
    name: 'Lina Kartika',
    born: '1959-03-03',
    sex: 'F',
    payer: 'BPJS',
    phone: '081977889900',
    address: '14 Gatot Subroto Street, Bandung',
    allergies: ['Penicillin', 'Sulfa'],
  },
  {
    rm: 'RM-004141',
    name: 'Bayu Nugroho',
    born: '1997-07-07',
    sex: 'M',
    payer: 'BPJS',
    phone: '082088990011',
    address: '402 Soekarno Hatta Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004142',
    name: 'Indah Permata',
    born: '1986-12-01',
    sex: 'F',
    payer: 'Insurance',
    phone: '082199001122',
    address: '33 Cipaganti Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004143',
    name: 'Teguh Prakoso',
    born: '1972-06-16',
    sex: 'M',
    payer: 'Self-pay',
    phone: '082200112233',
    address: '88 Sudirman Street, Bandung',
    allergies: ['Iodine'],
  },
  {
    rm: 'RM-004144',
    name: 'Sari Melati',
    born: '2004-09-29',
    sex: 'F',
    payer: 'BPJS',
    phone: '082311223344',
    address: '27 Antapani Street, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004145',
    name: 'Doni Saputra',
    born: '1965-11-21',
    sex: 'M',
    payer: 'BPJS',
    phone: '082422334455',
    address: '6 Ujungberung Street, Bandung',
    allergies: ['Dust'],
  },
];

export const clinics = [
  'General Practice',
  'Dental',
  'Paediatrics',
  'Ophthalmology',
  'Cardiology',
];

/**
 * Clinics grouped by the department that runs them, which is how a hospital
 * lists them and how the visit form now presents them. Fifteen entries in one
 * flat menu is a scroll; two named groups is a choice.
 */
export const clinicGroups = [
  { label: 'General services', clinics: ['General Practice', 'Dental'] },
  { label: 'Specialist', clinics: ['Paediatrics', 'Ophthalmology', 'Cardiology'] },
];

/**
 * A slice of ICD-10, which is the case a combobox exists for: a doctor knows
 * the first letters and the list is far too long to scroll. Shortened to what
 * the sample clinics see.
 */
export const diagnoses = [
  { code: 'J06.9', label: 'Acute upper respiratory infection' },
  { code: 'J20.9', label: 'Acute bronchitis' },
  { code: 'A09', label: 'Diarrhoea and gastroenteritis' },
  { code: 'I10', label: 'Essential hypertension' },
  { code: 'E11.9', label: 'Type 2 diabetes mellitus' },
  { code: 'K30', label: 'Dyspepsia' },
  { code: 'H10.9', label: 'Conjunctivitis' },
  { code: 'K02.1', label: 'Caries of dentine' },
  { code: 'L20.9', label: 'Atopic dermatitis' },
  { code: 'M54.5', label: 'Low back pain' },
  { code: 'R50.9', label: 'Fever of unknown origin' },
  { code: 'B34.9', label: 'Viral infection, unspecified' },
];

export const doctors: Record<string, string[]> = {
  'General Practice': ['Dr Andi Wijaya', 'Dr Sari Puspita'],
  Dental: ['Dr Maya Kusuma'],
  Paediatrics: ['Dr Rina Halim, Paediatrics'],
  Ophthalmology: ['Dr Hendra Gunawan, Ophthalmology'],
  Cardiology: ['Dr Lestari Nugroho, Cardiology'],
};

export const visits: Visit[] = [
  {
    id: 'V-2601',
    rm: 'RM-004128',
    at: '2026-03-12 07:30',
    clinic: 'General Practice',
    doctor: 'Dr Andi Wijaya',
    reason: 'Cough for two weeks',
    status: 'done',
  },
  {
    id: 'V-2602',
    rm: 'RM-004129',
    at: '2026-03-12 08:00',
    clinic: 'Dental',
    doctor: 'Dr Maya Kusuma',
    reason: 'Tooth cavity',
    status: 'in-progress',
  },
  {
    id: 'V-2603',
    rm: 'RM-004130',
    at: '2026-03-12 08:15',
    clinic: 'Paediatrics',
    doctor: 'Dr Rina Halim, Paediatrics',
    reason: 'Fever for three days',
    status: 'in-progress',
  },
  {
    id: 'V-2604',
    rm: 'RM-004131',
    at: '2026-03-12 09:00',
    clinic: 'Ophthalmology',
    doctor: 'Dr Hendra Gunawan, Ophthalmology',
    reason: 'Cataract follow-up',
    status: 'scheduled',
  },
  {
    id: 'V-2605',
    rm: 'RM-004132',
    at: '2026-03-12 09:30',
    clinic: 'General Practice',
    doctor: 'Dr Sari Puspita',
    reason: 'Blood pressure follow-up',
    status: 'scheduled',
  },
  {
    id: 'V-2606',
    rm: 'RM-004133',
    at: '2026-03-12 10:00',
    clinic: 'Cardiology',
    doctor: 'Dr Lestari Nugroho, Cardiology',
    reason: 'Mild chest pain',
    status: 'scheduled',
  },
  {
    id: 'V-2607',
    rm: 'RM-004134',
    at: '2026-03-12 10:30',
    clinic: 'General Practice',
    doctor: 'Dr Andi Wijaya',
    reason: 'Fitness certificate',
    status: 'cancelled',
  },
  {
    id: 'V-2608',
    rm: 'RM-004135',
    at: '2026-03-12 11:00',
    clinic: 'Cardiology',
    doctor: 'Dr Lestari Nugroho, Cardiology',
    reason: 'Routine follow-up',
    status: 'scheduled',
  },

  {
    id: 'V-2609',
    rm: 'RM-004136',
    at: '2026-03-12 11:30',
    clinic: 'General Practice',
    doctor: 'Dr Sari Puspita',
    reason: 'Recurring migraine',
    status: 'scheduled',
  },
  {
    id: 'V-2610',
    rm: 'RM-004137',
    at: '2026-03-12 12:00',
    clinic: 'Cardiology',
    doctor: 'Dr Lestari Nugroho, Cardiology',
    reason: 'Follow-up after a stent',
    status: 'scheduled',
  },
  {
    id: 'V-2611',
    rm: 'RM-004138',
    at: '2026-03-12 12:30',
    clinic: 'Paediatrics',
    doctor: 'Dr Rina Halim, Paediatrics',
    reason: 'Measles immunisation',
    status: 'scheduled',
  },
  {
    id: 'V-2612',
    rm: 'RM-004139',
    at: '2026-03-12 13:00',
    clinic: 'Dental',
    doctor: 'Dr Maya Kusuma',
    reason: 'Wisdom tooth extraction',
    status: 'scheduled',
  },
  {
    id: 'V-2613',
    rm: 'RM-004140',
    at: '2026-03-12 13:30',
    clinic: 'General Practice',
    doctor: 'Dr Andi Wijaya',
    reason: 'Blood sugar follow-up',
    status: 'in-progress',
  },
  {
    id: 'V-2614',
    rm: 'RM-004141',
    at: '2026-03-12 14:00',
    clinic: 'Ophthalmology',
    doctor: 'Dr Hendra Gunawan, Ophthalmology',
    reason: 'Red eye for three days',
    status: 'scheduled',
  },
  {
    id: 'V-2615',
    rm: 'RM-004142',
    at: '2026-03-12 14:30',
    clinic: 'General Practice',
    doctor: 'Dr Sari Puspita',
    reason: 'Low back pain',
    status: 'scheduled',
  },
  {
    id: 'V-2616',
    rm: 'RM-004143',
    at: '2026-03-12 15:00',
    clinic: 'Dental',
    doctor: 'Dr Maya Kusuma',
    reason: 'Filling follow-up',
    status: 'cancelled',
  },
  {
    id: 'V-2617',
    rm: 'RM-004144',
    at: '2026-03-12 15:30',
    clinic: 'General Practice',
    doctor: 'Dr Andi Wijaya',
    reason: 'Fitness certificate',
    status: 'scheduled',
  },
  {
    id: 'V-2618',
    rm: 'RM-004145',
    at: '2026-03-12 16:00',
    clinic: 'Cardiology',
    doctor: 'Dr Lestari Nugroho, Cardiology',
    reason: 'Breathless when walking',
    status: 'scheduled',
  },
  {
    id: 'V-2619',
    rm: 'RM-004128',
    at: '2026-02-04 08:10',
    clinic: 'General Practice',
    doctor: 'Dr Andi Wijaya',
    reason: 'Cough follow-up',
    status: 'done',
  },
  {
    id: 'V-2620',
    rm: 'RM-004128',
    at: '2025-12-19 09:00',
    clinic: 'General Practice',
    doctor: 'Dr Sari Puspita',
    reason: 'Fever and a cold',
    status: 'done',
  },
  {
    id: 'V-2621',
    rm: 'RM-004132',
    at: '2026-02-18 10:00',
    clinic: 'General Practice',
    doctor: 'Dr Sari Puspita',
    reason: 'Blood pressure follow-up',
    status: 'done',
  },
  {
    id: 'V-2622',
    rm: 'RM-004133',
    at: '2026-01-22 09:15',
    clinic: 'Cardiology',
    doctor: 'Dr Lestari Nugroho, Cardiology',
    reason: 'Chest pain on stairs',
    status: 'done',
  },
];

export const vitals: Record<string, Vital[]> = {
  'RM-004128': [
    {
      at: '2026-03-12 07:35',
      systolic: 118,
      diastolic: 76,
      pulse: 72,
      temperature: 36.8,
      weight: 58.4,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 122,
      diastolic: 80,
      pulse: 78,
      temperature: 36.6,
      weight: 58.9,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 130,
      diastolic: 84,
      pulse: 81,
      temperature: 37.1,
      weight: 59.6,
    },
  ],
  'RM-004129': [
    {
      at: '2026-03-12 07:35',
      systolic: 124,
      diastolic: 70,
      pulse: 87,
      temperature: 37.1,
      weight: 65.5,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 127,
      diastolic: 71,
      pulse: 87,
      temperature: 36.9,
      weight: 65.8,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 128,
      diastolic: 78,
      pulse: 87,
      temperature: 37.4,
      weight: 66.1,
    },
  ],
  'RM-004130': [
    {
      at: '2026-03-12 07:35',
      systolic: 118,
      diastolic: 86,
      pulse: 65,
      temperature: 36.4,
      weight: 59.9,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 122,
      diastolic: 90,
      pulse: 66,
      temperature: 37.0,
      weight: 60.6,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 130,
      diastolic: 90,
      pulse: 65,
      temperature: 37.1,
      weight: 61.5,
    },
  ],
  'RM-004131': [
    {
      at: '2026-03-12 07:35',
      systolic: 127,
      diastolic: 69,
      pulse: 66,
      temperature: 37.2,
      weight: 58.9,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 131,
      diastolic: 73,
      pulse: 70,
      temperature: 37.5,
      weight: 59.4,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 133,
      diastolic: 73,
      pulse: 76,
      temperature: 37.3,
      weight: 59.4,
    },
  ],
  'RM-004132': [
    {
      at: '2026-03-12 07:35',
      systolic: 123,
      diastolic: 82,
      pulse: 93,
      temperature: 37.1,
      weight: 82.5,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 129,
      diastolic: 86,
      pulse: 94,
      temperature: 37.3,
      weight: 82.8,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 133,
      diastolic: 90,
      pulse: 93,
      temperature: 37.6,
      weight: 83.0,
    },
  ],
  'RM-004133': [
    {
      at: '2026-03-12 07:35',
      systolic: 139,
      diastolic: 84,
      pulse: 82,
      temperature: 37.3,
      weight: 41.8,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 141,
      diastolic: 87,
      pulse: 85,
      temperature: 37.2,
      weight: 42.1,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 153,
      diastolic: 90,
      pulse: 92,
      temperature: 37.1,
      weight: 43.4,
    },
  ],
  'RM-004134': [
    {
      at: '2026-03-12 07:35',
      systolic: 132,
      diastolic: 75,
      pulse: 86,
      temperature: 36.8,
      weight: 83.4,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 137,
      diastolic: 76,
      pulse: 87,
      temperature: 37.3,
      weight: 83.7,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 138,
      diastolic: 83,
      pulse: 92,
      temperature: 37.5,
      weight: 84.7,
    },
  ],
  'RM-004135': [
    {
      at: '2026-03-12 07:35',
      systolic: 114,
      diastolic: 80,
      pulse: 87,
      temperature: 36.7,
      weight: 57.8,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 118,
      diastolic: 84,
      pulse: 88,
      temperature: 36.5,
      weight: 58.2,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 120,
      diastolic: 84,
      pulse: 87,
      temperature: 36.9,
      weight: 59.3,
    },
  ],
  'RM-004136': [
    {
      at: '2026-03-12 07:35',
      systolic: 120,
      diastolic: 75,
      pulse: 62,
      temperature: 37.0,
      weight: 27.1,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 127,
      diastolic: 76,
      pulse: 65,
      temperature: 37.5,
      weight: 28.0,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 134,
      diastolic: 83,
      pulse: 68,
      temperature: 36.8,
      weight: 27.7,
    },
  ],
  'RM-004137': [
    {
      at: '2026-03-12 07:35',
      systolic: 144,
      diastolic: 78,
      pulse: 65,
      temperature: 36.4,
      weight: 30.5,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 146,
      diastolic: 79,
      pulse: 69,
      temperature: 36.5,
      weight: 30.8,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 152,
      diastolic: 80,
      pulse: 65,
      temperature: 37.4,
      weight: 32.0,
    },
  ],
  'RM-004138': [
    {
      at: '2026-03-12 07:35',
      systolic: 113,
      diastolic: 86,
      pulse: 78,
      temperature: 36.5,
      weight: 88.6,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 118,
      diastolic: 90,
      pulse: 81,
      temperature: 36.7,
      weight: 88.9,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 127,
      diastolic: 92,
      pulse: 88,
      temperature: 36.6,
      weight: 90.5,
    },
  ],
  'RM-004139': [
    {
      at: '2026-03-12 07:35',
      systolic: 114,
      diastolic: 82,
      pulse: 63,
      temperature: 37.2,
      weight: 31.6,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 120,
      diastolic: 85,
      pulse: 68,
      temperature: 37.4,
      weight: 32.4,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 122,
      diastolic: 88,
      pulse: 65,
      temperature: 36.8,
      weight: 32.4,
    },
  ],
  'RM-004140': [
    {
      at: '2026-03-12 07:35',
      systolic: 138,
      diastolic: 90,
      pulse: 94,
      temperature: 37.4,
      weight: 41.1,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 141,
      diastolic: 92,
      pulse: 98,
      temperature: 36.9,
      weight: 42.0,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 142,
      diastolic: 96,
      pulse: 100,
      temperature: 36.6,
      weight: 42.7,
    },
  ],
  'RM-004141': [
    {
      at: '2026-03-12 07:35',
      systolic: 126,
      diastolic: 80,
      pulse: 84,
      temperature: 36.4,
      weight: 88.6,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 130,
      diastolic: 82,
      pulse: 87,
      temperature: 37.1,
      weight: 89.6,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 130,
      diastolic: 88,
      pulse: 94,
      temperature: 36.7,
      weight: 90.2,
    },
  ],
  'RM-004142': [
    {
      at: '2026-03-12 07:35',
      systolic: 146,
      diastolic: 69,
      pulse: 86,
      temperature: 36.9,
      weight: 75.5,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 148,
      diastolic: 73,
      pulse: 89,
      temperature: 36.8,
      weight: 76.6,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 160,
      diastolic: 73,
      pulse: 88,
      temperature: 37.6,
      weight: 75.9,
    },
  ],
  'RM-004143': [
    {
      at: '2026-03-12 07:35',
      systolic: 141,
      diastolic: 94,
      pulse: 91,
      temperature: 37.5,
      weight: 77.3,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 147,
      diastolic: 96,
      pulse: 91,
      temperature: 36.3,
      weight: 78.4,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 155,
      diastolic: 96,
      pulse: 99,
      temperature: 37.3,
      weight: 78.0,
    },
  ],
  'RM-004144': [
    {
      at: '2026-03-12 07:35',
      systolic: 116,
      diastolic: 92,
      pulse: 75,
      temperature: 36.6,
      weight: 18.1,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 120,
      diastolic: 96,
      pulse: 76,
      temperature: 36.4,
      weight: 19.0,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 126,
      diastolic: 100,
      pulse: 83,
      temperature: 36.5,
      weight: 18.8,
    },
  ],
  'RM-004145': [
    {
      at: '2026-03-12 07:35',
      systolic: 136,
      diastolic: 66,
      pulse: 90,
      temperature: 36.5,
      weight: 75.0,
    },
    {
      at: '2026-02-04 08:10',
      systolic: 143,
      diastolic: 67,
      pulse: 94,
      temperature: 36.4,
      weight: 75.8,
    },
    {
      at: '2025-12-19 09:00',
      systolic: 148,
      diastolic: 74,
      pulse: 90,
      temperature: 37.4,
      weight: 75.5,
    },
  ],
};

/** The visit status ramp, mapped once so no screen invents its own colours. */
export const statusTone = {
  scheduled: 'neutral',
  'in-progress': 'info',
  done: 'success',
  cancelled: 'danger',
} as const;

export const age = (born: string, today = new Date(2026, 2, 12)) => {
  const b = new Date(born);
  let years = today.getFullYear() - b.getFullYear();
  const monthDiff = today.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < b.getDate())) years -= 1;
  return years;
};

/**
 * A laboratory panel: one order, several measurements. `reference` is the
 * normal range as a laboratory prints it, and `flag` is what the laboratory
 * decided — not something a screen recomputes, because the range depends on
 * age, sex and method and none of that is in this file.
 */
export interface LabResult {
  id: string;
  rm: string;
  at: string;
  panel: string;
  status: 'pending' | 'done';
  rows: {
    name: string;
    value: string;
    unit: string;
    reference: string;
    flag: 'normal' | 'high' | 'low';
  }[];
}

export const labResults: LabResult[] = [
  {
    id: 'LAB-8801',
    rm: 'RM-004128',
    at: '2026-03-12 08:05',
    panel: 'Full blood count',
    status: 'done',
    rows: [
      {
        name: 'Hemoglobin',
        value: '11.8',
        unit: 'g/dL',
        reference: '12.0 – 15.5',
        flag: 'low',
      },
      {
        name: 'White cells',
        value: '9.4',
        unit: '10³/µL',
        reference: '4.0 – 11.0',
        flag: 'normal',
      },
      {
        name: 'Platelets',
        value: '268',
        unit: '10³/µL',
        reference: '150 – 400',
        flag: 'normal',
      },
      { name: 'Haematocrit', value: '35.1', unit: '%', reference: '36 – 46', flag: 'low' },
    ],
  },
  {
    id: 'LAB-8802',
    rm: 'RM-004132',
    at: '2026-03-12 09:40',
    panel: 'Lipid profile',
    status: 'done',
    rows: [
      {
        name: 'Total cholesterol',
        value: '232',
        unit: 'mg/dL',
        reference: '< 200',
        flag: 'high',
      },
      { name: 'HDL', value: '46', unit: 'mg/dL', reference: '> 40', flag: 'normal' },
      { name: 'LDL', value: '158', unit: 'mg/dL', reference: '< 130', flag: 'high' },
      {
        name: 'Triglycerides',
        value: '141',
        unit: 'mg/dL',
        reference: '< 150',
        flag: 'normal',
      },
    ],
  },
  {
    id: 'LAB-8803',
    rm: 'RM-004133',
    at: '2026-03-12 10:15',
    panel: 'Cardiac enzymes',
    status: 'pending',
    rows: [],
  },
  {
    id: 'LAB-8804',
    rm: 'RM-004130',
    at: '2026-03-12 08:50',
    panel: 'Urinalysis',
    status: 'done',
    rows: [
      { name: 'Colour', value: 'Yellow', unit: '', reference: 'Yellow', flag: 'normal' },
      { name: 'pH', value: '6.0', unit: '', reference: '4.6 – 8.0', flag: 'normal' },
      { name: 'Protein', value: 'Negative', unit: '', reference: 'Negative', flag: 'normal' },
      {
        name: 'Leukocyte esterase',
        value: 'Positive 1+',
        unit: '',
        reference: 'Negative',
        flag: 'high',
      },
    ],
  },
  {
    id: 'LAB-8805',
    rm: 'RM-004140',
    at: '2026-03-11 14:20',
    panel: 'Fasting blood glucose',
    status: 'done',
    rows: [
      {
        name: 'Fasting glucose',
        value: '148',
        unit: 'mg/dL',
        reference: '70 – 99',
        flag: 'high',
      },
      { name: 'HbA1c', value: '7.4', unit: '%', reference: '< 5.7', flag: 'high' },
    ],
  },
  {
    id: 'LAB-8806',
    rm: 'RM-004137',
    at: '2026-03-11 11:05',
    panel: 'Renal function',
    status: 'done',
    rows: [
      { name: 'Urea', value: '38', unit: 'mg/dL', reference: '17 – 43', flag: 'normal' },
      {
        name: 'Creatinine',
        value: '1.42',
        unit: 'mg/dL',
        reference: '0.70 – 1.20',
        flag: 'high',
      },
    ],
  },
];

/** One line of pharmacy stock. `reorder` is the level the pharmacy restocks at. */
export interface Medicine {
  code: string;
  name: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment';
  shelf: string;
  stock: number;
  reorder: number;
  expires: string;
  price: number;
}

export const medicines: Medicine[] = [
  {
    code: 'OB-101',
    name: 'Paracetamol 500 mg',
    form: 'Tablet',
    shelf: 'A1',
    stock: 1840,
    reorder: 400,
    expires: '2027-08-31',
    price: 350,
  },
  {
    code: 'OB-102',
    name: 'Amoxicillin 500 mg',
    form: 'Capsule',
    shelf: 'A2',
    stock: 260,
    reorder: 300,
    expires: '2026-11-30',
    price: 1200,
  },
  {
    code: 'OB-103',
    name: 'Amlodipine 10 mg',
    form: 'Tablet',
    shelf: 'B1',
    stock: 720,
    reorder: 250,
    expires: '2027-02-28',
    price: 900,
  },
  {
    code: 'OB-104',
    name: 'Metformin 500 mg',
    form: 'Tablet',
    shelf: 'B2',
    stock: 148,
    reorder: 300,
    expires: '2026-09-30',
    price: 650,
  },
  {
    code: 'OB-105',
    name: 'Salbutamol syrup',
    form: 'Syrup',
    shelf: 'C1',
    stock: 62,
    reorder: 40,
    expires: '2026-06-30',
    price: 18500,
  },
  {
    code: 'OB-106',
    name: 'Ceftriaxone 1 g',
    form: 'Injection',
    shelf: 'D1',
    stock: 34,
    reorder: 50,
    expires: '2026-05-31',
    price: 42000,
  },
  {
    code: 'OB-107',
    name: 'Dexamethasone 0.5 mg',
    form: 'Tablet',
    shelf: 'B3',
    stock: 980,
    reorder: 200,
    expires: '2027-04-30',
    price: 280,
  },
  {
    code: 'OB-108',
    name: 'Hydrocortisone ointment',
    form: 'Ointment',
    shelf: 'C2',
    stock: 0,
    reorder: 25,
    expires: '2026-12-31',
    price: 21000,
  },
  {
    code: 'OB-109',
    name: 'Omeprazole 20 mg',
    form: 'Capsule',
    shelf: 'A3',
    stock: 410,
    reorder: 150,
    expires: '2027-01-31',
    price: 1450,
  },
  {
    code: 'OB-110',
    name: 'Ranitidine 150 mg',
    form: 'Tablet',
    shelf: 'A4',
    stock: 96,
    reorder: 150,
    expires: '2026-04-30',
    price: 700,
  },
  {
    code: 'OB-111',
    name: 'Simvastatin 20 mg',
    form: 'Tablet',
    shelf: 'B4',
    stock: 530,
    reorder: 200,
    expires: '2027-06-30',
    price: 820,
  },
  {
    code: 'OB-112',
    name: 'Furosemide 40 mg',
    form: 'Tablet',
    shelf: 'B5',
    stock: 212,
    reorder: 120,
    expires: '2026-10-31',
    price: 610,
  },
];

/** Visits closed per month, for the summary page. Twelve months to March 2026. */
export const monthlyVisits = [
  { label: 'Apr', value: 1180 },
  { label: 'May', value: 1264 },
  { label: 'Jun', value: 1096 },
  { label: 'Jul', value: 1338 },
  { label: 'Aug', value: 1412 },
  { label: 'Sep', value: 1290 },
  { label: 'Oct', value: 1355 },
  { label: 'Nov', value: 1487 },
  { label: 'Dec', value: 1602 },
  { label: 'Jan', value: 1548 },
  { label: 'Feb', value: 1421 },
  { label: 'Mar', value: 1673 },
];

/** How today's visits split across the clinics. Same six months as the bars. */
export const clinicLoad = [
  { clinic: 'General Practice', today: 42, series: 1 as const },
  { clinic: 'Dental', today: 18, series: 2 as const },
  { clinic: 'Paediatrics', today: 27, series: 3 as const },
  { clinic: 'Ophthalmology', today: 12, series: 4 as const },
  { clinic: 'Cardiology', today: 9, series: 5 as const },
];

/** Occupancy per ward, for the summary page's capacity row. */
export const wards = [
  { name: 'Jasmine', beds: 24, used: 21 },
  { name: 'Orchid', beds: 18, used: 11 },
  { name: 'Rose', beds: 30, used: 30 },
  { name: 'ICU', beds: 8, used: 6 },
];

export const idr = (value: number) =>
  `Rp ${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

/** The lab flag ramp, mapped once so no screen invents its own colours. */
export const flagTone = {
  normal: 'success',
  high: 'danger',
  low: 'warning',
} as const;
