export type NotificationType =
  | 'new_message'
  | 'status_change'
  | 'advice_ready'
  | 'document_uploaded'
  | 'invoice_sent'
  | 'case_assigned';

export interface NotificationInfo {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}
