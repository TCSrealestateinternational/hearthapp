"use client";

import type { Message } from "@/types";
import { FileText } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-cta text-white rounded-br-md"
            : "bg-primary text-white rounded-bl-md"
        }`}
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
            <FileText size={12} />
            {message.fileName || "Attachment"}
          </a>
        )}
        <p
          className={`text-[10px] mt-1 ${
            isOwn ? "text-white/60" : "text-white/60"
          }`}
        >
          {message.createdAt instanceof Date
            ? message.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>
    </div>
  );
}
