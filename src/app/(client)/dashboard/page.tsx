"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { usePermissions } from "@/hooks/usePermissions";
import type { SyncPermissionKey } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MilestoneTimeline } from "@/components/shared/MilestoneTimeline";
import { PauseBanner } from "@/components/shared/PermissionGate";
import { UnifiedDashboard } from "@/components/shared/UnifiedDashboard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Home,
  Calculator,
  CheckSquare,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Search,
  CircleDot,
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
  const primaryTxId = activeTxs[0]?.id;
  const { hasPermission, isPaused } = usePermissions(primaryTxId);
  const isUnified = user?.portalViewPreference === "unified";

  // Unified view: show all transactions at once
  if (isUnified) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <PauseBanner transactionId={primaryTxId} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}
          </h1>
          <p className="text-text-secondary mt-1">All your transactions in one place.</p>
        </div>
        <UnifiedDashboard
          transactions={transactions}
          agentName={brokerage?.agentName}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Pause banner */}
      <PauseBanner transactionId={primaryTxId} />

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
                {hasPermission("milestones") && (
                <MilestoneTimeline transactionId={tx.id} />
              )}
              </Card>
            ))
          ) : (
            <GettingStarted role={activeRole} agentName={brokerage?.agentName} />
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

      {/* Quick menu — Wayfair-style vertical list */}
      <QuickMenu activeRole={activeRole} hasPermission={hasPermission} />
    </div>
  );
}

type MenuItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

function QuickMenu({
  activeRole,
  hasPermission,
}: {
  activeRole: "buyer" | "seller" | undefined;
  hasPermission: (key: SyncPermissionKey) => boolean;
}) {
  const isBuyer = activeRole === "buyer" || !activeRole;

  const allGroups: MenuGroup[] = isBuyer
    ? [
        {
          label: "Explore",
          items: [
            ...(hasPermission("property") ? [{ href: "/buyer/properties", icon: <Home size={20} />, label: "Properties" }] : []),
            ...(hasPermission("property") ? [{ href: "/buyer/compare", icon: <Search size={20} />, label: "Compare Homes" }] : []),
            ...(hasPermission("checklist") ? [{ href: "/buyer/checklist", icon: <CheckSquare size={20} />, label: "Buying Checklist" }] : []),
          ],
        },
        {
          label: "Tools",
          items: [
            ...(hasPermission("finance") ? [{ href: "/finance", icon: <Calculator size={20} />, label: "Calculators" }] : []),
            { href: "/glossary", icon: <BookOpen size={20} />, label: "Glossary" },
          ],
        },
      ]
    : [
        {
          label: "My Sale",
          items: [
            ...(hasPermission("property") ? [{ href: "/seller/listing", icon: <Home size={20} />, label: "My Listing" }] : []),
            ...(hasPermission("offers") ? [{ href: "/seller/offers", icon: <FileText size={20} />, label: "Offers" }] : []),
            ...(hasPermission("checklist") ? [{ href: "/seller/checklist", icon: <CheckSquare size={20} />, label: "Selling Checklist" }] : []),
          ],
        },
        {
          label: "Tools",
          items: [
            ...(hasPermission("finance") ? [{ href: "/finance", icon: <Calculator size={20} />, label: "Calculators" }] : []),
            { href: "/glossary", icon: <BookOpen size={20} />, label: "Glossary" },
          ],
        },
      ];

  // Filter out empty groups
  const groups = allGroups.filter((g) => g.items.length > 0);

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3">
        <h2 className="text-lg font-semibold text-text-primary">Quick Menu</h2>
        <p className="text-sm text-text-secondary mt-0.5">Jump to any section</p>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="border-t border-border">
          <p className="px-5 sm:px-6 pt-4 pb-1 text-xs font-bold uppercase tracking-wider text-text-secondary">
            {group.label}
          </p>
          <div className="pb-2">
            {group.items.map((item) => (
              <MenuRow key={item.href} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuRow({ href, icon, label, badge }: MenuItem) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 sm:px-6 py-3 hover:bg-primary-light transition-colors group"
    >
      <span className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1 text-text-primary font-medium">{label}</span>
      {badge !== undefined && (
        <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-error text-white text-xs font-bold px-1.5" aria-hidden="true">
          {badge}
        </span>
      )}
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="text-text-secondary transition-colors group-hover:text-primary"
      />
    </Link>
  );
}

function GettingStarted({
  role,
  agentName,
}: {
  role: "buyer" | "seller" | undefined;
  agentName: string | undefined;
}) {
  const agent = agentName?.split(" ")[0] || "Your agent";
  const isBuyer = role === "buyer" || !role;

  const buyerSteps = [
    {
      icon: <FileText size={18} />,
      title: "Get pre-approved",
      detail: `${agent} may ask for your pre-approval letter so you're ready to make offers.`,
    },
    {
      icon: <Search size={18} />,
      title: "Share your preferences",
      detail:
        "Let your agent know your price range, must-haves, and preferred neighborhoods.",
    },
    {
      icon: <Home size={18} />,
      title: "Browse properties",
      detail:
        "Start tracking homes you like. You can save and compare them here once your search begins.",
    },
    {
      icon: <BookOpen size={18} />,
      title: "Learn the lingo",
      detail:
        "Check out the Glossary to get comfortable with real estate terms before showings start.",
    },
  ];

  const sellerSteps = [
    {
      icon: <FileText size={18} />,
      title: "Gather your documents",
      detail: `${agent} may need your deed, survey, or HOA docs to prepare your listing.`,
    },
    {
      icon: <Home size={18} />,
      title: "Prep your home",
      detail:
        "Small repairs and decluttering go a long way. Your agent can advise on what matters most.",
    },
    {
      icon: <Calculator size={18} />,
      title: "Understand your numbers",
      detail:
        "Use the calculators to estimate your net proceeds and closing costs.",
    },
    {
      icon: <BookOpen size={18} />,
      title: "Learn the lingo",
      detail:
        "Check out the Glossary so you feel confident reviewing offers and contracts.",
    },
  ];

  const steps = isBuyer ? buyerSteps : sellerSteps;

  return (
    <div className="space-y-4">
      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-1">
          <Clock size={20} className="text-cta" />
          <p className="text-lg font-bold text-text-primary">
            Waiting on your transaction
          </p>
        </div>
        <p className="text-sm text-text-secondary">
          {agent} hasn&apos;t started your {isBuyer ? "buying" : "selling"}{" "}
          transaction yet. In the meantime, here&apos;s how to get ready:
        </p>
      </Card>

      {steps.map((step, i) => (
        <Card key={i} variant="container" className="flex items-start gap-4">
          <span className="mt-0.5 p-2 rounded-xl bg-primary-light text-primary shrink-0">
            {step.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-text-secondary" />
              <p className="font-semibold text-text-primary">{step.title}</p>
            </div>
            <p className="text-sm text-text-secondary mt-0.5">{step.detail}</p>
          </div>
        </Card>
      ))}

      <Card variant="container" className="text-center py-6">
        <p className="text-sm text-text-secondary">
          Have questions? Send {agent} a message anytime.
        </p>
        <Link href="/messages" className="inline-block mt-3">
          <Button variant="cta" size="sm">
            <MessageCircle size={16} />
            Message {agent}
          </Button>
        </Link>
      </Card>
    </div>
  );
}

