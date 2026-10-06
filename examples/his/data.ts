/**
 * Sample records for a US hospital information system. Invented people,
 * invented numbers, fixed dates; every phone number is in the 555-01xx range
 * reserved for fiction.
 */

/** The hospital the sample system runs. */
export const HOSPITAL = 'Juniper Valley Medical Center';

/** The day the sample is frozen on, a Thursday. */
export const TODAY = '2026-03-12';

export type Payer = 'Medicare' | 'Medicaid' | 'Commercial' | 'Self-pay';

/**
 * What registration verified about a payer. `eligibility` is the answer from
 * the payer's eligibility check (an X12 270/271 exchange), and `verified` is
 * when it was asked.
 */
export interface Coverage {
  plan: string;
  memberId: string;
  group?: string;
  eligibility: 'active' | 'pending' | 'inactive';
  verified: string;
}

export interface Patient {
  mrn: string;
  name: string;
  preferred?: string;
  born: string;
  sex: 'M' | 'F';
  payer: Payer;
  /** Absent for self-pay. */
  coverage?: Coverage;
  phone: string;
  address: string;
  allergies: string[];
}

export type EncounterType = 'Outpatient' | 'Emergency' | 'Observation' | 'Inpatient';

export interface Encounter {
  id: string;
  mrn: string;
  at: string;
  type: EncounterType;
  /** The clinic for an appointment, the unit for a stay. */
  department: string;
  provider: string;
  reason: string;
  /** Emergency Severity Index, 1 (resuscitation) to 5 (non-urgent). */
  acuity?: 1 | 2 | 3 | 4 | 5;
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled';
}

export interface Vital {
  at: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  /** Degrees Fahrenheit. */
  temperature: number;
  spo2: number;
  /** Pounds. */
  weight: number;
}

