export interface MessageInfo {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  body: string;
  isRead: boolean;
  readAt?: string;
  attachmentKey?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  body: string;
  attachmentKey?: string;
}
