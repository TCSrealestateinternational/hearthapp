"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Group messages by date
  const grouped: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  for (const msg of messages) {
    const date =
      msg.createdAt instanceof Date
        ? msg.createdAt.toLocaleDateString()
        : "Unknown";
    if (date !== currentDate) {
      currentDate = date;
      grouped.push({ date, messages: [] });
    }
    grouped[grouped.length - 1].messages.push(msg);
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {grouped.map((group) => (
        <div key={group.date}>
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-outline-variant/60" aria-hidden="true" />
            <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-wider">{group.date}</span>
            <div className="flex-1 h-px bg-outline-variant/60" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            {group.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