export const patients: Patient[] = [
  {
    mrn: '20418801',
    name: 'Maria Gonzalez',
    born: '1988-04-11',
    sex: 'F',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual PPO',
      memberId: 'CMP884120931',
      group: 'G-40217',
      eligibility: 'active',
      verified: '2026-03-10',
    },
    phone: '(614) 555-0142',
    address: '1428 Maple Ridge Dr, Columbus, OH 43215',
    allergies: ['Penicillins'],
  },
  {
    mrn: '20418802',
    name: 'James Whitaker',
    born: '1975-11-02',
    sex: 'M',
    payer: 'Self-pay',
    phone: '(614) 555-0118',
    address: '87 Linden Ave, Westerville, OH 43081',
    allergies: [],
  },
  {
    mrn: '20418803',
    name: 'Aaliyah Johnson',
    born: '2016-07-23',
    sex: 'F',
    payer: 'Medicaid',
    coverage: {
      plan: 'Ohio Medicaid',
      memberId: '910048372611',
      eligibility: 'active',
      verified: '2026-03-12',
    },
    phone: '(614) 555-0175',
    address: '45 Birchwood Ct, Columbus, OH 43219',
    allergies: ['Amoxicillin', 'Peanut'],
  },
  {
    mrn: '20418804',
    name: 'Robert Chen',
    preferred: 'Bob',
    born: '1962-01-30',
    sex: 'M',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual HMO',
      memberId: 'CMH553019847',
      group: 'G-11802',
      eligibility: 'active',
      verified: '2026-03-09',
    },
    phone: '(614) 555-0163',
    address: '2210 Sawmill Pkwy, Dublin, OH 43017',
    allergies: [],
  },
  {
    mrn: '20418805',
    name: 'Priya Patel',
    born: '1994-09-17',
    sex: 'F',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual HDHP',
      memberId: 'CMD207734455',
      group: 'G-40217',
      eligibility: 'active',
      verified: '2026-03-11',
    },
    phone: '(614) 555-0129',
    address: '310 Hartford St, Worthington, OH 43085',
    allergies: ['Sulfa drugs'],
  },
  {
    mrn: '20418806',
    name: "Michael O'Brien",
    preferred: 'Mike',
    born: '1980-03-05',
    sex: 'M',
    payer: 'Self-pay',
    phone: '(614) 555-0187',
    address: '77 Kenny Rd, Upper Arlington, OH 43221',
    allergies: [],
  },
  {
    mrn: '20418807',
    name: 'Destiny Williams',
    born: '2001-12-12',
    sex: 'F',
    payer: 'Medicaid',
    coverage: {
      plan: 'Ohio Medicaid',
      memberId: '910065518920',
      eligibility: 'active',
      verified: '2026-03-02',
    },
    phone: '(614) 555-0151',
    address: '9 Cleveland Ave, Columbus, OH 43211',
    allergies: ['Latex'],
  },
  {
    mrn: '20418808',
    name: 'Harold Jensen',
    born: '1957-06-28',
    sex: 'M',
    payer: 'Medicare',
    coverage: {
      plan: 'Medicare Part A and B',
      memberId: '3KT7-WD2-RP58',
      eligibility: 'active',
      verified: '2026-03-10',
    },
    phone: '(614) 555-0106',
    address: '3 Stringtown Rd, Grove City, OH 43123',
    allergies: [],
  },
  {
    mrn: '20418809',
    name: 'Sofia Ramirez',
    born: '1991-02-19',
    sex: 'F',
    payer: 'Medicaid',
    coverage: {
      plan: 'Ohio Medicaid',
      memberId: '910072043318',
      eligibility: 'active',
      verified: '2026-03-12',
    },
    phone: '(614) 555-0134',
    address: '18 Livingston Ave, Columbus, OH 43205',
    allergies: [],
  },
  {
    mrn: '20418810',
    name: 'Kwame Mensah',
    born: '1968-08-09',
    sex: 'M',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual PPO',
      memberId: 'CMP661029384',
      group: 'G-20554',
      eligibility: 'active',
      verified: '2026-03-11',
    },
    phone: '(614) 555-0192',
    address: '210 Hamilton Rd, Gahanna, OH 43230',
    allergies: ['Aspirin'],
  },
  {
    mrn: '20418811',
    name: 'Lily Nguyen',
    born: '2019-05-14',
    sex: 'F',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual PPO',
      memberId: 'CMP774410263',
      group: 'G-30091',
      eligibility: 'active',
      verified: '2026-03-12',
    },
    phone: '(614) 555-0147',
    address: '5 Brice Rd, Reynoldsburg, OH 43068',
    allergies: ['Egg'],
  },
  {
    mrn: '20418812',
    name: 'Daniel Kowalski',
    born: '1983-10-27',
    sex: 'M',
    payer: 'Self-pay',
    phone: '(614) 555-0113',
    address: '91 Cemetery Rd, Hilliard, OH 43026',
    allergies: [],
  },
  {
    mrn: '20418813',
    name: 'Dorothy Fischer',
    preferred: 'Dot',
    born: '1959-03-03',
    sex: 'F',
    payer: 'Medicare',
    coverage: {
      plan: 'Medicare Part A and B',
      memberId: '6HN2-QE4-XA91',
      eligibility: 'active',
      verified: '2026-03-11',
    },
    phone: '(614) 555-0168',
    address: '14 Grandview Ave, Grandview Heights, OH 43212',
    allergies: ['Penicillins', 'Sulfa drugs'],
  },
  {
    mrn: '20418814',
    name: 'Tyrone Jackson',
    born: '1997-07-07',
    sex: 'M',
    payer: 'Medicaid',
    coverage: {
      plan: 'Ohio Medicaid',
      memberId: '910081127745',
      eligibility: 'pending',
      verified: '2026-03-12',
    },
    phone: '(614) 555-0121',
    address: '402 Parsons Ave, Columbus, OH 43206',
    allergies: [],
  },
  {
    mrn: '20418815',
    name: 'Emily Sato',
    born: '1986-12-01',
    sex: 'F',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual PPO',
      memberId: 'CMP339018276',
      group: 'G-40217',
      eligibility: 'active',
      verified: '2026-03-10',
    },
    phone: '(614) 555-0155',
    address: '33 Northwest Blvd, Columbus, OH 43212',
    allergies: [],
  },
  {
    mrn: '20418816',
    name: 'Ahmed Hassan',
    born: '1972-06-16',
    sex: 'M',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual HMO',
      memberId: 'CMH908127734',
      group: 'G-11802',
      eligibility: 'inactive',
      verified: '2026-03-12',
    },
    phone: '(614) 555-0179',
    address: '88 Morse Rd, Columbus, OH 43229',
    allergies: ['Iodinated contrast'],
  },
  {
    mrn: '20418817',
    name: 'Hannah Goldberg',
    born: '2004-09-29',
    sex: 'F',
    payer: 'Commercial',
    coverage: {
      plan: 'Cardinal Mutual PPO',
      memberId: 'CMP552087190',
      group: 'G-20554',
      eligibility: 'active',
      verified: '2026-03-09',
    },
    phone: '(614) 555-0138',
    address: '27 Winter St, Delaware, OH 43015',
    allergies: [],
  },
  {
    mrn: '20418818',
    name: 'Walter Begay',
    born: '1965-11-21',
    sex: 'M',
    payer: 'Medicare',
    coverage: {
      plan: 'Medicare Part A and B',
      memberId: '2CR5-YK7-UM34',
      eligibility: 'active',
      verified: '2026-03-06',
    },
    phone: '(614) 555-0184',
    address: '6 Diley Rd, Pickerington, OH 43147',
    allergies: ['Codeine'],
  },
];

/** The outpatient departments that book appointments. */
export const departments = [
  'Family Medicine',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Ophthalmology',
];

/**
 * Departments grouped the way the hospital lists them, which is how the visit
 * form presents them: two named groups read as a choice, one long menu reads
 * as a scroll.
 */
