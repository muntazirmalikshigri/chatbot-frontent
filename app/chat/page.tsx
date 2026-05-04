"use client";

import { useRouter } from "next/navigation";

export default function ChatIndexPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div
        className="max-w-xl w-full p-8 md:p-10 rounded-2xl border text-center"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Amber icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: "linear-gradient(135deg, var(--amber-400), var(--orange-500))",
          }}
        >
          <span className="text-3xl" style={{ color: "var(--surface-0)" }}>
            ◉
          </span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-extrabold"
          style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
        >
          Choose an agent link
        </h1>

        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          This route needs an agent ID. Open the shared chatbot URL in the form{" "}
          <code
            className="px-2 py-1 rounded"
            style={{
              background: "var(--surface-2)",
              color: "var(--amber-400)",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
          >
            /chat/[agentId]
          </code>
        </p>

        <button
          onClick={() => router.replace("/")}
          className="mt-8 px-6 py-3 text-sm font-extrabold rounded-full transition-all duration-300 mx-auto block w-fit"
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
          Go home →
        </button>
      </div>
    </main>
  );
}
