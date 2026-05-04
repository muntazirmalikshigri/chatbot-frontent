"use client";

import { useEffect, useMemo, useState } from "react";
import { api, storageKeys } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export function useChat(agentId: string) {
  const sessionKey = useMemo(() => storageKeys.chatSession(agentId), [agentId]);
  const historyKey = useMemo(() => storageKeys.chatMessages(agentId), [agentId]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const storedSession = window.localStorage.getItem(sessionKey);
    const storedMessages = window.localStorage.getItem(historyKey);

    if (storedSession) {
      setSessionId(storedSession);
    }

    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages) as ChatMessage[]);
      } catch {
        window.localStorage.removeItem(historyKey);
      }
    }
  }, [historyKey, sessionKey]);

  useEffect(() => {
    window.localStorage.setItem(historyKey, JSON.stringify(messages));
  }, [historyKey, messages]);

  useEffect(() => {
    if (sessionId) {
      window.localStorage.setItem(sessionKey, sessionId);
    }
  }, [sessionId, sessionKey]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) {
      return;
    }

    const nextMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, nextMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await api.chat(agentId, {
        message: content,
        sessionId: sessionId || undefined,
      });

      if (result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.response,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setSessionId("");
    window.localStorage.removeItem(historyKey);
    window.localStorage.removeItem(sessionKey);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    sendMessage,
    resetChat,
  };
}
