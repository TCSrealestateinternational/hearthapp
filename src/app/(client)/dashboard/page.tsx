"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { usePermissions } from "@/hooks/usePermissions";
import { subscribeToMilestones } from "@/lib/firestore";
import type { SyncPermissionKey, Milestone } from "@/types";
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
      <div className="max-w-2xl mx-auto space-y-14">
        <PauseBanner transactionId={primaryTxId} />
        <div className="pl-1 pr-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-none text-on-surface font-serif">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}
          </h1>
          <p className="text-on-surface-variant text-lg mt-2">All your transactions in one place.</p>
        </div>
        <UnifiedDashboard
          transactions={transactions}
          agentName={brokerage?.agentName}
        />
        <EditorialQuote />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-14">
      {/* Pause banner */}
      <PauseBanner transactionId={primaryTxId} />

      {/* Welcome */}
      <div className="pl-1 pr-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-none text-on-surface font-serif">
          Welcome back, {user?.displayName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-on-surface-variant text-lg mt-2">
          Here is your {activeRole === "buyer" ? "buying" : "selling"} overview.
        </p>
      </div>

      {/* Journey Progress Summary (when milestones exist) */}
      {primaryTxId && hasPermission("milestones") && (
        <JourneyProgressSummary transactionId={primaryTxId} />
      )}

      {/* Transaction cards or Getting Started */}
      {activeTxs.length > 0 ? (
        <div className="space-y-4">
          {activeTxs.map((tx) => (
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
          ))}
        </div>
      ) : (
        <GettingStarted role={activeRole} agentName={brokerage?.agentName} />
      )}

      {/* Next Steps — horizontal scroll */}
      <NextSteps activeRole={activeRole} hasPermission={hasPermission} />

      {/* Editorial Quote */}
      <EditorialQuote />
    </div>
  );
}

/* ── Journey Progress Summary ── */

function JourneyProgressSummary({ transactionId }: { transactionId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const unsub = subscribeToMilestones(transactionId, setMilestones);
    return unsub;
  }, [transactionId]);

  if (milestones.length === 0) return null;

  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  // Find current stage: first incomplete milestone's stage
  const currentMilestone = milestones.find((m) => !m.completed);
  const currentStage = currentMilestone?.stage || "Complete";

  return (
    <section className="bg-surface-container-low p-8 rounded-2xl space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-on-surface-variant font-semibold text-xs tracking-widest uppercase">
            Current Milestone
          </p>
          <p className="font-serif text-xl text-primary">{currentStage}</p>
        </div>
        <p className="text-primary font-medium text-sm">{pct}% Complete</p>
      </div>
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </section>
  );
}

/* ── Getting Started — Priority Card ── */

function GettingStarted({
  role,
  agentName,
}: {
  role: "buyer" | "seller" | undefined;
  agentName: string | undefined;
}) {
  const agent = agentName?.split(" ")[0] || "Your agent";
  const isBuyer = role === "buyer" || !role;

  const firstStep = isBuyer
    ? {
        badge: "Priority Task",
        title: "Get pre-approved",
        detail: `${agent} may ask for your pre-approval letter so you're ready to make offers. Securing your financing early gives you the confidence to move quickly.`,
        href: "/finance",
      }
    : {
        badge: "Priority Task",
        title: "Gather your documents",
        detail: `${agent} may need your deed, survey, or HOA docs to prepare your listing. Getting these ready early helps everything move smoothly.`,
        href: "/seller/checklist",
      };

  return (
    <section className="bg-surface-container-highest p-8 rounded-2xl space-y-6">
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold uppercase tracking-wider">
          {firstStep.badge}
        </span>
        <h3 className="font-serif text-3xl text-on-surface">{firstStep.title}</h3>
        <p className="text-on-surface-variant leading-relaxed">{firstStep.detail}</p>
      </div>
      <div className="flex items-center gap-4 pt-2">
        <Link href={firstStep.href}>
          <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center gap-2 hover:opacity-90 transition-opacity">
            Start Now
            <MaterialIcon name="arrow_forward" size={16} />
          </button>
        </Link>
      </div>
    </section>
  );
}

