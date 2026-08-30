/**
 * Sample records for a *Sistem Informasi Manajemen Rumah Sakit* — a hospital
 * information system. Invented people, invented numbers, fixed dates.
 */

export interface Patient {
  rm: string;
  name: string;
  born: string;
  sex: 'L' | 'P';
  payer: 'BPJS' | 'Umum' | 'Asuransi';
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
  status: 'terjadwal' | 'diperiksa' | 'selesai' | 'batal';
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
    sex: 'P',
    payer: 'BPJS',
    phone: '081234567890',
    address: 'Jl. Cihampelas 112, Bandung',
    allergies: ['Penisilin'],
  },
  {
    rm: 'RM-004129',
    name: 'Budi Santoso',
    born: '1975-11-02',
    sex: 'L',
    payer: 'Umum',
    phone: '081298765432',
    address: 'Jl. Braga 8, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004130',
    name: 'Ayu Lestari',
    born: '2016-07-23',
    sex: 'P',
    payer: 'BPJS',
    phone: '082112223344',
    address: 'Jl. Dago 45, Bandung',
    allergies: ['Amoksisilin', 'Debu'],
  },
  {
    rm: 'RM-004131',
    name: 'Joko Priyono',
    born: '1962-01-30',
    sex: 'L',
    payer: 'Asuransi',
    phone: '081377889900',
    address: 'Jl. Riau 21, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004132',
    name: 'Dewi Anggraini',
    born: '1994-09-17',
    sex: 'P',
    payer: 'BPJS',
    phone: '085711223344',
    address: 'Jl. Setiabudi 300, Bandung',
    allergies: ['Sulfa'],
  },
  {
    rm: 'RM-004133',
    name: 'Hendra Wijaya',
    born: '1980-03-05',
    sex: 'L',
    payer: 'Umum',
    phone: '087822334455',
    address: 'Jl. Pasteur 77, Bandung',
    allergies: [],
  },
  {
    rm: 'RM-004134',
    name: 'Rina Marlina',
    born: '2001-12-12',
    sex: 'P',
    payer: 'BPJS',
    phone: '089655667788',
    address: 'Jl. Sukajadi 9, Bandung',
    allergies: ['Lateks'],
  },
  {
    rm: 'RM-004135',
    name: 'Agus Salim',
    born: '1957-06-28',
    sex: 'L',
    payer: 'BPJS',
    phone: '081499887766',
    address: 'Jl. Merdeka 3, Bandung',
    allergies: [],
  },
];

export const clinics = ['Poli Umum', 'Poli Gigi', 'Poli Anak', 'Poli Mata', 'Poli Jantung'];

export const doctors: Record<string, string[]> = {
  'Poli Umum': ['dr. Andi Wijaya', 'dr. Sari Puspita'],
  'Poli Gigi': ['drg. Maya Kusuma'],
  'Poli Anak': ['dr. Rina Halim, Sp.A'],
  'Poli Mata': ['dr. Hendra Gunawan, Sp.M'],
  'Poli Jantung': ['dr. Lestari Nugroho, Sp.JP'],
};

export const visits: Visit[] = [
  {
    id: 'V-2601',
    rm: 'RM-004128',
    at: '2026-03-12 07:30',
    clinic: 'Poli Umum',
    doctor: 'dr. Andi Wijaya',
    reason: 'Batuk dua minggu',
    status: 'selesai',
  },
  {
    id: 'V-2602',
    rm: 'RM-004129',
    at: '2026-03-12 08:00',
    clinic: 'Poli Gigi',
    doctor: 'drg. Maya Kusuma',
    reason: 'Gigi berlubang',
    status: 'diperiksa',
  },
  {
    id: 'V-2603',
    rm: 'RM-004130',
    at: '2026-03-12 08:15',
    clinic: 'Poli Anak',
    doctor: 'dr. Rina Halim, Sp.A',
    reason: 'Demam tiga hari',
    status: 'diperiksa',
  },
  {
    id: 'V-2604',
    rm: 'RM-004131',
    at: '2026-03-12 09:00',
    clinic: 'Poli Mata',
    doctor: 'dr. Hendra Gunawan, Sp.M',
    reason: 'Kontrol katarak',
    status: 'terjadwal',
  },
  {
    id: 'V-2605',
    rm: 'RM-004132',
    at: '2026-03-12 09:30',
    clinic: 'Poli Umum',
    doctor: 'dr. Sari Puspita',
    reason: 'Kontrol tekanan darah',
    status: 'terjadwal',
  },
  {
    id: 'V-2606',
    rm: 'RM-004133',
    at: '2026-03-12 10:00',
    clinic: 'Poli Jantung',
    doctor: 'dr. Lestari Nugroho, Sp.JP',
    reason: 'Nyeri dada ringan',
    status: 'terjadwal',
  },
  {
    id: 'V-2607',
    rm: 'RM-004134',
    at: '2026-03-12 10:30',
    clinic: 'Poli Umum',
    doctor: 'dr. Andi Wijaya',
    reason: 'Surat keterangan sehat',
    status: 'batal',
  },
  {
    id: 'V-2608',
    rm: 'RM-004135',
    at: '2026-03-12 11:00',
    clinic: 'Poli Jantung',
    doctor: 'dr. Lestari Nugroho, Sp.JP',
    reason: 'Kontrol rutin',
    status: 'terjadwal',
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
};

/** The visit status ramp, mapped once so no screen invents its own colours. */
export const statusTone = {
  terjadwal: 'neutral',
  diperiksa: 'info',
  selesai: 'success',
  batal: 'danger',
} as const;

export const age = (born: string, today = new Date(2026, 2, 12)) => {
  const b = new Date(born);
  let years = today.getFullYear() - b.getFullYear();
  const monthDiff = today.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < b.getDate())) years -= 1;
  return years;
};
