// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { api } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { CompanyCardsGrid } from "./CompanyCardsGrid";
// import type { Agent, Company } from "@/lib/types";

// type CompanyWithAgent = {
//   company: Company;
//   agent?: Agent;
// };

// function CompanySkeleton() {
//   return (
//     <Card className="p-6">
//       <Skeleton className="h-6 w-2/3" />
//       <Skeleton className="mt-3 h-4 w-full" />
//       <Skeleton className="mt-2 h-4 w-4/5" />
//       <div className="mt-6 flex justify-between">
//         <Skeleton className="h-4 w-24" />
//         <Skeleton className="h-10 w-28" />
//       </div>
//     </Card>
//   );
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [items, setItems] = useState<CompanyWithAgent[]>([]);
//   const [agentCount, setAgentCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const companyItems = await api.getCompanies();
//         const agentGroups = await Promise.all(
//           companyItems.map((company) => api.getAgentsByCompany(company._id).catch(() => []))
//         );
//         const totalAgents = agentGroups.reduce((sum, group) => sum + group.length, 0);

//         if (mounted) {
//           setItems(
//             companyItems.map((company, index) => ({
//               company,
//               agent: agentGroups[index]?.[0],
//             }))
//           );
//           setAgentCount(totalAgents);
//         }
//       } catch (err) {
//         if (mounted) {
//           setError(err instanceof Error ? err.message : "Unable to load dashboard");
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     };

//     void load();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const stats = useMemo(
//     () => [
//       { label: "Companies", value: items.length },
//       {
//         label: "Agents",
//         value: agentCount,
//       },
//     ],
//     [agentCount, items.length]
//   );

//   const handleCreateCompany = () => {
//     router.replace("/dashboard/company/create");
//   };

//   const handleOpenAgent = (agentId: string) => {
//     router.replace(`/dashboard/agents/${agentId}`);
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header banner */}
//       <div
//         className="p-6 md:p-8 rounded-2xl border transition-all duration-300"
//         style={{
//           background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.06) 100%), var(--surface-1)",
//           border: "1px solid rgba(251,191,36,0.15)",
//         }}
//       >
//         <div className="flex flex-wrap items-start justify-between gap-6">
//           <div>
//             <p
//               className="text-[0.65rem] uppercase tracking-[0.12em] font-semibold"
//               style={{ fontFamily: "Syne, sans-serif", color: "var(--amber-500)" }}
//             >
//               Overview
//             </p>
//             <h1
//               className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight"
//               style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
//             >
//               Your workspace
//             </h1>
//             <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
//               Create tenant companies, let the backend auto-create a default assistant, and move from setup to live chatbot testing in a few clicks.
//             </p>
//           </div>
//           <button
//             onClick={handleCreateCompany}
//             className="px-6 py-3 text-sm font-extrabold rounded-full transition-all duration-300 whitespace-nowrap"
//             style={{
//               fontFamily: "Syne, sans-serif",
//               fontWeight: 700,
//               background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
//               color: "var(--surface-0)",
//               boxShadow: "0 0 24px rgba(251,191,36,0.2)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "translateY(-1px)";
//               e.currentTarget.style.boxShadow = "0 0 32px rgba(251,191,36,0.35)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "0 0 24px rgba(251,191,36,0.2)";
//             }}
//           >
//             New company +
//           </button>
//         </div>
//       </div>

//       {/* Error state */}
//       {error && (
//         <div
//           className="p-4 rounded-2xl border"
//           style={{
//             background: "rgba(248,113,113,0.08)",
//             border: "1px solid rgba(248,113,113,0.2)",
//           }}
//         >
//           <p style={{ color: "#fda4af", fontSize: "0.9rem" }}>{error}</p>
//         </div>
//       )}

//       {/* Stats row */}
//       {!loading && items.length > 0 && (
//         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
//           {stats.map((stat) => (
//             <Card
//               key={stat.label}
//               className="p-6"
//               style={{
//                 background: "var(--surface-1)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "16px",
//               }}
//             >
//               <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
//                 {stat.label}
//               </p>
//               <p
//                 className="text-4xl md:text-5xl font-extrabold"
//                 style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
//               >
//                 {stat.value}
//               </p>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Skeleton loading */}
//       {loading ? (
//         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <CompanySkeleton key={index} />
//           ))}
//         </div>
//       ) : null}

//       {/* Empty state */}
//       {!loading && items.length === 0 && (
//         <Card
//           className="p-10 text-center border-dashed transition-all duration-300"
//           style={{
//             background: "var(--surface-1)",
//             border: "2px dashed rgba(251,191,36,0.25)",
//             borderRadius: "20px",
//           }}
//         >
//           <p
//             className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold"
//             style={{ color: "var(--amber-500)", fontFamily: "Syne, sans-serif" }}
//           >
//             Get started
//           </p>
//           <h2
//             className="mt-4 text-2xl md:text-3xl font-extrabold"
//             style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
//           >
//             No company found. Create your first company.
//           </h2>
//           <p className="mt-3 max-w-md mx-auto text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
//             A new company will automatically receive a default assistant for testing and RAG setup.
//           </p>
//           <button
//             onClick={handleCreateCompany}
//             className="mt-6 px-6 py-3 text-sm font-extrabold rounded-full transition-all duration-300"
//             style={{
//               fontFamily: "Syne, sans-serif",
//               fontWeight: 700,
//               background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
//               color: "var(--surface-0)",
//               boxShadow: "0 0 24px rgba(251,191,36,0.2)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "translateY(-1px)";
//               e.currentTarget.style.boxShadow = "0 0 32px rgba(251,191,36,0.35)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "0 0 24px rgba(251,191,36,0.2)";
//             }}
//           >
//             Create your first company
//           </button>
//         </Card>
//       )}