export const departmentGroups = [
  { label: 'Primary care', departments: ['Family Medicine', 'Pediatrics'] },
  { label: 'Specialty care', departments: ['Cardiology', 'Orthopedics', 'Ophthalmology'] },
];

/**
 * The languages an interpreter can be booked in. A plain-text list long enough
 * that a user types the first letter to reach theirs, with the few most asked
 * for at this clinic first.
 */
export const languageGroups = [
  {
    label: 'Most requested',
    languages: ['English', 'Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Arabic'],
  },
  {
    label: 'Other languages',
    languages: [
      'American Sign Language',
      'Amharic',
      'Bengali',
      'Cantonese',
      'Farsi',
      'French',
      'Haitian Creole',
      'Hindi',
      'Japanese',
      'Korean',
      'Polish',
      'Portuguese',
      'Punjabi',
      'Russian',
      'Somali',
      'Ukrainian',
      'Urdu',
    ],
  },
];

/**
 * A slice of ICD-10-CM, which is the case a combobox exists for: a clinician
 * knows the first letters and the full code set is far too long to scroll.
 */
export const diagnoses = [
  { code: 'J06.9', label: 'Acute upper respiratory infection, unspecified' },
  { code: 'J20.9', label: 'Acute bronchitis, unspecified' },
  { code: 'J45.901', label: 'Unspecified asthma with (acute) exacerbation' },
  { code: 'A09', label: 'Infectious gastroenteritis and colitis, unspecified' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
  { code: 'I25.10', label: 'Atherosclerotic heart disease of native coronary artery' },
  { code: 'I48.91', label: 'Unspecified atrial fibrillation' },
  { code: 'R07.9', label: 'Chest pain, unspecified' },
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
  { code: 'E78.5', label: 'Hyperlipidemia, unspecified' },
  { code: 'G43.909', label: 'Migraine, unspecified, not intractable' },
  { code: 'H10.9', label: 'Unspecified conjunctivitis' },
  { code: 'H25.9', label: 'Unspecified age-related cataract' },
  { code: 'M17.11', label: 'Unilateral primary osteoarthritis, right knee' },
  { code: 'M54.50', label: 'Low back pain, unspecified' },
  { code: 'R50.9', label: 'Fever, unspecified' },
  { code: 'Z00.00', label: 'General adult medical examination without abnormal findings' },
  { code: 'Z00.129', label: 'Routine child health examination without abnormal findings' },
];

/** The providers who take appointments in each department. */
export const providers: Record<string, string[]> = {
  'Family Medicine': ['Andrew Park, MD', 'Grace Adeyemi, DO'],
  Pediatrics: ['Rachel Levin, MD'],
  Cardiology: ['Luis Herrera, MD'],
  Orthopedics: ['Thomas Brennan, MD'],
  Ophthalmology: ['Mei Zhao, MD'],
};

export const encounters: Encounter[] = [
  {
    id: '7720401',
    mrn: '20418801',
    at: '2026-03-12 07:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Andrew Park, MD',
    reason: 'Cough for 2 weeks',
    status: 'completed',
  },
  {
    id: '7720402',
    mrn: '20418802',
    at: '2026-03-12 08:00',
    type: 'Outpatient',
    department: 'Orthopedics',
    provider: 'Thomas Brennan, MD',
    reason: 'Right knee pain after a fall',
    status: 'in-progress',
  },
  {
    id: '7720403',
    mrn: '20418803',
    at: '2026-03-12 08:15',
    type: 'Outpatient',
    department: 'Pediatrics',
    provider: 'Rachel Levin, MD',
    reason: 'Fever for 3 days',
    status: 'in-progress',
  },
  {
    id: '7720404',
    mrn: '20418804',
    at: '2026-03-12 09:00',
    type: 'Outpatient',
    department: 'Ophthalmology',
    provider: 'Mei Zhao, MD',
    reason: 'Cataract follow-up',
    status: 'scheduled',
  },
  {
    id: '7720405',
    mrn: '20418805',
    at: '2026-03-12 09:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Grace Adeyemi, DO',
    reason: 'Hypertension follow-up',
    status: 'scheduled',
  },
  {
    id: '7720406',
    mrn: '20418806',
    at: '2026-03-12 10:00',
    type: 'Outpatient',
    department: 'Cardiology',
    provider: 'Luis Herrera, MD',
    reason: 'Chest pain on exertion',
    status: 'scheduled',
  },
  {
    id: '7720407',
    mrn: '20418807',
    at: '2026-03-12 10:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Andrew Park, MD',
    reason: 'Pre-employment physical',
    status: 'canceled',
  },
  {
    id: '7720408',
    mrn: '20418808',
    at: '2026-03-12 11:00',
    type: 'Outpatient',
    department: 'Cardiology',
    provider: 'Luis Herrera, MD',
    reason: 'Atrial fibrillation follow-up',
    status: 'scheduled',
  },
  {
    id: '7720409',
    mrn: '20418809',
    at: '2026-03-12 11:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Grace Adeyemi, DO',
    reason: 'Migraine follow-up',
    status: 'scheduled',
  },
  {
    id: '7720410',
    mrn: '20418810',
    at: '2026-03-12 12:00',
    type: 'Outpatient',
    department: 'Cardiology',
    provider: 'Luis Herrera, MD',
    reason: 'Follow-up after a coronary stent',
    status: 'scheduled',
  },
  {
    id: '7720411',
    mrn: '20418811',
    at: '2026-03-12 12:30',
    type: 'Outpatient',
    department: 'Pediatrics',
    provider: 'Rachel Levin, MD',
    reason: 'Well-child visit, 6 years',
    status: 'scheduled',
  },
  {
    id: '7720412',
    mrn: '20418812',
    at: '2026-03-12 13:00',
    type: 'Outpatient',
    department: 'Orthopedics',
    provider: 'Thomas Brennan, MD',
    reason: 'Low back pain',
    status: 'scheduled',
  },
  {
    id: '7720413',
    mrn: '20418813',
    at: '2026-03-12 13:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Andrew Park, MD',
    reason: 'Diabetes follow-up, A1c review',
    status: 'in-progress',
  },
  {
    id: '7720414',
    mrn: '20418814',
    at: '2026-03-12 14:00',
    type: 'Outpatient',
    department: 'Ophthalmology',
    provider: 'Mei Zhao, MD',
    reason: 'Red eye for 3 days',
    status: 'scheduled',
  },
  {
    id: '7720415',
    mrn: '20418815',
    at: '2026-03-12 14:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Grace Adeyemi, DO',
    reason: 'Annual physical',
    status: 'scheduled',
  },
  {
    id: '7720416',
    mrn: '20418816',
    at: '2026-03-12 15:00',
    type: 'Outpatient',
    department: 'Orthopedics',
    provider: 'Thomas Brennan, MD',
    reason: 'Post-op visit, knee arthroscopy',
    status: 'canceled',
  },
  {
    id: '7720417',
    mrn: '20418817',
    at: '2026-03-12 15:30',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Andrew Park, MD',
    reason: 'Sports physical',
    status: 'scheduled',
  },
  {
    id: '7720418',
    mrn: '20418818',
    at: '2026-03-12 16:00',
    type: 'Outpatient',
    department: 'Cardiology',
    provider: 'Luis Herrera, MD',
    reason: 'Shortness of breath on exertion',
    status: 'scheduled',
  },
  {
    id: '7719022',
    mrn: '20418801',
    at: '2026-02-04 08:10',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Andrew Park, MD',
    reason: 'Cough follow-up',
    status: 'completed',
  },
  {
    id: '7718340',
    mrn: '20418801',
    at: '2025-12-19 21:40',
    type: 'Emergency',
    department: 'Emergency Department',
    provider: 'Samuel Ortiz, MD',
    reason: 'Fever and chills',
    acuity: 4,
    status: 'completed',
  },
  {
    id: '7718512',
    mrn: '20418803',
    at: '2026-01-08 18:20',
    type: 'Inpatient',
    department: '3 North Pediatrics',
    provider: 'Nadia Rahman, MD',
    reason: 'Asthma exacerbation',
    status: 'completed',
  },
  {
    id: '7718507',
    mrn: '20418803',
    at: '2026-01-08 15:05',
    type: 'Emergency',
    department: 'Emergency Department',
    provider: 'Samuel Ortiz, MD',
    reason: 'Wheezing, short of breath',
    acuity: 2,
    status: 'completed',
  },
  {
    id: '7719310',
    mrn: '20418805',
    at: '2026-02-18 10:00',
    type: 'Outpatient',
    department: 'Family Medicine',
    provider: 'Grace Adeyemi, DO',
    reason: 'Hypertension follow-up',
    status: 'completed',
  },
  {
    id: '7718840',
    mrn: '20418806',
    at: '2026-01-21 23:05',
    type: 'Observation',
    department: '5 East Telemetry',
    provider: 'Nadia Rahman, MD',
    reason: 'Chest pain, rule out acute coronary syndrome',
    status: 'completed',
  },
  {
    id: '7718855',
    mrn: '20418806',
    at: '2026-01-29 09:15',
    type: 'Outpatient',
    department: 'Cardiology',
    provider: 'Luis Herrera, MD',
    reason: 'Follow-up after an observation stay',
    status: 'completed',
  },
];

/** One row of a flowsheet, so a patient's three read as a column of numbers. */
const vital = (
  at: string,
  systolic: number,
  diastolic: number,
  pulse: number,
  temperature: number,
  spo2: number,
  weight: number,
): Vital => ({ at, systolic, diastolic, pulse, temperature, spo2, weight });

const LAST = '2026-03-12 07:35';
const BEFORE = '2026-02-04 08:10';
const FIRST = '2025-12-19 09:00';

export const vitals: Record<string, Vital[]> = {
  '20418801': [
    vital(LAST, 118, 76, 72, 98.2, 98, 128.7),
    vital(BEFORE, 122, 80, 78, 97.9, 97, 129.9),
    vital(FIRST, 130, 84, 96, 101.3, 96, 131.4),
  ],
  '20418802': [
    vital(LAST, 124, 70, 87, 98.8, 98, 201.5),
    vital(BEFORE, 127, 71, 87, 98.4, 98, 202.3),
    vital(FIRST, 128, 78, 87, 99.3, 97, 203.0),
  ],
  '20418803': [
    vital(LAST, 104, 66, 112, 101.8, 97, 52.4),
    vital(BEFORE, 100, 62, 98, 98.6, 98, 51.8),
    vital(FIRST, 102, 64, 96, 98.4, 98, 50.9),
  ],
  '20418804': [
    vital(LAST, 127, 69, 66, 99.0, 97, 176.4),
    vital(BEFORE, 131, 73, 70, 99.5, 97, 177.8),
    vital(FIRST, 133, 73, 76, 99.1, 96, 177.6),
  ],
  '20418805': [
    vital(LAST, 138, 88, 84, 98.8, 99, 162.0),
    vital(BEFORE, 144, 92, 86, 99.1, 99, 163.1),
    vital(FIRST, 151, 96, 88, 99.7, 98, 163.8),
  ],
  '20418806': [
    vital(LAST, 139, 84, 82, 99.1, 97, 214.2),
    vital(BEFORE, 141, 87, 85, 99.0, 96, 215.6),
    vital(FIRST, 153, 90, 92, 98.8, 96, 218.0),
  ],
  '20418807': [
    vital(LAST, 112, 72, 76, 98.2, 99, 141.3),
    vital(BEFORE, 116, 74, 80, 99.1, 99, 142.0),
    vital(FIRST, 114, 70, 78, 99.5, 98, 143.9),
  ],
  '20418808': [
    vital(LAST, 134, 80, 87, 98.1, 95, 189.6),
    vital(BEFORE, 138, 84, 104, 97.7, 95, 190.4),
    vital(FIRST, 140, 84, 92, 98.4, 96, 192.8),
  ],
  '20418809': [
    vital(LAST, 120, 75, 62, 98.6, 99, 151.2),
    vital(BEFORE, 127, 76, 65, 99.5, 98, 152.6),
    vital(FIRST, 124, 78, 68, 98.2, 99, 152.0),
  ],
  '20418810': [
    vital(LAST, 144, 78, 65, 97.5, 97, 223.4),
    vital(BEFORE, 146, 79, 69, 97.7, 97, 224.1),
    vital(FIRST, 152, 80, 65, 99.3, 96, 226.8),
  ],
  '20418811': [
    vital(LAST, 98, 60, 96, 97.7, 99, 46.3),
    vital(BEFORE, 96, 58, 100, 98.1, 99, 45.6),
    vital(FIRST, 98, 62, 104, 97.9, 99, 44.8),
  ],
  '20418812': [
    vital(LAST, 124, 82, 63, 99.0, 98, 187.1),
    vital(BEFORE, 128, 85, 68, 99.3, 98, 188.9),
    vital(FIRST, 126, 88, 65, 98.2, 98, 188.6),
  ],
  '20418813': [
    vital(LAST, 138, 90, 94, 99.3, 96, 168.4),
    vital(BEFORE, 141, 92, 98, 98.4, 96, 170.2),
    vital(FIRST, 142, 96, 100, 97.9, 95, 171.7),
  ],
  '20418814': [
    vital(LAST, 126, 80, 84, 97.5, 98, 195.3),
    vital(BEFORE, 130, 82, 87, 98.8, 98, 197.5),
    vital(FIRST, 130, 88, 94, 98.1, 97, 198.8),
  ],
  '20418815': [
    vital(LAST, 116, 72, 70, 98.4, 99, 136.7),
    vital(BEFORE, 118, 74, 72, 98.2, 99, 137.2),
    vital(FIRST, 122, 76, 74, 99.7, 99, 138.4),
  ],
  '20418816': [
    vital(LAST, 141, 94, 91, 99.5, 97, 170.4),
    vital(BEFORE, 147, 96, 91, 97.3, 97, 172.8),
    vital(FIRST, 155, 96, 99, 99.1, 96, 172.0),
  ],
  '20418817': [
    vital(LAST, 110, 70, 68, 97.9, 99, 129.0),
    vital(BEFORE, 112, 72, 70, 97.5, 99, 128.3),
    vital(FIRST, 108, 68, 72, 97.7, 99, 127.6),
  ],
  '20418818': [
    vital(LAST, 136, 66, 90, 97.7, 93, 165.3),
    vital(BEFORE, 143, 67, 94, 97.5, 94, 167.1),
    vital(FIRST, 148, 74, 90, 99.3, 94, 166.4),
  ],
};

export const statusLabel = {
  scheduled: 'Scheduled',
  'in-progress': 'In progress',
  completed: 'Completed',
  canceled: 'Canceled',
} as const;

/** The encounter status ramp, mapped once so no screen invents its own colours. */
export const statusTone = {
  scheduled: 'neutral',
  'in-progress': 'info',
  completed: 'success',
  canceled: 'danger',
} as const;

export const eligibilityTone = {
  active: 'success',
  pending: 'warning',
  inactive: 'danger',
} as const;

/** Government programs read differently from a plan the patient bought. */
export const payerTone = {
  Medicare: 'info',
  Medicaid: 'info',
  Commercial: 'neutral',
  'Self-pay': 'neutral',
} as const;

/**
 * A stored timestamp as a local `Date`. A date-only ISO string would otherwise
 * be read as UTC midnight, which is the previous evening anywhere in the US.
 */
const local = (at: string) => new Date(at.length === 10 ? `${at}T00:00` : at.replace(' ', 'T'));

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const dobFormat = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});
const shortDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/** `Mar 12, 2026` */
export const formatDate = (at: string) => dateFormat.format(local(at));
/** `7:30 AM` */
export const formatTime = (at: string) => timeFormat.format(local(at));
/** `Mar 12, 2026, 7:30 AM` */
export const formatDateTime = (at: string) => `${formatDate(at)}, ${formatTime(at)}`;
/** `Mar 12`, for a chart axis. */
export const formatShortDate = (at: string) => shortDateFormat.format(local(at));
/** `04/11/1988`, the way a date of birth is written on a US form. */
export const formatDob = (born: string) => dobFormat.format(local(born));

