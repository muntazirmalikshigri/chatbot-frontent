// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { api } from "@/lib/api";
// import type { Agent, Company } from "@/lib/types";

// function formatDate(value?: string) {
//   if (!value) return "Recently created";
//   return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
// }

// export default function CompanyDetailPage() {
//   const params = useParams<{ companyId: string }>();
//   const router = useRouter();
//   const companyId = params.companyId;
//   const [company, setCompany] = useState<Company | null>(null);
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [text, setText] = useState("");
//   const [sourceName, setSourceName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [status, setStatus] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         const [companyData, agentData] = await Promise.all([
//           api.getCompany(companyId),
//           api.getAgentsByCompany(companyId),
//         ]);
//         if (mounted) { setCompany(companyData); setAgents(agentData); }
//       } catch (err) {
//         if (mounted) setError(err instanceof Error ? err.message : "Unable to load company");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     void load();
//     return () => { mounted = false; };
//   }, [companyId]);

//   const defaultAgent = useMemo(() => {
//     if (!company) return null;
//     return agents.find(a => a.knowledgeBaseId === company.defaultKnowledgeBaseId) ?? agents[0] ?? null;
//   }, [agents, company]);

//   const uploadText = async () => {
//     if (!defaultAgent || !text.trim()) return;
//     setSaving(true); setStatus(null);
//     try {
//       const result = await api.uploadKnowledgeText(defaultAgent._id, {
//         text: text.trim(),
//         sourceName: sourceName.trim() || `${company?.name ?? "company"} knowledge`,
//       });
//       setStatus(`✓ Uploaded ${result.chunksCreated} chunks to knowledge base.`);
//       setText("");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to upload knowledge");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return (
//     <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", padding: "3rem" }}>
//       <div style={{ width: 20, height: 20, border: "2px solid var(--surface-4)", borderTopColor: "var(--amber-400)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       Loading company...
//     </div>
//   );

//   if (error) return (
//     <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px", color: "#fca5a5", fontSize: "0.875rem" }}>
//       {error}
//     </div>
//   );

//   if (!company) return <div style={{ color: "var(--text-muted)" }}>Company not found.</div>;

//   const inputStyle: React.CSSProperties = {
//     width: "100%", background: "var(--surface-2)",
//     border: "1px solid var(--border)", borderRadius: "12px",
//     padding: "12px 16px", fontSize: "0.875rem",
//     color: "var(--text-primary)", outline: "none",
//     transition: "border-color 0.2s", fontFamily: "DM Sans, sans-serif",
//   };

//   const labelStyle: React.CSSProperties = {
//     display: "block", fontSize: "0.75rem", fontWeight: 500,
//     color: "var(--text-secondary)", letterSpacing: "0.06em",
//     textTransform: "uppercase", marginBottom: "6px",
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

//       {/* Header */}
//       <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
//           <div>
//             <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
//               Company knowledge
//             </p>
//             <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", marginTop: "8px", letterSpacing: "-0.02em" }}>
//               {company.name}
//             </h1>
//             <p style={{ marginTop: "8px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "52ch" }}>
//               Upload company knowledge here — it will power the default assistant for this tenant.
//             </p>
//           </div>
//           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//             <button
//               onClick={() => router.replace("/dashboard")}
//               style={{
//                 padding: "9px 18px", borderRadius: "10px",
//                 background: "transparent", border: "1px solid var(--border)",
//                 cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)",
//                 transition: "border-color 0.15s, color 0.15s",
//               }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
//             >
//               ← Dashboard
//             </button>
//             {defaultAgent && (
//               <button
//                 onClick={() => router.replace(`/dashboard/agents/${defaultAgent._id}/chat`)}
//                 style={{
//                   padding: "9px 18px", borderRadius: "10px",
//                   background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
//                   border: "none", cursor: "pointer",
//                   fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#09090b",
//                   boxShadow: "0 0 16px rgba(251,191,36,0.2)",
//                 }}
//               >
//                 Open assistant →
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginTop: "1.5rem" }}>
//           {[
//             { label: "Created", value: formatDate(company.createdAt) },
//             { label: "Knowledge base", value: company.defaultKnowledgeBaseId ? "Active" : "Pending" },
//             { label: "Assistants", value: String(agents.length) },
//           ].map(s => (
//             <div key={s.label} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 16px" }}>
//               <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>{s.label}</p>
//               <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>{s.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Upload knowledge */}
//       <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
//         <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>
//           Upload company knowledge
//         </h2>
//         <p style={{ marginTop: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
//           This content is attached to the company&apos;s default assistant and used for RAG responses.
//         </p>

