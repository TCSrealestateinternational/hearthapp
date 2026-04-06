"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getAllClients } from "@/lib/firestore";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { uploadFile } from "@/lib/storage";
import { Card } from "@/components/ui/Card";
import type { User } from "@/types";
import { MessageCircle } from "lucide-react";

export default function AgentMessagesPage() {
  const { user: agentUser } = useAuth();
  const { brokerage } = useBrokerage();
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    if (!brokerage?.id) return;
    getAllClients(brokerage.id).then(setClients);
  }, [brokerage?.id]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const { messages, error, send } = useMessages({
    brokerageId: brokerage?.id || "",
    clientId: selectedClientId || "",
    currentUserId: agentUser?.id || "",
    senderRole: "agent",
    senderName: brokerage?.agentName || agentUser?.displayName || "",
  });

  async function handleFileUpload(file: File) {
    if (!brokerage?.id) throw new Error("No brokerage");
    const result = await uploadFile(brokerage.id, "messages", file);
    return { url: result.url, name: file.name };
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-text-primary mb-4">Messages</h1>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Thread list */}
        <Card
          padding={false}
          className="w-64 flex-shrink-0 overflow-y-auto hidden sm:block"
        >
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-text-secondary">
              Conversations
            </p>
          </div>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`w-full flex items-center gap-3 p-3 text-left hover:bg-primary-light/50 transition-colors ${
                selectedClientId === client.id ? "bg-primary-light" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-semibold">
                {client.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {client.displayName}
                </p>
              </div>
            </button>
          ))}
          {clients.length === 0 && (
            <p className="p-4 text-sm text-text-secondary text-center">
              No clients yet.
            </p>
          )}
        </Card>

        {/* Message thread */}
        <Card padding={false} className="flex-1 flex flex-col overflow-hidden">
          {selectedClientId ? (
            <>
              {error ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-red-600 font-medium">Unable to load messages</p>
                    <p className="text-sm text-text-secondary mt-1">Please try refreshing the page.</p>
                  </div>
                </div>
              ) : (
                <MessageThread
                  messages={messages}
                  currentUserId={agentUser?.id || ""}
                />
              )}
              <MessageInput
                onSend={(text, fileUrl, fileName) =>
                  send(text, fileUrl, fileName)
                }
                onFileSelect={handleFileUpload}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle
                  size={40}
                  className="mx-auto mb-3 text-text-secondary opacity-50"
                />
                <p className="text-text-secondary">
                  Select a conversation to start messaging.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
