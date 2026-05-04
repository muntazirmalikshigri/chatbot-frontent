"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Agent, KnowledgeChunk } from "@/lib/types";

export default function AgentDetailPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = params.agentId;
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [agentData, knowledgeData] = await Promise.all([
          api.getAgent(agentId),
          api.getKnowledge(agentId).catch(() => []),
        ]);
        if (mounted) { setAgent(agentData); setKnowledge(knowledgeData); }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load agent");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [agentId]);

  const handleDelete = async (chunkId: string) => {
    if (!confirm("Are you sure you want to delete this knowledge chunk?")) return;
    setDeletingId(chunkId);
    setDeleteSuccess(null);
    try {
      await api.deleteKnowledgeChunk(agentId, chunkId);
      setKnowledge(prev => prev.filter(c => c._id !== chunkId));
      setDeleteSuccess("Chunk deleted successfully.");
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete chunk");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", padding: "3rem" }}>
      <div style={{ width: 20, height: 20, border: "2px solid var(--surface-4)", borderTopColor: "var(--amber-400)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading agent...
    </div>
  );

  if (error) return (
    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px", color: "#fca5a5", fontSize: "0.875rem" }}>
      {error}
    </div>
  );

  if (!agent) return <div style={{ color: "var(--text-muted)" }}>Agent not found.</div>;

  const companyId = typeof agent.companyId === "string" ? agent.companyId : agent.companyId._id;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header card */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
              Agent details
            </p>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", marginTop: "8px", letterSpacing: "-0.02em" }}>
              {agent.name}
            </h2>
            <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "var(--amber-400)" }}>
                {agent.tone} tone
              </span>
              <span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: "100px", background: "var(--surface-3)", color: "var(--text-muted)" }}>
                {knowledge.length} chunks
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => router.replace(`/dashboard/companies/${companyId}`)}
              style={{
                padding: "9px 18px", borderRadius: "10px",
                background: "transparent", border: "1px solid var(--border)",
                cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Company knowledge
            </button>
            <button
              onClick={() => router.replace(`/dashboard/agents/${agentId}/chat`)}
              style={{
                padding: "9px 18px", borderRadius: "10px",
                background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
                border: "none", cursor: "pointer",
                fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#09090b",
                boxShadow: "0 0 16px rgba(251,191,36,0.2)",
              }}
            >
              Test chat →
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginTop: "20px", background: "var(--surface-2)", borderRadius: "14px", padding: "16px 20px", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>Instructions</p>
          <p style={{ marginTop: "10px", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
            {agent.instructions}
          </p>
        </div>

        {/* Info banner */}
        <div style={{
          marginTop: "12px", background: "rgba(251,191,36,0.05)", borderRadius: "14px",
          padding: "14px 18px", border: "1px solid rgba(251,191,36,0.12)",
          display: "flex", gap: "12px", alignItems: "flex-start",
        }}>
          <span style={{ color: "var(--amber-500)", fontSize: "15px", flexShrink: 0, marginTop: 1 }}>◈</span>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--amber-300)" }}>Knowledge base active</p>
            <p style={{ marginTop: "4px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Upload text-based company documents from the company page to improve responses.
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge chunks */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
              Knowledge chunks
            </h3>
            <p style={{ marginTop: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {knowledge.length} chunks indexed
            </p>
          </div>
        </div>

        {/* Success message */}
        {deleteSuccess && (
          <div style={{
            marginBottom: "12px", background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px",
            padding: "10px 14px", fontSize: "0.82rem", color: "#86efac",
          }}>
            ✓ {deleteSuccess}
          </div>
        )}

        {knowledge.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "2.5rem",
            border: "1px dashed rgba(251,191,36,0.15)", borderRadius: "14px",
          }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              No knowledge uploaded yet. Add documents from the company page.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {knowledge.map(chunk => (
              <div key={chunk._id} style={{
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "14px 16px",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(251,191,36,0.15)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-primary)" }}>
                      {chunk.sourceName || "knowledge"}
                    </p>
                    <span style={{
                      fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px",
                      background: "var(--surface-3)", color: "var(--text-muted)",
                    }}>
                      #{chunk.chunkIndex}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => void handleDelete(chunk._id)}
                    disabled={deletingId === chunk._id}
                    style={{
                      padding: "5px 12px", borderRadius: "8px", flexShrink: 0,
                      background: "transparent",
                      border: "1px solid rgba(239,68,68,0.2)",
                      cursor: deletingId === chunk._id ? "not-allowed" : "pointer",
                      fontSize: "0.75rem",
                      color: deletingId === chunk._id ? "var(--text-muted)" : "rgba(239,68,68,0.7)",
                      transition: "background 0.15s, color 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => {
                      if (deletingId !== chunk._id) {
                        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(239,68,68,0.7)";
                      e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                    }}
                  >
                    {deletingId === chunk._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <p style={{
                  fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65,
                  display: "-webkit-box", WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
