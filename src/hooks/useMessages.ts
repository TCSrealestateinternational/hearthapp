"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendMessage as sendMsg, markMessageRead } from "@/lib/firestore";
import type { Message } from "@/types";

interface UseMessagesOptions {
  brokerageId: string;
  clientId: string;
  currentUserId: string;
  senderRole: "agent" | "client";
  senderName: string;
}

/**
 * Messages are queried by a threadId field that equals the clientId.
 * Both agent and client messages in a thread share the same threadId.
 */
export function useMessages({
  brokerageId,
  clientId,
  currentUserId,
  senderRole,
  senderName,
}: UseMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brokerageId || !clientId) {
      setLoading(false);
      return;
    }

    setError(null);

    const q = query(
      collection(db, "messages"),
      where("brokerageId", "==", brokerageId),
      where("threadId", "==", clientId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const msgs: Message[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt:
              data.createdAt && "toDate" in data.createdAt
                ? data.createdAt.toDate()
                : new Date(),
            readAt:
              data.readAt && "toDate" in data.readAt
                ? data.readAt.toDate()
                : undefined,
          } as Message;
        });
        setMessages(msgs);
        setLoading(false);
      },
      (err) => {
        console.error("Messages query failed:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [brokerageId, clientId]);

  // Auto-mark incoming messages as read
  useEffect(() => {
    if (!currentUserId) return;
    for (const msg of messages) {
      if (msg.senderId !== currentUserId && !msg.readAt) {
        markMessageRead(msg.id);
      }
    }
  }, [messages, currentUserId]);

  const send = useCallback(
    async (text: string, fileUrl?: string, fileName?: string) => {
      if (!brokerageId || !currentUserId) return;
      const msg: Record<string, unknown> = {
        brokerageId,
        threadId: clientId,
        senderId: currentUserId,
        senderName,
        senderRole,
        text,
      };
      if (fileUrl) msg.fileUrl = fileUrl;
      if (fileName) msg.fileName = fileName;
      await sendMsg(msg as Parameters<typeof sendMsg>[0]);
    },
    [brokerageId, clientId, currentUserId, senderName, senderRole]
  );

  const markRead = useCallback(async (messageId: string) => {
    await markMessageRead(messageId);
  }, []);

  const unreadCount = messages.filter(
    (m) => m.senderId !== currentUserId && !m.readAt
  ).length;

  return { messages, loading, error, send, markRead, unreadCount };
}
