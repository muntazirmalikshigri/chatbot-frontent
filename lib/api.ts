

import type {
  Agent,
  ApiEnvelope,
  ChatResponse,
  CompanyCreationResult,
  Company,
  KnowledgeChunk,
  User,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/v1";

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body && !("Content-Type" in (options.headers ?? {}))
        ? { "Content-Type": "application/json" }
        : {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }

  return (payload?.data ?? null) as T;
}
export const api = {
  login: (email: string, password: string) =>
    request<User>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    consent: boolean;
  }) =>
    request<User>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<User>("/user/me"),

  getCompanies: () => request<Company[]>("/companies"),

  getCompany: (companyId: string) => request<Company>(`/companies/${companyId}`),

  getInsights: (companyId: string) =>
    request<any>(`/companies/${companyId}/insights`),

  createCompany: (payload: { name: string; description?: string }) =>
    request<CompanyCreationResult>("/companies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteCompany: (companyId: string) =>
    request<null>(`/companies/${companyId}`, { method: "DELETE" }),

  getAgentsByCompany: (companyId: string) =>
    request<Agent[]>(`/companies/${companyId}/agents`),

  getAgent: (agentId: string) => request<Agent>(`/agents/${agentId}`),

  createAgent: (
    companyId: string,
    payload: { name: string; tone: "friendly" | "formal"; instructions: string }
  ) =>
    request<Agent>(`/companies/${companyId}/agents`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAgent: (
    agentId: string,
    payload: Partial<{ name: string; tone: "friendly" | "formal"; instructions: string; isActive: boolean }>
  ) =>
    request<Agent>(`/agents/${agentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteAgent: (agentId: string) =>
    request<null>(`/agents/${agentId}`, { method: "DELETE" }),

  getKnowledge: (agentId: string) =>
    request<KnowledgeChunk[]>(`/agents/${agentId}/knowledge`),

  uploadKnowledgeText: (agentId: string, payload: { text: string; sourceName?: string }) =>
    request<{ chunksCreated: number; sourceType: string }>(`/agents/${agentId}/knowledge/text`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  uploadKnowledgePdf: async (agentId: string, file: File, sourceName?: string) => {
    const response = await fetch(
      `${API_BASE_URL}/agents/${agentId}/knowledge/pdf${
        sourceName ? `?sourceName=${encodeURIComponent(sourceName)}` : ""
      }`,
      {
        method: "POST",
        credentials: "include",
        body: file,
        headers: { "Content-Type": file.type || "application/pdf" },
      }
    );
    const payload = (await response.json().catch(() => null)) as
      | ApiEnvelope<{ chunksCreated: number; sourceType: string }>
      | null;
    if (!response.ok) throw new Error(payload?.message ?? "PDF upload failed");
    return payload?.data ?? { chunksCreated: 0, sourceType: "pdf" };
  },

  chat: (agentId: string, payload: { message: string; sessionId?: string }) =>
    request<ChatResponse>(`/chat/${agentId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteKnowledgeChunk: (agentId: string, chunkId: string) =>
    request<{ deleted: boolean; chunkId: string }>(`/agents/${agentId}/knowledge/${chunkId}`, {
      method: "DELETE",
    }),

  deleteKnowledgeBySource: (agentId: string, sourceName: string) =>
    request<{ deleted: boolean; sourceName: string; deletedCount: number }>(
      `/agents/${agentId}/knowledge/source/${encodeURIComponent(sourceName)}`,
      { method: "DELETE" }
    ),

  // ─── WhatsApp (Baileys) ───────────────────────────────────────────

  // Start WhatsApp connection — backend generates QR
  connectWhatsApp: (companyId: string) =>
    request<{ status: string; companyId: string }>(
      `/whatsapp/${companyId}/connect`,
      { method: "POST" }
    ),

  // Poll QR code every 3 seconds until connected
  // getWhatsAppQR: (companyId: string) =>
  //   request<{ qr: string | null; status: string }>(
  //     `/whatsapp/${companyId}/qr`
  //   ),
  getWhatsAppQR: async (companyId: string) => {
  const response = await fetch(`${API_BASE_URL}/whatsapp/${companyId}/qr`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? "Failed to fetch QR");
  }

  return payload.data as { qr: string | null; status: string };
},

  // Get full connection status
  getWhatsAppStatus: (companyId: string) =>
    request<{
      status: 'connecting' | 'connected' | 'disconnected';
      isConnected: boolean;
      phoneNumber: string | null;
      connectedAt: string | null;
    }>(`/whatsapp/${companyId}/status`),

  // Disconnect WhatsApp
  disconnectWhatsApp: (companyId: string) =>
    request<null>(`/whatsapp/${companyId}/disconnect`, { method: "DELETE" }),

  // ─────────────────────────────────────────────────────────────────

  logout: async () => {
    try {
      await request<{ success: boolean }>("/logout", { method: "PUT" });
    } catch {
      // Ignore errors — logout should proceed even if backend call fails
    }
  },
};

export const storageKeys = {
  authSession: "mta-auth-session",
  chatSession: (agentId: string) => `mta-chat-session-${agentId}`,
  chatMessages: (agentId: string) => `mta-chat-messages-${agentId}`,
};