export const celsius = (fahrenheit: number) => (((fahrenheit - 32) * 5) / 9).toFixed(1);

export const age = (born: string, today = local(TODAY)) => {
  const b = local(born);
  let years = today.getFullYear() - b.getFullYear();
  const monthDiff = today.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < b.getDate())) years -= 1;
  return years;
};

/**
 * The index entries of documents filed to a chart: a lab report, a referral
 * letter, an image. Only the entries — the example app holds no files.
 */
export interface PatientDocument {
  id: string;
  mrn: string;
  /** The file's name as it was filed. */
  name: string;
  kind: 'document' | 'image';
  /** What the document is, in the chart's words. */
  type: string;
  format: 'PDF' | 'PNG';
  size: string;
  filed: string;
  author: string;
}

export const documents: PatientDocument[] = [
  {
    id: 'DOC-30117',
    mrn: '20418801',
    name: 'cbc-ACC-8801-2026-03-12.pdf',
    kind: 'document',
    type: 'Lab report',
    format: 'PDF',
    size: '214 kB',
    filed: '2026-03-12 08:40',
    author: 'Clinical Laboratory',
  },
  {
    id: 'DOC-29854',
    mrn: '20418801',
    name: 'referral-letter-pulmonology-andrew-park-md-2026-02-04.pdf',
    kind: 'document',
    type: 'Referral letter',
    format: 'PDF',
    size: '88 kB',
    filed: '2026-02-04 09:05',
    author: 'Andrew Park, MD',
  },
  {
    id: 'DOC-29102',
    mrn: '20418801',
    name: 'chest-xray-pa-lateral-2025-12-19.png',
    kind: 'image',
    type: 'Chest X-ray',
    format: 'PNG',
    size: '1.2 MB',
    filed: '2025-12-19 22:15',
    author: 'Samuel Ortiz, MD',
  },
  {
    id: 'DOC-29377',
    mrn: '20418803',
    name: 'discharge-summary-3-north-pediatrics-2026-01-09.pdf',
    kind: 'document',
    type: 'Discharge summary',
    format: 'PDF',
    size: '132 kB',
    filed: '2026-01-09 11:20',
    author: 'Nadia Rahman, MD',
  },
  {
    id: 'DOC-29361',
    mrn: '20418803',
    name: 'chest-xray-ap-2026-01-08.png',
    kind: 'image',
    type: 'Chest X-ray',
    format: 'PNG',
    size: '940 kB',
    filed: '2026-01-08 16:10',
    author: 'Emergency Department',
  },
];

