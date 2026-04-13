import type { FastifyInstance } from 'fastify';
import { DocumentService } from '../services/document.service';
import { StorageService } from '../services/storage.service';
import { UploadDocumentSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';

export async function documentsRoutes(fastify: FastifyInstance): Promise<void> {
  const storageService = new StorageService();
  const documentService = new DocumentService(storageService);

  fastify.get<{ Params: { caseId: string } }>('/cases/:caseId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const documents = await documentService.getDocuments(caseId);
      return reply.send(documents);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Params: { caseId: string } }>('/cases/:caseId/upload', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' });
      }

      const buffer = await data.toBuffer();

      const category = (request.body as any)?.category || 'CLIENT_UPLOAD';
      const isVisible = (request.body as any)?.isVisible !== false;

      UploadDocumentSchema.parse({ category, isVisible });

      const document = await documentService.uploadDocument(
        caseId,
        userId,
        { filename: data.filename, buffer, mimetype: data.mimetype, size: buffer.length },
        category,
        isVisible
      );

      return reply.status(201).send(document);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { documentId: string } }>('/:documentId/download', { onRequest: authenticate }, async (request, reply) => {
    try {
      const documentId = request.params.documentId;
      const url = await documentService.getDownloadUrl(documentId);
      return reply.send({ url, expiresAt: new Date(Date.now() + 3600000).toISOString() });
    } catch (error) {
      throw error;
    }
  });

  fastify.delete<{ Params: { documentId: string } }>('/:documentId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const documentId = request.params.documentId;
      await documentService.deleteDocument(documentId);
      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  });
}
