import type { FastifyInstance } from 'fastify';
import { MessageService } from '../services/message.service';
import { SendMessageSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';

export async function messagesRoutes(fastify: FastifyInstance): Promise<void> {
  const messageService = new MessageService();

  fastify.get<{ Params: { caseId: string } }>('/cases/:caseId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const messages = await messageService.getMessages(caseId);
      return reply.send(messages);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Params: { caseId: string }; Body: any }>('/cases/:caseId/send', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const data = SendMessageSchema.parse(request.body);
      const message = await messageService.sendMessage(caseId, userId, data);

      return reply.status(201).send(message);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { messageId: string } }>('/:messageId/read', { onRequest: authenticate }, async (request, reply) => {
    try {
      const messageId = request.params.messageId;
      const message = await messageService.markAsRead(messageId);
      return reply.send(message);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { caseId: string } }>('/cases/:caseId/mark-read', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      await messageService.markCaseMessagesAsRead(caseId, userId);
      return reply.status(200).send({ success: true });
    } catch (error) {
      throw error;
    }
  });
}
