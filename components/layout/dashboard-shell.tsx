"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Agent, Company } from "@/lib/types";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/layout/sidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Token check — nahi hai toh login pe bhejo
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const companyItems = await api.getCompanies();
        const agentGroups = await Promise.all(
          companyItems.map((company) => api.getAgentsByCompany(company._id).catch(() => []))
        );
        if (mounted) {
          setCompanies(companyItems);
          setAgents(agentGroups.flat());
        }
      } catch {
        if (mounted) {
          setCompanies([]);
          setAgents([]);
        }
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <aside style={{ width: "280px", flexShrink: 0 }}>
        <Sidebar companies={companies} agents={agents} />
      </aside>
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowX: "hidden",
          background:
            "radial-gradient(ellipse 80% 50% at 100% -10%, rgba(251,191,36,0.1), transparent 60%), var(--surface-0)",
        }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 md:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
