import { prisma } from '../config/database';

export class ConflictCheckService {
  async checkConflict(employerName: string, currentClientId: string): Promise<{ found: boolean; notes: string }> {
    if (!employerName) {
      return { found: false, notes: '' };
    }

    const existingCases = await prisma.case.findMany({
      where: {
        employerName: {
          contains: employerName,
          mode: 'insensitive',
        },
        clientId: {
          not: currentClientId,
        },
      },
      include: {
        client: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (existingCases.length === 0) {
      return { found: false, notes: '' };
    }

    const notes = existingCases
      .map((c: { referenceNumber: string; client: { firstName: string; lastName: string } }) => `Case #${c.referenceNumber}: ${c.client.firstName} ${c.client.lastName}`)
      .join('; ');

    return {
      found: true,
      notes: `Potential conflict: This employer appears in other cases: ${notes}`,
    };
  }

  async recordConflictCheck(caseId: string, conflictFound: boolean, notes: string): Promise<void> {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        conflictChecked: true,
        conflictFound,
        conflictNotes: notes,
      },
    });
  }
}
