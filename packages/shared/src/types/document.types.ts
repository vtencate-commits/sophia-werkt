export type DocumentCategory =
  | 'EMPLOYMENT_CONTRACT'
  | 'VSO'
  | 'SOCIAL_PLAN'
  | 'CAO'
  | 'PAYSLIP'
  | 'CORRESPONDENCE'
  | 'AI_ANALYSIS'
  | 'LEGAL_ADVICE'
  | 'INVOICE'
  | 'CLIENT_UPLOAD'
  | 'LAWYER_UPLOAD'
  | 'OTHER';

export interface DocumentInfo {
  id: string;
  caseId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  category: DocumentCategory;
  version: number;
  isVisible: boolean;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

export interface UploadDocumentRequest {
  category: DocumentCategory;
  isVisible?: boolean;
}

export interface DocumentDownloadUrl {
  url: string;
  expiresAt: string;
}
