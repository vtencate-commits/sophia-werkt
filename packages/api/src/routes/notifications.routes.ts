import type { FastifyInstance } from 'fastify';
import { NotificationService } from '../services/notification.service';
import { authenticate } from '../middleware/authenticate';

export async function notificationsRoutes(fastify: FastifyInstance): Promise<void> {
  const notificationService = new NotificationService();

  fastify.get('/list', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const { limit = 50 } = request.query as any;
      const notifications = await notificationService.getNotifications(userId, parseInt(limit));
      return reply.send(notifications);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { notificationId: string } }>('/:notificationId/read', { onRequest: authenticate }, async (request, reply) => {
    try {
      const notificationId = request.params.notificationId;
      const notification = await notificationService.markAsRead(notificationId);
      return reply.send(notification);
    } catch (error) {
      throw error;
    }
  });

  fastify.post('/mark-all-read', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      await notificationService.markAllAsRead(userId);
      return reply.status(200).send({ success: true });
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/unread-count', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const count = await notificationService.getUnreadCount(userId);
      return reply.send({ unreadCount: count });
    } catch (error) {
      throw error;
    }
  });
}
