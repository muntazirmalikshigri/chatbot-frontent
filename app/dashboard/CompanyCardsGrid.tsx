"use client";

import { Card } from "@/components/ui/card";
import type { Company, Agent } from "@/lib/types";

type CompanyWithAgent = {
  company: Company;
  agent?: Agent;
};

function formatCreatedDate(value?: string) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function CompanyCardsGrid({
  items,
  onOpenAgent,
}: {
  items: CompanyWithAgent[];
  onOpenAgent: (id: string) => void;
}) {
  return (
    <div
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      style={{ animation: "fadeUp 0.5s ease-out" }}
    >
      {items.map(({ company, agent }) => (
        <Card
          key={company._id}
          className="p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(251,191,36,0.2)]"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p
                className="text-[0.6rem] uppercase tracking-[0.1em] font-semibold"
                style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}
              >
                Company
              </p>
              <h3
                className="mt-2 text-xl font-extrabold"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
              >
                {company.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {company.description || "No description added yet."}
              </p>
            </div>
                <div
                  className="rounded-full px-3 py-1 text-[0.75rem] font-medium border"
                  style={{
                    background: "var(--surface-3)",
                    color: "var(--text-muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  Created {formatCreatedDate(company.createdAt)}
                </div>
          </div>

          <div
            className="mt-6 p-4 rounded-xl border transition-all duration-300"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-[0.6rem] uppercase tracking-[0.1em] font-semibold"
              style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}
            >
              Default assistant
            </p>
            {agent ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}>
                    {agent.name}
                  </p>
                  <p className="mt-1.5 text-sm" style={{ color: "var(--amber-400)" }}>
                    {agent.tone} tone
                  </p>
                </div>
                <button
                  onClick={() => onOpenAgent(agent._id)}
                  className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 border"
                  style={{
                    color: "var(--amber-400)",
                    background: "transparent",
                    border: "1px solid rgba(251,191,36,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(251,191,36,0.08)";
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)";
                  }}
                >
                  Open →
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                No assistant detected for this company.
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
