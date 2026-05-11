
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await api.login(email.trim(), password);

      // api.ts ka request() already payload.data return karta hai
      // toh result = {success, user, accessToken, refreshToken}
      const payload = result as {
        data?: { accessToken?: string; refreshToken?: string };
        accessToken?: string;
        refreshToken?: string;
      };
      const authData = payload.data ?? payload;
      const accessToken = authData?.accessToken;
      const refreshToken = authData?.refreshToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        router.replace("/dashboard");
        window.location.href = "/dashboard";
        return;
      } else {
        setError("Login failed — no token received");
      }
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
              onClick={() => router.push("/register")}
              className="font-medium transition-colors"
              style={{ color: "var(--amber-400)" }}
              type="button"
            >
              Create one
            </button>
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@company.com"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLogin(); } }}
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
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLogin(); } }}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl border" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
              <p className="text-sm" style={{ color: "#fda4af" }}>{error}</p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
            type="button"
            style={{
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              color: "var(--surface-0)",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              borderRadius: "100px",
              boxShadow: "0 0 24px rgba(251,191,36,0.2)",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      </Card>
    </AuthShell>
  );
}
