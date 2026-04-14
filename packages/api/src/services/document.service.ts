import type { DocumentCategory } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { StorageService } from './storage.service';
import { AppError } from '../utils/errors';

export class DocumentService {
  constructor(private storageService: StorageService) {}

  async uploadDocument(
    caseId: string,
    userId: string,
    file: any,
    category: DocumentCategory,
    isVisible: boolean = true
  ): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    const uploadedFile = await this.storageService.upload(
      `cases/${caseId}/${file.filename}`,
      file.buffer,
      file.mimetype
    );

    const documentVersion = await prisma.document.findFirst({
      where: { caseId, originalFilename: file.filename },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (documentVersion?.version ?? 0) + 1;

    const document = await prisma.document.create({
      data: {
        caseId,
        filename: uploadedFile.key,
        originalFilename: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey: uploadedFile.key,
        category,
        version: nextVersion,
        isVisible,
        uploadedById: userId,
      },
    });

    return document;
  }

  async getDocuments(caseId: string): Promise<any[]> {
    return prisma.document.findMany({
      where: { caseId },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocument(documentId: string): Promise<any> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!document) {
      throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    return document;
  }

  async getDownloadUrl(documentId: string): Promise<string> {
    const document = await this.getDocument(documentId);
    return this.storageService.getPresignedUrl(document.filename);
  }

  async deleteDocument(documentId: string): Promise<void> {
    const document = await this.getDocument(documentId);

    await this.storageService.delete(document.filename);

    await prisma.document.delete({
      where: { id: documentId },
    });
  }
}
