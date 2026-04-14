import type { SendMessageRequest } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

export class MessageService {
  async sendMessage(caseId: string, userId: string, data: SendMessageRequest): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const message = await prisma.message.create({
      data: {
        caseId,
        senderId: userId,
        body: data.body,
        attachmentKey: data.attachmentKey,
      },
    });

    // Create notification for case participants
    const participants: string[] = [
      caseData.clientId,
      caseData.lawyerId,
    ].filter((id): id is string => id !== null && id !== undefined);

    for (const participantId of participants) {
      if (participantId !== userId) {
        await prisma.notification.create({
          data: {
            userId: participantId,
            type: 'new_message',
            title: 'New message',
            body: `${user.firstName} ${user.lastName} sent a message`,
            referenceType: 'MESSAGE',
            referenceId: message.id,
          },
        });
      }
    }

    return message;
  }

  async getMessages(caseId: string): Promise<any[]> {
    return prisma.message.findMany({
      where: { caseId },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markAsRead(messageId: string): Promise<any> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markCaseMessagesAsRead(caseId: string, userId: string): Promise<any> {
    return prisma.message.updateMany({
      where: {
        caseId,
        senderId: { not: userId },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
