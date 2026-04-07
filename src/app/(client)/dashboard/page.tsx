"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MilestoneTimeline } from "@/components/shared/MilestoneTimeline";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Home,
  Calculator,
  CheckSquare,
  MessageCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeRole } = useRole(user);
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const { unreadCount } = useMessages({
    brokerageId: brokerage?.id || "",
    clientId: user?.id || "",
    currentUserId: user?.id || "",
    senderRole: "client",
    senderName: user?.displayName || "",
  });

  const activeTxs = transactions.filter(
    (t) => t.type === (activeRole === "buyer" ? "buying" : "selling")
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          Welcome back, {user?.displayName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-text-secondary mt-1">
          Here is your {activeRole === "buyer" ? "buying" : "selling"} overview.
        </p>
      </div>

      {/* Bento grid — transaction + agent card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Transaction cards — span 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {activeTxs.length > 0 ? (
            activeTxs.map((tx) => (
              <Card key={tx.id} variant="elevated">
                <CardHeader>
                  <CardTitle>{tx.label}</CardTitle>
                  <Badge
                    variant={tx.status === "active" ? "success" : "primary"}
                  >
                    {tx.status}
                  </Badge>
                </CardHeader>
                <MilestoneTimeline transactionId={tx.id} />
              </Card>
            ))
          ) : (
            <Card variant="elevated">
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
        </div>

        {/* Agent info — span 4 cols */}
        {brokerage && (
          <div className="lg:col-span-4">
            <Card variant="container">
              <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg">
                  {brokerage.agentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {brokerage.agentName}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {brokerage.agentTitle}
                  </p>
                </div>
                <Link href="/messages" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    Message
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Quick actions — 3 cols each in bento style */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
                badge={unreadCount > 0 ? unreadCount : undefined}
              />
              <QuickAction
                href="/glossary"
                icon={<BookOpen size={20} />}
                label="Glossary"
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
                badge={unreadCount > 0 ? unreadCount : undefined}
              />
              <QuickAction
                href="/glossary"
                icon={<BookOpen size={20} />}
                label="Glossary"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link href={href}>
      <Card
        variant="container"
        className="relative flex flex-col items-center gap-2 py-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
      >
        <span className="p-2 rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          {icon}
        </span>
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {badge !== undefined && (
          <span className="absolute top-2 right-2 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-error text-white text-xs font-bold px-1.5">
            {badge}
          </span>
        )}
      </Card>
    </Link>
  );
}
