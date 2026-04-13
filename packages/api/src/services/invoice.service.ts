import type { CreateInvoiceRequest, InvoiceStatus } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

const VAT_RATE = 0.21;

export class InvoiceService {
  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `SW${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let sequence = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.slice(-6), 10);
      sequence = lastSeq + 1;
    }

    const paddedSeq = String(sequence).padStart(6, '0');
    return `SW${year}${paddedSeq}`;
  }

  async createInvoice(caseId: string, data: CreateInvoiceRequest): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    const amount = data.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const vatAmount = amount * VAT_RATE;
    const totalAmount = amount + vatAmount;

    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        caseId,
        invoiceNumber,
        amount,
        vatAmount,
        totalAmount,
        description: data.description,
        status: 'DRAFT',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        lineItems: {
          createMany: {
            data: data.lineItems,
          },
        },
      },
      include: {
        lineItems: true,
      },
    });

    return invoice;
  }

  async getInvoices(caseId: string): Promise<any[]> {
    return prisma.invoice.findMany({
      where: { caseId },
      include: {
        lineItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoice(invoiceId: string): Promise<any> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        lineItems: true,
      },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }

    return invoice;
  }

  async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<any> {
    await this.getInvoice(invoiceId);

    const updateData: Record<string, any> = { status };

    if (status === 'PAID') {
      updateData.paidAt = new Date();
    }

    return prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        lineItems: true,
      },
    });
  }
}
