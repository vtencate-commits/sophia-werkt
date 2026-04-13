import type { NotificationType } from '@sophia-werkt/shared';
import { prisma } from '../config/database';

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    referenceType?: string,
    referenceId?: string
  ): Promise<any> {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        referenceType,
        referenceId,
      },
    });
  }

  async getNotifications(userId: string, limit: number = 50): Promise<any[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string): Promise<any> {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<any> {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async deleteNotification(notificationId: string): Promise<any> {
    return prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}
