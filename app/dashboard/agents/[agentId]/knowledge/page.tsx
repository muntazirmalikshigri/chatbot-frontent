"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AgentKnowledgeRedirectPage() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const agent = await api.getAgent(params.agentId);
        const companyId = typeof agent.companyId === "string" ? agent.companyId : agent.companyId._id;
        if (mounted) {
          router.replace(`/dashboard/companies/${companyId}`);
        }
      } catch {
        if (mounted) {
          router.replace("/dashboard/companies");
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [params.agentId, router]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur-xl">
      Opening the company knowledge base...
    </div>
  );
}
