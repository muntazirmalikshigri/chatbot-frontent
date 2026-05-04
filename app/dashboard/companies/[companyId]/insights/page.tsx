"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type InsightsData = {
  companyId: string;
  generatedAt: string;
  overview: {
    totalConversations: number;
    totalMessages: number;
    avgMessagesPerConversation: number;
    activeUsers: number;
    resolutionRate: number;
  };
  topQuestions: Array<{ question: string; count: number }>;
  missingKnowledge: Array<{ question: string; frequency: number }>;
  peakHours: Array<{ hour: number; count: number }>;
  recentConversations: Array<{
    sessionId: string;
    messageCount: number;
    lastMessageAt: string;
    preview: string;
  }>;
  aiRecommendations: string;
};

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div style={{
      background: "var(--surface-1)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "20px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontSize: "16px", color: color ?? "var(--amber-400)" }}>{icon}</span>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      </div>
      <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function Skeleton({ width = "100%", height = 16 }: { width?: string; height?: number }) {
  return (
    <div style={{ width, height, borderRadius: 8, background: "var(--surface-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

export default function InsightsDashboard() {
  const params = useParams<{ companyId: string }>();
  const router = useRouter();
  const companyId = params.companyId;

  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await api.getInsights(companyId);
        if (mounted) setInsights(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load insights");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [companyId]);

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(251,191,36,0.07), rgba(249,115,22,0.05))",
        border: "1px solid rgba(251,191,36,0.12)", borderRadius: "20px", padding: "2rem 2.5rem",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            Intelligence Dashboard
          </p>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text-primary)", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>
            Company Insights
          </h1>
          {insights && (
            <p style={{ marginTop: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Generated at {new Date(insights.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => router.replace(`/dashboard/companies/${companyId}`)}
            style={{ padding: "9px 18px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            ← Back
          </button>
          <button
            onClick={() => { setLoading(true); setInsights(null); setError(null); api.getInsights(companyId).then(setInsights).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
            style={{ padding: "9px 18px", borderRadius: "10px", background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))", border: "none", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#09090b" }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.875rem", color: "#fca5a5" }}>{error}</div>}

      {/* Overview stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        {loading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Skeleton width="60%" height={12} />
              <Skeleton width="40%" height={28} />
            </div>
          ))
        ) : insights ? (
          <>
            <StatCard label="Conversations" value={insights.overview.totalConversations} icon="💬" />
            <StatCard label="Messages" value={insights.overview.totalMessages} icon="📨" />
            <StatCard label="Avg per chat" value={insights.overview.avgMessagesPerConversation} icon="📊" />
            <StatCard label="Active users" value={insights.overview.activeUsers} icon="👥" />
            <StatCard label="Resolution rate" value={`${insights.overview.resolutionRate}%`} icon="✅" color={insights.overview.resolutionRate >= 70 ? "#4ade80" : insights.overview.resolutionRate >= 40 ? "var(--amber-400)" : "#f87171"} />
          </>
        ) : null}
      </div>

      {insights && (
        <>
          {/* AI Recommendations */}
          <div style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(249,115,22,0.04))", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "20px", padding: "2rem" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>🤖</span>
              <div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "12px" }}>
                  AI Recommendations
                </h2>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                  {insights.aiRecommendations}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

            {/* Top Questions */}
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.75rem" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
                🔥 Top Questions
              </h2>
              {insights.topQuestions.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>No questions yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {insights.topQuestions.map((q, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", background: "var(--surface-2)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--amber-400)", flexShrink: 0, marginTop: "2px" }}>#{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {q.question}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{q.count}x asked</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Knowledge */}
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.75rem" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                ❓ Knowledge Gaps
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Questions your agent couldn't answer</p>
              {insights.missingKnowledge.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1.5rem", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "12px" }}>
                  <p style={{ fontSize: "1.5rem", marginBottom: "6px" }}>🎉</p>
                  <p style={{ fontSize: "0.85rem", color: "#86efac" }}>No knowledge gaps detected!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {insights.missingKnowledge.map((q, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px" }}>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {q.question}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: "4px" }}>Unanswered {q.frequency}x</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Peak Hours */}
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.75rem" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
                ⏰ Peak Hours
              </h2>
              {insights.peakHours.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>No data yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {insights.peakHours.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", width: "70px", flexShrink: 0 }}>{formatHour(h.hour)}</span>
                      <div style={{ flex: 1, height: 8, background: "var(--surface-3)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "4px",
                          background: "linear-gradient(90deg, var(--amber-500), var(--orange-500))",
                          width: `${Math.min((h.count / (insights.peakHours[0]?.count ?? 1)) * 100, 100)}%`,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: "30px", textAlign: "right" }}>{h.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Conversations */}
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.75rem" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
                🕐 Recent Conversations
              </h2>
              {insights.recentConversations.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>No conversations yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {insights.recentConversations.map((conv, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                          {conv.sessionId.slice(0, 8)}...
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {conv.messageCount} msgs
                        </span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {conv.preview || "No preview available"}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* No data state */}
      {!loading && insights && insights.overview.totalConversations === 0 && (
        <div style={{ background: "var(--surface-1)", border: "1px dashed rgba(251,191,36,0.2)", borderRadius: "20px", padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)" }}>No data yet</h3>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "36ch", margin: "0.5rem auto 0" }}>
            Start chatting with your agent to generate insights and analytics.
          </p>
        </div>
      )}
    </div>
  );
}