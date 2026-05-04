"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  { icon: "◈", title: "Multi-tenant", desc: "Manage multiple companies from one dashboard" },
  { icon: "◎", title: "Smart agents", desc: "Auto-generated assistants per company" },
  { icon: "◉", title: "Public chatbot", desc: "Share /chat/[agentId] — no auth needed" },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3rem 1.5rem", position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(251,191,36,0.12), transparent 60%), var(--surface-0)",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "1100px", zIndex: 1 }}>

        {/* Top badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: "100px", padding: "6px 16px", marginBottom: "2.5rem",
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.5s ease forwards" : "none",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber-400)", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-400)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            AI Chatbot Platform
          </span>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>

          {/* Hero */}
          <div style={{
            opacity: mounted ? 1 : 0,
            animation: mounted ? "fadeUp 0.6s ease 0.1s forwards" : "none",
          }}>
            <h1 style={{
              fontFamily: "Syne, sans-serif", fontWeight: 800,
              fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05,
              letterSpacing: "-0.03em", color: "var(--text-primary)", maxWidth: "16ch",
            }}>
              Deploy smart agents.{" "}
              <span style={{
                background: "linear-gradient(135deg, var(--amber-400), var(--orange-500))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                At scale.
              </span>
            </h1>

            <p style={{
              marginTop: "1.5rem", fontSize: "1.05rem", lineHeight: 1.75,
              color: "var(--text-secondary)", maxWidth: "52ch",
            }}>
              Build, manage, and deploy AI assistants across multiple company tenants.
              Upload knowledge, test in real-time, and share public chatbot links instantly.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "2.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => router.push("/login")}
                style={{
                  padding: "13px 28px", borderRadius: "100px", border: "none",
                  background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
                  color: "#09090b", fontFamily: "Syne, sans-serif", fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer",
                  boxShadow: "0 0 28px rgba(251,191,36,0.25)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(251,191,36,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(251,191,36,0.25)"; }}
              >
                Sign in →
              </button>

              <button
                onClick={() => router.push("/register")}
                style={{
                  padding: "13px 28px", borderRadius: "100px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-secondary)", fontFamily: "Syne, sans-serif",
                  fontWeight: 500, fontSize: "0.9rem", cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.35)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(251,191,36,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
              >
                Create account
              </button>

              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Free to get started
              </span>
            </div>
          </div>

          {/* Feature cards + public route */}
          <div style={{
            display: "grid", gap: "12px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            opacity: mounted ? 1 : 0,
            animation: mounted ? "fadeUp 0.7s ease 0.25s forwards" : "none",
          }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: "var(--surface-1)", border: "1px solid var(--border)",
                borderRadius: "18px", padding: "22px",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: "1.3rem", color: "var(--amber-400)" }}>{f.icon}</span>
                <p style={{ marginTop: "10px", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{f.title}</p>
                <p style={{ marginTop: "5px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}

            {/* Public route card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(249,115,22,0.04))",
              border: "1px solid rgba(251,191,36,0.18)", borderRadius: "18px", padding: "22px",
            }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>Public route</p>
              <code style={{
                display: "block", marginTop: "10px", fontSize: "0.82rem",
                color: "var(--amber-300)", background: "rgba(0,0,0,0.25)",
                borderRadius: "8px", padding: "8px 12px", fontFamily: "monospace",
              }}>
                /chat/[agentId]
              </code>
              <p style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                No auth required for end users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
