"use client";

import { useState, useCallback, useMemo, Suspense, type ComponentType } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import {
  calculators,
  TAB_META,
  type CalcTab,
  type CalcEntry,
} from "@/components/calculators/calculatorRegistry";
import * as LucideIcons from "lucide-react";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { PermissionGate } from "@/components/shared/PermissionGate";

export default function FinanceHubPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const activeTx = transactions[0];
  const { activeRole } = useRole(user);
  const [activeTab, setActiveTab] = useState<CalcTab | null>(null);
  const [activeCalcId, setActiveCalcId] = useState<string | null>(null);
  const [LoadedComponent, setLoadedComponent] =
    useState<ComponentType | null>(null);

  // Filter tabs visible to this role
  const visibleTabs = useMemo(() => {
    return (Object.entries(TAB_META) as [CalcTab, (typeof TAB_META)[CalcTab]][]).filter(
      ([, meta]) =>
        meta.roles.includes("both") || meta.roles.includes(activeRole)
    );
  }, [activeRole]);

  // Auto-select first visible tab
  const currentTab = activeTab && visibleTabs.some(([t]) => t === activeTab)
    ? activeTab
    : visibleTabs[0]?.[0] ?? "mortgage";

  // Filter calculators for current tab + role
  const visibleCalcs = useMemo(() => {
    return calculators.filter(
      (c) =>
        c.tab === currentTab &&
        (c.role === "both" || c.role === activeRole)
    );
  }, [currentTab, activeRole]);

  const openCalculator = useCallback(async (entry: CalcEntry) => {
    setActiveCalcId(entry.id);
    try {
      const mod = await entry.load();
      const Comp = (mod as Record<string, ComponentType>)[entry.exportName] || mod.default;
      if (Comp) setLoadedComponent(() => Comp);
    } catch {
      setLoadedComponent(null);
    }
  }, []);

  const closeCalculator = useCallback(() => {
    setActiveCalcId(null);
    setLoadedComponent(null);
  }, []);

  return (
    <PermissionGate transactionId={activeTx?.id} permission="finance">
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
        Finance Calculators
      </h1>

      {/* Tab pills — horizontal scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {visibleTabs.map(([tab, meta]) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              closeCalculator();
            }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentTab === tab
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container text-text-secondary hover:bg-surface-container-high"
            }`}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {/* Calculator view or grid */}
      {activeCalcId && LoadedComponent ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={closeCalculator}>
            <ArrowLeft size={16} />
            Back to calculators
          </Button>
          <Suspense
            fallback={
              <div className="text-center py-12 text-text-secondary">
                Loading calculator...
              </div>
            }
          >
            <LoadedComponent />
          </Suspense>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleCalcs.map((calc) => (
            <CalcCard
              key={calc.id}
              calc={calc}
              onClick={() => openCalculator(calc)}
            />
          ))}
        </div>
      )}
    </div>
    </PermissionGate>
  );
}

function CalcCard({
  calc,
  onClick,
}: {
  calc: CalcEntry;
  onClick: () => void;
}) {
  const IconComp = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
    calc.icon
  ];

  return (
    <button onClick={onClick} className="text-left w-full">
      <Card
        variant="container"
        className="h-full flex flex-col gap-2 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
      >
        <span className="p-2 rounded-xl bg-primary-light text-primary w-fit transition-colors group-hover:bg-primary group-hover:text-white">
          {IconComp ? <IconComp size={20} /> : <LucideIcons.Calculator size={20} />}
        </span>
        <p className="text-sm font-semibold text-text-primary leading-tight">
          {calc.name}
        </p>
        <p className="text-xs text-text-secondary leading-snug">
          {calc.description}
        </p>
      </Card>
    </button>
  );
}