//       {/* Company cards grid */}
//       {!loading && items.length > 0 && (
//         <CompanyCardsGrid items={items} onOpenAgent={handleOpenAgent} />
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyCardsGrid } from "./CompanyCardsGrid";
import type { Agent, Company } from "@/lib/types";

type CompanyWithAgent = {
  company: Company;
  agent?: Agent;
};

function CompanySkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <div className="mt-6 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<CompanyWithAgent[]>([]);
  const [agentCount, setAgentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ TOKEN CHECK - Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("🔍 Dashboard - Token check:", token ? "Token exists" : "No token");
    
    if (!token) {
      console.log("🚫 No token found, redirecting to login");
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // ✅ Double check token before API calls
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (mounted) {
          setError("Please login again");
          setLoading(false);
          router.replace("/login");
        }
        return;
      }

      try {
        console.log("📡 Fetching companies...");
        const companyItems = await api.getCompanies();
        console.log("✅ Companies fetched:", companyItems.length);
        
        const agentGroups = await Promise.all(
          companyItems.map((company) => api.getAgentsByCompany(company._id).catch(() => []))
        );
        const totalAgents = agentGroups.reduce((sum, group) => sum + group.length, 0);

        if (mounted) {
          setItems(
            companyItems.map((company, index) => ({
              company,
              agent: agentGroups[index]?.[0],
            }))
          );
          setAgentCount(totalAgents);
        }
      } catch (err) {
        console.error("❌ Dashboard error:", err);
        if (mounted) {
          // If unauthorized, redirect to login
          if (err instanceof Error && err.message.includes("401")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            router.replace("/login");
          } else {
            setError(err instanceof Error ? err.message : "Unable to load dashboard");
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [router]);

  const stats = useMemo(
    () => [
      { label: "Companies", value: items.length },
      {
        label: "Agents",
        value: agentCount,
      },
    ],
    [agentCount, items.length]
  );

  const handleCreateCompany = () => {
    router.push("/dashboard/company/create");
  };

  const handleOpenAgent = (agentId: string) => {
    router.push(`/dashboard/agents/${agentId}`);
  };

  // ✅ Show loading while checking token
  if (loading && !error && items.length === 0) {
    return (
      <div className="space-y-8">
        <div className="p-6 md:p-8 rounded-2xl border">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-10 w-64" />
              <Skeleton className="mt-4 h-5 w-96" />
            </div>
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CompanySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div
        className="p-6 md:p-8 rounded-2xl border transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.06) 100%), var(--surface-1)",
          border: "1px solid rgba(251,191,36,0.15)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p
              className="text-[0.65rem] uppercase tracking-[0.12em] font-semibold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--amber-500)" }}
            >
              Overview
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              Your workspace
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Create tenant companies, let the backend auto-create a default assistant, and move from setup to live chatbot testing in a few clicks.
            </p>
          </div>
          <button
            onClick={handleCreateCompany}
            className="px-6 py-3 text-sm font-extrabold rounded-full transition-all duration-300 whitespace-nowrap"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              color: "var(--surface-0)",
              boxShadow: "0 0 24px rgba(251,191,36,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(251,191,36,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(251,191,36,0.2)";
            }}
          >
            New company +
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-2xl border"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <p style={{ color: "#fda4af", fontSize: "0.9rem" }}>{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.replace("/login");
            }}
            className="mt-3 text-sm font-medium"
            style={{ color: "var(--amber-500)" }}
          >
            Go back to login →
          </button>
        </div>
      )}

      {/* Stats row */}
      {!loading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
              }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
                {stat.label}
              </p>
              <p
                className="text-4xl md:text-5xl font-extrabold"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
              >
                {stat.value}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Skeleton loading */}
      {loading && items.length === 0 && !error ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CompanySkeleton key={index} />
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {!loading && items.length === 0 && !error && (
        <Card
          className="p-10 text-center border-dashed transition-all duration-300"
          style={{
            background: "var(--surface-1)",
            border: "2px dashed rgba(251,191,36,0.25)",
            borderRadius: "20px",
          }}
        >
          <p
            className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold"
            style={{ color: "var(--amber-500)", fontFamily: "Syne, sans-serif" }}
          >
            Get started
          </p>
          <h2
            className="mt-4 text-2xl md:text-3xl font-extrabold"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            No company found. Create your first company.
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            A new company will automatically receive a default assistant for testing and RAG setup.
          </p>
          <button
            onClick={handleCreateCompany}
            className="mt-6 px-6 py-3 text-sm font-extrabold rounded-full transition-all duration-300"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              color: "var(--surface-0)",
              boxShadow: "0 0 24px rgba(251,191,36,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(251,191,36,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(251,191,36,0.2)";
            }}
          >
            Create your first company
          </button>
        </Card>
      )}

      {/* Company cards grid */}
      {!loading && items.length > 0 && (
        <CompanyCardsGrid items={items} onOpenAgent={handleOpenAgent} />
      )}
    </div>
  );
}