"use client";

import { useParams } from "next/navigation";
import { ChatBox } from "@/components/chat/chat-box";

export default function PublicChatPage() {
  const params = useParams<{ agentId: string }>();

  return (
    <main
      className="min-h-screen px-4 py-6 md:px-6 lg:px-10 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% -20%, rgba(251,191,36,0.1), transparent 60%), var(--surface-0)",
      }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Top bar */}
        <div
          className="mb-6 p-5 rounded-2xl border flex items-center justify-between"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
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
            <span className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
              NeuralDesk
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#4ade80",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
            Public · No auth required
          </div>
        </div>

        {/* Chat box */}
        <ChatBox
          agentId={params.agentId}
          title="Agent conversation"
          subtitle="Powered by company knowledge"
        />

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Powered by{" "}
            <span className="font-semibold" style={{ color: "var(--amber-400)", fontFamily: "Syne, sans-serif" }}>
              NeuralDesk
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
