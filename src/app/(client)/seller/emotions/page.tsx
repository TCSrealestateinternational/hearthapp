"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { EmotionalCheckIn } from "@/components/shared/EmotionalCheckIn";
import { getEmotionalLogs, createEmotionalLog } from "@/lib/firestore";
import type { EmotionalLog, Mood } from "@/types";

export default function SellerEmotionsPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const sellingTx = transactions.find((t) => t.type === "selling");
  const [history, setHistory] = useState<EmotionalLog[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sellingTx?.id) return;
    getEmotionalLogs(sellingTx.id).then(setHistory);
  }, [sellingTx?.id]);

  async function handleSubmit(mood: Mood, notes: string, prompt: string) {
    if (!sellingTx?.id || !user?.id) return;
    setSaving(true);
    await createEmotionalLog({
      transactionId: sellingTx.id,
      userId: user.id,
      mood,
      notes,
      stage: "Active Listing",
      prompt,
    });
    const updated = await getEmotionalLogs(sellingTx.id);
    setHistory(updated);
    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-text-primary">
        Emotional Check-in
      </h1>
      <EmotionalCheckIn
        stage="Active Listing"
        history={history}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
}
