export interface AiAnalysisRequest {
  skillId?: string;
  additionalInstructions?: string;
}

export interface AiAnalysisResult {
  raw: string;
  html: string;
  tokensUsed: number;
  analyzedAt: string;
}

export interface AiSkillInfo {
  id: string;
  name: string;
  description?: string;
  category: string;
  systemPrompt: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAiSkillRequest {
  name: string;
  description?: string;
  category: string;
  systemPrompt: string;
}

export interface UpdateAiSkillRequest {
  name?: string;
  description?: string;
  category?: string;
  systemPrompt?: string;
  isActive?: boolean;
}