//         <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "1.5rem" }}>
//           <div>
//             <label style={labelStyle}>Source name</label>
//             <input
//               type="text" value={sourceName} placeholder="e.g. Company FAQ"
//               onChange={e => setSourceName(e.target.value)} style={inputStyle}
//               onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
//               onBlur={e => (e.target.style.borderColor = "var(--border)")}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Text knowledge</label>
//             <textarea
//               rows={10} value={text}
//               placeholder="Paste policies, FAQ, product info, or support docs..."
//               onChange={e => setText(e.target.value)}
//               style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
//               onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
//               onBlur={e => (e.target.style.borderColor = "var(--border)")}
//             />
//           </div>

//           {status && (
//             <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.82rem", color: "#86efac" }}>
//               {status}
//             </div>
//           )}

//           {error && (
//             <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.82rem", color: "#fca5a5" }}>
//               {error}
//             </div>
//           )}

//           <button
//             onClick={() => void uploadText()}
//             disabled={!text.trim() || saving}
//             style={{
//               padding: "13px", border: "none", borderRadius: "12px",
//               cursor: !text.trim() || saving ? "not-allowed" : "pointer",
//               background: !text.trim() || saving ? "var(--surface-3)" : "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
//               fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
//               color: !text.trim() || saving ? "var(--text-muted)" : "#09090b",
//               boxShadow: !text.trim() || saving ? "none" : "0 0 24px rgba(251,191,36,0.2)",
//               transition: "transform 0.2s",
//             }}
//             onMouseEnter={e => { if (text.trim() && !saving) e.currentTarget.style.transform = "translateY(-1px)"; }}
//             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
//           >
//             {saving ? "Uploading..." : "Upload to knowledge base →"}
//           </button>
//         </div>
//       </div>

