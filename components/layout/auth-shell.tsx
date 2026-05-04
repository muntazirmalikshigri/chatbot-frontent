import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Subtle amber radial glow on left */}
      <div
        className="absolute left-0 top-0 h-full w-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 20% 50%, rgba(251,191,36,0.08), transparent 60%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-2 items-center relative z-10">
        {/* Left panel */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8 md:p-10 transition-all duration-300 hover:border-[rgba(251,191,36,0.2)]">
          {/* Logo mark */}
          <div
            className="inline-flex items-center justify-center w-8 h-8 rounded-md mr-2"
            style={{
              background: "linear-gradient(135deg, var(--amber-400), var(--orange-500))",
            }}
          >
            <span className="font-extrabold text-sm" style={{ fontFamily: "Syne, sans-serif", color: "var(--surface-0)" }}>N</span>
          </div>
          <span className="font-extrabold text-lg ml-2" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
            NeuralDesk
          </span>

          {/* Heading */}
          <h1
            className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            Your AI workspace awaits.
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Access your multi-tenant dashboard, manage company assistants, and test chatbot conversations with real knowledge base.
          </p>

          {/* Feature checklist */}
          <div className="mt-8 space-y-3">
            {[
              "Multi-tenant company management",
              "Knowledge-based AI assistants",
              "Public chat sharing",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.3)",
                  }}
                >
                  <svg className="w-3 h-3" style={{ color: "var(--amber-400)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right panel */}
        <section>{children}</section>
      </div>
    </main>
  );
}
