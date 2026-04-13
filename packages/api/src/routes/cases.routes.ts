import type { FastifyInstance } from 'fastify';
import type { CaseStatus } from '@sophia-werkt/shared';
import { CaseService } from '../services/case.service';
import { ConflictCheckService } from '../services/conflictCheck.service';
import { CreateCaseSchema, UpdateCaseSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

export async function casesRoutes(fastify: FastifyInstance): Promise<void> {
  const caseService = new CaseService();
  const conflictCheckService = new ConflictCheckService();

  fastify.get('/list', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;
      const role = request.user?.role;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      let cases;
      if (role === 'CLIENT') {
        cases = await caseService.getCasesByClientId(userId);
      } else if (role === 'LAWYER') {
        cases = await caseService.getCasesByLawyerId(userId);
      } else {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      return reply.send(cases);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: any }>('/create', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;
      if (!userId || request.user?.role !== 'CLIENT') {
        return reply.status(403).send({ error: 'Only clients can create cases' });
      }

      const data = CreateCaseSchema.parse(request.body);
      const newCase = await caseService.createCase(userId, data);

      // Check for conflicts
      if (data.employerName) {
        const conflict = await conflictCheckService.checkConflict(data.employerName, userId);
        if (conflict.found) {
          await conflictCheckService.recordConflictCheck(newCase.id, conflict.found, conflict.notes);
        }
      }

      return reply.status(201).send(newCase);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { id: string } }>('/:id', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const caseData = await caseService.getCaseById(caseId);
      return reply.send(caseData);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { id: string }; Body: any }>('/:id', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const data = UpdateCaseSchema.parse(request.body);
      const updated = await caseService.updateCase(caseId, data);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { id: string }; Body: { lawyerId: string } }>('/:id/assign', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const { lawyerId } = request.body;
      const updated = await caseService.assignLawyer(caseId, lawyerId);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { id: string }; Body: { status: CaseStatus } }>('/:id/status', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const { status } = request.body;
      const updated = await caseService.changeStatus(caseId, status);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { id: string } }>('/:id/timeline', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const timeline = await caseService.getTimeline(caseId);
      return reply.send(timeline);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { id: string } }>('/:id/fee-summary', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.id;
      const summary = await caseService.getFeeSummary(caseId);
      return reply.send(summary);
    } catch (error) {
      throw error;
    }
  });
}
