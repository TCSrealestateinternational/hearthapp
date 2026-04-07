"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getUser, getTransactions, getChecklist, getProperties, updateUser } from "@/lib/firestore";
import { useMessages } from "@/hooks/useMessages";
import { MessageThread } from "@/components/messaging/MessageThread";
import { MessageInput } from "@/components/messaging/MessageInput";
import { MilestoneTimeline } from "@/components/shared/MilestoneTimeline";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { User, Transaction, ChecklistItem, Property } from "@/types";
import { ArrowLeft, Mail, Phone, Home, CheckSquare, FolderOpen, Download } from "lucide-react";
import { exportClientPDF } from "@/lib/exportPdf";
import Link from "next/link";

type Tab = "overview" | "milestones" | "client-view" | "messages";

export default function AgentClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const { user: agentUser } = useAuth();
  const { brokerage } = useBrokerage();
  const [client, setClient] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Client view preview data
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const { messages, send } = useMessages({
    brokerageId: brokerage?.id || "",
    clientId,
    currentUserId: agentUser?.id || "",
    senderRole: "agent",
    senderName: brokerage?.agentName || agentUser?.displayName || "",
  });

  useEffect(() => {
    getUser(clientId).then(setClient);
    if (brokerage?.id) {
      getTransactions(brokerage.id, clientId).then(setTransactions);
    }
  }, [clientId, brokerage?.id]);

  // Load client-view data when that tab is active
  useEffect(() => {
    if (activeTab !== "client-view" || transactions.length === 0) return;
    const tx = transactions[0];
    if (!tx) return;

    getChecklist(tx.id).then((state) => {
      if (state?.items) setChecklistItems(state.items);
    });
    getProperties(tx.id).then(setProperties);
  }, [activeTab, transactions]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeTx = transactions[0];
  const clientRoles = client.roles.filter((r) => r !== "agent");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "milestones", label: "Milestones" },
    { key: "client-view", label: "Client View" },
    { key: "messages", label: "Messages" },
  ];

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
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-base sm:text-lg">
            {client.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-text-primary truncate">
              {client.displayName}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1 truncate">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{client.email}</span>
              </span>
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} className="shrink-0" />
                  {client.phone}
                </span>
              )}
            </div>
            <div className="flex gap-1 mt-1">
              {clientRoles.map((role) => (
                <Badge key={role} variant="primary">
                  {role}
                </Badge>
              ))}
              <Badge variant={client.status === "active" ? "success" : "warning"}>
                {client.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportClientPDF({ user: client, transactions, checklistItems, properties })}
            className="shrink-0 flex items-center gap-1.5"
          >
            <Download size={14} />
            PDF
          </Button>
        </div>
      </Card>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map(({ key, label }) => (
          <Button
            key={key}
            variant={activeTab === key ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab(key)}
            className="shrink-0"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Google Drive link */}
          <Card>
            <CardTitle>
              <FolderOpen size={18} className="inline mr-2" />
              Shared Drive Folder
            </CardTitle>
            <p className="text-xs text-text-secondary mt-1 mb-3">
              Add a Google Drive link so {client.displayName.split(" ")[0]} can access shared photos, videos, or documents.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                defaultValue={client.driveFolderUrl || ""}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val !== (client.driveFolderUrl || "")) {
                    updateUser(clientId, { driveFolderUrl: val || undefined });
                    setClient({ ...client, driveFolderUrl: val || undefined });
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-text-primary text-sm"
              />
              {client.driveFolderUrl && (
                <a
                  href={client.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-primary-light text-primary text-sm font-medium hover:bg-primary-light/80 transition-colors"
                >
                  Open
                </a>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>Transactions</CardTitle>
            {transactions.length > 0 ? (
              <div className="mt-3 space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary-light/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary truncate">
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
      )}

      {/* ── Milestones Tab ── */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          {activeTx ? (
            <MilestoneTimeline transactionId={activeTx.id} />
          ) : (
            <Card>
              <p className="text-sm text-text-secondary text-center py-6">
                No active transaction. Milestones will appear once a transaction is created
                and checklist items are synced from RE Tracker.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* ── Client View Tab (what the client sees) ── */}
      {activeTab === "client-view" && (
        <div className="space-y-4">
          <Card className="border-2 border-dashed border-primary/20">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
              Client View Preview
            </p>
            <p className="text-sm text-text-secondary">
              This is what {client.displayName.split(" ")[0]} sees when they log in to Hearth.
            </p>
          </Card>

          {/* Transaction summary (mirrors client dashboard) */}
          {activeTx ? (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <CardTitle>{activeTx.label}</CardTitle>
                <Badge variant={activeTx.status === "active" ? "success" : "primary"}>
                  {activeTx.status}
                </Badge>
              </div>
              <ProgressBar
                value={
                  checklistItems.length > 0
                    ? Math.round(
                        (checklistItems.filter((i) => i.completed).length /
                          checklistItems.length) *
                          100
                      )
                    : 0
                }
                label="Checklist Progress"
              />
            </Card>
          ) : (
            <Card>
              <div className="text-center py-6">
                <p className="text-text-secondary">
                  No active transaction yet.
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Create a transaction for this client to see their view.
                </p>
              </div>
            </Card>
          )}

          {/* Properties (buyer only) */}
          {clientRoles.includes("buyer") && properties.length > 0 && (
            <Card>
              <CardTitle>
                <Home size={18} className="inline mr-2" />
                Saved Properties ({properties.length})
              </CardTitle>
              <div className="mt-3 space-y-2">
                {properties.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {p.address}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {p.city}, {p.state} {p.zip} &middot; ${p.price.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={p.status === "offer-accepted" ? "success" : "default"}>
                      {p.status}
                    </Badge>
                  </div>
                ))}
                {properties.length > 5 && (
                  <p className="text-xs text-text-secondary text-center">
                    +{properties.length - 5} more properties
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Checklist preview */}
          {checklistItems.length > 0 && (
            <Card>
              <CardTitle>
                <CheckSquare size={18} className="inline mr-2" />
                Checklist
              </CardTitle>
              <div className="mt-3 space-y-1">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      item.completed
                        ? "text-text-secondary line-through"
                        : "text-text-primary"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center text-xs ${
                        item.completed
                          ? "bg-primary text-white border-primary"
                          : "border-border"
                      }`}
                    >
                      {item.completed && "✓"}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Milestones in client view */}
          {activeTx && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Milestone Timeline (visible to client)
              </p>
              <MilestoneTimeline transactionId={activeTx.id} />
            </div>
          )}
        </div>
      )}

      {/* ── Messages Tab ── */}
      {activeTab === "messages" && (
        <Card
          padding={false}
          className="flex flex-col h-[calc(100vh-18rem)] sm:h-[calc(100vh-22rem)]"
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
