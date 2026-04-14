"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getAllClients } from "@/lib/firestore";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { Card } from "@/components/ui/Card";
import type { User } from "@/types";
import { MessageCircle, WifiOff } from "lucide-react";

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

  const { messages, error, sendError, send } = useMessages({
    brokerageId: brokerage?.id || "",
    clientId: selectedClientId || "",
    currentUserId: agentUser?.id || "",
    senderRole: "agent",
    senderName: brokerage?.agentName || agentUser?.displayName || "",
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary mb-4">Messages</h1>

      <div className="flex gap-4 h-[calc(100vh-8rem)]">
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
                    <WifiOff size={40} className="mx-auto mb-3 text-red-400" />
                    <p className="text-red-600 font-medium">Unable to load messages</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Please check your connection and try refreshing.
                    </p>
                    <p className="text-xs text-text-secondary mt-2 font-mono bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  </div>
                </div>
              ) : (
                <MessageThread
                  messages={messages}
                  currentUserId={agentUser?.id || ""}
                />
              )}
              {sendError && (
                <div role="alert" className="px-4 py-2 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600 font-medium">
                    Message not sent: {sendError}
                  </p>
                </div>
              )}
              {!error && (
                <MessageInput
                  onSend={(text) => send(text)}
                />
              )}
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
