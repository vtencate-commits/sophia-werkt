export type CaseStatus =
  | 'INTAKE'
  | 'DOCUMENTS_RECEIVED'
  | 'AI_ANALYSIS_PENDING'
  | 'AI_ANALYSIS_COMPLETE'
  | 'LAWYER_REVIEW'
  | 'ADVICE_DRAFT'
  | 'ADVICE_FINAL'
  | 'DELIVERED'
  | 'FOLLOW_UP'
  | 'CLOSED'
  | 'ARCHIVED';

export type AdviceType =
  | 'VSO_REVIEW'
  | 'VSO_NEGOTIATION'
  | 'DISMISSAL_ADVICE'
  | 'LABOR_DISPUTE'
  | 'NON_COMPETE_CHECK'
  | 'OTHER';

export type FeeType = 'FIXED' | 'HOURLY';

export interface CreateCaseRequest {
  title: string;
  description?: string;
  adviceType: AdviceType;
  employerName?: string;
  employerKvk?: string;
  clientNotes?: string;
  caoReference?: string;
}

export interface UpdateCaseRequest {
  title?: string;
  description?: string;
  status?: CaseStatus;
  feeType?: FeeType;
  feeAmount?: number;
  employerName?: string;
  employerKvk?: string;
  conflictNotes?: string;
  clientNotes?: string;
  caoReference?: string;
}

export interface CaseSummary {
  id: string;
  referenceNumber: string;
  title: string;
  adviceType: AdviceType;
  status: CaseStatus;
  feeType: FeeType;
  feeAmount: number;
  clientName: string;
  lawyerName?: string;
  unreadMessages: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDetail extends CaseSummary {
  description?: string;
  employerName?: string;
  employerKvk?: string;
  conflictChecked: boolean;
  conflictFound: boolean;
  conflictNotes?: string;
  clientNotes?: string;
  caoReference?: string;
  aiAnalysisHtml?: string;
  aiAnalysisAt?: string;
  adviceDraft?: string;
  adviceFinal?: string;
  adviceApprovedAt?: string;
  adviceDeliveredAt?: string;
}

export interface CaseTimelineEntry {
  id: string;
  fromStatus?: CaseStatus;
  toStatus: CaseStatus;
  changedBy?: string;
  notes?: string;
  createdAt: string;
}
