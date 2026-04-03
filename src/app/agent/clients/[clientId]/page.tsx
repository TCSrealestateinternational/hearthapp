"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getUser, getTransactions } from "@/lib/firestore";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { User, Transaction } from "@/types";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function AgentClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const { user: agentUser } = useAuth();
  const { brokerage } = useBrokerage();
  const [client, setClient] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "messages">(
    "overview"
  );

  const { messages, send } = useMessages(
    brokerage?.id || "",
    clientId,
    agentUser?.id || ""
  );

  useEffect(() => {
    getUser(clientId).then(setClient);
    if (brokerage?.id) {
      getTransactions(brokerage.id, clientId).then(setTransactions);
    }
  }, [clientId, brokerage?.id]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link
        href="/agent/dashboard"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Client header */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg">
            {client.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-primary">
              {client.displayName}
            </h1>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {client.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {client.phone}
                </span>
              )}
            </div>
            <div className="flex gap-1 mt-1">
              {client.roles
                .filter((r) => r !== "agent")
                .map((role) => (
                  <Badge key={role} variant="primary">
                    {role}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "overview" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "messages" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </Button>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-4">
          <Card>
            <CardTitle>Transactions</CardTitle>
            {transactions.length > 0 ? (
              <div className="mt-3 space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary-light/30"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        {tx.label}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {tx.type}
                      </p>
                    </div>
                    <Badge
                      variant={
                        tx.status === "active" ? "success" : "default"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary mt-2">
                No transactions yet.
              </p>
            )}
          </Card>
        </div>
      ) : (
        <Card
          padding={false}
          className="flex flex-col h-[calc(100vh-22rem)]"
        >
          <MessageThread
            messages={messages}
            currentUserId={agentUser?.id || ""}
          />
          <MessageInput
            onSend={(text, fileUrl, fileName) =>
              send(text, fileUrl, fileName)
            }
          />
        </Card>
      )}
    </div>
  );
}
