import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { anonymizeText, deAnonymizeText } from '../utils/anonymize';
import { AppError } from '../utils/errors';

export class AiService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeCase(caseId: string, skillId?: string, additionalInstructions?: string): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        documents: true,
      },
    });

    if (!caseData) {
      throw new AppError('Case not found', 404, 'CASE_NOT_FOUND');
    }

    let skill: any;
    if (skillId) {
      skill = await prisma.aiSkill.findUnique({
        where: { id: skillId },
      });
      if (!skill) {
        throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
      }
    } else {
      // Use default skill based on advice type
      skill = await prisma.aiSkill.findFirst({
        where: {
          category: caseData.adviceType,
          isActive: true,
        },
      });

      if (!skill) {
        throw new AppError('No suitable skill found for this case', 400, 'NO_SKILL_AVAILABLE');
      }
    }

    // Collect document content
    let documentContent = '';
    for (const doc of caseData.documents) {
      documentContent += `\n\n--- ${doc.originalFilename} ---\n`;
      // TODO: Fetch document content from storage
    }

    // Anonymize content
    const anonymizedContent = anonymizeText(
      `${caseData.description || ''}\n${caseData.clientNotes || ''}\n${documentContent}`
    );

    // Build system prompt
    let systemPrompt = skill.systemPrompt;
    if (additionalInstructions) {
      systemPrompt += `\n\nAdditional instructions from user: ${additionalInstructions}`;
    }

    // Call Claude API
    const message = await this.anthropic.messages.create({
      model: env.AI_MODEL,
      max_tokens: env.AI_MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: anonymizedContent,
        },
      ],
    });

    const rawAnalysis = message.content[0].type === 'text' ? message.content[0].text : '';
    const deAnonymizedAnalysis = deAnonymizeText(rawAnalysis);
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // Store analysis on the Case record (schema stores analysis as Case fields)
    const updated = await prisma.case.update({
      where: { id: caseId },
      data: {
        aiAnalysisRaw: rawAnalysis,
        aiAnalysisHtml: deAnonymizedAnalysis,
        aiAnalysisAt: new Date(),
        aiTokensUsed: tokensUsed,
        status: 'AI_ANALYSIS_COMPLETE',
      },
    });

    return {
      caseId: updated.id,
      raw: updated.aiAnalysisRaw,
      html: updated.aiAnalysisHtml,
      analyzedAt: updated.aiAnalysisAt,
      tokensUsed: updated.aiTokensUsed,
    };
  }

  async getAnalysis(caseId: string): Promise<any> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData || !caseData.aiAnalysisHtml) {
      throw new AppError('No analysis found for this case', 404, 'ANALYSIS_NOT_FOUND');
    }

    return {
      caseId: caseData.id,
      raw: caseData.aiAnalysisRaw,
      html: caseData.aiAnalysisHtml,
      analyzedAt: caseData.aiAnalysisAt,
      tokensUsed: caseData.aiTokensUsed,
    };
  }

  async updateAnalysis(caseId: string, html: string): Promise<any> {
    return prisma.case.update({
      where: { id: caseId },
      data: { aiAnalysisHtml: html },
    });
  }

  async createSkill(data: any): Promise<any> {
    return prisma.aiSkill.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        systemPrompt: data.systemPrompt,
        isActive: true,
        version: 1,
      },
    });
  }

  async updateSkill(skillId: string, data: any): Promise<any> {
    const currentSkill = await prisma.aiSkill.findUnique({
      where: { id: skillId },
    });

    if (!currentSkill) {
      throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    return prisma.aiSkill.update({
      where: { id: skillId },
      data: {
        ...data,
        version: currentSkill.version + 1,
      },
    });
  }

  async getSkills(category?: string): Promise<any[]> {
    return prisma.aiSkill.findMany({
      where: category ? { category } : {},
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getSkill(skillId: string): Promise<any> {
    const skill = await prisma.aiSkill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    return skill;
  }
}