/**
 * A laboratory order: one accession, several resulted components. `loinc` is
 * the component's LOINC code, `reference` the interval as the laboratory
 * prints it, and `flag` is what the laboratory decided — not something a
 * screen recomputes, because the interval depends on age, sex and method and
 * none of that is in this file.
 */
export interface LabResult {
  id: string;
  mrn: string;
  at: string;
  panel: string;
  orderedBy: string;
  status: 'pending' | 'resulted';
  rows: {
    name: string;
    loinc: string;
    value: string;
    unit: string;
    reference: string;
    flag: 'normal' | 'high' | 'low' | 'abnormal';
  }[];
}

export const labResults: LabResult[] = [
  {
    id: 'ACC-8801',
    mrn: '20418801',
    at: '2026-03-12 08:05',
    panel: 'CBC without differential',
    orderedBy: 'Andrew Park, MD',
    status: 'resulted',
    rows: [
      {
        name: 'Hemoglobin',
        loinc: '718-7',
        value: '11.8',
        unit: 'g/dL',
        reference: '12.0 – 15.5',
        flag: 'low',
      },
      {
        name: 'WBC',
        loinc: '6690-2',
        value: '9.4',
        unit: 'K/µL',
        reference: '4.0 – 11.0',
        flag: 'normal',
      },
      {
        name: 'Platelets',
        loinc: '777-3',
        value: '268',
        unit: 'K/µL',
        reference: '150 – 400',
        flag: 'normal',
      },
      {
        name: 'Hematocrit',
        loinc: '4544-3',
        value: '35.1',
        unit: '%',
        reference: '36.0 – 46.0',
        flag: 'low',
      },
    ],
  },
  {
    id: 'ACC-8802',
    mrn: '20418805',
    at: '2026-03-12 09:40',
    panel: 'Lipid panel',
    orderedBy: 'Grace Adeyemi, DO',
    status: 'resulted',
    rows: [
      {
        name: 'Cholesterol, total',
        loinc: '2093-3',
        value: '232',
        unit: 'mg/dL',
        reference: '< 200',
        flag: 'high',
      },
      {
        name: 'HDL cholesterol',
        loinc: '2085-9',
        value: '58',
        unit: 'mg/dL',
        reference: '> 50',
        flag: 'normal',
      },
      {
        name: 'LDL cholesterol, calculated',
        loinc: '13457-7',
        value: '146',
        unit: 'mg/dL',
        reference: '< 100',
        flag: 'high',
      },
      {
        name: 'Triglycerides',
        loinc: '2571-8',
        value: '141',
        unit: 'mg/dL',
        reference: '< 150',
        flag: 'normal',
      },
    ],
  },
  {
    id: 'ACC-8803',
    mrn: '20418806',
    at: '2026-03-12 10:15',
    panel: 'Troponin I, high sensitivity',
    orderedBy: 'Luis Herrera, MD',
    status: 'pending',
    rows: [],
  },
  {
    id: 'ACC-8804',
    mrn: '20418803',
    at: '2026-03-12 08:50',
    panel: 'Urinalysis, dipstick',
    orderedBy: 'Rachel Levin, MD',
    status: 'resulted',
    rows: [
      {
        name: 'Color',
        loinc: '5778-6',
        value: 'Yellow',
        unit: '',
        reference: 'Yellow',
        flag: 'normal',
      },
      {
        name: 'pH',
        loinc: '5803-2',
        value: '6.0',
        unit: '',
        reference: '5.0 – 8.0',
        flag: 'normal',
      },
      {
        name: 'Protein',
        loinc: '20454-5',
        value: 'Negative',
        unit: '',
        reference: 'Negative',
        flag: 'normal',
      },
      {
        name: 'Leukocyte esterase',
        loinc: '5799-2',
        value: 'Positive (1+)',
        unit: '',
        reference: 'Negative',
        flag: 'abnormal',
      },
    ],
  },
  {
    id: 'ACC-8805',
    mrn: '20418813',
    at: '2026-03-11 14:20',
    panel: 'Glucose, fasting, with hemoglobin A1c',
    orderedBy: 'Andrew Park, MD',
    status: 'resulted',
    rows: [
      {
        name: 'Glucose, fasting',
        loinc: '1558-6',
        value: '148',
        unit: 'mg/dL',
        reference: '70 – 99',
        flag: 'high',
      },
      {
        name: 'Hemoglobin A1c',
        loinc: '4548-4',
        value: '7.4',
        unit: '%',
        reference: '< 5.7',
        flag: 'high',
      },
    ],
  },
  {
    id: 'ACC-8806',
    mrn: '20418810',
    at: '2026-03-11 11:05',
    panel: 'Basic metabolic panel',
    orderedBy: 'Luis Herrera, MD',
    status: 'resulted',
    rows: [
      {
        name: 'Sodium',
        loinc: '2951-2',
        value: '139',
        unit: 'mmol/L',
        reference: '135 – 145',
        flag: 'normal',
      },
      {
        name: 'Potassium',
        loinc: '2823-3',
        value: '4.6',
        unit: 'mmol/L',
        reference: '3.5 – 5.1',
        flag: 'normal',
      },
      {
        name: 'BUN',
        loinc: '3094-0',
        value: '18',
        unit: 'mg/dL',
        reference: '7 – 20',
        flag: 'normal',
      },
      {
        name: 'Creatinine',
        loinc: '2160-0',
        value: '1.42',
        unit: 'mg/dL',
        reference: '0.74 – 1.35',
        flag: 'high',
      },
      {
        name: 'eGFR',
        loinc: '98979-8',
        value: '58',
        unit: 'mL/min/1.73 m²',
        reference: '≥ 60',
        flag: 'low',
      },
    ],
  },
];

