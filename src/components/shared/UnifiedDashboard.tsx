"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MilestoneTimeline } from "@/components/shared/MilestoneTimeline";
import { Button } from "@/components/ui/Button";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import type { Transaction } from "@/types";
import {
  Home,
  FileText,
  CheckSquare,
  Calculator,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface UnifiedDashboardProps {
  transactions: Transaction[];
  agentName?: string;
}

export function UnifiedDashboard({ transactions, agentName }: UnifiedDashboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    transactions[0]?.id || null,
  );

  if (transactions.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-secondary">
          No active transactions yet. {agentName || "Your agent"} will set things up when you&apos;re ready.
        </p>
        <Link href="/messages" className="inline-block mt-3">
          <Button variant="cta" size="sm">
            <MessageCircle size={16} />
            Message {agentName?.split(" ")[0] || "Agent"}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">
        All Transactions
      </h2>
      {transactions.map((tx) => (
        <TransactionCard
          key={tx.id}
          transaction={tx}
          expanded={expandedId === tx.id}
          onToggle={() =>
            setExpandedId(expandedId === tx.id ? null : tx.id)
          }
        />
      ))}
    </div>
  );
}

function TransactionCard({
  transaction: tx,
  expanded,
  onToggle,
}: {
  transaction: Transaction;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { hasPermission } = usePermissions(tx.id);
  const isBuying = tx.type === "buying";
  const TypeIcon = isBuying ? ShoppingBag : Home;

  const quickLinks = [
    ...(isBuying
      ? [
          hasPermission("property") && { href: "/buyer/properties", label: "Properties", icon: <Home size={16} /> },
          hasPermission("checklist") && { href: "/buyer/checklist", label: "Checklist", icon: <CheckSquare size={16} /> },
          hasPermission("finance") && { href: "/finance", label: "Calculators", icon: <Calculator size={16} /> },
        ]
      : [
          hasPermission("property") && { href: "/seller/listing", label: "Listing", icon: <Home size={16} /> },
          hasPermission("offers") && { href: "/seller/offers", label: "Offers", icon: <FileText size={16} /> },
          hasPermission("checklist") && { href: "/seller/checklist", label: "Checklist", icon: <CheckSquare size={16} /> },
        ]
    ).filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[],
  ];

  return (
    <Card variant="elevated">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <TypeIcon size={20} />
          </span>
          <div>
            <CardTitle className="text-base">{tx.label}</CardTitle>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={tx.status === "active" ? "success" : "primary"}
              >
                {tx.status}
              </Badge>
              <span className="text-xs text-text-secondary capitalize">
                {tx.type}
              </span>
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-text-secondary" />
        ) : (
          <ChevronDown size={18} className="text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {hasPermission("milestones") && (
            <MilestoneTimeline transactionId={tx.id} />
          )}

          {quickLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                    {link.icon}
                    {link.label}
                    <ArrowRight size={12} />
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
