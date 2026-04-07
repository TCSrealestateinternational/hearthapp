"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { BuyerChecklist } from "@/components/buyer/BuyerChecklist";
import { BUYER_CHECKLIST_TEMPLATE } from "@/constants/checklist-buyer";
import { getChecklist, saveChecklist } from "@/lib/firestore";
import type { ChecklistItem } from "@/types";

export default function BuyerChecklistPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (!buyingTx?.id) {
      // Initialize from template
      setItems(
        BUYER_CHECKLIST_TEMPLATE.map((t) => ({
          ...t,
          completed: false,
        }))
      );
      return;
    }

    getChecklist(buyingTx.id).then((state) => {
      if (state?.items) {
        setItems(state.items);
      } else {
        setItems(
          BUYER_CHECKLIST_TEMPLATE.map((t) => ({
            ...t,
            completed: false,
          }))
        );
      }
    });
  }, [buyingTx?.id]);

  async function handleToggle(id: string, completed: boolean) {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            completed,
            completedAt: completed ? new Date() : undefined,
            completedBy: completed ? user?.id : undefined,
          }
        : item
    );
    setItems(updated);

    if (buyingTx?.id) {
      await saveChecklist(buyingTx.id, {
        transactionId: buyingTx.id,
        items: updated,
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">Buyer Checklist</h1>
      <BuyerChecklist items={items} onToggle={handleToggle} />
    </div>
  );
}