/**
 * One line of pharmacy inventory, named the way RxNorm names a clinical drug.
 * `par` is the level the pharmacy restocks at; `cost` is the acquisition cost
 * per dispensing unit, in US dollars.
 */
export interface Medication {
  code: string;
  name: string;
  form: 'Tablet' | 'Capsule' | 'Inhaler' | 'Injection' | 'Cream';
  bin: string;
  stock: number;
  par: number;
  expires: string;
  cost: number;
}

export const medications: Medication[] = [
  {
    code: 'RX-1001',
    name: 'acetaminophen 500 MG Oral Tablet',
    form: 'Tablet',
    bin: 'A1',
    stock: 1840,
    par: 400,
    expires: '2027-08-31',
    cost: 0.02,
  },
  {
    code: 'RX-1002',
    name: 'amoxicillin 500 MG Oral Capsule',
    form: 'Capsule',
    bin: 'A2',
    stock: 260,
    par: 300,
    expires: '2026-11-30',
    cost: 0.14,
  },
  {
    code: 'RX-1003',
    name: 'amlodipine 10 MG Oral Tablet',
    form: 'Tablet',
    bin: 'B1',
    stock: 720,
    par: 250,
    expires: '2027-02-28',
    cost: 0.04,
  },
  {
    code: 'RX-1004',
    name: 'metformin hydrochloride 500 MG Oral Tablet',
    form: 'Tablet',
    bin: 'B2',
    stock: 148,
    par: 300,
    expires: '2026-09-30',
    cost: 0.03,
  },
  {
    code: 'RX-1005',
    name: 'albuterol 0.09 MG/ACTUAT Metered Dose Inhaler',
    form: 'Inhaler',
    bin: 'C1',
    stock: 62,
    par: 40,
    expires: '2026-06-30',
    cost: 28.5,
  },
  {
    code: 'RX-1006',
    name: 'ceftriaxone 1000 MG Injection',
    form: 'Injection',
    bin: 'D1',
    stock: 34,
    par: 50,
    expires: '2026-05-31',
    cost: 2.85,
  },
  {
    code: 'RX-1007',
    name: 'dexamethasone 4 MG Oral Tablet',
    form: 'Tablet',
    bin: 'B3',
    stock: 980,
    par: 200,
    expires: '2027-04-30',
    cost: 0.18,
  },
  {
    code: 'RX-1008',
    name: 'hydrocortisone 1 % Topical Cream',
    form: 'Cream',
    bin: 'C2',
    stock: 0,
    par: 25,
    expires: '2026-12-31',
    cost: 3.4,
  },
  {
    code: 'RX-1009',
    name: 'omeprazole 20 MG Delayed Release Oral Capsule',
    form: 'Capsule',
    bin: 'A3',
    stock: 410,
    par: 150,
    expires: '2027-01-31',
    cost: 0.09,
  },
  {
    code: 'RX-1010',
    name: 'famotidine 20 MG Oral Tablet',
    form: 'Tablet',
    bin: 'A4',
    stock: 96,
    par: 150,
    expires: '2026-04-30',
    cost: 0.06,
  },
  {
    code: 'RX-1011',
    name: 'atorvastatin 40 MG Oral Tablet',
    form: 'Tablet',
    bin: 'B4',
    stock: 530,
    par: 200,
    expires: '2027-06-30',
    cost: 0.07,
  },
  {
    code: 'RX-1012',
    name: 'furosemide 40 MG Oral Tablet',
    form: 'Tablet',
    bin: 'B5',
    stock: 212,
    par: 120,
    expires: '2026-10-31',
    cost: 0.03,
  },
];

