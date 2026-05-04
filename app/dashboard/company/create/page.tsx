// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { api } from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// export default function CreateCompanyPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const submit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!name.trim()) {
//       setError("Company name is required.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await api.createCompany({
//         name: name.trim(),
//         description: description.trim(),
//       });
//       router.push(`/dashboard/agents/${result.defaultAgent._id}/chat`);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to create company");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
//       <div className="mb-6">
//         <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Company setup</p>
//         <h1 className="mt-3 text-3xl font-semibold text-white">Create Company</h1>
//         <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
//           Add your first tenant. A friendly default assistant will be created automatically so you can start testing right away.
//         </p>
//       </div>

//       <form onSubmit={submit} className="space-y-5">
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-slate-200">Company name</label>
//           <Input
//             value={name}
//             onChange={(event) => setName(event.target.value)}
//             placeholder="Acme Support"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium text-slate-200">Description</label>
//           <Textarea
//             rows={6}
//             value={description}
//             onChange={(event) => setDescription(event.target.value)}
//             placeholder="Describe what this company does..."
//           />
//         </div>

//         {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

//         <Button type="submit" disabled={loading} className="w-full">
//           {loading ? "Creating..." : "Create Company"}
//         </Button>
//       </form>
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) { setError("Company name is required."); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await api.createCompany({
        name: name.trim(),
        description: description.trim(),
      });
      router.replace(`/dashboard/agents/${result.defaultAgent._id}/chat`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create company");
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
    fontFamily: "DM Sans, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", fontWeight: 500,
    color: "var(--text-secondary)", letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: "6px",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "80vh",
    }}>
      <div style={{
        width: "100%", maxWidth: "560px",
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "24px", padding: "2.5rem",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600,
          }}>
            Company setup
          </p>
          <h1 style={{
            marginTop: "8px", fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: "1.8rem", color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>
            Create your company
          </h1>
          <p style={{
            marginTop: "8px", fontSize: "0.875rem", lineHeight: 1.65,
            color: "var(--text-secondary)", maxWidth: "44ch",
          }}>
            Add your first tenant. A default AI assistant will be created automatically so you can start testing right away.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Company name */}
          <div>
            <label style={labelStyle}>Company name</label>
            <input
              type="text" value={name} placeholder="e.g. Acme Support"
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={5} value={description}
              placeholder="Describe what this company does..."
              onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

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
              background: loading
                ? "var(--surface-3)"
                : "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
              color: loading ? "var(--text-muted)" : "#09090b",
              boxShadow: loading ? "none" : "0 0 24px rgba(251,191,36,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(251,191,36,0.35)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(251,191,36,0.2)"; }}
          >
            {loading ? "Creating company..." : "Create company →"}
          </button>
        </form>
      </div>
    </div>
  );
}