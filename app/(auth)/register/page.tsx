"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { AuthShell } from "@/components/layout/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    consent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phoneNumber.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!form.consent) {
      setError("You must agree to the terms to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.register({
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        consent: form.consent,
      });
      // New user has no company — always go to create company
      router.replace("/dashboard/company/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface-2)",
    border: "1px solid var(--border)", borderRadius: "12px",
    padding: "12px 16px", fontSize: "0.875rem",
    color: "var(--text-primary)", outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", fontWeight: 500,
    color: "var(--text-secondary)", letterSpacing: "0.06em",
    textTransform: "uppercase", display: "block", marginBottom: "6px",
  };

  return (
    <AuthShell>
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "24px", padding: "2rem 2.5rem",
      }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Create account
          </h2>
          <p style={{ marginTop: "6px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--amber-400)", textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Full name</label>
            <input
              type="text" value={form.name} placeholder="John Doe"
              onChange={e => set("name", e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={form.email} placeholder="you@company.com"
              onChange={e => set("email", e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone number</label>
            <input
              type="tel" value={form.phoneNumber} placeholder="+92 300 0000000"
              onChange={e => set("phoneNumber", e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password" value={form.password} placeholder="Min 8 characters"
              onChange={e => set("password", e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Consent */}
          <label style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            cursor: "pointer", padding: "12px 14px",
            background: "var(--surface-2)", borderRadius: "12px",
            border: `1px solid ${form.consent ? "rgba(251,191,36,0.3)" : "var(--border)"}`,
            transition: "border-color 0.2s",
          }}>
            <div
              onClick={() => set("consent", !form.consent)}
              style={{
                width: 18, height: 18, borderRadius: "5px", flexShrink: 0, marginTop: 1,
                background: form.consent ? "linear-gradient(135deg, var(--amber-500), var(--orange-500))" : "var(--surface-3)",
                border: `1px solid ${form.consent ? "transparent" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {form.consent && <span style={{ color: "#09090b", fontSize: "11px", fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              I agree to the{" "}
              <span style={{ color: "var(--amber-400)" }}>Terms of Service</span>
              {" "}and{" "}
              <span style={{ color: "var(--amber-400)" }}>Privacy Policy</span>
            </span>
          </label>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px", padding: "10px 14px",
              fontSize: "0.82rem", color: "#fca5a5",
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: "4px", padding: "13px", border: "none", borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "var(--surface-3)" : "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
              color: loading ? "var(--text-muted)" : "#09090b",
              boxShadow: loading ? "none" : "0 0 24px rgba(251,191,36,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