/* ── Next Steps — Horizontal Scroll ── */

type NextStepCard = {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  href: string;
  bg: string;
};

function NextSteps({
  activeRole,
  hasPermission,
}: {
  activeRole: "buyer" | "seller" | undefined;
  hasPermission: (key: SyncPermissionKey) => boolean;
}) {
  const isBuyer = activeRole === "buyer" || !activeRole;

  const allCards: (NextStepCard & { permissionKey?: string })[] = isBuyer
    ? [
        ...(hasPermission("property")
          ? [
              {
                icon: "search",
                iconBg: "bg-primary-container",
                title: "Share Your Preferences",
                description: "Let your agent know your price range, must-haves, and preferred neighborhoods.",
                href: "/buyer/properties",
                bg: "bg-surface-container-low",
              },
              {
                icon: "home",
                iconBg: "bg-primary-container",
                title: "Browse Properties",
                description: "Start tracking homes you like. Save and compare them here once your search begins.",
                href: "/buyer/compare",
                bg: "bg-surface-container-high",
              },
            ]
          : []),
        {
          icon: "menu_book",
          iconBg: "bg-tertiary-container",
          title: "Learn the Lingo",
          description: "Check out the Glossary to get comfortable with real estate terms.",
          href: "/glossary",
          bg: "bg-surface-container-low",
        },
        ...(hasPermission("finance")
          ? [
              {
                icon: "calculate",
                iconBg: "bg-primary-container",
                title: "Calculators",
                description: "Estimate your mortgage, closing costs, and monthly payments.",
                href: "/finance",
                bg: "bg-surface-container-high",
              },
            ]
          : []),
      ]
    : [
        ...(hasPermission("property")
          ? [
              {
                icon: "home",
                iconBg: "bg-primary-container",
                title: "My Listing",
                description: "View and manage your property listing details.",
                href: "/seller/listing",
                bg: "bg-surface-container-low",
              },
            ]
          : []),
        ...(hasPermission("offers")
          ? [
              {
                icon: "description",
                iconBg: "bg-primary-container",
                title: "Review Offers",
                description: "See incoming offers and compare terms side by side.",
                href: "/seller/offers",
                bg: "bg-surface-container-high",
              },
            ]
          : []),
        {
          icon: "menu_book",
          iconBg: "bg-tertiary-container",
          title: "Learn the Lingo",
          description: "Check out the Glossary so you feel confident reviewing offers and contracts.",
          href: "/glossary",
          bg: "bg-surface-container-low",
        },
        ...(hasPermission("finance")
          ? [
              {
                icon: "calculate",
                iconBg: "bg-primary-container",
                title: "Calculators",
                description: "Estimate your net proceeds and closing costs.",
                href: "/finance",
                bg: "bg-surface-container-high",
              },
            ]
          : []),
      ];

  if (allCards.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl text-on-surface">Next Steps</h3>
        <Link href="/buyer/checklist" className="text-primary font-bold text-sm">
          View Journey
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
        {allCards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className={`${i === 0 ? "min-w-[320px]" : "min-w-[264px]"} ${card.bg} p-6 rounded-2xl flex flex-col justify-between aspect-[4/5] hover:opacity-90 transition-opacity shrink-0`}
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                <MaterialIcon name={card.icon} size={24} className="text-primary" />
              </div>
              <h4 className="font-serif text-xl text-on-surface">{card.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{card.description}</p>
            </div>
            <MaterialIcon name="chevron_right" size={24} className="text-primary self-end" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Editorial Quote ── */

function EditorialQuote() {
  return (
    <section className="bg-surface-container-low rounded-2xl py-14 pl-10 pr-16 flex flex-col items-center text-center">
      <MaterialIcon name="format_quote" size={48} className="text-primary/20 mb-4" />
      <p className="font-serif italic text-on-surface-variant text-lg">
        &ldquo;The home should be the treasure chest of living.&rdquo;
      </p>
      <p className="text-tertiary text-xs mt-2 uppercase tracking-widest">
        &mdash; Le Corbusier
      </p>
    </section>
  );
}