//       {/* Default agent info */}
//       {defaultAgent && (
//         <div style={{
//           background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)",
//           borderRadius: "20px", padding: "1.5rem 2rem",
//           display: "flex", gap: "14px", alignItems: "flex-start",
//         }}>
//           <span style={{ color: "var(--amber-500)", fontSize: "18px", flexShrink: 0, marginTop: 2 }}>◉</span>
//           <div>
//             <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
//               {defaultAgent.name}
//             </p>
//             <p style={{ marginTop: "6px", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
//               {defaultAgent.instructions}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Agent, Company, KnowledgeChunk } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "Recently created";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function CompanyDetailPage() {
  const params = useParams<{ companyId: string }>();
  const router = useRouter();
  const companyId = params.companyId;

  const [company, setCompany] = useState<Company | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeChunk[]>([]);
  const [text, setText] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [updateText, setUpdateText] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [companyData, agentData] = await Promise.all([
          api.getCompany(companyId),
          api.getAgentsByCompany(companyId),
        ]);
        if (mounted) { setCompany(companyData); setAgents(agentData); }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load company");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [companyId]);

  const defaultAgent = useMemo(() => {
    if (!company) return null;
    return agents.find(a => a.knowledgeBaseId === company.defaultKnowledgeBaseId) ?? agents[0] ?? null;
  }, [agents, company]);

  useEffect(() => {
    if (!defaultAgent) return;
    let mounted = true;
    api.getKnowledge(defaultAgent._id).then(data => { if (mounted) setKnowledge(data); }).catch(() => {});
    return () => { mounted = false; };
  }, [defaultAgent]);

  const uniqueSources = useMemo(() => {
    const seen = new Set<string>();
    return knowledge.filter(k => {
      const name = k.sourceName || "knowledge";
      if (seen.has(name)) return false;
      seen.add(name); return true;
    }).map(k => k.sourceName || "knowledge");
  }, [knowledge]);

  const refreshKnowledge = async () => {
    if (!defaultAgent) return;
    const data = await api.getKnowledge(defaultAgent._id);
    setKnowledge(data);
  };

  const uploadText = async () => {
    if (!defaultAgent || !text.trim()) return;
    setSaving(true); setStatus(null); setError(null);
    try {
      const result = await api.uploadKnowledgeText(defaultAgent._id, {
        text: text.trim(),
        sourceName: sourceName.trim() || `${company?.name ?? "company"} knowledge`,
      });
      setStatus(`✓ Uploaded ${result.chunksCreated} chunks to knowledge base.`);
      setText(""); setSourceName("");
      await refreshKnowledge();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload knowledge");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!defaultAgent || !selectedSource || !updateText.trim()) return;
    setUpdating(true); setStatus(null); setError(null);
    try {
      await api.deleteKnowledgeBySource(defaultAgent._id, selectedSource);
      const result = await api.uploadKnowledgeText(defaultAgent._id, {
        text: updateText.trim(),
        sourceName: selectedSource,
      });
      setStatus(`✓ "${selectedSource}" updated — ${result.chunksCreated} new chunks created.`);
      setUpdateMode(false); setSelectedSource(""); setUpdateText("");
      await refreshKnowledge();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update knowledge");
    } finally {
      setUpdating(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface-2)",
    border: "1px solid var(--border)", borderRadius: "12px",
    padding: "12px 16px", fontSize: "0.875rem",
    color: "var(--text-primary)", outline: "none",
    transition: "border-color 0.2s", fontFamily: "DM Sans, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", fontWeight: 500,
    color: "var(--text-secondary)", letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: "6px",
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", padding: "3rem" }}>
      <div style={{ width: 20, height: 20, border: "2px solid var(--surface-4)", borderTopColor: "var(--amber-400)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading company...
    </div>
  );

  if (!company) return <div style={{ color: "var(--text-muted)" }}>Company not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>Company knowledge</p>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", marginTop: "8px", letterSpacing: "-0.02em" }}>{company.name}</h1>
            <p style={{ marginTop: "8px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "52ch" }}>
              Upload and manage company knowledge — it powers the default assistant for this tenant.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => router.replace("/dashboard")}
              style={{ padding: "9px 18px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)", transition: "border-color 0.15s, color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
              ← Dashboard
            </button>


            <button
            onClick={() => router.replace(`/dashboard/companies/${companyId}/insights`)}
            style={{
            padding: "9px 18px", borderRadius: "10px",
            background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
            cursor: "pointer", fontSize: "0.85rem", color: "var(--amber-400)", fontWeight: 500,
            }}
            >
            📊 Insights
           </button>

          <button
            onClick={() => router.replace(`/dashboard/companies/${companyId}/whatsapp`)}
            style={{
            padding: "9px 18px", borderRadius: "10px",
            background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)",
            cursor: "pointer", fontSize: "0.85rem", color: "#4ade80", fontWeight: 500,
           }}
           >
           WhatsApp
          </button>

            {defaultAgent && (
              <button onClick={() => router.replace(`/dashboard/agents/${defaultAgent._id}/chat`)}
                style={{ padding: "9px 18px", borderRadius: "10px", background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))", border: "none", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#09090b", boxShadow: "0 0 16px rgba(251,191,36,0.2)" }}>
                Open assistant →
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "1.5rem" }}>
          {[
            { label: "Created", value: formatDate(company.createdAt) },
            { label: "Knowledge base", value: company.defaultKnowledgeBaseId ? "Active" : "Pending" },
            { label: "Sources", value: String(uniqueSources.length) },
            { label: "Total chunks", value: String(knowledge.length) },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 16px" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>{s.label}</p>
              <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status / Error */}
      {status && <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.85rem", color: "#86efac" }}>{status}</div>}
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.85rem", color: "#fca5a5" }}>{error}</div>}

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { label: "+ Upload knowledge", mode: false },
          { label: "✎ Update knowledge", mode: true },
        ].map(tab => (
          <button key={tab.label} onClick={() => { setUpdateMode(tab.mode); setError(null); setStatus(null); }}
            style={{
              padding: "9px 20px", borderRadius: "10px", cursor: "pointer",
              fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.85rem",
              border: updateMode === tab.mode ? "none" : "1px solid var(--border)",
              background: updateMode === tab.mode ? "linear-gradient(135deg, var(--amber-500), var(--orange-500))" : "var(--surface-2)",
              color: updateMode === tab.mode ? "#09090b" : "var(--text-secondary)",
              transition: "all 0.2s",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Upload */}
      {!updateMode && (
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>Upload company knowledge</h2>
          <p style={{ marginTop: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Paste text content — it will be chunked and stored for RAG responses.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Source name</label>
              <input type="text" value={sourceName} placeholder="e.g. Company FAQ, Services, Pricing"
                onChange={e => setSourceName(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            </div>
            <div>
              <label style={labelStyle}>Knowledge text</label>
              <textarea rows={10} value={text} placeholder="Paste policies, FAQ, product info, or support docs..."
                onChange={e => setText(e.target.value)}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            </div>
            <button onClick={() => void uploadText()} disabled={!text.trim() || saving}
              style={{
                padding: "13px", border: "none", borderRadius: "12px",
                cursor: !text.trim() || saving ? "not-allowed" : "pointer",
                background: !text.trim() || saving ? "var(--surface-3)" : "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
                fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                color: !text.trim() || saving ? "var(--text-muted)" : "#09090b",
              }}>
              {saving ? "Uploading..." : "Upload to knowledge base →"}
            </button>
          </div>
        </div>
      )}

      {/* Update */}
      {updateMode && (
        <div style={{ background: "var(--surface-1)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: "20px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>Update existing knowledge</h2>
          <p style={{ marginTop: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Select a source, paste new content — old chunks deleted, new ones created.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Select source to update</label>
              {uniqueSources.length === 0 ? (
                <div style={{ background: "var(--surface-2)", border: "1px dashed rgba(251,191,36,0.15)", borderRadius: "12px", padding: "16px", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
                  No knowledge sources found. Upload knowledge first.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {uniqueSources.map(source => (
                    <button key={source} onClick={() => setSelectedSource(source)}
                      style={{
                        padding: "12px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
                        border: selectedSource === source ? "1px solid rgba(251,191,36,0.4)" : "1px solid var(--border)",
                        background: selectedSource === source ? "rgba(251,191,36,0.08)" : "var(--surface-2)",
                        color: selectedSource === source ? "var(--amber-300)" : "var(--text-secondary)",
                        fontSize: "0.875rem", fontWeight: selectedSource === source ? 500 : 400,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                      <span>{source}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {knowledge.filter(k => (k.sourceName || "knowledge") === source).length} chunks
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedSource && (
              <>
                <div>
                  <label style={labelStyle}>New content for "{selectedSource}"</label>
                  <textarea rows={10} value={updateText}
                    placeholder={`Paste updated content for "${selectedSource}"...`}
                    onChange={e => setUpdateText(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                    onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.4)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>

                <div style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.8rem", color: "var(--amber-400)", display: "flex", gap: "8px" }}>
                  <span>⚠</span>
                  <span>All existing chunks for "{selectedSource}" will be deleted and replaced.</span>
                </div>

                <button onClick={() => void handleUpdate()} disabled={!updateText.trim() || updating}
                  style={{
                    padding: "13px", border: "none", borderRadius: "12px",
                    cursor: !updateText.trim() || updating ? "not-allowed" : "pointer",
                    background: !updateText.trim() || updating ? "var(--surface-3)" : "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
                    fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    color: !updateText.trim() || updating ? "var(--text-muted)" : "#09090b",
                  }}>
                  {updating ? "Updating..." : `Update "${selectedSource}" →`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sources list */}
      {uniqueSources.length > 0 && (
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>Uploaded sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {uniqueSources.map(source => (
              <div key={source} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "var(--amber-400)", fontSize: "14px" }}>◈</span>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{source}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {knowledge.filter(k => (k.sourceName || "knowledge") === source).length} chunks
                    </p>
                  </div>
                </div>
                <button onClick={() => { setUpdateMode(true); setSelectedSource(source); setError(null); setStatus(null); }}
                  style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", cursor: "pointer", fontSize: "0.78rem", color: "var(--amber-400)", fontWeight: 500, transition: "background 0.15s", flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,191,36,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(251,191,36,0.08)")}>
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default agent info */}
      {defaultAgent && (
        <div style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: "20px", padding: "1.5rem 2rem", display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--amber-500)", fontSize: "18px", flexShrink: 0, marginTop: 2 }}>◉</span>
          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{defaultAgent.name}</p>
            <p style={{ marginTop: "6px", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{defaultAgent.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}