/** Encounters closed per month, for the summary page. Twelve months to March 2026. */
export const monthlyEncounters = [
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

/** How today's appointments split across the departments, one chart series each. */
export const departmentLoad = [
  { department: 'Family Medicine', today: 42, series: 1 as const },
  { department: 'Pediatrics', today: 27, series: 2 as const },
  { department: 'Cardiology', today: 9, series: 3 as const },
  { department: 'Orthopedics', today: 18, series: 4 as const },
  { department: 'Ophthalmology', today: 12, series: 5 as const },
];

/** The midnight census of each inpatient unit, for the summary's capacity row. */
export const units = [
  { name: '4 West Med-Surg', beds: 24, used: 21 },
  { name: '5 East Telemetry', beds: 18, used: 11 },
  { name: '3 North Pediatrics', beds: 30, used: 30 },
  { name: 'Medical ICU', beds: 8, used: 6 },
];

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** `$28.50` */
export const usd = (value: number) => dollars.format(value);

export const flagLabel = {
  normal: 'Normal',
  high: 'High',
  low: 'Low',
  abnormal: 'Abnormal',
} as const;

/** The lab flag ramp, mapped once so no screen invents its own colours. */
export const flagTone = {
  normal: 'success',
  high: 'danger',
  low: 'warning',
  abnormal: 'danger',
} as const;
