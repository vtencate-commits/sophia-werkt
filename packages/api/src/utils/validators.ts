import { z } from 'zod';

// Auth validators
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorCode: z.string().optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Case validators
export const CreateCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  adviceType: z.enum(['VSO_REVIEW', 'VSO_NEGOTIATION', 'DISMISSAL_ADVICE', 'LABOR_DISPUTE', 'NON_COMPETE_CHECK', 'OTHER']),
  employerName: z.string().optional(),
  employerKvk: z.string().optional(),
  clientNotes: z.string().optional(),
  caoReference: z.string().optional(),
});

export const UpdateCaseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum([
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
  ]).optional(),
  feeType: z.enum(['FIXED', 'HOURLY']).optional(),
  feeAmount: z.number().optional(),
  employerName: z.string().optional(),
  employerKvk: z.string().optional(),
  conflictNotes: z.string().optional(),
  clientNotes: z.string().optional(),
  caoReference: z.string().optional(),
});

// Message validators
export const SendMessageSchema = z.object({
  body: z.string().min(1, 'Message body is required'),
  attachmentKey: z.string().optional(),
});

// Document validators
export const UploadDocumentSchema = z.object({
  category: z.enum([
    'EMPLOYMENT_CONTRACT',
    'VSO',
    'SOCIAL_PLAN',
    'CAO',
    'PAYSLIP',
    'CORRESPONDENCE',
    'AI_ANALYSIS',
    'LEGAL_ADVICE',
    'INVOICE',
    'CLIENT_UPLOAD',
    'LAWYER_UPLOAD',
    'OTHER',
  ]),
  isVisible: z.boolean().optional(),
});

// Invoice validators
export const CreateInvoiceSchema = z.object({
  description: z.string().optional(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    amount: z.number().positive(),
  })),
  dueDate: z.string().optional(),
});

// Time entry validators
export const CreateTimeEntrySchema = z.object({
  date: z.string(),
  durationMinutes: z.number().positive(),
  description: z.string(),
  activityType: z.string(),
  billable: z.boolean().optional(),
});

export const UpdateTimeEntrySchema = z.object({
  date: z.string().optional(),
  durationMinutes: z.number().positive().optional(),
  description: z.string().optional(),
  activityType: z.string().optional(),
  billable: z.boolean().optional(),
});

// AI validators
export const AiAnalysisSchema = z.object({
  skillId: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export const CreateAiSkillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
});

export const UpdateAiSkillSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  systemPrompt: z.string().optional(),
  isActive: z.boolean().optional(),
});
