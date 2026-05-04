// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { api } from "@/lib/api";

// type WAStatus = {
//   status: 'connecting' | 'connected' | 'disconnected';
//   isConnected: boolean;
//   phoneNumber: string | null;
//   connectedAt: string | null;
// };

// export default function WhatsAppPage() {
//   const params = useParams<{ companyId: string }>();
//   const router = useRouter();
//   const companyId = params.companyId;

//   const [status, setStatus] = useState<WAStatus | null>(null);
//   const [qr, setQr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [connecting, setConnecting] = useState(false);
//   const [disconnecting, setDisconnecting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const pollRef = useRef<NodeJS.Timeout | null>(null);

//   const fetchStatus = async () => {
//     try {
//       const data = await api.getWhatsAppStatus(companyId);
//       setStatus(data);
//       return data;
//     } catch {
//       return null;
//     }
//   };

//   // const fetchQR = async () => {
//   //   try {
//   //     const data = await api.getWhatsAppQR(companyId);
//   //     if (data.qr) setQr(data.qr);
//   //     if (data.status === 'connected') {
//   //       setQr(null);
//   //       await fetchStatus();
//   //       stopPolling();
//   //     }
//   //     return data;
//   //   } catch {
//   //     return null;
//   //   }
//   // };

//   const fetchQR = async () => {
//   try {
//     const data = await api.getWhatsAppQR(companyId);
//     console.log('QR data:', data); // debug
//     if (data?.qr) {
//       setQr(data.qr);
//     }
//     if (data?.status === 'connected') {
//       setQr(null);
//       setConnecting(false);
//       await fetchStatus();
//       stopPolling();
//     }
//     return data;
//   } catch (err) {
//     console.error('QR fetch error:', err);
//     return null;
//   }
// };

//   const stopPolling = () => {
//     if (pollRef.current) {
//       clearInterval(pollRef.current);
//       pollRef.current = null;
//     }
//   };

//   const startPolling = () => {
//     stopPolling();
//     pollRef.current = setInterval(async () => {
//       const qrData = await fetchQR();
//       if (qrData?.status === 'connected') {
//         stopPolling();
//         setConnecting(false);
//         await fetchStatus();
//       }
//     }, 3000);
//   };

//   useEffect(() => {
//     fetchStatus().finally(() => setLoading(false));
//     return () => stopPolling();
//   }, [companyId]);


//     const handleConnect = async () => {
//     setConnecting(true);
//     setError(null);
//     setQr(null);
//     try {
//     await api.connectWhatsApp(companyId);
//     // Wait 3 seconds then start polling
//     setTimeout(() => {
//       startPolling();
//     }, 3000);
//     } catch (err) {
//     setError(err instanceof Error ? err.message : "Connection failed");
//     setConnecting(false);
//     }
//     };

//   const handleDisconnect = async () => {
//     if (!confirm("Are you sure you want to disconnect WhatsApp?")) return;
//     setDisconnecting(true);
//     setError(null);
//     try {
//       await api.disconnectWhatsApp(companyId);
//       setStatus(prev => prev ? { ...prev, status: 'disconnected', isConnected: false, phoneNumber: null } : null);
//       setQr(null);
//       stopPolling();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Disconnect failed");
//     } finally {
//       setDisconnecting(false);
//     }
//   };

//   if (loading) return (
//     <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", padding: "3rem" }}>
//       <div style={{ width: 20, height: 20, border: "2px solid var(--surface-4)", borderTopColor: "var(--amber-400)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       Loading WhatsApp...
//     </div>
//   );

//   const isConnected = status?.isConnected || status?.status === 'connected';

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>

//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
//         <div>
//           <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>Integration</p>
//           <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--text-primary)", marginTop: "6px", letterSpacing: "-0.02em" }}>
//             WhatsApp Connect
//           </h1>
//         </div>
//         <button
//           onClick={() => router.replace(`/dashboard/companies/${companyId}`)}
//           style={{ padding: "9px 18px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}
//           onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
//           onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Status */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: "10px",
//         padding: "14px 18px", borderRadius: "12px",
//         background: isConnected ? "rgba(37,211,102,0.08)" : connecting ? "rgba(251,191,36,0.08)" : "var(--surface-2)",
//         border: isConnected ? "1px solid rgba(37,211,102,0.2)" : connecting ? "1px solid rgba(251,191,36,0.2)" : "1px solid var(--border)",
//       }}>
//         <div style={{
//           width: 8, height: 8, borderRadius: "50%",
//           background: isConnected ? "#25d366" : connecting ? "var(--amber-400)" : "var(--text-muted)",
//           animation: connecting ? "pulse 1s infinite" : "none",
//         }} />
//         <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
//         <div>
//           <p style={{ fontSize: "0.875rem", fontWeight: 500, color: isConnected ? "#4ade80" : connecting ? "var(--amber-300)" : "var(--text-muted)" }}>
//             {isConnected ? `Connected — ${status?.phoneNumber ?? ""}` : connecting ? "Connecting... Scan QR code" : "Not connected"}
//           </p>
//           {isConnected && status?.connectedAt && (
//             <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
//               Since {new Date(status.connectedAt).toLocaleDateString()}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Error */}
//       {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.85rem", color: "#fca5a5" }}>{error}</div>}

