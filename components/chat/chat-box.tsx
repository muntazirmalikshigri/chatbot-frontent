"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/lib/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ChatBoxProps = {
  agentId: string;
  title?: string;
  subtitle?: string;
};

export function ChatBox({ agentId, title = "Chat", subtitle }: ChatBoxProps) {
  const { messages, input, setInput, loading, error, sendMessage, resetChat } = useChat(agentId);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <Card
      className="flex min-h-[70vh] flex-col overflow-hidden"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{
          background: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: "linear-gradient(135deg, var(--amber-400), var(--orange-500))",
            }}
          >
            <span className="text-lg" style={{ color: "var(--surface-0)" }}>◉</span>
          </div>
          <div>
            <p className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {subtitle || "Knowledge-aware chat experience"}
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Reset
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div
            className="flex items-center justify-center h-full rounded-2xl border-2 border-dashed px-6 py-16 text-center"
            style={{
              background: "var(--surface-2)",
              borderColor: "rgba(251,191,36,0.2)",
            }}
          >
            <p className="max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
              Start the conversation by sending a message. The assistant will reply using the agent&apos;s knowledge base.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "rounded-br-[6px]"
                    : "rounded-bl-[6px]"
                }`}
                style={{
                  background: message.role === "user"
                    ? "linear-gradient(135deg, var(--amber-500), var(--orange-500))"
                    : "var(--surface-2)",
                  color: message.role === "user" ? "var(--surface-0)" : "var(--text-primary)",
                  border: message.role === "assistant" ? "1px solid var(--border)" : "none",
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-5 py-3 rounded-2xl rounded-bl-[6px]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 rounded-full animate-bounce-dot"
                    style={{
                      backgroundColor: "var(--amber-400)",
                      animationDelay: `${delay}ms`,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div
        className="p-4 border-t"
        style={{
          background: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        {error && (
          <p className="mb-3 text-sm text-left" style={{ color: "#f87171" }}>
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1"
            style={{
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 disabled:opacity-50"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--amber-500), var(--orange-500))",
              color: "var(--surface-0)",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
}
