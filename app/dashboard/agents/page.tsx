"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Agent, Company } from "@/lib/types";

type AgentWithCompany = {
  agent: Agent;
  company?: Company;
};

function formatDate(value?: string) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function Skeleton() {
  return (
    <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[70, 100, 80, 40].map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: i === 0 ? 20 : 14, borderRadius: 8, background: "var(--surface-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

export default function AgentsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AgentWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const companies = await api.getCompanies();
        const agentGroups = await Promise.all(
          companies.map(c => api.getAgentsByCompany(c._id).catch(() => []))
        );
        if (mounted) {
          const all: AgentWithCompany[] = [];
          agentGroups.forEach((agents, i) => {
            agents.forEach(agent => all.push({ agent, company: companies[i] }));
          });
          setItems(all);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load agents");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

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
            All agents
          </p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text-primary)", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>
            Your AI assistants
          </h2>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "50ch" }}>
            All agents across your companies. Click any agent to manage it.
          </p>
        </div>
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: "14px", padding: "12px 20px", textAlign: "center",
        }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>Total</p>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", lineHeight: 1 }}>
            {loading ? "—" : items.length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.875rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {[1, 2, 3].map(i => <Skeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div style={{
          background: "var(--surface-1)", border: "1px dashed rgba(251,191,36,0.2)",
          borderRadius: "20px", padding: "4rem", textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--amber-400)" }}>◉</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)" }}>
            No agents yet
          </h3>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "36ch", margin: "0.5rem auto 0" }}>
            Create a company first — a default agent will be auto-generated.
          </p>
          <button
            onClick={() => router.replace("/dashboard/company/create")}
            style={{
              marginTop: "1.5rem", padding: "11px 24px", borderRadius: "100px",
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              border: "none", cursor: "pointer",
              fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#09090b",
            }}
          >
            Create company →
          </button>
        </div>
      )}

      {/* Agents grid */}
      {!loading && items.length > 0 && (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {items.map(({ agent, company }) => (
            <div
              key={agent._id}
              style={{
                background: "var(--surface-1)", border: "1px solid var(--border)",
                borderRadius: "20px", padding: "24px",
                transition: "border-color 0.2s, transform 0.2s", cursor: "pointer",
              }}
              onClick={() => router.replace(`/dashboard/agents/${agent._id}`)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Agent icon + name */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(249,115,22,0.1))",
                  border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", color: "var(--amber-400)",
                }}>◉</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {agent.name}
                  </h3>
                  {company && (
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {company.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "var(--amber-400)" }}>
                  {agent.tone} tone
                </span>
                <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "100px", background: agent.isActive ? "rgba(74,222,128,0.08)" : "var(--surface-3)", border: agent.isActive ? "1px solid rgba(74,222,128,0.2)" : "1px solid var(--border)", color: agent.isActive ? "#86efac" : "var(--text-muted)" }}>
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Instructions */}
              <p style={{
                marginTop: "12px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {agent.instructions}
              </p>

              {/* Footer */}
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {formatDate(agent.createdAt)}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={e => { e.stopPropagation(); router.replace(`/dashboard/agents/${agent._id}/chat`); }}
                    style={{ padding: "5px 12px", borderRadius: "8px", background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#09090b", fontWeight: 600 }}
                  >
                    Test chat
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); router.replace(`/dashboard/agents/${agent._id}`); }}
                    style={{ padding: "5px 12px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.75rem", color: "var(--text-secondary)", transition: "border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}