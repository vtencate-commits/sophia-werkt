import type { CaseStatus } from '../types/case.types';

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  INTAKE: 'Intake',
  DOCUMENTS_RECEIVED: 'Documenten ontvangen',
  AI_ANALYSIS_PENDING: 'AI analyse bezig',
  AI_ANALYSIS_COMPLETE: 'AI analyse gereed',
  LAWYER_REVIEW: 'Advocaat beoordeling',
  ADVICE_DRAFT: 'Advies concept',
  ADVICE_FINAL: 'Advies definitief',
  DELIVERED: 'Afgeleverd',
  FOLLOW_UP: 'Vervolg',
  CLOSED: 'Gesloten',
  ARCHIVED: 'Gearchiveerd',
};

export const CASE_STATUS_ORDER: CaseStatus[] = [
  'INTAKE',
  'DOCUMENTS_RECEIVED',
  'AI_ANALYSIS_PENDING',
  'AI_ANALYSIS_COMPLETE',
  'LAWYER_REVIEW',
  'ADVICE_DRAFT',
  'ADVICE_FINAL',
  'DELIVERED',
  'FOLLOW_UP',
  'CLOSED',
  'ARCHIVED',
];

export const ACTIVE_CASE_STATUSES: CaseStatus[] = [
  'INTAKE',
  'DOCUMENTS_RECEIVED',
  'AI_ANALYSIS_PENDING',
  'AI_ANALYSIS_COMPLETE',
  'LAWYER_REVIEW',
  'ADVICE_DRAFT',
  'ADVICE_FINAL',
  'DELIVERED',
  'FOLLOW_UP',
];
