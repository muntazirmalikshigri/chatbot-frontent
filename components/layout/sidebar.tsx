"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Company, Agent } from "@/lib/types";
import { api } from "@/lib/api";

type SidebarProps = {
  companies: Company[];
  agents: Agent[];
};

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: "◈" },
  { href: "/dashboard/company/create", label: "New company", icon: "+" },
];

const companiesSection = [
  { href: "/dashboard/companies", label: "All companies", icon: "◎" },
];

const agentsSection = [
  { href: "/dashboard/agents", label: "All agents", icon: "◉" },
];

export function Sidebar({ companies, agents }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper: replace without pushing to history
  const navigate = (href: string) => {
    router.replace(href);
  };

  const NavItem = ({ href, label, icon }: { href: string; label: string; icon: string }) => {
    const active = pathname === href;
    return (
      <button
        onClick={() => navigate(href)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-[rgba(251,191,36,0.12)] text-[var(--amber-400)] border border-[rgba(251,191,36,0.2)]"
            : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]"
        }`}
      >
        <span className="text-base">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {active && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--amber-400)" }}
          />
        )}
      </button>
    );
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p
      className="text-[0.65rem] uppercase tracking-[0.12em] font-semibold mb-2 mt-4"
      style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}
    >
      {children}
    </p>
  );

  return (
    <aside
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Logo section */}
      <div
        className="p-5 border-b flex items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: "linear-gradient(135deg, var(--amber-400), var(--orange-500))",
          }}
        >
          <span className="font-extrabold text-sm" style={{ fontFamily: "Syne, sans-serif", color: "var(--surface-0)" }}>
            N
          </span>
        </div>
        <div>
          <p className="font-extrabold text-lg leading-none" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
            NeuralDesk
          </p>
          <p className="text-[0.7rem] uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
            AI Platform
          </p>
        </div>
      </div>

      {/* Nav section */}
      <nav
        className="flex-1 p-4 space-y-1"
        style={{ overflowY: "auto" }}
      >
        <SectionLabel>Main</SectionLabel>
        {mainNavItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}

        <SectionLabel>Companies</SectionLabel>
        {companiesSection.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}

        <SectionLabel>Agents</SectionLabel>
        {agentsSection.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      {/* Sign out section */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={async () => {
            try {
              await api.logout();
            } finally {
              router.replace("/login");
            }
          }}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border"
          style={{
            color: "#f87171",
            borderColor: "rgba(248,113,113,0.2)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
