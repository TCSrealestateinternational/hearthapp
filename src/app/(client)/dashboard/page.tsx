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
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
      <div className="max-w-6xl mx-auto space-y-10">
        <PauseBanner transactionId={primaryTxId} />
        <div className="pl-1 pr-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-none text-on-surface font-serif">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}
          </h1>
          <p className="text-on-surface-variant mt-2">All your transactions in one place.</p>
        </div>
        <UnifiedDashboard
          transactions={transactions}
          agentName={brokerage?.agentName}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Pause banner */}
      <PauseBanner transactionId={primaryTxId} />

      {/* Welcome */}
      <div className="pl-1 pr-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-none text-on-surface font-serif">
          Welcome back, {user?.displayName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-on-surface-variant mt-2">
          Here is your {activeRole === "buyer" ? "buying" : "selling"} overview.
        </p>
      </div>

      {/* Transaction cards */}
      <div className="space-y-4">
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
            ...(hasPermission("property") ? [{ href: "/buyer/properties", icon: <MaterialIcon name="home" size={20} />, label: "Properties" }] : []),
            ...(hasPermission("property") ? [{ href: "/buyer/compare", icon: <MaterialIcon name="search" size={20} />, label: "Compare Homes" }] : []),
            ...(hasPermission("checklist") ? [{ href: "/buyer/checklist", icon: <MaterialIcon name="checklist" size={20} />, label: "Buying Checklist" }] : []),
          ],
        },
        {
          label: "Tools",
          items: [
            ...(hasPermission("finance") ? [{ href: "/finance", icon: <MaterialIcon name="calculate" size={20} />, label: "Calculators" }] : []),
            { href: "/glossary", icon: <MaterialIcon name="menu_book" size={20} />, label: "Glossary" },
          ],
        },
      ]
    : [
        {
          label: "My Sale",
          items: [
            ...(hasPermission("property") ? [{ href: "/seller/listing", icon: <MaterialIcon name="home" size={20} />, label: "My Listing" }] : []),
            ...(hasPermission("offers") ? [{ href: "/seller/offers", icon: <MaterialIcon name="description" size={20} />, label: "Offers" }] : []),
            ...(hasPermission("checklist") ? [{ href: "/seller/checklist", icon: <MaterialIcon name="checklist" size={20} />, label: "Selling Checklist" }] : []),
          ],
        },
        {
          label: "Tools",
          items: [
            ...(hasPermission("finance") ? [{ href: "/finance", icon: <MaterialIcon name="calculate" size={20} />, label: "Calculators" }] : []),
            { href: "/glossary", icon: <MaterialIcon name="menu_book" size={20} />, label: "Glossary" },
          ],
        },
      ];

  // Filter out empty groups
  const groups = allGroups.filter((g) => g.items.length > 0);

  return (
    <div className="bg-surface-container-low rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3">
        <h2 className="text-lg font-semibold text-on-surface font-serif">Quick Menu</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Jump to any section</p>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="mt-2">
          <p className="px-5 sm:px-6 pt-4 pb-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
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
      className="flex items-center gap-4 px-5 sm:px-6 py-3 hover:bg-primary-container transition-colors group"
    >
      <span className="w-11 h-11 rounded-xl bg-primary-container text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1 text-on-surface font-medium">{label}</span>
      {badge !== undefined && (
        <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-error text-white text-xs font-bold px-1.5" aria-hidden="true">
          {badge}
        </span>
      )}
      <MaterialIcon
        name="arrow_forward"
        size={16}
        className="text-on-surface-variant transition-colors group-hover:text-primary"
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
      icon: <MaterialIcon name="description" size={18} />,
      title: "Get pre-approved",
      detail: `${agent} may ask for your pre-approval letter so you're ready to make offers.`,
    },
    {
      icon: <MaterialIcon name="search" size={18} />,
      title: "Share your preferences",
      detail:
        "Let your agent know your price range, must-haves, and preferred neighborhoods.",
    },
    {
      icon: <MaterialIcon name="home" size={18} />,
      title: "Browse properties",
      detail:
        "Start tracking homes you like. You can save and compare them here once your search begins.",
    },
    {
      icon: <MaterialIcon name="menu_book" size={18} />,
      title: "Learn the lingo",
      detail:
        "Check out the Glossary to get comfortable with real estate terms before showings start.",
    },
  ];

  const sellerSteps = [
    {
      icon: <MaterialIcon name="description" size={18} />,
      title: "Gather your documents",
      detail: `${agent} may need your deed, survey, or HOA docs to prepare your listing.`,
    },
    {
      icon: <MaterialIcon name="home" size={18} />,
      title: "Prep your home",
      detail:
        "Small repairs and decluttering go a long way. Your agent can advise on what matters most.",
    },
    {
      icon: <MaterialIcon name="calculate" size={18} />,
      title: "Understand your numbers",
      detail:
        "Use the calculators to estimate your net proceeds and closing costs.",
    },
    {
      icon: <MaterialIcon name="menu_book" size={18} />,
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
          <MaterialIcon name="schedule" size={20} className="text-cta" />
          <p className="text-lg font-bold text-on-surface">
            Waiting on your transaction
          </p>
        </div>
        <p className="text-sm text-on-surface-variant">
          {agent} hasn&apos;t started your {isBuyer ? "buying" : "selling"}{" "}
          transaction yet. In the meantime, here&apos;s how to get ready:
        </p>
      </Card>

      {steps.map((step, i) => (
        <Card key={i} variant="container" className="flex items-start gap-4">
          <span className="mt-0.5 p-2 rounded-xl bg-primary-container text-primary shrink-0">
            {step.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <MaterialIcon name="radio_button_checked" size={14} className="text-on-surface-variant" />
              <p className="font-semibold text-on-surface">{step.title}</p>
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5">{step.detail}</p>
          </div>
        </Card>
      ))}

      <Card variant="container" className="text-center py-6">
        <p className="text-sm text-on-surface-variant">
          Have questions? Send {agent} a message anytime.
        </p>
        <Link href="/messages" className="inline-block mt-3">
          <Button variant="cta" size="sm">
            <MaterialIcon name="chat_bubble" size={16} />
            Message {agent}
          </Button>
        </Link>
      </Card>
    </div>
  );
}

