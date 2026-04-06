"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { Card } from "@/components/ui/Card";
import { MessageCircle, WifiOff } from "lucide-react";

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { brokerage, loading: brokerageLoading } = useBrokerage();
  const { messages, loading, ready, connected, error, sendError, send } = useMessages({
    brokerageId: brokerage?.id || "",
    clientId: user?.id || "",
    currentUserId: user?.id || "",
    senderRole: "client",
    senderName: user?.displayName || "",
  });

  const depsLoading = authLoading || brokerageLoading || loading;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] pb-16 md:pb-0">
      <h1 className="text-xl font-bold text-text-primary mb-4">Messages</h1>

      <Card padding={false} className="flex-1 flex flex-col overflow-hidden">
        {depsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <WifiOff size={40} className="mx-auto mb-3 text-red-400" />
              <p className="text-red-600 font-medium">Unable to load messages</p>
              <p className="text-sm text-text-secondary mt-1 max-w-xs">
                There was a problem connecting to messaging. Please check your
                connection and try refreshing the page.
              </p>
              <p className="text-xs text-text-secondary mt-2 font-mono bg-red-50 p-2 rounded">
                {error}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.length > 0 ? (
              <MessageThread
                messages={messages}
                currentUserId={user?.id || ""}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle
                    size={40}
                    className="mx-auto mb-3 text-text-secondary opacity-50"
                  />
                  <p className="text-text-secondary">No messages yet.</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Send your first message to your agent.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {sendError && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
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
      </Card>
    </div>
  );
}
