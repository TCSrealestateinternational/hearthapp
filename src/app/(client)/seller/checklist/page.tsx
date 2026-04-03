"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { SellerChecklist } from "@/components/seller/SellerChecklist";
import { SELLER_CHECKLIST_TEMPLATE } from "@/constants/checklist-seller";
import { getChecklist, saveChecklist } from "@/lib/firestore";
import type { ChecklistItem } from "@/types";

export default function SellerChecklistPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const sellingTx = transactions.find((t) => t.type === "selling");
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (!sellingTx?.id) {
      setItems(
        SELLER_CHECKLIST_TEMPLATE.map((t) => ({
          ...t,
          completed: false,
        }))
      );
      return;
    }

    getChecklist(sellingTx.id).then((state) => {
      if (state?.items) {
        setItems(state.items);
      } else {
        setItems(
          SELLER_CHECKLIST_TEMPLATE.map((t) => ({
            ...t,
            completed: false,
          }))
        );
      }
    });
  }, [sellingTx?.id]);

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

    if (sellingTx?.id) {
      await saveChecklist(sellingTx.id, {
        transactionId: sellingTx.id,
        items: updated,
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-text-primary">Seller Checklist</h1>
      <SellerChecklist items={items} onToggle={handleToggle} />
    </div>
  );
}
