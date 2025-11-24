import { Course, MiscFee } from '../types';

const standardMiscFees: MiscFee[] = [
    { id: 're-exam', name: 'Re-Examination Fee (Per module)', amount: 200, category: 'standard' },
    { id: 'deferment', name: 'Deferment Fee (Per module)', amount: 500, category: 'standard' },
    { id: 're-module', name: 'Re-Module Fee (Per module)', amount: 700, category: 'standard' },
    { id: 'course-change', name: 'Course Change Fee', amount: 300, category: 'standard' },
    { id: 'graduation', name: 'Graduation Ceremony Fee', amount: 350, category: 'standard' },
    { id: 'photocopy-a4-bw', name: 'Photocopying A4 B&W (per page)', amount: 0.10, isPerUnit: true, category: 'standard' },
    { id: 'photocopy-a4-color', name: 'Photocopying A4 Color (per page)', amount: 0.30, isPerUnit: true, category: 'standard' },
    { id: 'photocopy-a3-bw', name: 'Photocopying A3 B&W (per page)', amount: 0.20, isPerUnit: true, category: 'standard' },
    { id: 'photocopy-a3-color', name: 'Photocopying A3 Color (per page)', amount: 0.50, isPerUnit: true, category: 'standard' },
    { id: 'printing-a4-bw', name: 'Printing A4 B&W (per page)', amount: 1, isPerUnit: true, category: 'standard' },
    { id: 'printing-a4-color', name: 'Printing A4 Color (per page)', amount: 0.5, isPerUnit: true, category: 'standard' },
    { id: 'printing-a3-bw', name: 'Printing A3 B&W (per page)', amount: 2, isPerUnit: true, category: 'standard' },
    { id: 'printing-a3-color', name: 'Printing A3 Color (per page)', amount: 1, isPerUnit: true, category: 'standard' }, // Note: PDF says "1 per A3 page" for download/print, but also "0.50 per A3 page" for photocopying. Assuming "1" for printing is correct.
    { id: 't-shirt', name: 'UCC T-shirt', amount: 20, isPerUnit: true, category: 'service' },
    { id: 'guardian', name: 'Guardian Arrangement Admin Fee', amount: 100, notes: 'Non-refundable', category: 'service' },
    { id: 'airport-pickup', name: 'Airport Pick-up Service', amount: 180, notes: 'Non-refundable', category: 'service' },
    { id: 'hpb-fee', name: 'Health Promotion Board (HPB) Application Fee', amount: 300, notes: 'Non-refundable', category: 'service' },
];

export const courseData: Course[] = [
  {
    id: 'aeis-p2', name: 'Preparatory Course for AEIS - Primary 2', abbreviation: 'AEISP2', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-p3', name: 'Preparatory Course for AEIS - Primary 3', abbreviation: 'AEISP3', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-p4', name: 'Preparatory Course for AEIS - Primary 4', abbreviation: 'AEISP4', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-p5', name: 'Preparatory Course for AEIS - Primary 5', abbreviation: 'AEISP5', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-s1', name: 'Preparatory Course for AEIS - Secondary 1', abbreviation: 'AEISS1', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-s2', name: 'Preparatory Course for AEIS - Secondary 2', abbreviation: 'AEISS2', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'aeis-s3', name: 'Preparatory Course for AEIS - Secondary 3', abbreviation: 'AEISS3', durationMonths: 6, modules: 2,
    fees: { application: { local: 150, international: 400 }, course: 9500, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'ielts', name: 'Preparatory Course for IELTS', abbreviation: 'IELTS', durationMonths: 6, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 6460, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel1-ft', name: 'Certificate in English Level 1 (FT)', abbreviation: 'CEL1', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 2480, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel2-ft', name: 'Certificate in English Level 2 (FT)', abbreviation: 'CEL2', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 2480, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel3-ft', name: 'Certificate in English Level 3 (FT)', abbreviation: 'CEL3', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 2480, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel1-pt', name: 'Certificate in English Level 1 (PT)', abbreviation: 'CEL1', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 1488, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel2-pt', name: 'Certificate in English Level 2 (PT)', abbreviation: 'CEL2', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 1488, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel3-pt', name: 'Certificate in English Level 3 (PT)', abbreviation: 'CEL3', durationMonths: 3, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 1488, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cel-ft', name: 'Certificate in English Language (FT)', abbreviation: 'CEL', durationMonths: 6, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 5260, material: 100, examination: 100, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cm', name: 'Certificate in General Management', abbreviation: 'CM', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 5000, material: 200, examination: 200, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cme', name: 'Certificate in General Management (E-Learning)', abbreviation: 'CME', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 5000, material: 200, examination: 200, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cm-m', name: 'Certificate in General Management (Mandarin)', abbreviation: 'CM(M)', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 5000, material: 200, examination: 200, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'cme-m', name: 'Certificate in General Management (Mandarin) (E-Learning)', abbreviation: 'CME(M)', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 5000, material: 200, examination: 200, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dbm', name: 'Diploma in Business Management', abbreviation: 'DBM', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 8400, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dbme', name: 'Diploma in Business Management (E-Learning)', abbreviation: 'DBME', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 8400, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dbm-m', name: 'Diploma in Business Management (Mandarin)', abbreviation: 'DBM(M)', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 8400, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dbme-m', name: 'Diploma in Business Management (Mandarin) (E-Learning)', abbreviation: 'DBME(M)', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 8400, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dthm', name: 'Diploma in Tourism and Hospitality Management', abbreviation: 'DTHM', durationMonths: 6, modules: 6,
    fees: { application: { local: 150, international: 400 }, course: 6300, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dthme', name: 'Diploma in Tourism and Hospitality Management (E-Learning)', abbreviation: 'DTHME', durationMonths: 6, modules: 6,
    fees: { application: { local: 150, international: 400 }, course: 6300, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dthm-m', name: 'Diploma in Tourism and Hospitality Management (Mandarin)', abbreviation: 'DTHM(M)', durationMonths: 6, modules: 6,
    fees: { application: { local: 150, international: 400 }, course: 6300, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'dthme-m', name: 'Diploma in Tourism and Hospitality Management (Mandarin) (E-Learning)', abbreviation: 'DTHME(M)', durationMonths: 6, modules: 6,
    fees: { application: { local: 150, international: 400 }, course: 6300, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'pgc', name: 'Postgraduate Certificate in Business Administration', abbreviation: 'PGC', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 6800, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'pgc-m', name: 'Postgraduate Certificate in Business Administration (Mandarin)', abbreviation: 'PGC(M)', durationMonths: 4, modules: 4,
    fees: { application: { local: 150, international: 400 }, course: 6800, material: 300, examination: 300, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'pgd', name: 'Postgraduate Diploma in Business Administration', abbreviation: 'PGD', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 13600, material: 400, examination: 400, administrative: 150 },
    miscFees: standardMiscFees
  },
  {
    id: 'pgd-m', name: 'Postgraduate Diploma in Business Administration (Mandarin)', abbreviation: 'PGD(M)', durationMonths: 8, modules: 8,
    fees: { application: { local: 150, international: 400 }, course: 13600, material: 400, examination: 400, administrative: 150 },
    miscFees: standardMiscFees
  }
];
