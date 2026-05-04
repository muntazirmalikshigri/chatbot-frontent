"use client";

import { useParams } from "next/navigation";
import { ChatBox } from "@/components/chat/chat-box";

export default function AgentTestChatPage() {
  const params = useParams<{ agentId: string }>();

  return (
    <ChatBox
      agentId={params.agentId}
      title="Agent test chat"
      subtitle="Validate behavior before publishing the public chatbot."
    />
  );
}

