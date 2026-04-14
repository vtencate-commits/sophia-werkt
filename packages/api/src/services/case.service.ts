import type { CreateCaseRequest, UpdateCaseRequest, CaseStatus } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

export class CaseService {
  async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastCase = await prisma.case.findFirst({
      where: {
        referenceNumber: {
          startsWith: `SW${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let sequence = 1;
    if (lastCase && lastCase.referenceNumber) {
      const lastSeq = parseInt(lastCase.referenceNumber.slice(-6), 10);
      sequence = lastSeq + 1;
    }

    const paddedSeq = String(sequence).padStart(6, '0');
    return `SW${year}${paddedSeq}`;
  }

  async createCase(userId: string, data: CreateCaseRequest): Promise<any> {
    const referenceNumber = await this.generateReferenceNumber();

    const caseData = await prisma.case.create({
      data: {
        referenceNumber,
        title: data.title,
        description: data.description,
        adviceType: data.adviceType,
        employerName: data.employerName,
        employerKvk: data.employerKvk,
        clientNotes: data.clientNotes,
        caoReference: data.caoReference,
        status: 'INTAKE',
        feeType: 'FIXED',
        feeAmount: 0,
        clientId: userId,
        conflictChecked: false,
        conflictFound: false,
      },
    });

    return caseData;
  }

  async getCaseById(caseId: string): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        lawyer: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    return caseData;
  }

  async updateCase(caseId: string, data: UpdateCaseRequest): Promise<any> {
    const caseData = await prisma.case.update({
      where: { id: caseId },
      data,
    });

    return caseData;
  }

  async getCasesByClientId(clientId: string): Promise<any[]> {
    return prisma.case.findMany({
      where: { clientId },
      include: {
        lawyer: {
          select: { firstName: true, lastName: true },
        },
        messages: {
          where: { isRead: false },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCasesByLawyerId(lawyerId: string): Promise<any[]> {
    return prisma.case.findMany({
      where: { lawyerId },
      include: {
        client: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignLawyer(caseId: string, lawyerId: string): Promise<any> {
    return prisma.case.update({
      where: { id: caseId },
      data: { lawyerId },
    });
  }

  async changeStatus(caseId: string, newStatus: CaseStatus): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    // Create timeline entry
    await prisma.caseTimeline.create({
      data: {
        caseId,
        fromStatus: caseData.status,
        toStatus: newStatus,
      },
    });

    return prisma.case.update({
      where: { id: caseId },
      data: { status: newStatus },
    });
  }

  async getTimeline(caseId: string): Promise<any[]> {
    return prisma.caseTimeline.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getFeeSummary(caseId: string): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    const invoices = await prisma.invoice.findMany({
      where: { caseId },
    });

    const timeEntries = await prisma.timeEntry.findMany({
      where: { caseId, billable: true },
    });

    const totalInvoiced = invoices.reduce((sum: number, inv: { totalAmount: any }) => sum + Number(inv.totalAmount), 0);
    const totalTimeMinutes = timeEntries.reduce((sum: number, entry: { durationMinutes: number }) => sum + entry.durationMinutes, 0);

    const pendingInvoices = invoices.filter((inv: { status: string }) => inv.status !== 'PAID').length;

    return {
      feeType: caseData.feeType,
      feeAmount: caseData.feeAmount,
      totalInvoiced,
      totalTimeMinutes,
      pendingInvoices,
    };
  }
}