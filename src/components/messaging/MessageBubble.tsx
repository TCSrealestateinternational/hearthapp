"use client";

import type { Message } from "@/types";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const isPending = message.id.startsWith("pending_");

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-cta text-white rounded-br-md"
            : "bg-primary text-white rounded-bl-md"
        } ${isPending ? "opacity-70" : ""}`}
      >
        {!isOwn && (
          <p className="text-xs font-medium opacity-75 mb-0.5">
            {message.senderName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {message.fileUrl && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 mt-1 text-xs underline opacity-80"
          >
            <MaterialIcon name="description" size={12} />
            {message.fileName || "Attachment"}
          </a>
        )}
        <div className="flex items-center gap-1 mt-1 justify-end">
          <p className="text-[10px] text-white/70">
            {isPending
              ? "Sending..."
              : message.createdAt instanceof Date
                ? message.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
          </p>
          {isOwn && (
            isPending ? (
              <MaterialIcon name="schedule" size={12} className="text-white/60" aria-label="Sending" />
            ) : message.readAt ? (
              <MaterialIcon name="done_all" size={14} className="text-white" aria-label="Read" />
            ) : (
              <MaterialIcon name="check" size={14} className="text-white/80" aria-label="Sent" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
