import type { FastifyInstance } from 'fastify';
import { AiService } from '../services/ai.service';
import { AiAnalysisSchema, CreateAiSkillSchema, UpdateAiSkillSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

export async function aiRoutes(fastify: FastifyInstance): Promise<void> {
  const aiService = new AiService();

  fastify.post<{ Params: { caseId: string }; Body: any }>('/cases/:caseId/analyze', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const data = AiAnalysisSchema.parse(request.body);
      const analysis = await aiService.analyzeCase(caseId, data.skillId, data.additionalInstructions);
      return reply.status(201).send(analysis);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { caseId: string } }>('/cases/:caseId/analysis', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const analysis = await aiService.getAnalysis(caseId);
      return reply.send(analysis);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { analysisId: string }; Body: { html: string } }>('/:analysisId', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const analysisId = request.params.analysisId;
      const { html } = request.body;
      const updated = await aiService.updateAnalysis(analysisId, html);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/skills', { onRequest: authenticate }, async (request, reply) => {
    try {
      const { category } = request.query as any;
      const skills = await aiService.getSkills(category);
      return reply.send(skills);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: any }>('/skills', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const data = CreateAiSkillSchema.parse(request.body);
      const skill = await aiService.createSkill(data);
      return reply.status(201).send(skill);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { skillId: string } }>('/skills/:skillId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const skillId = request.params.skillId;
      const skill = await aiService.getSkill(skillId);
      return reply.send(skill);
    } catch (error) {
      throw error;
    }
  });

  fastify.put<{ Params: { skillId: string }; Body: any }>('/skills/:skillId', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const skillId = request.params.skillId;
      const data = UpdateAiSkillSchema.parse(request.body);
      const updated = await aiService.updateSkill(skillId, data);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });
}
