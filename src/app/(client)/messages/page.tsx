"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { uploadFile } from "@/lib/storage";
import { Card } from "@/components/ui/Card";
import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { messages, loading, send } = useMessages(
    brokerage?.id || "",
    user?.id || "",
    user?.id || ""
  );

  async function handleFileUpload(file: File) {
    if (!brokerage?.id) throw new Error("No brokerage");
    const result = await uploadFile(brokerage.id, "messages", file);
    return { url: result.url, name: file.name };
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
      <h1 className="text-xl font-bold text-text-primary mb-4">Messages</h1>

      <Card padding={false} className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : messages.length > 0 ? (
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

        <MessageInput
          onSend={(text, fileUrl, fileName) =>
            send(text, fileUrl, fileName)
          }
          onFileSelect={handleFileUpload}
        />
      </Card>
    </div>
  );
}
