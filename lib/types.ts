export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type User = {
  _id: string;
  name: string;
  email: string;
};

export type Company = {
  _id: string;
  name: string;
  slug: string;
  defaultKnowledgeBaseId?: string;
  description?: string;
  status?: "active" | "inactive";
  createdAt?: string;
};

export type CompanyCreationResult = {
  company: Company;
  defaultAgent: Agent;
};

export type Agent = {
  _id: string;
  name: string;
  companyId: string | Company;
  knowledgeBaseId?: string;
  tone: "friendly" | "formal";
  instructions: string;
  isActive?: boolean;
  createdAt?: string;
};

export type KnowledgeChunk = {
  _id: string;
  agentId: string;
  sourceType: "text" | "pdf";
  sourceName?: string;
  content: string;
  chunkIndex: number;
  createdAt?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  agentId: string;
  sessionId: string;
  provider: string;
  response: string;
  sources: Array<{
    chunkId: string;
    sourceName: string;
    score: number;
    content: string;
  }>;
};