//       {/* Connected state */}
//       {isConnected ? (
//         <div style={{ background: "var(--surface-1)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "20px", padding: "2rem" }}>
//           <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
//             <span style={{ fontSize: "2rem" }}>✅</span>
//             <div>
//               <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
//                 WhatsApp is active!
//               </h2>
//               <p style={{ marginTop: "6px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
//                 Your customers can now message this number on WhatsApp and your AI agent will automatically reply using the company knowledge base.
//               </p>
//               {status?.phoneNumber && (
//                 <div style={{ marginTop: "12px", background: "var(--surface-2)", borderRadius: "10px", padding: "10px 14px", display: "inline-block" }}>
//                   <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Connected number</p>
//                   <p style={{ fontSize: "1rem", fontWeight: 600, color: "#4ade80", fontFamily: "monospace" }}>+{status.phoneNumber}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             onClick={handleDisconnect} disabled={disconnecting}
//             style={{
//               marginTop: "1.5rem", padding: "9px 20px", borderRadius: "10px",
//               background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
//               cursor: disconnecting ? "not-allowed" : "pointer",
//               fontSize: "0.85rem", color: "rgba(239,68,68,0.8)",
//               transition: "background 0.15s",
//             }}
//             onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
//             onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//           >
//             {disconnecting ? "Disconnecting..." : "Disconnect WhatsApp"}
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* How it works */}
//           <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
//             <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
//               How it works
//             </h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//               {[
//                 { step: "1", text: "Click 'Connect WhatsApp' below" },
//                 { step: "2", text: "A QR code will appear — scan it with your WhatsApp" },
//                 { step: "3", text: "Go to WhatsApp → Settings → Linked Devices → Link a Device" },
//                 { step: "4", text: "Scan the QR code — done!" },
//                 { step: "5", text: "Customers can now message your number — AI will auto-reply" },
//               ].map(item => (
//                 <div key={item.step} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
//                   <div style={{
//                     width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//                     background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: "0.7rem", fontWeight: 700, color: "#4ade80", fontFamily: "Syne, sans-serif",
//                   }}>{item.step}</div>
//                   <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, paddingTop: "2px" }}>{item.text}</p>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={handleConnect} disabled={connecting}
//               style={{
//                 marginTop: "1.5rem", width: "100%", padding: "13px",
//                 border: "none", borderRadius: "12px",
//                 cursor: connecting ? "not-allowed" : "pointer",
//                 background: connecting ? "var(--surface-3)" : "linear-gradient(135deg, #25d366, #128c7e)",
//                 fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
//                 color: connecting ? "var(--text-muted)" : "#fff",
//                 boxShadow: connecting ? "none" : "0 0 24px rgba(37,211,102,0.2)",
//               }}
//             >
//               {connecting ? "Connecting... please wait" : "Connect WhatsApp →"}
//             </button>
//           </div>

//           {/* QR Code */}
//           {qr && (
//             <div style={{ background: "var(--surface-1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "20px", padding: "2rem", textAlign: "center" }}>
//               <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
//                 Scan QR Code
//               </h2>
//               <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
//                 Open WhatsApp → Linked Devices → Link a Device → Scan
//               </p>
//               <div style={{ display: "inline-block", padding: "16px", background: "#fff", borderRadius: "16px" }}>
//                 <img src={qr} alt="WhatsApp QR Code" style={{ width: 220, height: 220, display: "block" }} />
//               </div>
//               <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
//                 QR code refreshes automatically • Do not close this page
//               </p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }





"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type WAStatus = {
  status: 'connecting' | 'connected' | 'disconnected';
  isConnected: boolean;
  phoneNumber: string | null;
  connectedAt: string | null;
};

