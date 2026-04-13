import type { FastifyInstance } from 'fastify';
import type { InvoiceStatus } from '@sophia-werkt/shared';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

export async function invoicesRoutes(fastify: FastifyInstance): Promise<void> {
  const invoiceService = new InvoiceService();

  fastify.get<{ Params: { caseId: string } }>('/cases/:caseId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const invoices = await invoiceService.getInvoices(caseId);
      return reply.send(invoices);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Params: { caseId: string }; Body: any }>('/cases/:caseId/create', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const caseId = request.params.caseId;
      const data = CreateInvoiceSchema.parse(request.body);
      const invoice = await invoiceService.createInvoice(caseId, data);
      return reply.status(201).send(invoice);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { invoiceId: string } }>('/:invoiceId', { onRequest: authenticate }, async (request, reply) => {
    try {
      const invoiceId = request.params.invoiceId;
      const invoice = await invoiceService.getInvoice(invoiceId);
      return reply.send(invoice);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { invoiceId: string }; Body: { status: InvoiceStatus } }>('/:invoiceId/status', { onRequest: authorize('LAWYER', 'ADMIN') }, async (request, reply) => {
    try {
      const invoiceId = request.params.invoiceId;
      const { status } = request.body;
      const updated = await invoiceService.updateStatus(invoiceId, status);
      return reply.send(updated);
    } catch (error) {
      throw error;
    }
  });

  fastify.get<{ Params: { invoiceId: string } }>('/:invoiceId/pdf', { onRequest: authenticate }, async (request, reply) => {
    try {
      const invoiceId = request.params.invoiceId;
      const invoice = await invoiceService.getInvoice(invoiceId);

      // TODO: Generate PDF from invoice data
      return reply.send({
        message: 'PDF generation not yet implemented',
        invoice,
      });
    } catch (error) {
      throw error;
    }
  });
}
