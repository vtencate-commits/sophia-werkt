import type { DocumentCategory } from '../types/document.types';

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  EMPLOYMENT_CONTRACT: 'Arbeidsovereenkomst',
  VSO: 'Vaststellingsovereenkomst',
  SOCIAL_PLAN: 'Sociaal plan',
  CAO: 'Cao',
  PAYSLIP: 'Loonstrook',
  CORRESPONDENCE: 'Correspondentie',
  AI_ANALYSIS: 'AI analyse',
  LEGAL_ADVICE: 'Juridisch advies',
  INVOICE: 'Factuur',
  CLIENT_UPLOAD: 'Geupload door client',
  LAWYER_UPLOAD: 'Geupload door advocaat',
  OTHER: 'Overig',
};

export const CLIENT_UPLOADABLE_CATEGORIES: DocumentCategory[] = [
  'EMPLOYMENT_CONTRACT',
  'VSO',
  'SOCIAL_PLAN',
  'CAO',
  'PAYSLIP',
  'CORRESPONDENCE',
  'OTHER',
];
