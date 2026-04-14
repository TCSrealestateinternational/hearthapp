"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { getAllClients, getAllTransactions } from "@/lib/firestore";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CreateClientModal } from "@/components/agent/CreateClientModal";
import Link from "next/link";
import type { User, Transaction } from "@/types";
import { Search, Users, ArrowRight, Plus } from "lucide-react";

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const [clients, setClients] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // Use agent's own brokerageId - more reliable than brokerage slug lookup
  const brokerageId = user?.brokerageId || brokerage?.id;

  const loadData = useCallback(() => {
    if (!brokerageId) return;
    getAllClients(brokerageId).then(setClients);
    getAllTransactions(brokerageId).then(setTransactions);
  }, [brokerageId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredClients = clients.filter((c) =>
    search
      ? c.displayName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const activeCount = transactions.filter((t) => t.status === "active").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
          Welcome back, {user?.displayName?.split(" ")[0]}
        </h1>
        <p className="text-text-secondary mt-1">
          {brokerage?.name} - Agent Dashboard
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-text-secondary">Total Clients</p>
          <p className="text-2xl font-bold text-text-primary">
            {clients.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Active Transactions</p>
          <p className="text-2xl font-bold text-primary">{activeCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Buyers</p>
          <p className="text-2xl font-bold text-text-primary">
            {clients.filter((c) => c.roles.includes("buyer")).length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Sellers</p>
          <p className="text-2xl font-bold text-text-primary">
            {clients.filter((c) => c.roles.includes("seller")).length}
          </p>
        </Card>
      </div>

      {/* Client list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <CardTitle>
                <Users size={20} className="inline mr-2" />
                Clients
              </CardTitle>
              <Button
                variant="cta"
                size="sm"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={16} />
                Add Client
              </Button>
            </div>
            <div className="relative sm:ml-auto">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                aria-label="Search clients by name or email"
                className="pl-9 pr-3 py-1.5 rounded-xl border border-border bg-background text-text-primary text-sm w-full sm:w-48"
              />
            </div>
          </div>
        </CardHeader>

        <div className="space-y-2">
          {filteredClients.map((client) => {
            const clientTxs = transactions.filter(
              (t) => t.clientId === client.id
            );
            return (
              <Link
                key={client.id}
                href={`/agent/clients/${client.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-light/50 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                  {client.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {client.displayName}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {client.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                    <Badge
                      variant={
                        client.status === "active" ? "success" : "warning"
                      }
                    >
                      {client.status === "active" ? "Active" : "Pending"}
                    </Badge>
                    {client.roles
                      .filter((r) => r !== "agent")
                      .map((role) => (
                        <Badge key={role} variant="primary">
                          {role}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      client.status === "active" ? "success" : "warning"
                    }
                  >
                    {client.status === "active" ? "Active" : "Pending"}
                  </Badge>
                  {client.roles
                    .filter((r) => r !== "agent")
                    .map((role) => (
                      <Badge key={role} variant="primary">
                        {role}
                      </Badge>
                    ))}
                  <span className="text-xs text-text-secondary">
                    {clientTxs.length} tx
                  </span>
                </div>
                <ArrowRight size={16} className="text-text-secondary shrink-0" />
              </Link>
            );
          })}
          {filteredClients.length === 0 && (
            <p className="text-center text-text-secondary py-4">
              {search ? "No clients match your search." : "No clients yet."}
            </p>
          )}
        </div>
      </Card>

      <CreateClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        brokerageId={brokerageId || ""}
        onCreated={loadData}
      />
    </div>
  );
}
