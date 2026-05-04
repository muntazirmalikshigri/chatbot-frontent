import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/lib/types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-[28px] px-4 py-3 text-sm leading-6 shadow-lg transition ${
          isUser
            ? "bg-gradient-to-br from-cyan-300 to-cyan-400 text-slate-950"
            : "border border-white/10 bg-slate-950/70 text-slate-100"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <Badge className={isUser ? "border-cyan-300/30 bg-cyan-200/50 text-slate-900" : ""}>
            {isUser ? "You" : "Assistant"}
          </Badge>
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
