import type { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';
import { CreateTimeEntrySchema, UpdateTimeEntrySchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';

export async function usersRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService();

  fastify.get('/me', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const user = await userService.getUserById(userId);
      return reply.send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { caseId: string } }>('/cases/:caseId/time-entries', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const entries = await userService.getTimeEntries(caseId);
      return reply.send(entries);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Params: { caseId: string }; Body: any }>('/cases/:caseId/time-entries', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const data = CreateTimeEntrySchema.parse(request.body);
      const entry = await userService.createTimeEntry(caseId, userId, data);
      return reply.status(201).send(entry);
    } catch (error) {
      throw error;
    }
  });

  fastify.put<{ Params: { timeEntryId: string }; Body: any }>('/time-entries/:timeEntryId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const timeEntryId = request.params.timeEntryId;
      const data = UpdateTimeEntrySchema.parse(request.body);
      const updated = await userService.updateTimeEntry(timeEntryId, data);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.delete<{ Params: { timeEntryId: string } }>('/time-entries/:timeEntryId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const timeEntryId = request.params.timeEntryId;
      await userService.deleteTimeEntry(timeEntryId);
      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  });
}
