"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Home,
  Calculator,
  CheckSquare,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeRole } = useRole(user);
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );

  const activeTxs = transactions.filter(
    (t) => t.type === (activeRole === "buyer" ? "buying" : "selling")
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.displayName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-text-secondary mt-1">
          Here is your {activeRole === "buyer" ? "buying" : "selling"} overview.
        </p>
      </div>

      {/* Transaction cards */}
      {activeTxs.length > 0 ? (
        activeTxs.map((tx) => (
          <Card key={tx.id}>
            <CardHeader>
              <CardTitle>{tx.label}</CardTitle>
              <Badge
                variant={tx.status === "active" ? "success" : "primary"}
              >
                {tx.status}
              </Badge>
            </CardHeader>
            <ProgressBar value={30} label="Progress" className="mb-4" />
          </Card>
        ))
      ) : (
        <Card>
          <div className="text-center py-8">
            <p className="text-text-secondary">
              No active {activeRole === "buyer" ? "buying" : "selling"}{" "}
              transactions yet.
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Your agent will set up your transaction when you are ready.
            </p>
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeRole === "buyer" ? (
            <>
              <QuickAction
                href="/buyer/properties"
                icon={<Home size={20} />}
                label="Properties"
              />
              <QuickAction
                href="/buyer/finance"
                icon={<Calculator size={20} />}
                label="Calculator"
              />
              <QuickAction
                href="/buyer/checklist"
                icon={<CheckSquare size={20} />}
                label="Checklist"
              />
              <QuickAction
                href="/messages"
                icon={<MessageCircle size={20} />}
                label="Messages"
              />
            </>
          ) : (
            <>
              <QuickAction
                href="/seller/listing"
                icon={<Home size={20} />}
                label="My Listing"
              />
              <QuickAction
                href="/seller/offers"
                icon={<Calculator size={20} />}
                label="Offers"
              />
              <QuickAction
                href="/seller/checklist"
                icon={<CheckSquare size={20} />}
                label="Checklist"
              />
              <QuickAction
                href="/messages"
                icon={<MessageCircle size={20} />}
                label="Messages"
              />
            </>
          )}
        </div>
      </div>

      {/* Agent info */}
      {brokerage && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg">
              {brokerage.agentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">
                {brokerage.agentName}
              </p>
              <p className="text-sm text-text-secondary">
                {brokerage.agentTitle}
              </p>
            </div>
            <Link href="/messages">
              <Button variant="secondary" size="sm">
                Message
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex flex-col items-center gap-2 py-4 hover:border-primary/30 transition-colors cursor-pointer">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </Card>
    </Link>
  );
}
