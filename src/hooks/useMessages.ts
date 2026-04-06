"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [serverMessages, setServerMessages] = useState<Message[]>([]);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());

  const ready = Boolean(brokerageId && clientId);

  // Merge server messages with pending (optimistic) ones
  const messages = [
    ...serverMessages,
    ...pendingMessages.filter(
      (pm) => !serverMessages.some((sm) => pendingIdsRef.current.has(sm.id))
    ),
  ];

  useEffect(() => {
    if (!brokerageId || !clientId) {
      setServerMessages([]);
      setPendingMessages([]);
      setLoading(false);
      setConnected(false);
      return;
    }

    setLoading(true);
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
        setServerMessages(msgs);
        // Clear any pending messages that now appear in server data
        const serverIds = new Set(msgs.map((m) => m.id));
        setPendingMessages((prev) =>
          prev.filter((pm) => !serverIds.has(pm.id) && !pendingIdsRef.current.has(pm.id))
        );
        setLoading(false);
        setConnected(true);
      },
      (err) => {
        console.error("Messages listener error:", err);
        setError(err.message);
        setLoading(false);
        setConnected(false);
      }
    );

    return unsubscribe;
  }, [brokerageId, clientId]);

  // Auto-mark incoming messages as read
  useEffect(() => {
    if (!currentUserId) return;
    for (const msg of serverMessages) {
      if (msg.senderId !== currentUserId && !msg.readAt) {
        markMessageRead(msg.id);
      }
    }
  }, [serverMessages, currentUserId]);

  const send = useCallback(
    async (text: string, fileUrl?: string, fileName?: string) => {
      if (!brokerageId || !currentUserId) return;
      setSendError(null);

      // Optimistic: immediately show the message in the UI
      const tempId = `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const optimisticMsg: Message = {
        id: tempId,
        brokerageId,
        threadId: clientId,
        senderId: currentUserId,
        senderName,
        senderRole,
        text,
        fileUrl,
        fileName,
        createdAt: new Date(),
      };
      setPendingMessages((prev) => [...prev, optimisticMsg]);

      const msgData: Record<string, unknown> = {
        brokerageId,
        threadId: clientId,
        senderId: currentUserId,
        senderName,
        senderRole,
        text,
      };
      if (fileUrl) msgData.fileUrl = fileUrl;
      if (fileName) msgData.fileName = fileName;

      try {
        const id = await sendMsg(msgData as Parameters<typeof sendMsg>[0]);
        // Track the server ID so we can deduplicate when the snapshot fires
        pendingIdsRef.current.add(id);
        // Remove optimistic message (server version will appear via listener)
        setPendingMessages((prev) => prev.filter((pm) => pm.id !== tempId));
      } catch (err) {
        console.error("Failed to send message:", err);
        // Remove the optimistic message on failure
        setPendingMessages((prev) => prev.filter((pm) => pm.id !== tempId));
        setSendError(
          err instanceof Error ? err.message : "Failed to send message"
        );
      }
    },
    [brokerageId, clientId, currentUserId, senderName, senderRole]
  );

  const markRead = useCallback(async (messageId: string) => {
    await markMessageRead(messageId);
  }, []);

  const unreadCount = serverMessages.filter(
    (m) => m.senderId !== currentUserId && !m.readAt
  ).length;

  return { messages, loading, ready, connected, error, sendError, send, markRead, unreadCount };
}
