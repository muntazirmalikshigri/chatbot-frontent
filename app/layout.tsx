import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralDesk — AI Chatbot Platform",
  description: "Deploy smart AI agents at scale. Multi-tenant chatbot platform with knowledge-based assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--surface-0)] text-[var(--text-primary)]">{children}</body>
    </html>
  );
}
