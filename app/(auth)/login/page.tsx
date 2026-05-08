"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/layout/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.login(email.trim(), password);

      // Tokens save karo (api.ts bhi save karta hai — double safety)
      if ((result as any)?.accessToken) {
        localStorage.setItem("accessToken", (result as any).accessToken);
      }
      if ((result as any)?.refreshToken) {
        localStorage.setItem("refreshToken", (result as any).refreshToken);
      }

      // Companies fetch karo — null/empty dono handle
      let list: any[] = [];
      try {
        const companies = await api.getCompanies();
        list = Array.isArray(companies) ? companies : [];
      } catch {
        list = [];
      }

      router.replace(list.length > 0 ? "/dashboard" : "/dashboard/company/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card
        className="p-6 md:p-8"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
        }}
      >
        <div className="space-y-1 mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.replace("/register")}
              className="font-medium transition-colors"
              style={{ color: "var(--amber-400)" }}
            >
              Create one
            </button>
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl border"
              style={{
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#fda4af" }}>{error}</p>
            </div>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              color: "var(--surface-0)",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              borderRadius: "100px",
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
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Card>
    </AuthShell>
  );
}