export default function WhatsAppPage() {
  const params = useParams<{ companyId: string }>();
  const router = useRouter();
  const companyId = params.companyId;

  const [status, setStatus] = useState<WAStatus | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = async () => {
    try {
      const data = await api.getWhatsAppStatus(companyId);
      setStatus(data);
      return data;
    } catch {
      return null;
    }
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const data = await api.getWhatsAppQR(companyId);
        if (data?.qr) {
          setQr(data.qr);
        }
        if (data?.status === 'connected') {
          stopPolling();
          setConnecting(false);
          setQr(null);
          await fetchStatus();
        }
      } catch {
        // ignore polling errors
      }
    }, 2500);
  };

  useEffect(() => {
    fetchStatus().finally(() => setLoading(false));
    return () => stopPolling();
  }, [companyId]);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    setQr(null);
    try {
      await api.connectWhatsApp(companyId);
      // Wait 2s then start polling for QR
      setTimeout(() => startPolling(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp?")) return;
    setDisconnecting(true);
    try {
      await api.disconnectWhatsApp(companyId);
      setStatus(prev => prev ? { ...prev, status: 'disconnected', isConnected: false, phoneNumber: null, connectedAt: null } : null);
      setQr(null);
      setConnecting(false);
      stopPolling();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", padding: "3rem" }}>
      <div style={{ width: 20, height: 20, border: "2px solid var(--surface-4)", borderTopColor: "var(--amber-400)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading...
    </div>
  );

  const isConnected = status?.isConnected || status?.status === 'connected';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber-500)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>Integration</p>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "var(--text-primary)", marginTop: "6px", letterSpacing: "-0.02em" }}>
            WhatsApp Connect
          </h1>
        </div>
        <button
          onClick={() => router.replace(`/dashboard/companies/${companyId}`)}
          style={{ padding: "9px 18px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          ← Back
        </button>
      </div>

      {/* Status badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "14px 18px", borderRadius: "12px",
        background: isConnected ? "rgba(37,211,102,0.08)" : connecting ? "rgba(251,191,36,0.08)" : "var(--surface-2)",
        border: isConnected ? "1px solid rgba(37,211,102,0.2)" : connecting ? "1px solid rgba(251,191,36,0.2)" : "1px solid var(--border)",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: isConnected ? "#25d366" : connecting ? "var(--amber-400)" : "var(--text-muted)",
          animation: connecting ? "pulse 1s infinite" : "none",
        }} />
        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: isConnected ? "#4ade80" : connecting ? "var(--amber-300)" : "var(--text-muted)" }}>
          {isConnected
            ? `Connected${status?.phoneNumber ? ` — +${status.phoneNumber}` : ''}`
            : connecting
              ? qr ? "Scan the QR code below with WhatsApp" : "Generating QR code..."
              : "Not connected"}
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.85rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* QR Code — show whenever qr is available */}
      {qr && !isConnected && (
        <div style={{
          background: "var(--surface-1)", border: "2px solid rgba(37,211,102,0.3)",
          borderRadius: "20px", padding: "2rem", textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
            📱 Scan QR Code
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Open WhatsApp → ⋮ Menu → Linked Devices → Link a Device → Scan
          </p>
          <div style={{ display: "inline-block", padding: "16px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 0 32px rgba(37,211,102,0.15)" }}>
            <img
              src={qr}
              alt="WhatsApp QR Code"
              style={{ width: 240, height: 240, display: "block" }}
            />
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            QR refreshes automatically every 20 seconds
          </p>
        </div>
      )}

      {/* Connecting spinner — show when connecting but no QR yet */}
      {connecting && !qr && !isConnected && (
        <div style={{
          background: "var(--surface-1)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "3rem", textAlign: "center",
        }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--surface-3)", borderTopColor: "#25d366", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Generating QR code... please wait</p>
        </div>
      )}

      {/* Connected state */}
      {isConnected && (
        <div style={{ background: "var(--surface-1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "2rem" }}>✅</span>
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                WhatsApp is active!
              </h2>
              <p style={{ marginTop: "6px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Customers can now message this number. Your AI agent will automatically reply using the company knowledge base.
              </p>
              {status?.phoneNumber && (
                <div style={{ marginTop: "12px", background: "var(--surface-2)", borderRadius: "10px", padding: "10px 14px", display: "inline-block" }}>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Connected number</p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "#4ade80", fontFamily: "monospace" }}>+{status.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleDisconnect} disabled={disconnecting}
            style={{
              marginTop: "1.5rem", padding: "9px 20px", borderRadius: "10px",
              background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
              cursor: disconnecting ? "not-allowed" : "pointer",
              fontSize: "0.85rem", color: "rgba(239,68,68,0.8)", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {disconnecting ? "Disconnecting..." : "Disconnect WhatsApp"}
          </button>
        </div>
      )}

      {/* Not connected — show connect button */}
      {!isConnected && !connecting && (
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
            How to connect
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
            {[
              "Click 'Connect WhatsApp' below",
              "A QR code will appear on screen",
              "Open WhatsApp → ⋮ → Linked Devices → Link a Device",
              "Scan the QR code with your phone",
              "Done! AI will auto-reply to customers",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "#4ade80", fontFamily: "Syne, sans-serif",
                }}>{i + 1}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, paddingTop: "2px" }}>{text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleConnect}
            style={{
              width: "100%", padding: "13px", border: "none", borderRadius: "12px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #25d366, #128c7e)",
              fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff",
              boxShadow: "0 0 24px rgba(37,211,102,0.2)", transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Connect WhatsApp →
          </button>
        </div>
      )}
    </div>
  );
}